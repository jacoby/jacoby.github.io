---
layout: post
title: "Just Got Poked: Perl Weekly Challenge 106 and Other News"
author: "Dave Jacoby"
date: "2021-04-03 12:48:04 -0400"
categories: ""
---

### First Things First

Earlier today, I had my appointment with my county's health department and got my first dose of the Moderna vaccine for COVID-19. My left arm's low-key feeling like _Iron Man 2_ when Tony Stark had infections that looked like circuitry crawling up his extremities. It's fine, I'm happy and all, and my second shot is scheduled for May.

Now, onto [Challenge #106](https://perlweeklychallenge.org/blog/perl-weekly-challenge-106/)!

### TASK #1 › Maximum Gap

> Submitted by: Mohammad S Anwar  
> You are given an array of integers `@N`.
>
> Write a script to display the maximum difference between two successive elements once the array is sorted.
>
> If the array contains only 1 element then display 0.

I'm pretty sure that I saw the solution very early in CS101: Set your base. If you're looking for the low number, set it abstractly low. Abstractly high otherwise. Then, go through all the possible values, determine what you're looking for, and if your new value is better than what you have, reset it. Very simple.

In this case, it'll _have_ to be zero or more, so, `$max = 0`. We're looking for a gap, so there has to be at least 2, so we only do the work if that's true.

The work being:

- going through all the elements in the previously sorted array, starting with the second. (We assume we receive an unsorted array and sort it first thing.)
- for any element index `i`, we find the gap between it and `i - 1`. If it's greater than `$max`, we set `$max` to that gap.
- we return `$max`. It will be zero unless we have need to go through the array.

I found this very simple and got this written _very_ quickly.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

use JSON;
my $json = JSON->new->pretty;

my $inputs = [

    [ 2, 9, 3, 5 ],
    [ 1, 3, 8, 2, 0 ],
    [ 5 ],
    [],

];

for my $input ( $inputs->@* ) {
    my $in = join ', ', $input->@*;
    my $max_gap = max_gap( $input->@* );
    say qq{INPUT:  \@N = ($in)};
    say qq{OUTPUT: $max_gap};
    say '';
}

sub max_gap( @input ) {
    @input = sort { $a <=> $b } @input;
    my $max = 0;
    if ( scalar @input > 1 ) {
        for my $i ( 1 .. -1 + scalar @input ) {
            my $abs = $input[$i] - $input[ $i - 1 ];
            $max = $max < $abs ? $abs : $max;
        }
    }
    return $max;
}
```

```text
INPUT:  @N = (2, 9, 3, 5)
OUTPUT: 4

INPUT:  @N = (1, 3, 8, 2, 0)
OUTPUT: 5

INPUT:  @N = (5)
OUTPUT: 0

INPUT:  @N = ()
OUTPUT: 0
```

### TASK #2 › Decimal String

> Submitted by: Mohammad S Anwar  
> You are given numerator and denominator i.e. `$N` and `$D`.
>
> Write a script to convert the fraction into decimal string. If the fractional part is recurring then put it in parenthesis.

I'm much less happy about this one.

I took the long way around the decimal representation part, forgetting it's basically as easy as `say $n / $d`, with more control with `sprintf`. The problem is finding the repeats.

Simple repeats have one digit repeating, as shown by **1/3** being **0.<span style="text-decoration:overline">3</span>** (using tradition syntax), or **0.333333333333333** if taken to 15 digits. Problem is, `sprintf '%.21f', 1/3` gives us **0.333333333333333314830**, which I can't decide is a reportable bug or not.

Jumping to **2/3**, we then get to rounding up. `%.3f` gives you **0.667**, and when we're at `%.21f`, it jumps to **0.666666666666666629659**.

And when we go to another example, **5/66**, we get to repeated numbers. **0.0<span style="text-decoration:overline">75</span>** in traditional syntax and **0.0(75)** in this task's notation, but we get rounding up, ending with **6** or **8**, depending on if it's thinking **5.7** or **7.5** when it rounds.

```text
0.0757575757575758
3       %.3f    0.076
6       %.6f    0.075758
9       %.9f    0.075757576
12      %.12f   0.075757575758
15      %.15f   0.075757575757576
18      %.18f   0.075757575757575760
21      %.21f   0.075757575757575759678
24      %.24f   0.075757575757575759678453
27      %.27f   0.075757575757575759678452698
30      %.30f   0.075757575757575759678452698154
5 / 66 = 0.0757575757575758
```

I don't think I spent any time thinking about remainders like this since high school math. We _could_ automate long division so we keep getting the 75s, but the idea of it makes my mind blister.

So, what instead is the solution? If we're repeating **3**, then we match `33`. If we're repeating **75**, we match `7575`. Find where the first match is, then use `substr` to replace everything behind. We avoid rounding errors (for small lengths of repeating digits) and we avoid the bad behavior that occurs after the 16th digit.

My unusual feature of the week<sup>tm</sup> is the use of named loops. `last` _normally_ works on the current loop, so with the following code, it only works within the `$j` loop.

```perl
for my $i ( 0 .. $l ) {
    for my $j ( 1 .. $l ) {
        last if $i + $j > $l;
        ...
    }
}
```

But if what you want is to give up entirely, just throw a name in there.

```perl
OUTER: for my $i ( 0 .. $l ) {
    for my $j ( 1 .. $l ) {
        last OUTER if $i + $j > $l;
        ...
    }
}
```

It just nopes out of everything. Very useful.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

use Carp;

my $inputs = [
    { N => 1, D => 2 },
    { N => 1, D => 3 },
    { N => 2, D => 3 },
    { N => 3, D => 16 },
    { N => 3, D => 4 },
    { N => 5, D => 66 },
];

for my $i ( $inputs->@* ) {
    my $out = decimal_string( $i->{N}, $i->{D} );
    say qq{Input:  \$N = $i->{N}, \$D = $i->{D}, };
    say qq{Output: $out};
    say '';
}

sub decimal_string ( $n, $d ) {
    croak 'Cannot Divide By Zero' if $d == 0;
    my $out = 0;
    my $x   = 1 / $d;
    my $r   = 1 % $d;
    my $nn  = $n * $x;
    my ( $integral, $mantissa ) = split /\./, $nn;
    my $length = length $mantissa;
    my $c      = 0;
OUTER: for my $i ( 0 .. $length ) {
        for my $j ( 1 .. $length ) {
            my $copy   = $mantissa;
            my $string = substr( $mantissa, $i, $j );
            next unless length $string > 0;
            next if $j > $length;
            if ( $mantissa =~ /^\d*$string$string/mix ) {
                substr( $copy, $i ) = qq{($string)};
                $nn = join '.', $integral, $copy;
                last OUTER;
            }
        }
    }
    return $nn;
}
```

```text
Input:  $N = 1, $D = 2,
Output: 0.5

Input:  $N = 1, $D = 3,
Output: 0.(3)

Input:  $N = 2, $D = 3,
Output: 0.(6)

Input:  $N = 3, $D = 16,
Output: 0.1875

Input:  $N = 3, $D = 4,
Output: 0.75

Input:  $N = 5, $D = 66,
Output: 0.0(75)
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
