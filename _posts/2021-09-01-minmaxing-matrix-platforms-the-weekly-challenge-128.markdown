---
layout: post
title:  "MinMaxing Matrix Platforms: The Weekly Challenge 128"
author: "Dave Jacoby"
date:   "2021-09-01 13:56:38 -0400"
categories: ""
---


[Now onto Challenge 128!](https://theweeklychallenge.org/blog/perl-weekly-challenge-128/)

(Or, 2<sup>7</sup>)

### TASK #1 › Maximum Sub-Matrix

> Submitted by: Mohammad S Anwar  
> You are given m x n binary matrix having 0 or 1.
>
> Write a script to find out maximum sub-matrix having only 0.

I had an idea and I wrote a thing. I was unhappy.

My first pass was wrong. I was checking for 1s and 0s during the submatrix creation, which is difficult. It's simpler to just pull out the submatrices, then figure out if there's ones in the submitrices and drop those.

So first we have to flatten a matrix. That's easy. `map { $_->@* } @matrix`.

Then there's determining if it contains a 1. I _could_ do something like `grep /1/, flatten_matrix( @matrix )`, but instead, I use `sum0` and if the value is not zero, there's a one in the submatrix and that's nope.

(I use `sum0` instead of `sum`, because `sum` returns `undef` when given an empty array, which _can_ cause a problem. I _shouldn't_ have that problem, but just in case, I add one character.)

So now, we have an array of submatrices, and we want the longest. What do you do when you have unsorted data? You _sort_ it. `@subs = sort { matrix_size($b) <=> matrix_size($a) } @subs`, which is all well and good, except we don't know `matrix_size`. Well, it's just an easy way to abstract away `scalar flatten_matrix(@matrix)`, as shown above.

Of course, the example returns a 2x3 submatrix, but there's also a 3x2 submatrix. They're of equivalent size, so it's still a win.

### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures };
no warnings qw{ experimental };

use utf8;
use JSON;
use List::Util qw{ sum0 };

my $json = JSON->new;

my @experiments;
push @experiments, <<'END';
    1 0 0 0 1 0 
    1 1 0 0 0 1 
    1 0 0 0 0 0 
END
push @experiments, <<'END';
    0 0 1 1 
    0 0 0 1 
    0 0 1 0 
END
push @experiments, <<'END';
    
    1 1 0 0 1 0 1 0
    0 0 0 0 1 0 1 0
    0 0 0 0 0 1 1 0
    1 1 1 1 0 0 0 1
    1 1 0 1 0 0 0 1

END

for my $e (@experiments) {
    my @m =
        map {
        my @r = grep { /\d/ } split /\s+/, $_;
        \@r
        }
        grep { /\d/ }
        split m{\n}, $e;
    my @subs =
        sort { matrix_size($b) <=> matrix_size($a) } find_submatrices( \@m );
    my $sub  = shift @subs;
    my $size = matrix_size($sub);
    say 'INPUT:';
    display_matrix( \@m );
    say 'OUTPUT:';
    display_matrix($sub);
    say '';
}

sub find_submatrices ( $matrix ) {
    my @subs;
    my $maxx = -1 + scalar $matrix->@*;
    my $maxy = -1 + scalar $matrix->[0]->@*;
    for my $x ( 0 .. $maxx ) {
        for my $y ( 0 .. $maxy ) {
            if ( $matrix->[$x][$y] == 0 ) {
                for my $i ( $x + 1 .. $maxx ) {
                    for my $j ( $y + 1 .. $maxy ) {
                        my $sub = make_submatrix( $matrix, $x, $y, $i, $j );
                        my $n   = sum0 flatten_matrix($sub);
                        next if $n;
                        push @subs, $sub;
                    }
                }
            }
        }
    }
    return @subs;
}

sub make_submatrix ( $matrix, $startx, $starty, $endx, $endy ) {
    my $sub = [];
    for my $i ( $startx .. $endx ) {
        my $x = $i - $startx;
        for my $j ( $starty .. $endy ) {
            my $y = $j - $starty;
            my $v = $matrix->[$i][$j];
            $sub->[$x][$y] = $v;
        }
    }
    return $sub;
}

sub matrix_size ( $matrix ) {
    return scalar flatten_matrix($matrix);
}

sub display_matrix ($matrix ) {
    say join "\n", map { join ' ', "\t", '[', $_->@*, ']' } $matrix->@*;
}

sub flatten_matrix ($matrix) {
    return map { $_->@* } $matrix->@*;
}
```

```text
INPUT:
         [ 1 0 0 0 1 0 ]
         [ 1 1 0 0 0 1 ]
         [ 1 0 0 0 0 0 ]
OUTPUT:
         [ 0 0 ]
         [ 0 0 ]
         [ 0 0 ]

INPUT:
         [ 0 0 1 1 ]
         [ 0 0 0 1 ]
         [ 0 0 1 0 ]
OUTPUT:
         [ 0 0 ]
         [ 0 0 ]
         [ 0 0 ]

INPUT:
         [ 1 1 0 0 1 0 1 0 ]
         [ 0 0 0 0 1 0 1 0 ]
         [ 0 0 0 0 0 1 1 0 ]
         [ 1 1 1 1 0 0 0 1 ]
         [ 1 1 0 1 0 0 0 1 ]
OUTPUT:
         [ 0 0 0 0 ]
         [ 0 0 0 0 ]
```

### TASK #2 › Minimum Platforms

> Submitted by: Mohammad S Anwar  
> You are given two arrays of arrival and departure times of trains at a railway station.
>
> Write a script to find out the minimum number of platforms needed so that no train needs to wait.

Things I needed to know:

- The times are in 24-hour time, so you can convert them into mathematically-usable forms by simply removing the semicolon. (If you insist on efficiency, you then need to skip from lots of impossible times, but eh.)
- The departures in the second example are not in numerical order. You either need to sort into order, or create a mechanism that doesn't require it. I chose to sort. `¯\_(ツ)_/¯`

So, given the examples, we always start with an arrival and end with a departure. There is no mechanism to leave a train in the station overnight, so we're starting with a platform requirement of `0` and a maximum platform requirement of `0`.

We then go through every minute between the first arrival and the last departure (including a lot of fake minutes like `11:61` because they'll never hit), and test for arrivals and departures. If there's an arrival, we increment the platform count. If there's a departure, we decrement it. But we always check, and if the platform count is greater than the maximum platform count, we make them equal.

By the first example:

- **11:30** - first train comes in. P=1, MP=1.
- **11:50** - first train leaves. P=0, MP=1.
- **14:30** - second train comes in. P=1, MP=1.
- **15:00** - second train leaves. P=0, MP=1.

Maximum platforms required is 1.

Example 2 is more complex, of course.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use feature qw{say state signatures};
use strict;
use warnings;
use utf8;
no warnings qw{ experimental };

my @examples;
push @examples,
    {
    arrivals   => [ '11:20', '14:30' ],
    departures => [ '11:50', '15:00' ],
    };

push @examples,
    {
    arrivals   => [ '10:20', '11:00', '11:10', '12:20', '16:20', '19:00' ],
    departures => [ '10:30', '13:20', '12:40', '12:50', '20:20', '21:20' ],
    };

for my $e (@examples) {
    my $min_platforms = min_platforms($e);
    my $arrivals      = join ', ', $e->{arrivals}->@*;
    my $departures    = join ', ', $e->{departures}->@*;
    say <<"END";
    Input: \@arrivals   = ($arrivals)
    Input: \@departures = ($departures)
    Output: $min_platforms
END
}

sub min_platforms ($timetable) {
    my $p  = 0;
    my $mp = 0;
    my @arrivals =
        map { s/\D//g; $_ }
        map { $_ }
        sort $timetable->{arrivals}->@*;
    my @departures =
        map { s/\D//g; $_ }
        map { $_ }
        sort $timetable->{departures}->@*;

    my $first = $arrivals[0];
    my $last  = $departures[-1];
    for my $t ( $first .. $last ) {
        if ( @arrivals && $t == $arrivals[0] ) {
            shift @arrivals;
            $p++;
            $mp = $p if $p > $mp;
        }
        if ( @departures && $t == $departures[0] ) {
            shift @departures;
            $p--;
        }
    }

    return $mp;
}
```

```time
    Input: @arrivals   = (11:20, 14:30)
    Input: @departures = (11:50, 15:00)
    Output: 1

    Input: @arrivals   = (10:20, 11:00, 11:10, 12:20, 16:20, 19:00)
    Input: @departures = (10:30, 13:20, 12:40, 12:50, 20:20, 21:20)
    Output: 3
```



#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)


