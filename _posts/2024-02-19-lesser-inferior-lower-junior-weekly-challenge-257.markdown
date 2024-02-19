---
layout: post
title: "Lesser, Inferior, Lower, Junior: Weekly Challenge #257"
author: "Dave Jacoby"
date: "2024-02-19 13:17:44 -0500"
categories: ""
---

Welcome to **[Weekly Challenge #257](https://theweeklychallenge.org/blog/perl-weekly-challenge-257/)!** [**257**(https://en.wikipedia.org/wiki/257_(number))] is a _prime number_, of the form **2<sup>2<sup>n</sup></sup>+1**. It is also an [irregular prime](https://en.wikipedia.org/wiki/Regular_prime#Irregular_primes) and a [Jacobsthal-Lucas number](https://en.wikipedia.org/wiki/Jacobsthal_number#Jacobsthal-Lucas_numbers).

**257** is the country code for [Burundi](https://en.wikipedia.org/wiki/Burundi), but is not currently assigned to the [North American Numbering Plan](https://en.wikipedia.org/wiki/List_of_North_American_Numbering_Plan_area_codes), but is scheduled to be assigned to British Columbia in 2025.

### Task 1: Smaller than Current

> Submitted by: Mohammad Sajid Anwar  
> You are given a array of integers, `@ints`.
>
> Write a script to find out how many integers are smaller than current i.e. `foreach ints[i], count ints[j] < ints[i] where i != j`.

#### Let's Talk About it

The key thought here is that we're dealing with _less than_, not _less then or equal to_. I added code to remove the current value from the table, but any number _i_ is not going to be less than itself, so `grep { $_ < $i }` will always pass by `$_ == $i`. Easy to handle in a loop, but I wrote a very functional solution. Nested functional, in fact.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @examples = (

    [ 5, 2, 1, 6 ],
    [ 1, 2, 0, 3 ],
    [ 0, 1 ],
    [ 9, 4, 9, 2 ],
);

for my $example (@examples) {
    my @output = smaller_than( $example->@* );
    my $input  = join ', ', $example->@*;
    my $output = join ', ', @output;

    say <<~"END";
    Input:  \@ints = ($input)
    Output: ($output)
    END
}

sub smaller_than (@ints) {
    return map {
        my $i = $_;
        scalar grep { $_ < $i } @ints;
    } @ints;
}
```

```text
$ ./ch-1.pl
Input:  @ints = (5, 2, 1, 6)
Output: (2, 1, 0, 3)

Input:  @ints = (1, 2, 0, 3)
Output: (1, 2, 0, 3)

Input:  @ints = (0, 1)
Output: (0, 1)

Input:  @ints = (9, 4, 9, 2)
Output: (2, 1, 2, 0)
```

### Task 2: Reduced Row Echelon

> Submitted by: Ali Moradi  
> Given a matrix M, check whether the matrix is in reduced row echelon form.
>
> A matrix must have the following properties to be in reduced row echelon form:
>
> 1. If a row does not consist entirely of zeros, then the first nonzero number in the row is a 1. We call this the leading 1.
> 2. If there are any rows that consist entirely of zeros, then they are grouped together at the bottom of the matrix.
> 3. In any two successive rows that do not consist entirely of zeros, the leading 1 in the lower row occurs farther to the right than the leading 1 in the higher row.
> 4. Each column that contains a leading 1 has zeros everywhere else in that column.
>
> For more information check out this [wikipedia article](https://en.wikipedia.org/wiki/Row_echelon_form).

#### Let's Talk About it

_This_ is the tough one.

Because we always want to display the matrices, I pulled `pad()` and `format_matrix()` from previous solution.

Each of the four requirements gets a new test, and if the matrix fails that test, it returns `0` for failure. At the end of the function, it returns `1`.

As usual, I use functions from [List::Util](https://metacpan.org/pod/List::Util). `max` for `pad`, of course, but also `first`. I use it here to get the first index of a row that matches the requrement, being the value equalling `1`, with `first { $matrix->[$i][$_] != 0 } 0 .. -1 + scalar @row`. I use a lot of the functional tools, like `scalar` and `grep` and `map`, but not exclusively.

1. Pull each row, removing all zeroes. If there's any values left, the first has to be a zero, which is a fail.
2. If a row only has zeroes, every row below it has to have zeros, so look forward into each row for rows without zeros. If the row, once the zeros are filtered out, has any values, that's a fail.
3. Compare each row with the row before it, finding the index for the leading 1. If the current row's leading one's index is greater or equal to the previous row's leading one's index, that's a fail.
4. This test is columnar. For each column, find if there's a `1`, then determine if it's a leading `1` by looking for non-zero values in the row it's in. if it is, set the current position into the column array for zero, check for non-zero characters, and fail if there are.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ first max };

my @examples = (

    [ [ 1, 1, 0 ], [ 0, 1, 0 ], [ 0, 0, 0 ] ],
    [
        [ 0, 1, -2, 0, 1 ],
        [ 0, 0, 0,  1, 3 ],
        [ 0, 0, 0,  0, 0 ],
        [ 0, 0, 0,  0, 0 ]
    ],
    [ [ 1, 0, 0, 4 ], [ 0, 1, 0, 7 ], [ 0, 0, 1, -1 ] ],
    [
        [ 0, 1, -2, 0, 1 ],
        [ 0, 0, 0,  0, 0 ],
        [ 0, 0, 0,  1, 3 ],
        [ 0, 0, 0,  0, 0 ]
    ],
    [ [ 0, 1, 0 ], [ 1, 0, 0 ], [ 0, 0, 0 ] ],
    [ [ 4, 0, 0, 0 ], [ 0, 1, 0, 7 ], [ 0, 0, 1, -1 ] ]
);

for my $example (@examples) {
    my $output = reduced_row_eschelon($example);
    my $input  = format_matrix($example);
    state $i = 0;
    $i++;

    say <<~"END";
    Example $i
        Input:  \$M = $input
        Output: $output
    END
}

sub reduced_row_eschelon ($matrix) {
    my @is_nonzero_row;
    for my $i ( 0 .. -1 + scalar $matrix->@* ) {
        my @row = $matrix->[$i]->@*;

        # 1. If a row does not consist entirely of zeros, then the first
        #    nonzero number in the row is a 1. We call this the leading 1.
        my @t1 = grep { $_ != 0 } @row;
        if ( scalar @t1 ) {
            return 0 unless $t1[0] == 1;
        }

        # 2. If there are any rows that consist entirely of zeros, then
        #    they are grouped together at the bottom of the matrix.
        if ( !scalar @t1 ) {
            for my $j ( $i .. -1 + scalar $matrix->@* ) {
                my $count = scalar grep { $_ ne 0 } $matrix->[$j]->@*;
                return 0 if $count;
            }
        }

        # 3. In any two successive rows that do not consist entirely of zeros,
        #    the leading 1 in the lower row occurs farther to the right than
        #    the leading 1 in the higher row.
        $is_nonzero_row[$i] = scalar @t1 ? 1 : 0;
        if ( $i > 0 && $is_nonzero_row[$i] && $is_nonzero_row[ $i - 1 ] ) {
            my $curr =
                first { $matrix->[$i][$_] != 0 } 0 .. -1 + scalar @row;
            my $prev =
                first { $matrix->[ $i - 1 ][$_] != 0 } 0 .. -1 + scalar @row;
            return 0 unless $curr > $prev;
        }
    }

    # 4. Each column that contains a leading 1 has zeros everywhere else
    #    in that column.
    for my $i ( 0 .. -1 + scalar $matrix->[0]->@* ) {

        # 1.    get the column
        my @col = map { $matrix->[$_][$i] } 0 .. -1 + scalar $matrix->@*;

        # 2.    find the 1, determine if it's a leading 1 by checking that row
        if ( grep { $_ == 1 } @col ) {

            # for each 1
            my @ones = grep { 1 == $col[$_] } 0 .. -1 + scalar @col;
            for my $j (@ones) {
                my @row     = $matrix->[$j]->@*;
                my @sub     = @row[ 0 .. $i - 1 ];
                my $leading = ( 0 == grep { $_ != 0 } @sub ) ? 1 : 0;
                if ($leading) {
                    $col[$j] = 0;
                    my $zero_count = scalar grep { $_ ne 0 } @col;
                    return 0 if $zero_count;
                }
            }
        }
    }

    # say format_matrix($matrix);
    return 1;
}

sub format_matrix ($matrix) {
    my $maxlen = max map { length $_ } map { $_->@* } $matrix->@*;
    my $output = join "\n                  ", '[', (
        map { qq{  [$_],} } map {
            join ',',
                map { pad( $_, 1 + $maxlen ) }
                $_->@*
        } map { $matrix->[$_] } 0 .. -1 + scalar $matrix->@*
        ),
        ']';
    return $output;
}

sub pad ( $str, $len = 4 ) { return sprintf "%${len}s", $str; }
```

```text
$ ./ch-2.pl
Example 1
    Input:  $M = [
                    [ 1, 1, 0],
                    [ 0, 1, 0],
                    [ 0, 0, 0],
                  ]
    Output: 0

Example 2
    Input:  $M = [
                    [  0,  1, -2,  0,  1],
                    [  0,  0,  0,  1,  3],
                    [  0,  0,  0,  0,  0],
                    [  0,  0,  0,  0,  0],
                  ]
    Output: 1

Example 3
    Input:  $M = [
                    [  1,  0,  0,  4],
                    [  0,  1,  0,  7],
                    [  0,  0,  1, -1],
                  ]
    Output: 1

Example 4
    Input:  $M = [
                    [  0,  1, -2,  0,  1],
                    [  0,  0,  0,  0,  0],
                    [  0,  0,  0,  1,  3],
                    [  0,  0,  0,  0,  0],
                  ]
    Output: 0

Example 5
    Input:  $M = [
                    [ 0, 1, 0],
                    [ 1, 0, 0],
                    [ 0, 0, 0],
                  ]
    Output: 0

Example 6
    Input:  $M = [
                    [  4,  0,  0,  0],
                    [  0,  1,  0,  7],
                    [  0,  0,  1, -1],
                  ]
    Output: 0
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
