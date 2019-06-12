---
layout: post
title:  "Euclid and Reduce"
author: "Dave Jacoby"
date:   "2019-06-12 11:42:04 -0400"
categories: ""
---

[**Week 12, Challenge 1**](https://perlweeklychallenge.org/blog/perl-weekly-challenge-012/)

> The numbers formed by adding one to the products of the smallest primes are called the Euclid Numbers (see [wiki](https://en.wikipedia.org/wiki/Euclid_number)). Write a script that finds the smallest **Euclid Number** that is not prime. This challenge was proposed by **Laurent Rosenfeld**.

From the Wiki:

> Not all Euclid numbers are prime. E6 = 13# + 1 = 30031 = 59 × 509 is the first composite Euclid number.

Knowing where the right answer is is always useful.

Anyway, we're talking _primes_, and I wrote some useful functions for week 8:

```perl
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

And we can add a `while` loop and pick up more and more primes.

```perl
my @primes;

while (1) {
    state $n = 0;
    $n++;
    if ( is_prime($n) ) {
        push @primes, $n;
        # infinite loop, so we'll keep getting more and more primes forever
        # remember, kids: last your loops!
    }
}
```

A **Euclid Number** is found by adding one to ...well, Wikipedia puts it like **P<sub>n</sub>#**. I think that's _product_?

```text
$ perldoc -f product
No documentation for perl function 'product' found
```

Hrm. I guess we have to build one.

I don't know if these thoughts came more from [Schwartzian Transforms](https://jacoby.github.io/javascript/2018/11/07/schwartzian-transforms-in-javascript.html) or me simply trying to understand what Hadoop is and does, I'm more and more into the `map` and `grep` style of programming. `map` transforms each element in an array, and `grep` gives you a smaller array, but what if you want to boil an array into one value? 

There are instances: `sum` gives you all the elements added together, `min` gives you the smallest value, and `max` would give you the largest. And, I should mention, these are from [`List::Util`](https://metacpan.org/pod/List::Util). 

Get to know `List::Util`. It is your friend.

And one of the things you can get from `List::Util` is `reduce`. That's the second half of [MapReduce](https://en.wikipedia.org/wiki/MapReduce)! Coolness.

```perl
my @list = 1 .. 4;

my $max     = reduce { $a > $b ? $a : $b } @list ;  # 4
my $min     = reduce { $a < $b ? $a : $b } @list ;  # 1
my $sum     = reduce { $a + $b } @list ;            # 10
my $product = reduce { $a * $b } @list ;            # 24
```

And here is we get our `product`.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

use List::Util qw{reduce};

my @primes;

while (1) {
    state $n = 0;
    $n++;
    if ( is_prime($n) ) {
        push @primes, $n;
        my $eu = 1 + reduce { $a * $b } @primes;
        if ( !is_prime($eu) ) {
            say join "\t", $n, $eu;
            say join ',', @primes;
            say join ',', factor($eu);
            last;
        }
    }
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

I could probably inject more clever, but this teaches `reduce` and gives us the right answer.

```text
13	30031
2,3,5,7,11,13
1,59,509
```

So excuse me as I take a victory lap.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


