---
layout: post
title: "Knight thginK: Perl Weekly Challenge #118"
author: "Dave Jacoby"
date: "2021-06-21 16:52:53 -0400"
categories: ""
---

### TASK #1 › Binary Palindrome

> Submitted by: Mohammad S Anwar  
> You are given a positive integer `$N`.
>
> Write a script to find out if the binary representation of the given integer is Palindrome. Print 1 if it is otherwise 0.

I can't recall the last time I needed to deal with binary numbers for work. I mean, it was _kinda_ when campus IT increased the size of the DHCP pool without changing the netmask, so by the iron rules of IP, my smartphone was simultaneously on and not-on the network, but I did only a little work with my phone.

Anyway, the key to getting a binary number from a decimal is `sprintf '%b', $n`.

And the key to reversing a string is `reverse $n`.

Ensuring that it doesn't contain any leading zeros is `0 + $n`.

Because palindromes are strings (we cast them into any other base and they lose the desired feature), comparison is `$n eq $o`.

And, because we want it to return `1` or `0` and `eq` returns `1` or `undef`, we use a ternary operator and do `$n eq $o ? 1 : 0`.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

for my $n ( 0 .. 31 ) {
    say join "\t", '', $n, is_binary_palindrome($n);
}

sub is_binary_palindrome ( $n ) {
    my $b = sprintf '%b', $n;    # sprintf to get binary
    my $r = 0 + reverse $b;      # reverse to get reverse,
                                 # +0 to remove initial zeroes
    return $b eq $r ? 1 : 0;     # ternary because eq returns 1 and undef
}
```

```text
        0       1
        1       1
        2       0
        3       1
        4       0
        5       1
        6       0
        7       1
        8       0
        9       1
        10      0
        11      0
        12      0
        13      0
        14      0
        15      1
        16      0
        17      1
        18      0
        19      0
        20      0
        21      1
        22      0
        23      0
        24      0
        25      0
        26      0
        27      1
        28      0
        29      0
        30      0
        31      1
```

### TASK #2 › Adventure of Knight

> Submitted by: Cheok-Yin Fung  
> A knight is restricted to move on an 8×8 chessboard. The knight is denoted by `N` and its way of movement is the same as what it is defined in Chess. \* represents an empty square. x represents a square with treasure.
>
> > The Knight’s movement is unique. It may move two squares vertically and one square horizontally, or two squares horizontally and one square vertically (with both forming the shape of an L).
>
> There are `6 squares` with treasures.
>
> Write a script to find the path such that Knight can capture all treasures. The Knight can start from the top-left square.

      a b c d e f g h
    8 N * * * * * * * 8
    7 * * * * * * * * 7
    6 * * * * x * * * 6
    5 * * * * * * * * 5
    4 * * x * * * * * 4
    3 * x * * * * * * 3
    2 x x * * * * * * 2
    1 * x * * * * * * 1
      a b c d e f g h

Instead of parsing the above "map", I create it with a function, making an 8x8 matrix. For operational simplicity, I use `0` for an empty square and `1` for a square containing "treasure". In my `display_board` function, I do display it as described.

So, we can jump all over the board. Given `i` and `j` as your current position, you can jump to `i+2,j+1`, `i+1,j+2`, `i+2,j-1`, `i+1,j-2`, `i-2,j+1`, `i-1,j+2`, `i-2,j-1`, or `i-1,j-2`, as long as each of these positions are on the board, meaning (for my code) `>= 0` and `<= 7`.

Y'know what?

**This Looks Like A Job For _RECURSION!_**

It also looks like a **Cornucopia of Infinite Loops** if you're not careful. I add a constraint — No reusing a square — because that will mean that we'll eventually run out of available squares, but there could be legitimate short paths that reuse a square. Maybe two squares. Because I skip those with `next if $trail =~ /$tt/`. Because of that, I cannot assert that I come up with the _shortest_, but I can do _shortest without repeated squares_.

But going through every possible solution takes a long time. I know that this is a solution: `00 21 02 23 04 25 06 27 46 65 44 63 42 61 40 32 11 30 51 70 62 41 20 01 22 03 24 05 26 07 15 34 53 72 60 52 31 50 71`. I know it's the first solution my code finds. I suppose I should translate it to Chess format...

For the checking if it's a good path, I map `00` to `[0,0]` to `$board->[0][0]`, and then use `sum` from [List::Util](https://metacpan.org/pod/List::Util) (because I _know_ that I will get `1` or `0` everywhere on the board), and check if it's `6`. I suppose I shouldn't have hardcoded he locations, to allow a "map" with more or less than six treasures. Alas...

I could see many possible additions/fixes to this code. Reading maps as input. Displaying paths in Chess notation. Command-line flag to exit on first good path. Return successful paths instead of using a global to hold it. If this was _real_ code, I would definitely do some of it.

> BONUS: If you believe that your algorithm can output one of the shortest possible path.

I'm sure it can do _one of the shortest_. I am less sure about _the shortest_, and because of the joys of recursing through almost-all possible paths, it takes a long time to get everything.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

use List::Util qw{ sum };

use JSON;
my $json = JSON->new;

my $shortest = ' ' x 1000;
my $board    = create_board();

display_board($board);
solve_board($board);
display_board( $board, $shortest );

sub solve_board ( $board, $trail = undef ) {
    $trail //= '00';
    my @trail = map { [ split // ] } split / +/, $trail;
    my ( $i, $j ) = $trail[-1]->@*;

    my $t     = $trail[-1];
    my $score = check_board( $board, $trail );
    if ( $score == 6 ) {
        if ( length $trail < length $shortest ) {
            $shortest = $trail if length $trail < length $shortest;
            display_board( $board, $shortest );
            say join "\n\t", length $shortest, $shortest;
            return $trail;
        }
    }

    for my $im ( -2, 2 ) {
        my $ii = $i + $im;
        next if $ii < 0 || $ii > 7;
        for my $jm ( -1, 1 ) {
            my $jj = $j + $jm;
            next if $jj < 0 || $jj > 7;
            my $tt = "$ii$jj";
            next if $tt eq $t;
            next if $trail =~ /$tt/;
            solve_board( $board, "$trail $tt" );
        }
    }
    for my $im ( -1, 1 ) {
        my $ii = $i + $im;
        next if $ii < 0 || $ii > 7;
        for my $jm ( -2, 2 ) {
            my $jj = $j + $jm;
            next if $jj < 0 || $jj > 7;
            my $tt = "$ii$jj";
            next if $tt eq $t;
            next if $trail =~ /$tt/;
            solve_board( $board, "$trail $tt" );
        }
    }
}

sub check_board ( $board, $trail ) {
    return sum
        map { my ( $i, $j ) = $_->@*; $board->[$i][$j] }
        map { [ split // ] } split / /, $trail;
}

sub create_board {
    my $board;
    for my $i ( 0 .. 7 ) {
        for my $j ( 0 .. 7 ) {
            $board->[$i][$j] = 0;
        }
    }
    $board->[6][0] = 1;
    $board->[5][1] = 1;
    $board->[6][1] = 1;
    $board->[7][1] = 1;
    $board->[4][2] = 1;
    $board->[2][4] = 1;
    return $board;
}

sub display_board ( $board, $trail = '' ) {
    my @i = reverse 1 .. 8;
    say '';
    say $trail;
    say join ' ', ' ', 'a' .. 'h';
    for my $i ( 0 .. 7 ) {
        print $i[$i];
        for my $j ( 0 .. 7 ) {
            my $tt = "$i$j";
            if ( $trail =~ $tt ) {
                print $board->[$i][$j] ? ' X' : ' .';
            }
            else {
                print $board->[$i][$j] ? ' x' : ' *';
            }
        }
        say ' ' . $i[$i];
    }
    say join ' ', ' ', 'a' .. 'h';
    say '';
}
```

Because I want to upload this and my test is still running, here's what I have so far.

```text
  a b c d e f g h
8 * * * * * * * * 8
7 * * * * * * * * 7
6 * * * * x * * * 6
5 * * * * * * * * 5
4 * * x * * * * * 4
3 * x * * * * * * 3
2 x x * * * * * * 2
1 * x * * * * * * 1
  a b c d e f g h

00 21 02 23 04 25 06 27 46 65 44 63 42 61 40 32 11 30 51 70 62 41 20 01 22 03 24 05 26 07 15 34 53 72 60 52 31 50 71
  a b c d e f g h
8 . . . . . . . . 8
7 * . * * * . * * 7
6 . . . . X . . . 6
5 . . . * . * * * 5
4 . . X * . * . * 4
3 . X . . * * * * 3
2 X X . . * . * * 2
1 . X . * * * * * 1
  a b c d e f g h

116
        00 21 02 23 04 25 06 27 46 65 44 63 42 61 40 32 11 30 51 70 62 41 20 01 22 03 24 05 26 07 15 34 53 72 60 52 31 50 71
00 21 02 23 04 25 06 27 46 65 44 63 42 61 40 32 11 30 51 70 62 41 20 01 22 03 24 05 26 07 15 34 53 72 60 52 71
  a b c d e f g h
8 . . . . . . . . 8
7 * . * * * . * * 7
6 . . . . X . . . 6
5 . * . * . * * * 5
4 . . X * . * . * 4
3 * X . . * * * * 3
2 X X . . * . * * 2
1 . X . * * * * * 1
  a b c d e f g h

110
        00 21 02 23 04 25 06 27 46 65 44 63 42 61 40 32 11 30 51 70 62 41 20 01 22 03 24 05 26 07 15 34 53 72 60 52 71
00 21 02 23 04 25 06 27 46 65 44 63 42 61 40 32 11 30 51 70 62 41 20 01 22 03 24 05 26 45 64 72 60 52 71
  a b c d e f g h
8 . . . . . . . * 8
7 * . * * * * * * 7
6 . . . . X . . . 6
5 . * . * * * * * 5
4 . . X * . . . * 4
3 * X . * * * * * 3
2 X X . . . . * * 2
1 . X . * * * * * 1
  a b c d e f g h

104
        00 21 02 23 04 25 06 27 46 65 44 63 42 61 40 32 11 30 51 70 62 41 20 01 22 03 24 05 26 45 64 72 60 52 71
```

I'm seeing my computer wants an upgrade and reboot, so I might not let this run to completion, but if I do, I will update this blog post.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
