---
layout: post
title: "Finding Perfect Numbers in Perl"
author: "Dave Jacoby"
date: "2019-05-15 16:51:32 -0400"
categories: ""
---

## The Problem

This solves **Challenge #1** in this week's [Perl Weekly Challenge](https://perlweeklychallenge.org/blog/perl-weekly-challenge-008/).

> Write a script that computes the first five perfect numbers. A perfect number is an integer that is the sum of its positive proper divisors (all divisors except itself). Please check [Wiki](https://en.wikipedia.org/wiki/Perfect_number) for more information. This challenge was proposed by **Laurent Rosenfeld**.

## First Pass

The solution, or at least the test, is in the Wikipedia page, but here it is.

> **6 = 1 + 2 + 3**

The sum of all a number's factors not including the number itself must equal the number. So, let's check _all the numbers!_

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures  };
no warnings qw{ experimental::signatures };

use List::Util qw{sum};

say join "\n", perfect_numbers();

sub perfect_numbers {
    my @numbers;
    my $n = 0;

    while ( scalar @numbers < 5 ) {
        $n++;
        next unless $n % 2 == 0; # they're all even, so this halves time
        my @factors = factor($n);
        my $sum     = sum @factors;
        push @numbers, $n if $sum eq $n;
    }
    return @numbers;
}

sub factor ( $n ) {
    my @factors;
    for my $i ( 1 .. $n - 1 ) {
        push @factors, $i if $n % $i == 0;
    }
    return @factors;
}
```

This is not the _wrong_ solution. It will give you the right solution.

Eventually.

Why? Because the first five perfect numbers are `[ 6 ,28 ,496 ,8128 ,33550336 ]`, and counting past 33 million takes a while.

So, we don't do that.

## Second Pass

In the section on [Even Perfect Numbers](https://en.wikipedia.org/wiki/Perfect_number#Even_perfect_numbers), we get **2<sup>p-1</sup>(2<sup>p</sup> − 1)**, but not every _even perfect number_ is a _perfect number_, but when p is _prime_, that's what we get. So...

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures  };
no warnings qw{ experimental::signatures };

use List::Util qw{sum};

say join "\n", perfect_numbers();

sub perfect_numbers {
    my @numbers;
    my $p = 1;

    while ( scalar @numbers < 5 ) {
        $p++;
        next unless is_prime($p);
        my $q = $p - 1;
        my $o = ( 2**$q ) * ( ( 2**$p ) - 1 );
        next unless is_perfect($o);
        push @numbers, $o;
    }
    return @numbers;
}

sub is_perfect ( $n ) {
    my @factors = factor($n);
    my $sum     = sum @factors;
    return $sum == $n ? 1 : 0;
}

sub is_prime ( $n ) {
    my @factors = factor($n);
    return scalar @factors == 1 ? 1 : 0;
}

sub factor ( $n ) {
    my @factors;
    for my $i ( 1 .. $n - 1 ) {
        push @factors, $i if $n % $i == 0;
    }
    return @factors;
}
```

```text
$ time ~/pc008c1_2.pl
6
28
496
8128
33550336

real	0m2.911s
user	0m2.901s
sys	0m0.005s
```

Instead of _hours_, it takes seconds.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
