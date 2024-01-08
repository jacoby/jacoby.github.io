---
layout: post
title:  "Do You Feel Lucky?: Weekly Challenge #251"
author: "Dave Jacoby"
date:   "2024-01-08 10:36:48 -0500"
categories: ""
---

Welcome to **[Weekly Challenge #251](https://theweeklychallenge.org/blog/perl-weekly-challenge-251/)**

**[251](https://en.wikipedia.org/wiki/251_(number))** is a *prime number*, and it is specifically a [Sophie Germain prime](https://en.wikipedia.org/wiki/Sophie_Germain_prime), which means that **251 * 2 + 1** (503) is also prime. That makes 503 is a *safe prime*.

**251** is also [the area code for Mobile, Alabama](https://en.wikipedia.org/wiki/Area_code_251) and surrounding areas. It was created in 2001 to handle the increased demand for numbers created by fax machines, pagers, modems and, of course, cell phones, so we can say 251 is a new area code because of Mobile mobile phones.

### Task 1: Concatenation Value

Submitted by: Mohammad S Anwar
> You are given an array of integers, `@ints`.  
>
> Write a script to find the concatenation value of the given array.  
>
> The concatenation of two numbers is the number formed by concatenating their numerals.  
>
> For example, the concatenation of `10, 21` is `1021`. The concatenation value of `@ints` is initially equal to `0`. Perform this operation until `@ints` becomes empty:  
>
> If there exists more than one number in `@ints`, pick the first element and last element in `@ints` respectively and add the value of their concatenation to the concatenation value of `@ints`, then delete the first and last element from `@ints`.  
>
> If one element exists, add its value to the concatenation value of `@ints`, then delete it.  

#### Let's Talk About It

This is a destructive move, so a `while` loop where we're looking at the arrays size works. (*"This looks like a Job for ... **Iteration?**"*) There are two cases:

* **One value in the array:** remove that value from the array and add it to the sum
* **More than one value in the array:** remove the first and last values from the array and add them to the sum

I, being me, chose [List::Util](https://metacpan.org/pod/List::Util)'s `sum0`, but otherwise, this `pop`, `shift` and `push`. The alternative (better?) way would've been to use `+=`, but I have written what I have written.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ sum0 };

my @examples = (

    [ 6,  12, 25, 1 ],
    [ 10, 7,  31, 5, 2, 2 ],
    [ 1,  2,  10 ],
);

for my $example (@examples) {
    my $input  = join ', ', $example->@*;
    my $output = kinda_concatenation( $example->@* );

    say <<~"END";
    Input:  \$ints = ($input)
    Output: $output
    END
}

sub kinda_concatenation (@input) {
    my @output;
    while (@input) {
        if ( scalar @input == 1 ) {
            push @output, shift @input;
        }
        else {
            my $concat = join '', shift @input,  pop @input;
            push @output, $concat;
        }
    }
    return sum0 @output;
}
```

```text
$ ./ch-1.pl 
Input:  $ints = (6, 12, 25, 1)
Output: 1286

Input:  $ints = (10, 7, 31, 5, 2, 2)
Output: 489

Input:  $ints = (1, 2, 10)
Output: 112
```

### Task 2: Lucky Numbers

Submitted by: Mohammad S Anwar
You are given a `m x n` matrix of distinct numbers.

Write a script to return the lucky number, if there is one, or -1 if not.

A **lucky number** is an element of the matrix such that it is the minimum element in its row and maximum in its column.

#### Let's Talk About It

We have to take a matrix and pull out rows and columns. I use `min` and `max` from [List::Util](https://metacpan.org/pod/List::Util) because, hello! I'm Dave!

We go through every element, iterating on row and column within the row. Finding every value within a row is simple — `@row = $matrix->[$row_index]->@*`, in the `postderef` syntax — but we need to get functional to get the column. Or, we could do a `for` loop, but what's the fun in that? `@column = map { $matrix->[$_][$column_index] } 0 .. -1 + scalar $matrix->@*` does it.

And then, `$value` should equal `min @row` and `max @column`. Again, a numerical sort and taking off the highest or lowest, depending, would work but List::Util is in Core! You have it! Use it!

And, because we're going through each value of the matrix, this is again *iteration.* If I don't do recursion, am I still Dave?

Don't answer that.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ min max };
use JSON;
my $j = JSON->new->pretty;

my @examples = (

    [ 
        [ 3, 7,  8 ], 
        [ 9, 11, 13 ], 
        [ 15, 16, 17 ] 
    ],
    [ 
        [ 1, 10, 4, 2 ],
        [ 9,  3,  8,  7 ],
        [ 15, 16, 17, 12 ] 
    ],
    [   
        [ 7, 8 ],
        [ 1, 2 ] 
    ],
);
for my $e (@examples) {
    my $input  = format_matrix($e);
    my $output = lucky_numbers($e);

    say <<~"END";
    Input:  \$matrix = $input
    Output: $output
    END
}

sub lucky_numbers ($matrix) {
    for my $i ( 0 .. -1 + scalar $matrix->@* ) {
        for my $j ( 0 .. -1 + scalar $matrix->[$i]->@* ) {
            my $value = $matrix->[$i][$j];
            my @row   = $matrix->[$i]->@*;
            my @col = map { $matrix->[$_][$j] } 0 .. -1 + scalar $matrix->@*;
            return $value if ( $value == min @row ) && ( $value == max @col );
        }
    }
    return -1;    #no luck
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
Input:  $matrix = [
                    [  3,  7,  8],
                    [  9, 11, 13],
                    [ 15, 16, 17],
                  ]
Output: 15

Input:  $matrix = [
                    [  1, 10,  4,  2],
                    [  9,  3,  8,  7],
                    [ 15, 16, 17, 12],
                  ]
Output: 12

Input:  $matrix = [
                    [ 7, 8],
                    [ 1, 2],
                  ]
Output: 7
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
