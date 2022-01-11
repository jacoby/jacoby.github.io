---
layout: post
title: "Truncations and Pentagons: The Weekly Challenge #147"
author: "Dave Jacoby"
date: "2022-01-11 16:08:18 -0500"
categories: ""
---

[Another challenge!](https://theweeklychallenge.org/blog/perl-weekly-challenge-147/)

147 is 3 _ 7 _ 7, which is 7 _ 21 or 3 _ 49.

Quick reader question: Do you think I should do separate posts for each task? Do you think I should comment the actual code more, instead of leaving them bare and commenting only in the blog? Should I finally set up a Teespring account and make that _This Looks Like A Job For **RECURSION**!_ shirt? Answer in a Github Issue or on Twitter.

### TASK #1 › Truncatable Prime

> Submitted by: Mohammad S Anwar
> Write a script to generate first 20 left-truncatable prime numbers in base 10.
>
> In number theory, a left-truncatable prime is a prime number which, in a given base, contains no 0, and if the leading left digit is successively removed, then all resulting numbers are primes.

So, given the Van Halen album, _5150_, we can truncate this to **150**, then **50**, then **0**. However, it is not a prime, shown to be divisible by 2 and 5 by ending in 0, and thus _containing_ 0, which is also a no-go.

Spoiler: I forgot the no-zero rule, wrote code and tested, then added the zero rule, and the output for the first 20 is identical. I _could_ raise the count until I find the first one where the zero matters, but eh? I don't wanna.

Anyway, this looked like another iterative solution. This is _not_ going to help me maintain my **Mister Recursion** reputation!

Anyway, I iterate up, check if each digit is a prime, collect the primes in a hash so it's easy to test while I left truncate, then make a working copy of the number. I then left truncate the copy until it's an empty string, at which point I throw it on the truncation list.

I use `last` a lot, and `last` is not the most common loop command. Normally I go for `next` a lot, not `last`.

`last`: [Read it.](https://perldoc.perl.org/functions/last) Learn it. Live it.

But here, I use nested `while`, and it can be hard to tell which `last` or `next` points to which `while`.

```perl
# outer while loop
while (1) {
    my $copy = $n;
    # inner while loop
    while ( length $copy > 0 ) {
        push @array, $n;
        last if $copy == '';        # last of inner loop
        substr( $copy, 0, 1 ) = '';
    }
    last if scalar @array > 20;     # last of outer loop
}
```

_I_ think it's clear because I'm fairly strict on formatting. (Remind me to blog my `.perltidyrc` some day.) But I can see why many could get lost in it. We can use named loops, less to override behavior and more as comment.

```perl
OUTER: while (1) {
    my $copy = $n;
    # inner while loop
    INNER: while ( length $copy > 0 ) {
        push @array, $n;
        last INNER if $copy == '';        # last of inner loop
        substr( $copy, 0, 1 ) = '';
    }
    last OUTER if scalar @array > 20;     # last of outer loop
}
```

We could even put that last `last` in the inner loop if it's using a named loop. And, strictly speaking, we only need to name `OUTER` in this case, except of course for documention purposes.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

my %primes;
my %trunc;
my $c = 1;
my $n = 2;

while (1) {
    if ( $n !~ /0/mx && is_prime($n) ) {
        $primes{$n}++;
        my $copy = $n;
        while ( length $copy > 0 ) {
            last unless $primes{$copy};
            substr( $copy, 0, 1 ) = '';
            if ( $copy eq '' ) {
                $trunc{$n}++ if $copy eq '';
                last;
            }
        }
        last if scalar keys %trunc > 30;
    }
    $n++;
}

say join ', ', sort { $a <=> $b } keys %trunc;

sub is_prime ($n) {
    for ( 2 .. sqrt $n ) { return unless $n % $_ }
    return 1;
}
```

```text
2, 3, 5, 7, 13, 17, 23, 37, 43, 47, 53, 67, 73, 83, 97, 113,
137, 167, 173, 197, 223

# being unsure if one-digit numbers count for the purposes of truncation, I ran one counting to 30, not 20.

2, 3, 5, 7, 13, 17, 23, 37, 43, 47, 53, 67, 73, 83, 97, 113,
137, 167, 173, 197, 223, 283, 313, 317, 337, 347, 353, 367,
373, 383, 397
```

### TASK #2 › Pentagon Numbers

> Submitted by: Mohammad S Anwar
> Write a sript to find the first pair of Pentagon Numbers whose sum and difference are also a Pentagon Number.
>
> Pentagon numbers can be defined as P(n) = n(3n - 1)/2.

I had some problems understanding this one, and I'm not 100% sure I got it correct. I went to Wolfram to get a better idea of what [Pentagonal Numbers](https://mathworld.wolfram.com/PentagonalNumber.html) really are, and I reread to be sure that we're not counting **0**, because if `P(0) = 0` and `P(1) = 1`, then P(0) and P(1) are the first that satisfy the problem, but...

> **The first 10 Pentagon Numbers are: 1, 5, 12, 22, 35, 51, 70, 92, 117 and 145.**

So, `P(0)` is _out_.

Again, Captain Recursion chooses an iterative method. We're going boldly through the set of all numbers, until we've found _n_ (be it 1 or 20) that satisfy our requirements. I first use `map` to get the first 10,000 pentagonal numbers, then map to a hash for easy testing. Because here, zero-based indexing is not quite what we 

I then, again, go to nested loops, because we're looking for 2 numbers. We start with indexes, de-index them to get the numbers we're actually looking for, then doing addition and subtraction, testing to see if we're good, and once we do, we print and exit.

In early loops, I was having problems with code sanitation meaning that my `$j` loop was never looping for some reason. Improving code sanitation is why I don't even start testing the product until inside the sum's `if` block. If the sum isn't right, it doesn't matter what the product is.

I went with the `$top` being 10,000 because I really had no idea how far the rabbit hole went. This sort of nested loop deal is **O(nlogn)** and I don't think it takes too much memory, so I was prepared to see if it just died before an answer and increasing `$top` accordingly, but no.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

my $top      = 10_000;
my @pentagon = map { pentagon($_) } 0 .. $top;
my %pentagon = map { $_ => 1 } @pentagon;
delete $pentagon{0};

for my $i ( 1 .. $top ) {
    for my $j ( 1 .. $i  ) {
        my $pi  = $pentagon[$i];
        my $pj  = $pentagon[$j];
        my $sum = $pi + $pj;
        if ( $pentagon{$sum} ) {
            my $product = abs( $pi - $pj );
            if ( $pentagon{$product} ) {
                say <<"END";
        P($i) = $pi
        P($j) = $pj
        $pi + $pj = $sum
        abs( $pi - $pj ) = $product
END
                exit;
            }
        }
    }
}

sub pentagon ( $n ) {
    return $n * ( ( $n * 3 ) - 1 ) / 2;
}
```

```text
./ch-2.pl 
        P(2167) = 7042750
        P(1020) = 1560090
        7042750 + 1560090 = 8602840
        abs( 7042750 - 1560090 ) = 5482660
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
