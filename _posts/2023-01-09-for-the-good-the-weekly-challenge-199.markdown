---
layout: post
title: "For The Good: The Weekly Challenge 199"
author: "Dave Jacoby"
date: "2023-01-09 10:37:29 -0500"
categories: ""
---

Welcome to my answers to [The Weekly Challenge #199](https://theweeklychallenge.org/blog/perl-weekly-challenge-199/). [
It is a prime number and the fourth part of a prime quadruplet: 191, 193, 197, 199.](https://en.wikipedia.org/wiki/199_(number))

It also reminds me of Y2K Perl story. Perl timestamps show the year in terms of 1900, so it was common to code things like `$year = '19' . $y`. In 1999, this worked. In Y2K, `$y` would be `100`, and that would be `19100`. This was a common enough problem that the year's Yet Another Perl Conference was called [YAPC 19100](https://yapc.org/America/previous-years/19100/).

### Task 1: Good Pairs

> Submitted by: Mohammad S Anwar  
> You are given a list of integers, @list.
>
> Write a script to find the total count of Good Pairs.
>
> > A pair (i, j) is called good if list[i] == list[j] and i < j.

This is _not_ a job for Recursion!

I mean, you could probably make it so. You can do many things recursively. But this, to me, seems very much the perfect case for iteration. You want to check every two possible list positions to see if the values held are equal, so you have to check every possibility.

In the examples, we're shown the work. _These_ are the four cases where it comes out. But we're asked to find the total count, so we don't make a list of good pairs positions, just iterate and return the count.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ fc say postderef signatures state };

my @examples = (

    [ 1, 2, 3, 1, 1, 3 ],
    [ 1, 2, 3 ],
    [ 1, 1, 1, 1 ],

);

for my $e (@examples) {
    my @list = $e->@*;
    my $out  = good_pairs(@list);
    my $list = join ',', @list;
    say <<"END";
    Input:  \@list = ($list)
    Output: $out
END
}

sub good_pairs ( @list ) {
    my $out = 0;
    my $max = -1 + scalar @list;
    for my $i ( 0 .. $max ) {
        for my $j ( $i + 1 .. $max ) {
            $out++ if $list[$i] == $list[$j];
        }
    }
    return $out;
}
```

```text
  jacoby  Bishop  ~  win  199  $  ./ch-1.pl
    Input:  @list = (1,2,3,1,1,3)
    Output: 4

    Input:  @list = (1,2,3)
    Output: 0

    Input:  @list = (1,1,1,1)
    Output: 6

```

### Task 2: Good Triplets

> Submitted by: Mohammad S Anwar  
> You are given an array of integers, @array and three integers $x,$y,$z.
>
> Write a script to find out total Good Triplets in the given array.
>
> A triplet array[i], array[j], array[k] is good if it satisfies the following conditions:
>
> > a) 0 <= i < j < k <= n (size of given array)  
> > b) abs(array[i] - array[j]) <= x  
> > c) abs(array[j] - array[k]) <= y  
> > d) abs(array[i] - array[k]) <= z

Condition a definitely puts this in the iterative world again, but this time with another nested loop. Like with good pairs, you do the tests for every triplet.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };
use Algorithm::Permute;

my @examples = (

    [ 7, 2, 3, 3, 0, 1, 1, 9, 7 ],
    [ 0, 0, 1, 1, 1, 2, 2, 3 ],

);

for my $e (@examples) {
    my $out  = good_triplets( $e->@* );
    my ( $x, $y, $z, @array ) = $e->@*;
    my $list = join ',', @array;
    say <<"END";
    Input:  \@array = ($list) and \$x = $x, \$y = $y, \$z = $z
    Output: $out
END
}

sub good_triplets ( $x, $y, $z, @array ) {
    my $out = 0;
    my $max = -1 + scalar @array;
    for my $i ( 0 .. $max ) {
        for my $j ( $i + 1 .. $max ) {
            for my $k ( $j + 1 .. $max ) {
                my $ij = abs( $array[$i] - $array[$j] );
                my $jk = abs( $array[$j] - $array[$k] );
                my $ik = abs( $array[$i] - $array[$k] );
                next unless $ij <= $x;
                next unless $jk <= $y;
                next unless $ik <= $z;
                $out ++;
            }
        }
    }
    return $out;
}
```

```text
  jacoby  Bishop  ~  win  199  $  ./ch-2.pl
    Input:  @array = (3,0,1,1,9,7) and $x = 7, $y = 2, $z = 3
    Output: 4

    Input:  @array = (1,1,2,2,3) and $x = 0, $y = 0, $z = 1
    Output: 0

```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
