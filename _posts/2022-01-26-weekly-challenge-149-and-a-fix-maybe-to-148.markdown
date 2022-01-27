---
layout: post
title: "Weekly Challenge #149 and A Fix, Maybe, to #148"
author: "Dave Jacoby"
date: "2022-01-26 22:27:55 -0500"
categories: ""
---

### Fixing an Old Task

Abigail read my blog post and pointed out that the given first correct answer of [#148 Task 2](https://theweeklychallenge.org/blog/perl-weekly-challenge-148/), `(2,1,5)` was not showing up, and when he ran my `test_ardano` function against it, it didn't return `1`, but rather `1.00000000000000000011`.

I think the _only_ time I regularly do math like this is in the Challenge, which is good because it makes me use ideas I don't touch regularly, but it does get me in places I can't negotiate out of. It's a known thing that IEEE 754 math has hairy edge cases, and I'm _guessing_ that I'm hanging up on that. I changed my `cuberoot` function to limit the number of significant digits —

```perl
sub cuberoot ($n ) { return sprintf '%.06f', $n**( 1 / 3 ) }
```

— but that seems like a hackish _"just make it work!"_ solution rather than really understanding where the problem is and fixing that. I admit that. When the Reviews come around, I'll have to read to see the better Cardano Triplets solutions.

Thanks to Abigail for pointing out the problem.

### TASK #1 › Fibonacci Digit Sum

> Submitted by: Roger Bell_West
> Given an input $N, generate the first $N numbers for which the sum of their digits is a Fibonacci number.

I got this to an acceptable point fairly quickly. I use `split` to separate the numbers into digits, `sum0` from List::Util because I am always paranoid about empty strings and a function that finds the Fibonacci number that is not less than the given number, which would be the `sum0` of the digits. If the function returns a number that _is_ sum, then there we go! We append it to an array, and stop looking when the array is big enough.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use Getopt::Long;
use List::Util qw{ sum0 max };

my $N = 20;
GetOptions( 'n=i' => \$N, );

my @fib = first_60_fib();
my %fib = map { $_ => 1 } @fib;
my @x;

my $n = 0;
while ( scalar @x < $N ) {
    my $sd = sum_of_digits($n);
    my $f  = $fib{$sd} || 0;
    push @x, $n if $f;
    $n++;
}
say join ' ', @x;

sub first_60_fib() {
    my @n;
    push @n, 0;
    push @n, 1;
    while ( scalar @n < 60 ) {
        push @n, $n[-1] + $n[-2];
    }
    return @n;
}

sub sum_of_digits ( $n ) {
    return sum0 split //, $n;
}
```

```text
$ ./ch-1.pl -n 30
0 1 2 3 5 8 10 11 12 14 17 20 21 23 26 30 32 35 41 44 49 50 53 58 62 67 71 76 80 85
```

### TASK #2 › Largest Square

> Submitted by: Roger Bell_West
> Given a number base, derive the largest perfect square with no repeated digits and return it as a string. (For base>10, use ‘A’..‘Z’.)

This is giving me problems.

There are parts that are fairly simple. You get the 36 characters we can get with `my @range = ( 0 .. 9, 'A' .. 'Z' )`, and you can get the right characters for any base with `my @range_by_base = @range[0..$base-1]`. The highest possible correct number becomes `join '', reverse @range_by_base`.

I found that many of the Base Conversion modules convert from and to common CS-related bases — 2, 4, 8, 16, 32, etc. — but for this task, we want to convert into and out of any base, and I found that [Math::BaseCalc](https://metacpan.org/pod/Math::BaseCalc) does that well.

Using `state`, I made functions that convert back and forth, and hold onto the numbers, so we don't have to re-generate `100` in base 19 twice. (In writing this, I'm second-guessing the utility of that, but I've done the cool thing, so eh?)

But there's still going from **9,876,543,210** to **1**, in the case of base 10. I am doing it with a for loop and an implicit 10-million-entry list, and that's killing me. I think that a while loop instead, like `while ($n > 1) { $n-- }` might be it. In fact, it's looking promising (and not segfaulting) as I write this. When and if I solve it, I'll blog it separately.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
