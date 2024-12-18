---
layout: post
title: "Like Tricentennial but for Weeks: Weekly Challenge #300"
author: "Dave Jacoby"
date: "2024-12-18 15:45:15 -0500"
categories: ""
---

Welcome to [_**Weekly Challenge #300!**_](https://theweeklychallenge.org/blog/perl-weekly-challenge-300/) I went searching for a word for 300th week, because **300** is a compound number and probably not the source for much interest, and found that no, there isn't a special word for 300 of a thing. **312** will be the 6th anniversary, though.

### Task 1: Beautiful Arrangement

> Submitted by: Mohammad Sajid Anwar  
> You are given a positive integer, `$int`.
>
> Write a script to return the number of beautiful arrangements that you can construct.
>
> A permutation of n integers, 1-indexed, is considered a beautiful arrangement if for every `i (1 <= i <= n)` either of the following is true:
>
> 1. `perm[i]` is divisible by `i`
> 2. `i` is divisible by `perm[i]`

#### Let's Talk About It

First thing I decided was to unshift a value into the array, since the numbers were `1` to `n`. Adding anything to the front of the array makes it so I don't have to `$array[$i+1]` anywhere.

I can always write my own permutation function, but I always go with a library. The task doesn't say "write your own permute function", right? In Perl, I use [List::Util](https://metacpan.org/pod/List::Util), and in Python, it is part of itertools, which looks like something I'm going to have to learn if I want to spend quality time with Python.

Because we want to compare `i` with `perm[i]`, we need indexes. In Perl, I do `for my $i ( 0 .. -1 + scalar @perm ) {.}` and in Python, I do `for i in [*range(1, i + 1)]:`.

My test to determine if `i` is divisible by `perm[i]` is to cast it as an integer and see if it's equal.

Python isn't as capable as Perl, not having named loops, so instead of opting out of a loop when a failure occurs, I count the wins and if they match the array size, I count the permutation.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use Algorithm::Permute;
my @examples = ( 1, 2, 4, 10 );

for my $example (@examples) {
    my $output = beautiful_arrangement($example);
    say <<"END";
    Input:  \$int = $example
    Output: $output
END
}

sub beautiful_arrangement ($int) {
    my @array = 1 .. $int;
    my $p     = Algorithm::Permute->new( \@array );
    my $c     = 0;
    my $l = 0;
OUTER: while ( my @p = $p->next() ) {
    $l++;
        unshift @p,'';
        for my $i ( 1 .. -1 + scalar @p ) {
            my $r1 = $i / $p[$i];
            my $r2 = $p[$i] / $i;
            my $i1 = int $r1;
            my $i2 = int $r2;
            next OUTER unless $r1 == $i1 || $r2 == $i2;
        }
        $c++;
    }
    return $c;
}
```

```python
#!/usr/bin/python3

from itertools import permutations


def main():
    examples = [1, 2, 4, 10]
    for e in examples:
        output = beautiful_arrangement(e)
        print(f'    Input:  int = {e}')
        print(f"    Output: {output}")
        print("")


def beautiful_arrangement(i):
    array = [*range(1, i + 1)]
    size = len(array)
    p = permutations(array)
    c = 0
    for j in list(p):
        n = 0
        perm = list(j)
        perm.insert(0, 0)
        for i in [*range(1, i + 1)]:
            v = perm[i]
            r1 = i / v
            r2 = v / i
            i1 = int(r1)
            i2 = int(r2)
            if r1 == i1 or r2 == i2:
                n += 1
        if n == size:
            c += 1
    return c


if __name__ == "__main__":
    main()
```

```text
$ ./ch-1.py; ./ch-1.pl
    Input:  int = 1
    Output: 1

    Input:  int = 2
    Output: 2

    Input:  int = 4
    Output: 8

    Input:  int = 10
    Output: 700

    Input:  $int = 1
    Output: 1

    Input:  $int = 2
    Output: 2

    Input:  $int = 4
    Output: 8

    Input:  $int = 10
    Output: 700
```

### Task 2: Nested Array

> Submitted by: Mohammad Sajid Anwar
> You are given an array of integers, `@ints` of length `n` containing permutation of the numbers in the range `[0, n - 1]`.
>
> Write a script to build a set, `set[i] = ints[i], ints[ints[i]], ints[ints[ints[i]]], ...`, subjected to the following rules:
>
> 1. The first element in `set[i]` starts with the selection of elements `ints[i]`.
> 2. The next element in `set[i]` should be `ints[ints[i]]`, and then `ints[ints[ints[i]]]`, and so on.
> 3. We stop adding right before a duplicate element occurs in set[i].
>    Return the longest length of a set `set[i]`.

#### Let's Talk About It

This is another task where I would've loved to have a named loop. As well as another task that doesn't look like a job for **Recursion!**

Instead, we use a `for` loop through the indexes as starting point, and go `while` there's a non-duplicate `n` for every `array[n]`. Add to the nested array each jump unless `n` is already in it. At that point, either mark the flag as false so the loop ends or just `next OUTER`.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use List::Util qw{ any max };

my @examples = (

    [ 5, 4, 0, 3, 1, 6, 2 ],
    [ 0, 1, 2 ],
    [ 2, 0, 1, 3 ],
);

for my $example (@examples) {
    my $ints   = join ', ', $example->@*;
    my $output = nested_array( $example->@* );
    say <<"END";
    Input:  \@ints = ($ints)
    Output: $output
END
}

sub nested_array(@array) {
    my @loops;
OUTER: for my $i ( 0 .. -1 + scalar @array ) {
        my $flag = 1;
        my @nested;
        my $n = $i;
        while ($flag) {
            if ( any { $n == $_ } @nested ) {
                push @loops, scalar @nested;
                next OUTER;
            }
            else { my $v = $array[$n]; push @nested, $n; $n = $v; }
        }
    }
    return max @loops;
}
```

```python
#!/usr/bin/python3

import copy


def main():
    examples = [[5, 4, 0, 3, 1, 6, 2], [0, 1, 2], [2, 0, 1, 3]]
    for e in examples:
        output = nested_array(e)
        print(f"    Input:  string = {e}")
        print(f"    Output: {output}")
        print("")


def nested_array(ints):
    loops = []
    size = len(ints)
    for i in [*range(size)]:
        nested = []
        flag = 1
        n = i
        while flag:
            if n in nested:
                loops.append(len(nested))
                flag = 0
            else:
                v = ints[n]
                nested.append(n)
                n = v
    return max(loops)


if __name__ == "__main__":
    main()
```

```text
$ ./ch-2.py; ./ch-2.pl
    Input:  string = [5, 4, 0, 3, 1, 6, 2]
    Output: 4

    Input:  string = [0, 1, 2]
    Output: 1

    Input:  string = [2, 0, 1, 3]
    Output: 3

    Input:  @ints = (5, 4, 0, 3, 1, 6, 2)
    Output: 4

    Input:  @ints = (0, 1, 2)
    Output: 1

    Input:  @ints = (2, 0, 1, 3)
    Output: 3
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
