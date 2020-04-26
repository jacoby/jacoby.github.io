---
layout: post
title:  "Knuth's Giant Word List"
author: "Dave Jacoby"
date:   "2020-04-26 14:59:34 -0400"
categories: ""
---

[I read part of this piece on Donald Knuth](https://www.quantamagazine.org/computer-scientist-donald-knuth-cant-stop-telling-stories-20200416/) recently, which starts with a story from his youth.

(I would expect that, if you read this blog, you wouldn't need me to explain who [Donald Knuth](https://en.wikipedia.org/wiki/Donald_Knuth) is.)

There was a candy bar named **Ziegler's Giant Bar**, and there was a challenge to find out how many words can be made by that name. A thirteen-year-old Knuth, armed with index cards and a 2000-page dictionary, took a few weeks, calling in "sick" from school, came up with more than 4,700, more than double those the contest officials had.

That sounds fun, doesn't it?

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings qw{ experimental };

my @letters = sort qw{Z I E G L E R S G I A N T B A R};
my %tried; # this avoids going down paths that have already been trod
my %corpus = get_words();
my @corpus = keys %corpus; # this gives us 234371 words

my @words = find_anagrams( \@letters );
say join "\n", @words;
exit;

# This looks like a job for Recursion!
sub find_anagrams ( $letters, $word = '' ) {
    my @words;

    # there are repeated letters and an A is an A, so this
    # keeps it from repeating them
    return if $tried{$word};
    $tried{$word} = 1;

    # If there's no word that starts with what we have,
    # no hope and skip.
    my $d = scalar grep { /^$word/ } @corpus;
    return unless $d;

    # All the words we have are in a hash, and so, if it's in
    # the hash, it's a word
    if ( $corpus{$word} ) {
        push @words, $word;
    }

    # Here we pull one of the letters, like "r", and send the
    # array of others, like ["e","c","u","r","s","e"], and add
    # "r" to the end of the wordlet, then pass the array and 
    # the words to see what words we can find, then try again
    # with "e", and "c" and ...
    for my $i ( 0 .. -1 + scalar $letters->@* ) {
        my $local->@* = $letters->@*;
        my $next = $word . $local->[$i];
        $local->[$i] = '';
        $local->@* = grep { /\w/ } $local->@*;
        push @words, find_anagrams( $local, $next );
    }
    return @words;
}

# And here we get the words
sub get_words {
    my %output;
    for my $d ( glob('/usr/share/dict/words') ) {
        if ( open my $fh, '<', $d ) {
            for my $l (<$fh>) {
                chomp $l;
                $l =~ s/\s//g;
                $output{ uc $l }++;
            }
        }
    }
    return %output;
}
```

And the word list on that computer is insufficient: starting with **A** and ending with **ZIRIAN**, I have [3108 words](https://jacoby.github.io/files/word_list.txt), a solid 1600 less than Knuth got by hand. Mine went faster, one day rather than two weeks, but clearly, I need better word lists to compete.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)


