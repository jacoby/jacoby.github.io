---
layout: post
title: "Use Proxy: Weekly Challenge #305"
author: "Dave Jacoby"
date: "2025-01-25 17:39:04 -0500"
categories: ""
---

[![305 Use Proxy](https://http.cat/images/305.jpg)](https://http.cat/status/305)

Welcome to [**_Weekly Challenge #305!_**](https://theweeklychallenge.org/blog/perl-weekly-challenge-305/)
**305** is an _odd composite number_, the product of **61** and **5**, the original area code for Florida and now covering the greater Miami area.

It is also **Use Proxy**, an [HTTP status code](https://datatracker.ietf.org/doc/html/draft-cohen-http-305-306-responses-00.txt) that has been depricated due to security concerns.

### Task 1: Binary Prefix

> Submitted by: Mohammad Sajid Anwar
> You are given a binary array.
>
> Write a script to return an array of booleans where the partial binary number up to that point is prime.

#### Let's Talk About It

This is dealing with slices, ranges, prime numbers and binary-to-decimal conversion.

A **range** is a way to get a list of values, either numbers or characters. `first_value .. last_value`, like `0 .. 5` gives you `[0, 1, 2, 3, 4, 5]`.

A **slice** is a subsection of an array. If `@letters = 'a' .. 'z'`, then the slice `@letters[0..5]` would be `['a', 'b', 'c', 'd', 'e']`.

A **prime number** is [a natural number greater than 1 that is not a product of two smaller natural numbers](https://en.wikipedia.org/wiki/Prime_number). I have a function that determines if a number is prime by checking ever number from 2 to the square root to see if it goes evenly into that number.

Leaving us **binary to decimal** conversion. We start with an array of **ones** and **zeros**, and `join` them, so `[1, 0, 1]` becomes `101`. `oct( '0b101' )` then converts it to `5`.

So, we take the array of binary digits, combine them one at a time into a binary number, convert that to decimal, then check to see if it's prime. If prime, add _true_ to an array, and _false_ if not. I like a **ternary operator** for that.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

my @examples = (

    [ 1, 0, 1 ],
    [ 1, 1, 0 ],
    [ 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1 ],
);

for my $example (@examples) {
    my $binary = join ', ', $example->@*;
    my @output = binary_prefix( $example->@* );
    my $output = join ', ', @output;
    say <<"END";
    Input:  \@binary = ($binary)
    Output: ($output)
END
}

sub binary_prefix (@binary) {
    my @output;
    for my $i ( 0 .. $#binary ) {
        my @slice = @binary[ 0 .. $i ];
        my $bin   = join '', @slice;
        my $dec   = oct( "0b" . $bin );
        push @output, is_prime($dec) ? 'true' : 'false';
    }
    return @output;
}

sub is_prime ($n) {
    die "Bad number $n" unless length $n;
    return 0 if $n == 0;
    return 0 if $n == 1;
    for ( 2 .. sqrt $n ) { return 0 unless $n % $_ }
    return 1;
}
```

```text
$ ./ch-1.pl
    Input:  @binary = (1, 0, 1)
    Output: (false, true, true)

    Input:  @binary = (1, 1, 0)
    Output: (false, true, false)

    Input:  @binary = (1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1)
    Output: (false, true, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, true)
```

### Task 2: Alien Dictionary

Submitted by: Mohammad Sajid Anwar
You are given a list of words and alien dictionary character order.

Write a script to sort lexicographically the given list of words based on the alien dictionary characters.

#### Let's Talk About It

I think the easiest way would be to make a [Schwartzian Transform](/javascript/2018/11/07/schwartzian-transforms-in-javascript.html). Basically, _map_ a sort value into the array, _sort_ on the sort value, then _map_ to remove it. This is pretty much what I did.

The sort value comes from the alien list. `a` becomes `h`, `b` becomes `l`, etc., etc. We can `split`, `map` and `join` to turn `abacab` into `hlhahl`. That's using the alien list from the first example.

An alternate way would be to make a `to_alien` function, or even make a function factory to automate turning `abacab` to `cocrco` or `hlhahl` or whatever.

```perl
my $f = alien_factory( $e->{alien} );
my $translation = $f->('abacab');

sub alien_factory ($alien) {
    my @alpha = 'a' .. 'z';
    my %hash;
    map { $hash{ $alpha[$_] } = $alien->[$_] } 0 .. $#alpha;
    return sub {
        my $w = shift;
        state $done;
        if ( $done->{$w} ) { return $done->{$w} }
        my $n = join '', map { $hash{$_} } split //, $w;
        $done->{$w} = $n;
        return $n;
    }
}
```

This would allow `sort { $f->($a) cmp $f->($b) }` instead of the Schwartzian Transform. I don't do that in the code I'm turning in, but it's a fun option.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

my @examples = (

    {
        words => [ "perl", "python", "raku" ],
        alien => [qw/h l a b y d e f g i r k m n o p q j s t u v w x c z/]
    },
    {
        words => [ "the", "weekly", "challenge" ],
        alien => [qw/c o r l d a b t e f g h i j k m n p q s w u v x y z/]
    },
);

for my $example (@examples) {
    my $words  = join ', ', map { qq{"$_"} } $example->{words}->@*;
    my $alien  = join ' ',  $example->{alien}->@*;
    my @output = alien_dictionary($example);
    my $output = join ', ', @output;
    say <<"END";
Input:  \@words = ($words)
        \@alien = qw/$alien/
Output: $output
END
}

sub alien_dictionary ($object) {
    my @words    = $object->{words}->@*;
    my @alien    = $object->{alien}->@*;
    my @alphabet = 'a' .. 'z';
    my %hash;
    for my $i ( 0 .. $#alphabet ) { $hash{ $alien[$i] } = $alphabet[$i]; }
    my @newwords = map { $_->[1] } sort { $a->[0] cmp $b->[0] } map {
        my $new = join '', map { $hash{$_} } split '', $_;
        [ $new, $_ ]
    } @words;
    return @newwords;
}

sub alien ( $word, $hash ) {
    return join '', map { $hash->{$_} } split '', $word;
}
```

```text
$ ./ch-2.pl
Input:  @words = ("perl", "python", "raku")
        @alien = qw/h l a b y d e f g i r k m n o p q j s t u v w x c z/
Output: raku, python, perl

Input:  @words = ("the", "weekly", "challenge")
        @alien = qw/c o r l d a b t e f g h i j k m n p q s w u v x y z/
Output: challenge, the, weekly
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
