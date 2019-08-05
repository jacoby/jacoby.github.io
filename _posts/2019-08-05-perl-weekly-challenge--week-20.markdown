---
layout: post
title: "Perl Weekly Challenge - Week 20"
author: "Dave Jacoby"
date: "2019-08-05 11:56:24 -0400"
categories: ""
---

## Challenge 1

> Write a script to accept a string from command line and split it on change of character. For example, if the string is **“ABBCDEEF”**, then it should split like **“A”, “BB”, “C”, “D”, “EE”, “F”**.

A thing I note: _accept a string from the command line_. I _could_ enterpret that as saying that all of ARGV is a string, but I'm going to have this work on every entry in ARGV, interpreting this as _one or more strings from the command line_.

For first pass, I used case-folding and made **A** and **a** equivalent (as well as a lot of unicode characters that get hung up on `uc` or `lc`), but I decided that I was reading too far into the question.

And, currently, this is not Unicode-safe, so reading in `💩💩💩` will not give you happy results right now.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ fc postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

if (@ARGV) {
    for my $string (@ARGV) {
        say $string;
        say join ', ', map { qq{"$_"} } split_on_change($string);
        say '';
    }
}
else {
    my $string = 'ABBCDEEF';
    say $string;
    say join ', ', map { qq{"$_"} } split_on_change($string);
    say '';
}

sub split_on_change ( $string ) {
    my @array;
    my $cache = '';
    for my $l ( split //, $string ) {
        state $m = '';
        if ( $l eq $m ) {
            $cache .= $l;
        }
        else {
            $m = $l;
            push @array, $cache;
            $cache = $l;
        }
    }
    push @array, $cache;
    @array = grep { length $_ } @array;
    return wantarray ? @array : \@array;
}

__DATA__

ABBCDEEF
"A", "BB", "C", "D", "EE", "F"
```

## Challenge 2

> Write a script to print the smallest pair of **Amicable Numbers**.

I admit I needed to [look up the algorithm (in Python)](https://stackoverflow.com/questions/38094818/what-is-the-most-efficient-way-to-find-amicable-numbers-in-python) to understand what this even is. I only play with this number theory stuff for these challenges, which makes me insufficiently nerdy, I suppose.

We'll start with **220**. What are the divisors of 220? **1, 2, 4, 5, 10, 11, 20, 22, 44, 55, and 110**. And what's the sum of all those numbers? **284**.

And what are the divisors of 284? **1, 2, 4, 71, and 142**. And the sum of those numbers? **220**. So, 220 and 284 are **Amicable**.

And the actions needed are not hard. I pull `sum0` from [List::Util](https://metacpan.org/pod/List::Util) and `factor` from previous challenges. I use `sum0` and not `sum` because `sum []` is undefined, while `sum0 []` = 0, which means you don't get `undefined` errors in your fail cases.

I use `state` and a hashref to keep from doubling up, so that we test `220,284` and not `284,220`.

And YYMV, but I think I may have gone too clever on the display, in reaction to being entirely unoriginal with the important code. But then, that sort of `map` and `join` work is entirely the kind of thing I'd do anyway.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

use List::Util qw{sum0};
use JSON;
my $json = JSON->new->pretty->canonical;

say join "\n", map { join ', ', $_->@* } amicable_pair(10_000);
exit;

sub amicable_pair( $n ) {
    my @result;
    for my $x ( 1 .. $n ) {

        state $check;
        my $y = sum_factors($x);
        next if $x == $y;
        my @pair = sort $x, $y;
        my $key  = join ',', @pair;
        next if $check->{$key}++;
        my $z = sum_factors($y);
        if ( $x == $z ) {
            push @result, \@pair;
        }
    }
    return @result;
}

sub sum_factors ( $n ) {
    my @factors = factor($n);
    return sum0 @factors;
}

sub factor ( $n ) {
    my @factors;
    for my $i ( 1 ..  $n / 2 ) {
        push @factors, $i if $n % $i == 0;
    }
    return @factors;
}

__DATA__
220, 284
1184, 1210
2620, 2924
5020, 5564
6232, 6368
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
