---
layout: post
title: "The Sequential Friendly Book: The Weekly Challenge #136"
author: "Dave Jacoby"
date: "2021-10-25 17:27:25 -0400"
categories: ""
---

[Another week, another challenge](https://theweeklychallenge.org/blog/perl-weekly-challenge-136/), and this one looks like a fun one.

### TASK #1 › Two Friendly

> Submitted by: Mohammad S Anwar  
> You are given 2 positive numbers, $m and $n.
>
> Write a script to find out if the given two numbers are Two Friendly.
>
> Two positive numbers, m and n are two friendly when gcd(m, n) = 2 ^ p where p > 0. The greatest common divisor (gcd) of a set of numbers is the largest positive number that divides all the numbers in the set without remainder.

Often, you can get _near_ the solution without really understanding it, but you need to think a little to get _to_ the solution. Here, for example, we're looking to be sure that the **greatest common denominator** is a power of two.

You _can_ go through and find all the common denominators and find the product, but any non-2 denominator is going to mean your numbers are not two-friendly.

Therefore, if you find a denominator that _is not_ 2, return 0. Otherwise, return 1.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures };
no warnings qw{ experimental };

my @examples = ( [ 8, 24 ], [ 26, 39 ], [ 4, 10 ], [ 24, 40 ] );

for my $i (@examples) {
    my ( $m, $n ) = $i->@*;
    my $o = two_friendly( $i->@* );
    say <<"END";
    Input: \$m = $m \$n = $n
    Output: $o
END
}

# "Two-Friendly" means the greatest common
# denominator is a power of two.

# Greatest common denomonator is the product
# of all the common denominators. 

# So, the moment you get a common denominator 
# that is NOT zero, you have a two-unfriendly
# number and can securely return 0
sub two_friendly ( $m = 8, $n = 16 ) {
    my ($lower) = sort { $a <=> $b } $m, $n;
    for my $i ( 2 .. $lower ) {
        while ( $m % $i == 0 && $n % $i == 0 ) {
            $m /= $i;
            $n /= $i;
            return 0 if $i != 2;
        }
    }
    return 1;
}
```

```text

    Input: $m = 8 $n = 24
    Output: 1

    Input: $m = 26 $n = 39
    Output: 0

    Input: $m = 4 $n = 10
    Output: 1

    Input: $m = 24 $n = 40
    Output: 1
```

### TASK #2 › Fibonacci Sequence

> Submitted by: Mohammad S Anwar  
> You are given a positive number $n.
>
> Write a script to find how many different sequences you can create using Fibonacci numbers where the sum of unique numbers in each sequence are the same as the given number.
>
> Fibonacci Numbers: 1,2,3,5,8,13,21,34,55,89

Um, isn't it `0,1,1,2,3,5` and so on? Adding zero isn't particularly helpful, but 1 is. If we're looking for `2`, for example, now we have the option of `1 + 1` and `2`, which expands the number of possible answers, but because the list only has one `1`, we go with that.

I thought about going with Algorithm::Permute, but that code _really_ wants all the numbers, not subset.

So, what do we say?

> [**This looks like a job for ...**](https://duckduckgo.com/?q=%22this+looks+like+a+job+for+recursion%22&va=b&t=hr&ia=web).

I don't show up a bit in the results. Hrm. Oh well.

As always, we worry about the cases in recursion, because we don't want things going on forever. If the numbers we have add up to something larger than our goal number, we return nothing. If the sum is equal to our goal number, we do some formatting to ensure that we can avoid duplicates and returned the stringified, formatted version. Otherwise, we go on to the next,
by taking a number off the source array and putting it onto the target.

This explanation isn't clear, but I hope the code is.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use JSON;
use List::Util qw{ sum0 uniq };
my $json = JSON->new->pretty->canonical;

my @examples = qw{16 9 15};

for my $n (@examples) {
    my @o  = solve_task($n);
    my $o  = scalar @o;
    my $oo = join ",\n        ", map { ($_) } @o;

    say <<"END";
    Input: \$n = $n
    Output: $o
        $oo
END
}

sub solve_task ($n) {
    my @fib       = grep { $_ < $n } map { fib($_) } 1 .. $n;
    my @sequences = recursion( $n, \@fib );
    return @sequences;
}

# Let's call it what it is
sub recursion ( $n, $ref, $x = [] ) {
    my @output;
    my $depth   = 1 + scalar $x->@*;
    my $sum     = sum0 $x->@*;
    my $nex->@* = sort $ref->@*;

    return undef if $sum > $n;

    if ( $sum == $n ) {
        $x->@* = sort { $a <=> $b } map { int $_ } $x->@*;
        my $answer = join ' + ', $x->@*;
        return $answer;
    }

    for my $i ( 1 .. scalar $nex->@* ) {
        my $v = shift $nex->@*;
        my $y->@* = $x->@*;
        push $y->@*, $v;

        my @return = recursion( $n, $nex, $y );
        push @output, @return;
        push $nex->@*, $v;
    }
    return uniq sort grep { defined } @output;
}

sub fib ($n) {
    state $fib;
    $fib->{0} = 1;
    $fib->{1} = 1;
    if ( $fib->{$n} ) {
        return $fib->{$n};
    }
    $fib->{$n} = fib( $n - 1 ) + fib( $n - 2 );
}
```

```text
    Input: $n = 16
    Output: 4
        1 + 2 + 13,
        1 + 2 + 5 + 8,
        3 + 13,
        3 + 5 + 8

    Input: $n = 9
    Output: 2
        1 + 3 + 5,
        1 + 8

    Input: $n = 15
    Output: 2
        2 + 13,
        2 + 5 + 8
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
