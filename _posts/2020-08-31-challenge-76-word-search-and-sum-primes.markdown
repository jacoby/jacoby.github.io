---
layout: post
title: "Challenge 76: Word Search and Sum Primes"
author: "Dave Jacoby"
date: "2020-08-31 13:58:13 -0400"
categories: ""
---

Another week, another [Perl Weekly Challenge](https://perlweeklychallenge.org/blog/perl-weekly-challenge-076/), and I had fun with this one.

### TASK #1 › Prime Sum

> Submitted by: Mohammad S Anwar  
> Reviewed by: Ryan Thompson
>
> You are given a number $N. Write a script to find the minimum number of prime numbers required, whose summation gives you $N.
>
> For the sake of this task, please assume 1 is not a prime number.

Given the example problem, **N == 9**, you can do it several ways — `[2,7]`, `[2,2,5]`, `[3,3,3]`, `[2,2,2,3]` — and you _could_ get every one and sort by length later, or, you can use the largest primes first and exit when done.

We of course need primes, and I grabbed my own `is_prime` from [Challenge #12](https://perlweeklychallenge.org/blog/perl-weekly-challenge-012/). `is_prime`, range and `grep` give us a list of primes from 2 (as indicated) to `$n`.

```perl
my @primes = reverse grep { is_prime($_) } 2 .. $n;

sub is_prime ( $n ) {
    my @factors = factor($n);
    return scalar @factors == 1 ? 1 : 0;
}

sub factor ( $n ) {
    my @factors;
    for my $i ( 1 .. $n - 1 ) {
        push @factors, $i if $n % $i == 0;
    }
    return @factors;
}
```

There is a common line I use:

> **_This Looks Like A Job For RECURSION!_**

And I tried it first. Theres a problem. If we want to get a list of all primes that add up to `10`, and start with lowest primes, going with recursion would give us `[2,2,2,2,2]` before it would give us `[7,3]`, and if we reverse and take the largest primes first, we might _think_ that we'd get to `[7,3]` first, but we can't prove it, so we must get _everything_ and then sort it, and that's not fast.

So, honestly, this looks like a job for Iteration.

I often forget Iteration, preferring the smaller code blocks (if you don't mess it up) with Recursion, _but_, if you don't be careful, Recursion can mess you up and take up all your memory. A pure recursive implementation of Fibonacci will take up all available computing resources if you go above ... is it `fib(32)`? Meanwhile, you can keep on chugging with an iterative implementation.

We use a `while` loop, and this is about the only kind of code I use while. Specifically, we start with `push @array, []` and then go to `while ( @array ) {...}`. do a `for` loop on the possible primes, copy the array, add the prime to it, and then sum for testing. If **sum < N**, we append a ref to the new array to `@array` and go to next. If **sum == N**, we add it to the output array and `last` out of the `while` loop.

#### The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use List::Util qw{ sum sum0 max };
use Getopt::Long;

my $n = 9;
GetOptions( 'n=i' => \$n, );

use JSON;
my $json = JSON->new->space_after->canonical;

my @primes = reverse grep { is_prime($_) } 2 .. $n;
my @output = prime_sum( $n, \@primes );

map { say $json->encode($_) } @output;
say '';
say $json->encode( $output[0] );

sub prime_sum ( $n, $primes, $list = [], $depth = 1 ) {
    my @output;
    my %join;

    my @list = ( [] );

OUTER: while (@list) {
        my $e = shift @list;
        for my $p ( $primes->@* ) {
            my $new->@* = reverse sort $e->@*, $p;
            my $sum = sum $new->@*;
            my $join = join ' ', $new->@*;
            next if $join{$join}++;
            push @list,   $new if $sum < $n;
            push @output, $new if $sum == $n;
            last OUTER if $sum == $n;
        }
    }
    return @output;
}

sub is_prime ( $n ) {
    my @factors = factor($n);
    return scalar @factors == 1 ? 1 : 0;
}

sub factor ( $n ) {
    my @factors;
    for my $i ( 1 .. $n - 1 ) {
        push @factors, $i if $n % $i == 0;
    }
    return @factors;
}
```

### TASK #2 › Word Search

> Submitted by: Neil Bowers
> Reviewed by: Ryan Thompson
>
> Write a script that takes two file names. The first file would contain word search grid as shown below. The second file contains list of words, one word per line. You could even use local dictionary file.
>
> Print out a list of all words seen on the grid, looking both orthogonally and diagonally, backwards as well as forwards.

This takes me back. Years ago, I heard a puzzle on NPR where you were to take the string **PRECHRISTMASSALE**, map it to a 4x4 grid like —

```text
P R E C
H R I S
T M A S
S A L E
```

— and snake through it and find the longest word, which, as it turns out, is _matrices_ and a few others of the same length. The game is **Boggle**, a game I never played, but because the only rules are next or diagonal and no reusing a square, we have to keep the list of squares as we go along. Here, We're just going in straight lines, so we just have to handle four cases — horizontal, vertical, diagonal (/) and diagonal (\\) — we iterate through all possible starting points, only looking forward but checking the reverse of the string.

For example, consider just the first line of the example word search:

> B I D E M I A T S U C C O R S T

Starting at position 0, we get [_BIDE_](https://www.dictionary.com/browse/bide) in four letters:

> **B I D E** M I A T S U C C O R S T

If we start at position 4, we get _MIA_, which is a name but not a word, but if we reverse it, we get [_AIM_](https://www.dictionary.com/browse/aim).

> B I D E **M I A** T S U C C O R S T

I suppose I could've made this point with _DIB_ and _BID_, the first three letters, but eh. This, _again_, looks like a job for Recursion! I may need a t-shirt.

I used the standard word list on my Ubuntu WSL, `/usr/share/dict/words`, but you can clearly use whatever word list you choose, and I do checking with a hash, because it's just simple. If I was doing it over, I might have a `is_word()` function rather than passing around a hashref all over, but eh, I'm done.

```text
There were 541 unique words in this word search
	AB
	AC
	ACE
	ACRE
	ACT
	AD
	ADA
	AG
	AH
	AI
	AID
	AIM
	AIMED
...
	WIG
	WIGGED
	WO
	WU
	XI
	XU
	YA
	YAH
	YE
	YO
	YOD
	YON
	YUP
	ZING
	ZR
	ZS
```

#### The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use Getopt::Long;
use List::Util qw{ first };

my $word_grid  = 'word_grid.txt';
my $dictionary = '/usr/share/dict/words';
my $output     = {};

GetOptions(
    'dictionary=s' => \$dictionary,
    'wordsearch=s' => \$word_grid,
);

my $words       = get_words($dictionary);
my $word_search = get_word_search($word_grid);

do_word_search( $word_search, $words );

my $wc = scalar keys $output->%*;
say join "\n\t", "There were $wc unique words in this word search",
    sort keys $output->%*;

sub do_word_search ( $graph, $dictionary ) {
    my $xp = scalar $graph->@* - 1;
    my $yp = scalar $graph->[0]->@* - 1;

    for my $x ( 0 .. $xp ) {
        for my $y ( 0 .. $yp ) {
            my $l = $graph->[$x][$y];
            find_word_vertical( $x + 1, $y, [$l], $graph, $dictionary );
            find_word_horizontal( $x, $y + 1, [$l], $graph, $dictionary );
            find_word_diagonal( $x + 1, $y + 1, [$l], $graph, $dictionary );
            find_word_diagonal2( $x + 1, $y - 1, [$l], $graph, $dictionary );
        }
    }
}

sub find_word_vertical ( $x, $y, $strp, $graph, $dictionary ) {
    my $l = $graph->[$x][$y];
    return unless defined $l;
    push $strp->@*, $l;
    my $w1 = join '', $strp->@*;
    my $w2 = join '', reverse $strp->@*;
    $output->{$w1}++ if $dictionary->{$w1};
    $output->{$w2}++ if $dictionary->{$w2};
    find_word_vertical( $x + 1, $y, $strp, $graph, $dictionary );
}

sub find_word_horizontal ( $x, $y, $strp, $graph, $dictionary ) {
    my $l = $graph->[$x][$y];
    return unless defined $l;
    push $strp->@*, $l;
    my $w1 = join '', $strp->@*;
    my $w2 = join '', reverse $strp->@*;
    $output->{$w1}++ if $dictionary->{$w1};
    $output->{$w2}++ if $dictionary->{$w2};
    find_word_horizontal( $x, $y + 1, $strp, $graph, $dictionary );
}

sub find_word_diagonal ( $x, $y, $strp, $graph, $dictionary ) {
    my $l = $graph->[$x][$y];
    return unless defined $l;
    push $strp->@*, $l;
    my $w1 = join '', $strp->@*;
    my $w2 = join '', reverse $strp->@*;
    $output->{$w1}++ if $dictionary->{$w1};
    $output->{$w2}++ if $dictionary->{$w2};
    find_word_diagonal( $x + 1, $y + 1, $strp, $graph, $dictionary );
}

sub find_word_diagonal2 ( $x, $y, $strp, $graph, $dictionary ) {
    my $l = $graph->[$x][$y];
    return unless defined $l;
    push $strp->@*, $l;
    my $w1 = join '', $strp->@*;
    my $w2 = join '', reverse $strp->@*;
    $output->{$w1}++ if $dictionary->{$w1};
    $output->{$w2}++ if $dictionary->{$w2};
    find_word_diagonal( $x + 1, $y - 1, $strp, $graph, $dictionary );
}

sub get_word_search( $file ) {
    my $ws = [];
    if ( -f $file && open my $fh, '<', $file ) {
        while ( my $line = <$fh> ) {
            my @line = map { uc $_ } split /\W/, $line;
            push $ws->@*, [@line];
        }
    }
    return wantarray ? $ws->@* : $ws;
}

sub get_words ($file) {
    my %words;
    if ( -f $file && open my $fh, '<', $file ) {
        while ( my $word = <$fh> ) {
            chomp $word;
            $word = uc $word;
            next if $word =~ /\W/;
            $words{$word} = 1;
        }
    }
    return wantarray ? %words : \%words;
}
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
