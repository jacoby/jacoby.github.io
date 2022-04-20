---
layout: post
title: "The Lazy Dog Had It Coming: Weekly Challege #161"
author: "Dave Jacoby"
date: "2022-04-18 16:52:29 -0400"
categories: ""
---

And now we're at [Weekly Challenge #161](https://theweeklychallenge.org/blog/perl-weekly-challenge-161/). [161](<https://en.wikipedia.org/wiki/161_(number)>) is the sum of five consecutive prime numbers: **23**, **29**, **31**, **37** and **41**. Silly me, I thought it was prime, but it's the product of **7** and **23**, so not prime. Because 7 and 23 are [Gaussian primes](https://en.wikipedia.org/wiki/Gaussian_integer#Gaussian_primes), it is a [Blum integer](https://en.wikipedia.org/wiki/Blum_integer).

I started writing this blog on Monday, but because I'm hung on extras for Task 2, I've held off until Wednesday to publish. Shame on me.

### Task 1: Abecedarian Words

> Submitted by: Ryan J Thompson  
> An **abecedarian word** is a word whose letters are arranged in alphabetical order. For example, “knotty” is an abecedarian word, but “knots” is not. Output or return a list of all abecedarian words in the dictionary, sorted in decreasing order of length.
>
> Optionally, using only abecedarian words, leave a short comment in your code to make your reviewer smile.

This is a fairly easy transform. `my $dorw = join '' , sort //, $word`. So, the test is if `$dorw eq $word`. As I'm unsure that the dictionary is caseless, I actually sort specifying the letters cast to lowercase, but

As for _decreasing word length_, that's simply `sort { length $b <=> length $a }`, so it's that easy.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

# Accept chintz effort

my @dict = get_dict();
say join "\n", sort { length $b <=> length $a }
    grep { is_abecedarian($_) } @dict;

sub is_abecedarian ( $word ) {
    my $dorw = join '', sort { lc $a cmp lc $b } split //, $word;
    return $dorw eq $word ? 1 : 0;
}

sub get_dict() {
    if ( open my $fh, '<', 'dictionary.txt' ) {
        my @output;
        while ( my $word = <$fh> ) {
            chomp $word;
            push @output, $word;
        }
        return @output;
    }
    exit;
}
```

```text
abhors
accent
accept
access
accost
almost
begins
bellow
billow
cellos
...
(list cut for length)
...
mu
my
no
or
ox
qt
xx
a
m
x
```

### Task 2: Pangrams

> Submitted by: Ryan J Thompson  
> A pangram is a sentence or phrase that uses every letter in the English alphabet at least once. For example, perhaps the most well known pangram is:
>
> > `the quick brown fox jumps over the lazy dog`
>
> Using the provided dictionary, so that you don’t need to include individual copy, generate at least **one pangram**.
>
> Your pangram does not have to be a syntactically valid English sentence (doing so would require far more work, and a dictionary of nouns, verbs, adjectives, adverbs, and conjunctions). Also note that repeated letters, and even repeated words, are permitted.

**A** pangram is reasonably easy. Throw words at a string until every letter is included. English is weird, so you're not going to generate anything understandable. And, in fact, unless you throw some randomization into the mix, you are only going to generate one answer.

```text
$ time ./ch-2.pl
a m x ad ah an as at be by cc do go hi if iv mu or pa qt we ail ark fez jab

real    0m0.554s
user    0m0.344s
sys     0m0.063s
$ time ./ch-2.pl
a m x ad ah an as at be by cc do go hi if iv mu or pa qt we ail ark fez jab

real    0m0.540s
user    0m0.172s
sys     0m0.000s
```

It's when I started looking in to making things _interesting_ that you start getting into hits.

> BONUS: Constrain or optimize for something interesting (completely up to you), such as:
>
> - Shortest possible pangram (difficult)
> - Pangram which contains only abecedarian words (see challenge 1)
> - Pangram such that each word "solves" exactly one new letter. For example, such a pangram might begin with (newly solved letters in bold): **a ah hi hid die ice tea** ...
> - What is the longest possible pangram generated with this method? (All solutions will contain 26 words, so focus on the letter count.)
> - Pangrams that have the weirdest (PG-13) Google image search results
> - Anything interesting goes!

If you use the abecedarian filter first thing, you will only get abecedarian words, so that's easy.

But if you start sorting based on however many letters you need and don't have, things start dragging. Maybe it's [List::Compare](https://metacpan.org/pod/List::Compare), which I generally love, but...

```bash
$ time ./ch-2.pl
a cc ii m x ad ah all an as at be bob by dud egg eke err eve ewe fee pa qt zoo ajar

real    26m21.393s
user    11m46.766s
sys     0m2.453s
```

To turn in _something_, I'll include all the abandoned searches and changes to add the weirdness. Maybe short-word-preferring abecedarian? Yeah, that sounds good.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Compare;
use List::Util qw{ uniq };

my @dict = get_dict();

# maybe flag to enable this filter?
@dict = grep { is_abecedarian($_) } @dict;

sub is_abecedarian ( $word ) {
    my $dorw = join '', sort { lc $a cmp lc $b } split //, $word;
    return $dorw eq $word ? 1 : 0;
}

my $pangram = get_pangram( \@dict );
say $pangram;

sub get_pangram ( $wordlist, $gram = '' ) {
    $gram =~ s/^\s//mix;
    my $test = join '', ' ', 'a' .. 'z';
    my %letters;
    for my $l ( split //, lc $gram ) { $letters{$l} = 1; }
    my $sheet = join '', sort keys %letters;
    return $gram if $test eq join '', sort keys %letters;

    my @gram = split //, $gram;

    ## wrecker yard of abandoned sorts
    # for my $next ( sort { rand 1 <=> rand 1 } $wordlist->@* ) {
    # for my $next ( sort { length $a <=> length $b } $wordlist->@* ) {
    # sort { ronly_size( $gram, $a ) <=> ronly_size( $gram, $b ) }
    # sort { lonly_size( $gram, $b ) <=> lonly_size( $gram, $a ) }
    # sort { length $a <=> length $b }
    # sort {
    #     ronly_minus_lonly( $gram, $a ) <=> ronly_minus_lonly( $gram, $b )
    # }
    # sort { rand 1 <=> rand 1 }

    # prefering short words to long
    for my $next ( sort { length $a <=> length $b } $wordlist->@* ) {

    # for my $next (
    #     sort {
    #         ronly_minus_lonly( $gram, $a ) <=> ronly_minus_lonly( $gram, $b )
    #     } $wordlist->@*
    #     )
    # {
        my @next = split //, $next;
        my $lc   = List::Compare->new( \@gram, \@next );
        my @comp = $lc->get_Ronly; 
        if ( scalar @comp ) {
            return get_pangram( $wordlist, join ' ', $gram, $next );
        }
    }

    # Sir, the impossible scenario we never planned for?
    # Well, we better come up with a plan.
    return 'SHOULD NEVER RETURN';
}

# functions for size of left_only, size of right_only, and a 
# difference that should prioritize new words

sub ronly_minus_lonly ( $w1, $w2 ) {
    my $lonly = lonly_size( $w1, $w2 );
    my $ronly = ronly_size( $w1, $w2 );
    return $ronly - $lonly;
}

sub lonly_size ( $w1, $w2 ) {
    my @w1 = uniq sort split //, lc $w1;
    my @w2 = uniq sort split //, lc $w2;
    my $lc = List::Compare->new( \@w1, \@w2 );
    return scalar $lc->get_Lonly;
}

# in usage, w1 is the attempted pangram and w2 is the word
# being considered. List::Compare takes two lists (duh)
# and gives many tools to compare them. Ronly is right-only,
# so, given arrays of letters, this returns the count of letters
# that only exist in the right one, so we would prefer to add 
# words with a high Ronly count.
sub ronly_size ( $w1, $w2 ) {
    my @w1 = uniq sort split //, lc $w1;
    my @w2 = uniq sort split //, lc $w2;
    my $lc = List::Compare->new( \@w1, \@w2 );
    return scalar $lc->get_Ronly;
}

sub get_dict() {
    if ( open my $fh, '<', 'dictionary.txt' ) {
        my @output;
        while ( my $word = <$fh> ) {
            chomp $word;
            push @output, $word;
        }
        return @output;
    }
    exit;
}
```

```text
$ time ./ch-2.pl 
a m x ad ah an as at be by cc do go hi iv mu or qt ail amp bow fin jot buzz knot

real    0m0.330s
user    0m0.031s
sys     0m0.047s
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
