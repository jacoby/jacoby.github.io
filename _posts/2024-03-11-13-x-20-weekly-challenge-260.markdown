---
layout: post
title: "13 x 20: Weekly Challenge #260"
author: "Dave Jacoby"
date: "2024-03-11 11:58:31 -0400"
categories: ""
---

Here we go, into **[Weekly Challenge #260!](https://theweeklychallenge.org/blog/perl-weekly-challenge-260/)**

### Task 1: Unique Occurrences

> Submitted by: Mohammad Sajid Anwar  
> You are given an array of integers, `@ints`.
>
> Write a script to return 1 if the number of occurrences of each value in the given array is unique or 0 otherwise.

#### Let's Talk About It

We are asked to indicate uniqueness. We are not asked to show evidence. This helps determine our method. In this case, we run through the list once, counting every instance of an integer in the array with the help of a hash.

It is common to call `keys` on a hash, but you can just get the values, with `values`. We don't care about which keys associate with each values, we just want to know if the count is unique.

Today, I'm spreading out my [List::Util](https://metacpan.org/pod/List::Util) usage by going with `uniqint`, and the coolest thing about it is that, when called in a scalar context, it returns a count, so I can run `scalar` and `uniqint` against the same list of integers, like the count of times a given integer shows up in the `@ints` array, and make a ternary based on whether those are equal.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use DateTime;
use List::Util qw{ uniqint  };

my @examples = (

    [ 1,  2, 2, 1, 1, 3 ],
    [ 1,  2, 3 ],
    [ -2, 0, 1, -2, 1, 1, 0, 1, -2, 9 ],
);

for my $example (@examples) {
    my @ints   = $example->@*;
    my $ints   = join ',', @ints;
    my $output = unique_occurances(@ints);
    say <<"END";
    Input:  \$ints = ($ints)
    Output: $output
END
}

sub unique_occurances (@ints) {
    my %hash;
    for my $i (@ints) {
        $hash{$i}++;
    }

    # is there a more clever way to do this?
    my $before = scalar values %hash;
    my $after  = uniqint values %hash;
    return $before == $after ? 1 : 0;
}
```

```text
$ ./ch-1.pl
    Input:  $ints = (1,2,2,1,1,3)
    Output: 1

    Input:  $ints = (1,2,3)
    Output: 0

    Input:  $ints = (-2,0,1,-2,1,1,0,1,-2,9)
    Output: 1
```

### Task 2: Dictionary Rank

> Submitted by: Mark Anderson  
> You are given a word, `$word`.
>
> Write a script to compute the dictionary rank of the given word.

#### Let's Talk About It

First example is `CAT`. We take all possible combinations (or permutations) of the letters `C`, `A`, and `T`, and we get `CAT, CTA, ATC, TCA, ACT, TAC`. Sort those into alphabetical order and we get `ACT, ATC, CAT, CTA, TAC, TCA`. `CAT` is the third permutation in the list, so we return **3**.

Yes, I just did restate the first example from the task.

The number of permutations possible in `n!`, meaning `1 * 2 * ... + n`. In the case of **CAT**, that's **6**. For **SECRET**, that's **720**.

Except, there are repeated letters. When I show you **SECRET**, is that **SE<sub>1</sub>CRE<sub>2</sub>T** or **SE<sub>2</sub>CRE<sub>1</sub>T** I'm showing you? Either way, you're not going to have **SECRET** twice in the list of permutations, so we've cut our list by half. There are 2 repeated letters in **GOOGLE**, so that list shrinks to a quarter. And you affect that with [List::Util](https://metacpan.org/pod/List::Util) and `uniq`. (OK, I could do the `$hash{$permutation} = 1` thing as well.)

And then, we use `first` on a list of indexes to find the first index where `$list[$_]  == $word`.

And I'm using [Algorithm::Permute](https://metacpan.org/pod/Algorithm::Permute) to create the permutations.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use Algorithm::Permute;
use List::Util qw{ first uniq };

my @examples = (qw{ CAT GOOGLE SECRET });

for my $example (@examples) {
    my $output = dictionary_rank($example);

    say <<"END";
    Input: \$word = '$example'
    Output: $output
END
}

sub dictionary_rank ($word) {
    my @word = split //, $word;
    my @list;
    my $iter = Algorithm::Permute->new( \@word );
    while ( my @p = $iter->next ) {
        push @list, join '', @p;
    }
    @list = uniq sort @list;

    # would normally worry about a not-there response, but
    # since the permutations are based on the word, the word
    # has to be in there.
    my $i = first { $word eq $list[$_] } 0 .. scalar @list;
    return $i + 1;
}
```

```text
$ ./ch-2.pl 
    Input: $word = 'CAT'
    Output: 3

    Input: $word = 'GOOGLE'
    Output: 88

    Input: $word = 'SECRET'
    Output: 255
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
