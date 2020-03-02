---
layout: post
title: "Perl Challenge #50"
author: "Dave Jacoby"
date: "2020-03-02 18:16:08 -0500"
categories: ""
---

I am _sure_ this isn't my 50th entry, but it _is_ [the 50th challenge](https://perlweeklychallenge.org/blog/perl-weekly-challenge-050/).

## Task 1

```text
TASK #1
Merge Intervals
Write a script to merge the given intervals where ever possible.

[2,7], [3,9], [10,12], [15,19], [18,22]

The script should merge [2, 7] and [3, 9] together to return [2, 9].

Similarly it should also merge [15, 19] and [18, 22] together to return [15, 22].

The final result should be something like below:

[2, 9], [10, 12], [15, 22]ß
```

**JSON** is my favorite way of displaying complex data structures, so I'm using it to display the array of arrays. I used `shuffle` from **List::Util** to ensure that nothing in this code is dependent on order, but removed it once that was proven.

And, as always, I include my standard header list, but I don't think I use anything funky but `say`.

Because I double-loop the array, I think this comes in at `O(nlogn)`, but here we have a small data set and I can't think of a faster way to make it go.

We use a named while loop with `exit` at the end to allow us to repeat until the test passes.

On each pass, we see if `$i[0]` is less than `$j[0]` and `$i[0]` is greater than `$j[0]`, which works because either the initial data set is ordered by first value or because, if we change the data set, we sort it. Otherwise, we'd have to reverse the test as well.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
  qw{ experimental::postderef experimental::smartmatch experimental::signatures };

use JSON;
my $json = JSON->new;

my @array = ( [ 2, 7 ], [ 3, 9 ], [ 10, 12 ], [ 15, 19 ], [ 18, 22 ] );

# unnecessary in THIS case, but if we take on abstract
# two-dimensional array, we'll have to enforce order
@array = sort { $a->[0] <=> $b->[0] } @array;
say $json->encode( \@array );

LOOP: while (1) {
    for my $i ( 0 .. scalar @array - 1 ) {
        my @i = $array[$i]->@*;
        for my $j ( $i + 1 .. scalar @array - 1 ) {
            my @j = $array[$j]->@*;

            if ( $i[0] <= $j[0] && $i[1] >= $j[0] ) {
                $array[$i][1] = int $j[1];
                undef $array[$j];
                @array = grep { defined } @array;
                next LOOP;
            }
        }
    }
    say $json->encode( \@array );
    exit;
}
```

## Task 2

```text
TASK #2
Contributed by Ryan Thompson.
Noble Integer
You are given a list, @L, of three or more random integers between 1 and 50. A Noble Integer is an integer N in @L, such that there are exactly N integers greater than N in @L. Output any Noble Integer found in @L, or an empty list if none were found.

An interesting question is whether or not there can be multiple Noble Integers in a list.

For example,

Suppose we have list of 4 integers [2, 6, 1, 3].

Here we have 2 in the above list, known as Noble Integer, since there are exactly 2 integers in the list i.e.3 and 6, which are greater than 2.

Therefore the script would print 2.
```

- "random" is perhaps not a good choice for input, because
  it becomes increasingly unlikely that a noble integer
  exists for the set.

- I don't believe a second noble number can exist in a
  set. Let's take @L as an example. Those numbers are in some
  order, but we're talking about them as greater than, so
  we sort them:

  `1, 2, 3, 6`

  As the integer grows, the number of remaining integers shrinks.

  - 1 -> 3 integers greater than
  - 2 -> 2 integers greater than (WINNER!)
  - 3 -> 1 integer greater than
  - 6 -> no integers greater than

- if we repeat an integer, like [2, 2, 6, 1, 3] or [6, 2, 6, 1, 3],
  I am counting each number once -- there are still two integers greater than 2; 3 and 6, not 3, 6 and 6 -- but returning all the copies of the integer that count as noble numbers -- 2, 2 in the first example.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
  qw{ experimental::postderef experimental::smartmatch experimental::signatures };

use List::Util qw{ uniq };

my @L = map { 1 + int rand 50 } 1 .. 3 + int rand 20;
@L = ( 2, 2, 6, 1, 3 );
say join ' ', @L;
my @n = nobles(@L);
say join ' ', scalar @n ? @n : 'none';
exit;

sub nobles ( @list ) {
    my @copy = @list;
    @list = uniq sort { $a <=> $b } @list;
    my @output;
    while (@list) {
        my $i = shift @list;
        my @i = grep { $_ == $i } @copy;
        push @output, @i if $i == scalar @list;
    }
    return @output;
}
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io)
