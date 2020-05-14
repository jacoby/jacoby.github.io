---
layout: post
title:  "Rethinking my Ladder Puzzle Code"
author: "Dave Jacoby"
date:   "2019-05-06 15:29:07 -0400"
categories: ""
---

## [cold](https://en.wikipedia.org/wiki/Cold)

The new [Perl Challenge is out](https://perlweeklychallenge.org/blog/perl-weekly-challenge-007/), with two challenges. The first one is numeric and could probably done as a one-liner, but the second one was familiar.

> A word ladder is a sequence of words [w0, w1, …, wn] such that each word wi in the sequence is obtained by changing a single character in the word wi-1. All words in the ladder must be valid English words.

> Given two input words and a file that contains an ordered word list, implement a routine (e.g., find_shortest_ladder(word1, word2, wordlist)) that finds the shortest ladder between the two input words. For example, for the words cold and warm, the routine might return: `("cold", "cord", "core", "care", "card", "ward", "warm")`

> However, there’s a shortest ladder: (“cold”, “cord”, “card”, “ward”, “warm”).

That challenge has a lot of moving parts. How to tell what are "valid English words"? How do you tell how different two strings are? And how do you work through this problem?

## [cord](https://en.wikipedia.org/wiki/Cord)

Well, I've solved it already, and blogged it where I used to blog.

([Graphs Are Not That Scary](https://varlogrant.blogspot.com/2016/11/graphs-are-not-that-scary.html))

But, because it's a new challenge and a new platform, why not start here?

And actually, I'll start with the differences, by which I refer to knowing there's one letter difference between `worm` and `warm`.

That is referred to as the [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance), and while there is [`Text::Levenshtein`](https://metacpan.org/pod/Text::Levenshtein) in CPAN, I tend to re-implement it myself, which I got from [`perlbrew`](https://metacpan.org/pod/perlbrew), which uses it to look at `perlbrew cleam` and suggest that you really wanted to type `perlbrew clean`. Because perlbrew has to run in places where you have an old Perl and likely don't have permissions to install modules, it cannot assume you have a non-core module like `Text::Levenshtein`.

```perl
# straight copy of Wikipedia's "Levenshtein Distance"
sub editdist {
    my ( $f, $g ) = @_ ;
    my @a = split //, $f ;
    my @b = split //, $g ;

    # There is an extra row and column in the matrix. This is the
    # distance from the empty string to a substring of the target.
    my @d ;
    $d[ $_ ][ 0 ] = $_ for ( 0 .. @a ) ;
    $d[ 0 ][ $_ ] = $_ for ( 0 .. @b ) ;

    for my $i ( 1 .. @a ) {
        for my $j ( 1 .. @b ) {
            $d[ $i ][ $j ] = (
                  $a[ $i - 1 ] eq $b[ $j - 1 ]
                ? $d[ $i - 1 ][ $j - 1 ]
                : 1 + min( $d[ $i - 1 ][ $j ], $d[ $i ][ $j - 1 ], $d[ $i - 1 ][ $j - 1 ] )
                ) ;
            }
        }

    return $d[ @a ][ @b ] ;
    }
```

## [corm](https://en.wikipedia.org/wiki/Corm)

So, we get to the problem of _valid English words_. If we go from `aaaa` to `zzzz`, that's 456976, but the list of words I have listed is **6072**, which is *much* more manageable. I go into detail about how I got that list in a recent post, [Recreating Wordpoop](https://jacoby.github.io/2019/04/15/recreating-wordpoop.html). *I* keep this in a database, so I can just query `SELECT word IN dictionary WHERE word = "misspelling"` to check to see if I'm getting a word right.

However, you cannot query my database, so [here is a list of all the four-letter words I have](https://gist.github.com/jacoby/19a30ff256ef7736a4f53e7ddc2c9474), chosen because the challenge used `cold` and `warm` as examples. (**Warning:** It is a list of four-letter words, and so it contains ... four-letter words.)

## [worm](https://en.wikipedia.org/wiki/Worm)

Problem says _... finds the shortest ladder_, and that, if traditional computer science was part of your education, you likely recall at least hearing the word's **Shortest Path** or [**Dijktra's Algorithm**](https://en.wikipedia.org/wiki/Dijkstra's_algorithm). This means we're diving into Graph Theory.
The thesis of the blog post I'm leaning back on is in the title: _Graphs are not that scary._ We don't use them much, so we don't know how to use them, and that makes us think they're deep magic, when they're not.

In this case, we have a list of words. In graph terminology, those would be our _nodes_ or _vertices_. To make it a graph, we connect every pair of words that are one letter different, and that connection is an edge. For some purposes, a representation akin to a file system where you go up to the parent and down to the child might be useful, but here, all we need are arrays of nodes and arrays of vertices, which in  [`Graph`](https://metacpan.org/pod/Graph).

Given a very truncated list of words -- `cops,cope,copt,core,cork` -- we get edges between `cops`, `cope` and `copt`, with each one connecting to the other two, then one between `cope` and `core`, and a final one between `core` and `cork`. 

![The Graph Drawn Out](https://jacoby.github.io/images/cops_cork.jpg)

That, expanded out to a much larger extent, is what is needed to solve this problem. So we make it. And, if we're going to use it twice, we don't want to make that graph twice. I mean, it's going over the list twice, determining if the distance between the two words is 1, so in Big-O, that's what? _n log n_? If you're going to go back and find the shortest path between `east` and `west` right after, why rebuild the graph again?

This is where I discovered [`Storeable`](https://metacpan.org/pod/Storeable), which allows you to write the data structure, once created. The following code creates a number of word lists and stores them in your home directory. Note that you likely won't be able to create your lists on one system this way and store and use them somewhere else. At least I couldn't do that.

```perl
#!/usr/bin/env perl

use feature qw{say} ;
use strict ;
use warnings ;

use Data::Dumper ;
use Graph ;
use List::Util qw{min} ;
use Storable ;

for my $l ( 3 .. 16 ) {
    create_word_graph($l) ;
    }
exit ;

# -------------------------------------------------------------------
sub create_word_graph {
    my $length = shift ;
    my %dict = get_words($length) ;
    my @dict = sort keys %dict ;
    say scalar @dict ;
    my $g    = Graph->new() ;

    for my $i ( @dict ) {
        for my $j ( @dict ) {
            my $dist = editdist( $i, $j ) ;
            if ( $dist == 1 ) {
                $g->add_edge( $i, $j ) ;
                }
            }
        }
    # this needs to be localized
    store $g , "/home/jacoby/.word_$length.store" ;
    }

# -------------------------------------------------------------------
sub get_words {
    my $length = shift ;
    my %output ;
    # also this. Probably /usr/share/dict/american-english
    # or the like
    for my $d ( glob( '/home/jacoby/bin/Toys/Dict/*' ) ) {
        if ( open my $fh, '<', $d ) {
            for my $l ( <$fh> ) {
                chomp $l ;
                $l =~ s/\s//g ;
                next if length $l != $length ;
                next if $l =~ /\W/ ;
                next if $l =~ /\d/ ;
                $output{ uc $l }++ ;
                }
            }
        }
    return %output ;
    }

# -------------------------------------------------------------------
# straight copy of Wikipedia's "Levenshtein Distance"
sub editdist {
    my ( $f, $g ) = @_ ;
    my @a = split //, $f ;
    my @b = split //, $g ;

    # There is an extra row and column in the matrix. This is the
    # distance from the empty string to a substring of the target.
    my @d ;
    $d[ $_ ][ 0 ] = $_ for ( 0 .. @a ) ;
    $d[ 0 ][ $_ ] = $_ for ( 0 .. @b ) ;

    for my $i ( 1 .. @a ) {
        for my $j ( 1 .. @b ) {
            $d[ $i ][ $j ] = (
                  $a[ $i - 1 ] eq $b[ $j - 1 ]
                ? $d[ $i - 1 ][ $j - 1 ]
                : 1 + min( $d[ $i - 1 ][ $j ], $d[ $i ][ $j - 1 ], $d[ $i - 1 ][ $j - 1 ] )
                ) ;
            }
        }

    return $d[ @a ][ @b ] ;
    }
```

I have since discovered [`Graph::D3`](https://metacpan.org/pod/Graph::D3), which is very similar, but creates graphs usable by [D3](https://d3js.org/), which is probably a better and certainly more portable choice.

## [warm](https://en.wikipedia.org/wiki/Warm)

So, once we have `.word_4.store` generated and available, we go forward with `ladder.pl cold warm`.

```perl
#!/usr/bin/env perl

use feature qw{say} ;
use strict ;
use warnings ;

use Carp ;
use Data::Dumper ;
use Graph ;
use List::Util qw{min} ;
use Storable ;

my ( $first, $second ) = map { s/\W//gmix ; $_ }
    map { uc $_ } @ARGV ;
my $l = length $first ;

my $g = get_word_graph($l) ;
croak 'Words have different lengths' if length $first != length $second ;
croak "'$first' not in graph" unless $g->has_vertex($first);
croak "'$second' not in graph" unless $g->has_vertex($second);

my $r = dijkstra( $g, $first, $second ) ;
my @s = retrieve_solution( $r, $first, $second ) ;

say join ' > ', @s ;
say '' ;

exit ;

# -------------------------------------------------------------------
# context-specific perl implementation of Dijkstra's Algorithm for
# shortest-path
sub dijkstra {
    my ( $graph, $source, $target, ) = @_ ;
    my @q ;
    my %dist ;
    my %prev ;
    for my $v ( $graph->unique_vertices ) {
        $dist{$v} = 1_000_000_000 ;    # per Wikipeia, infinity
        push @q, $v ;
        }
    $dist{$source} = 0 ;
LOOP: while (@q) {
        @q = sort { $dist{$a} <=> $dist{$b} } @q ;
        my $u = shift @q ;

        # say STDERR join "\t", $u, $dist{$u} ;
        last LOOP if $u eq $target ;
        for my $e (
            grep {
                my @a = @$_ ;
                grep {/^${u}$/} @a
            } $graph->unique_edges
            ) {
            my ($v) = grep { $_ ne $u } @$e ;
            my $w   = 1 ;
            my $alt = $dist{$u} + $w ;
            if ( $alt < $dist{$v} ) {
                $dist{$v} = $alt ;
                $prev{$v} = $u ;
                }
            }
        }
    my @nodes = $graph->unique_vertices ;
    my @edges = $graph->unique_edges ;
    return {
        distances => \%dist,
        previous  => \%prev,
        nodes     => \@nodes,
        edges     => \@edges,
        } ;
    }

# -------------------------------------------------------------------
sub retrieve_solution {
    my $r     = shift ;
    my $start = shift ;
    my $end   = shift ;
    my %prev  = %{ $r->{previous} } ;

    my @words ;
    push @words, $end ;
    my $next = $end ;
    while ( $next ne $start ) {
        $next = $prev{$next} ;
        push @words, $next ;
        }
    return wantarray ? @words : \@words ;
    }

# -------------------------------------------------------------------
sub get_word_graph {
    my $length = shift ;
    # this is SLIGHTLY more localized
    my $file   = $ENV{HOME} ."/.word_$length.store" ;
    croak 'File not available' unless -f $file ;
    my $g = retrieve($file) ;
    return $g ;
    }
```

Of course, the desired use would be `find_shortest_ladder.pl cold warm wordlist.txt`, and I don't do that. Because I have a very good word list (combined from many) and it's precompiled, it should be faster than if you passed a big list of words along with it. I guess it's only _warm_ not _hot_ because I only got close.

But, as the subheads show, I agree with _how long_ the shortest path is, just not specifically _what_ it is. It'd be interesting, in this case, pull _all_ the paths between `cold` and `warm` that are five words long, but here we peace-out on the first successful one.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


