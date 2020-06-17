---
layout: post
title: "A Solution and a Half for Perl Weekly Challenge 65"
author: "Dave Jacoby"
date: "2020-06-17 17:37:41 -0400"
categories: ""
---

### TASK #1 › Digits Sum

> Submitted by: Mohammad S Anwar
>
> Reviewed by: Ryan Thompson
>
> You are given two positive numbers `$N` and `$S`.
>
> Write a script to list all positive numbers having exactly `$N` digits where sum of all digits equals to `$S`.

This one is reasonably simple. Given all the **N**-digit decimal numbers, the lowest will be `1` followed by **N - 1** `0`s, and the highest will be **N** `9`s. `$N = 3; @range = 100 .. 999`, for example.

The rest is easy. We want to add up all the digits, so we need to separate all the digits. `split //, $i;` And now we go to perrenial favorite, [List::Util](https://metacpan.org/pod/List::Util) and get `sum`, so, shortened, `if ( $S = sum split // , $i ) { ... }`

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings qw{ experimental };

use Getopt::Long;
use List::Util qw{sum};

my $N = 0;
my $S = 0;

GetOptions(
    'n=i' => \$N,
    's=i' => \$S,
);

$N = $N > 0 ? $N : 2;
$S = $S > 0 ? $S : 4;

my @output = digit_sums( $N, $S );
say join ', ', @output;

sub digit_sums ( $N, $S ) {
    my @output;
    my $start = 1;
    while ( length $start < $N ) { $start .= '0' }
    my $end = '9' x $N;
    for my $i ( $start .. $end ) {
        my $sum = sum split //, $i;
        push @output, $i if $sum == $S;
    }
    return @output;
}

```

### TASK #2 › Palindrome Partition

> Submitted by: Mohammad S Anwar
>
> Reviewed by: Ryan Thompson
>
> You are given a string `$S`. Write a script print all possible partitions that gives Palindrome. Return -1 if none found.
>
> Please make sure, partition should not overlap. For example, for given string “abaab”, the partition “aba” and “baab” would not be valid, since they overlap.

This is the **half** solution. In that I can get the palindromes. That's fairly easy.

```perl
sub palindrome_partition ($S) {
    my @output;
    for my $start ( 0 .. -1 + length $S ) {
        for my $end ( $start + 1 ..length $S ) {
            my $sub = substr( $S, $start, $end - $start );
            if ( length $sub > 1 && $sub eq reverse $sub ) {
                say join ' ', $start, $end, $sub;
            }
        }
    }
    return @output if scalar @output;
    return -1;
}
```

Given Example 1, we get the following.

```text
                aabaab
0 2 aa          ^^
0 5 aabaa       ^^^^^
1 4 aba          ^^^
2 6 baab          ^^^^
3 5 aa             ^^
```

We are told **there are two possible solutions**, but I'm not fully sold. 

```json
{
  'solutions_I_see': [
    [ 'aa', 'baab' ],
    [ 'aa', 'aa' ],
    [ 'aba' ],
    [ 'aabaa' ]
  ] 
}
```

Granted, `aba` is a subset of `aabaa`, and `aa` is a subset of `baab`, so I can accept that, but the clever-and-good way to break apart what I have to the array of arrays desired just will not come to my head. Thus, half a solution.


#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
