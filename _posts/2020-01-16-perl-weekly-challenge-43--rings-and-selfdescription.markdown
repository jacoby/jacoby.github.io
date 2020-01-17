---
layout: post
title: "Perl Weekly Challenge #43 - Rings and Self-Description"
author: "Dave Jacoby"
date: "2020-01-16 23:48:42 -0500"
categories: ""
---

Our taskmaster, [@cpan_author](https://twitter.com/cpan_author), will be tending to a family emergency. However the [Perl Weekly Challenge](https://perlweeklychallenge.org/) shakes out while he's away, I'm glad he's tending to the important things, and wish him and his family the best.

## CHALLENGE 1

> There are **5 rings** in the Olympic Logo as shown below. They are color coded as in **Blue**, **Black**, **Red**, **Yellow** and **Green**.
> ![Olympic Rings](https://perlweeklychallenge.org/images/blog/olympic_rings.jpg)
>
> We have allocated some numbers to these rings as below:
>
> - **Blue: 8**
> - **Yellow: 7**
> - **Green: 5**
> - **Red: 9**
>
> The **Black** ring is empty currently. You are given the numbers **1**, **2**, **3**, **4** and **6**. Write a script to place these numbers in the rings so that the sum of numbers in each ring is exactly **11**.

First and foremost, this is a logic puzzle, solvable with thought and without computers.

```text
Red Circle:     9 + j = 11
                j == 2
Purple Circle:  8 + k = 11
                k = 3
Green Circle:   j + 5 + l = 11
                2 + 5 * l = 11
                7 + l = 11
                l = 4
Yellow Circle:  7 + k + m = 11
                7 + 3 + m = 11
                m = 1
Black Circle:   i + l + m = 11
                i + 1 + 4 = 11
                i = 6
```

You don't need to throw the number 6 in there to know the number in the black circle is 6.

However:

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings qw{
    experimental::postderef experimental::smartmatch
    experimental::signatures
    };

use List::Util qw{sum0};

my $commentary = <<'END';

    There is one possible solution to this, so it's more a logic puzzle
    than a math puzzle. It is suitable for brute force, however.

    The tools I use here are permutations and sum0. sum returns undef when
    given an empty list, while sum0 returns 0. This shouldn't matter, but
    I'm using sum0.

    Given the array [1,2,3], the values can be rearranged in six unique ways.

        1, 2, 3
        1, 3, 2
        2, 1, 3
        2, 3, 1
        3, 1, 2
        3, 2, 1

    These are the permutations, and permute_array returns an array
    containing all possible variations, or permutations.

    In this, the number within both the red and green ring will
    be called red/green, the number that's only within the black
    ring will be called black, and so on.

    The generated solution is this:

        red/green:      2
        black/green:    4
        black/yellow:   1
        purple/yellow:  3
        black:          6

END

my $nums = [ 1 .. 4, 6 ];

my @perms = permute_array($nums);

for my $p (@perms) {
    next unless eleven( 9, $p->[0] );             # red
    next unless eleven( 8, $p->[3] );             # purple
    next unless eleven( 5, $p->[0], $p->[1] );    # green
    next unless eleven( 7, $p->[2], $p->[3] );    # black
    next unless eleven( $p->[1], $p->[2], $p->[4] );
    say <<"END";
        red/green:      $p->[0]
        black/green:    $p->[1]
        black/yellow:   $p->[2]
        purple/yellow:  $p->[3]
        black:          $p->[4]
END
}

sub eleven ( @array ) {
    my $r = sum0 @array;
    my $s = $r == 11 ? 1 : 0;
    return $s;
}

sub permute_array ( $array ) {
    return $array if scalar $array->@* == 1;
    my @response = map {
        my $i        = $_;
        my $d        = $array->[$i];
        my $copy->@* = $array->@*;
        splice $copy->@*, $i, 1;
        my @out = map { unshift $_->@*, $d; $_ } permute_array($copy);
        @out
    } 0 .. scalar $array->@* - 1;
    return @response;
}
```

## CHALLENGE 2

> Write a script to generate **Self-descriptive Numbers** in a given base.
>
> > In mathematics, a self-descriptive number is an integer m that in a given base b is b digits long in which each digit d at position n (the most significant digit being at position 0 and the least significant at position b - 1) counts how many instances of digit n are in m.
>
> For example, if the given base is **10**, then script should print **6210001000**. For more information, please checkout [wiki page](https://en.wikipedia.org/wiki/Self-descriptive_number).

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
  qw{ experimental::postderef experimental::smartmatch experimental::signatures };

use List::Util qw{ sum0 };
use Scalar::Util qw{ looks_like_number };
use JSON;
my $json = JSON->new;

my $instructions = <<'END';
    Write a script to generate Self-descriptive Numbers in a given base.

    In mathematics, a self-descriptive number is an integer m
    that in a given base b is b digits long in which each digit d
    at position n (the most significant digit being at position 0
    and the least significant at position b - 1) counts how many
    instances of digit n are in m.

    For example, if the given base is 10, then script should print
    6210001000.
END

# the canonical steps are

#   * make it work
#   * make it right
#   * make it fast

# and I have done the first two.

# Given base 2, there are 4 possible strings to analyze
#   00 , which is 2 zeroes and 0 ones (20) and cannot be described in base-2
#   01 , which is 1 zero and 1 one, (11), which does not describe this number
#   10 , which is 1 zero and 1 one, (11), which does not describe this number
#   11 , which is 0 zeroes and 2 ones, (02) which cannot be described in base-2

# so, there's no self-describing base-2 number.

# going deeper, 42101000 is a self-describing base-8 number, as it has
# 4 zeroes
# 2 ones
# 1 two
# 0 threes
# 1 four
# and 0 fives, sixes or sevens.

# additionally, since there are n digits in a base-n self-describing
# number, the sum of the digits should be n as well.

# NOTE: this program handles bases 2-10. Going above that involves adding
# letters for numbers, with A meaning decimal 10 in base-11 and higher.
# it'd be a small addition of complexity to convert A to 10 and vice
# versa, but that seems frustrating.

my $base = looks_like_number $ARGV[0] ? 0 + $ARGV[0] : 10;
$base = $base > 0 ? $base : 10;
exit if $base > 10;

my @bases = 0 .. 9;

my $min = 0 x $base;
my $max = ($base) x $base;

OUTER: for my $n ( $min .. $max ) {
    my @count;
    my @n = split //,$n;
    my $sum = sum0  @n;
    say STDERR qq{ ... $n} if $n =~ /0000000$/;

    # first, we insure count is valid
    # then we drop out-of-range entries
    for my $d ( @n ) { next OUTER if $d >= $base }
    next OUTER if $sum != $base;

    map { @count[$_] = 0 } 0 .. $base - 1;
    for my $d ( 0 .. $base - 1 ) {
        $count[$d] = () = $n =~ /($d)/gmix;
        next OUTER if $count[$d] >= $base;
    }
    my $c = join '', @count;
    my $match =   $n == $c ? 1 : 0;
    say join "\t", '', $n, $c, $match if $match;
}

```

But...

This code will determine if a number is self-descriptive, and check against all possible numbers, and for base-n, we need to check **n<sup>n</sup>** numbers. For smaller numbers, this is small: 2<sup>2</sup> is 4. 4<sup>4</sup> is 256. 10<sup>10</sup> is 10,000,000,000, and that's big. After base-9, it might be better to build the numbers rather than go through all possible numbers, but I don't immediately see how.

That could be fun.

The other problem with larger bases is **representation**. Hexidecimal is base 16, and that looks like `0, 1, 2, 3, 4, 5, 6, 7, 8, 9, a, b, c, d, e, f`, and so given **C210000000001000**, the solution for base-16, we would need to count to decimal-12 zeroes and convert that to **C** for the text, or conversely, pull the initial **C** from the number string, convert that to **12** to compare that with the number of zeroes, and so on.

Looking at base-7 and up, I am seeing a pattern.

```text
7 	3211000
8 	42101000
9 	521001000
10 	6210001000
11 	72100001000
12 	821000001000
... 	... 	...
16 	C210000000001000
... 	... 	...
36 	W21000...0001000 (Ellipsis omits 23 zeroes)
```

The pattern being, if there's a self-descriptive number in **base-n**, it ends with `1000`, meaning that there's **zero** digits that count up to n-1, **zero** that count up to n-2, **zero** that count up to -3, and **one** that displays n-4.

Similarly, the start with `[n-4]210`, meaning there's 2 **ones** (being the number of twos and and the number of n-4s), and 1 **two** (being the number of ones).

So, mathematically, `p` = `n` - 4, expressed in appropriate notation, and the response of `big_self_desc(n)` is `p210..01000`.

So, the code:

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
  qw{ experimental::postderef experimental::smartmatch experimental::signatures };

my @base      = ( 0 .. 9, 'a' ... 'z' );
my %to_base   = map { state $c = 0; $_ => $c++ } @base;
my %from_base = reverse %to_base;

for my $n ( reverse 7 .. 37 ) {
    my $s = get_self($n);
    next unless check_self( $s, $n );
    say join "\t", $n, $s;
}

sub check_self ( $s, $n ) {
    no warnings;
    my @s = split //, $s;
    my $b = $s[0];
    my @check;

    for my $i ( 0 .. $n - 1 ) {
        my $eye = $from_base{$i};

        my $c = $s[$i];

        my @all = grep { $_ eq $eye } @s;
        my $all = join ',', @all;

        my $j   = scalar @all;
        my $jay = $from_base{$j};

        return 0 if $c ne $jay;
    }

    return 1;
}

sub get_self( $n ) {
    my @output = map { 0 } 1 .. $n;
    my $b      = $n - 4;
    $output[0]  = $from_base{$b};
    $output[1]  = 2;
    $output[2]  = 1;
    $output[$b] = 1;
    return join '', @output;
}

```

and the output

```text
37	x210000000000000000000000000000001000
36	w21000000000000000000000000000001000
35	v2100000000000000000000000000001000
34	u210000000000000000000000000001000
33	t21000000000000000000000000001000
32	s2100000000000000000000000001000
31	r210000000000000000000000001000
30	q21000000000000000000000001000
29	p2100000000000000000000001000
28	o210000000000000000000001000
27	n21000000000000000000001000
26	m2100000000000000000001000
25	l210000000000000000001000
24	k21000000000000000001000
23	j2100000000000000001000
22	i210000000000000001000
21	h21000000000000001000
20	g2100000000000001000
19	f210000000000001000
18	e21000000000001000
17	d2100000000001000
16	c210000000001000
15	b21000000001000
14	a2100000001000
13	9210000001000
12	821000001000
11	72100001000
10	6210001000
9	521001000
8	42101000
7	3211000

```

I _could_ and probably _should_ make a combined program. But not now.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
