---
layout: post
title: "I Never Go Far Without A Little Big Star: Weekly Challenge #337"
author: "Dave Jacoby"
date: "2025-09-04 21:16:13 -0400"
categories: ""
---

Here we are at [**_Weekly Challenge #337!_**](https://theweeklychallenge.org/blog/perl-weekly-challenge-337/)

Today's title comes from 80s, with **the Replacements** and **Paul Westerberg** singing about their favorite, **Alex Chilton**, who fronted the Box Tops in the 60s, with "The Letter", before forming a band that defined Power Pop in the 1970s. If you have ever watched _That 70s Show_, you've heard Cheap Trick covering "In The Street" by, you guessed it, **Big Star**. I have their three albums (_#1 Record_, _Radio City_ and _Third/Sister Lovers_) ripped and on a thumb drive next to my car keys, so I, too, never go far without a little Big Star.

### Task 1: Smaller Than Current

> Submitted by: Mohammad Sajid Anwar  
> You are given an array of numbers, `@num1`.
>
> Write a script to return an array, `@num2`, where `$num2[i]` is the count of all numbers less than or equal to `$num1[i]`.

#### Let's Talk About It

`grep` is powerful. I love `grep`.

Here, for every index within `@num1`, I use it to copy the value of `$num1[$index]` and create a copy of `@num1` with that position removed. From there, I use `grep` to find the instances within the copy which satisfy the requirements, and `scalar` to count them.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

my @examples = (

    [  6, 5, 4, 8 ],
    [  7, 7, 7, 7 ],
    [  5, 4, 3,  2, 1 ],
    [ -1, 0, 3, -2, 1 ],
    [  0, 1, 1,  2, 0 ],

);

for my $in (@examples) {
    my @input  = $in->@*;
    my $input  = join ', ', @input;
    my @output = smaller_than_current(@input);
    my $output = join ', ', @output;
    say <<"END";
        Input:  \@num1 = ($input)
        Output: ($output)
END

}

sub smaller_than_current (@num1) {
    my @num2;
    for my $i ( 0 .. $#num1 ) {
        my $n    = $num1[$i];
        my @copy = @num1;
        delete $copy[$i];
        @copy = grep { defined } @copy;
        push @num2, scalar grep { $n >= $_ } @copy;
    }
    return @num2;
}
```

```text
$ ./ch-1.pl
        Input:  @num1 = (6, 5, 4, 8)
        Output: (2, 1, 0, 3)

        Input:  @num1 = (7, 7, 7, 7)
        Output: (3, 3, 3, 3)

        Input:  @num1 = (5, 4, 3, 2, 1)
        Output: (4, 3, 2, 1, 0)

        Input:  @num1 = (-1, 0, 3, -2, 1)
        Output: (1, 2, 4, 0, 3)

        Input:  @num1 = (0, 1, 1, 2, 0)
        Output: (1, 3, 3, 4, 1)
```

### Task 2: Odd Matrix

> Submitted by: Mohammad Sajid Anwar  
> You are given `row` and `col`, also a list of positions in the matrix.
>
> Write a script to perform action on each location (0-indexed) as provided in the list and find out the total odd valued cells.
>
> For each location `(r, c)`, do both of the following:
>
> a) Increment by 1 all the cells on row `r`.  
> b) Increment by 1 all the cells on column `c`.

#### Let's Talk About It

I also never go far without `display_matrix`, and I pulled it from my answer to a previous challenge. I use it to look inside the matrix while testing.

Given a 3x4 matrix, we start with:

```text
    0 0 0
    0 0 0
    0 0 0
    0 0 0
```

With a pair `[1,2]`, we would first take the row 1, and go through every column, incrementing the value, until we get this:

```text
    0 0 0
    1 1 1
    0 0 0
    0 0 0
```

This is followed by column 2, which gets us:

```text
    0 0 1
    1 1 2
    0 0 1
    0 0 1
```

The thing to remember is that we can flatten to this:

```text
    0 0 1 1 1 2 0 0 1 0 0 1
```

From there, we use `grep`, which I love, and modulus (or `%`) to remove the even-valued entries:

```text
    1 1 1 1 1
```

And from there, we use `scalar` to give 5.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

my @examples = (

    { row => 2, col => 3, locations => [ [ 0, 1 ], [ 1, 1 ] ] },
    { row => 2, col => 2, locations => [ [ 1, 1 ], [ 0, 0 ] ] },
    { row => 3, col => 3, locations => [ [ 0, 0 ], [ 1, 2 ], [ 2, 1 ] ] },
    { row => 1, col => 5, locations => [ [ 0, 2 ], [ 0, 4 ] ] },
    {
        row       => 4,
        col       => 2,
        locations => [ [ 1, 0 ], [ 3, 1 ], [ 2, 0 ], [ 0, 1 ] ]
    },
);

for my $input (@examples) {
    my $row  = $input->{row};
    my $col  = $input->{col};
    my $locs = join ',', map { qq{[$_]} }
        map { join ',', $_->@* } $input->{locations}->@*;
    my $output = odd_matrix($input);
    say <<"END";
        Input:  \$row = $row,
                \$col = $col,
                \@locations = ($locs)
        Output: $output
END
}

sub odd_matrix($input) {
    my $row = $input->{row};
    my $col = $input->{col};
    my @matrix;
    for my $r ( 0 .. -1 + $row ) {
        for my $c ( 0 .. -1 + $col ) {
            $matrix[$r][$c] = 0;
        }
    }
    my @locations = $input->{locations}->@*;
    for my $loc (@locations) {
        my ( $x, $y ) = $loc->@*;
        for my $c ( 0 .. -1 + $col ) {    # rows
            $matrix[$x][$c]++;
        }

        for my $r ( 0 .. -1 + $row ) {    # columns
            $matrix[$r][$y]++;
        }
    }
    # display_matrix( \@matrix );
    return scalar grep { ( $_ % 2 ) } map { $_->@* } @matrix;
}

sub display_matrix ($matrix) {
    say join "\n", '', map { join ' ', "\t", '[', $_->@*, ']' } $matrix->@*;
}
```

```text
$ ./ch-2.pl
        Input:  $row = 2,
                $col = 3,
                @locations = ([0,1],[1,1])
        Output: 6

        Input:  $row = 2,
                $col = 2,
                @locations = ([1,1],[0,0])
        Output: 0

        Input:  $row = 3,
                $col = 3,
                @locations = ([0,0],[1,2],[2,1])
        Output: 0

        Input:  $row = 1,
                $col = 5,
                @locations = ([0,2],[0,4])
        Output: 2

        Input:  $row = 4,
                $col = 2,
                @locations = ([1,0],[3,1],[2,0],[0,1])
        Output: 8

```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
