---
layout: post
title: "Play Fair and By The Book: Weekly Challenge #162"
author: "Dave Jacoby"
date: "2022-04-26 19:55:29 -0400"
categories: ""
---

This is [Weekly Challenge 162](https://theweeklychallenge.org/blog/perl-weekly-challenge-162/)! **162** _seems_ fairly simple, but it is **2** \* **81**, which is **3<sup>4</sup>**. This means that **162** is a [3-smooth number](https://en.wikipedia.org/wiki/Smooth_number). I knew talkers and criminals could be smooth, but not numbers.

### Task 1: ISBN-13

> Submitted by: Mohammad S Anwar
>
> Write a script to generate the check digit of given ISBN-13 code. Please refer to [wikipedia](https://en.wikipedia.org/wiki/ISBN#ISBN-13_check_digit_calculation) for more information.

I caught the Easter Egg, Mohammad. Clever.

I don't know that most people these days think much about **check values**, especially when you mostly live within the higher languages and parts of the stack. Basically, if you do this transform on the numbers, you'll know it's correct. Here, it's that every other number is multiplied by 3, the numbers are summed, and they should, when modulused by 10, should return **0**.

_I_ did it with a `map` and perrenial favorite `sun0` from [List::Util](https://metacpan.org/pod/List::Util). Seems like I always drag out something from List::Util every challenge. _So_ helpful.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ sum0 };

my @samples;
push @samples, '978-0-306-40615-7';
push @samples, '978-0596001735';
push @samples, '978-0596003135';
push @samples, '978-0596004927';
push @samples, '978-1492094951';
push @samples, '978-1680500882';

for my $sample (@samples) {
    my $check = find_check_digit($sample);
    say <<"END";
    ISBN-13: $sample
    Check:   $check
END
}

sub find_check_digit( $isbn13) {
    my @digits = $isbn13 =~ /(\d)/gmix;
    pop @digits;
    push @digits, 0;
    my @x = map { $_ % 2 == 1 ? 3 * $digits[$_] : $digits[$_] } 0 .. 12;
    return 10 - ( ( sum0 @x ) % 10 );
}
```

```text
$ ./ch-1.pl
    ISBN-13: 978-0-306-40615-7
    Check:   7

    ISBN-13: 978-0596001735
    Check:   5

    ISBN-13: 978-0596003135
    Check:   5

    ISBN-13: 978-0596004927
    Check:   7

    ISBN-13: 978-1492094951
    Check:   1

    ISBN-13: 978-1680500882
    Check:   2
```

### Task 2: Wheatstone-Playfair

> Submitted by: Roger Bell_West
>
> Implement encryption and decryption using the [Wheatstone-Playfair cipher](https://en.wikipedia.org/wiki/Playfair_cipher).

> "There are two kinds of cyrptography in this world: cryptoography that will stop your kid sister from readiong your files, and crytptography that will stop major governments from reading your files." — Bruce Schneier, _Applied Cryptography_, p. xix

This is an example of the former.

But it's fun. That's why we do these things.

First thing I worked on is the Playfair Square. Our writing system has 26 characters, which is 2 * 13, which makes *ROT13\* so quick and easy to handle, but if you want to have some choices, turning Js into Is gives you 25, which is five by five (Hi, Faith) and very useful.

That's where I stopped things on Monday. I'm back at the standing desk and I don't have my coding legs back yet. Then was splitting the characters into digrams. J becomes I, everything not alphabetical gets jettisoned — modern cryptography _had_ to be invented so we can communicate numbers — and we break things into pairs, with two rules.

- have a pair in a digram that's repeated letters? Take one, add an **X** and move the second to the next digram
- have only one letter left? Throw an **X** at it

This means **Hello World** becomes **HE LX LO WO RL DX**.

And now that we have pairs, we need to find how they're related. 3 cases:

- **Same column:** Everything moves down one, flipping to the top if you run off the square
- **Same row:** Everything moves right one, flipping to the left if you run off the square
- **Everything else:** You make a rectangle based on the position, and you switch to "neutral corners".

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use JSON;
my $json = JSON->new->canonical;

my @tests;
push @tests,
    [
    'playfair example',
    'hide the gold in the tree stump',
    'bmodzbxdnabekudmuixmmouvif'
    ];
push @tests,
    [ 'perl and raku', 'the weekly challenge', 'siderwrdulfipaarkcrw' ];

for my $test (@tests) {
    my ( $key, $plain, $cypher ) = $test->@*;
    my @square = make_playfair_square($key);
    my $c1     = encrypt( $key, $plain );
    my $p1     = decrypt( $key, $cypher );
    say join "\n\t", $key, $plain, $c1, $cypher, $p1,
        $cypher eq $c1 ? 'true' : 'false';
    say '';
}
exit;

sub encrypt ( $key, $plaintext ) {
    my @square = make_playfair_square($key);
    my @input  = make_digrams($plaintext);
    my @output;
    for my $digram (@input) {
        my ( $m,  $n )  = split //, $digram;
        my ( $mx, $my ) = find_position( $m, @square );
        my ( $nx, $ny ) = find_position( $n, @square );
        if    (0) { 'NO-OP' }
        elsif ( $mx == $nx ) {
            my $mm = $square[$mx][ ( $my + 1 ) % 5 ];
            my $nn = $square[$nx][ ( $ny + 1 ) % 5 ];
            push @output, $mm . $nn;
        }
        elsif ( $my == $ny ) {
            my $mm = $square[ ( $mx + 1 ) % 5 ][$my];
            my $nn = $square[ ( $nx + 1 ) % 5 ][$ny];
            push @output, $mm . $nn;
        }
        else {
            my $mm = $square[$mx][$ny];
            my $nn = $square[$nx][$my];
            push @output, $mm . $nn;
        }
    }
    my $zed = '';
    return lc join '', @output;
}

sub decrypt ( $key, $cyphertext ) {
    my @square = make_playfair_square($key);
    my @input  = make_digrams($cyphertext);
    my @output;
    for my $digram (@input) {
        my ( $m,  $n )  = split //, $digram;
        my ( $mx, $my ) = find_position( $m, @square );
        my ( $nx, $ny ) = find_position( $n, @square );
        if    (0) { 'NO-OP' }
        elsif ( $mx == $nx ) {
            my $mm = $square[$mx][ ( $my + 4 ) % 5 ];
            my $nn = $square[$nx][ ( $ny + 4 ) % 5 ];
            push @output, $mm . $nn;
        }
        elsif ( $my == $ny ) {
            my $mm = $square[ ( $mx + 4 ) % 5 ][$my];
            my $nn = $square[ ( $nx + 4 ) % 5 ][$ny];
            push @output, $mm . $nn;
        }
        else {
            my $mm = $square[$mx][$ny];
            my $nn = $square[$nx][$my];
            push @output, $mm . $nn;
        }
    }
    my $zed = '';
    return lc join '', @output;
}

sub make_playfair_square( $key ) {
    my %h;
    $key =~ s/j/i/gmix;
    my @array =
        grep { !$h{$_}++ }
        grep { /\w/ } ( split //, lc $key ),
        'a' .. 'i', 'k' .. 'z';
    @array = @array[ 0 .. 24 ];
    my @square;
    for my $i ( 0 .. 24 ) {
        my $x = $i % 5;
        my $y = int $i / 5;
        $square[$y][$x] = uc $array[$i];
    }
    return @square;
}

sub make_digrams ( $text ) {
    my @digrams;
    my $pt = $text;
    $pt =~ s/[jJ]/i/gmix;
    $pt =~ s/[^A-Za-z]+//gmix;
    while ($pt) {
        my $digram = substr( $pt, 0, 2 );
        if ( substr( $digram, 0, 1 ) eq substr( $digram, 1, 1, ) ) {
            $digram = substr( $pt, 0, 1 ) . 'X';
            substr( $pt, 0, 1 ) = '';
        }
        else { substr( $pt, 0, 2 ) = ''; }
        $digram .= 'X' unless length $digram == 2;
        push @digrams, uc $digram;
    }
    return @digrams;
}

sub find_position ( $letter, @square ) {
    exit unless $letter =~ /[A-Z]/mix;
    $letter = uc $letter;
    for my $x ( 0 .. 4 ) {
        for my $y ( 0 .. 4 ) {
            my $s = $square[$x][$y] || '-';
            return ( $x, $y ) if $letter eq $s;
        }
    }
    return ( -1, -1 );
}
```

```text
$ ./ch-2.pl
playfair example
        hide the gold in the tree stump
        bmodzbxdnabekudmuixmmouvif
        bmodzbxdnabekudmuixmmouvif
        hidethegoldinthetrexestump
        true

perl and raku
        the weekly challenge
        siderwrdulfipaarkcrw
        siderwrdulfipaarkcrw
        thewexeklychallengex
        true
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
