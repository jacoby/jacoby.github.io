---
layout: post
title: "Return of the Son of This Looks Like A Job For Recursion!: Weekly Challenge #288"
author: "Dave Jacoby"
date: "2024-09-25 22:20:53 -0400"
categories: ""
---

I'm Back! It has been a little while since I wrote up a thing. This is for [**_Weekly Challenge #288_**](https://theweeklychallenge.org/blog/perl-weekly-challenge-288/), and I have to admit that, as of right now, I haven't done **Task #1**. It doesn't immediately seem _fun_, y'know?

The other, **Task #2**, seemed much cooler, so here it is:

### Task 2: Contiguous Block

> Submitted by: Peter Campbell Smith  
> You are given a rectangular matrix where all the cells contain either **x** or **o**.
>
> Write a script to determine the size of the largest contiguous block.
>
> > A contiguous block consists of elements containing the same symbol which share an edge (not just a corner) with other elements in the block, and where there is a path between any two of these elements that crosses only those shared edges.

#### Let's Talk About It!

We're talking about finding the largest possible block containing the same symbol. I felt there was no real reason to hard-code **x** and **o** into this, so any ASCII character should work, and making this Unicode-compliant shouldn't be much of a pain, but I was not asked for that.

If it was simply "Count **x**s and **o**s", I could imagine an iterative solution, but we need to find all the contiguous areas, which sounds like depth-first graph traversal, and ...

**_This Looks Like A Job For RECURSION!_**

So, there's the caller function, `contiguous_block`, which starts from every cell in the matrix and uses `max` from our fave module, [List::Util](https://metacpan.org/pod/List::Util) to extract the longest one.

This means that the callee function, `_contiguous_block`, finds the length of every path and returns it. Just as an aside, we're looking for **up**, **down**, **left** and **right**, not diagonals, so instead of loops handling `x` and `y`, I made an array like `[[0,1],[0,-1],[1,0],[-1,0]]` and worked off that.

A general design for recursion is `return handle_end_case() if end_case; handle_all_cases()`, but because it seemed wasteful to see if there's a valid move independent of doing every valid move, I simply loop through the valid moves and `next` past moves that are not valid, either because they're out of bounds, would repeat a cell or involve the wrong symbol. Once we know we're in a valid cell, we make a copy of the "done" list, add the current cell to it, and recurse from there, pushing the results into an array.

As mentioned, we know we're at a closing cell when there's no valid next move, so that results array would be empty, and in that case, we return the size of "done" list.

I'm torn between returning an object that has the whole chain of contiguous cells as well as the count, etc., etc., and returning `max @output` instead of `@output` time, because the low-valued results just don't matter. I _could_ make this cooler, and if this was real code, I would be tempted.

And, as a note, I grabbed `display_matrix` from previous matrix tasks, because it doesn't seem like a wheel that requires reinvention.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use List::Util qw{ min max };

my @examples = (

    [
        [ 'x', 'x', 'x', 'x', 'o' ],
        [ 'x', 'o', 'o', 'o', 'o' ],
        [ 'x', 'o', 'o', 'o', 'o' ],
        [ 'x', 'x', 'x', 'o', 'o' ],
    ],
    [
        [ 'x', 'x', 'x', 'x', 'x' ],
        [ 'x', 'o', 'o', 'o', 'o' ],
        [ 'x', 'x', 'x', 'x', 'o' ],
        [ 'x', 'o', 'o', 'o', 'o' ],
    ],
    [
        [ 'x', 'x', 'x', 'o', 'o' ],
        [ 'o', 'o', 'o', 'x', 'x' ],
        [ 'o', 'x', 'x', 'o', 'o' ],
        [ 'o', 'o', 'o', 'x', 'x' ],
    ]

);

# create a larger random matrix
my $random;
for my $i ( 0 .. 9 ) {
    for my $j ( 0 .. 9 ) {
        $random->[$i][$j] = int rand 2 ? 'x' : 'o';
    }
}
push @examples, $random;

for my $example (@examples) {
    my $input  = display_matrix($example);
    my $output = contiguous_block($example);
    say <<"END";
    Input:  \$matrix = [
          $input
        ]
    Output: $output
END
}

sub contiguous_block ($matrix) {
    my @list;
    for my $x ( 0 .. -1 + scalar $matrix->@* ) {
        for my $y ( 0 .. -1 + scalar $matrix->[$x]->@* ) {
            my $array = [];
            push $array->@*, [ $x, $y ];
            push @list,      _contiguous_block( $matrix, $array );
        }
    }
    return max @list;
}

sub _contiguous_block ( $matrix, $array ) {
    my $maxx   = scalar $matrix->@*;
    my $maxy   = scalar $matrix->[0]->@*;
    my $firstx = $array->[0][0];
    my $firsty = $array->[0][1];
    my $firstv = $matrix->[$firstx][$firsty];
    my @output;
    my ( $x, $y ) = $array->[-1]->@*;
    my @map;
    map { $map[ $_->[0] ][ $_->[1] ] = 1 } $array->@*;

    #  no diagonals, only left right up and down
    my @ij = ( [ 0, 1 ], [ 0, -1 ], [ 1, 0 ], [ -1, 0 ], );
    for my $ij (@ij) {
        my ( $i, $j ) = @$ij;
        my $xx = $i + $x;
        my $yy = $j + $y;

        # keep X in bounds
        next if $xx < 0;
        next if $xx >= $maxx;

        # keep Y in bounds
        next if $yy < 0;
        next if $yy >= $maxy;

        # don't double-count
        next if defined $map[$xx][$yy];

        # make sure we're following the right character
        my $kk = defined $map[$xx][$yy] ? 1 : 0;
        my $vv = $matrix->[$xx][$yy];
        next if $vv ne $firstv;

        my $new_array = [];
        push $new_array->@*, $array->@*;
        push $new_array->@*, [ $xx, $yy ];
        push @output,        _contiguous_block( $matrix, $new_array );
    }

    # if there are functions that returned, meaning this
    # isn't a final position
    if ( scalar @output ) {
        return @output;
    }

    # if there are no returning functions, meaning this
    # IS a final position
    else {
        return scalar @$array;
    }
}

sub display_matrix ($matrix) {
    return join ",\n          ", map {
        join ' ', '[', ( join ', ', map { qq{'$_'} } $_->@* ), ']'
    } $matrix->@*;
}
```

```text
$ ./ch-2.pl
    Input:  $matrix = [
          [ 'x', 'x', 'x', 'x', 'o' ],
          [ 'x', 'o', 'o', 'o', 'o' ],
          [ 'x', 'o', 'o', 'o', 'o' ],
          [ 'x', 'x', 'x', 'o', 'o' ]
        ]
    Output: 11

    Input:  $matrix = [
          [ 'x', 'x', 'x', 'x', 'x' ],
          [ 'x', 'o', 'o', 'o', 'o' ],
          [ 'x', 'x', 'x', 'x', 'o' ],
          [ 'x', 'o', 'o', 'o', 'o' ]
        ]
    Output: 10

    Input:  $matrix = [
          [ 'x', 'x', 'x', 'o', 'o' ],
          [ 'o', 'o', 'o', 'x', 'x' ],
          [ 'o', 'x', 'x', 'o', 'o' ],
          [ 'o', 'o', 'o', 'x', 'x' ]
        ]
    Output: 7

    Input:  $matrix = [
          [ 'o', 'x', 'x', 'x', 'o', 'x', 'o', 'x', 'x', 'x' ],
          [ 'x', 'o', 'x', 'x', 'x', 'x', 'x', 'o', 'o', 'o' ],
          [ 'x', 'x', 'o', 'o', 'x', 'x', 'o', 'o', 'o', 'x' ],
          [ 'x', 'o', 'x', 'x', 'x', 'o', 'o', 'x', 'o', 'o' ],
          [ 'o', 'o', 'o', 'o', 'x', 'o', 'x', 'x', 'x', 'o' ],
          [ 'x', 'x', 'x', 'o', 'o', 'x', 'x', 'x', 'x', 'x' ],
          [ 'x', 'o', 'x', 'o', 'x', 'x', 'o', 'x', 'x', 'x' ],
          [ 'o', 'x', 'o', 'o', 'x', 'x', 'o', 'o', 'x', 'x' ],
          [ 'x', 'x', 'o', 'o', 'x', 'x', 'x', 'o', 'o', 'o' ],
          [ 'x', 'o', 'x', 'x', 'o', 'x', 'o', 'o', 'x', 'o' ]
        ]
    Output: 19
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
