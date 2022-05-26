---
layout: post
title: "0x7e57ab1e 0xc0deba5e: Weekly Challenge #166"
author: "Dave Jacoby"
date: "2022-05-25 13:45:12 -0400"
categories: ""
---

Welcome to [Challenge #166](https://theweeklychallenge.org/blog/perl-weekly-challenge-166/).

Instead of the normal bit of number theory I try to find about the challenge number, I'll go into something personal. My eldest son asked me about logarithms recently, because of something he saw in a video.

As computer people, we think of log n in terms of [Big O Notation](https://en.wikipedia.org/wiki/Big_O_notation#Infinite_asymptotics), where **O(log n)** would refer to algorithms like Binary Search, where you don't have to check everything in the data set. It's about as good as an algorithm can get for most things.

![The graph from Wikipedia's Big O page.](https://upload.wikimedia.org/wikipedia/commons/7/7e/Comparison_computational_complexity.svg)

But that plot is not what they were used for.

_What were they used for, Dave?_

I'm glad you asked me that. They were used because **x<sup>log<sub>x</sub>A + log<sub>x</sub>B</sup> = A \* B**, which turns multiplying large numbers into adding smaller numbers, plus looking up the numbers in a [log table](https://en.wikipedia.org/wiki/Mathematical_table#Tables_of_logarithms).

Of course, we don't have to do that anymore. We've taught rocks to sing, and so we can just multiply large numbers without error, so if we know this, it's something half-remembered from a history of science course.

#### Show Me The Code

```perl
    say '123 * 456';
    say 123 * 456;
    say '';
    say 'log10(123) + log10(456)';
    say log10(123) + log10(456);
    say '';
    say 'log10(56088)';
    say log10(56088);
    say '';
    say '10**( log10(123) + log10(456) )';
    say 10**( log10(123) + log10(456) );
```

```text
123 * 456
56088

log10(123) + log10(456)
4.74886995410383

log10(56088)
4.74886995410383

10**( log10(123) + log10(456) )
56087.9999999999
```

I mean, what's one-ten-billionth between friends?

### Task 1: Hexadecimal Words

Submitted by: Ryan J Thompson

> As an old systems programmer, whenever I needed to come up with a 32-bit number, I would reach for the tired old examples like 0xDeadBeef and 0xC0dedBad. I want more!
>
> Write a program that will read from a dictionary and find 2- to 8-letter words that can be “spelled” in hexadecimal, with the addition of the following letter substitutions:
>
> o ⟶ 0 (e.g., 0xf00d = “food”)  
> l ⟶ 1  
> i ⟶ 1  
> s ⟶ 5  
> t ⟶ 7
>
> You can use your own dictionary or you can simply open ../../../data/dictionary.txt (relative to your script’s location in our GitHub repository) to access the dictionary of common words from Week #161.

The solution, or at least _a_ solution, is hinted at with the additional letter substitutions. Looks like a lookup table, so let's make a hash!

I do the substitution at the same time as I check for disallowed words. I could've only got compliant words by adding checks in `get_words`, but that strikes me as the wrong place to add that functionality.

I did not do the _make phrases_ options, but I did add the _short_ (limit the number of changes) option, and I suppose I could just as easily add a _none_ option, which finds only words made from **a-f**. Exercise for the reader.

Making the phrases seems kinda **O(NlogN)** to me, and just because you make something with eight characters doesn't mean it's witty or useful. This is to say that it's not worth doing, just that I didn't do it.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use Carp;
use List::Compare;
use List::Util qw{ first };
use Getopt::Long;

my $short = 0;
GetOptions( short => \$short );

my @words   = get_words();
my @letters = qw{ a b c d e f o l i s t };
my @banned  = bad_letters(@letters);
my %banned  = map { $_ => 1 } @banned;
my %mapping = (
    i => '1',
    l => '1',
    o => '0',
    s => '5',
    t => '7',
);
map { $mapping{$_} = $_ } 'a' .. 'f';

OUTER: for my $word ( sort { length $a <=> length $b } @words ) {
    my $hax0r;
    my $count;
    for my $l ( split //, $word ) {
        my $m = $mapping{$l};
        $hax0r .= defined $m ? $m : $l;
        if ( $short && defined $m && $m =~ /\d/ ) {
            $count++;
            next OUTER if $count > 1;
        }
        next OUTER if $banned{$l};
    }
    say qq{ +  $word\n\t0x$hax0r };
}

sub get_words {
    my $dictionary = './dictionary.txt';
    if ( -f $dictionary && open my $fh, '<', $dictionary ) {
        my @words =
            grep { length $_ < 9 && length $_ > 1 }
            map { chomp; lc $_ } <$fh>;
        return @words;
    }
    croak 'No dictioary file';
}

sub bad_letters( @letters ) {
    my @alpha  = 'a' .. 'z';
    my $lc     = List::Compare->new( \@letters, \@alpha );
    my @banned = $lc->get_complement();
    return @banned;
}

```

```text
# last five words
all_words.txt
 +  telltale
        0x7e117a1e
 +  testable
        0x7e57ab1e
 +  testicle
        0x7e571c1e
 +  tobaccos
        0x70bacc05
 +  toileted
        0x7011e7ed

# last five words, with --short option
clear_words.txt
 +  deceased
        0xdecea5ed
 +  defeated
        0xdefea7ed
 +  defecate
        0xdefeca7e
 +  defected
        0xdefec7ed
 +  effected
        0xeffec7ed

```

### Task 2: K-Directory Diff

> Submitted by: Ryan J Thompson  
> Given a few (three or more) directories (non-recursively), display a side-by-side difference of files that are missing from at least one of the directories. Do not display files that exist in every directory.
>
> Since the task is non-recursive, if you encounter a subdirectory, append a /, but otherwise treat it the same as a regular file.

_"Since the task is non-recursive..."_

This _doesn't_ look like a job for Recursion!

This solution is very straightforward Perl. No modules. It uses `say` and `signatures` because I love them. It uses file tests, which is about the `bash`iest thing in Perl. I do `($value) = reverse split /regex/ , $string` to easily get the last value, where I might make it a list and address `[-1]` otherwise. The important thing is to find the longest node name (after appending `/` to the dirs) so that you can have consistent column widths. I honestly think the most offputting for new developers is the ternary in the `map`. Maybe the `map` itself?

Honestly, if anyone has questions about my code, my contact details are below.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @dirs = qw{ dir_a dir_b dir_c };
@dirs = sort @ARGV if @ARGV;
my $maxcol = 0;

my %files;
for my $dir (@dirs) {
    $maxcol = length $dir if length $dir > $maxcol;
    next unless -d $dir;
    my @nodes = glob "$dir/*";
    for my $n (@nodes) {
        my ($node) = reverse split m{\/}, $n;
        $node .= '/' if -d $n;
        $files{$node}{$dir} = 1;
        $maxcol = length $node if length $node > $maxcol;
    }
}

say show_row( $maxcol, @dirs );
say show_row( $maxcol, map { '-' x $maxcol } @dirs );
for my $file ( sort keys %files ) {
    say show_row( $maxcol,
        map { defined $files{$file}{$_} ? $file : '' } @dirs );
}

sub show_row ( $maxcol, @row ) {
    return join ' | ', map { pad( $_, $maxcol ) } @row;
}

sub pad ( $word, $maxcol ) {
    my $pad = ' ' x ( $maxcol - length $word );
    return join '', $word, $pad;
}
```

```text
 ./ch-2.pl
dir_a     | dir_b     | dir_c
--------- | --------- | ---------
bar       |           | bar
          | blee      | blee
foo       | foo       |
subdir/   |           | subdir/
          | subdir_2/ |
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
