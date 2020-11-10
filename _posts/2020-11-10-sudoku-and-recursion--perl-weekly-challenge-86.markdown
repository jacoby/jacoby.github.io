---
layout: post
title: "Sudoku and Recursion - Perl Weekly Challenge #86"
author: "Dave Jacoby"
date: "2020-11-10 01:22:23 -0500"
categories: ""
---

I solved Challenge #2 in Perl Weekly Challenge #2 with **Recursion!**

> You are given Sudoku puzzle (9x9).
>
> Write a script to complete the puzzle and must respect the following rules:
>
> 1. Each row must have the numbers 1-9 occuring just once.
> 1. Each column must have the numbers 1-9 occuring just once.
> 1. The numbers 1-9 must occur just once in each of the 9 sub-boxes (3x3) of the grid.

So, just Sudoku like we know it. This is the sample puzzle:

```
 _ _ _  2 6 _  7 _ 1
 6 8 _  _ 7 _  _ 9 _
 1 9 _  _ _ 4  5 _ _

 8 2 _  1 _ _  _ 4 _
 _ _ 4  6 _ 2  9 _ _
 _ 5 _  _ _ 3  _ 2 8

 _ _ 9  3 _ _  _ 7 4
 _ 4 _  _ 5 _  _ 3 6
 7 _ 3  _ 1 8  _ _ _
```

We can start with the upper-left corner, which we'll call `0,0`. We can iterate through `1..9`, and find that `1` is a no-go for the first row and first column and first block, `2` is a no-go for the first row, and `3` is the first one that can possibly work.

```
 3 _ _  2 6 _  7 _ 1
 6 8 _  _ 7 _  _ 9 _
 1 9 _  _ _ 4  5 _ _

 8 2 _  1 _ _  _ 4 _
 _ _ 4  6 _ 2  9 _ _
 _ 5 _  _ _ 3  _ 2 8

 _ _ 9  3 _ _  _ 7 4
 _ 4 _  _ 5 _  _ 3 6
 7 _ 3  _ 1 8  _ _ _
```

And then start by testing `0,1` and `0,2` and find `0,3` already has `2` set, and so on. We go forward, accepting the pre-existing values and inserting values when necessary. Going through all possible choices like this is what we call **brute force**, and, at the level we're at with Sudoki, with a 9x9 grid and only 9 possible choices for each position, taking only a fraction of a second on my laptop, this is valid.

A more clever way would go through and find out that, for `1,5`, the only possible solution is `1`, mark that, then find every other only-possible solutions, until it is all solved. This is how I solve them when I solve Sudoku puzzles by hand.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

my $puzzle = '
 _ _ _ 2 6 _ 7 _ 1
 6 8 _ _ 7 _ _ 9 _
 1 9 _ _ _ 4 5 _ _
 8 2 _ 1 _ _ _ 4 _
 _ _ 4 6 _ 2 9 _ _
 _ 5 _ _ _ 3 _ 2 8
 _ _ 9 3 _ _ _ 7 4
 _ 4 _ _ 5 _ _ 3 6
 7 _ 3 _ 1 8 _ _ _
';

my @puzzle;
for my $row ( grep { /\S/ } split /\s?\n\s?/, $puzzle ) {
    my @row = split /\s/mx, $row;
    push @puzzle, \@row;
}

say 'BEFORE';
display_puzzle(@puzzle);
solve_puzzle( 0, 0, \@puzzle );

sub solve_puzzle ( $x, $y, $puzzle ) {
    return unless $puzzle->[$x][$y];
    my $n = $puzzle->[$x][$y];

    my $nx = $x;
    my $ny = $y;
    $nx++;
    if ( $nx > 8 ) {
        $ny++;
        $nx = 0;
    }

    if ( $n eq '_' ) {
        for my $i ( 1 .. 9 ) {
            $puzzle->[$x][$y] = $i;
            next unless test_puzzle($puzzle);
            if ( $x == 8 && $y == 8 ) {
                say 'SOLVED';
                display_puzzle($puzzle->@*);
            }
            else {
                solve_puzzle( $nx, $ny, $puzzle );
            }
        }
        $puzzle->[$x][$y] = '_';
    }
    else {
        solve_puzzle( $nx, $ny, $puzzle );
    }
}

sub test_puzzle( $puzzle) {
    my @puzzle    = $puzzle->@*;
    my $yardstick = join ' ', 1 .. 9;

    # rows
    for my $x ( 0 .. 8 ) {
        my @row = $puzzle[$x]->@*;
        # I repeat this code, which makes it a good candidate,
        # if not toy code, to be pulled into another function
        # so i can use it for columns, rows and blocks
        for my $k ( 1 .. 9 ) {
            my @c = grep { /$k/ } @row;
            my $c = scalar @c;
            return 0 if $c > 1;
        }
    }

    # columns
    for my $x ( 0 .. 8 ) {
        my @col = map { $puzzle->[$_][$x] } 0 .. 8;
        for my $k ( 1 .. 9 ) {
            my @c = grep { /$k/ } @col;
            my $c = scalar @c;
            return 0 if $c > 1;
        }
    }

    # blocks
    for my $xa ( 0 .. 2 ) {
        for my $ya ( 0 .. 2 ) {
            my @block;
            for my $xb ( 0 .. 2 ) {
                for my $yb ( 0 .. 2 ) {
                    my $x = $xa * 3 + $xb;
                    my $y = $ya * 3 + $yb;
                    push @block, $puzzle[$x][$y];
                }
            }
            for my $k ( 1 .. 9 ) {
                my @c = grep { /$k/ } @block;
                my $c = scalar @c;
                return 0 if $c > 1;
            }
        }
    }
    return 1;
}

sub display_puzzle ( @puzzle ) {
    say '-' x 27;
    for my $x ( 0 .. 8 ) {
        if ( $x % 3 == 0 && $x ne 0 ) { say '' }
        for my $y ( 0 .. 8 ) {
            print ' ' if $y % 3 == 0;
            print $puzzle[$x][$y] || '=';
            print ' ';
        }
        say '';
    }
    say '-' x 27;
    say '';
}
```

```text
BEFORE
---------------------------
 _ _ _  2 6 _  7 _ 1
 6 8 _  _ 7 _  _ 9 _
 1 9 _  _ _ 4  5 _ _

 8 2 _  1 _ _  _ 4 _
 _ _ 4  6 _ 2  9 _ _
 _ 5 _  _ _ 3  _ 2 8

 _ _ 9  3 _ _  _ 7 4
 _ 4 _  _ 5 _  _ 3 6
 7 _ 3  _ 1 8  _ _ _
---------------------------

SOLVED
---------------------------
 4 3 5  2 6 9  7 8 1
 6 8 2  5 7 1  4 9 3
 1 9 7  8 3 4  5 6 2

 8 2 6  1 9 5  3 4 7
 3 7 4  6 8 2  9 1 5
 9 5 1  7 4 3  6 2 8

 5 1 9  3 2 6  8 7 4
 2 4 8  9 5 7  1 3 6
 7 6 3  4 1 8  2 5 9
---------------------------
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
