---
layout: post
title: "Reconsidering Sudoku: Beyond Brute Force"
author: "Dave Jacoby"
date: "2020-11-18 13:42:30 -0500"
categories: ""
---

My previous Sudoku code was, more or less:

- find an empty space
- put in `1` and test
- if `1` doesn't work, try `2`, etc, until something does work
- go onto the next empty space
- backtrack if there's a problem

This is not particularly clever. It is also not how I solve Sudoku puzzles. I look for empty spaces where there can only be one solution, fill that in, and start over again.

And today, I decided to write up something closer. I mean, a week late for the Challenge, but sure.

```perl
# This code uses List::Compare to make the comparisons easy
# but it isn't in Core, so this is likely not the preferred
# solution
sub clever( $puzzle ) {
    my @list  = 1 .. 9;
    my $count = 0;
OUTER: while (1) { # naming the loop so I can "next" to it
        for my $x ( 0 .. 8 ) {
            for my $y ( 0 .. 8 ) {

                # this merely does "next" on the inner loop
                next unless $puzzle->[$x][$y] eq '_';

                # here we get the values of the current
                # row, column and block, which determine which
                # values cannot be used
                my @row = get_row( $puzzle, $x, $y );
                my @col = get_column( $puzzle, $x, $y );
                my @blo = get_block( $puzzle, $x, $y );

                # cant is the list of every number that cannot
                # be entered
                my @cant = uniq sort @row, @col, @blo;

                # I use List::Compare to compare to easily
                # find the only values that can be entered
                my $lc = List::Compare->new( \@list, \@cant );
                my @can = $lc->get_unique;

                # we only move if there's only one answer
                if ( scalar @can == 1 ) {
                    # say join ' ', $x, $y, '=', @can;
                    $puzzle->[$x][$y] = $can[0];
                    next OUTER;
                }
            }
        }
        $count++;
        last if $count > 10;
    }
    display_puzzle( $puzzle->@* );
}
```

[List::Compare](https://metacpan.org/pod/List::Compare) is your friend. Consider two arrays; `1,2,3` and `3,4,5`.

You might want to know the values that are only in the first array. That's `get_unique` and that's `1,2`.

You might want to know all values that are in both arrays. That's `get_intersection` and that's `3`.

The `unique` values, those that only occur in `$list->@*`, are the ones we want, and we really want cases where there's only one value in `$list->@*`. When there's one answer, it's _the_ answer, it get inserted and we start over again, which we can do because of _named loops_, where we specify which `for` or `while` loop we want to escape. **`nest` statements ask for them by name!**

I will point out that, as stands, this will infinite loop when there is not one unique solution. The brute force solution from the previous challenge will not infinite loop, but I have a few sample puzzles where it will fail.

A funny thing is that a previous Sudoku solver I wrote years ago is fine with the problem puzzles.

### Next Steps

I use List::Compare to get _can_, but there's a parallel concept of _must_. If one field _can_ be `1,2,3` but the other fields in the block _cannot_ be `2,3`, then that field _must_ be `1`. Our brains parallelize, so it's easy to go through all the variations, but telling a computer to do so is far more complex, and I think would be the next step in my _clever_ code.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
