---
layout: post
title:  "Shuffle Off To Buffalo: Weekly Challenge #226"
author: "Dave Jacoby"
date:   "2023-07-18 12:25:10 -0400"
categories: ""
---

We're on to [Challenge #226](https://theweeklychallenge.org/blog/perl-weekly-challenge-226/). **226** is a semiprime, in that it is *2 x 113*. It is also a [Happy](https://en.wikipedia.org/wiki/Happy_number). I suppose that makes most numbers unhappy?

### Task 1: Shuffle String

> Submitted by: Mohammad S Anwar  
> You are given a string and an array of indices of same length as string.  
>
> Write a script to return the string after re-arranging the indices in the correct order.  

#### Talking It Through

It says *shuffle*, but we don't do any shuffling here. Really, it's kinda unshuffling. We're given a word and a series of positions where those letters should be.

My solution is to create a string of spaces the same length as the input string, then use the fact that `substr` can be an lvalue as well, meaning you can write both `$x = substr $string, 1,1` and  `substr( $string, 1,1) = $x`. `l` is the first character in the $input, with the position of `3`, so `substr( $output,3,1) = substr( $input, 0,1)`. The third value is the length of the substring, of course, and one loop gets us through the whole thing.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @examples = (
    [ 'lacelengh', [ 3, 2, 0, 5, 4, 8, 6, 7, 1 ] ],
    [ 'rulepark',  [ 4, 7, 3, 1, 0, 5, 2, 6 ] ]
);

for my $example (@examples) {
    my $string = $example->[0];
    my $indices = join ',', $example->[1]->@*;
    my $output = reorder_string( $example->[0], $example->[1] );
    say <<~"END";
    Input:  \$string = '$string', \@indices = ($indices)
    Output: '$output'
    END
}

sub reorder_string ( $input, $indices ) {
    my $output = ' ' x length $input;
    my $c = 0;
    for my $i ( $indices->@* ) {
        substr( $output, $i, 1 ) = substr( $input, $c, 1 );
        $c++;
    }
    return $output;
}
```

```text
$ ./ch-1.pl 
Input:  $string = 'lacelengh', @indices = (3,2,0,5,4,8,6,7,1)
Output: 'challenge'

Input:  $string = 'rulepark', @indices = (4,7,3,1,0,5,2,6)
Output: 'perlraku'
```

### Task 2: Zero Array

> Submitted by: Mohammad S Anwar
> You are given an array of non-negative integers, @ints.
>
> Write a script to return the minimum number of operations to make every element equal zero.
>
> In each operation, you are required to pick a positive number less than or equal to the smallest element in the array, then subtract that from each positive element in the array.

#### Talking It Through

You have an array.

* find the smallest non-zero value in the array
* subtract that from every value that isn't zero
* all zeroes stay zeroes
* stop when everything is zeroes

That's simple, and the code within the while loop is fairly simple. I might trade the ternary operator for two maps (`map { $_>0?$_:0} map { $_ -= $min }`) but am happy with my one-map solution.

What annoys me is that I couldn't get my tests to end the while loop all failed, leaving me with `while (1) { ... ; last if $min == 0}`. Testing on `max @ints` should work but didn't, and neither did `sum @ints`.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ sum sum0 min max };

my @examples = ( [ 1, 5, 0, 3, 5 ], [0], [ 2, 1, 4, 0, 3 ], );

for my $e (@examples) {
    my $input  = join ',', $e->@*;
    my $output = zero_array( $e->@* );
    say <<~"END";
    Input:  \@ints = ($input)
    Output: $output
    END
}

sub zero_array( @ints ) {
    my $c = -1;
    while (1) {
        $c++;
        my $min = min grep { $_ > 0 } @ints;
        $min //= 0;
        @ints = map { $_ - $min > 0 ? $_ - $min : 0 } @ints;
        last if $min == 0;
        last if $c > 10;
    }
    return $c;
}
```

```text
$ ./ch-2.pl 
Input:  @ints = (1,5,0,3,5)
Output: 3

Input:  @ints = (0)
Output: 0

Input:  @ints = (2,1,4,0,3)
Output: 4
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
