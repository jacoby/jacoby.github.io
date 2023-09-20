---
layout: post
title:  "There Goes My Zero: Weekly Challenge #235"
author: "Dave Jacoby"
date:   "2023-09-20 09:55:06 -0400"
categories: ""
---

Welcome to [Weekly Challenge #235!](https://theweeklychallenge.org/blog/perl-weekly-challenge-235/) It factors to **5** and **47**, which are both primes, and that makes it a *semiprime*, which is something I didn't know about until today.

### Task 1: Remove One

> Submitted by: Mohammad S Anwar
> You are given an array of integers.
>
> Write a script to find out if removing ONLY one integer makes it strictly increasing order.

#### Let's talk about it

There are three cases to consider.

* **is already in increasing order** - in this case, removing any one integer would also keep it in order
* **it would take two in the best case** - we can know this because we've done the work of making smaller arrays which don't include an index
* **not in increasing order, but will be** - here, it's like the doesn't work, but you stop when you find one, because that's all you need

I use indexes and `grep` to filter out one number at a time. I could use `delete $array[$index]`, but then you still have to `@array = grep { $_ } @array` to keep out undefined values in the array, because there'll be an empty spot at `$array[$index]`. The array won't shrink until you tell it to.

And we need a test function, `is_in_order`, to avoid having the same test in two places.

#### Show me the code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ uniq };

my @examples = (

    [ 0, 2, 9, 4, 6 ],
    [ 5, 1, 3, 2 ],
    [ 2, 2, 3 ],
);

for my $e (@examples) {
    my @ints   = $e->@*;
    my $ints   = join ',', @ints;
    my $output = remove_one(@ints) ? 'true' : 'false';
    say <<~"END";
    Input:  \@ints = ($ints)
    Output: $output
    END
}

sub remove_one (@ints) {
    return 1 if is_in_order(@ints);
    for my $i ( 0 .. -1 + scalar @ints ) {
        my @copy = map { $ints[$_] } grep { $_ != $i } 0 .. -1 + scalar @ints;
        return 1 if is_in_order( @copy );
    }
    return 0;
}

sub is_in_order (@ints) {
    for my $i ( 1 .. -1 + scalar @ints ) {
        my $j = $i - 1;
        return 0 if $ints[$j] > $ints[$i];
    }
    return 1;
}
```

```text
PS C:\Users\jacob\Documents\GitHub\perlweeklychallenge-club\challenge-235\dave-jacoby> .\perl\ch-1.pl
Input:  @ints = (0,2,9,4,6)
Output: true

Input:  @ints = (5,1,3,2)
Output: false

Input:  @ints = (2,2,3)
Output: true
```

### Task 2: Duplicate Zeros

> Submitted by: Mohammad S Anwar  
> You are given an array of integers.  
>
> Write a script to duplicate each occurrence of ZERO in the given array and shift the remaining to the right but make sure the size of array remain the same.  

#### Let's talk about it

There's two issues here.

First is adding another zero whenever you see a zero, which is pretty easy.

Second is making sure the array doesn't grow.

The simple solution is to resize the output array at the end, but we can do better than that, by simply using `last` to stop the process as soon as we're the right size.

This requires two `last`s because that second zero *could* end up being too long.

#### Show me the code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ uniq };

my @examples = (

    [ 1, 0, 2, 3, 0, 4, 5, 0 ],
    [ 1, 2, 3 ],
    [ 0, 3, 0, 4, 5 ],
    [ 0, 1, 0, 0 ],
);

for my $e (@examples) {
    my @ints   = $e->@*;
    my $ints   = join ', ', @ints;
    my @output = duplicate_zeros(@ints);
    my $output = join ', ', @output;
    say <<~"END";
    Input:  \@ints = ($ints)
    Output:         ($output)
    END
}

sub duplicate_zeros (@ints) {
    my @output;
    for my $v (@ints) {
        push @output, $v;
        last if scalar @output >= scalar @ints;
        push @output, $v if $v == 0;
        last if scalar @output >= scalar @ints;
    }
    return @output;
}
```

```text
PS C:\Users\jacob\Documents\GitHub\perlweeklychallenge-club\challenge-235\dave-jacoby> .\perl\ch-2.pl
Input:  @ints = (1, 0, 2, 3, 0, 4, 5, 0)
Output:         (1, 0, 0, 2, 3, 0, 0, 4)

Input:  @ints = (1, 2, 3)
Output:         (1, 2, 3)

Input:  @ints = (0, 3, 0, 4, 5)
Output:         (0, 0, 3, 0, 0)

Input:  @ints = (0, 1, 0, 0)
Output:         (0, 0, 1, 0)
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
