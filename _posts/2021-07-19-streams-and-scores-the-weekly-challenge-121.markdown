---
layout: post
title: "Streams and Scores: The Weekly Challenge #121"
author: "Dave Jacoby"
date: "2021-07-19 16:19:09 -0400"
categories: ""
---

I'm doing this one in reverse because I realized this in reverse.

### TASK #2 › Basketball Points

> Submitted by: Mohammad S Anwar  
> You are given a score `$S`.
>
> You can win basketball points e.g. 1 point, 2 points and 3 points.
>
> Write a script to find out the different ways you can score `$S`.

Let's get this over with.

[**This looks like a job for _Recursion!_**](https://www.google.com/search?q=%22this+looks+like+a+job+for+recursion%22)

[There are three ways to score:](https://jr.nba.com/three-ways-to-score/)

- _One Point_ for a free throw
- _Two Points_ for a normal shot
- _Three Points_ for a shot from beyond the eponymous "Three-Point Line"

We want the scores in full, so we handle the case of one point, then two points, then three points.

```perl
    for my $i ( 1 .. 3 ) {
        my $x->@* = $s->@*;
        push $x->@*, $i;
        my @local = bball( $n, $x );
        for my $l (@local) {
            next unless defined $l;
            next if ref $l eq 'ARRAY';
            push @output, $l;
        }
```

My first pass had me just pushing the output to STDOUT, but to get the correct formatting, I started passing the values back.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use feature qw{say state signatures};
use strict;
use warnings;
use utf8;
no warnings qw{ experimental };

use JSON;
my $json = JSON->new->pretty->canonical;

use List::Util qw{  sum0 };
for my $s ( 1 .. 10 ) {
    my @x = bball($s);
    say qq{INPUT:\t\$s = $s};
    say join "\t", "OUTPUT:", map { qq{$_\n}} @x;
}

sub bball ( $n = 5, $s = [] ) {
    my $sum = sum0 $s->@*;
    return undef if $sum > $n;
    return join ' ', $s->@* if $sum == $n;
    my @output;
    for my $i ( 1 .. 3 ) {
        my $x->@* = $s->@*;
        push $x->@*, $i;
        my @local = bball( $n, $x );
        for my $l (@local) {
            next unless defined $l;
            next if ref $l eq 'ARRAY';
            push @output, $l;
        }
    }
    return @output;
}
```

```text
INPUT:	$s = 1
OUTPUT:	1

INPUT:	$s = 2
OUTPUT:	1 1
	2

INPUT:	$s = 3
OUTPUT:	1 1 1
	1 2
	2 1
	3

INPUT:	$s = 4
OUTPUT:	1 1 1 1
	1 1 2
	1 2 1
	1 3
	2 1 1
	2 2
	3 1

INPUT:	$s = 5
OUTPUT:	1 1 1 1 1
	1 1 1 2
	1 1 2 1
	1 1 3
	1 2 1 1
	1 2 2
	1 3 1
	2 1 1 1
	2 1 2
	2 2 1
	2 3
	3 1 1
	3 2

INPUT:	$s = 6
OUTPUT:	1 1 1 1 1 1
	1 1 1 1 2
	1 1 1 2 1
	1 1 1 3
	1 1 2 1 1
	1 1 2 2
	1 1 3 1
	1 2 1 1 1
	1 2 1 2
	1 2 2 1
	1 2 3
	1 3 1 1
	1 3 2
	2 1 1 1 1
	2 1 1 2
	2 1 2 1
	2 1 3
	2 2 1 1
	2 2 2
	2 3 1
	3 1 1 1
	3 1 2
	3 2 1
	3 3

INPUT:	$s = 7
OUTPUT:	1 1 1 1 1 1 1
	1 1 1 1 1 2
	1 1 1 1 2 1
	1 1 1 1 3
	1 1 1 2 1 1
	1 1 1 2 2
	1 1 1 3 1
	1 1 2 1 1 1
	1 1 2 1 2
	1 1 2 2 1
	1 1 2 3
	1 1 3 1 1
	1 1 3 2
	1 2 1 1 1 1
	1 2 1 1 2
	1 2 1 2 1
	1 2 1 3
	1 2 2 1 1
	1 2 2 2
	1 2 3 1
	1 3 1 1 1
	1 3 1 2
	1 3 2 1
	1 3 3
	2 1 1 1 1 1
	2 1 1 1 2
	2 1 1 2 1
	2 1 1 3
	2 1 2 1 1
	2 1 2 2
	2 1 3 1
	2 2 1 1 1
	2 2 1 2
	2 2 2 1
	2 2 3
	2 3 1 1
	2 3 2
	3 1 1 1 1
	3 1 1 2
	3 1 2 1
	3 1 3
	3 2 1 1
	3 2 2
	3 3 1

INPUT:	$s = 8
OUTPUT:	1 1 1 1 1 1 1 1
	1 1 1 1 1 1 2
	1 1 1 1 1 2 1
	1 1 1 1 1 3
	1 1 1 1 2 1 1
	1 1 1 1 2 2
	1 1 1 1 3 1
	1 1 1 2 1 1 1
	1 1 1 2 1 2
	1 1 1 2 2 1
	1 1 1 2 3
	1 1 1 3 1 1
	1 1 1 3 2
	1 1 2 1 1 1 1
	1 1 2 1 1 2
	1 1 2 1 2 1
	1 1 2 1 3
	1 1 2 2 1 1
	1 1 2 2 2
	1 1 2 3 1
	1 1 3 1 1 1
	1 1 3 1 2
	1 1 3 2 1
	1 1 3 3
	1 2 1 1 1 1 1
	1 2 1 1 1 2
	1 2 1 1 2 1
	1 2 1 1 3
	1 2 1 2 1 1
	1 2 1 2 2
	1 2 1 3 1
	1 2 2 1 1 1
	1 2 2 1 2
	1 2 2 2 1
	1 2 2 3
	1 2 3 1 1
	1 2 3 2
	1 3 1 1 1 1
	1 3 1 1 2
	1 3 1 2 1
	1 3 1 3
	1 3 2 1 1
	1 3 2 2
	1 3 3 1
	2 1 1 1 1 1 1
	2 1 1 1 1 2
	2 1 1 1 2 1
	2 1 1 1 3
	2 1 1 2 1 1
	2 1 1 2 2
	2 1 1 3 1
	2 1 2 1 1 1
	2 1 2 1 2
	2 1 2 2 1
	2 1 2 3
	2 1 3 1 1
	2 1 3 2
	2 2 1 1 1 1
	2 2 1 1 2
	2 2 1 2 1
	2 2 1 3
	2 2 2 1 1
	2 2 2 2
	2 2 3 1
	2 3 1 1 1
	2 3 1 2
	2 3 2 1
	2 3 3
	3 1 1 1 1 1
	3 1 1 1 2
	3 1 1 2 1
	3 1 1 3
	3 1 2 1 1
	3 1 2 2
	3 1 3 1
	3 2 1 1 1
	3 2 1 2
	3 2 2 1
	3 2 3
	3 3 1 1
	3 3 2

INPUT:	$s = 9
OUTPUT:	1 1 1 1 1 1 1 1 1
	1 1 1 1 1 1 1 2
	1 1 1 1 1 1 2 1
	1 1 1 1 1 1 3
	1 1 1 1 1 2 1 1
	1 1 1 1 1 2 2
	1 1 1 1 1 3 1
	1 1 1 1 2 1 1 1
	1 1 1 1 2 1 2
	1 1 1 1 2 2 1
	1 1 1 1 2 3
	1 1 1 1 3 1 1
	1 1 1 1 3 2
	1 1 1 2 1 1 1 1
	1 1 1 2 1 1 2
	1 1 1 2 1 2 1
	1 1 1 2 1 3
	1 1 1 2 2 1 1
	1 1 1 2 2 2
	1 1 1 2 3 1
	1 1 1 3 1 1 1
	1 1 1 3 1 2
	1 1 1 3 2 1
	1 1 1 3 3
	1 1 2 1 1 1 1 1
	1 1 2 1 1 1 2
	1 1 2 1 1 2 1
	1 1 2 1 1 3
	1 1 2 1 2 1 1
	1 1 2 1 2 2
	1 1 2 1 3 1
	1 1 2 2 1 1 1
	1 1 2 2 1 2
	1 1 2 2 2 1
	1 1 2 2 3
	1 1 2 3 1 1
	1 1 2 3 2
	1 1 3 1 1 1 1
	1 1 3 1 1 2
	1 1 3 1 2 1
	1 1 3 1 3
	1 1 3 2 1 1
	1 1 3 2 2
	1 1 3 3 1
	1 2 1 1 1 1 1 1
	1 2 1 1 1 1 2
	1 2 1 1 1 2 1
	1 2 1 1 1 3
	1 2 1 1 2 1 1
	1 2 1 1 2 2
	1 2 1 1 3 1
	1 2 1 2 1 1 1
	1 2 1 2 1 2
	1 2 1 2 2 1
	1 2 1 2 3
	1 2 1 3 1 1
	1 2 1 3 2
	1 2 2 1 1 1 1
	1 2 2 1 1 2
	1 2 2 1 2 1
	1 2 2 1 3
	1 2 2 2 1 1
	1 2 2 2 2
	1 2 2 3 1
	1 2 3 1 1 1
	1 2 3 1 2
	1 2 3 2 1
	1 2 3 3
	1 3 1 1 1 1 1
	1 3 1 1 1 2
	1 3 1 1 2 1
	1 3 1 1 3
	1 3 1 2 1 1
	1 3 1 2 2
	1 3 1 3 1
	1 3 2 1 1 1
	1 3 2 1 2
	1 3 2 2 1
	1 3 2 3
	1 3 3 1 1
	1 3 3 2
	2 1 1 1 1 1 1 1
	2 1 1 1 1 1 2
	2 1 1 1 1 2 1
	2 1 1 1 1 3
	2 1 1 1 2 1 1
	2 1 1 1 2 2
	2 1 1 1 3 1
	2 1 1 2 1 1 1
	2 1 1 2 1 2
	2 1 1 2 2 1
	2 1 1 2 3
	2 1 1 3 1 1
	2 1 1 3 2
	2 1 2 1 1 1 1
	2 1 2 1 1 2
	2 1 2 1 2 1
	2 1 2 1 3
	2 1 2 2 1 1
	2 1 2 2 2
	2 1 2 3 1
	2 1 3 1 1 1
	2 1 3 1 2
	2 1 3 2 1
	2 1 3 3
	2 2 1 1 1 1 1
	2 2 1 1 1 2
	2 2 1 1 2 1
	2 2 1 1 3
	2 2 1 2 1 1
	2 2 1 2 2
	2 2 1 3 1
	2 2 2 1 1 1
	2 2 2 1 2
	2 2 2 2 1
	2 2 2 3
	2 2 3 1 1
	2 2 3 2
	2 3 1 1 1 1
	2 3 1 1 2
	2 3 1 2 1
	2 3 1 3
	2 3 2 1 1
	2 3 2 2
	2 3 3 1
	3 1 1 1 1 1 1
	3 1 1 1 1 2
	3 1 1 1 2 1
	3 1 1 1 3
	3 1 1 2 1 1
	3 1 1 2 2
	3 1 1 3 1
	3 1 2 1 1 1
	3 1 2 1 2
	3 1 2 2 1
	3 1 2 3
	3 1 3 1 1
	3 1 3 2
	3 2 1 1 1 1
	3 2 1 1 2
	3 2 1 2 1
	3 2 1 3
	3 2 2 1 1
	3 2 2 2
	3 2 3 1
	3 3 1 1 1
	3 3 1 2
	3 3 2 1
	3 3 3

INPUT:	$s = 10
OUTPUT:	1 1 1 1 1 1 1 1 1 1
	1 1 1 1 1 1 1 1 2
	1 1 1 1 1 1 1 2 1
	1 1 1 1 1 1 1 3
	1 1 1 1 1 1 2 1 1
	1 1 1 1 1 1 2 2
	1 1 1 1 1 1 3 1
	1 1 1 1 1 2 1 1 1
	1 1 1 1 1 2 1 2
	1 1 1 1 1 2 2 1
	1 1 1 1 1 2 3
	1 1 1 1 1 3 1 1
	1 1 1 1 1 3 2
	1 1 1 1 2 1 1 1 1
	1 1 1 1 2 1 1 2
	1 1 1 1 2 1 2 1
	1 1 1 1 2 1 3
	1 1 1 1 2 2 1 1
	1 1 1 1 2 2 2
	1 1 1 1 2 3 1
	1 1 1 1 3 1 1 1
	1 1 1 1 3 1 2
	1 1 1 1 3 2 1
	1 1 1 1 3 3
	1 1 1 2 1 1 1 1 1
	1 1 1 2 1 1 1 2
	1 1 1 2 1 1 2 1
	1 1 1 2 1 1 3
	1 1 1 2 1 2 1 1
	1 1 1 2 1 2 2
	1 1 1 2 1 3 1
	1 1 1 2 2 1 1 1
	1 1 1 2 2 1 2
	1 1 1 2 2 2 1
	1 1 1 2 2 3
	1 1 1 2 3 1 1
	1 1 1 2 3 2
	1 1 1 3 1 1 1 1
	1 1 1 3 1 1 2
	1 1 1 3 1 2 1
	1 1 1 3 1 3
	1 1 1 3 2 1 1
	1 1 1 3 2 2
	1 1 1 3 3 1
	1 1 2 1 1 1 1 1 1
	1 1 2 1 1 1 1 2
	1 1 2 1 1 1 2 1
	1 1 2 1 1 1 3
	1 1 2 1 1 2 1 1
	1 1 2 1 1 2 2
	1 1 2 1 1 3 1
	1 1 2 1 2 1 1 1
	1 1 2 1 2 1 2
	1 1 2 1 2 2 1
	1 1 2 1 2 3
	1 1 2 1 3 1 1
	1 1 2 1 3 2
	1 1 2 2 1 1 1 1
	1 1 2 2 1 1 2
	1 1 2 2 1 2 1
	1 1 2 2 1 3
	1 1 2 2 2 1 1
	1 1 2 2 2 2
	1 1 2 2 3 1
	1 1 2 3 1 1 1
	1 1 2 3 1 2
	1 1 2 3 2 1
	1 1 2 3 3
	1 1 3 1 1 1 1 1
	1 1 3 1 1 1 2
	1 1 3 1 1 2 1
	1 1 3 1 1 3
	1 1 3 1 2 1 1
	1 1 3 1 2 2
	1 1 3 1 3 1
	1 1 3 2 1 1 1
	1 1 3 2 1 2
	1 1 3 2 2 1
	1 1 3 2 3
	1 1 3 3 1 1
	1 1 3 3 2
	1 2 1 1 1 1 1 1 1
	1 2 1 1 1 1 1 2
	1 2 1 1 1 1 2 1
	1 2 1 1 1 1 3
	1 2 1 1 1 2 1 1
	1 2 1 1 1 2 2
	1 2 1 1 1 3 1
	1 2 1 1 2 1 1 1
	1 2 1 1 2 1 2
	1 2 1 1 2 2 1
	1 2 1 1 2 3
	1 2 1 1 3 1 1
	1 2 1 1 3 2
	1 2 1 2 1 1 1 1
	1 2 1 2 1 1 2
	1 2 1 2 1 2 1
	1 2 1 2 1 3
	1 2 1 2 2 1 1
	1 2 1 2 2 2
	1 2 1 2 3 1
	1 2 1 3 1 1 1
	1 2 1 3 1 2
	1 2 1 3 2 1
	1 2 1 3 3
	1 2 2 1 1 1 1 1
	1 2 2 1 1 1 2
	1 2 2 1 1 2 1
	1 2 2 1 1 3
	1 2 2 1 2 1 1
	1 2 2 1 2 2
	1 2 2 1 3 1
	1 2 2 2 1 1 1
	1 2 2 2 1 2
	1 2 2 2 2 1
	1 2 2 2 3
	1 2 2 3 1 1
	1 2 2 3 2
	1 2 3 1 1 1 1
	1 2 3 1 1 2
	1 2 3 1 2 1
	1 2 3 1 3
	1 2 3 2 1 1
	1 2 3 2 2
	1 2 3 3 1
	1 3 1 1 1 1 1 1
	1 3 1 1 1 1 2
	1 3 1 1 1 2 1
	1 3 1 1 1 3
	1 3 1 1 2 1 1
	1 3 1 1 2 2
	1 3 1 1 3 1
	1 3 1 2 1 1 1
	1 3 1 2 1 2
	1 3 1 2 2 1
	1 3 1 2 3
	1 3 1 3 1 1
	1 3 1 3 2
	1 3 2 1 1 1 1
	1 3 2 1 1 2
	1 3 2 1 2 1
	1 3 2 1 3
	1 3 2 2 1 1
	1 3 2 2 2
	1 3 2 3 1
	1 3 3 1 1 1
	1 3 3 1 2
	1 3 3 2 1
	1 3 3 3
	2 1 1 1 1 1 1 1 1
	2 1 1 1 1 1 1 2
	2 1 1 1 1 1 2 1
	2 1 1 1 1 1 3
	2 1 1 1 1 2 1 1
	2 1 1 1 1 2 2
	2 1 1 1 1 3 1
	2 1 1 1 2 1 1 1
	2 1 1 1 2 1 2
	2 1 1 1 2 2 1
	2 1 1 1 2 3
	2 1 1 1 3 1 1
	2 1 1 1 3 2
	2 1 1 2 1 1 1 1
	2 1 1 2 1 1 2
	2 1 1 2 1 2 1
	2 1 1 2 1 3
	2 1 1 2 2 1 1
	2 1 1 2 2 2
	2 1 1 2 3 1
	2 1 1 3 1 1 1
	2 1 1 3 1 2
	2 1 1 3 2 1
	2 1 1 3 3
	2 1 2 1 1 1 1 1
	2 1 2 1 1 1 2
	2 1 2 1 1 2 1
	2 1 2 1 1 3
	2 1 2 1 2 1 1
	2 1 2 1 2 2
	2 1 2 1 3 1
	2 1 2 2 1 1 1
	2 1 2 2 1 2
	2 1 2 2 2 1
	2 1 2 2 3
	2 1 2 3 1 1
	2 1 2 3 2
	2 1 3 1 1 1 1
	2 1 3 1 1 2
	2 1 3 1 2 1
	2 1 3 1 3
	2 1 3 2 1 1
	2 1 3 2 2
	2 1 3 3 1
	2 2 1 1 1 1 1 1
	2 2 1 1 1 1 2
	2 2 1 1 1 2 1
	2 2 1 1 1 3
	2 2 1 1 2 1 1
	2 2 1 1 2 2
	2 2 1 1 3 1
	2 2 1 2 1 1 1
	2 2 1 2 1 2
	2 2 1 2 2 1
	2 2 1 2 3
	2 2 1 3 1 1
	2 2 1 3 2
	2 2 2 1 1 1 1
	2 2 2 1 1 2
	2 2 2 1 2 1
	2 2 2 1 3
	2 2 2 2 1 1
	2 2 2 2 2
	2 2 2 3 1
	2 2 3 1 1 1
	2 2 3 1 2
	2 2 3 2 1
	2 2 3 3
	2 3 1 1 1 1 1
	2 3 1 1 1 2
	2 3 1 1 2 1
	2 3 1 1 3
	2 3 1 2 1 1
	2 3 1 2 2
	2 3 1 3 1
	2 3 2 1 1 1
	2 3 2 1 2
	2 3 2 2 1
	2 3 2 3
	2 3 3 1 1
	2 3 3 2
	3 1 1 1 1 1 1 1
	3 1 1 1 1 1 2
	3 1 1 1 1 2 1
	3 1 1 1 1 3
	3 1 1 1 2 1 1
	3 1 1 1 2 2
	3 1 1 1 3 1
	3 1 1 2 1 1 1
	3 1 1 2 1 2
	3 1 1 2 2 1
	3 1 1 2 3
	3 1 1 3 1 1
	3 1 1 3 2
	3 1 2 1 1 1 1
	3 1 2 1 1 2
	3 1 2 1 2 1
	3 1 2 1 3
	3 1 2 2 1 1
	3 1 2 2 2
	3 1 2 3 1
	3 1 3 1 1 1
	3 1 3 1 2
	3 1 3 2 1
	3 1 3 3
	3 2 1 1 1 1 1
	3 2 1 1 1 2
	3 2 1 1 2 1
	3 2 1 1 3
	3 2 1 2 1 1
	3 2 1 2 2
	3 2 1 3 1
	3 2 2 1 1 1
	3 2 2 1 2
	3 2 2 2 1
	3 2 2 3
	3 2 3 1 1
	3 2 3 2
	3 3 1 1 1 1
	3 3 1 1 2
	3 3 1 2 1
	3 3 1 3
	3 3 2 1 1
	3 3 2 2
	3 3 3 1
```

We see from the examples that `1 1 3` is distinct from `1 3 1` and `3 1 1`, so these lists are longer than we might thin.

### TASK #1 › Average of Stream

> Submitted by: Mohammad S Anwar  
> You are given a stream of numbers, `@N`.
>
> Write a script to print the average of the stream at every point.

Streams are ... interesting. They're the data sources that (potentially) never end. Yes, they go on and on, my friends. Somebody started streaming it not knowing what it was, and now they keep on munging it forever, just because it's ...

_Ahem._

At best, we want _O(1)_ for this sort of operation, because the source is potentially infinite. I recall hearing about the ideas I get to in this when hearing about dealing with _Big Data_. My preferred averaging would look something like this untested code:

```perl
    sub stream_avg($i) {
        state $n = 0;
        state $c = 1;
        $n += $i;
        return $n / $c++;
    }
```

But then we'd only get the current average, and not all the numbers that go into it. To get into them, I think I'd check if `$str` had characters in it. If not, I'd `$str = $i`, else `$str .= '+'.$i`, then use `eval` to get the sum.

But one solution doesn't give the requested output and the other uses `eval`, so I don't do that.

My first tests were all about `for` loops, but I decided that, since the question talks about streams, I should make a stream maker. I had to look around in sources [Mark-Jason Dominus's blog](https://perl.plover.com/Stream/stream.html) to remember beyond the basics how to make one, but I did.

The key to the deal is here:

```perl
    my $streamer = factory( $start, $end, $leap );
    my $z        = 0;
    while ( $z = $streamer->() ) {
        last unless defined $z;
        stream_avg($z);
    }
```

`factory()` is a function that returns a function, which we can do because Perl has [First-class functions](https://en.wikipedia.org/wiki/First-class_function). The function has a starting point, a loop value and an end point. Each time it's called, it adds the loop value. If it's above the end point, it returns undef, otherwise it returns the result. These values are [**state variables**](https://perldoc.perl.org/functions/state), which are lexically scoped (only exist within `factory` and `$streamer`) but are not reinitialized.

So, we either get a number less than `$end` or we get an `undef`. We end the loop with `last` if it's not defined, and display the output as desired if it is.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use feature qw{say state signatures};
use strict;
use warnings;
use utf8;
no warnings qw{ experimental };

use Carp;
use Getopt::Long;
use List::Util qw{sum0};

my ( $start, $end, $leap ) = ( 1, 2, 1 );
GetOptions(
    'start=i' => \$start,
    'end=i'   => \$end,
    'leap=i'  => \$leap,
);
croak 'Bad input' if $start >= $end || $start < 1 || $leap < 1;

my $streamer = factory( $start, $end, $leap );
my $z        = 0;
while ( $z = $streamer->() ) {
    last unless defined $z;
    stream_avg($z);
}

sub stream_avg ($n) {
    state $arr = [];
    push $arr->@*, $n;
    my $cnt = scalar $arr->@*;
    if ( $cnt == 1 ) {
        say qq{Average of first number is $n};
    }
    else {
        my $sum = sum0 $arr->@*;
        my $str = join '+', $arr->@*;
        my $avg = ($sum) / $cnt;
        say qq{Average of first $cnt numbers ($str)/$cnt = $avg};
    }
}

sub factory ( $start, $end, $input ) {
    say <<"END";
    START   $start
    END     $end
    LEAP    $leap
END
    return sub {
        state $c = $start;
        my $d = $c;
        $c += $leap;
        return undef if $d > $end;
        return $d;
    }
}
```

```text
./ch-1.pl -e 50 -l 3 -s 1
    START   1
    END     50
    LEAP    3

Average of first number is 1
Average of first 2 numbers (1+4)/2 = 2.5
Average of first 3 numbers (1+4+7)/3 = 4
Average of first 4 numbers (1+4+7+10)/4 = 5.5
Average of first 5 numbers (1+4+7+10+13)/5 = 7
Average of first 6 numbers (1+4+7+10+13+16)/6 = 8.5
Average of first 7 numbers (1+4+7+10+13+16+19)/7 = 10
Average of first 8 numbers (1+4+7+10+13+16+19+22)/8 = 11.5
Average of first 9 numbers (1+4+7+10+13+16+19+22+25)/9 = 13
Average of first 10 numbers (1+4+7+10+13+16+19+22+25+28)/10 = 14.5
Average of first 11 numbers (1+4+7+10+13+16+19+22+25+28+31)/11 = 16
Average of first 12 numbers (1+4+7+10+13+16+19+22+25+28+31+34)/12 = 17.5
Average of first 13 numbers (1+4+7+10+13+16+19+22+25+28+31+34+37)/13 = 19
Average of first 14 numbers (1+4+7+10+13+16+19+22+25+28+31+34+37+40)/14 = 20.5
Average of first 15 numbers (1+4+7+10+13+16+19+22+25+28+31+34+37+40+43)/15 = 22
Average of first 16 numbers (1+4+7+10+13+16+19+22+25+28+31+34+37+40+43+46)/16 = 23.5
Average of first 17 numbers (1+4+7+10+13+16+19+22+25+28+31+34+37+40+43+46+49)/17 = 25
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
