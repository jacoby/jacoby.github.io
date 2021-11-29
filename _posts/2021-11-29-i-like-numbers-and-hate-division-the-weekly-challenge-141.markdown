---
layout: post
title: "I Like Numbers And Hate Division: The Weekly Challenge #141"
author: "Dave Jacoby"
date: "2021-11-29 16:54:15 -0500"
categories: ""
---

[ One To 141! ](https://theweeklychallenge.org/blog/perl-weekly-challenge-141/)

### TASK #1 › Number Divisors

> Submitted by: Mohammad S Anwar  
> Write a script to find lowest 10 positive integers having exactly 8 divisors.

We get all the possible choices by going through the range of `1..$n`, and they are denominators if `$n / $i == 0`, which makes this an iteration-first task. I of course _could_ write a solution that would use recursion, but it just doesn't make sense.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say state postderef signatures };
no warnings qw{ experimental };

my @num_divisors = get_number_divisors( 1, 10, 8 );

sub get_number_divisors ( $start, $count, $divisors ) {
    my @output;
    my $s = $start;
    while (1) {
        my @divisors;
        for my $i ( 1 .. $s ) {
            push @divisors, $i if $s % $i == 0;
        }
        if ( scalar @divisors == $divisors ) {
            say join " ", $s, ':', ( scalar @divisors ), ':', @divisors;
            push @output, $s;
        }
        last if $count == scalar @output;
        $s++;
    }
    return @output;
}
```

```text
$ ./ch-1.pl
24 : 8 : 1 2 3 4 6 8 12 24
30 : 8 : 1 2 3 5 6 10 15 30
40 : 8 : 1 2 4 5 8 10 20 40
42 : 8 : 1 2 3 6 7 14 21 42
54 : 8 : 1 2 3 6 9 18 27 54
56 : 8 : 1 2 4 7 8 14 28 56
66 : 8 : 1 2 3 6 11 22 33 66
70 : 8 : 1 2 5 7 10 14 35 70
78 : 8 : 1 2 3 6 13 26 39 78
88 : 8 : 1 2 4 8 11 22 44 88
```

### TASK #2 › Like Numbers

> Submitted by: Mohammad S Anwar  
> You are given positive integers, $m and $n.
>
> Write a script to find total count of integers created using the digits of $m which is also divisible by $n.
>
> Repeating of digits are not allowed. Order/Sequence of digits can’t be altered. You are only allowed to use (n-1) digits at the most. For example, 432 is not acceptable integer created using the digits of 1234. Also for 1234, you can only have integers having no more than three digits.

The difficult part is to separate the digits and recombine them in appropriate numbers. With `1234`, `123` and `124` are allowed, but `132` would not be.

_This_ is a job for Recursion!

So, we start out with `''` as a stub, and go through position.

```text
    stored   : more work
    '' . 1   : 234
    '' . 2   : 34
    '' . 3   : 4
    '' . 4   :
```

At this point, we've put `1`, `2`, `3` and `4` into output, and we go to the next level. We'll take the first case, with `1` as the stub.

```text
    stored   : more work
    1 . 2    : 34
    1 . 3    : 4
    1 . 4    :
```

And we've added `12`,`13` and `14`. We would then go forward with `12` and `34`, then the rest. Because reasons, we cannot exclude this from getting `1234`, which the first example shows us is not allowable, so a `grep` once we're out of the `make_numbers` function handles that. We're looking if a number is evenly divisible by `$n`, so another `grep` to handle that, then a numeric sort to make the numbers easier to handle, and we're done!

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use Carp;
use Getopt::Long;

my $m = 1234;
my $n = 2;

GetOptions(
    'm=i' => \$m,
    'n=i' => \$n,
);

croak q{$m is not positive} if $m < 1;
croak q{$n is not positive} if $n < 1;

my @like_numbers = like_numbers( $m, $n );
say join ' ', @like_numbers;

sub like_numbers ( $m, $n ) {
    my @numbers = make_numbers($m);
    return

        sort { $a <=> $b }
        grep { $_ % $n == 0 }
        grep { $_ != $m }

        @numbers;
}

sub make_numbers ( $number, $n = '' ) {
    my @output;
    for my $i ( 0 .. -1 + length $number ) {
        my $x = $n . substr( $number, $i, 1 );
        my $y = substr( $number, $i + 1 );
        push @output, $x;
        push @output, make_numbers( $y, $x ) if length $y;
    }
    return @output;
}
```

```text
$ ./ch-2.pl
2 4 12 14 24 34 124 134 234
$ ./ch-2.pl  -m 768 -n 4
8 68 76
$ ./ch-2.pl  -m 12345 -n 5
5 15 25 35 45 125 135 145 235 245 345 1235 1245 1345 2345
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
