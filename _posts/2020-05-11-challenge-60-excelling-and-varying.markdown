---
layout: post
title: "Challenge 60: Excelling and Varying"
author: "Dave Jacoby"
date: "2020-05-11 18:23:39 -0400"
categories: ""
---

### TASK #1 › Excel Column

> Reviewed by: Ryan Thompson
>
> Write a script that accepts a number and returns the Excel Column Name it represents and vice-versa.
>
> Excel columns start at A and increase lexicographically using the 26 letters of the English alphabet, **A**..**Z**. After **Z**, the columns pick up an extra “digit”, going from **AA**, **AB**, etc., which could (in theory) continue to an arbitrary number of digits. In practice, Excel sheets are limited to 16,384 columns.
>
> **Example**
>
> `Input Number: 28` > `Output: AB`
>
> `Input Column Name: AD` > `Output: 30`

The _simplest_ way would be to just create a hash that would have the approprite mapping, and to reverse it, you'd just reverse keys and values.

```perl
sub all_excel () {
    my $done   = {};
    my $output = {};
    my $key    = 1;
    for my $i ( '', 'A' .. 'Z' ) {
        for my $j ( '', 'A' .. 'Z' ) {
            for my $k ( 'A' .. 'Z' ) {
                my $col = join '', $i, $j, $k;
                next if $done->{$col}++;
                $output->{$key} = $col;
                $key++;
            }
        }
    }
    return $output;
}
```

That's all well and good, I suppose, but it seems like that would take memory. We can be smarter than that, can't we?

#### From Number To Column Name

A few notes: We must consider what **A** means, especially in context of **28 <=> AB**, which means **A == 1**, but **AA** is the equivalent of **10** in Base Excel not **11**. This means that we have to distinguish **A** to **Z** from **A\_** to **Z\_**, etc.

But basically **123** equals **3** + **10\*2** + **1\*10<sup>2</sup>**, and so **AAA** is **0** + **1 \* 26** + **1 \* 26<sup>2</sup>** converted to A-Z.

This, _again_, looks like a job for recursion.

```perl
my %alpha = map { state $c = 0; $c++ => $_ } 'A' .. 'Z';
my %ahpla = reverse %alpha;

sub to_excel_col1 ( $i, $f = 0 ) {
    $i = int $i;
    croak 'out of range' if $i < 0 || $i > 16384;
    croak 'out of range' if $i == 0 && $f == 0;
    $i -= 1 unless $f;

    my $mod = $i % 26;
    my $num = int $i / 26;
    my $l   = $f ? $alpha{ $mod - 1 }
              : $alpha{$mod};

    return join '', to_excel_col1( $num, 1 ), $l if $num > 0;
    return $l;
}
```

#### There And Back Again

As we we divide a number to find the number and thus the letter for the column previously, here we convert then multiply.

Above, I create a hash named `%alpha` that's `{ "A" => 1, "B" => 2 ... }` and, when I wanted `{ 1 -> "A", 2 => "B" ... }`, I used `reverse` and named it `%ahpha`, which might not be the best naming convention.

```perl
# looking back at this, I'm reminded why we should
# use more verbose variable names.
sub from_excel_col1 ( $c, $f = 0 ) {
    $c =~ s/\W//g;
    $c = uc $c;
    my @c = split //, $c;
    my $o = 0;
    my $l = pop @c;
    my $v = $ahpla{$l};
    !$f && $v++;
    $o += $v;

    if ( scalar @c ) {
        my $d = join '', @c;
        my $e = from_excel_col1( $d, 1 );
        $o += 26 * ( 1 + $e );
    }
    return $o;
}
```

#### Code and Results

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings qw{ experimental };

use Carp;

my $all = all_excel();
my $lla->%* = reverse $all->%*;

my %alpha = map { state $c = 0; $c++ => $_ } 'A' .. 'Z';
my %ahpla = reverse %alpha;

for my $i ( sort { $a <=> $b } 1 .. 40, 100, 1000, 10000 ) {
    my $e   = to_excel_col1($i);
    my $r   = from_excel_col1($e);
    my $ch1 = $all->{$i};
    my $ch2 = $lla->{$e};
    say join "\t", '--', $i, $e, $r, '', $ch1, $ch2;
}

# first row is different, because instructions assume
# we start with row 1, but things become so much easier
# with a zero index
sub to_excel_col1 ( $i, $f = 0 ) {
    $i = int $i;
    croak 'out of range' if $i < 0 || $i > 16384;
    croak 'out of range' if $i == 0 && $f == 0;
    $i -= 1 unless $f;

    my $mod = $i % 26;
    my $num = int $i / 26;
    my $l   = $f ? $alpha{ $mod - 1 } : $alpha{$mod};

    return join '', to_excel_col1( $num, 1 ), $l if $num > 0;
    return $l;
}

sub from_excel_col1 ( $c, $f = 0 ) {
    $c =~ s/\W//g;
    $c = uc $c;
    my @c = split //, $c;
    my $o = 0;
    my $l = pop @c;
    my $v = $ahpla{$l};
    !$f && $v++;
    $o += $v;

    if ( scalar @c ) {
        my $d = join '', @c;
        my $e = from_excel_col1( $d, 1 );
        $o += 26 * ( 1 + $e );
    }
    return $o;
}

sub all_excel () {
    my $done   = {};
    my $output = {};
    my $key    = 1;
    for my $i ( '', 'A' .. 'Z' ) {
        for my $j ( '', 'A' .. 'Z' ) {
            for my $k ( 'A' .. 'Z' ) {
                my $col = join '', $i, $j, $k;
                next if $done->{$col}++;
                $output->{$key} = $col;
                $key++;
            }
        }
    }
    return $output;
}
```

```text
--      1       A       1               A       1
--      2       B       2               B       2
--      3       C       3               C       3
--      4       D       4               D       4
--      5       E       5               E       5
--      6       F       6               F       6
--      7       G       7               G       7
--      8       H       8               H       8
--      9       I       9               I       9
--      10      J       10              J       10
--      11      K       11              K       11
--      12      L       12              L       12
--      13      M       13              M       13
--      14      N       14              N       14
--      15      O       15              O       15
--      16      P       16              P       16
--      17      Q       17              Q       17
--      18      R       18              R       18
--      19      S       19              S       19
--      20      T       20              T       20
--      21      U       21              U       21
--      22      V       22              V       22
--      23      W       23              W       23
--      24      X       24              X       24
--      25      Y       25              Y       25
--      26      Z       26              Z       26
--      27      AA      27              AA      27
--      28      AB      28              AB      28
--      29      AC      29              AC      29
--      30      AD      30              AD      30
--      31      AE      31              AE      31
--      32      AF      32              AF      32
--      33      AG      33              AG      33
--      34      AH      34              AH      34
--      35      AI      35              AI      35
--      36      AJ      36              AJ      36
--      37      AK      37              AK      37
--      38      AL      38              AL      38
--      39      AM      39              AM      39
--      40      AN      40              AN      40
--      100     CV      100             CV      100
--      1000    ALL     1000            ALL     1000
--      10000   NTP     10000           NTP     10000
```

### TASK #2 › Find Numbers

> Reviewed by: Ryan Thompson
>
> Write a script that accepts list of positive numbers (@L) and two positive numbers $X and $Y.
>
> The script should print all possible numbers made by concatenating the numbers from @L, whose length is exactly $X but value is less than $Y.
>
> **Example**
>
> Input:
>
> `@L = (0, 1, 2, 5);`
>
> `$X = 2;`
>
> `$Y = 21;`
>
> Output:
>
> `10, 11, 12, 15, 20`

Some points here. `11` shows us that digits repeat. Using `1` in the ones spot doesn't keep it out of the tens spot.

But `00` and `01`, two valid numbers, do not count as `length 2`, so there's a cast to integer. 


#### The Code and the Results

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings qw{ experimental };

my ( $x, $y, @l ) = grep { $_ >= 0 } map { int $_ } @ARGV;
$x //= 2;
$y //= 21;
@l = ( 0, 1, 2, 5 ) unless scalar @l;

say qq{X: $x };
say qq{Y: $y };
say q{L: } . join ', ', @l;

my @vars = get_variations( \@l, $x );
say qq{All variations of length $x:\n\t} . join ", ", @vars;

@vars = get_lt_variations( \@l, $x, $y );
say qq{All variations of length $x that are < $y:\n\t} . join ", ", @vars;
exit;

sub get_lt_variations ( $arrayref, $x, $y ) {
    return grep { $x == length $_ && $_ < $y } get_variations( $arrayref, $x );
}

sub get_variations ( $arrayref, $depth ) {
    my $output = [];
    return $arrayref->@* if $depth <= 1;
    for my $i ( 0 .. -1 + scalar $arrayref->@* ) {
        my $s = $arrayref->[$i];
        push $output->@*,
          map { int $s . $_ } get_variations( $arrayref, $depth - 1 );
    }
    return $output->@*;
}
```

```text

X: 2
Y: 21
L: 0, 1, 2, 5
All variations of length 2:
        0, 1, 2, 5, 10, 11, 12, 15, 20, 21, 22, 25, 50, 51, 52, 55
All variations of length 2 that are < 21:
        10, 11, 12, 15, 20
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
