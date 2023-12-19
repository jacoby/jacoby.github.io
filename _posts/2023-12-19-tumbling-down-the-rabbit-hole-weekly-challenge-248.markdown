---
layout: post
title:  "Tumbling Down The Rabbit Hole: Weekly Challenge #248"
author: "Dave Jacoby"
date:   "2023-12-19 11:45:57 -0500"
categories: ""
---

We're now at [**Weekly Challenge #248!**](https://theweeklychallenge.org/blog/perl-weekly-challenge-248/) **248** is the product of **2<sup>3</sup> (8)** and **31**, and is the area code for Pontiac, Michigan and other Detroit suburbs.

### Task 1: Shortest Distance

> Submitted by: Mohammad S Anwar  
> You are given a string and a character in the given string.  
>
> Write a script to return an array of integers of size same as length of the given string such that:  
>
> ```distance[i] is the distance from index i to the closest occurence of the given character in the given string.```
>
> ```The distance between two indices i and j is abs(i - j).```

#### Let's Talk About This

There are a few keys to this. One is `abs`, for absolute value. Absolutely crucial. Pun intended.

Next is a list of all the indexes of where the character in question appears in the string, which we get by going through a list of all positions ( `0 .. length $str` ) and only getting the values that are correct ( `grep { $char eq substr $string, $_, 1 }` )

(Quick note: I always pronounce the **ch** in `char`, as in *char-broiled*, but I do hear some pronounce it like *car*. I get it, because you don't really get that **ch** much in how most people say *character*, which is of course what `char` is supposed to mean. I'm kinda curious which you use.)

The last bit is to go through each position again, subtracting it from every entry in the list above, taking the absolute value, and taking the minimum value from that. That's a long way of saying `push @output, min map { abs $_ - $i } @input`.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ min };

my @examples = (

    { str => "loveleetcode", char => "e" },
    { str => "aaab",         char => "b" },

);

for my $example (@examples) {
    my @output = shortest_distance($example);
    my $output = join ',', @output;

    say <<~"END";
    Input:  \$str = "$example->{str}", \$char = "$example->{char}"
    Output: ($output)
    END

}

# 1) everybody gets matched
# 2) nobody gets matched to themself
sub shortest_distance ($input) {
    my $str   = $input->{str};
    my $char  = $input->{char};
    my @input = grep { $char eq substr $str, $_, 1 } 0 .. length $str;
    my @output;

    for my $i ( 0 .. -1 + length $str ) {
        my $c = substr $str, $i, 1;
        push @output, min map { abs $_ - $i } @input;
    }

    return @output;
}
```

```text
$ ./ch-1.pl 
Input:  $str = "loveleetcode", $char = "e"
Output: (3,2,1,0,1,0,0,1,2,2,1,0)

Input:  $str = "aaab", $char = "b"
Output: (3,2,1,0)
```

### Task 2: Submatrix Sum

> Submitted by: Jorg Sommrey  
> You are given a NxM matrix A of integers.  
>
> Write a script to construct a (N-1)x(M-1) matrix B having elements that are the sum over the 2x2 submatrices of A,  
>
> `b[i,k] = a[i,k] + a[i,k+1] + a[i+1,k] + a[i+1,k+1]`  

#### Let's Talk About This

Matrices are *fun*, aren't they?

First step for me is to create a function to display the array, so I can see what's happening. in short, `say join "\n", map { join ', ', $_->@* } $matrix->@*`, assuming arrayrefs, but to get output like the examples, it takes a little bit more than that.

Beyond that, we're talking the sum (or `sum` from [List::Util](https://metacpan.org/pod/List::Util)) of four numbers. That's the ones in the current location (`x,y`), in the same column and next row (`x,y+1`), in the same row and next column (`x+1,y`), and in both the next column and row (`x+1,y+1`). Because the last row and column don't have a next, the generated matrix will be smaller by one in each direction.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ max sum };

my @examples = (
    [ [ 1, 2, 3, 4 ], [ 5, 6, 7, 8 ], [ 9, 10, 11, 12 ] ],
    [ [ 1, 0, 0, 0 ], [ 0, 1, 0, 0 ], [ 0, 0,  1,  0 ], [ 0, 0, 0, 1 ] ]
);

for my $e (@examples) {
    my $o      = submatrix_sum($e);
    my $input  = format_matrix($e);
    my $output = format_matrix($o);

    say <<~"END";
    Input:  \$a = $input

    Output: \$b = $output
    END
}

sub submatrix_sum ($m) {
    my @output;
    for my $x ( 0 .. -2 + scalar $m->@* ) {
        for my $y ( 0 .. -2 + scalar $m->[$x]->@* ) {
            my @z;
            push @z, $m->[ $x + 0 ][ $y + 0 ];
            push @z, $m->[ $x + 1 ][ $y + 0 ];
            push @z, $m->[ $x + 0 ][ $y + 1 ];
            push @z, $m->[ $x + 1 ][ $y + 1 ];
            my $z = sum @z;
            $output[$x][$y] = $z;
        }
    }
    return \@output;
}

sub format_matrix ($matrix) {
    my $maxlen = max map { length $_ } map { $_->@* } $matrix->@*;
    my $output = join "\n            ", '[', (
        map { qq{  [$_],} }
        map {
            join ',',
                map { pad( $_, 1 + $maxlen ) }
                $_->@*
        }
        map { $matrix->[$_] } 0 .. -1 + scalar $matrix->@*
        ),
        ']';
    return $output;
}

sub pad ( $str, $len = 4 ) {
    return sprintf "%${len}s", $str;
}
```

```text
$ ./ch-2.pl 
Input:  $a = [
              [  1,  2,  3,  4],
              [  5,  6,  7,  8],
              [  9, 10, 11, 12],
            ]

Output: $b = [
              [ 14, 18, 22],
              [ 30, 34, 38],
            ]

Input:  $a = [
              [ 1, 0, 0, 0],
              [ 0, 1, 0, 0],
              [ 0, 0, 1, 0],
              [ 0, 0, 0, 1],
            ]

Output: $b = [
              [ 2, 1, 0],
              [ 1, 2, 1],
              [ 0, 1, 2],
            ]
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
