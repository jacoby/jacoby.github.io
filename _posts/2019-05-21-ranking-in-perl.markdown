---
layout: post
title: "Ranking in Perl"
author: "Dave Jacoby"
date: "2019-05-21 11:34:04 -0400"
categories: ""
---

Another [Perl Weekly Challenge!](https://perlweeklychallenge.org/blog/perl-weekly-challenge-009/)

> Write a script to perform different types of ranking as described below:
>
> 1. Standard Ranking (1224): Items that compare equal receive the same ranking number, and then a gap is left in the ranking numbers.
> 2. Modified Ranking (1334): It is done by leaving the gaps in the ranking numbers before the sets of equal-ranking items.
> 3. Dense Ranking (1223): Items that compare equally receive the same ranking number, and the next item(s) receive the immediately following ranking number.
>    For more information, please refer to [wiki page](https://en.wikipedia.org/wiki/Ranking).

Finally. Munging data structures like this is much closer to the kind of thing I do with Perl than playing with numbers, so this is my home.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

# Perl personalities and assigned numbers to make the ranking
# turn out right. These are funny numbers; I value you all!

my @data;
push @data, [ 'timtoady',    100 ];
push @data, [ 'merlyn',      90 ];
push @data, [ 'gnat',        90 ];
push @data, [ 'briandfoy',   80 ];
push @data, [ 'gabor',       70 ];
push @data, [ 'cpan_author', 70 ];
push @data, [ 'ovid',        70 ];
push @data, [ 'jacoby',      60 ];

standard(@data);
modified(@data);
dense(@data);


# 1223
sub dense(@array) {
    # I went with dense() first, because I deemed it the simplest.
    # The highest ranking group gets 1, followed by 2, then 3, etc.

    # I think there are two funky bits with this code: derefs and sorts.

    # We would do push @{ $ranking->{ $n }, $_ } before, but now we append
    # ->@* to the back of the variable to indicate that it's to be treated
    # as an array. It's stable as of 5.24, but I turn off warnings for it
    # to be careful.
    # https://www.effectiveperlprogramming.com/2014/09/use-postfix-dereferencing/

    # then there's sort, which has two operators involved.
    # <=> is the Spaceship operator, and it does numeric comparison.
    # cmp does stringwise comparison. Within sort, you have $a and $b
    # (which is why you shouldn't use them anywhere else), and the
    # comparison operators return -1, 0 or 1, depending on position.

    # in `sort { $b <=> $a } keys $ranking->%*`, the keys are numeric
    # values < 100, and we want 100 -> first, 90 -> 2nd and so forth.
    # That COULD be `reverse sort { $a <=> $b }`, but why?
    # I specify numeric sort because it defaults to string sort,
    # which means `say join ',', (sort 1..100)[0..5]` gets you
    # `1,10,100,11,12,13`

    # `sort { $a cmp $b }` could have just been `sort`, though.

    # and now, watch the $rank variable, because that's the real difference
    # between these three. here, we start at 1 and add 1 each time we go
    # through the outer loop

    say 'DENSE';
    my $ranking;
    map { push $ranking->{ $_->[1] }->@*, $_ } @array;
    my $rank = 1;
    for my $k ( sort { $b <=> $a } keys $ranking->%* ) {
        my $l = $ranking->{$k};
        for my $name ( sort { $a cmp $b } map { $_->[0] } $l->@* ) {
            say join ') ', $rank, $name;
        }
        $rank++;
    }
    say '';
}

# 1224
sub standard(@array) {
    say 'STANDARD';
    my $done = 0;
    my $ranking;
    map { push $ranking->{ $_->[1] }->@*, $_ } @array;
    my $rank = 1;
    for my $k ( sort { $b <=> $a } keys $ranking->%* ) {
        my $l = $ranking->{$k};
        for my $name ( sort { $a cmp $b } map { $_->[0] } $l->@* ) {
            say join ') ', $rank, $name;
        }
        # instead of plain iterating, we're adding the number of
        # elements in the just-handled arrayref
        $rank += scalar $l->@*;
    }
    say '';
}

# 1334
sub modified(@array) {
    say 'MODIFIED';
    my $ranking;
    map { push $ranking->{ $_->[1] }->@*, $_ } @array;
    my $rank = 0;
    for my $k ( sort { $b <=> $a } keys $ranking->%* ) {
        my $l = $ranking->{$k};
        # and here, we start with 0 and add the element count first,
        # which means we'd start with a two-way tie for second, not first,
        # if there were two equal-value entries at the top.
        $rank += scalar $l->@*;
        for my $name ( sort { $a cmp $b } map { $_->[0] } $l->@* ) {
            say join ') ', $rank, $name;
        }
    }
    say '';
}
```

```text
STANDARD
1) timtoady
2) gnat
2) merlyn
4) briandfoy
5) cpan_author
5) gabor
5) ovid

MODIFIED
1) timtoady
3) gnat
3) merlyn
4) briandfoy
7) cpan_author
7) gabor
7) ovid

DENSE
1) timtoady
2) gnat
2) merlyn
3) briandfoy
4) cpan_author
4) gabor
4) ovid

```

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
