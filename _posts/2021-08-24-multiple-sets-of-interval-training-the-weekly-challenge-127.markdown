---
layout: post
title: "Multiple Sets of Interval Training: The Weekly Challenge #127"
author: "Dave Jacoby"
date: "2021-08-24 14:39:00 -0400"
categories: ""
---

[Another week, another challenge.](https://theweeklychallenge.org/blog/perl-weekly-challenge-127/)

### TASK #1 › Disjoint Sets

> Submitted by: Mohammad S Anwar  
> You are given two sets with unique integers.
>
> Write a script to figure out if they are disjoint.
>
> The two sets are disjoint if they don’t have any common members.

Why do I like Perl? I like Perl because it fits my brain and the kind of things I want to do, and because it has CPAN. When programming, you don't want to reinvent the wheel, and and CPAN is the biggest collection oF ready-to-use wheels that I can name.

And the wheel appropriate right now is [List::Compare](https://metacpan.org/pod/List::Compare), this does a bunch of set things we want. Run on the examples:

```perl
 ./demo.pl
[1,2,5,3,4]
[4,6,7,8,9]
Intersection (once in both list):
4
Union (once in only the first list):
3 1 4 2 9 8 5 6 7
Complement (once in only the secondlist):
8 9 7 6
Symmetric Difference (once in either but not both):
3 1 2 9 8 5 6 7

[1,3,5,7,9]
[0,2,4,6,8]
Intersection (once in both list):

Union (once in only the first list):
3 9 1 4 2 5 8 7 6 0
Complement (once in only the secondlist):
4 6 2 0 8
Symmetric Difference (once in either but not both):
3 2 4 1 9 8 5 6 0 7
```

And there it is, right? The exact thing we need in `get_intersection`. Is there anything in both lists? Return yes or no.

I mean, we _could_ go through the list, and for every element in list A, we test if it's in list B. But we have this great wheel, so why not take it for a spin?

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict ;
use warnings ;
use feature qw{ say postderef signatures } ;
no warnings qw{ experimental } ;

use JSON ;
use List::Compare;

my $json = JSON->new->canonical ;

my @examples ;
push @examples, [ [ 1, 2, 5, 3, 4 ], [ 4, 6, 7, 8, 9 ] ] ;
push @examples, [ [ 1, 3, 5, 7, 9 ], [ 0, 2, 4, 6, 8 ] ] ;

for my $e ( @examples ) {
    my ( $s1,$s2 ) = $e->@*;
    say $json->encode($s1);
    say $json->encode($s2);
    say is_disjoint_sets($s1,$s2);
    say '';
}

sub is_disjoint_sets( $s1,$s2) {
    my $lc = List::Compare->new( '-u', $s1,$s2 );
    my @inter = $lc->get_intersection;
    return scalar @inter ? 1 : 0;
}
```

```text
[1,2,5,3,4]
[4,6,7,8,9]
1

[1,3,5,7,9]
[0,2,4,6,8]
0
```

### TASK #2 › Conflict Intervals

> Submitted by: Mohammad S Anwar  
> You are given a list of intervals.
>
> Write a script to find out if the current interval conflicts with any of the previous intervals.

Conflicts?

_Conflicts?_

I'm unsure of the definition here.

The first value of the interval `[3, 5]` is within the bounds of `[1, 4]`, so `[3, 5]` conflicts. Presumably, if the test interval was `[0, 3]` instead, it would similarly conflict. I believe the interval `[2, 3]` would conflict as well.

My question is, does the interval `[0, 5]` conflict with `[1, 4]`? Is it that there are points in common?

I do it with comparisons, with '>=' and '<=', but it strikes me, now that I'm explaining myself, that I could transform the intervals, turn `[1, 4]` into `[1, 2, 3, 4]` and pull out List::Compare again, adding the interval onto the list if `get_intersection` returns something. In fact, it might be more readable.

But I've already pasted the existing code into the section below, so I suppose that it remains as an exercise for the reader, unless and until this code bunny forces me to code it up and write it up.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures };
no warnings qw{ experimental };

use JSON;
use List::Util qw{ min max };

my $json = JSON->new->canonical;

my @examples;

push @examples, [ [ 1, 4 ], [ 3, 5 ], [ 6, 8 ], [ 12, 13 ], [ 3, 20 ] ];
push @examples, [ [ 3, 4 ], [ 5, 7 ], [ 6, 9 ], [ 10, 12 ], [ 13, 15 ] ];
push @examples, [ [ 3, 4 ], [ 1, 5 ] ];
push @examples, [ [ 1, 4 ], [ 2, 3 ] ];
push @examples, [ [ 3, 6 ], [ 1, 5 ] ];
push @examples, [ [ 1, 3 ], [ 5, 7 ] ];

for my $e (@examples) {
    my $o = conflict_intervals($e);
    print 'INPUT:  ';
    say join " ", map { '[' . ( join ', ', $_->@* ) . ']' } $e->@*;

    print 'OUTPUT: ';
    say join " ", map { '[' . ( join ', ', $_->@* ) . ']' } $o->@*;
    say '';
}

sub conflict_intervals( $e ) {
    my @output;

OUTER: for my $i ( 0 .. -1 + scalar $e->@* ) {
        my @ii = $e->[$i]->@*;

        for my $j ( 0 .. $i - 1 ) {
            my @jj   = $e->[$j]->@*;
            my $flag = 0;

            if ( $ii[0] >= $jj[0] && $ii[0] <= $jj[1] ) {
                $flag = 1;
            }

            if ( $ii[1] >= $jj[0] && $ii[1] <= $jj[1] ) {
                $flag = 1;
            }

            if ( $jj[0] >= $ii[0] && $jj[0] <= $ii[1] ) {
                $flag = 1;
            }

            if ( $jj[1] >= $ii[0] && $jj[1] <= $ii[1] ) {
                $flag = 1;
            }

            push @output, \@ii if $flag;
            next OUTER if $flag;
        }
    }
    return wantarray ? @output : \@output;
}
```

```text
INPUT:  [1, 4] [3, 5] [6, 8] [12, 13] [3, 20]
OUTPUT: [3, 5] [3, 20]

INPUT:  [3, 4] [5, 7] [6, 9] [10, 12] [13, 15]
OUTPUT: [6, 9]

INPUT:  [3, 4] [1, 5]
OUTPUT: [1, 5]

INPUT:  [1, 4] [2, 3]
OUTPUT: [2, 3]

INPUT:  [3, 6] [1, 5]
OUTPUT: [1, 5]

INPUT:  [1, 3] [5, 7]
OUTPUT:
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
