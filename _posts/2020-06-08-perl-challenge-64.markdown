---
layout: post
title: "Perl Challenge #64"
author: "Dave Jacoby"
date: "2020-06-08 18:16:12 -0400"
categories: ""
---

Starting into [Perl Weekly Challenge #64](https://perlweeklychallenge.org/blog/perl-weekly-challenge-064/).

### TASK #1 › Minimum Sum Path

> Submitted by: Mohammad S Anwar
>
> Reviewed by: Ryan Thompson
>
> Given an m × n matrix with non-negative integers, write a script to find a path from top left to bottom right which minimizes the sum of all numbers along its path. You can only move either down or right at any point in time.
>
> ...
>
> Thus, your script could output: 21 ( 1 → 2 → 3 → 6 → 9 )

My first thought for this was to do an iterative Shortest-Path solution, like I've used for my [Ladder Puzzle solver](https://jacoby.github.io/2019/05/06/rethinking-my-ladder-puzzle-code.html), but I decided that, instead, a recursive solution would be best. Or at least, easiest to implement.

It _kinda_ doesn't matter, because if we're looking for the lowest sums of all paths from upper-left to lower-right, we have to take all paths to get there, and with this as the matrix —

```text
[ 1 2 3 ]
[ 4 5 6 ]
[ 7 8 9 ]
```

— there are a limited number of paths. **1 → 2 → 3 → 6 → 9**, **1 → 2 → 5 → 6 → 9**, **1 → 2 → 5 → 8 → 9**, **1 → 4 → 5 → 6 → 9**, **1 → 4 → 5 → 8 → 9**, and **1 → 4 → 7 → 8 → 9**, specifically, and they're all five places long. If there were paths that were shorter, and that's the thing to be looking for, then this might make sense.

But going depth-first instead of breadth-first, and only passing things back when we reach **9**, then we can save a lot of record-keeping if we go with recursion.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ fc postderef say signatures state switch };
no warnings qw{ experimental };

use List::Util qw{sum};

my $matrix = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ], ];

my @solutions = solve_matrix($matrix);

my ($sol) = sort { sum( $a->@*) <=> sum( $b->@* )} @solutions;

say join ' -> ', $sol->@*;

sub solve_matrix ( $matrix, $x = 0, $y = 0, $path = [] ) {
    my @output;
    my @path = $path->@*;
    my $endx = -1 + scalar $matrix->@*;
    my $endy = -1 + scalar $matrix->[0]->@*;
    return if $x > $endx;
    return if $y > $endy;

    push @path, $matrix->[$x][$y];

    return \@path if $x == $endx && $y == $endy;
    push @output, solve_matrix( $matrix, $x,     $y + 1, \@path );    #right
    push @output, solve_matrix( $matrix, $x + 1, $y,     \@path );    #down
    return wantarray ? @output : \@output;
}
```

I suppose if I did this iteratively, I could tell when we've hit the last and do something like `@min_path = map {$_} @path if sum(@path) < sum(@min_path)`, but oh well.

### TASK #2 › Word Break

> Submitted by: Mohammad S Anwar
>
> You are given a string \$S and an array of words @W.
>
> Write a script to find out if \$S can be split into sequence of one or more words as in the given @W.
>
> Print the all the words if found otherwise print 0.

I have this. I am not happy.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings qw{ experimental };

use Carp;
use JSON;
my $json = JSON->new->canonical->allow_nonref->pretty->space_after;

my @input;
push @input, [ "perlweeklychallenge", "weekly", "challenge", "perl" ];
push @input, [ "perlandraku",         "python", "ruby",      "haskell" ];

for my $i (@input) {
    my $s = shift $i->@*;
    my @w = $i->@*;
    my $out = wordbreak( $s, @w );
    say $out;
}

sub wordbreak ( $s, @w ) {
    my @permutations = permute_array( \@w );
    for my $perm (@permutations) {
        my $str = join '', $perm->@*;
        return join ',', map { qq{"$_"} } $perm->@* if $str eq $s;
    }
    return 0;
}

sub permute_array ( $array ) {
    return $array if scalar $array->@* == 1;
    my @response = map {
        my $i        = $_;
        my $d        = $array->[$i];
        my $copy->@* = $array->@*;
        splice $copy->@*, $i, 1;
        my @out = map { unshift $_->@*, $d; $_ } permute_array($copy);
        @out
    } 0 .. scalar $array->@* - 1;
    return @response;
}
```

For the given solution, `$s = "perlweeklychallenge"; @w = ( "weekly", "challenge", "perl" )`, we can make it work with `( "perl", "weekly", "challenge" )` but by the description, I should be able to add `"zed"` into the input and still have the same output, I _think_, but instead of pulling out my old `permute_array` code, I might have to dive into [Algorithm::Combinatorics](https://metacpan.org/pod/Algorithm::Combinatorics) so I can get subarrays.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
