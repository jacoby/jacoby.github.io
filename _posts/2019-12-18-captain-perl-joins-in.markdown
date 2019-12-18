---
layout: post
title: "Captain Perl Joins In?"
author: "Dave Jacoby"
date: "2019-12-18 10:16:52 -0500"
categories: ""
---

![The Puzzle](https://jacoby.github.io/images/3d_puzzle.jpg)

[Brie Larson](https://twitter.com/brielarson/) (Marvel's Captain Marvel) [tweeted this image](https://twitter.com/brielarson/status/1206209766558748672) at [Chris Evans](https://twitter.com/ChrisEvans) (Marvel's Captain America). The glamorous lives of superheroes and superstars includes doing NYTimes word puzzles, I suppose.

But hey, I have super-powers of my own: the awesome powers of Recursion and Perl!

## The Rules

As far as I can tell from the crop.

> ... lettered balls in the three-dimensional grid above are ... vertical layers A, R, I / W, E, P / I, V, A in front and N, T ... D in back. Find as many words of _exactly five letters_ as ... following the rods connecting the balls. you may return to ... twice in one word (as the P in PAPER) but you may not ... and use it twice before proceeding. Be sure not to jump between balls that aren't connected directly by a rod. For example, TITLE is an acceptable answer, because no rod connects the T and the I. Plurals are fine. Capitalized words, hyphenated words, prefixes and suffixes and words only appearing as parts of longer phrases are prohibited. How many words can you find? A score of 25 is good; 35 is excellent and 45 is genius. Our solution consists of 50 relatively common words.

Typing this in forced me to rethink, because I'm more used to Boggle-style no-reuse. That got my count up, so that's good.

## The Steps

The first step is to model the 3-D space, but that's something I learned from Dijkstra: all we need are identifiers for a node and a list of the neighbors. I would want to do this with cleverness for non-one-off things,

```perl
push @arr, { id => 0, l => 'a', n => [ 1, 2, 6 ] } ;
push @arr, { id => 1, l => 'n', n => [ 3, 2, 7 ] } ;

push @arr, { id => 2, l => 'r', n => [ 0, 3, 4, 8 ] } ;
push @arr, { id => 3, l => 't', n => [ 1, 2, 5, 9 ] } ;

...
```

Why an array? Because we could start from anywhere, so the main loop looks like:

```perl
for my $i ( 0 .. 17 ) {
    solve( $i, \@arr, [] ) ;
    }
```

## The Full Solution

```perl
#!/usr/bin/env perl

use feature qw{say state} ;
use strict ;
use warnings ;
use utf8 ;

use JSON ;

my $json = JSON->new->canonical ;
my @arr ;

push @arr, { id => 0, l => 'a', n => [ 1, 2, 6 ] } ;
push @arr, { id => 1, l => 'n', n => [ 3, 2, 7 ] } ;

push @arr, { id => 2, l => 'r', n => [ 0, 3, 4, 8 ] } ;
push @arr, { id => 3, l => 't', n => [ 1, 2, 5, 9 ] } ;

push @arr, { id => 4, l => 'i', n => [ 2, 5, 10 ] } ;
push @arr, { id => 5, l => 's', n => [ 3, 4, 11 ] } ;

push @arr, { id => 6, l => 'w', n => [ 0, 7, 8, 12 ] } ;
push @arr, { id => 7, l => 'o', n => [ 1, 6, 9, 13 ] } ;

push @arr, { id => 8, l => 'e', n => [ 2, 6, 10, 14, 9 ] } ;
push @arr, { id => 9, l => 'l', n => [ 3, 7, 11, 15, 8 ] } ;

push @arr, { id => 10, l => 'p', n => [ 4, 8, 16, 11 ] } ;
push @arr, { id => 11, l => 'a', n => [ 5, 9, 17, 10 ] } ;

push @arr, { id => 12, l => 'i', n => [ 13, 6,  15 ] } ;
push @arr, { id => 13, l => 'c', n => [ 12, 14, 7 ] } ;

push @arr, { id => 14, l => 'v', n => [ 8, 12, 16, 15 ] } ;
push @arr, { id => 15, l => 'o', n => [ 9, 13, 17, 14 ] } ;

push @arr, { id => 16, l => 'a', n => [ 17, 10, 14 ] } ;
push @arr, { id => 17, l => 'd', n => [ 16, 11, 15 ] } ;

my $map = <<'end';




end

my $words = words() ;

for my $i ( 0 .. 17 ) {
    solve( $i, \@arr, [] ) ;
    }

sub solve {
    state $c = 1 ;
    state $x;
    my ( $curr, $ref, $list ) = @_ ;

    # when working on a smaller subset for testing, you might
    # go off into undefined territory
    return unless defined $ref->[ $curr ] ;

    # we're going for all five-letter words
    return if scalar @$list > 5 ;

    # span is the path to get to the word: 10,16,10,8,2
    # word is the string that matches a word: paper
    # if a word can be found multiple times, we only display once
    my $span = join ',', @{ $list } ;
    my $word = join '', map { $ref->[ $_ ]{ l } } @{ $list } ;
    say join ' ', $word, $c++, $span
        if length $word == 5
        && $words->{ $word }
        && !$x->{ $word }++ ;

    # maintaining the span, and we should use span instead of
    # next or curr
    my $next ;
    @$next = @$list ;
    push @$next, $curr ;

    # because we can use a letter twice, we have to do this
    # slightly differently. Instead of just checking if
    # the value exists in the hash table, we have to iterate
    # as well
    my %hash = map { $_ => 0 } 0 .. 17 ;
    map { $hash{ $_ }++ } @$next ;
    return if $hash{ $curr } > 2 ;

    for my $i ( @{ $ref->[ $curr ]{ n } } ) {
        solve( $i, $ref, $next ) ;
        }

    }

# pulled forward from previous uses
sub words {
    my $file = '/usr/share/dict/words' ;
    my $words ;
    if ( -f $file && open my $fh, '<', $file ) {
        for my $word ( map { chomp ; lc $_ } <$fh> ) {
            $words->{ $word } = 1 ;
            }
        }
    return $words ;
    }

```

```text
anole 2 0,1,7,9,8
aware 3 0,6,0,2,8
rants 4 2,0,1,3,5
rawer 5 2,0,6,8,2
riper 6 2,4,10,8,2
reran 7 2,8,2,0,1
repel 8 2,8,10,8,9
revel 9 2,8,14,8,9
tripe 10 3,2,4,10,8
istle 11 4,5,3,9,8
straw 12 5,3,2,0,6
strip 13 5,3,2,4,10
strew 14 5,3,2,8,6
strep 15 5,3,2,8,10
sisal 16 5,4,5,11,9
salts 17 5,11,9,3,5
salon 18 5,11,9,7,1
salol 19 5,11,9,7,9
salas 20 5,11,9,11,5
salad 21 5,11,9,11,17
salep 22 5,11,9,8,10
sapir 23 5,11,10,4,2
wants 24 6,0,1,3,5
warts 25 6,0,2,3,5
welts 26 6,8,9,3,5
evert 27 8,14,8,2,3
lower 28 9,7,6,8,2
lasts 29 9,11,5,3,5
lapel 30 9,11,10,8,9
lover 31 9,15,14,8,2
leper 32 9,8,10,8,2
lever 33 9,8,14,8,2
level 34 9,8,14,8,9
piper 35 10,4,10,8,2
peris 36 10,8,2,4,5
pelts 37 10,8,9,3,5
paper 38 10,16,10,8,2
papas 39 10,16,10,11,5
papal 40 10,16,10,11,9
pasts 41 10,11,5,3,5
paler 42 10,11,9,8,2
alert 43 11,9,8,2,3
adapa 44 11,17,16,10,16
cower 45 13,7,6,8,2
colts 46 13,7,9,3,5
colon 47 13,7,9,7,1
colas 48 13,7,9,11,5
viola 49 14,12,15,9,11
volts 50 14,15,9,3,5
overt 51 15,14,8,2,3
ovolo 52 15,14,15,9,7
avert 53 16,14,8,2,3
dadas 54 17,16,17,11,5
dolts 55 17,15,9,3,5
dover 56 17,15,14,8,2
```

So, I got to 56. "Relatively common?" For many, sure. I'm there for `dover`, `volts`, and such, but `adapa`? `antre`? And I see the wordlist I have doesn't include `wonts`.

Anyway, I've coded my way past _Genius_ level and solved the thing. I've proven my worth vs other Captains, so I'll wait here for my Avengers membership card.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
````
