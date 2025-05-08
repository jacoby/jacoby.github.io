---
layout: post
title: "Lots and Lots of Integers!: Weekly Challenge #320"
author: "Dave Jacoby"
date: "2025-05-08 18:06:51 -0400"
categories: ""
---

Welcome to [**_Weekly Challenge #320!_**](https://theweeklychallenge.org/blog/perl-weekly-challenge-320/) This week's title is inspired by a video my child used to watch, [Lots and Lots of Jets and Planes!](https://www.youtube.com/watch?v=3fMGTHyYPTQ)

### Task 1: Maximum Count

> Submitted by: Mohammad Sajid Anwar
> You are given an array of integers.
>
> Write a script to return the maximum between the number of positive and negative integers. Zero is neither positive nor negative.

#### Let's Talk About It

We get the count of positive and negative integers in a functional way. `grep` allows us to strip out the integers we want, and `scalar` gives us a count, rather than the values. Then I use a ternary operator to determinte whether the count of positive integers are highter than the count of negative integers, and `return` the higher count.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

my @examples = (

    [ -3, -2, -1, 1, 2, 3 ],
    [ -2, -1, 0,  0, 1 ],
    [ 1,  2,  3,  4 ],
);

for my $example (@examples) {
    my $str    = join ', ', $example->@*;
    my $output = max_count( $example->@* );
    say <<"END";
    Input:  \$str = ($str)
    Output: $output
END
}

sub max_count(@ints) {
    my $pos = scalar grep { $_ > 0 } @ints;
    my $neg = scalar grep { $_ < 0 } @ints;
    return $pos > $neg ? $pos : $neg;
}
```

```text
$ ./ch-1.pl
    Input:  $str = (-3, -2, -1, 1, 2, 3)
    Output: 3

    Input:  $str = (-2, -1, 0, 0, 1)
    Output: 2

    Input:  $str = (1, 2, 3, 4)
    Output: 4
```

# Task 2: Sum Difference

> Submitted by: Mohammad Sajid Anwar  
> You are given an array of positive integers.
>
> Write a script to return the absolute difference between digit sum and element sum of the given array.

#### Let's Talk About It

Because [List::Util](https://metacpan.org/pod/List::Util) gives us `sum0`, I use that. (Again, I agree with `sum0`'s behavior, not that it matters for most uses.) I use `map` and `split` to separate integers into separate digits, and then subtraction and `abs` to finish the math.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use List::Util qw{ sum0 };

my @examples = (

    [ 1, 23, 4, 5 ],
    [ 1, 2,  3, 4, 5 ],
    [ 1, 2,  34 ],
);

for my $example (@examples) {
    my $str    = join ', ', $example->@*;
    my $output = sum_diff( $example->@* );
    say <<"END";
    Input:  \$str = ($str)
    Output: $output
END
}

sub sum_diff (@ints) {
    my $digit_sum   = sum0 @ints;
    my $element_sum = sum0 map { split //, $_ } @ints;
    return abs $digit_sum - $element_sum;
}
```

```text
$ ./ch-2.pl
    Input:  $str = (1, 23, 4, 5)
    Output: 18

    Input:  $str = (1, 2, 3, 4, 5)
    Output: 0

    Input:  $str = (1, 2, 34)
    Output: 27

 jacoby  Bishop  ~  win  320  $ 
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
