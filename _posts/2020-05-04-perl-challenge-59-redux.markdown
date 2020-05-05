---
layout: post
title: "Challenge 59 - Lists and Binary XOR"
author: "Dave Jacoby"
date: "2020-05-04 18:13:45 -0400"
categories: ""
---

[This is Perl Weekly Challenge 059.](https://perlweeklychallenge.org/blog/perl-weekly-challenge-059/) I wasn't too jazzed about the tasks in 58, but this one intrigued me from first glance.

### TASK #1 › Linked List

> Reviewed by Ryan Thompson
> You are given a linked list and a value _k_. Write a script to partition the linked list such that all nodes less than _k_ come before nodes greater than or equal to _k_. Make sure you preserve the original relative order of the nodes in each of the two partitions.
>
> For example:
>
> Linked List: **1 → 4 → 3 → 2 → 5 → 2**
>
> _k_ = 3
>
> Expected Output: **1 → 2 → 2 → 4 → 3 → 5**

First, an assertion: _All behaviors we would require from a linked list are behaviors that come with Perl's arrays._ `push` and `pop` are `shift` and `unshift` come from linked list, and if the pointer to the list head is undef, that means the list is empty. (Or, of course, we lost track of our pointers.)

So, as long as we use the above methods, we can treat a standard Perl array as a linked list. I mean, I _might_ pull out my `Node` code and make a "real" linked list, but I assert that this is more covering yourself than actually useful. So...

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings qw{ experimental };

my $k     = 3;
my $input = [ 1, 4, 3, 2, 5, 2 ];

say display_ll($input);
my $output = task_1( $k, $input );
say display_ll($output);

sub task_1 ( $k, $array ) {
    my $output = [];
    my @below ;
    my @above ;
    while ( $array->@* ) {
        my $l = shift $array->@*;
        if ( $l < $k ) {
            push @below, $l;
            next;
        }
        push @above, $l;
    }
    push $output->@*, @below, @above;
    return $output;
}

sub display_ll($array) {
    return join ' -> ', $array->@*;
}

# 1 -> 4 -> 3 -> 2 -> 5 -> 2
# 1 -> 2 -> 2 -> 4 -> 3 -> 5
```

A pure linked-list version exists and has been pushed as a solution. I will likely blog on it later.

### TASK #2 › Bit Sum

> Reviewed by Ryan Thompson
>
> **Helper Function**
> For this task, you will most likely need a function _f(a,b)_ which returns the count of different bits of binary representation of _a_ and _b_.
>
> For example, f(1,3) = 1, since:
>
> Binary representation of 1 = 01
>
> Binary representation of 3 = 11
>
> There is only 1 different bit. Therefore the subroutine should return 1. Note that if one number is longer than the other in binary, the most significant bits of the smaller number are padded (i.e., they are assumed to be zeroes).
>
> **Script Output**
> You script should accept n positive numbers. Your script should sum the result of f(a,b) for every pair of numbers given:

> For example, given 2, 3, 4, the output would be **6**, since f(2,3) + f(2,4) + f(3,4) = 1 + 2 + 3 = 6

There are two cool parts of this one, the **helper function** and the **script output**, as listed above.

You can go a _long_ while in programming and not do a lot of what people assume programmers do. I've only done things with trees and graphs and a few other _real Computer Science_ things in toy/challenge code, but with the higher-level languages I routinely work in, this is rarely necessary. Largely, the need for them was abstracted away years before I got there, and I got there decades ago.

Bitwise operators are things I've known existed in Perl since close to when I started, and have I ever had need for them? I don't _think_ so? Not until now, at least.

#### And on to the Truth Tables

`&` is **bitwise and**, meaning that, if for each space, both bits are true, the result is true.

```text
    i   j   i&j
    0   0   0
    0   1   0
    1   0   0
    1   1   1
```

`|` is **bitwise or**, meaning that, if for each space, any bit is true, the result is true.

```text
    i   j   i|j
    0   0   0
    0   1   1
    1   0   1
    1   1   1
```

Finally (for this blog; there's many more, such as **NAND**), `^` is **bitwise exclusive or**, meaning that, if for each space, the bits disagree, the result is true.

```text
    i   j   i^j
    0   0   0
    0   1   1
    1   0   1
    1   1   0
```

This is _exactly_ what is needed for this problem. Well, with some help.

Such as a string representation so we work in terms of ones and zeros.

And summation and splitting might be nice.

And those I do in Perl so much more often.

```perl
# back to front:
#   $i ^ $j - XOR, which is $i or $j but not $i and $j
#   sprintf - make a string representation of a
#               binary number of the result
#   split // - turn '00001111' into [0,0,0,0,1,1,1,1]
#   sum     - add all the numbers in the array together
sub f ( $i, $j ) {
    return sum split //, sprintf '%b', $i ^ $j;
}
```

This crams a lot of power into one line, at the potential cost of readability, but gives us a count of the bitwise difference between two numbers.

(Also, worth saying, the challenge says `f(a,b)`, but because `sort` has convinced me to never use `$a` and `$b` in my code, I use `$i` and `$j`.)

(FORTRAN, I'm told, has implicit typing based on the variable name. Variables starting `'I'..'N'` were integers unless explicitly declared something else. This, not `i` meaning `index`, is why it is so common to do things like `for(i=0;i<10;i++) {...}`, although it certainly helps. This is also why **"GOD is real, unless declared integer"**)

And now we're working with the Script Output part of the problem, which specifies that not only are we going to do `1,3`, but `2,3,4` and possibly other, longer arrays, and that `2,3,4` means `[2,3],[2,4],[3,4]`.

This looks like a job for **CPAN!**.

Because, sure, I _could_ pull out and modify my permutations code, and that would be the most portable solution, but [Algorithm::Combinatorics](https://metacpan.org/pod/Algorithm::Combinatorics) exists, so why not use it?

I discovered it by reading [an article from Fedora Magazine](https://fedoramagazine.org/demonstrating-perl-with-tic-tac-toe-part-2/) about Perl that I felt [I had to review](https://jacoby.github.io/2020/04/24/tictactoe-in-perl-a-review.html), and so if it wasn't as easy as `use Algorithm::Combinatorics qw{combinations}`, I might've rolled my own, but since it's there?

So, we're returning `0` for small arrays, only getting to work with arrays of 2 or more. There's only one combination you can have with an array of 2 values, but if it saves us a special case, let's go for it.

```perl
sub f2 ( @array ) {
    return 0 if scalar @array < 2;
    my $sum = 0;
    for my $combo ( combinations( \@array, 2 ) ) {
        my $f = f( $combo->@* );
        $sum += $f;
    }
    return $sum;
}
```

The whole thing:

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings qw{ experimental };

use List::Util qw{ sum };
use Algorithm::Combinatorics 'combinations';

use JSON;
my $json = JSON->new->canonical->allow_nonref;

say f2();
say f2(1);
say f2( 1, 3 );
say f2( 2, 3, 4 );
say f2( 2, 3, 4, 5 );
say f2( 99,101 );

sub f2 ( @array ) {
    return 0 if scalar @array < 2;
    my $sum = 0;
    for my $combo ( combinations( \@array, 2 ) ) {
        my $f = f( $combo->@* );
        $sum += $f;
    }
    return $sum;
}

sub f ( $i, $j ) {
    return sum split //, sprintf '%b', $i ^ $j;
}
```

And the output:

```text
# say f2();
0

# say f2(1);
0

# say f2( 1, 3 );
1

# say f2( 2, 3, 4 );
6

# say f2( 2, 3, 4, 5 );
12

# say f2( 99,101 );
2
```

### End Note

I don't want to say more until I know more, but best of luck to some of my favorite members of the Perl family, [irishpebbles](https://twitter.com/irishpebbles) and [Ptolemarch](https://twitter.com/Ptolemarch).

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
