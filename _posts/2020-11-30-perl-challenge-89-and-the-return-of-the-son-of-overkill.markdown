---
layout: post
title: "Perl Challenge 89 and the Return of the Son of Overkill"
author: "Dave Jacoby"
date: "2020-11-30 15:36:06 -0500"
categories: ""
---

Doing Example #2 of [Perl Weekly Challenge #89](https://perlweeklychallenge.org/blog/perl-weekly-challenge-089/), I see:

### TASK #2 › Magical Matrix

> Submitted by: Mohammad S Anwar  
> Write a script to display matrix as below with numbers `1 - 9`. Please make sure numbers are used once.
>
> |     |     |     |
> | --- | --- | --- |
> | a   | b   | c   |
> | d   | e   | f   |
> | g   | h   | i   |
>
> So that it satisfies the following:
>
> `a + b + c = 15`  
> `d + e + f = 15`  
> `g + h + i = 15`  
> `a + d + g = 15`  
> `b + e + h = 15`  
> `c + f + i = 15`  
> `a + e + i = 15`  
> `c + e + g = 15`

![I Know This!](https://jacoby.github.io/images/i_know_this.jpg)

With the exception of the numbers allowed, this is the **"Magic Box"** from my son's middle school math homework, which I solved before, both using logic and then by using the brute-force power of programming, in [my "Overkill" posts](https://varlogrant.blogspot.com/search?q=Overkill).

So, we have the numbers between **1** and **9**. The center of which is **5**, so we'll make the box and put 5 in the center.

|     |     |     |
| --- | --- | --- |
| .   | .   | .   |
| .   | 5   | .   |
| .   | .   | .   |

We have to have two numbers such that the sum of them and 5 is 15, so the easiest are **1** and **9**. We'll put them top and bottom.

|     |     |     |
| --- | --- | --- |
| .   | 1   | .   |
| .   | 5   | .   |
| .   | 9   | .   |

15 - 9 = **6**, and 1 and 5 are taken, so **2** and **4**.

|     |     |     |
| --- | --- | --- |
| .   | 1   | .   |
| .   | 5   | .   |
| 2   | 9   | 4   |

The next to handle is 1 15 - 1 = 14, and the highest available numbers that give us this are **6** and **8**. We have to think about order now, as we have a partially filled box. 4 + 6 = 10, and 5 is taken. 8 + 2 = 10, and see previous sentence. They can fill the diagonal, so there's only one choice.

|     |     |     |
| --- | --- | --- |
| 6   | 1   | 8   |
| .   | 5   | .   |
| 2   | 9   | 4   |

This leaves **3** and **7**, and their positions are obvious. There can only be one choice.

|     |     |     |
| --- | --- | --- |
| 6   | 1   | 8   |
| 7   | 5   | 3   |
| 2   | 9   | 4   |

Of course, we must remember that we can flip both the horizontal and vertical, even spin it, and still get a valid square.

|     |     |     |
| --- | --- | --- |
| 8   | 3   | 4   |
| 1   | 5   | 9   |
| 6   | 7   | 2   |

#### Now What?

We've solved it with just brain power. Well, I didn't have scratch paper so I used Google Sheets when I did it first. But now let us unleash the awesome power of programming to do in seconds (minus developer time) what took me minutes to work out in my head.

The setup for the old version of this is as follows:

```perl
my $numbers = [ 1 .. 9 ];
my $array;

recurse_magic_box( $numbers, $array );
```

Which is simple. `$numbers` is an arrayref holding the number available, and `$array` is an arrayref that holds a flattened hash, so instead of

```perl
[
    [ 6 , 1 , 8 ],
    [ 7 , 5 , 3 ],
    [ 2 , 9 , 4 ],
]
```

we have

```perl
    [ 6, 1, 8, 7, 5, 3, 2, 9, 4 ]
```

And we just know that `$array->[8]` would be `$array->[2][2]` if this was a multidimensional array. Also key is that, if there's no value, that spot in the array is empty.

So, a no-muss interface. What goes on inside?

```perl
sub recurse_magic_box ( $numbers, $array ) {

    for my $n (@$numbers) {
        push @$array, $n;
        if ( check_magic_box($array) ) {
            recurse_magic_box( $numbers, $array );
        }
        pop @$array;
    }
}
```

For each number left, we add it to the array, check it, and if it passes, we go on. So, if all this is so easy, the `check_magic_box` code must be the hairiest.

```perl
sub check_magic_box ( $array ) {
    for my $n (@$array) {
        my $c = scalar grep { m{$n} } @$array;
        return 0 if $c > 1;
    }

    if ( scalar @$array == 9 ) {
        my $sum    = 15;
        my $checks = [
            [ 0, 1, 2 ],    # first row
            [ 3, 4, 5 ],    # second row
            [ 6, 7, 8 ],    # third row
            [ 0, 3, 6 ],    # first col
            [ 1, 4, 7 ],    # second col
            [ 2, 5, 8 ],    # third col
            [ 0, 4, 8 ],    # diagonal from top right
            [ 6, 4, 2 ],    # diagonal from bottom right
        ];
        for my $check (@$checks) {
            my $s = 0;
            for my $p (@$check) {
                $s += $array->[$p];
            }
            return 0 if $s != $sum;
        }
        say "\t" . join ' ', @$array[ 0 .. 2 ];
        say "\t" . join ' ', @$array[ 3 .. 5 ];
        say "\t" . join ' ', @$array[ 6 .. 8 ];
        say '';
    }
    return 1;
}
```

This is readable. The top part checks for duplicates. If we're only coming from a set of numbers, that should be impossible, but Bronschweig taught me to always have a plan for the impossible scenario.

Then we have an array that holds indexes for every row, column and diagonal we want to check, and since it's always the same check (and I didn't use `sum` from List::Util when I wrote this), we loop through it and `return 0` on fail.

#### The Whole Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

my $numbers = [ 1 .. 9 ];
my $array;

recurse_magic_box( $numbers, $array );

sub recurse_magic_box ( $numbers, $array ) {

    # numbers is the list of allowable numbers
    for my $n (@$numbers) {
        push @$array, $n;
        if ( check_magic_box($array) ) {
            recurse_magic_box( $numbers, $array );
        }
        pop @$array;
    }
}

sub check_magic_box ( $array ) {
    for my $n (@$array) {
        my $c = scalar grep { m{$n} } @$array;
        return 0 if $c > 1;
    }

    if ( scalar @$array == 9 ) {
        my $sum    = 15;
        my $checks = [
            [ 0, 1, 2 ],    # first row
            [ 3, 4, 5 ],    # second row
            [ 6, 7, 8 ],    # third row
            [ 0, 3, 6 ],    # first col
            [ 1, 4, 7 ],    # second col
            [ 2, 5, 8 ],    # third col
            [ 0, 4, 8 ],    # diagonal from top right
            [ 6, 4, 2 ],    # diagonal from bottom right
        ];
        for my $check (@$checks) {
            my $s = 0;
            for my $p (@$check) {
                $s += $array->[$p];
            }
            return 0 if $s != $sum;
        }
        say "\t" . join ' ', @$array[ 0 .. 2 ];
        say "\t" . join ' ', @$array[ 3 .. 5 ];
        say "\t" . join ' ', @$array[ 6 .. 8 ];
        say '';
    }
    return 1;
}
```

```text
        2 7 6
        9 5 1
        4 3 8

        2 9 4
        7 5 3
        6 1 8

        4 3 8
        9 5 1
        2 7 6

        4 9 2
        3 5 7
        8 1 6

        6 1 8
        7 5 3
        2 9 4

        6 7 2
        1 5 9
        8 3 4

        8 1 6
        3 5 7
        4 9 2

        8 3 4
        1 5 9
        6 7 2
```

[I have ported this solution to C, Go, Python, Node, Ruby and what was then Perl6 but we now call Raku](https://varlogrant.blogspot.com/2015/10/overkill-ii-quickening.html), and there's [another implementation where I use `permute` to try to add speed to my Raku code](https://varlogrant.blogspot.com/2016/08/overkill-iii-permutations-of-overkill.html). Also, [once in Rust](https://jacoby.github.io/2020/03/10/overkill-vi-the-rust-and-the-overkill.html).

### TASK #1 › GCD Sum

> Submitted by: Mohammad S Anwar  
> You are given a positive integer `$N`.
>
> Write a script to sum GCD of all possible unique pairs between 1 and `$N`.

So, greatest common denominator? So we need every denominator.

```perl
sub get_divisors ( $n ) {
    my @div;
    for my $i ( 1 .. $n ) { push @div, $i if $n % $i == 0; }
    return @div;
}
````

So, for **4**, we get `1, 2, 4`, and for **2**, we would get `1, 2`. So, first we want the values from both, which we get from [List::Compare](https://metacpan.org/pod/List::Compare)'s `get_intersection`, and we want the maximum value, which where [https://metacpan.org/pod/List::Util](https://metacpan.org/pod/List::Util)'s `max` function is convenient.

```perl
sub gcd( $n ) {
    my $output = 0;
    for my $i ( 1 .. $n - 1 ) {
        my $di->@* = get_divisors($i);
        for my $j ( $i + 1 .. $n ) {
            my $dj->@* = get_divisors($j);
            my $dc     = List::Compare->new( $di, $dj );
            my @d      = $dc->get_intersection;
            my $g      = max @d;
            $output += $g;
        }
    }
    return $output;
}
```

We don't want to get a case where `i` and `j` are the same, so there's 1 between where we start and where we end. Otherwise, it's fairly set: we get the divisors for both, find the intersection, grab the max value, then add it to output. I could add [Memoize](https://metacpan.org/pod/Memoize) or cache it myself, so that we don't have to get the same divisors twice, but that seems like an unnecessary optimation at the moment.

#### Show me the Code!

```perl
#!/usr/bin/env perl
use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use Carp;
use Getopt::Long;
use List::Util qw{ max };
use List::Compare;

my $n = 3;
GetOptions( 'number=i' => \$n );
croak 'Negative Number' if $n < 1;
my $o = gcd($n);
say <<"END";
    INPUT:  $n
    OUTPUT: $o
END

sub gcd( $n ) {
    my $output = 0;
    for my $i ( 1 .. $n - 1 ) {
        my $di->@* = get_divisors($i);
        for my $j ( $i + 1 .. $n ) {
            my $dj->@* = get_divisors($j);
            my $dc     = List::Compare->new( $di, $dj );
            my @d      = $dc->get_intersection;
            my $g      = max @d;
            $output += $g;
        }
    }
    return $output;
}

sub get_divisors ( $n ) {
    my @div;
    for my $i ( 1 .. $n ) { push @div, $i if $n % $i == 0; }
    return @div;
}
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
