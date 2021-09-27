---
layout: post
title: "Dates(!) and Hashes(?) and Names, Oh My!!: The Weekly Challenge #132"
author: "Dave Jacoby"
date: "2021-09-27 17:50:50 -0400"
categories: ""
---

[Weekly Challenge 12*11!](https://theweeklychallenge.org/blog/perl-weekly-challenge-132/)

### TASK #1 › Mirror Dates

> Submitted by: Mark Anderson  
> You are given a date (yyyy/mm/dd).
>
> Assuming, the given date is your date of birth. Write a script to find the mirror dates of the given date.
>
> Dave Cross has built cool site that does something similar.

So, the steps are:

- Find the number of days between then and now
- Count back that many days from then
- Count forward that many days from now

Before we start getting _too_ clever on implmentation details, let me quote at length from [Lord Dave Rolsky of House Absolute](https://presentations.houseabsolute.com/a-date-with-perl/#3):

> Do Not Write Your Own Date and Time Manipulation Code!  
> _Do Not Write Your Own Date and Time Manipulation Code!_  
> **Do Not Write Your Own Date and Time Manipulation Code!**  
> _**Do Not Write Your Own Date and Time Manipulation Code!**_

In our case, we have been gifted [DateTime](https://metacpan.org/pod/DateTime), which allows us to rethink the previous step list as:

- `my $delta = $now->delta_days($then)->in_units("days")`
- `$then->subtract( days => $diff )`
- `$now->add( days => $diff )`

I take a few more steps — What's now? When was then? Do we want to modify now and then? How do we easily format dates correctly? — but that's the important parts. I reiterate a few of the points and go into further detail on DateTime below, but that's the core part of it.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures };
no warnings qw{ experimental };

# Do Not Write Your Own Date and Time Manipulation Code!
# Do Not Write Your Own Date and Time Manipulation Code!
# Do Not Write Your Own Date and Time Manipulation Code!
# Do Not Write Your Own Date and Time Manipulation Code!
# Do Not Write Your Own Date and Time Manipulation Code!
use DateTime;

my @examples;
push @examples, '2021/09/18';
push @examples, '1975/10/10';
push @examples, '1967/07/08';
push @examples, '1970/01/01';

for my $input (@examples) {
my $output=    mirror_dates($input);
    say <<"END";
        Input:  $input
        Output: $output
END
}

# takes the date as a string, in the ONE TRUE FORMAT: YYYY/MM/DD
# That makes the epoch 1970/01/01
# The program CAN handle non-padded days and months, but when you're
# dealling with a LOT of dates, non-zero,padding makes you wonder if
# 1970123 is Jan 23 or Dec 3.
sub mirror_dates ( $date_str ) {

    # The default time zone for new DateTime objects, except where stated
    # otherwise, is the "floating" time zone. This concept comes from the
    # iCal standard. A floating datetime is one which is not anchored to
    # any particular time zone. In addition, floating datetimes do not
    # include leap seconds, since we cannot apply them without knowing the
    # datetime's time zone.
    my $now = DateTime->now()->set_time_zone('floating');

    my ( $y, $m, $d ) = split m{/}, $date_str;
    my $then = DateTime->new(
        year      => $y,
        month     => $m,
        day       => $d,
        time_zone => 'floating'
    );

    # the time difference between now and then, expressed in days
    my $diff   = $now->delta_days($then)->in_units('days');

    # add and subtract in a DateTime context act on the object, which
    # isn't the result I would expect from $semi_numerical_thing->add(number)
    # so we clone it and modify the clone.
    # I mean, we COULD, but for testing, I was printing now and then as well
    # as past and future, just to be sure I was right.
    my $past   = $then->clone;
    $past->subtract( days => $diff );

    my $future = $now->clone;
    $future->add( days => $diff );

    return join ', ', $future->ymd, $past->ymd;
}
```

```text

        Input:  2021/09/18
        Output: 2021-10-06, 2021-09-09

        Input:  1975/10/10
        Output: 2067-09-15, 1929-10-22

        Input:  1967/07/08
        Output: 2075-12-18, 1913-04-17

        Input:  1970/01/01
        Output: 2073-06-23, 1918-04-07
```

### TASK #2 › Hash Join

> Submitted by: Mohammad S Anwar  
> Write a script to implement Hash Join algorithm as suggested by wikipedia.

```
1. For each tuple r in the build input R`
   1.1 Add r to the in-memory hash table`
   1.2 If the size of the hash table equals the maximum in-memory size:`
   1.2.1 Scan the probe input S, and add matching join tuples to the output relation`
   1.2.2 Reset the hash table, and continue scanning the build input R`
2. Do a final scan of the probe input S and add the resulting join tuples to the output relation`
```

I'm very Hrmm about it. Let's look at the example data given.

```perl
    @player_ages = (
        [20, "Alex"  ],
        [28, "Joe"   ],
        [38, "Mike"  ],
        [18, "Alex"  ],
        [25, "David" ],
        [18, "Simon" ],
    );

    @player_names = (
        ["Alex", "Stewart"],
        ["Joe",  "Root"   ],
        ["Mike", "Gatting"],
        ["Joe",  "Blog"   ],
        ["Alex", "Jones"  ],
        ["Simon","Duane"  ],
    );
```

First names are _horrible_ keys. Trust me, a person who has been the fifth "Dave" in the room. One of my friends in college took on "Dave 2" just to allow us to be easily disambiguated. Ages are _worse_; in any classroom, from kindergarden to college, most everyone will be within 365 days of your age, unless you or they are an extreme outlier.

So, here, we're seeing a couple of Alexes and a few Joes. We have a David, but he's got no last name, so he's bounced (!), all the Joes are the same age, and there are two Alexes, distinguished by age and last name, _but_ we have no indication of which name goes to which age, so we create two fake Alexes.

Read [Falsehoods Programmers Believe About Names](https://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/) for more information.

I mean, I came out with output that matches the example, but _dang_ this is dirty data!

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures };
no warnings qw{ experimental };

my @player_ages = (
    [ 20, "Alex" ],
    [ 28, "Joe" ],
    [ 38, "Mike" ],
    [ 18, "Alex" ],
    [ 25, "David" ],
    [ 18, "Simon" ],
);

my @player_names = (
    [ "Alex",  "Stewart" ],
    [ "Joe",   "Root" ],
    [ "Mike",  "Gatting" ],
    [ "Joe",   "Blog" ],
    [ "Alex",  "Jones" ],
    [ "Simon", "Duane" ],
);

say join "\n", hash_join( \@player_ages, \@player_names );

sub hash_join ( $array1, $array2 ) {
    my @output;
    my $hash = {};
    for my $e ( $array1->@* ) {
        my ( $age, $firstname ) = $e->@*;
        push $hash->{$firstname}->{age}->@*, $age;
    }
    for my $e ( $array2->@* ) {
        my ( $firstname, $lastname ) = $e->@*;
        push $hash->{$firstname}->{lastname}->@*, $lastname;
    }
    for my $firstname ( sort keys $hash->%* ) {
        next unless defined $hash->{$firstname}{age};
        next unless defined $hash->{$firstname}{lastname};
        my @ages      = $hash->{$firstname}{age}->@*;
        my @lastnames = $hash->{$firstname}{lastname}->@*;

        for my $age ( reverse sort @ages ) {
            for my $lastname ( reverse sort @lastnames ) {
                push @output, join ",\t", '   ' . $age, $firstname, $lastname;
            }
        }
    }
    return join "\n", @output;
}
```

```text
   20,  Alex,   Stewart
   20,  Alex,   Jones
   18,  Alex,   Stewart
   18,  Alex,   Jones
   28,  Joe,    Root
   28,  Joe,    Blog
   38,  Mike,   Gatting
   18,  Simon,  Duane
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
