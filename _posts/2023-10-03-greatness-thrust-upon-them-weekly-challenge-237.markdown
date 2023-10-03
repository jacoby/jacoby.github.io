---
layout: post
title:  "Greatness Thrust Upon Them: Weekly Challenge #237"
author: "Dave Jacoby"
date:   "2023-10-03 12:30:32 -0400"
categories: ""
---

Welcome to [Weekly Challenge #237!](https://theweeklychallenge.org/blog/perl-weekly-challenge-237/) The first thing I see in Google is that 237 is an **Angel Number**, but that seems to be simply relate to [spiritual awakening and enlightenment.](https://www.astrology.com/numerology/angel-numbers/237-meaning) I try to not yuck someone else's yum, but I have no use for that. I kinda wish that "Angel Numbers" get chosen as a real number theory thing, just to confuse things. They have done that with [Lucky Numbers](https://en.wikipedia.org/wiki/Lucky_number), and **237** is a Lucky number. Win!

### Task 1: Seize The Day
>
> Submitted by: Mark Anderson  
> Given a year, a month, a weekday of month, and a day of week (1 (Mon) .. 7 (Sun)), print the day.  

#### Let's Talk About It

It's dealing with dates.

[Do Not Write Your Own Date and Time Manipulation Code!](https://presentations.houseabsolute.com/a-date-with-perl/#3)

Instead, we use [DateTime](https://metacpan.org/pod/DateTime) and thank House Absolute for the privilege.

I start with objectified data, because it's always acceptable to objectify data. Each object has `Year`, `Month`, `Weekday_of_month` (which is slightly inaccurate, but okay), and `day_of_week`, and I took that capitalization from the task. I always like "we know it's the right value because the object tells us it is, not because it's the third value in the array", but you do you.

I tend to do `DateTime->now` instead of `DateTime->new` because that fills in a lot of things I don't want to care about, so I can specify what I need and let it handle the rest, and I need the month and year to be set as given, and day to be set for 1. We then test, with day of week, with 1 being "Monday" and 7 being "Sunday", by going through all the choices until we hit to what we want, then return. In the end case, we return 0 to indicate there is no desired date.

Beyond that, I made some formatting changes because I think they're more readable.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use DateTime;

my @examples = (

    { Year => 2024, Month => 4,  Weekday_of_month => 3, day_of_week => 2 },
    { Year => 2025, Month => 10, Weekday_of_month => 2, day_of_week => 4 },
    { Year => 2026, Month => 8,  Weekday_of_month => 5, day_of_week => 3 },
);

for my $e (@examples) {
    my $output = seize_the_day($e);
    say <<~"END";
    Input:  Year             = $e->{Year}, 
            Month            = $e->{Month}, 
            Weekday of month = $e->{Weekday_of_month}, 
            Day of week      = $e->{day_of_week}
    Output: $output
    END
}

sub seize_the_day ($day) {
    my $dt =
        DateTime->now->set_year( $day->{Year} )->set_month( $day->{Month} )
        ->set_day(1);
    my $c = 0;
    while ( $dt->month == $day->{Month} ) {
        $c++ if $dt->day_of_week == $day->{day_of_week};
        return $dt->day
            if $dt->day_of_week == $day->{day_of_week}
            and $c == $day->{Weekday_of_month};
        $dt->add( days => 1 );
    }
    return 0;
}
```

```text
$ ./ch-1.pl 
Input:  Year             = 2024, 
        Month            = 4, 
        Weekday of month = 3, 
        Day of week      = 2
Output: 16

Input:  Year             = 2025, 
        Month            = 10, 
        Weekday of month = 2, 
        Day of week      = 4
Output: 9

Input:  Year             = 2026, 
        Month            = 8, 
        Weekday of month = 5, 
        Day of week      = 3
Output: 0
```

### Task 2: Maximise Greatness
>
> Submitted by: Mohammad S Anwar  
> You are given an array of integers.  
>
> Write a script to permute the give array such that you get the maximum possible greatness.  
>
> To determine greatness, `nums[i] < perm[i]` where `0 <= i < nums.length`

#### Let's Talk About It

I did not understand this at first pass, and had to sleep on it and ask the Perl Applications and Algorithms Discord before I got it. I thought there was some ill-defined calculation I had to figure out and put into `perm()`  instead of comparing the original to the permutation. Silly me.

For permutations, I generally go to the non-Core [Algorithm::Permute](https://metacpan.org/pod/Algorithm::Permute) module, which gives us a permutation generator which we stick in a while loop.

(It is interesting when you develop a go-to permutation module. I guess I *have* reached that stage in life.)

Once we have a `@perm` to compare with `@nums`, I go with `sum0` from [List::Util](https://metacpan.org/pod/List::Util) (and not `sum`, because I'll try to be sure that I give it `0` and not `null`, but I don't want it to explode when I don't), and `map { $nums[$_] < $perm[$_] ? 1 : 0 } 0 .. -1 + scalar @nums` to do the actual comparisons.

The examples given show front-weighted greater permutations, meaning the greater values are in indexes, but I don't believe they have to be.

After that, we pull the maximum. I could hold every value and take `max` from List::Util, but why? I use a ternary instead.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use Algorithm::Permute;
use List::Util qw{ sum0 };

my @examples = (

    [ 1, 1, 1, 1, 1 ],
    [ 1, 3, 5, 2, 1, 3, 1 ],
    [ 1, 2, 3, 4 ],
);

for my $e (@examples) {
    my @nums   = $e->@*;
    my $nums   = join ', ', @nums;
    my $output = maximise_greatness(@nums);
    say <<~"END";
    Input:  \@nums = 
        ($nums)
    Output: $output
    END
}

sub maximise_greatness (@nums) {
    my $max = 0;
    my $top = -1 + scalar @nums;
    my $copy;
    $copy->@* = @nums;
    my $p = Algorithm::Permute->new($copy);
    while ( my @perm = $p->next ) {
        my $great = sum0 map { $nums[$_] < $perm[$_] ? 1 : 0 } 0 .. $top;
        $max = $great > $max ? $great : $max;
    }
    return $max;
}
```

```text
$ ./ch-2.pl 
Input:  @nums = 
    (1, 1, 1, 1, 1)
Output: 0

Input:  @nums = 
    (1, 3, 5, 2, 1, 3, 1)
Output: 4

Input:  @nums = 
    (1, 2, 3, 4)
Output: 3
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
