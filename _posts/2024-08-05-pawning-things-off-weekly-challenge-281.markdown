---
layout: post
title: "Pawning Things Off: Weekly Challenge #281"
author: "Dave Jacoby"
date: "2024-08-05 18:15:39 -0400"
categories: ""
---

Here we are with [**Weekly Challenge #281!**](https://theweeklychallenge.org/blog/perl-weekly-challenge-281/)

### Task 1: Check Color

> Submitted by: Mohammad Sajid Anwar
> You are given coordinates, a string that represents the coordinates of a square of the chessboard as shown below:

> Write a script to return `true` if the square is **light**, and `false` if the square is **dark**.

#### Let's Talk About It

My attempt is based around doing the simplest mathematical solution, rather than map the board and go from there.

I made a mapping between letters and numbers, and used modulus to determine if the row was odd or even, and solved it aritmetically. Modulus is your friend!

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ bitwise fc postderef say signatures state };

my @examples = (qw{ d3 g5 e6 });

for my $example (@examples) {
    my $output = color_check($example);
    say <<"END";
    Input:  \@str = "$example"
    Output: $output
END
}

sub color_check ($input) {
    my ( $l, $n ) = split //, $input;
    my @lets = 'a' .. 'h';
    my %lets = map { $lets[$_] => $_ } 0 .. -1 + scalar @lets;
    return ( $lets{$l} + ( $n % 2 ) ) % 2 ? 'false' : 'true ';
}
```

```text
$ ./ch-1.pl 
    Input:  @str = "d3"
    Output: true 

    Input:  @str = "g5"
    Output: false

    Input:  @str = "e6"
    Output: true 
```

### Task 2: Knight’s Move

> Submitted by: Peter Campbell Smith
> A Knight in chess can move from its current position to any square two rows or columns plus one column or row away. So in the diagram below, if it starts a **S**, it can move to any of the squares marked **E**.
>
> Write a script which takes a starting position and an ending position and calculates the least number of moves required.

#### Let's Talk About It

This was a fun one.

We are asked to find to provably shortest way, and so we have to go through all the one-step moves before going through the two-step moves. This requires **breadth-first** instead of **depth-first**, and thus, again, we go with iteration instead recursion. This does **NOT** look like a job for Recursion.

I use two hashrefs. One that saves the square name to make finding the end easier, and one that saves the letter and number as a hash of hashes, which makes mapping the board easier. When doing graph-y things, I like mapping the space so I can see the progress. Below is the map of the `g2` to `a8` example.

```text
8   [E]  [_]  [_]  [3]  [_]  [3]  [_]  [3] 
7   [_]  [4]  [3]  [_]  [3]  [4]  [3]  [_] 
6   [_]  [3]  [4]  [3]  [2]  [3]  [2]  [3] 
5   [3]  [4]  [3]  [2]  [3]  [2]  [3]  [2] 
4   [_]  [3]  [2]  [3]  [_]  [1]  [2]  [1] 
3   [3]  [4]  [3]  [2]  [1]  [2]  [3]  [2] 
2   [_]  [3]  [2]  [3]  [2]  [3]  [0]  [3] 
1   [3]  [_]  [3]  [2]  [1]  [2]  [3]  [_] 
     a    b    c    d    e    f    g    h
```

We throw jumps into an array and loop through them. You can dynamically grow the list you're in, as long as you don't try to sort it or anything, because then you're creating an independent list.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ fc say postderef signatures state };

my @examples = ( # added a couple test entries

    [ 'g2', 'a8' ],
    [ 'g2', 'h2' ],
    [ 'a1', 'h8' ],
    [ 'd5', 'e4' ],
);

for my $input (@examples) {
    my $output = knights_move($input);
    my ( $start, $end ) = $input->@*;
    say <<"END";
    Input:  \$start = "$start", \$end = "$end"
    Output: $output
END
}

sub knights_move($input) {
    my ( $start, $end ) = $input->@*;
    my $board = {}; # used for display
    my $done  = {}; # used to track the win
    my @end   = split //, $end;
    $board->{ $end[0] }{ $end[1] } = -2;
    $done->{$end} = 'E';


    # these get us from 'a1' to [7,0] and back
    my @lets = 'a' .. 'h';
    my %lets = map { $lets[$_] => $_ } 0 .. -1 + scalar @lets;
    my %stel = reverse %lets;

    my @nums = reverse 1 .. 8;
    my %nums = map { $nums[$_] => $_ } 0 .. -1 + scalar @nums;
    my %smun = reverse %nums;

    my @moves = ( [ $start, 0 ] );
    my @jumps = (
        [ -1, -2 ], [ -1, 2 ], [ -2, -1 ], [ -2, 1 ],
        [ 1,  -2 ], [ 1,  2 ], [ 2,  -1 ], [ 2,  1 ],
    );

    for my $move (@moves) {
        my ( $space, $depth ) = $move->@*;
        my ( $l, $n ) = split //, $space;
        if ( defined $done->{$space} ) {
            if ( $done->{$space} eq 'E' ) {
                display_board($board);
                return $depth;
            }
            next;
        }

        $board->{$l}{$n} = $depth;
        $done->{$space} = $depth;

        for my $jump (@jumps) {
            my ( $i, $j ) = $jump->@*;
            my $ll = $lets{$l} + $i;
            my $nn = $nums{$n} + $j;

            if ( $ll >= 0 && $ll <= 7 ) {
                if ( $nn >= 0 && $nn <= 7 ) {
                    my $new = join '', $stel{$ll}, $smun{$nn};
                    push @moves, [ $new, $depth + 1 ];
                }
            }
        }
    }

    # There's always a way, but I don't like not providing an unaccounted 
    # case
    return 'fail';
}

sub display_board ($board) {
    my @lets = 'a' .. 'h';
    my @nums = reverse 1 .. 8;
    for my $num (@nums) {
        print qq{$num  };
        for my $let (@lets) {
            my $char = '_';
            if ( defined $board->{$let}{$num} ) {
                $char =
                    $board->{$let}{$num} == -2
                    ? 'E'
                    : $board->{$let}{$num};
            }
            print qq{ [$char] };
        }
        say '';
    }
    say join '    ', ' ', @lets;
}
```

```text
$ ./ch-2.pl 
    Input:  $start = "g2", $end = "a8"
    Output: 4

    Input:  $start = "g2", $end = "h2"
    Output: 3

    Input:  $start = "a1", $end = "h8"
    Output: 6

    Input:  $start = "d5", $end = "e4"
    Output: 2
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
