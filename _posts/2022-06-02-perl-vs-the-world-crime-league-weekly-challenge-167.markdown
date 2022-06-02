---
layout: post
title: "Perl vs The World Crime League: Weekly Challenge #167"
author: "Dave Jacoby"
date: "2022-06-02 18:01:05 -0400"
categories: ""
---

Welcome to [Weekly Challenge #167](https://theweeklychallenge.org/blog/perl-weekly-challenge-167/) [167])(https://en.wikipedia.org/wiki/167_(number)) is a **safe prime**. If there's a prime number _p_ where _2p + 1_ is also prime, then _p_ is a **Sophie Germain prime** and _2p + 1_ is a safe prime, so _83_ is the Sophie Germain prime to 167.

### Task 1: Circular Prime

> Submitted by: Mohammad S Anwar  
> Write a script to find out first 10 circular primes having at least 3 digits (base 10).
>
> Please checkout [wikipedia](https://en.wikipedia.org/wiki/Circular_prime) for more information.
>
> > A circular prime is a prime number with the property that the number generated at each intermediate step when cyclically permuting its (base 10) digits will also be prime.

Here's the thing I had to figure out first: `113` is the first circular prime, because `131` and `311` are also prime. But because `133` is already counted, `131` and `311` don't show up on the list.

Besides knowing and accounting for that, we need to know a number is prime (as we do every so often) and circularly permute the number. _My_ solution involves a lot of `substr`, but I could easily imagine a solution involving splitting to an array and pushing and shifting elements off it.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my $top = 10;
my $c   = 100;
my %next;
my @primes;

OUTER: while ( scalar @primes < $top ) {
    $c++;
    next if $next{$c};
    if ( is_prime($c) ) {
        my @permutes = circular_permutes($c);
        my $f        = 0;
        for my $p (@permutes) { $next{$p}++; $f++ if is_prime($p); }
        next OUTER unless length $c == $f;
        push @primes, $c;
        sleep 1;
    }
}
say join ', ', @primes;

sub circular_permutes ( $n ) {
    my @output;
    for my $i ( 1 .. length $n ) {
        my $d = $n;
        my $x = substr $d, 0, $i;
        substr( $d, 0, $i ) = '';
        $d .= $x;
        push @output, $d;
    }
    return @output;
}

sub is_prime ($n) {
    die "Bad number $n" unless length $n;
    return 0 if $n == 0;
    return 0 if $n == 1;
    for ( 2 .. sqrt $n ) { return 0 unless $n % $_ }
    return 1;
}
```

```text
$ time ./ch-1.pl
113, 197, 199, 337, 1193, 3779, 11939, 19937, 193939, 199933

real    0m11.220s
user    0m0.281s
sys     0m0.047s
```

### Task 2: Gamma Function

> Submitted by: Mohammad S Anwar  
> Implement subroutine gamma() using the [Lanczos approximation](https://en.wikipedia.org/wiki/Lanczos_approximation) method.

I didn't do this one.

I took Computer Science, and the tendency and history of Computer Science leans hard to being a specific subset of Mathematics. Therefore, I took a _lot_ of math courses while working toward my CS degree. I retook a few. There are a few points where my knowledge of math helped with my work with computers, but by and large, no, it was nothing but a hinderance. I'll contrast Statistics, which was made an optional part of the curriculum right before I would've been required to take it. I thought I was dodging a bullet, but that is the one course I didn't take then that I know would've helped me as a developer.

Plus, I believe that the program intentionally hid the idea that **Σ** means **for loop**.

The Lanczos approximation is a large, unweildy piece of mathematics. It would take time to tease out what the variables are and what the things we need to do, and that doesn't seem too fun to me. I don't see a way to creatively engage with this task.

Additionally, [Ryan Thompson goes deep into the issue](https://ry.ca/2022/05/lanczos-approximation/), which is both great and a problem, especially as Mohammad linked to it within the challenge. Reading it began to feel like cribbing someone else's test answer, and I don't need to cheat on a test I'm taking for fun.

I wish everyone else the best of luck, and hope that the [Perl Review](https://theweeklychallenge.org/p5-reviews/) will cover it. 

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
