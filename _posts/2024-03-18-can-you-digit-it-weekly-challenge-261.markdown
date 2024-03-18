---
layout: post
title: "Can You Digit It?: Weekly Challenge #261"
author: "Dave Jacoby"
date: "2024-03-18 12:02:45 -0400"
categories: ""
---

Welcome to [**Weekly Challenge #261!**](https://theweeklychallenge.org/blog/perl-weekly-challenge-261/#TASK1)

**261** is an [odious number](https://en.wikipedia.org/wiki/Odious_number), which means that the binary expansion (**100000101**) has an odd number of `1`s in it.

### Task 1: Element Digit Sum

> Submitted by: Mohammad Sajid Anwar  
> You are given an array of integers, `@ints`.
>
> Write a script to evaluate the absolute difference between element and digit sum of the given array.

#### Let's Talk About It

We're talking forests and trees here. The forests are the elements, and the trees are the digits that make up the elements.

Take the last example. The elements to sum are `( 236, 416, 336, 350)`, and the digits are `(0, 1, 2, 3, 3, 3, 3, 4, 5, 6, 6, 6)`. `map` and `split` gets us this, `sum0` from [List::Util](https://metacpan.org/pod/List::Util) and I use a numerical `sort` to find the higher and lower values.

A non-List::Util `sum` could look like the following:

```perl
sub my_sum(@array) {
    my $v = 0;
    $v += $_ for @array;
    return $v;
}
```

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ sum0 };

my @examples = (

    [ 1,   2,   3, 45 ],
    [ 1,   12,  3 ],
    [ 1,   2,   3,   4 ],
    [ 236, 416, 336, 350 ],
);

for my $example (@examples) {
    my @ints   = $example->@*;
    my $ints   = join ',', @ints;
    my $output = element_digit_sum(@ints);
    say <<"END";
    Input:  \@ints = ($ints)
    Output: $output
END
}

sub element_digit_sum (@ints) {
    my @digits      = map { split //, $_ } @ints;
    my $element_sum = sum0 @ints;
    my $digit_sum   = sum0 @digits;
    return abs $element_sum - $digit_sum;
}

```

```text
$ ./ch-1.pl
    Input:  @ints = (1,2,3,45)
    Output: 36

    Input:  @ints = (1,12,3)
    Output: 9

    Input:  @ints = (1,2,3,4)
    Output: 0

    Input:  @ints = (236,416,336,350)
    Output: 1296
```

### Task 2: Multiply by Two

> Submitted by: Mohammad Sajid Anwar  
> You are given an array of integers, `@ints` and an integer `$start`.
>
> Write a script to do the followings:
>
> 1. Look for `$start` in the array `@ints`, if found multiply the number by 2
> 1. If not found stop the process otherwise repeat
>
> In the end return the final value.

#### Let's Talk About It

This is a classic case for a `while` loop. While there's a number in the array, double that number. Get to double the highest matching number, return that.

I mean, I could imagine a recursive take on this, but why?

This task's use of [List::Util](https://metacpan.org/pod/List::Util) is `any`, to test if the current value of `$start` is in `@ints`.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ any };

my @examples = (

    { ints => [ 5, 3, 6, 1, 12 ], start => 3 },
    { ints => [ 1, 2, 4, 3 ],     start => 1 },
    { ints => [ 5, 6, 7 ],        start => 2 },
);

for my $example (@examples) {
    my $start  = $example->{start};
    my @ints   = $example->{ints}->@*;
    my $output = multiply_by_two( $start, @ints );
    my $ints   = join ',', @ints;

    say <<"END";
    Input: \@word = ($ints) and \$start = $start
    Output: $output
END
}

sub multiply_by_two ( $start, @ints ) {
    while ( any { $start == $_ } @ints ) {
        $start *= 2;
    }
    return $start;
}
```

```text
$ ./ch-2.pl
    Input: @word = (5,3,6,1,12) and $start = 3
    Output: 24

    Input: @word = (1,2,4,3) and $start = 1
    Output: 8

    Input: @word = (5,6,7) and $start = 2
    Output: 2

```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
