---
layout: post
title:  "Member-ship has its Privileges : Weekly Challenge 222"
author: "Dave Jacoby"
date:   "2023-06-19 12:09:17 -0400"
categories: ""
---

It has been a while since I contributed to [the Weekly Challenge](https://theweeklychallenge.org/), much less blogged about it, but I'm back with [#222](https://theweeklychallenge.org/blog/perl-weekly-challenge-222/).

I don't think there's an HTTP error code that high, but it's the telephone country code for Mauritania. It's also [strobogrammatic](https://en.wikipedia.org/wiki/Strobogrammatic_number), which means you can type it into a calculator and flip it upside down and it'll look the same. It's **2 * 3 * 37**, **11011110** in binary, and the sum of its digits in binary is the same as the sum in decimal.

### Task 1: Matching Members

> Submitted by: Mohammad S Anwar  
> You are given a list of positive integers, @ints.  
>
> Write a script to find the total matching members after sorting the list increasing order.

Take an array. Sort it into another array. Iterate through them -- I use an index and a for loop, but cound imagine making iterators for both arrays -- and when the members of both positions are the same, shove it into an output array, so for display, you can go for both the size of the output array (with `scalar`) and display the output data itself.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @examples =
    ( 
        [ 1, 1, 4, 2, 1, 3 ], 
        [ 5, 1, 2, 3, 4 ], 
        [ 1, 2, 3, 4, 5 ], 
    );

for my $example (@examples) {
    my @matches = matching_members( $example->@* );
    my $s = scalar @matches;
    my $e = join ', ', $example->@*;
    say <<~"END";
        Input: \@ints = ($e);
        Output: $s
    END
}

sub matching_members( @ints) {
    my @output;
    my @sorted = sort { $a <=> $b } @ints;
    for my $i ( 0 .. -1 + scalar @ints ) {
        push @output, $ints[$i] if $ints[$i] == $sorted[$i];
    }
    return @output;
}
```

```text
    Input: @ints = (1, 1, 4, 2, 1, 3);
    Output: 3

    Input: @ints = (5, 1, 2, 3, 4);
    Output: 0

    Input: @ints = (1, 2, 3, 4, 5);
    Output: 5
```

### Task 2: Last Member

> Submitted by: Mohammad S Anwar  
> You are given an array of positive integers, @ints.  
>
> Write a script to find the last member if found otherwise return 0. Each turn pick 2 biggest members (x, y) then decide based on the following conditions, continue this until you are left with 1 member or none.

The output should either be **0** (meaning the output is paired) or **1** (meaning the output is not paired). We start with a reverse-sorted list, pop the biggest two, do the work (if they're not equal, do a little math and push the result onto the array), re-sort and go again.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @examples = ( 
    [ 2, 7, 4, 1, 8, 1 ], 
    [1], 
    [ 1, 1 ],
);

for my $example (@examples) {
    my $output = last_member( $example->@* );
    my $e = join ', ', $example->@*;
    say <<~"END";
        Input: \@ints = ($e);
        Output: $output
    END
}

sub last_member( @ints) {
    while ( scalar @ints > 1 ) {
        @ints = reverse sort @ints;
        my $x = shift @ints;
        my $y = shift @ints;
        push @ints, $x - $y if $x != $y;
    }
    return scalar @ints;
}
```

```text
    Input: @ints = (2, 7, 4, 1, 8, 1);
    Output: 1

    Input: @ints = (1);
    Output: 1

    Input: @ints = (1, 1);
    Output: 0
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
