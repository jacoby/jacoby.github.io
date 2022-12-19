---
layout: post
title: "Insert Clever Title Here: Weekly Challenge #196"
author: "Dave Jacoby"
date: "2022-12-19 11:43:12 -0500"
categories: ""
---

[Welcome to Challenge #196!](https://theweeklychallenge.org/blog/perl-weekly-challenge-196/) I haven't been blogging my additions a lot recently. I have been thinking aboout and writing other things.

**196** is **14<sup>2</sup>**.

### Task 1: Pattern 132

> Submitted by: Mohammad S Anwar  
> You are given a list of integers, @list.
>
> Write a script to find out subsequence that respect Pattern 132. Return empty array if none found.
>
> > Pattern 132 in a sequence (a[i], a[j], a[k]) such that i < j < k and a[i] < a[k] < a[j].

At first I was going to assign `$j = $i+1` and `$k = $j+1`, but it did strike me that this wasn't the assignment. It would handle the example cases, I believe, but that isn't the assignment.

I think, strictly speaking, I didn't need to assign `$ai`, `$aj` and `$ak`, but that makes things a little more readable. All in all, I think this as straightforward as you can get with nested for loops.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ fc say postderef signatures state };

my @examples =
    ( [ 3, 1, 4, 2 ], [ 1, 2, 3, 4 ], [ 1, 3, 2, 4, 6, 5 ], [ 1, 3, 4, 2 ], );

for my $ex (@examples) {
    my @e = $ex->@*;
    my $e = join ', ', @e;
    my @o = pattern_finder(@e);
    my $o = join ', ', @o;
    say <<"END";
    Input:  \@list = ($e)
    Output: ($o)
END
}

sub pattern_finder ( @array ) {
    for my $i ( 0 .. -3 + scalar @array ) {
        for my $j ( $i + 1 .. -2 + scalar @array ) {
            for my $k ( $j + 1 .. -1 + scalar @array ) {
                my $ai = $array[$i];
                my $aj = $array[$j];
                my $ak = $array[$k];
                if ( $ai < $ak && $ak < $aj ) {
                    return ( $ai, $aj, $ak );
                }
            }
        }
    }
    return ();
}
```

```text
$ ./ch-1.pl
    Input:  @list = (3, 1, 4, 2)
    Output: (1, 4, 2)

    Input:  @list = (1, 2, 3, 4)
    Output: ()

    Input:  @list = (1, 3, 2, 4, 6, 5)
    Output: (1, 3, 2)

    Input:  @list = (1, 3, 4, 2)
    Output: (1, 3, 2)
```

### Task 2: Range List

> Submitted by: Mohammad S Anwar  
> You are given a sorted unique integer array, @array.
>
> Write a script to find all possible Number Range i.e [x, y] represent range all integers from x and y (both inclusive).
>
> Each subsequence of two or more contiguous integers

I'm not 100% happy with this code. I needed to pull out `uniq` (always a fan favorite) and do `return map { [ split /,/, $_ ] } uniq map { join ',', $_->@* } @output` to de-duplicate the output, and I'm not sure why I have duplicates in the first place. It was cluttered and I rewrote the inner loop, and I'm happy that I'm getting the right output, but I like to think that if this was for-pay code, I'd do it better.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ uniq };

my @examples =
    ( [ 1, 3, 4, 5, 7 ], [ 1, 2, 3, 6, 7, 9 ], [ 0, 1, 2, 4, 5, 6, 8, 9 ], );

for my $e (@examples) {
    my @array  = $e->@*;
    my @output = range_list(@array);
    my $array  = join ', ', @array;
    my $output = join ', ',
        map { qq{[$_]} } map { join ', ', $_->@* } @output;
    say <<"END";
    Input: \@array = ($array)
    Output: $output
END
}

sub range_list ( @array ) {
    my @output;
    my $k = 0;
OUTER: for my $i ( 0 .. -1 + scalar @array ) {
        next if $i < $k;
        my @block = ( $array[$i], -1 );
        for my $j ( $i + 1 .. -1 + scalar @array ) {
            if ( $array[ $j - 1 ] + 1 == $array[$j] ) {
                $block[1] = $array[$j];
            }
            else {
                $k = $j;
                next OUTER;
            }
            push @output, \@block;
        }
    }
    return map { [ split /,/, $_ ] } uniq map { join ',', $_->@* } @output;
}
```

```text
$ ./ch-2.pl 
    Input: @array = (1, 3, 4, 5, 7)
    Output: [3, 5]

    Input: @array = (1, 2, 3, 6, 7, 9)
    Output: [1, 3], [6, 7]

    Input: @array = (0, 1, 2, 4, 5, 6, 8, 9)
    Output: [0, 2], [4, 6], [8, 9]
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
