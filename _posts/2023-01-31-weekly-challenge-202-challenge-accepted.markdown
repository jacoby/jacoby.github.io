---
layout: post
title: "Weekly Challenge #202: Challenge Accepted"
author: "Dave Jacoby"
date: "2023-01-31 13:55:05 -0500"
categories: ""
---

[This is Weekly Challenge #202](https://theweeklychallenge.org/blog/perl-weekly-challenge-202/), and instead of going to number theory for fun number facts, I went to HTTP.

[![202 Accepted](https://http.cat/202)](https://http.cat/)

### Task 1: Consecutive Odds

> Submitted by: Mohammad S Anwar  
> You are given an array of integers.
>
> Write a script to print 1 if there are THREE consecutive odds in the given array otherwise print 0.

Another iterative two-loop solution, with a few variations. I normally have the outer loop go from start to end, but if you need three consecutive odds, there's no reason to go where there aren't 3 numbers. In the outer loop, we only care if there are 3 consecutive odd numbers. There could be a million consecutive odd numbers, but after that first three, we don't care. This means we loop three, give up and iterate the outer loop if the number is even, and return 1 if we've hit the third. Easy peasey.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @examples = (

    [ 1, 5, 3, 6 ],
    [ 2, 6, 3, 5 ],
    [ 1, 2, 3, 4 ],
    [ 2, 3, 5, 7 ],
    [ 2, 3, 4, 7, 9, 11, 13 ],

);

for my $e (@examples) {
    my $list = join ',', $e->@*;
    my $out  = consecutive_odds( $e->@* );
    say <<"END";
    Input:  \@array = ($list)
    Output: $out
END
}

sub consecutive_odds ( @array ) {
    my $max = -3 + scalar @array;
OUTER: for my $i ( 0 .. $max ) {
        for my $j ( 0 .. 2 ) {
            my $n = $array[ $i + $j ];
            next OUTER if !is_odd($n);
            return 1   if $j == 2;
        }
    }
    return 0;
}

sub is_odd ( $n ) {
    return $n % 2 ? 1 : 0;
}
```

```text
    Input:  @array = (1,5,3,6)
    Output: 1

    Input:  @array = (2,6,3,5)
    Output: 0

    Input:  @array = (1,2,3,4)
    Output: 0

    Input:  @array = (2,3,5,7)
    Output: 1

    Input:  @array = (2,3,4,7,9,11,13)
    Output: 1
```

### Task 2: Widest Valley

> Submitted by: E. Choroba  
> Given a profile as a list of altitudes, return the leftmost widest valley. A valley is defined as a subarray of the profile consisting of two parts: the first part is non-increasing and the second part is non-decreasing. Either part can be empty.  

Again, the nested loop. This time, there's state. We're either in *non-increasing* or *non-decreasing*. If we're in a non-increasing state and we start increasing, we change state. If we're in a non-decreasing state and we start decreasing, we're in a new valley, so we start again.

I throw the current valley into an array at each iteration, then sort that array by the size of the sub-array, then return the first (biggest) one.

Come to think of it, if I reversed order of the tests, I could have two ifs and not and elsif. And I could test for array size each time and change it only when valley length is greater than current length. Oh well, I like how I sort by size.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ sum0 uniq };

my @examples = (

    [ 1, 5, 5,  2, 8 ],
    [ 2, 6, 8,  5 ],
    [ 9, 8, 13, 13, 2, 2, 15, 17 ],
    [ 2, 1, 2,  1,  3 ],
    [ 1, 3, 3,  2,  1, 2, 3, 3, 2 ],
);

for my $e (@examples) {
    my $example = join ', ', $e->@*;
    my @valley  = widest_valley( $e->@* );
    my $valley  = join ', ', @valley;
    say <<"END";
    Input:  \$n = $example
    Output: $valley
END
}

sub widest_valley ( @array ) {
    my @output;
    my $end = -1 + scalar @array;

OUTER: for my $i ( 0 .. $end ) {

        # 0 = non-increasing, 1 = non-decreasing
        my $state = 0;
        my @local;
        for my $j ( $i .. $end ) {
            my $n = $array[$j];

            # descending
            if ( $state == 0 && scalar @local && $n > $local[-1] ) {
                $state = 1;
            }
            elsif ( $state == 1 && $n < $local[-1] ) {
                next OUTER;
            }
            push @local, $n;
            my @copy = @local;
            push @output, \@copy if scalar @copy > 2;
        }
    }

    @output = sort { scalar $b->@* <=> scalar $a->@* } @output;
    return () unless scalar @output;
    return $output[0]->@*;
}
```

```text
    Input:  $n = 1, 5, 5, 2, 8
    Output: 5, 5, 2, 8

    Input:  $n = 2, 6, 8, 5
    Output: 2, 6, 8

    Input:  $n = 9, 8, 13, 13, 2, 2, 15, 17
    Output: 13, 13, 2, 2, 15, 17

    Input:  $n = 2, 1, 2, 1, 3
    Output: 2, 1, 2

    Input:  $n = 1, 3, 3, 2, 1, 2, 3, 3, 2
    Output: 3, 3, 2, 1, 2, 3, 3
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
