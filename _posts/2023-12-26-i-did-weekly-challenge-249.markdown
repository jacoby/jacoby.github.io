---
layout: post
title:  "I Did: Weekly Challenge #249"
author: "Dave Jacoby"
date:   "2023-12-26 14:11:50 -0500"
categories: ""
---

We now start [Weekly Challenge #249!](https://theweeklychallenge.org/blog/perl-weekly-challenge-249/) **249** is the product of **83** and **3**, and as such, it is [_semiprime_](https://en.wikipedia.org/wiki/Semiprime). It is also one of three area codes for Ottowa, Canada.

This is the last Weekly Challenge of 2023. Here's to next year's challenges! I paraphrase _The IT Crowd_ when I say:

> **First rule of the _Weekly Challenge_ ... is that you really must try and tell as many people as possible about it. It's a rather fun game and the more people you tell about it the better.**

### Task 1: Equal Pairs

> Submitted by: Mohammad S Anwar  
> You are given an array of integers with even number of elements.
>
> Write a script to divide the given array into equal pairs such that:
>
> a) Each element belongs to exactly one pair.
> b) The elements present in a pair are equal.

#### Let's Talk About It

The first example lists the solution as `(2, 2), (3, 3), (2, 2)`, which I don't fully get. I get the pairs, in that there's one pair of 3 and 2 pairs of 2, but I'm not seeing a way of accounting for it where you'd group the pairs together in that order.

But the key for me is to go through each integer, seeing if it's in my hash table. If it isn't the hash table, put it in there. If it is, delete the hash table entry and push the pair as an array reference onto the output.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @examples = (

    [ 3, 2, 3, 2, 2, 2 ],
    [ 1, 2, 3, 4 ],
);

for my $example (@examples) {
    my $input  = join ', ', $example->@*;
    my @output = equal_pairs( $example->@* );
    my $output = join ', ',
        map { qq{($_)} } map { join ', ', $_->@* } @output;

    say <<~"END";
    Input:  \$ints = ($input)
    Output: ($output)
    END
}

sub equal_pairs (@input) {
    my @output;
    my %hash;
    for my $i (@input) {
        if ( $hash{$i} ) {
            push @output, [ $i, $i ];
            delete $hash{$i};
        }
        else {
            $hash{$i} = 1;
        }
    }
    return @output;
}
```

```text
$ ./ch-1.pl 
Input:  $ints = (3, 2, 3, 2, 2, 2)
Output: ((3, 3), (2, 2), (2, 2))

Input:  $ints = (1, 2, 3, 4)
Output: ()
```

### Task 2: DI String Match

> Submitted by: Mohammad S Anwar
> You are given a string s, consisting of only the characters "D" and "I".
>
> Find a permutation of the integers [0 .. length(s)] such that for each character s[i] in the string:
>
> `s[i] == 'I' ⇒ perm[i] < perm[i + 1]`
> `s[i] == 'D' ⇒ perm[i] > perm[i + 1]`

#### Let's Talk About It

When we're talking about permutations, we're talking about all the possible solutions,

We're also talking about [Algorithm::Permute](https://metacpan.org/pod/Algorithm::Permute) or one of the other modules that offer permutations. (Or you could write your own.)

As is often the case, when looking at `perm[i]`, I was thinking of `perm(i)`. That's to say, I'm trying to figure out what function, what transformation, is done on `i`, but no. We're talking about positions in and indexes and values. We have a list of numbers starting with 0, and within each permute, we're comparing the value in each position with the next, which makes the values simple comparisons, and we used a named loop to get out when we find a permutation that doesn't work.

The examples give one passing solution, but there are potentially many for most iterations, so my code finds and displays all the possibile solutions.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use Algorithm::Permute;

my @examples = ( "IDID", "III", "DDI", );

for my $e (@examples) {
    my @output = di_string_match($e);
    my $output = join "\n        ", 
        sort
        map { qq{($_)} } 
        map { join ', ', $_->@* } 
        @output;

    say <<~"END";
    Input:  \$str = $e

    Output: $output
    END
}

sub di_string_match ($str) {
    my @output;
    my @s = 0 .. length $str;
    my $p = Algorithm::Permute->new( [@s] );
OUTER: while ( my @perm = $p->next ) {
        for my $i ( 0 .. -1 + length $str ) {
            my $l = substr $str, $i, 1;
            if ( $l eq 'I' ) {
                next OUTER unless $perm[$i] < $perm[ $i + 1 ];
            }
            elsif ( $l eq 'D' ) {
                next OUTER unless $perm[$i] > $perm[ $i + 1 ];
            }
        }
        push @output, \@perm;
    }

    return @output;
}
```

```text
$ ./ch-2.pl 
Input:  $str = IDID

Output: (0, 2, 1, 4, 3)
        (0, 3, 1, 4, 2)
        (0, 3, 2, 4, 1)
        (0, 4, 1, 3, 2)
        (0, 4, 2, 3, 1)
        (1, 2, 0, 4, 3)
        (1, 3, 0, 4, 2)
        (1, 3, 2, 4, 0)
        (1, 4, 0, 3, 2)
        (1, 4, 2, 3, 0)
        (2, 3, 0, 4, 1)
        (2, 3, 1, 4, 0)
        (2, 4, 0, 3, 1)
        (2, 4, 1, 3, 0)
        (3, 4, 0, 2, 1)
        (3, 4, 1, 2, 0)

Input:  $str = III

Output: (0, 1, 2, 3)

Input:  $str = DDI

Output: (2, 1, 0, 3)
        (3, 1, 0, 2)
        (3, 2, 0, 1)
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
