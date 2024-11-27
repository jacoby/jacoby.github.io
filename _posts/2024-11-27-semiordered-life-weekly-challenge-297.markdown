---
layout: post
title: "Semi-Ordered Life: Weekly Challenge #297"
author: "Dave Jacoby"
date: "2024-11-27 15:45:47 -0500"
categories: ""
---

Welcome to [**_Weekly Challenge #297!_**](https://theweeklychallenge.org/blog/perl-weekly-challenge-297/) **297** is the product of **3, 3, 3 and 11**, and is also the telephone country code for Aruba.

I'm continuing in implementing my solutions in both Perl and Python, so I expand my horizons with languages. Considering Javascript and Ruby as possible additions.

### Task 1: Contiguous Array

> Submitted by: Mohammad Sajid Anwar  
> You are given an array of binary numbers, `@binary`.
>
> Write a script to return the maximum length of a contiguous subarray with an equal number of `0` and `1`.

#### Let's Talk About it

This is another solution where you go over a subset of the array over and over again. I go `for my $i ( start .. finish ) { for my $j (  $i + 1 .. finish ) { ... } }` but could see the same with `for my $i ( start .. finish ) { for my $j ( start .. $i - 1 ) }`. I'm sure there's a one-pass take, which would be **O(n)** instead of **O(nlogn)** (I think), but I think this is readable for other developers, including yoruself at a less clever state.

Anyway, big loop picks one side of an array subset, small loop picks the other, we take that subset and count the ones and zeros. I think that `2 * ( sum0(@array)) == scalar(@array)` would probably be a good test, but I went with counting ones and zeros.

From there, we start with `$longest = -1` and `$longest = $length if $length > $longest`, because we're looking for the count, not the values or indexes.

In retrospect, pulling out functions for `just_zero` and `just_one` makes a lot more sense when the functions are not one-line things, and there's probably similar one-line solutions in Python I just don't know yet. Alas.

#### Show Me the Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

my @examples = (

    [ 1, 0 ],
    [ 0, 1, 0 ],
    [ 0, 0, 0, 0, 0 ],
    [ 0, 1, 0, 0, 1, 0 ],
);

for my $example (@examples) {
    my $input  = join ', ', $example->@*;
    my $output = continuous_array($example);

    say <<"END";
    Input:  \@binary = ($input)
    Output: $output
END
}

sub continuous_array ($array) {
    my $l   = 0;
    my $max = -1 + scalar $array->@*;
    for my $i ( 0 .. $max ) {
        for my $j ( $i + 1 .. $max ) {
            my @local = map { $array->[$_] } $i .. $j;
            my $len   = 1 + ( $j - $i );
            my $z     = just_zero(@local);
            my $o     = just_one(@local);
            next unless $z == $o;
            if ( $len > $l ) { $l = $len; }
        }
    }
    return $l;
}

sub just_zero (@array) {
    return scalar grep { $_ == 0 } @array;
}

sub just_one (@array) {
    return scalar grep { $_ == 1 } @array;
}
```

```python
#!/usr/bin/python3


def main():
    examples = [
        [1, 0],
        [0, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 0, 0, 1, 0],
    ]
    for e in examples:
        s = []
        for i in e:
            s.append(str(i))
        input = ", ".join(s)
        output = continuous_array(e)
        print(f"    Input:  binary = ({input})")
        print(f"    Output: {output}")
        print("")


def continuous_array(array):
    l = 0
    max = 1 + len(array)
    for i in range(0, max):
        for j in range(i + 1, max):
            indexes = [*range(i, j)]
            values = [array[k] for k in indexes]
            length = len(indexes)
            zeros = 0
            ones = 0
            for v in values:
                if v == 0:
                    zeros += 1
                if v == 1:
                    ones += 1
            if zeros == ones:
                if length > l:
                    l = length
    return l


if __name__ == "__main__":
    main()
```

```text
$ ./ch-1.pl && ./ch-1.py
    Input:  @binary = (1, 0)
    Output: 2

    Input:  @binary = (0, 1, 0)
    Output: 2

    Input:  @binary = (0, 0, 0, 0, 0)
    Output: 0

    Input:  @binary = (0, 1, 0, 0, 1, 0)
    Output: 4

    Input:  binary = (1, 0)
    Output: 2

    Input:  binary = (0, 1, 0)
    Output: 2

    Input:  binary = (0, 0, 0, 0, 0)
    Output: 0

    Input:  binary = (0, 1, 0, 0, 1, 0)
    Output: 4

```

### Task 2: Semi-Ordered Permutation

> Submitted by: Mohammad Sajid Anwar  
> You are given permutation of `$n` integers, `@ints`.
>
> Write a script to find the minimum number of swaps needed to make the `@ints` a semi-ordered permutation.
>
> > A permutation is a sequence of integers from `1` to `n` of length `n` containing each number exactly once.  
> > A permutation is called semi-ordered if the first number is `1` and the last number equals `n`.
>
> You are ONLY allowed to pick adjacent elements and swap them.

#### Let's Talk About it

This _could_ look like a job for recursion, if you really wanted it to be, but it struck me that it's a simple `while` loop to move a character to the right position in an array.

There are only two requirements:

- the array must start with 1
- the array must end with the highest values

So, we only need methods to move `1` one to the left and `max` one to the right. We also need to know the index where `$array[i] == $min` and `$array[i] == $max`.

How do you swap values? Like you want to make `$c = $d` and `$d = $c` without making both values equal what `$d` was at the start. I remember being taught `my $scratch = $c; $c = $d; $d = $scratch`, but when you have anonymous arrays? `( $c, $d ) = ( $d, $c )` and you don't need to create more variables.

A quick search into Python didn't give me an equivalent to `first` from [List::Util](https://metacpan.org/pod/List::Util). I have no idea if my search skills were insufficient or not, so I wrote `first_index_that_equals`, which is a wonder in both code and naming.

(List::Util is such a handy multitool of a module, I'm beginning to think I should write up discrete implementations of functions for Challenge problems, rather than keep going back to the well.)

So, there's iteration, while loops, swapping two values, finding the first index that matches. Is there anything else that needs explaining?

Oh, one Python thing that I might be the last developer in America to understand: There's a list we call `mylist`. We can get the size of the list with `len(mylist)`. We can create a list going from `0` to `n-1` with `range(n)`. Except when we want to use it, we get `"range(0,5)"` instead of the list of indexes, `[0, 1, 2, 3, 4]`. So I think that I need to assert that I want a list with `[range(0,n)]`, but then I get `"[range(0,5)]"`. I have to dereference it with `[*range(0,n)]`.

#### Show Me the Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use List::Util qw{first};

my @examples = (

    [ 2, 1, 4, 3 ],
    [ 2, 4, 1, 3 ],
    [ 1, 2, 3, 4, 5 ],
    [ 9, 8, 7, 6, 2, 3, 4, 5, 1 ],
);

for my $example (@examples) {
    my $output = semi_ordered_permute( $example->@* );
    my $input  = join ', ', $example->@*;
    say <<"END";
    Input:  \@ints = ($input)
    Output: $output
END
}

sub semi_ordered_permute (@array) {
    my $min   = 1;
    my $max   = scalar @array;
    my $steps = 0;
    while ( $array[0] != $min ) {
        my $i = first { $min == $array[$_] } 0 .. -1 + $max;
        ( $array[$i], $array[ $i - 1 ] ) = ( $array[ $i - 1 ], $array[$i] );
        $steps++;
    }
    while ( $array[-1] != $max ) {
        my $i = first { $max == $array[$_] } 0 .. -1 + $max;
        ( $array[$i], $array[ $i + 1 ] ) = ( $array[ $i + 1 ], $array[$i] );
        $steps++;
    }
    return $steps;
}
```

```python
#!/usr/bin/python3

def main():
    examples = [
        [2, 1, 4, 3],
        [2, 4, 1, 3],
        [1, 2, 3, 4, 5],
        [9, 8, 7, 6, 2, 3, 4, 5, 1],
    ]
    for e in examples:
        input = ", ".join(str(i) for i in e)
        output = semi_ordered_permute(e)
        print(f"    Input:  ints = [{input}]")
        print(f"    Output: {output}")
        print("")


def semi_ordered_permute(array):
    max = len(array)
    min = 1
    steps = 0
    while min != array[0]:
        i = first_index_that_equals(array, min)
        (array[i], array[i - 1]) = (array[i - 1], array[i])
        steps += 1
    while max != array[-1]:
        i = first_index_that_equals(array, max)
        (array[i], array[i + 1]) = (array[i + 1], array[i])
        steps += 1
    return steps


def first_index_that_equals(array, value):
    indexes = [*range(len(array))]
    for i in [*range(len(array))]:
        if value == array[i]:
            return i


if __name__ == "__main__":
    main()
```

```text
$ ./ch-2.pl && ./ch-2.py
    Input:  @ints = (2, 1, 4, 3)
    Output: 2

    Input:  @ints = (2, 4, 1, 3)
    Output: 3

    Input:  @ints = (1, 2, 3, 4, 5)
    Output: 0

    Input:  @ints = (9, 8, 7, 6, 2, 3, 4, 5, 1)
    Output: 15

    Input:  ints = [2, 1, 4, 3]
    Output: 2

    Input:  ints = [2, 4, 1, 3]
    Output: 3

    Input:  ints = [1, 2, 3, 4, 5]
    Output: 0

    Input:  ints = [9, 8, 7, 6, 2, 3, 4, 5, 1]
    Output: 15
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
