---
layout: post
title: "2020 Was A LONG Year: The Weekly Challenge #137"
author: "Dave Jacoby"
date: "2021-11-01 15:37:21 -0400"
categories: ""
---

[Another week, another set of challenges!](https://theweeklychallenge.org/blog/perl-weekly-challenge-137/)

### TASK #1 › Long Year

> Submitted by: Mohammad S Anwar  
> Write a script to find all the years between 1900 and 2100 which is a Long Year.
>
> A year is Long if it has 53 weeks.

This takes some unpacking. I bumped into this earlier and boggled a bit before getting it into my head.

So, there's a disconnect between the concept of _weeks_ and _years_. Weeks start on Monday; that's when you go back to work/school. (I'm a developer in the US; your calendar may vary.) Years start whenever they start; any day of the week is possible. That and leap years are what keep the calendar business going. (As well as pictures of cats and dogs and pretty people, I suppose.)

So, when January 1 is a Monday, the start of the week and the start of the year line up, and the last day of the year is in the 52nd week.

If, instead, the year starts on Tuesday, that we start counting the weeks of the new year on the last day of the old one. I've made this helpful chart.

**For every possible December 31:**

| Is Leap Year | Day of Week  | Week of Year |
| ------------ | ------------ | ------------ |
| no           | Monday       | 1            |
| no           | Tuesday      | 1            |
| no           | Wednesday    | 1            |
| **no**       | **Thursday** | **53**       |
| no           | Friday       | 52           |
| no           | Saturday     | 52           |
| no           | Sunday       | 52           |
| yes          | Monday       | 1            |
| yes          | Tuesday      | 1            |
| yes          | Wednesday    | 1            |
| **yes**      | **Thursday** | **53**       |
| **yes**      | **Friday**   | **53**       |
| yes          | Saturday     | 52           |
| yes          | Sunday       | 52           |

So, you notice that, when the last day of the year is on Thursday, or on a leap-year Friday, it will be part of a 53rd week. A _Long Year_.

This is what we're hunting for.

Again, because I have been warned to not write my own Date and Time Manipulation Code(!), I am not going to do that. I'm going to use [DateTime](https://metacpan.org/pod/DateTime). I make a new DateTime object for December 31 for every year and test what week it is (it's a standard method of a DateTime object.) This is my code; this is what I'll submit, _but_ honestly, I just need two pieces of information about Jan 1 to tell you about Dec 31 and if it's a Long Year.

| Leap Year? | Jan 1         | Dec 31       | Long Year? |
| ---------- | ------------- | ------------ | ---------- |
| no         | Monday        | Monday       | no         |
| no         | Tuesday       | Tuesday      | no         |
| no         | Wednesday     | Wednesday    | no         |
| **no**     | **Thursday**  | **Thursday** | **yes**    |
| no         | Friday        | Friday       | no         |
| no         | Saturday      | Saturday     | no         |
| no         | Sunday        | Sunday       | no         |
| yes        | Monday        | Tuesday      | no         |
| yes        | Tuesday       | Wednesday    | no         |
| **yes**    | **Wednesday** | **Thursday** | **yes**    |
| **yes**    | **Thursday**  | **Friday**   | **yes**    |
| yes        | Friday        | Saturday     | no         |
| yes        | Saturday      | Sunday       | no         |
| yes        | Sunday        | Monday       | no         |

We're given a list to compare against, and you can see below that I generate the right entries (and format as expected).

You might _also_ notice that **2020** _was_ a Long Year. 2021 just _feels_ long, then.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say state postderef signatures };
no warnings qw{ experimental };

use DateTime;

# This table shows how this will work for any given year
#
# dow  => day of week (numerical)
# leap => is a leap year (bool)
# woy  => week of year (1, 52, 53)
#
#      dow     leap    woy      day
#   ---------------------------------------
#       1       0       1       Monday
#       1       1       1       Monday
#       2       0       1       Tuesday
#       2       1       1       Tuesday
#       3       0       1       Wednesday
#       3       1       1       Wednesday
#       4       0       53      Thursday
#       4       1       53      Thursday
#       5       0       52      Friday
#       5       1       53      Friday
#       6       0       52      Saturday
#       6       1       52      Saturday
#       7       0       52      Sunday
#       7       1       52      Sunday

my @years;
for my $year ( 1900 .. 2100 ) {
    my $dt = DateTime->new(
        month => 12,
        day   => 31,
        year  => $year,
    );
    my ( undef, $week_of_year ) = $dt->week;
    my $dow     = $dt->day_of_week;
    my $nam     = $dt->day_name;
    my $is_leap = $dt->is_leap_year;
    push @years, $year if $week_of_year == 53;
}

my @x;
while (@years) {
    push @x, shift @years;
    if ( scalar @x == 5 ) {
        say join ', ', @x, '';
        @x = ();
    }
}

say join ', ', @x;
```

```text
1903, 1908, 1914, 1920, 1925,
1931, 1936, 1942, 1948, 1953,
1959, 1964, 1970, 1976, 1981,
1987, 1992, 1998, 2004, 2009,
2015, 2020, 2026, 2032, 2037,
2043, 2048, 2054, 2060, 2065,
2071, 2076, 2082, 2088, 2093,
2099
```

### TASK #2 › Lychrel Number

> Submitted by: Mohammad S Anwar
> You are given a number, 10 <= $n <= 1000.
>
> Write a script to find out if the given number is Lychrel number. To keep the task simple, we impose the following rules:
>
> a. Stop if the number of iterations reached 500.
> b. Stop if you end up with number >= 10_000_000.
>
> According to [Wikipedia](https://en.wikipedia.org/wiki/Lychrel_number):
>
> > A Lychrel number is a natural number that cannot form a palindrome through the iterative process of repeatedly reversing its digits and adding the resulting numbers.

I think most of the parts have been covered previously. Perl's numbers are also strings, depending on context — I've driven C devs to _anger_ with `'29 Palms' + 1 == 30` — so getting the reverse is as simple as splitting on character division, reversing and rejoining.

The difficulty is with size. Consider 79.

- **79** reversed is **97**. Sum is **176**.
- **847** reversed is **748**. Sum is **1595**.
- **1595** reversed is **5951**. Sum is **7546**.
- **7546** reversed is **6457**. Sum is **14003**.
- **14003** reversed is **30041**. Sum is **44044**.

Here, the jump from two digits to five is five steps. We're instructed that, if we don't find it in 500, that's a _Lychrel humber_. So when we go down that rabbit hole, the integers can get big. So, let's use [Math::BigInt](https://metacpan.org/pod/Math::BigInt)!

I almost _never_ have to deal with numbers bigger than the double float that all Perl numbers are by default. It's good to know that, when you catch a problem, you can grab BigInt or BigFloat, because Perl will treat long numbers as strings until you start doing short-number math on them.

(I have a story about when I found a similar problem in a major code editor. I haven't blogged it, because I want to be able to tell the story as a Lightning Talk, and to boggle minds in person.)

My personal additions are using Getopt::Long (the Best Practices choice for getting options) to allow `--number` to allow specific numbers to test. Without and we get the whole `10..1000` range. I also add a `--lychrel` flag that _only_ displays output when the number in question _is_ a Lychrel number, and using that, I can inform you that the numbers in-range that pass are 196, 295, 394, 493, 592, 689, 691, 788, 790, 879, 887, 978, and 986.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use Math::BigInt;
use Getopt::Long;
use List::Util qw{uniq};

my @examples;
my @numbers;
my $lychrel = 0;
GetOptions(
    'number=i' => \@numbers,
    'lychrel'  => \$lychrel,
);

if ( scalar @numbers ) {
    @examples = uniq sort { $a <=> $b } @numbers;
}
else { @examples = ( 10 .. 1000 ); }

for my $e (@examples) {
    my $l = is_lychrel($e);
    next if !$l && $lychrel;
    say <<"END";
        Input:  \$n = $e
        Output: $l
END
}

exit;

sub is_lychrel($e) {
    my $n = $e;
    my $c = 0;
    while ( !is_palindrome($n) ) {
        $n = lychrel($n);
        $c++;
        return 1 if $c >= 500;
    }
    return 0;
}

sub lychrel( $n ) {
    my $bign = Math::BigInt->new($n);
    my $u    = join '', reverse split //, $n;
    my $bigu = Math::BigInt->new($u);
    my $new  = $bign->badd($bigu);
    return $new;
}

sub is_palindrome ($n) {
    my $u = join '', reverse split //, $n;
    $u =~ s/^0+//mix;
    return $u eq $n ? 1 : 0;
}
```

```text
$ ./ch-2.pl -n 56 -n 57 -n 59 -n 60 -n 79 -n 196
        Input:  $n = 56
        Output: 0

        Input:  $n = 57
        Output: 0

        Input:  $n = 59
        Output: 0

        Input:  $n = 60
        Output: 0

        Input:  $n = 79
        Output: 0

        Input:  $n = 196
        Output: 1
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
