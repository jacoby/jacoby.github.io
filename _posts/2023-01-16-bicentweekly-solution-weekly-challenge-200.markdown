---
layout: post
title: "Bicent-Weekly Solution: Weekly Challenge 200"
author: "Dave Jacoby"
date: "2023-01-16 15:28:14 -0500"
categories: ""
---

This is the [200th Weekly Challenge](https://theweeklychallenge.org/blog/perl-weekly-challenge-200/)! 200 is **CC** in roman numerals (something I considered doing something with for the title, but nothing good came to mind), and is [the smallest base 10 unprimeable number](<https://en.wikipedia.org/wiki/200_(number)>).

### Task 1: Arithmetic Slices

> Submitted by: Mohammad S Anwar  
> You are given an array of integers.
>
> Write a script to find out all Arithmetic Slices for the given array of integers.
>
> An integer array is called arithmetic if it has at least 3 elements and the differences between any three consecutive elements are the same.

This is another double-loop affairs, being a job for iteration. Again, I suppose you _could_ consider this in terms of recursion, by why? The first loop determines where the slices start, and the next one compares the differeces. If the slice is bigger than 3, it is copied and appended to an output. We copy because the output array is getting a reference to the slice, and in the case of `1,2,3,4,5`, there are six slices that could end up simply being `1,2,3,4,5,6` unless you do the copy thing.

It's also a job for a named loop.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @examples = (
    [ 1, 2, 3, 4 ],
    [ 2, 4, 6, 8, 9, 10, 11 ],
    [2],

);

for my $e (@examples) {
    my @out = arithmatic_slices( $e->@* );
    my $out = join ', ', map { "($_)" } map { join ',', $_->@* } @out;
    my $in  = join ',',  $e->@*;
    say <<"END";
    Input:  \@array = ($in)
    Output: ($out)
END
}

sub arithmatic_slices ( @array ) {
    return () if scalar @array < 3;
    my @output;
    my $max = -1 + scalar @array;
OUTER: for my $i ( 0 .. $max - 1) {
        my $diff = abs( $array[$i] - $array[ $i + 1 ] );
        my @slice;
        push @slice, $array[$i];
        for my $j ( $i + 1 .. $max ) {
            my $ldiff = abs( $array[$j] - $array[ $j - 1 ] );
            if ( $ldiff == $diff ) {
                push @slice, $array[$j];
                my @copy = @slice;
                push @output, \@copy if scalar @slice > 2;
            }
            else {
                next OUTER;
            }
        }
    }
    # first sort makes the arrays numerically sorted by first value
    # second sort makes the arrays sorted by length
    @output = sort { scalar $a->@* <=> scalar $b->@* }
        sort { $a->[0] <=> $b->[0] } @output;
    return @output;
}

```

```text
  jacoby  Bishop  ~  win  200  $  ./ch-1.pl
    Input:  @array = (1,2,3,4)
    Output: ((1,2,3), (2,3,4), (1,2,3,4))

    Input:  @array = (2,4,6,8,9,10,11)
    Output: ((2,4,6), (4,6,8), (8,9,10), (9,10,11), (2,4,6,8), (8,9,10,11))

    Input:  @array = (2)
    Output: ()
```

### Task 2: Seven Segment 200

> Submitted by: Ryan J Thompson  
> A seven segment display is an electronic component, usually used to display digits. The segments are labeled 'a' through 'g' as shown:
>
> **Image Shown In Source**
>
> The encoding of each digit can thus be represented compactly as a truth table:  
> `my @truth = qw<abcdef bc abdeg abcdg bcfg acdfg acdefg abc abcdefg abcfg>;`
>
> Write a program that accepts any decimal number and draws that number as a horizontal sequence of ASCII seven segment displays.
>
> To qualify as a seven segment display, each segment must be drawn (or not drawn) according to your @truth table.

[We kinda did this before](https://jacoby.github.io/2019/10/01/fake-sevensegment-displays-with-perl-and-svg.html), but this time, we're not displaying time and I'm not using SVG.

Well, maybe later.

The hard part is that we're trying to append a block like this ...

```text
   ******
  *      *
  *      *
   ******
  *      *
  *      *
   ******
```

... over and over again. So, basically, we have seven rows, one for each row in the source, and we do the changes we need for that part of the base image, append it to that row of the output, and move on to the next row. I do it as a two-dimensional array, but string concatenation should work.

Going with asterisks instead of vertical and horizontal bars is, to me, a more solid aesthetic choice which makes it so you don't need to know which row you're working on before you work.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };
use Algorithm::Permute;

my @examples = ( 1, 27, 190 .. 200 );
@examples = @ARGV if scalar @ARGV;
my @truth = qw<abcdef bc abdeg abcdg bcfg acdfg acdefg abc abcdefg abcfg>;
my @base  = map { chomp $_; $_ } <DATA>;

for my $e (@examples) {
    seven_segment($e);
}

sub seven_segment( $num ) {
    my @digits = split //, $num;
    my @segs   = 'a' .. 'g';
    my @out;
    for my $digit (@digits) {
        my %segs = map { $_ => 1 } split //, $truth[$digit];
        for my $s ( 0 .. 6 ) {
            my $line = $base[$s];
            for my $seg (@segs) {
                if   ( $segs{$seg} ) { $line =~ s/$seg/*/g }
                else                 { $line =~ s/$seg/ /g }
            }
            push $out[$s]->@*, $line;
        }
    }
    say join "\n", '',map { join '', $_->@* } @out;
}

__DATA__
 aaaaa
f     b
f     b
 ggggg
e     c
e     c
 ddddd

```

```text
  jacoby  Bishop  ~  win  200  $  ./ch-2.pl  200

 *****    *****    *****
      *  *     *  *     *
      *  *     *  *     *
 *****
*        *     *  *     *
*        *     *  *     *
 *****    *****    *****
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
