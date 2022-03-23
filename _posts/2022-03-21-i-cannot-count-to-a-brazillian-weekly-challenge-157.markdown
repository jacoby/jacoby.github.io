---
layout: post
title: "I Cannot Count To A Brazillian: Weekly Challenge #157"
author: "Dave Jacoby"
date: "2022-03-21 12:51:47 -0400"
categories: ""
---

It's just another [Manic Monday](https://open.spotify.com/track/00vYs0qZA40Z8AAaN7xmMO) and time for [the (Perl) Weekly Challenge #157](https://theweeklychallenge.org/blog/perl-weekly-challenge-157/). [**157**](<https://en.wikipedia.org/wiki/157_(number)>) is a [balanced prime](https://en.wikipedia.org/wiki/Balanced_prime) meaning that it is the _arithmetic mean_ of the previous and next primes **(spoilers)**. It is also a [Chen prime](https://en.wikipedia.org/wiki/Chen_prime), meaning that 157 + 2, 159, is the product of two primes (3 x 53).

### TASK #1 › Pythagorean Means

> Submitted by: Mohammad S Anwar  
> You are given a set of integers.
>
> Write a script to compute all three **Pythagorean Means** i.e **Arithmetic Mean**, **Geometric Mean** and **Harmonic Mean** of the given set of integers. Please refer to wikipedia [page](https://en.wikipedia.org/wiki/Pythagorean_means) for more informations.

As is often the case, we're dealing with tools purpose-built to do mathematics, but the way it's written is [all Greek to me](https://en.wikipedia.org/wiki/Greek_to_me). I don't _think_ that Github Markdown has the kind of MathML and L<sup>a</sup>T<sub>e</sub>X integrations to really do it.

[Wikipedia is able to show the mathematical formulation.](https://en.wikipedia.org/wiki/Pythagorean_means) It's just up to us to make them Perl

- [**AM**](https://en.wikipedia.org/wiki/Aritmetic_mean) => `( sum @array ) / scalar @array`
- [**GM**](https://en.wikipedia.org/wiki/Geometric_mean) => `( abs(product( @array ))) ** ( 1 / scalar @array )`
- [**HM**](https://en.wikipedia.org/wiki/Harmonic_mean) => `( scalar @array ) / sum map { 1/$_ } @array`

(`product` is provided by the continually-useful [List::Util](https://metacpan.org/pod/List::Util))

But when you run it without rounding, you get many significant digits, but the examples are rounded.

Which, with [Math::BigFloat](https://metacpan.org/pod/Math::BigFloat), is incredibly easy.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use List::Util qw{ sum0 product };
use Math::BigFloat;

my @examples;
push @examples, [ 1, 3, 5, 6, 9 ];
push @examples, [ 2, 4, 6, 8, 10 ];
push @examples, [ 1, 2, 3, 4, 5 ];

for my $e (@examples) {

    my $am = round( arithmetic_mean( $e->@* ) );
    my $gm = round( geometric_mean( $e->@* ) );
    my $hm = round( harmonic_mean( $e->@* ) );
    my $ee = join ', ', $e->@*;
    say <<"END";
        Input:  \@n = ($ee)
        OUTPUT: AM = $am, GM = $gm, HM = $hm
END
}

sub arithmetic_mean ( @array ) {
    return ( sum0 @array ) / ( scalar @array );
}

sub geometric_mean ( @array ) {
    my $x = abs product @array;
    my $y = 1 / scalar @array;
    return $x**$y;
}

sub harmonic_mean ( @array ) {
    my $sm = sum0 map { 1 / $_ } @array;
    my $n  = scalar @array;
    return $n / $sm;
}

sub round( $n ) {
    return Math::BigFloat->new($n)->bfround(-1);
}
```

```text
$ ./ch-1.pl
        Input:  @n = (1, 3, 5, 6, 9)
        OUTPUT: AM = 4.8, GM = 3.8, HM = 2.8

        Input:  @n = (2, 4, 6, 8, 10)
        OUTPUT: AM = 6.0, GM = 5.2, HM = 4.4

        Input:  @n = (1, 2, 3, 4, 5)
        OUTPUT: AM = 3.0, GM = 2.6, HM = 2.2
```

### TASK #2 › Brazilian Number

> Submitted by: Mohammad S Anwar  
> You are given a number **$n > 3**.
>
> Write a script to find out if the given number is a **Brazilian Number**.
>
> > A positive integer number N has at least one natural number B where 1 < B < N-1 where the representation of N in base B has same digits.

This involved a lot of base conversions, so I grabbed my code using [Math::BaseCalc](https://metacpan.org/pod/Math::BaseCalc), which is overengineered to handle the previous challenge.

We're given **7** as a successful example:

| Base | Decimal 7 in that Base |
| ---- | ---------------------- |
| 2    | **111**                |
| 3    | 21                     |
| 4    | 13                     |
| 5    | 12                     |

Similarly, with **8**:

| Base | Decimal 8 in that Base |
| ---- | ---------------------- |
| 2    | 1000                   |
| 3    | **22**                 |
| 4    | 20                     |
| 5    | 13                     |
| 6    | 12                     |

But no joy with **6**:

| Base | Decimal 6 in that Base |
| ---- | ---------------------- |
| 2    | 110                    |
| 3    | 20                     |
| 4    | 12                     |

I `split` the number into constituent digits, `sort` the digits because I don't trust the next step so much, and use `uniq` from List::Util (really the Leatherman of modules; so many uses!), and check to see that the resulting list has only one entry with `scalar`.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use Math::BaseCalc;
use List::Util qw{ uniq } ;

my @range = ( 0 .. 9, 'A' .. 'Z' );

for my $n ( 5 .. 8 ) {
    my $bn = brazillian_number($n);
    say <<"END";
    Input:  \$n = $n
    Output: $bn
END
}

sub brazillian_number ( $n ) {
    for my $base ( 2 .. $n - 2 ) {
        my @digits = map { $range[$_] } ( 0 .. $base - 1 );
        my $digits = join '', @digits;
        my $c      = convert_to( $n, $digits );
        my @ddigits = uniq sort split //, $c;
        return 1 if scalar @ddigits == 1;
    }
    return 0;
}

{
    state $base = {};

    sub convert_from ( $number, $digits ) {
        state $table_from = {};
        my @digits = split //, $digits;
        if ( !defined $base->{$digits} ) {
            $base->{$digits} = Math::BaseCalc->new( digits => [@digits] );
        }
        if ( !$table_from->{$digits}{$number} ) {
            my $from = $base->{$digits}->from_base($number);
            $table_from->{$digits}{$number} = $from;
        }
        return $table_from->{$digits}{$number};
    }

    sub convert_to ( $number, $digits ) {
        state $table_to = {};
        my @digits = split //, $digits;
        if ( !defined $base->{$digits} ) {
            $base->{$digits} = Math::BaseCalc->new( digits => [@digits] );
        }
        if ( !$table_to->{$digits}{$number} ) {
            my $to = $base->{$digits}->to_base($number);
            $table_to->{$digits}{$number} = $to;
        }
        return $table_to->{$digits}{$number};
    }
}
```

```text
$ ./ch-2.pl
    Input:  $n = 5
    Output: 0

    Input:  $n = 6
    Output: 0

    Input:  $n = 7
    Output: 1

    Input:  $n = 8
    Output: 1
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
