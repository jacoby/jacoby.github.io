---
layout: post
title: "Hip To Be Square: Perl Weekly Challenge #116"
author: "Dave Jacoby"
date: "2021-06-08 12:12:15 -0400"
categories: ""
---

Listening to the starting talks of [Conference in the Cloud 2021]() while writing up my solutions to [Perl Weekly Challenge #116](https://perlweeklychallenge.org/blog/perl-weekly-challenge-116/)

## TASK #1 › Number Sequence

> Submitted by: Mohammad S Anwar  
> You are given a number `$N >= 10`.
>
> Write a script to split the given number such that the difference between two consecutive numbers is always 1 and it shouldn’t have leading 0.
>
> Print the given number if it impossible to split the number.

[**This Looks Like A Job For _Recursion!_**](https://www.google.com/search?q=%22this+looks+like+a+job+for+recursion!)

One of the examples is `1234`, which can become

```text
1,2,3,4
1,2,34
1,23,4
1,234
12,3,4
12,34
123,4
```

We go forward by using `substr` to add commas, avoiding coma prefixes and suffixes, double commas and `,0`, giving a prefix zero that will go away. When coding, I forgot that you can add a comma with `substr( $var, $position, 0 ) = ','` so I went the long way. Oh well. 

### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

my @numbers = qw{ 1234 91011 10203 };

for my $n (@numbers) {
    say base($n);
}

# we are asked to return the sequence
# or the given number, and accounting
# for that makes recursion difficult,
# so we pass to base to determine that

sub base ( $n ) {
    my $s = get_sequence($n);
    return $s//$n;
}

# test for success and return if successful
# then add commas within (a copy of) the
# string

sub get_sequence ( $n ) {
    my $t = test($n);
    return $n if $t;

    my $output;
    my @n = split /,/, $n;
    my $flag = 0;
    map { $flag += 1 if $_ > 10 } @n;
    if ( $flag > 0 ) {
        for my $i ( 0 .. length $n ) {
            my $cp = $n;
            my $l = substr( $cp, $i, 1 );
            substr( $cp, $i, 1 ) = ',' . $l;
            next if $cp =~ m{^\,|\,\,|\,$};
            my $x = get_sequence($cp);
            return $x if $x;
        }
    }
    return undef;
}

sub test ( $n ) {
    my $t = 1;
    my @n = split /,/, $n;
    $t = 0 if $n[0] =~ m{^0}mx;
    $t = 0 if scalar @n < 2;
    for my $i ( 1 .. -1 + scalar @n ) {
        my $h = $i - 1;
        $t = 0 if $n[$i] =~ m{^0}mx;
        $t = 0 unless $n[$h] + 1 == $n[$i];
    }
    return $t;
}
```

```text
PS C:\Users\jacob\Documents\GitHub\perlweeklychallenge-club\challenge-116\dave-jacoby\perl> .\ch-1.pl
1,2,3,4
9,10,11
10203

```

## TASK #2 › Sum of Squares

> Submitted by: Mohammad Meraj Zia  
> You are given a number `$N >= 10`.
>
> Write a script to find out if the given number `$N` is such that sum of squares of all digits is a perfect square. Print 1 if it is otherwise 0.

Stage 1: use `map` to turn each member of the list of numbers to it's square, then `sum0` to add them all together.

Stage 2: use `sqrt` to find the square root of the sum.

Stage 3: compare the result to a converted-to-integer version of itself to the plain result, to see if they're the same, because _every number_ has a square root that can be represented in floating point. And then, finally, a good-old ternary operator.

### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

use List::Util qw{sum0};

my @numbers = sort (34, 50, 52, 10 );

for my $n ( @numbers ) {
    my $b = sum_of_squares($n);
    say join "\t", $n,$b?'Yes':'No';
}

sub sum_of_squares ( $n ) {
    my $sum = sum0 map { $_ ** 2 } split //, $n;
    my $root = sqrt $sum;
    return int $root == $root ? 1 : 0 ;
}
```

```text
PS C:\Users\jacob\Documents\GitHub\perlweeklychallenge-club\challenge-116\dave-jacoby\perl> .\ch-2.pl
10      Yes
34      Yes
50      Yes
52      No
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
