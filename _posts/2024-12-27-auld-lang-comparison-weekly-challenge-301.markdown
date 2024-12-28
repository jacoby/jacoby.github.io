---
layout: post
title: "Auld Lang Comparison: Weekly Challenge #301"
author: "Dave Jacoby"
date: "2024-12-27 18:42:15 -0500"
categories: ""
---

Welcome to [_**Weekly Challenge #301!**_](https://theweeklychallenge.org/blog/perl-weekly-challenge-301/) **301** is a compound number, the product of **43** and **7**. It is the original Area Code covering Maryland, and now covers the western part of the state.

I am continuing my Perl-and-Python responses, in an effort to work more with Python. I know my Python _works_, that it runs and gives the answers I want, but if you have suggestions on how to make more ideomatic Python, "Python as She is Spoke", so to speak, I would be glad to hear it.

And of course, the title is a reference to that continuing language comparison, and to [Robert Burns' poem, turned into the traditional song to ring in the New Year.](https://en.wikipedia.org/wiki/Auld_Lang_Syne)

### Task 1: Largest Number

> Submitted by: Mohammad Sajid Anwar  
> You are given a list of positive integers, `@ints`.
>
> Write a script to arrange all the elements in the given list such that they form the largest number and return it.

#### Let's Talk About It

I'm again relying on permutation to give us the numbers as we want, and then choosing the newest variation if the value is greater than what I already have. The good thing, to me as a Perl guy, is that Perl has variables that behave as different types. We overload our variables, not our operators, so we know that `1 + '29 Palms'` is `30`, because addition will find the most numerical interpretation of that string and use that.

The Python-and-C guy I told this to declared it madness.

For python, you need to map every number to a string, join all the strings together, and then casting the result as an integer. `output = int("".join(str(value) for value in array_of_integers))`.

See previous entries for my praises for itertools and Algorithm::Permute.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use Algorithm::Permute;
my @examples = (

    [ 20, 3 ],
    [ 3,  30, 34, 5, 9 ],
);

for my $example (@examples) {
    my $input  = join ', ', $example->@*;
    my $output = largest_number( $example->@* );
    say <<"END";
    Input:  \$int = ($input)
    Output: $output
END
}

sub largest_number (@array) {
    my $p = Algorithm::Permute->new( \@array );
    my $l = 0;
    while ( my @p = $p->next() ) {
        my $n = join '', @p;
        $l = $l < $n ? $n : $l;
    }
    return $l;
}
```

```python
#!/usr/bin/python3

from itertools import permutations


def main():
    examples = [[20, 3], [3, 30, 34, 5, 9]]
    for e in examples:
        output = largest_number(e)
        print(f"    Input:  ints = {e}")
        print(f"    Output: {output}")
        print("")


def largest_number(array):
    p = permutations(array)
    l = 0
    for j in list(p):
        k = int("".join(str(x) for x in j))
        if k > l:
            l = k
    return l


if __name__ == "__main__":
    main()
```

```text
$ ./ch-1.pl;./ch-
1.py
    Input:  $int = (20, 3)
    Output: 320

    Input:  $int = (3, 30, 34, 5, 9)
    Output: 9534330

    Input:  ints = [20, 3]
    Output: 320

    Input:  ints = [3, 30, 34, 5, 9]
    Output: 9534330
```

### Task 2: Hamming Distance

> Submitted by: Mohammad Sajid Anwar
> You are given an array of integers, `@ints`.
>
> Write a script to return the sum of **Hamming distances** between all the pairs of the integers in the given array of integers.
>
> > The Hamming distance between two integers is the number of places in which their binary representations differ.

#### Let's Talk About it

So, we need to find every combination of two entries. I could easily have done `my $p = Algorithm::Permute->new( \@array, 2 )` to get this result, but I found it easier to nest loops: `for my $i ( 0 .. $end ) { for my $j ( $i + 1 .. $end ) { ... } }`.

So we have the indexes for the two values, but we want to compare binary values. in Perl, my goto is `sprintf`, and I `sprintf '%08b'` to pad it, because I want my binary numbers to be the same size. Making them full bytes seems sufficient. In python, I need to `format` to binary and `rjust` to left-pad (or right-justify, by that title) the value, which is done via `format( int, "b").rjust(8,"0")`. That format, rather than `bin(int)`, allows me to disregard the initial `0b` that this form of formatting would add.

(If this was more production, and especially if I was comparing numbers of wildly different size, I might reverse the strings and treat being off the string as `0`, but I didn't think to go full paranoia for this task.)

I then go for every index and compare the values for equality, counting each time there's a difference. I find it interesting that string variables in Python double enough as arrays that you address characters within the string like you would address slices of arrays.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use List::Util qw{ max };

my @examples = (

    [ 4, 14, 2 ],
    [ 4, 14, 4 ],
    [ 0, 1,  2, 4, 32 ]
);

for my $example (@examples) {
    my $ints   = join ', ', $example->@*;
    my $output = hamming_distance( $example->@* );
    say <<"END";
    Input:  \@ints = ($ints)
    Output: $output
END
}

sub hamming_distance (@array) {
    my $o;
    my $end = -1 + scalar @array;
    for my $i ( 0 .. $end ) {
        my $ii = $array[$i];
        my $bi = sprintf '%08b', $ii;
        for my $j ( $i + 1 .. $end ) {
            my $jj = $array[$j];
            my $bj = sprintf '%08b', $jj;
            my $c  = count_diffs( $bi, $bj );
            $o += $c;
        }
    }
    return $o;
}

sub count_diffs( $str1, $str2 ) {
    my $max = max map { length $_ } $str1, $str2;
    my $o   = 0;
    for my $i ( 0 .. $max ) {
        $o++ if substr( $str1, $i, 1 ) ne substr( $str2, $i, 1 );
    }
    return $o;
}
```

```python
#!/usr/bin/python3


def main():
    examples = [[4, 14, 2], [4, 14, 4], [0, 1, 2, 4, 32]]
    for e in examples:
        output = hamming_distance(e)
        print(f"    Input:  string = {e}")
        print(f"    Output: {output}")
        print("")


def hamming_distance(ints):
    o = 0
    end = len(ints)
    for i in [*range(end)]:
        ii = ints[i]
        bi = format(ii, "b").rjust(8, "0")
        for j in [*range(i + 1, end)]:
            jj = ints[j]
            bj = format(jj, "b").rjust(8, "0")
            c = count_diffs(bi, bj)
            o += c
    return o


def count_diffs(bi, bj):
    m = max(map(len, (bi, bj)))
    c = 0
    for i in [*range(m)]:
        si = bi[i : i + 1]
        sj = bj[i : i + 1]
        if si != sj:
            c += 1
    return c


if __name__ == "__main__":
    main()
```

```text
$ ./ch-2.pl;./ch-2.py
    Input:  @ints = (4, 14, 2)
    Output: 6

    Input:  @ints = (4, 14, 4)
    Output: 4

    Input:  @ints = (0, 1, 2, 4, 32)
    Output: 16

    Input:  string = [4, 14, 2]
    Output: 6

    Input:  string = [4, 14, 4]
    Output: 4

    Input:  string = [0, 1, 2, 4, 32]
    Output: 16
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
