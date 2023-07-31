---
layout: post
title:  "Get Sum: Weekly Challenge #228"
author: "Dave Jacoby"
date:   "2023-07-31 10:08:27 -0400"
categories: ""
---

Here we are with [Weekly Challenge #228](https://theweeklychallenge.org/blog/perl-weekly-challenge-228/)! [**228**](https://en.wikipedia.org/wiki/228_(number)) is `11100100` in binary, which has each of the two-digit binary numbers in order (`11 10 01 00`).

### Task 1: Unique Sum
>
> Submitted by: Mohammad S Anwar
> You are given an array of integers.
>
> Write a script to find out the sum of unique elements in the given array.

#### Let's Talk About This

Just from the title, I thought that something like `sum uniq @array` would do, which would require, again, [List::Util](https://metacpan.org/pod/List::Util). It's so very useful.

But no. We're not counting each value once, we're only counting unique values, and we're gonna sum them, so we don't need to care about order, so we keep a count of each value (hashes are *so* helpful for this) and use `grep` to only pass through those numbers with values of 1.

This leads us to a usage problem. What is the proper sum of an empty set? List::Util says that's `undef`, which makes sense but isn't helpful, so we use `sum0` so that the sum of `[]` is 0.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw( sum0 );

my @examples = (

    [ 2, 1, 3, 2 ],
    [ 1, 1, 1, 1 ],
    [ 2, 1, 3, 4 ],
);

for my $e (@examples) {
    my @array = $e->@*;
    my $array = join ', ', @array;
    my $sum   = uniq_sum(@array);
    say <<~"END";
    Input:  \@int = ($array)
    Output: $sum
    END
}

sub uniq_sum (@array) {
    my %hash;
    for my $int (@array) {
        $hash{$int}++;
    }
    return sum0 grep { $hash{$_} == 1 } keys %hash;
}
```

```text
$ ./ch-1.pl 
Input:  @int = (2, 1, 3, 2)
Output: 4

Input:  @int = (1, 1, 1, 1)
Output: 0

Input:  @int = (2, 1, 3, 4)
Output: 10
```

### Task 2: Empty Array
>
> Submitted by: Mohammad S Anwar
> You are given an array of integers in which all elements are unique.
>  
> Write a script to perform the following operations until the array is empty and return the total count of operations.
>
> > If the first element is the smallest then remove it otherwise move it to the end.

#### Let's Talk About This

That last sentence is almost pseudocode, isn't it?

> If the first element is the smallest  
> then remove it  
> else move it to the end.  

But that's not the simplest way to think of it

> find the size of the smallest element  
> remove the first element  
> if that element isn't the size of the smallest element  
> append it to the end

We again go to List::Util, but this time, we use `min` to easily find the smallest element in the array. We `shift` (remove from the front) the first array, compare it to the min, and `push` (add to the end) the value back onto the array if it's not the smallest.

Meanwhile, we're incrementing a count variable, because the number of steps is what we're returning.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw( min );

my @examples = (

    [ 3, 4, 2 ],
    [ 1, 2, 3 ],

);

for my $e (@examples) {
    my @array  = $e->@*;
    my $array  = join ', ', @array;
    my $output = empty_array(@array);
    say <<~"END";
    Input:  \@int = ($array)
    Output: $output
    END
}

# if the first element is the smallest
#     then remove it
# else
#     move it to the end
sub empty_array (@array) {
    my $c = 0;
    while ( scalar @array ) {
        my $min  = min @array;
        my $next = shift @array;
        if ( $min != $next ) { push @array, $next; }
        $c++;
    }
    return $c;
}
```

```text
$ ./ch-2.pl 
Input:  @int = (3, 4, 2)
Output: 5

Input:  @int = (1, 2, 3)
Output: 3
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
