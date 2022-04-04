---
layout: post
title: "Métal Perlant: Weekly Challenge #159"
author: "Dave Jacoby"
date: "2022-04-04 12:32:45 -0400"
categories: ""
---

Welcome to [Weekly Challenge #159](https://theweeklychallenge.org/blog/perl-weekly-challenge-159/).

**159** is a [**Woodall Number**](https://en.wikipedia.org/wiki/Woodall_number), which is any natural number of the form **W<sub>n</sub> = n \* 2<sup>n</sup> - 1**.

I don't normally explain my titles, but this time I feel it's justified, as Task #2 is about Möbius numbers, introduced by mathematician [**August Ferdinand Möbius**](https://en.wikipedia.org/wiki/August_Ferdinand_Möbius).

I, however, immediately thought about [**Jean Giraud**](https://en.wikipedia.org/wiki/Jean_Giraud), the artist who collaborated on such works as _Alien_, _Tron_, _The Abyss_, _Space Jam_ and the unmade version of _Dune_ from Alejandro Jodorowsy. His work appeared in a comics magazine called _Métal Hurlant_, which is published in America as [**_Heavy Metal_**](<https://en.wikipedia.org/wiki/Heavy_Metal_(magazine)>).

He is known by the pseudonym **Mœbius**, with a ligature instead of the umlaut. Close enough for a title, I think

### TASK #1 › Farey Sequence

> Submitted by: Mohammad S Anwar  
> You are given a positive number, **$n**.
>
> Write a script to compute [**Farey Sequence**](https://en.wikipedia.org/wiki/Farey_sequence) of the order **$n**.

One of the examples of a Farey Sequence is that of 4.

> 0/1, 1/4, 1/3, 1/2, 2/3, 3/4, 1/1

The easiest thought is to take every denomerator (**1** through **4**) and then every numerator (**0** through denominator), and list them in order, but then you'd see something like.

> 0/1, 0/1, 0/2, 0/2, 1/4, 1/3, 1/2, 2/3, 2/3, 3/4, 1/1, 2/2, 3/3, 4,4

To control this, I used `eval`. I almost _never_ use `eval` because I am usually dealing with input that isn't my own. I know I'm doing safe things, like avoiding zero in denominator, so this is fine.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use Carp;
use Getopt::Long;

my $n = 6;
GetOptions( 'number=i' => \$n, );
croak 'Out of range' if $n < 1;

farey($n);

sub farey ( $i ) {
    my %farey;
    for my $d ( 1 .. $i ) {
        for my $n ( 0 .. $d ) {
            my $k = eval( $n / $d );
            $farey{$k} = qq{$n/$d} unless defined $farey{$k};
        }
    }
    my $output = join ', ', map { $farey{$_} } sort { $a <=> $b } keys %farey;

    say <<"END";
Input:  \$n = $i
Output: $output.
END
}
```

```text
$ ./ch-1.pl -n 4
Input:  $n = 4
Output: 0/1, 1/4, 1/3, 1/2, 2/3, 3/4, 1/1.

$ ./ch-1.pl -n 5
Input:  $n = 5
Output: 0/1, 1/5, 1/4, 1/3, 2/5, 1/2, 3/5, 2/3, 3/4, 4/5, 1/1.

$ ./ch-1.pl -n 6
Input:  $n = 6
Output: 0/1, 1/6, 1/5, 1/4, 1/3, 2/5, 1/2, 3/5, 2/3, 3/4, 4/5, 5/6, 1/1.

$ ./ch-1.pl -n 7
Input:  $n = 7
Output: 0/1, 1/7, 1/6, 1/5, 1/4, 2/7, 1/3, 2/5, 3/7, 1/2, 4/7, 3/5, 2/3, 5/7, 3/4, 4/5, 5/6, 6/7, 1/1.

$ ./ch-1.pl -n 8
Input:  $n = 8
Output: 0/1, 1/8, 1/7, 1/6, 1/5, 1/4, 2/7, 1/3, 3/8, 2/5, 3/7, 1/2, 4/7, 3/5, 5/8, 2/3, 5/7, 3/4, 4/5, 5/6, 6/7, 7/8, 1/1.
```

### TASK #2 › Moebius Number

> Submitted by: Mohammad S Anwar  
> You are given a positive number **$n**.
>
> Write a script to generate the [**Moebius Number**](https://en.wikipedia.org/wiki/M%C3%B6bius_function) for the given number.

From Wikipedia:

> For any positive integer n, define _μ(n)_ as the sum of the primitive _nth_ roots of unity. It has values in {−1, 0, 1} depending on the factorization of _n_ into prime factors:
>
> - _μ(n)_ = +1 if _n_ is a square-free positive integer with an even number of prime factors.
> - _μ(n)_ = −1 if _n_ is a square-free positive integer with an odd number of prime factors.
> - _μ(n)_ = 0 if _n_ has a squared prime factor.

So, we need to find all the prime factors and determine if any of them are repeated, because that means you have a squared prime factor. From there, we determine if there's an even number of prime factors. All fairly easy.

So I decided to throw a complication. The function is the **Möbius function** and is written as **μ(n)**. I just _had_ to `use utf8` so I can have **μ** and **ö** in variable and function names.

Wikipedia puts the 1 through 50 and the corresponding value of μ(n) into five tables of ten numbers each, and my output follows that format, but of course it would be easy to copy the [Getopt::Long](https://metacpan.org/pod/Getopt::Long) part of Task #1 over to get specific digits.

(I _mostly_ know _μ_ because that is the term for the add9 chords that appear all over Steely Dan songs, but it was also part of the quality control of gene sequences in a previous job.)

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use utf8;

for my $n ( 1 .. 50 ) {
    my $μ = möbius($n);
    print join " ", "  " , map { sprintf '%2d', $_ } $n, $μ;
    say '' if $n % 10 == 0;
}

sub möbius ($n) {
    my @primes = prime_factors($n);
    my %primes;

    # has squared prime factor
    map { $primes{$_}++ } @primes;
    for my $k ( keys %primes ) {
        return 0 if $primes{$k} > 1;
    }

    # square-free
    my $p = scalar @primes;
    return $p % 2 == 0 ? 1 : -1;
}

sub prime_factors( $n ) {
    my @primes;
    my $nn = $n;
    for my $i ( 2 .. $n ) {
        while ( $nn % $i == 0 ) {
            $nn = $nn / $i;
            push @primes, $i;
        }
    }
    return @primes;
}
```

```text
$ ./ch-2.pl
    1  1    2 -1    3 -1    4  0    5 -1    6  1    7 -1    8  0    9  0   10  1
   11 -1   12  0   13 -1   14  1   15  1   16  0   17 -1   18  0   19 -1   20  0
   21  1   22  1   23 -1   24  0   25  0   26  1   27  0   28  0   29 -1   30 -1
   31 -1   32  0   33  1   34  1   35  1   36  0   37 -1   38  1   39  1   40  0
   41 -1   42 -1   43 -1   44  0   45  0   46  1   47 -1   48  0   49  0   50  0
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
