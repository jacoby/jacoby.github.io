---
layout: post
title:  "Like The Deserts Miss The Rain: Weekly Challenge #242"
author: "Dave Jacoby"
date:   "2023-11-07 13:32:03 -0500"
categories: ""
---

Here we go with [Weekly Challenge #242!](https://theweeklychallenge.org/blog/perl-weekly-challenge-242/) **242** is a product of a prime (**2**) and the square of a prime (**11<sup>2</sup>** == **121**). It is also the Country Code (**+242**) for the Congo, and the Area Code for the Bahamas.

It is also part of the name of one of my favorite Industrial bands, **Front 242**.

### Task 1: Missing Members
>
> Submitted by: Mohammad S Anwar  
> You are given two arrays of integers.  
>
> Write a script to find out the missing members in each other arrays.  

#### Let's Talk About It

From the first I saw this, I knew how I'd solve it, because there's a module that does exactly this: [List::Compare](https://metacpan.org/pod/List::Compare). It's a very useful non-Core module that does a lot of useful work with lists:

* **Intersection:** The unique values that show up in both lists
* **Union:** The values that show up in either list
* **Unique:** The values that only show up in the first list
* **Complement:** The values that only show in the second list
* **Symmetric Difference:** The values that show up in either list, but not both lists

I believe I discovered and started using this module in a Twitter context, where I wanted to compare the list of *friends* (people I followed) and the list of *followers* (people I followed), based on user IDs. I've found it useful in other contexts and always like to tell people about it.

If I was trying to solve this in a non-module way, it would likely be like this:

```perl
my %first  = map { $_ => 1 } @first;
my %second = map { $_ => 1 } @second;

my @first_only  = grep { !$second[$_] } @first;
my @second_only = grep { !$first[$_] }  @second;
```

But [JKEENAN](https://metacpan.org/author/JKEENAN) has already solved this issue for me.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Compare;

my @examples = (

    [ [ 1, 2, 3 ],    [ 2, 4, 6 ], ],
    [ [ 1, 2, 3, 3 ], [ 1, 1, 2, 2 ], ],

);
for my $e (@examples) {
    my @output = missing_members( $e->@* );
    my $arr1   = join ', ', $e->[0]->@*;
    my $arr2   = join ', ', $e->[1]->@*;
    my $output = join ', ',
        map { qq{[$_]} } map { join ', ', $_->@* } @output;
    say <<~"END";
    Input:  \@arr1 = ($arr1)
            \@arr2 = ($arr2)
    Output: ($output)
    END
}

sub missing_members (@input) {
    my $lc     = List::Compare->new(@input);
    my @first  = $lc->get_unique;
    my @last   = $lc->get_complement;
    my @output = grep { scalar $_->@* } ( \@first, \@last );
    return @output;
}
```

```text
$ ./ch-1.pl 
Input:  @arr1 = (1, 2, 3)
        @arr2 = (2, 4, 6)
Output: ([1, 3], [4, 6])

Input:  @arr1 = (1, 2, 3, 3)
        @arr2 = (1, 1, 2, 2)
Output: ([3])
```

### Task 2: Flip Matrix
>
> Submitted by: Mohammad S Anwar
> You are given n x n binary matrix.
>
> Write a script to flip the given matrix as below.
>
> ``` text
> 1 1 0
> 0 1 1
> 0 0 1
> ```
>
> a) Reverse each row
>
> ``` text
> 0 1 1
> 1 1 0
> 1 0 0
> ```
>
> b) Invert each member
>
> ``` text
> 1 0 0
> 0 0 1
> 0 1 1
> ```

#### Let's Talk About It

We're dealing with binary numbers, and the easiest bit-flip (or *invert each member*) I know is `($n + 1) % 2`. Each row is an array ref, so `reverse` is built in.

(Aside: there is an order-of-operation issue, so that `$n + 1 % 2` will be interpreted as `$n + (1 % 2)`, so the perens in `($n + 1) % 2` are required.)

A thing I try to do, both in my own code and in the these challenge pieces, is write it so it's reasonably easy to read it later, and while I'm sure I could do it in a fully functional way, I decided that using a `for` loop would be more readable and more easily writable.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @examples = (

    [ [ 1, 1, 0 ], [ 1, 0, 1 ], [ 0, 0, 0 ] ],
    [ [ 1, 1, 0, 0 ], [ 1, 0, 0, 1 ], [ 0, 1, 1, 1 ], [ 1, 0, 1, 0 ] ],
);

for my $e (@examples) {
    my @output = flip_matrix($e);
    my $input  = join ', ', 
        map { qq{[$_]} } 
        map { join ', ', $_->@* } 
        $e->@*;
    my $output = join ', ',
        map { qq{[$_]} } 
        map { join ', ', $_->@* } 
        @output;
    say <<~"END";
    Input:  \@matrix = ($input)
    Output:           ($output)
    END
}

sub flip_matrix ($matrix) {
    my $new_matrix;
    for my $row ( 0 .. -1 + scalar $matrix->@* ) {
        $new_matrix->[$row]->@* =
            map { ( $_ + 1 ) % 2 } reverse $matrix->[$row]->@*;
    }
    # display_matrix($matrix);
    # display_matrix($new_matrix);
    return $new_matrix->@*;
}

sub display_matrix ($matrix) {
    say join "\n", '', map { join ' ', $_->@* } $matrix->@*;
}
```

```text
$ ./ch-2.pl 
Input:  @matrix = ([1, 1, 0], [1, 0, 1], [0, 0, 0])
Output:           ([1, 0, 0], [0, 1, 0], [1, 1, 1])

Input:  @matrix = ([1, 1, 0, 0], [1, 0, 0, 1], [0, 1, 1, 1], [1, 0, 1, 0])
Output:           ([1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 1], [1, 0, 1, 0])
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
