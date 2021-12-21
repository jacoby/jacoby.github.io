---
layout: post
title: "Almost Prime and In Sequence: The Weekly Challenge #144"
author: "Dave Jacoby"
date: "2021-12-20 17:14:40 -0500"
categories: ""
---

[144 = 12 <sup>2</sup>](https://theweeklychallenge.org/blog/perl-weekly-challenge-144/), and it's really [_gross!_](<https://en.wikipedia.org/wiki/Gross_(unit)>)

### TASK #1 › Semiprime

> Submitted by: Mohammad S Anwar  
> Write a script to generate all **Semiprime** numbers `<= 100`.
>
> For more information about **Semiprime**, please checkout [the wikipedia page](https://en.wikipedia.org/wiki/Semiprime).
>
> > In mathematics, a semiprime is a natural number that is the product of exactly two prime numbers. The two primes in the product may equal each other, so the semiprimes include the squares of prime numbers.

A number is **semiprime** if it's the product of two prime numbers, besides 1 and itself, of course.

So, we need to know if a number is prime, and we need all factors. Instead of my previous _is_prime_ function, which [Colin calls out as suboptimal for this purpose](https://theweeklychallenge.org/blog/review-challenge-139/), I grabbed [Flavio Poletti's](https://github.com/manwar/perlweeklychallenge-club/blob/master/challenge-139/polettix/perl/ch-2.pl)

```perl
    sub is_prime ($n) {
       for (2 .. sqrt $n) { return unless $n % $_ }
       return 1;
    }
```

So, beyond that, you need?

* A number between 2 and the square root of _n_ 
* that is a factor of _n_
* and the corresponding factor to complete the math
* and both numbers are primes
* that have not been handled before.

Thankfully, this is easy to do with functional programming.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say state postderef signatures };
no warnings qw{ experimental };

say join ', ', grep { is_semiprime($_) } 1 .. 100;

sub is_semiprime ($n ) {
    my $done;
    return 0 if is_prime($n);
    my @factors =
        grep { !$done->{ $_->[0] }{ $_->[1] }++ }    # avoid replication
        grep { is_prime( $_->[0] ) }                 # factor 1 is prime
        grep { is_prime( $_->[1] ) }                 # factor 2 is prime
        map  { [ sort $_, $n / $_ ] }                # both applicable factors
        grep { 0 == $n % $_ }                        # is a factor
        2 .. sqrt $n;
    return scalar @factors == 1 ? 1 : 0;
}

sub is_prime ($n) {
    for ( 2 .. sqrt $n ) { return unless $n % $_ }
    return 1;
}
```

```text
4, 6, 9, 10, 14, 15, 21, 22, 25, 26, 33, 34, 35, 
38, 39, 46, 49, 51, 55, 57, 58, 62, 65, 69, 74, 77, 
82, 85, 86, 87, 91, 93, 94, 95
```

### TASK #2 › Ulam Sequence

> Submitted by: Mohammad S Anwar  
> You are given two positive numbers, $u and $v.
>
> Write a script to generate Ulam Sequence having at least 10 Ulam numbers where $u and $v are the first 2 Ulam numbers.
>
> For more information about Ulam Sequence, please checkout the website.
>
> > The standard Ulam sequence (the (1, 2)-Ulam sequence) starts with U1 = 1 and U2 = 2. Then for n > 2, Un is defined to be the smallest integer that is the sum of two distinct earlier terms in exactly one way and larger than all earlier terms.

The key words are _"exactly one way"_. Starting `u=1` and `v=2`, you get 3 and 4, and can get to 5 with 1 + 4 and 2 + 3, so 5 is not a Ulam number.

So, the key is to store the number of ways you can get to a number, and then check to be sure that you only count 1.

We also go back to the **O(nlogn)** method of using two loops over the factor array, ensuring that there are no duplicated factors.

I use `delete` a lot to clear the output hash of entries that match too many times.

I dunno, there's probably more I could say to explain myself, but I'm failing to see what.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use JSON;
my $json = JSON->new;

my @examples;
push @examples, [ 1, 2 ];
push @examples, [ 2, 3 ];
push @examples, [ 2, 5 ];
push @examples, [ 5, 7 ];

for my $x (@examples) {
    say '-' x 20;
    my ( $u, $v ) = $x->@*;
    my @sequence = ulam( $u, $v );
    my $sequence = join ', ', sort { $a <=> $b } @sequence;
    say <<"END";
    Input:   \$u = $u, \$v = $v
    Output: $sequence
END
}

sub ulam ( $u = 1, $v = 2 ) {
    my %output;
    my @output;

    # cover the base cases
    $output{$u} = 1;
    $output{$v} = 1;

    my ($c) = sort { $b <=> $a } $u, $v;
    while (1) {
        $c++;

        # ensure that non-Ulam numbers ("exactly one way")
        # get weeded out
        map { delete $output{$_} } grep { $output{$_} > 1 }
            keys %output;
        @output = sort { $a <=> $b } keys %output;

        # testing early, because of the filter
        return @output if scalar @output == 10;

        for my $i ( 0 .. -2 + scalar @output ) {
            my $x = $output[$i];
            for my $j ( $i + 1 .. -1 + scalar @output ) {
                my $y = $output[$j];
                my $d = $x + $y;
                if ( $c == $d ) {
                    $output{$c}++;
                }
            }
        }
    }

    # "Remember the impossible scenario we never planned for?"
    return [];
}
```

```text
./ch-2.pl
--------------------
    Input:   $u = 1, $v = 2
    Output: 1, 2, 3, 4, 6, 8, 11, 13, 16, 18

--------------------
    Input:   $u = 2, $v = 3
    Output: 2, 3, 5, 7, 8, 9, 13, 14, 18, 19

--------------------
    Input:   $u = 2, $v = 5
    Output: 2, 5, 7, 9, 11, 12, 13, 15, 19, 23

--------------------
    Input:   $u = 5, $v = 7
    Output: 5, 7, 12, 17, 19, 22, 26, 27, 32, 33
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
