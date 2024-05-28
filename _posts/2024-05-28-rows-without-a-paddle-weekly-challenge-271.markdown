---
layout: post
title: "Rows Without A Paddle: Weekly Challenge #271"
author: "Dave Jacoby"
date: "2024-05-28 17:24:18 -0400"
categories: ""
---

This is **[Weekly Challenge #267!](https://theweeklychallenge.org/blog/perl-weekly-challenge-271/)**

As I learned last week, **[271](https://en.wikipedia.org/wiki/271_(number))** is one of a set of **twin primes**, along with **269**, which wrap **270**. It is similarly wrapped by two numbers(**270, 272**), that are divisible by cubes, and is the smallest number like that.

### Task 1: Maximum Ones

> Submitted by: Mohammad Sajid Anwar  
> You are given a `m x n` binary matrix.
>
> Write a script to return the row number containing maximum ones, in case of more than one rows then return smallest row number.

#### Let's Talk About This

There's not much to talk about, I don't think. Treat every row as an array, then `scalar grep { $_ == 1 }` for each row. Put that value in an array. 

Once it's all in the array, use `max` from `List::Util` to find the top value, then `grep { $rows[$_] == $max }` for all the rows stored to get the row. That `grep` gives an array, so assign to `($i)` to get the first value within.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ bitwise fc postderef say signatures state };

use List::Util qw{max};

my @examples = (

    [ [ 0, 1 ], [ 1, 0 ], ],
    [ [ 0, 0, 0 ], [ 1, 0, 1 ], ],
    [ [ 0, 0 ], [ 1, 1 ], [ 0, 0 ], ],
);
for my $example (@examples) {
    use JSON;
    my $j      = JSON->new->pretty->canonical;
    my $output = maximum_ones($example);
    my $input  = display_matrix($example);
    say <<"END";
    Input:  \$matrix = 
        [ $input ]
    Output: $output
END
}

sub maximum_ones ($matrix) {
    my @rows = (0);
    for my $r ( 1 .. scalar @$matrix ) {
        $rows[$r] = scalar grep { $_ == 1 } $matrix->[ $r - 1 ]->@*;
    }
    my $max = max @rows;
    my ($i) = grep { $rows[$_] == $max } 0 .. -1 + scalar @rows;
    return $i;
}

sub display_matrix ($matrix) {
    return join ",\n          ",
        map { join ' ', '[', ( join ', ', $_->@* ), ']' } $matrix->@*;
}
```

```txt
PS C:\Users\jacob\271> .\ch-1.pl
    Input:  $matrix = 
        [ [ 0, 1 ],
          [ 1, 0 ] ]
    Output: 1

    Input:  $matrix = 
        [ [ 0, 0, 0 ],
          [ 1, 0, 1 ] ]
    Output: 2

    Input:  $matrix = 
        [ [ 0, 0 ],
          [ 1, 1 ],
          [ 0, 0 ] ]
    Output: 2
```

### Task 2: Sort by 1 bits

> Submitted by: Mohammad Sajid Anwar  
> You are give an array of integers, @ints.
>
> Write a script to sort the integers in ascending order by the number of 1 bits in their binary representation. In case more than one integers have the same number of 1 bits then sort them in ascending order.

#### Let's Talk About This

Normally I make a function to do the whole test, but instead, I make two functions that are meant to work with `sort`.

Even when you're making blocks for the sort, you're dealing with 2 inputs (`$a` and `$b`) and three outputs: when `$a` comes first, return `1`. when `$b` comes first, return `-1`. When they're equal, return `0`.

I wrote `numeric`, which is basically `{$a <=> $b}`, simply because writing `sort numeric @input` is easier typing, and because you have to remember to use numeric sort for the case where more than one integer has the same number of 1 bits.

The longer function, `sb1`, does the work of converting to binary. I use `sum0` from `List::Util` to count the `1`s. I wanted to print the specific comparisons to be sure I was getting it right, but that could easily be rewritten to be, well, more unreadable.

I could see writing a bunch of sort functions, based on first value, max value, min value, array size and the like, and putting it on CPAN. I should check MetaCPAN to see if anyone already has.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ fc say postderef signatures state };

use List::Util qw{ sum0 };

my @examples = (

    [ 0,    1,   2,   3,   4, 5, 6, 7, 8 ],
    [ 1024, 512, 256, 128, 64 ],
);

for my $example (@examples) {
    my @output = sort sb1 sort numeric $example->@*;
    my $input  = join ', ', $example->@*;
    my $output = join ', ', @output;

    say <<"END";
        Input:  \@ints = ($input)
        Output: $output
END
}

sub numeric {
    return $a <=> $b ;
}

sub sb1 {
    my $A  = sprintf '%b', $a;
    my $B  = sprintf '%b', $b;
    my $da = sum0 split //, $A;
    my $db = sum0 split //, $B;
    return -1 if $da < $db;
    return 1  if $da > $db;
    return 0;
}
```

```txt
PS C:\Users\jacob\271> .\ch-2.pl
        Input:  @ints = (0, 1, 2, 3, 4, 5, 6, 7, 8)
        Output: 0, 1, 2, 4, 8, 3, 5, 6, 7

        Input:  @ints = (1024, 512, 256, 128, 64)
        Output: 64, 128, 256, 512, 1024
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
