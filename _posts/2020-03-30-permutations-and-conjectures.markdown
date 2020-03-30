---
layout: post
title: "Permutations and Conjectures"
author: "Dave Jacoby"
date: "2020-03-30 18:31:54 -0400"
categories: ""
---

[Perl Weekly Challenge #54](https://perlweeklychallenge.org/blog/perl-weekly-challenge-054/)

### TASK #1 - kth Permutation Sequence

> Write a script to accept two integers **n (>=1)** and **k (>=1)**. It should print the kth permutation of n integers. For more information, please follow the wiki page.
>
> For example, **n=3** and **k=4**, the possible permutation sequences are listed below:
>
> `123` <br> `132` <br> `213` <br> `231` <br> `312` <br> `321`
>
> The script should print the **4th** permutation sequence **231**.

**Permutations!** This is a thing I learned about from my **Overkill** code, which is [where my `permute_array()` function was pulled from](https://jacoby.github.io/2019/07/12/the-last-overkill.html).

And given an array `[[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]`, pulling out the `k`th entry is as simple as calling for `$array[$k-1]`.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ fc postderef say signatures state switch };
no warnings qw{ experimental };

use Carp;
use JSON;

my $json = JSON->new->canonical->allow_nonref;

my $permutation = return_permutation( 3, 4 );
say $json->encode($permutation);

sub return_permutation ( $n, $k ) {
    $n = int $n;
    $k = int $k;
    croak 'n < 1' unless $n >= 1;
    croak 'k < 1' unless $k >= 1;
    my $src->@* = 1 .. $n;
    my @permutations = permute_array($src);
    my @output;

    if ( $permutations[ $k - 1 ] ) {
        push @output, $permutations[ $k - 1 ]->@*;
    }

    return wantarray ? @output : \@output;
}

sub permute_array ( $array ) {
    return $array if scalar $array->@* == 1;
    my @response = map {
        my $i        = $_;
        my $d        = $array->[$i];
        my $copy->@* = $array->@*;
        splice $copy->@*, $i, 1;
        my @out = map { unshift $_->@*, $d; $_ } permute_array($copy);
        @out
    } 0 .. scalar $array->@* - 1;
    return @response;
}
```

Also, it was pointed out to me that I can tighten up my boilerplate by just doing `no warnings qw{experimental}` instead of listing all the `experimental::whatever` pragmas I want. Thanks, [@holli-holzer](https://github.com/holli-holzer).

### TASK #2 - Collatz Conjecture

> Contributed by Ryan Thompson
>
> It is thought that the following sequence will always reach 1:
>
> `$n = $n / 2` when `$n` is even
>
> `$n = 3*$n + 1` when `$n` is odd
>
> For example, if we start at **23**, we get the following sequence:
>
> 23 → 70 → 35 → 106 → 53 → 160 → 80 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1
>
> Write a function that finds the **Collatz** sequence for any positive integer. Notice how the sequence itself may go far above the original starting number.

At this level, it's fairly easy; recursion with three cases: 1, even and odd. I even added `binmode` to make sure that the arrow in the original task gets used in the concatenation.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings qw{ experimental recursion };
binmode( STDOUT, ":utf8" ) ;

use Carp;
use JSON;

my $json = JSON->new->canonical->pretty->allow_nonref;

my $n = 23;
my @output = collatz($n);
say join ' → ', @output;

exit;

sub collatz ( $n ) {
    $n = int $n;
    croak if $n < 1;
    my @sec;
    if ( $n == 1 ) {
        push @sec, 1;
    }
    elsif ( $n % 2 == 1 ) {    #odd
        my $o = ( 3 * $n ) + 1;
        push @sec, $n, collatz($o);
    }
    elsif ( $n % 2 == 0 ) {    #even
        my $o = $n / 2;
        push @sec, $n, collatz($o);
    }
    return wantarray ? @sec : \@sec;
}
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
