---
layout: post
title: "In Our Primes: Weekly Challenge #158"
author: "Dave Jacoby"
date: "2022-03-28 12:34:11 -0400"
categories: ""
---

We're on to [Weekly Challenge #158!](https://theweeklychallenge.org/blog/perl-weekly-challenge-158/). 158 is even so not prime, but is the product of two primes, 2 (because even) and 79.

### TASK #1 › Additive Primes

> Submitted by: Mohammad S Anwar  
> Write a script to find out all Additive Primes <= 100.
>
> Additive primes are prime numbers for which the sum of their decimal digits are also primes.

Because this time, I have every expectation that I'll have to check if a number is prime twice, I brought in [Memoize](https://metacpan.org/pod/Memoize). Because of lack of recursion, I don't expect it to be as much of an obvious win as, for example, fibonacci, but every little bit helps, and it's good that I finally remember to _use_ it, instead of just mentioning it.

So, once we _know_ a number is prime, we then have to split it into digits (`split //, $n`) and sum them (`sum0` from one of my go-to's, [List::Util](https://metacpan.org/pod/List::Util)), and then testing if _that's_ prime.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use List::Util qw{ sum0 product };
use Memoize;

memoize('is_prime');

my @aprimes;
for my $i ( 1 .. 100 ) {
    if ( is_prime($i) ) {
        my $sum = sum0 split //, $i;
        if ( is_prime($sum) ) { push @aprimes, $i; }
    }
}
say join ', ', @aprimes;

sub is_prime ($n) {
    return 0 if $n == 0;
    return 0 if $n == 1;
    for ( 2 .. sqrt $n ) { return 0 unless $n % $_ }
    return 1;
}
```

```text
$ ./ch-1.pl 
2, 3, 5, 7, 11, 23, 29, 41, 43, 47, 61, 67, 83, 89
```

### TASK #2 › First Series Cuban Primes

> Submitted by: Mohammad S Anwar  
> Write a script to compute first series Cuban Primes <= 1000. Please refer [wikipedia page](https://en.wikipedia.org/wiki/Cuban_prime) for more informations.

So, the **Cuban Prime** is a pun on these relating to cubes.

The first form, when simplified, become:

> **p = 3y<sup>2</sup> + 3y + 1**, where P is the prime in question

So, what we're doing is finding a number for **y**.

It's simply iteration, multiplication and addition. If we were dealing with _large_ primes that require [Math::BigInt](https://metacpan.org/pod/Math::BigInt) and have many more numbers between 1 and itself would require a more efficient algorithm, but for primes less than 1,000? This is fast enough.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use List::Util qw{ sum0 };

my @cprimes;
for my $n ( 1 .. 1000 ) {
    if ( is_prime($n) ) {
        my $c = is_cuban_prime($n);
        push @cprimes, $n if $c;
    }
}
say join ', ', @cprimes;

sub is_cuban_prime ($n) {
    for my $i ( 1 ..  $n ) {
        my $c = sum0 1, ( 3 * $i ), ( 3 * ( $i**2 ) );
        return 1 if $c == $n;
    }
    return 0;
}

sub is_prime ($n) {
    return 0 if $n == 0;
    return 0 if $n == 1;
    for ( 2 .. sqrt $n ) { return 0 unless $n % $_ }
    return 1;
}
```

```text
$ ./ch-2.pl
7, 19, 37, 61, 127, 271, 331, 397, 547, 631, 919
```

### Fix?

For some reason, this file is not getting my Github Pages to update.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
