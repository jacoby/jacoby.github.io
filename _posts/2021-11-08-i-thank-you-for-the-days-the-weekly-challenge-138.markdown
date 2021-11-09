---
layout: post
title: "I Thank You For The Days: The Weekly Challenge #138"
author: "Dave Jacoby"
date: "2021-11-08 18:32:13 -0500"
categories: ""
---

Another week, another [Weekly Challenge](https://theweeklychallenge.org/blog/perl-weekly-challenge-138/)!

### TASK #1 › Workdays

> Submitted by: Mohammad S Anwar
> You are given a year, $year in 4-digits form.
>
> Write a script to calculate the total number of workdays in the given year.
>
> For the task, we consider, Monday - Friday as workdays.

I provide two solutions. One is more complex and more like _challenge code_ and one is very much simple and not quite challenge-y, but very much what I would do.

Again, I assert that there are only 14 possible weeks: 7 days of the week to start the year times whether it's a leap year or not.

You _could_ go through as a brute force method, go through every day, count it if it's a weekday. Perl makes this _very_ easy; I'm considering redoing this in Python and Javascript to see how robust their Date code is.

```perl
sub workdays1 ( $year ) {
    my $day = DateTime->new(
        day       => 1,
        month     => 1,
        year      => $year,
        time_zone => 'floating'
    );
    my $c = 0;
    while ( $year == $day->year ) {
        $c++ if $day->day_of_week <= 5;
        $day->add( days => 1 );
    }
    return $c;
}
```

But when the number of choices is _just_ higher than the number of most people's fingers, it's easy enough to make another table.

| Leap Year? | Day of Week | Count of Work Days |
| ---------- | ----------- | ------------------ |
| false      | Monday      | 261                |
| false      | Tuesday     | 261                |
| false      | Wednesday   | 261                |
| false      | Thursday    | 261                |
| false      | Friday      | 261                |
| false      | Saturday    | **260**            |
| false      | Sunday      | **260**            |
| true       | Monday      | **262**            |
| true       | Tuesday     | **262**            |
| true       | Wednesday   | **262**            |
| true       | Thursday    | **262**            |
| true       | Friday      | 261                |
| true       | Saturday    | **260**            |
| true       | Sunday      | 261                |

We could make a complex `switch` statement — (`case Sunday and not a leap year: ...`) — or we can jut put it all into a multidimensional hash.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say state postderef signatures };
no warnings qw{ experimental };

use DateTime;

for my $y ( 2000 .. 2040 ) {
    say join "\t", $y, workdays2($y), workdays1($y);
}

# The brute force solution, where I go through each year,
# checking if each day is a work day, and keeping count.

sub workdays1 ( $year ) {
    my $day = DateTime->new(
        day       => 1,
        month     => 1,
        year      => $year,
        time_zone => 'floating'
    );
    my $c = 0;
    while ( $year == $day->year ) {
        $c++ if $day->day_of_week <= 5;
        $day->add( days => 1 );
    }
    return $c;
}

# But there are ONLY 14 years. Leap year or not = 2. Days of week = 7.
# 2 * 7 == 14. So it's perfectly reasonable to know that, if the year
# is a leapyar and starts on a Saturday, or starts on a Sunday, leap year
# or no, that's going to be a 260-workday year, and if it's a leap year
# and starts on Monday, Tuesday, Wednesday or Thurday, there will be
# 262, and otherwise, there will be 261.

sub workdays2( $year ) {
    my $table = {};
    $table->{0}{1} = 261;
    $table->{0}{2} = 261;
    $table->{0}{3} = 261;
    $table->{0}{4} = 261;
    $table->{0}{5} = 261;
    $table->{0}{6} = 260;
    $table->{0}{7} = 260;
    $table->{1}{1} = 262;
    $table->{1}{2} = 262;
    $table->{1}{3} = 262;
    $table->{1}{4} = 262;
    $table->{1}{5} = 261;
    $table->{1}{6} = 260;
    $table->{1}{7} = 261;
    my $day = DateTime->new(
        day       => 1,
        month     => 1,
        year      => $year,
        time_zone => 'floating'
    );
    return $table->{ $day->is_leap_year }{ $day->dow };
}
```

```text
2000    260     260
2001    261     261
2002    261     261
2003    261     261
2004    262     262
2005    260     260
2006    260     260
2007    261     261
2008    262     262
2009    261     261
2010    261     261
2011    260     260
2012    261     261
2013    261     261
2014    261     261
2015    261     261
2016    261     261
2017    260     260
2018    261     261
2019    261     261
2020    262     262
2021    261     261
2022    260     260
2023    260     260
2024    262     262
2025    261     261
2026    261     261
2027    261     261
2028    260     260
2029    261     261
2030    261     261
2031    261     261
2032    262     262
2033    260     260
2034    260     260
2035    261     261
2036    262     262
2037    261     261
2038    261     261
2039    260     260
2040    261     261
```

### TASK #2 › Split Number

> Submitted by: Mohammad S Anwar  
> You are given a perfect square.
>
> Write a script to figure out if the square root the given number is same as sum of 2 or more splits of the given number.

The trick as I see it is to find the way to split the digits of 99<sup>2</sup> into the possible choices:

- 9,8,0,1
- 98,0,1
- 9,80,1
- 9,8,01
- 98,01
- 980,1
- 9,801
- 9801

From there, there's some trivial bookkeeping — I find it much easier to toss around strings than hashrefs, so I use `join` a lot — and `sum0` from List::Util, which I always go for because I _believe_ I won't be passing an empty array, but it's good to be sure.

I call the recursive function I use `break_up`, but I'm very unhappy with that name, but if I've ever been told the name of the process to turn one four-digit number into those eight possibilities, I have forgotten it.

Beyond that, it's `sqrt` and numerical comparison and that's about it.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use List::Util qw{ sum0 uniq };

my @squares = map { $_**2 } 1 .. 100;

for my $n (@squares) {
    my $split = split_number($n);
    say join "\t", '', $split, $n,;
}

sub split_number($n) {
    my $sqrt  = sqrt($n);
    my @split = split //, $n;
    if ( scalar @split == 1 ) {
        my $s = shift @split;
        return $s == $sqrt ? 1 : 0;
    }
    else {
        my @numbers = break_up( 1, @split );
        for my $num (@numbers) {
            my $sum = sum0 split /\D/, $num;
            return 1 if $sqrt == $sum;
        }
    }
    return 0;
}

sub break_up ( $position, @array ) {
    my @output;
    my $len = scalar @array;
    my @dup = @array;
    if ( $len <= $position ) {
        return join '+', @array;
    }

    my @copy;
    my $i = 0;
    while (@dup) {
        if ( $i eq $position ) {
            my $x = shift @dup;
            $copy[-1] .= $x;
        }
        else {
            push @copy, shift @dup;
        }
        $i++;
    }

    push @output, break_up( $position,     @copy );
    push @output, break_up( $position + 1, @array );

    @output = uniq sort grep { defined } @output;
    return @output;
}
```

```text
        1       1
        0       4
        0       9
        0       16
        0       25
        0       36
        0       49
        0       64
        1       81
        1       100
        0       121
        0       144
        0       169
        0       196
        0       225
        0       256
        0       289
        0       324
        0       361
        0       400
        0       441
        0       484
        0       529
        0       576
        0       625
        0       676
        0       729
        0       784
        0       841
        0       900
        0       961
        0       1024
        0       1089
        0       1156
        0       1225
        1       1296
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
