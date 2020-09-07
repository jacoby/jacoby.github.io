---
layout: post
title: "Perl Weekly Challenge - A Job for Iteration"
author: "Dave Jacoby"
date: "2020-09-07 16:26:52 -0400"
categories: ""
---

Again, I dive into the [Perl Weekly Challenge](https://perlweeklychallenge.org/blog/perl-weekly-challenge-077/).

### TASK #1 › Fibonacci Sum

> Submitted by: Mohammad S Anwar  
> You are given a positive integer `$N`.
>
> UPDATE: 2020-09-07 09:00:00  
> Write a script to find out all possible combination of Fibonacci Numbers required to get `$N` on addition.
>
> You are NOT allowed to repeat a number. Print 0 if none found.

I normally default to **This Looks Like A Job For Recursion** on problems like this, but it is known that without memoization, recursive Fibonacci gets horrible after N >= 32, so getting all Fibonacci numbers <= N is naturally an iterative task, especially because we want the whole list.

Once we're there, ready to look through all Fibonacci results <= N (because the sum of N is N), we can use iteration and appending arrayrefs to start working the problem.

We start with an empty array. Empty arrays have sum of 0 (when using `sum0`, be warned), which cannot be correct. Then, for each Fibonacci number, we:

* append the number to the array and sort it
* find the sum of the elements in the array
* join all the elements of the array into a string
* use the join string as a hash key to avoid duplicate values
* if the sum is less than N, append the array to the list of arrays we're working through
* if the sum equals N, append the array to the good results array

I suppose I could've done either or both with recursion, but this is fast and not complex. 

#### The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use Carp;
use Getopt::Long;
use List::Util qw{ max sum0 uniq };

my $n = 9;
GetOptions( 'n=i' => \$n );
croak "n < 1" if $n < 1;

fib_sum($n);

#
sub fib_sum ( $n ) {
    my @fib = reverse fib_list($n);
    my @list = ( [] );
    my @sums;
    my %no;

    while (@list) {
        my $entry = shift @list;
        for my $fib (@fib) {
            next if grep { $_ == $fib } $entry->@*;
            my $new->@* = sort { $b <=> $a } $fib, $entry->@*;
            my $sum = sum0 $new->@*;
            my $join = join ',', $new->@*;
            next if $no{$join}++;
            push @list, $new if $sum < $n;
            push @sums, $new if $sum == $n;
        }
    }

    if ( scalar @sums ) {
        for my $sum (@sums) {
            my $s = scalar $sum->@*;
            my $p = join ' + ', $sum->@*;
            say qq{$s as ($n = $p)};
        }
    }
    else { print 0 }
}

# creates a list of fibonacci values where each value is
# less than n and greater than zero, because zero is useless
# in summation
sub fib_list( $n ) {
    my @output = ( 0, 1 );
    my $i = 2;

    while ( max(@output) < $n ) {
        $output[$i] = $output[ $i - 1 ] + $output[ $i - 2 ];
        my $max = max(@output);
        $i++;
    }

    @output = uniq grep { $_ } grep { $_ <= $n } @output;
    return @output;
}
```

### TASK #2 › Lonely X

> Submitted by: Mohammad S Anwar  
> You are given m x n character matrix consists of O and X only.
>
> Write a script to count the total number of X surrounded by O only. Print 0 if none found.

Here I don't have a good way to import a matrix from command line, so I just create the two examples and run both. `:shrug:`

Otherwise, I'm doing **a lot** of iteration, because we're checking every row and column in the matrix, and then checking every neighbor, and that isn't naturally a recursion thing.

This time, we're using a named `for` loop, so we can `next` out of the right for loop. We `next` if a neighbor also has an `X`, and +1 the Lonely X count if we don't.

#### The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use List::Util qw{ first };

my @input = (
    [ [qw[ O O X ]], [qw[ X O O ]], [qw[ X O O ]], ],
    [ [qw( O O X O)], [qw( X O O O)], [qw( X O O X)], [qw( O X O O)], ]
);

for my $input (@input) {
    say join "\n    ", '', map { join ' ', $_->@* } $input->@*;
    say '';

    my $c = lonely_x($input);
    if    ( $c == 0 ) { say "No lonely Xs were found" }
    elsif ( $c == 1 ) { say "One lonely X was found" }
    else              { say "$c lonely Xs were found" }
}

# lonely_x takes an arrayref containing a two-dimensional array
# representing an m x n matrix containing only X and O, and
# returns a count of "lonely Xs", which are Xs without an
# X in a bordering position. If none are found, it returns
# zero

sub lonely_x ( $input ) {

    my $c = 0;
    my $x = scalar $input->@*;
    my $y = scalar $input->[0]->@*;

    # X and y are the outer bounds of the matrix. 
    # i and j are the location within the matrix.
    # p is the value in the current "center".
    # ii and jj are the bordering locations to i and j
    # pp is the value in the current border location

    # if pp is X, we know that i,j is not lonely,
    # and thus we used he named next to get to the 
    # next. If, instead, we get to the end of the ii,jj
    # loops, it must be lonely and we increment our 
    # "lonely X" count.

    for my $i ( 0 .. $x ) {
    OUT: for my $j ( 0 .. $y ) {
            my $p = $input->[$i][$j];
            next unless defined $p;
            my $ok = 'X' eq $p ? 1 : 0;
            next unless $ok;

            for my $ii ( $i - 1 .. $i + 1 ) {
                next if $ii < 0;
                for my $jj ( $j - 1 .. $j + 1 ) {
                    next if $jj < 0;
                    next if $i == $ii && $j == $jj;
                    my $pp = $input->[$ii][$jj];
                    next unless defined $pp;
                    next OUT if $pp eq 'X';
                }
            }
            $c++;
        }
    }

    return $c;
}
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
