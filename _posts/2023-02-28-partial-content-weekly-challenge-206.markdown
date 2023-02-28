---
layout: post
title: "Partial Content: Weekly Challenge 206"
author: "Dave Jacoby"
date: "2023-02-28 14:53:28 -0500"
categories: ""
---

Welcome to [Weekly Challenge #206](https://theweeklychallenge.org/blog/perl-weekly-challenge-206/)

> [The HTTP 206 Partial Content success status response code indicates that the request has succeeded and the body contains the requested ranges of data, as described in the Range header of the request.](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206)

So, this blog post will contain solutions to tasks 1 and 2 of this week's task set.

[![https://http.cat/206](https://http.cat/206)](https://http.cat/206)

### Task 1: Shortest Time

> Submitted by: Mohammad S Anwar  
> You are given a list of time points, at least 2, in the 24-hour clock format HH:MM.
>
> Write a script to find out the shortest time in minutes between any two time points.

#### Let's Talk This Through

I quote myself quoting Dave Rolsky:

> **Do Not Write Your Own Date and Time Manipulation Code!**

Because we're dealing with time. I rely heavily on [DateTime](https://metacpan.org/pod/DateTime) (here and in general) because it is easier to deal with this than to write my own Date and Time manipulation code.

Once we get past "hey, let DateTime do that", there's a fundamental hurdle that's the key part of the first example. **00:00** and **23:55** are almost a whole day away if you count them as different days, but _five minutes away_ if you count them as separate days. So, you use DateTime's `subtract_datetime_absolute` to get the number of seconds between them, and if that number is greater than 12 x 60 x 60, then that's over a half a day and you need to subtract it from 24 x 60 x 60.

(That's hours in a day times minutes in an hour time seconds in a minute, or _86400 seconds_. Or half that, _43200 seconds_, to see if it's half a day away.)

Then there's taking seconds back to minutes, divide by 60. I _don't_ cast it as an integer to cover a case when there's a leap second thrown in for the day I'm running this. Maybe I should.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use DateTime;

my @examples = (

    [ "00:00", "23:55", "20:00" ],
    [ "01:01", "00:50", "00:57" ],
    [ "10:10", "09:30", "09:00", "09:55" ],
    [ "03:00", "06:01", "09:02" ],
);

for my $e (@examples) {
    my $list = join ',', map { qq{"$_"} } $e->@*;
    my $out  = shortest_time( $e->@* );
    say <<"END";
    Input:  \@array = ($list)
    Output: $out
END
}

sub shortest_time ( @array ) {
    my @output;
    my $day_length      = 86400;             # give or take leap seconds, etc
    my $half_day_length = $day_length / 2;
    return 0 unless scalar @array > 1;
    my @times = map { make_time($_) } @array;
    for my $i ( 0 .. -2 + scalar @array ) {
        my $t1 = $times[$i];
        for my $j ( $i + 1 .. -1 + scalar @array ) {
            my $t2   = $times[$j];
            my $diff = $t1->subtract_datetime_absolute($t2)->seconds;
            if ( $diff > $half_day_length ) { $diff = $day_length - $diff; }
            push @output, $diff / 60;        # cast as int?
        }
    }
    return ( sort { $a <=> $b } @output )[0];
}

sub make_time ( $string ) {
    my ( $hr, $min ) = split /:/, $string;
    return DateTime->now    # gives us a DT object that's the current time/date
        ->set_hour($hr)     # reset the hour to input, thankfully happy w/ 24-hour time
        ->set_minute($min)  # reset the minute to input
        ->set_second(0)     # make this zero so we avoid weird edge cases
        ->set_time_zone('floating'); # also avoid weirdness, this time for TZ
}
```

```text
$ ./ch-1.pl
    Input:  @array = ("00:00","23:55","20:00")
    Output: 5

    Input:  @array = ("01:01","00:50","00:57")
    Output: 4

    Input:  @array = ("10:10","09:30","09:00","09:55")
    Output: 15

    Input:  @array = ("03:00","06:01","09:02")
    Output: 181
```

### Task 2: Array Pairings

> Submitted by: Mohammad S Anwar  
> You are given an array of integers having even number of elements.
>
> Write a script to find the maximum sum of the minimum of each pairs.

#### Let's Talk This Through

I _might_ have been able to make this work iteratively. If I kept it at the two-pair examples we're given, that would probably work.

I didn't do that, because ...

**_This_ looks like a job for _RECURSION!_**

- Make the first pair, which is the first number in the array and, iteratively, every other number in the array. Make a new array from what's left.
- Pass forward, keeping track of the pairs.
- When you have no more pairs to make, we're looking for the sum of the minimum value in each pair. I could gin up a `minimum` function that basically looks like `return (sort @input)[0]`, but I'm using `sum0` from [List::Util](https://metacpan.org/pod/List::Util) already, so might as well add it in. So, that's use `map` to get the `min` of each entry, and `sum0` everything, then return that. (I always use `sum0` instead of `sum` because `sum` because `sum0` returns `0` for an empty list. I could be less paranoid, but why?)
- So, we're getting a lot of numbers, but we only want the `max`. So, at each recursion level, we only return the `max` of what we've found so far.

I mean, I _could_ have just passed back the list and done `max` after, but then the function isn't doing the work requested, right?

I thought it would be interesting to see the state at different levels, so I used [Getopt::Long](https://metacpan.org/pod/Getopt::Long) to make a verbose flag, because I thought it would be interesting to see the steps. Looks to me that, if the list is sorted smallest-to-largest, the first will always be the max, but we're not given sorted datasets.

Note: My code uses [signatures](https://perldoc.perl.org/perlsub#Signatures). I think they're cool, and they've been in the language since 5.20. You could do the same with `my $array = shift; my $pairs = shift; $pairs = [] unless defined $pairs;` but why? Signatures are useful and cool.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ sum0 min max };
use Getopt::Long;

my $verbose = 0;
GetOptions( verbose => \$verbose, );

my @examples = (

    [ 1, 2, 3, 4 ],
    [ 0, 2, 1, 3 ],
    [ 2, 4, 6, 8, 10, 12 ],
    [ 1, 2, 3, 4, 5,  6, 7, 8 ],
);

for my $e (@examples) {
    my $o     = array_pairings($e);
    my $array = join ', ', $e->@*;
    say <<"END";
    Input:  \@array = $array
    Output: $o
END
}

sub array_pairings ( $array, $pairs = [] ) {
    my @output;
    if ( !scalar $array->@* ) {
        my $sum = sum0 map { min $_->@* } $pairs->@*;
        say join ' ', '|', ( map { join 'x', $_->@* } $pairs->@* ), '', $sum
            if $verbose;
        return $sum;
    }
    for my $i ( 1 .. -1 + scalar $array->@* ) {
        my @array_copy = $array->@*;
        my @pairs_copy = $pairs->@*;
        my $y          = $array_copy[$i];
        $array_copy[$i] = undef;
        @array_copy = grep { defined } @array_copy;
        my $x = shift @array_copy;
        push @pairs_copy, [ $x, $y ];
        push @output,     array_pairings( \@array_copy, \@pairs_copy );
    }
    say '  ' . join ' ', @output if $verbose;
    return max @output;
}
```

```text
$ ./ch-2.pl
    Input:  @array = 1, 2, 3, 4
    Output: 4

    Input:  @array = 0, 2, 1, 3
    Output: 2

    Input:  @array = 2, 4, 6, 8, 10, 12
    Output: 18

    Input:  @array = 1, 2, 3, 4, 5, 6, 7, 8
    Output: 16

$ ./ch-2.pl -v
| 1x2 3x4  4
  4
| 1x3 2x4  3
  3
| 1x4 2x3  3
  3
  4 3 3
    Input:  @array = 1, 2, 3, 4
    Output: 4

| 0x2 1x3  1
  1
| 0x1 2x3  2
  2
| 0x3 2x1  1
  1
  1 2 1
    Input:  @array = 0, 2, 1, 3
    Output: 2

| 2x4 6x8 10x12  18
  18
| 2x4 6x10 8x12  16
  16
| 2x4 6x12 8x10  16
  16
  18 16 16
| 2x6 4x8 10x12  16
  16
| 2x6 4x10 8x12  14
  14
| 2x6 4x12 8x10  14
  14
  16 14 14
| 2x8 4x6 10x12  16
  16
| 2x8 4x10 6x12  12
  12
| 2x8 4x12 6x10  12
  12
  16 12 12
| 2x10 4x6 8x12  14
  14
| 2x10 4x8 6x12  12
  12
| 2x10 4x12 6x8  12
  12
  14 12 12
| 2x12 4x6 8x10  14
  14
| 2x12 4x8 6x10  12
  12
| 2x12 4x10 6x8  12
  12
  14 12 12
  18 16 16 14 14
    Input:  @array = 2, 4, 6, 8, 10, 12
    Output: 18

| 1x2 3x4 5x6 7x8  16
  16
| 1x2 3x4 5x7 6x8  15
  15
| 1x2 3x4 5x8 6x7  15
  15
  16 15 15
| 1x2 3x5 4x6 7x8  15
  15
| 1x2 3x5 4x7 6x8  14
  14
| 1x2 3x5 4x8 6x7  14
  14
  15 14 14
| 1x2 3x6 4x5 7x8  15
  15
| 1x2 3x6 4x7 5x8  13
  13
| 1x2 3x6 4x8 5x7  13
  13
  15 13 13
| 1x2 3x7 4x5 6x8  14
  14
| 1x2 3x7 4x6 5x8  13
  13
| 1x2 3x7 4x8 5x6  13
  13
  14 13 13
| 1x2 3x8 4x5 6x7  14
  14
| 1x2 3x8 4x6 5x7  13
  13
| 1x2 3x8 4x7 5x6  13
  13
  14 13 13
  16 15 15 14 14
| 1x3 2x4 5x6 7x8  15
  15
| 1x3 2x4 5x7 6x8  14
  14
| 1x3 2x4 5x8 6x7  14
  14
  15 14 14
| 1x3 2x5 4x6 7x8  14
  14
| 1x3 2x5 4x7 6x8  13
  13
| 1x3 2x5 4x8 6x7  13
  13
  14 13 13
| 1x3 2x6 4x5 7x8  14
  14
| 1x3 2x6 4x7 5x8  12
  12
| 1x3 2x6 4x8 5x7  12
  12
  14 12 12
| 1x3 2x7 4x5 6x8  13
  13
| 1x3 2x7 4x6 5x8  12
  12
| 1x3 2x7 4x8 5x6  12
  12
  13 12 12
| 1x3 2x8 4x5 6x7  13
  13
| 1x3 2x8 4x6 5x7  12
  12
| 1x3 2x8 4x7 5x6  12
  12
  13 12 12
  15 14 14 13 13
| 1x4 2x3 5x6 7x8  15
  15
| 1x4 2x3 5x7 6x8  14
  14
| 1x4 2x3 5x8 6x7  14
  14
  15 14 14
| 1x4 2x5 3x6 7x8  13
  13
| 1x4 2x5 3x7 6x8  12
  12
| 1x4 2x5 3x8 6x7  12
  12
  13 12 12
| 1x4 2x6 3x5 7x8  13
  13
| 1x4 2x6 3x7 5x8  11
  11
| 1x4 2x6 3x8 5x7  11
  11
  13 11 11
| 1x4 2x7 3x5 6x8  12
  12
| 1x4 2x7 3x6 5x8  11
  11
| 1x4 2x7 3x8 5x6  11
  11
  12 11 11
| 1x4 2x8 3x5 6x7  12
  12
| 1x4 2x8 3x6 5x7  11
  11
| 1x4 2x8 3x7 5x6  11
  11
  12 11 11
  15 13 13 12 12
| 1x5 2x3 4x6 7x8  14
  14
| 1x5 2x3 4x7 6x8  13
  13
| 1x5 2x3 4x8 6x7  13
  13
  14 13 13
| 1x5 2x4 3x6 7x8  13
  13
| 1x5 2x4 3x7 6x8  12
  12
| 1x5 2x4 3x8 6x7  12
  12
  13 12 12
| 1x5 2x6 3x4 7x8  13
  13
| 1x5 2x6 3x7 4x8  10
  10
| 1x5 2x6 3x8 4x7  10
  10
  13 10 10
| 1x5 2x7 3x4 6x8  12
  12
| 1x5 2x7 3x6 4x8  10
  10
| 1x5 2x7 3x8 4x6  10
  10
  12 10 10
| 1x5 2x8 3x4 6x7  12
  12
| 1x5 2x8 3x6 4x7  10
  10
| 1x5 2x8 3x7 4x6  10
  10
  12 10 10
  14 13 13 12 12
| 1x6 2x3 4x5 7x8  14
  14
| 1x6 2x3 4x7 5x8  12
  12
| 1x6 2x3 4x8 5x7  12
  12
  14 12 12
| 1x6 2x4 3x5 7x8  13
  13
| 1x6 2x4 3x7 5x8  11
  11
| 1x6 2x4 3x8 5x7  11
  11
  13 11 11
| 1x6 2x5 3x4 7x8  13
  13
| 1x6 2x5 3x7 4x8  10
  10
| 1x6 2x5 3x8 4x7  10
  10
  13 10 10
| 1x6 2x7 3x4 5x8  11
  11
| 1x6 2x7 3x5 4x8  10
  10
| 1x6 2x7 3x8 4x5  10
  10
  11 10 10
| 1x6 2x8 3x4 5x7  11
  11
| 1x6 2x8 3x5 4x7  10
  10
| 1x6 2x8 3x7 4x5  10
  10
  11 10 10
  14 13 13 11 11
| 1x7 2x3 4x5 6x8  13
  13
| 1x7 2x3 4x6 5x8  12
  12
| 1x7 2x3 4x8 5x6  12
  12
  13 12 12
| 1x7 2x4 3x5 6x8  12
  12
| 1x7 2x4 3x6 5x8  11
  11
| 1x7 2x4 3x8 5x6  11
  11
  12 11 11
| 1x7 2x5 3x4 6x8  12
  12
| 1x7 2x5 3x6 4x8  10
  10
| 1x7 2x5 3x8 4x6  10
  10
  12 10 10
| 1x7 2x6 3x4 5x8  11
  11
| 1x7 2x6 3x5 4x8  10
  10
| 1x7 2x6 3x8 4x5  10
  10
  11 10 10
| 1x7 2x8 3x4 5x6  11
  11
| 1x7 2x8 3x5 4x6  10
  10
| 1x7 2x8 3x6 4x5  10
  10
  11 10 10
  13 12 12 11 11
| 1x8 2x3 4x5 6x7  13
  13
| 1x8 2x3 4x6 5x7  12
  12
| 1x8 2x3 4x7 5x6  12
  12
  13 12 12
| 1x8 2x4 3x5 6x7  12
  12
| 1x8 2x4 3x6 5x7  11
  11
| 1x8 2x4 3x7 5x6  11
  11
  12 11 11
| 1x8 2x5 3x4 6x7  12
  12
| 1x8 2x5 3x6 4x7  10
  10
| 1x8 2x5 3x7 4x6  10
  10
  12 10 10
| 1x8 2x6 3x4 5x7  11
  11
| 1x8 2x6 3x5 4x7  10
  10
| 1x8 2x6 3x7 4x5  10
  10
  11 10 10
| 1x8 2x7 3x4 5x6  11
  11
| 1x8 2x7 3x5 4x6  10
  10
| 1x8 2x7 3x6 4x5  10
  10
  11 10 10
  13 12 12 11 11
  16 15 15 14 14 13 13
    Input:  @array = 1, 2, 3, 4, 5, 6, 7, 8
    Output: 16
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
