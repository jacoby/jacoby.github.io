---
layout: post
title: "Mr. Smith Squares Off: The Weekly Challenge #133"
author: "Dave Jacoby"
date: "2021-10-05 12:40:36 -0400"
categories: ""
---

[Once more into the breech](https://theweeklychallenge.org/blog/perl-weekly-challenge-133/)

### TASK #1 › Integer Square Root

> Submitted by: Mohammad S Anwar  
> You are given a positive integer $N.
>
> Write a script to calculate the integer square root of the given number.
>
> Please avoid using built-in function. Find out more about it here.

Why avoid built-in functions? Because `int sqrt $foo` solves it. I functionalized it so I could test my idea.

This is an off-brand iteration solution, but it works. I'd walk through the code, but it's six lines.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

my @examples = ( 10, 27, 85, 101 );

for my $e (@examples) {
    say join "\t", '', $e, isqrt1($e), isqrt2($e),;
}

# the way we're requested to not use, for demonstration
sub isqrt1 ($n) {
    return int sqrt $n;
}

# another way:
sub isqrt2 ($n) {
    my $j = 1;
    while (1) {
        return $j - 1 if $n < $j**2;
        $j++;
    }
    return 1;
}
```

```text
        10      3       3
        27      5       5
        85      9       9
        101     10      10
```

### TASK #2 › Smith Numbers

> Submitted by: Mohammad S Anwar  
> Write a script to generate first 10 Smith Numbers in base 10.
>
> According to [Wikipedia](https://en.wikipedia.org/wiki/Smith_number):
>
> > In number theory, a Smith number is a composite number for which, in a given number base, the sum of its digits is equal to the sum of the digits in its prime factorization in the given number base.

So, this is an odd one, and getting things right is complex.

First of all, we're talking base 10: 0 thru 9, etc etc.

Second, we're comparing the sum of each digit to the sum of the prime factors-ish. The canonical number is the mathematician's brother-in-law's telephone number, **493-7775**.

First, there's the sum of digits:

> **4 + 9 + 3 + 7 + 7 + 7 + 5 = 42**

This, with a little bit of List::Util, is easy:

> `sum split //, 4937775`

The split turns `4937775` into the list `[4, 9, 3, 7, 7, 7, 5]`, and `sum` adds everything together.

It's the factorization that get things weird.

> **3 \* 5 \* 5 \* 65837 = 4937775**

So we have to transform that into:

> **(3 \* 1) + (5 \* 2) + ( ( 6+5+8+3+7 ) \* 1 ) = 42**

So the steps are:

- find every Prime Factor. My way of doing that is by going through each integer **i**, testing if **s % i == 0**, and then keeping track of the factors with a hash and **s = s / i** until we get to the end of the range
- break apart the factors like we did with the sum of digits, sum them, then multiply by the number of times that factor is used
- sum all those results

I separated the `sum_of_digits` code into a function so I could test the parts outside of the `get_smith_numbers` function, which just keeps going until it finds the first 10. It was harder to think through than to code up, I think.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use List::Util qw{ sum sum0 };
my @from_wikipedia = ( 4, 22, 27, 58, 85, 95, 121 );
my %from = map { $_ => 1 } @from_wikipedia;

my @smith_numbers = get_smith_numbers();

say join ', ', @smith_numbers;

exit;

sub sum_of_digits ( $n ) { return sum split //, $n }

sub sum_of_factors ( $n ) {
    my %factors;
    my $output = 0;
    my $nn     = $n;
    for my $i ( 2 .. $n - 1 ) {
        if ( $nn % $i == 0 ) {
            while ( $nn % $i == 0 ) {
                $factors{$i}++;
                $nn /= $i;
            }
        }
    }
    $output += sum0 map { sum( split //, $_ ) * $factors{$_} } keys %factors;
    return $output || 0;
}

sub get_smith_numbers {
    my @output;
    my $i = 2;
    while ( scalar @output < 10 ) {
        my $d = sum_of_digits($i);
        my $f = sum_of_factors($i);
        my $e = $d == $f ? 1 : 0;
        push @output, $i if $e;
        exit if $i > 500;
        $i++;
    }
    return @output;
}
```

```text
4, 22, 27, 58, 85, 94, 121, 166, 202, 265
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
