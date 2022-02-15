---
layout: post
title: "Functional Paths: Weekly Challenge #152 Pt. 1"
author: "Dave Jacoby"
date: "2022-02-15 11:59:42 -0500"
categories: ""
---

This is the first part of [Weekly Challenge #152](https://theweeklychallenge.org/blog/perl-weekly-challenge-152/)! I'm splitting this because I[m finding the second task to be a bear. The first one is disconcertingly easy.

I saw nothing too spectacular about [152](https://en.wikipedia.org/wiki/152_(number)). It equals 19 * 8, and is the sum of four consecutive primes (31 + 37 + 41 + 43).

### TASK #1 › Triangle Sum Path

> Submitted by: Mohammad S Anwar  
> You are given a triangle array.
>
> Write a script to find the minimum sum path from top to bottom.

The example given looks iike this:

```text
                1
               5 3
              2 3 4
             7 1 0 2
            6 4 5 2 8

    Minimum Sum Path = 1 + 3 + 2 + 0 + 2 => 8
```

The problem that I had, and Adam Russell mentioned on the Perl Computer Science Discord, is that it seems there's no specific jumps between levels. `1` on the first level can only go to `5` and `3`, but if you're `1, 3`, you seem to be able to go to `2` as well as `3` and `4`, despite the distance.

As we're given a multidimensional array, it seems that you can just find the minimum value from each sub-array, which means this is a quick win for functional programming and [List::Util](https://metacpan.org/pod/List::Util), specifically `sum` and `min`.

Beyond that, we're given the data as code, so the quick-and-easy way to get to it is to `eval` it. I almost _never_ use `eval`. I don't trust the code fed into it. This is toy code, however, so here it's fine. I think there's another, safer way to extract the triangles. [Storable](https://metacpan.org/pod/Storable)?

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use List::Util qw{ min sum };

# This is inspired by a reading of the problem
# from Adam Russell, who notes that there's no
# direct down-left or down-right between 3 on
# the second level and 2 on the third in this
# triangle:
#
#                1
#               5 3
#              2 3 4
#             7 1 0 2
#            6 4 5 2 8
#
# A similar problem occurs with the 0 on the
# fourth row of the second example:
#
#                5
#               2 3
#              4 1 5
#             0 1 2 3
#            7 2 4 1 9
#
# If the problem requires a solution that's less
# using List::Util and more actual tree structures,
# that solution will be forthcoming.

my @examples;
push @examples, '$triangle=[ [1], [5,3], [2,3,4], [7,1,0,2], [6,4,5,2,8] ]';
push @examples, '$triangle=[ [5], [2,3], [4,1,5], [0,1,2,3], [7,2,4,1,9] ]';

for my $e (@examples) {
    my $triangle;
    eval($e); 

    # let's do this the functional way?
    my $path = join ' + ', map { min $_->@* } $triangle->@*;
    my $sum  = sum map { min $_->@* } $triangle->@*;

    my $tree = make_tree($triangle);
    say <<"END";
        Input:  $e
        Output: $sum
        Minimum Sum Path = $path => $sum
$tree
END
}

sub make_tree ( $src ) {
    my $output = '';
    my $n      = 10;
    my $i      = 0;
    while ( $src->[$i] ) {
        my $line = join ' ', $src->[$i]->@*;
        $output .= "\n";
        $output .= ' ' x ( $n - $i );
        $output .= $line;
        $i++;
    }

    return $output;
}
```

```text
$ ./ch-1.pl 
        Input:  $triangle=[ [1], [5,3], [2,3,4], [7,1,0,2], [6,4,5,2,8] ]
        Output: 8
        Minimum Sum Path = 1 + 3 + 2 + 0 + 2 => 8

          1
         5 3
        2 3 4
       7 1 0 2
      6 4 5 2 8

        Input:  $triangle=[ [5], [2,3], [4,1,5], [0,1,2,3], [7,2,4,1,9] ]
        Output: 9
        Minimum Sum Path = 5 + 2 + 1 + 0 + 1 => 9

          5
         2 3
        4 1 5
       0 1 2 3
      7 2 4 1 9

```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
