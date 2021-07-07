---
layout: post
title: "Yaas, Queens! Solving the Eight Queens Problem with Recursion"
author: "Dave Jacoby"
date: "2021-07-06 21:38:15 -0400"
categories: ""
---

A few years ago, I read something called ["Hexing the technical interview"](https://aphyr.com/posts/341-hexing-the-technical-interview) about a long-lived Scandinavian wizard coding her way through a modern coding interview, using the eldritch spells of _Java_ and _Clojure_.

![ "The javanisse. Surely you have heard of him! He is a small, magical man — something like a gnome — who inhabits every JVM. If you do not set out an extra constant for him, he can cause segfaults." ](https://jacoby.github.io/images/javanissen.jpg)

In a later entry, ["Typing the technical interview"](https://aphyr.com/posts/342-typing-the-technical-interview), the same character dives deep into the depths of _Haskell_ to solve the [Eight Queens problem](https://en.wikipedia.org/wiki/Eight_queens_puzzle).

> _“Are you really unable,” you ask, voice as calm as stone, “to imagine eight powerful women in the same room without them trying to kill each other?”_

I am reasonably sure that I have worked on this before, but I decided while sitting on the couch to engage with it again. I, in fact, started engaging the problem on my phone using [JuiceSSH](https://play.google.com/store/apps/details?id=com.sonelli.juicessh&hl=en_US&gl=US).

![My Code on a remote machine via JuiceSSH](https://jacoby.github.io/images/juicessh.jpg)

I just love always having a terminal in my pocket.

I worked on handling the code to display the board and determine if there was a problem, because I knew I was going to go recursive with this problem.

Because it is easy to treat the rows and columns of a two-dimensional array as one dimension, I did just that, using `map` to just get the eight values in that direction, then `sum` from [List::Util](https://metacpan.org/pod/List::Util), which I go to so often it's like a broken record. If the sum is `0` or `1`, then everything is fine, but if it's `2` or greater, then there's a problem and I return a signal meaning **no**. I kinda mark it backwards, I think, but oh well.

Because going down the diagonals is harder, I shunt that off to functions `diagl` and `diagr`. I double up on the longest diagonal, but it's _O(n)_ and `n` equals 8, so it can't be bad.

I also check if we're done by flattening a two-dimensional array into a one-dimensional away and running `sum` on it. `sum` can be _such_ a useful tool!

This pretty much leaves the actual solving of it, and I try to get every possible solution...

```text
PS C:\Users\jacob> .\8queens.pl
1

 # . . . . . . .
 . . . . . . # .
 . . . . # . . .
 . . . . . . . #
 . # . . . . . .
 . . . # . . . .
 . . . . . # . .
 . . # . . . . .

2

 # . . . . . . .
 . . . . . . # .
 . . . # . . . .
 . . . . . # . .
 . . . . . . . #
 . # . . . . . .
 . . . . # . . .
 . . # . . . . .

3

 # . . . . . . .
 . . . . . # . .
 . . . . . . . #
 . . # . . . . .
 . . . . . . # .
 . . . # . . . .
 . # . . . . . .
 . . . . # . . .

...

90

 . . . . # . . .
 . # . . . . . .
 . . . # . . . .
 . . . . . . # .
 . . # . . . . .
 . . . . . . . #
 . . . . . # . .
 # . . . . . . .

91

 . . # . . . . .
 . . . . # . . .
 . # . . . . . .
 . . . . . . . #
 . . . . . # . .
 . . . # . . . .
 . . . . . . # .
 # . . . . . . .

92

 . . # . . . . .
 . . . . . # . .
 . . . # . . . .
 . # . . . . . .
 . . . . . . . #
 . . . . # . . .
 . . . . . . # .
 # . . . . . . .

PS C:\Users\jacob>
```

[Shub-Internet](https://en.wikipedia.org/wiki/Eight_queens_puzzle) asserts that there are 92 distinct solutions, so this is it!


#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use utf8;
binmode STDOUT, ':utf8';
use feature qw{ postderef say signatures state };
no warnings qw{ experimental::postderef experimental::signatures };

use List::Util qw{ sum  };
use JSON;
my $json = JSON->new;

my $board->@* = map {
    [ map { 0 } 0 .. 7 ]
} 0 .. 7;

solve_queens($board);

sub solve_queens ( $board, $row = 0 ) {
    return if is_done($board);
    my $c;
    for my $i ( 0 .. 7 ) {
        for my $j ( 0 .. 7 ) { $c->[$i][$j] = $board->[$i][$j]; }
    }
    for my $col ( 0 .. 7 ) {
        $c->[$col][$row] = 1;
        if ( judge_board($c) ) {
            if ( is_done($c) ) {
                state $count = 1;
                say $count++;
                display_board($c);
            }
            solve_queens( $c, $row + 1 );
        }
        $c->[$col][$row] = 0;
    }
    return;
}

sub judge_board ($board) {

    # vertical
    for my $i ( 0 .. 7 ) {
        my $s = sum map { $board->[$i][$_] } 0 .. 7;
        return 0 if $s > 1;
    }

    # horizontal
    for my $i ( 0 .. 7 ) {
        my $s = sum map { $board->[$_][$i] } 0 .. 7;
        return 0 if $s > 1;
    }

    #diagonal
    for my $i ( 0 .. 7 ) {
        my $s1 = sum diagr( $board, $i, 0 );
        return 0 if $s1 > 1;
        my $s2 = sum diagr( $board, 0, $i );
        return 0 if $s2 > 1;
        my $s3 = sum diagl( $board, 0, $i );
        return 0 if $s3 > 1;
        my $s4 = sum diagl( $board, $i, 7 );
        return 0 if $s4 > 1;
    }
    return 1;
}

sub is_done ($board) {
    my $x = sum map { $_->@* } $board->@*;
    return $x == 8 ? 1 : 0;
}

sub diagl ( $board, $i, $j ) {
    my @output;
    while ( defined $board->[$i][$j] && $j >= 0 ) {
        push @output, $board->[$i][$j];
        $i++;
        $j--;
    }
    return @output;
}

sub diagr ( $board, $i, $j ) {
    my @output;
    while ( defined $board->[$i][$j] ) {
        push @output, $board->[$i][$j];
        $i++;
        $j++;
    }
    return @output;
}

sub display_board ($board) {
    say '';
    for my $i ( 0 .. 7 ) {
        for my $j ( 0 .. 7 ) {
            my $k = $board->[$i][$j];
            my $v = $k ? '#' : '.';
            print qq{ $v};
        }
        say '';
    }
    say '';
}
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
