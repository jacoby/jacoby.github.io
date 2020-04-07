---
layout: post
title: "Challenge #55: Flipping and Waving"
author: "Dave Jacoby"
date: "2020-04-06 19:56:04 -0400"
categories: ""
---

### TASK #1 - Flip Binary

> You are given a binary number **B**, consisting of **N** binary digits `0` or `1`: **s0, s1, …, s(N-1)**.
>
> Choose two indices **L** and **R** such that `0 ≤ L ≤ R < N` and flip the digits **s(L), s(L+1), …, s(R)**. By flipping, we mean change `0` to `1` and vice-versa.
>
> For example, given the binary number `010`, the possible flip pair results are listed below:
>
> - L=0, R=0 the result binary: `110`
> - L=0, R=1 the result binary: `100`
> - L=0, R=2 the result binary: `101`
> - L=1, R=1 the result binary: `000`
> - L=1, R=2 the result binary: `001`
> - L=2, R=2 the result binary: `011`
>
> Write a script to find the indices **(L,R)** that results in a binary number with maximum number of `1`s. If you find more than one maximal pair **L,R** then print all of them.
>
> Continuing our example, note that we had three pairs **(L=0, R=0)**, **(L=0, R=2)**, and **(L=2, R=2)** that resulted in a binary number with two `1`s, which was the maximum. So we would print all three pairs.

I coded this _after_ Task 2, because I didn't see the solution as immediately as that one, but then it struck me. Bit-flipping is `int !$bool`, as I mention below, and so the only difficult thing to understand is that `substr` can be both an [**lvalue**](https://perldoc.perl.org/perlglossary.html#lvalue) and an [**rvalue**](https://perldoc.perl.org/perlglossary.html#rvalue). This means that `substr( $bin, $n, 1 ) = int !substr( $bin, $n, 1 )` substitutes a bit with it's flip in place. If I was putting this into production with a team that's not strong in their Perl-fu, I might want to `split` the string into an array, `int !$array[$i]` and `join` it back again, but that's not necessary and in fact contains a lot of busy work.

And I feel I should mention `my $length = -1 + length $bin`. `length` of `010` is 3, but of course we come from C and zero-index, so we want to cut that down to 2, but `length $bin - 1` is thought of as `length( $bin - 1 )`, not `length( $bin ) -1`, so by putting `-1` _before_ `length`, I make sure it does what I want.

I used `sum0` from [List::Util](https://metacpan.org/pod/List::Util) as the easiest way to find the number of `1`s in a given binary number, and since I'm using List::Util, I used `max` to grab the highest key in the hash I'm storing the values in, as well.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ fc postderef say signatures state switch };
no warnings qw{ experimental };

use List::Util qw{ sum0 max };

my $bin  = '010';

my $length = -1 + length $bin;
my $record;

for my $l ( 0 .. $length ) {
    for my $r ( $l .. $length ) {
        my $flipped = flip( $bin, $l, $r );
        my $sum     = sum0( split //, $flipped );
        push $record->{$sum}->@*, [ $sum, $l, $r, $flipped ];
    }
}
say qq{Base: $bin};
say join ' ', qw{ I L R String };
say '=' x 12;
for my $bin ( map { $record->{$_}->@* } max keys $record->%* ) {
    say join ' ', map { $bin->[$_] } 0 .. 3;
}

sub flip ( $bin, $l, $r ) {
    for my $n ( $l .. $r ) {
        substr( $bin, $n, 1 ) = int !substr( $bin, $n, 1 );
    }
    return $bin;
}

# $ ./ch-1.pl
# Base: 010
# I L R String
# ============
# 2 0 0 110
# 2 0 2 101
# 2 2 2 011
```

### TASK #2 - Wave Array

> Any array **N** of non-unique, unsorted integers can be arranged into a wave-like array such that **n1 ≥ n2 ≤ n3 ≥ n4 ≤ n5** and so on.
>
> For example, given the array **[1, 2, 3, 4]**, possible wave arrays include **[2, 1, 4, 3]** or **[4, 1, 3, 2]**, since **2 ≥ 1 ≤ 4 ≥ 3** and **4 ≥ 1 ≤ 3 ≥ 2**. This is not a complete list.
>
> Write a script to print all possible wave arrays for an integer array **N** of arbitrary length.
>
> **Notes**:
> When considering **N** of any length, note that the first element is always greater than or equal to the second, and then the ≤, ≥, ≤, … sequence alternates until the end of the array.

**N** is not bounded, and to me, this is a perfect place for **recursion**, especially considering that, unlike `fibonacci`, this doesn't blow up to uselessness.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings qw{ experimental };

for my $n ( 1 .. 4 ) {
    for my $arr ( permute_array( [ 1 .. $n ] ) ) {
        say display($arr) if waves($arr);
    }
}

exit;

# bitflip 1 means >=
# bitflip 0 means <=

sub waves ( $array, $bitflip = 1 ) {
    if ( scalar $array->@* == 1 )                 { return 1 }
    if ( $bitflip && $array->[0] < $array->[1] )  { return 0 }
    if ( !$bitflip && $array->[0] > $array->[1] ) { return 0 }
    my $array2->@* = map { $_ } $array->@*;
    shift $array2->@*;
    return waves( $array2, int !$bitflip );
    return 1;
}

# display behaves much the same as waves

sub display ( $array, $bitflip = 1 ) {
    if ( scalar $array->@* == 1 ) { return $array->[0] }
    my $sign       = $bitflip ? '>=' : '<=';
    my $array2->@* = map { $_ } $array->@*;
    my $n          = shift $array2->@*;
    return qq{$n $sign } . display( $array2, int !$bitflip );
}

# Return of the permute_array function! Recursion!
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

Things worth noting:

- Bit-flipping comes with `!$bool`, but you swap between `1` and `''`, and I like to see `0` when debugging, so I use `int !$bool` for flipping bits.
- I like the experimental `signatures` feature, and I like defaults, so I can call `waves($array)` and know it starts with `$bitflip=1` and goes on from there.
- Arrays can be [slurpy](https://www.effectiveperlprogramming.com/2015/04/use-v5-20-subroutine-signatures/), so to pass around arrays, I use array refs, but then we get the problem of passing values or what. (["You can call me `$ray` or you can call me `$jay`..."](https://en.wikipedia.org/wiki/Bill_Saluga), to make a reference older than the language I'm coding in.) So, `$copy->@* = map { $_ } $original->@*` ensures that I'm not stomping on the original.
- I'm using `>=` and `<=` rather than `≥` and `≤` because I know Perl can print them correctly, but the Perl tools I use in VS Code still have a problem with Wide Characters and such, and so they're more annoying than they're worth.

But I know me, and I know that I think _everything_ is a perfect place for recursion. [_Son's math homework? Recursion!_](https://varlogrant.blogspot.com/2015/10/overkill-using-awesome-power-of-modern.html) I mean, unlike eating a Ritz cracker, there's never a wrong time to use recursion, but there's wrong ways.

So I tried the same with **iteration**. All is the same except the functions themselves, so to avoid repeating myself...

```perl
sub waves ( $array ) {
    my $copy->@* = map { $_ } $array->@*;
    my $bitflip = 1;
    my @output;
    while ( scalar $copy->@* > 1 ) {
        if ( $bitflip  && $copy->[0] < $copy->[1] ) { return 0 }
        if ( !$bitflip && $copy->[0] > $copy->[1] ) { return 0 }
        shift $copy->@*;
        $bitflip = int !$bitflip;
    }
    return 1;
}

sub display ( $array ) {
    my $copy->@* = map { $_ } $array->@*;
    my $bitflip  = 1;
    my $output   = '';
    while ( scalar $copy->@* > 1 ) {
        my $sign = $bitflip ? '>=' : '<=';
        $output .= shift $copy->@*;
        $output .= qq{ $sign };
        $bitflip = int !$bitflip;
    }
    $output .= shift $copy->@*;
    return $output;
}
```

Part of me **really** wants to redo that with an output array where integers and signs get pushed and then `return join ' ', @output`, but that's not necessary.

And head-to-head, on the arrays `[1]`, `[1,2]`, `[1,2,3]`, and `[1,2,3,4]`, , we get this output:

```data

$ ./ch-2.pl && ./ch-2b.pl
1
2 >= 1
2 >= 1 <= 3
3 >= 1 <= 2
2 >= 1 <= 4 >= 3
3 >= 1 <= 4 >= 2
3 >= 2 <= 4 >= 1
4 >= 1 <= 3 >= 2
4 >= 2 <= 3 >= 1
1
2 >= 1
2 >= 1 <= 3
3 >= 1 <= 2
2 >= 1 <= 4 >= 3
3 >= 1 <= 4 >= 2
3 >= 2 <= 4 >= 1
4 >= 1 <= 3 >= 2
4 >= 2 <= 3 >= 1
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io)
