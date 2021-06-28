---
layout: post
title: "One-to-One and Nybbles: (Perl) Wekly Challenge #119"
author: "Dave Jacoby"
date: "2021-06-28 16:00:02 -0400"
categories: ""
---

I saw but didn't notice at first that now, instead of _Perl Weekly Challenge_, it's [_The Weekly Challenge_](https://theweeklychallenge.org/blog/perl-weekly-challenge-119/), and to respect that change, I coded in both Perl and Javascript today.

### TASK #1 › Swap Nibbles

> Submitted by: Mohammad S Anwar  
> You are given a positive integer `$N`.
>
> Write a script to swap the two nibbles of the binary representation of the given number and print the decimal number of the new binary representation.
>
> > A nibble is a four-bit aggregation, or half an octet.
>
> To keep the task simple, we only allow integer less than or equal to 255.

I always knew of it as a [_nybble_](http://www.catb.org/~esr/jargon/html/N/nybble.html), but sure.

We're given the example of `101`, and convert it to binary (`01100101`), split it up into nibbles (`[0110], [0101]`), reverse them (`[0101], [0110]`), join them into one binary number (`01010110`), and turn that into a decimal number (`86`).

I used `substr` to do that, but `@nibbles = $n =~ m{\d{4}}g` is the way do it with regular expressions in Perl. I'm sure there's a similar way in Javascript. There's differing ways to go from decimal to binary — Perl => `sprintf('%08b'),$n`, JS => `n.toString(2)` — and back — Perl => `oct('0b'.$b)` , JS => `parseInt(b,2)` — but these are very similar and very short solutions.

#### Show Me The (Perl) Code

```perl
#!/usr/bin/env perl

use feature qw{say state signatures};
use strict;
use warnings;
use utf8;
no warnings qw{ experimental };

for my $n ( 0 .. 20 ) {
    say join "\t", '', $n, flopped($n);
}

    say join "\t", '', 86, flopped(86);
    say join "\t", '', 101, flopped(101);
    say join "\t", '', 18, flopped(18);
    say join "\t", '', 33, flopped(33);

sub flopped ($n) {
    my $b = sprintf '%08b', $n;
    my $c = join '', substr( $b, 4, 4 ), substr( $b, 0, 4 );
    my $r = oct( '0b' . $c );
    return $r;
}
```

```text
        0       0
        1       16
        2       32
        3       48
        4       64
        5       80
        6       96
        7       112
        8       128
        9       144
        10      160
        11      176
        12      192
        13      208
        14      224
        15      240
        16      1
        17      17
        18      33
        19      49
        20      65
        86      101
        101     86
        18      33
        33      18
```

#### Show Me The (JavaScript) Code

```javascript
"use strict";

for (let i in Array(21).fill("")) {
  let v = flopped(i);
  console.log(["", i, v].join("\t"));
}

console.log(["", 86, flopped(86)].join("\t"));
console.log(["", 101, flopped(101)].join("\t"));
console.log(["", 18, flopped(18)].join("\t"));
console.log(["", 33, flopped(33)].join("\t"));

function flopped(n) {
  let b = parseInt(n).toString(2);
  while (b.length < 8) {
    b = "0" + b;
  }
  let front = b.substring(0, 4);
  let back = b.substring(4);
  let r = back + front;
  let x = parseInt(r, 2);
  return x;
}
```

```text
        0       0
        1       16
        2       32
        3       48
        4       64
        5       80
        6       96
        7       112
        8       128
        9       144
        10      160
        11      176
        12      192
        13      208
        14      224
        15      240
        16      1
        17      17
        18      33
        19      49
        20      65
        86      101
        101     86
        18      33
        33      18
```

### TASK #2 › Sequence without 1-on-1

> Submitted by: Cheok-Yin Fung  
> Write a script to generate sequence starting at 1. Consider the increasing sequence of integers which contain only 1’s, 2’s and 3’s, and do not have any doublets of 1’s like below. Please accept a positive integer $N and print the $Nth term in the generated sequence.
>
> > 1, 2, 3, 12, 13, 21, 22, 23, 31, 32, 33, 121, 122, 123, 131, …

It took me a little bit to think through this, but my steps are as follows. We're primarily thinking of numbers that only contain **1**, **2** and **3**, so, after the binary (base 2) move in the previous challenge, I first thought about converting to base 3 and adding, but no, it's better to go to base 4 and filter.

Because we're filtering, if you start with an array of size `n` and remove all the `/11/` and `/0/` entries, you end up with an array that's smaller than `n`, so I start with an array of `2 * n` and go larger as needed.

I think the biggest conceptual difference is that `get_sequence` in Perl takes `0..n`, while my JS `get_sequence` takes `n` and builds the array itself. I mean, beyond [Memoize](https://metacpan.org/pod/Memoize), which I don't _think_ is necessary but I'm sure speeds it up a little.

#### Show Me The (Perl) Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

use Memoize;
memoize('first_pass');

my @list = map { int } @ARGV;
@list = ( 2, 5, 10, 60, 200 ) unless scalar @list;

for my $n (@list) {
    say join "\t", '', $n, solve_sequence($n);
}

# here we get an array such that index $n is in the array
# using increasingly aggressive methods, then
sub solve_sequence( $n ) {
    my $j        = $n * 2;
    my @sequence = get_sequence( 1 .. $j );
    while ( !$sequence[$n] ) {
        $j        = $j * 2;
        @sequence = get_sequence( 1 .. $j );
    }
    return $sequence[$n];
}

# the next things we want to do are to remove the blocked numbers
# which contain either 0 or 11, and then add another entry to the
# start of the array so that 1 aligns with 1.
sub get_sequence( @arr ) {
    my @seq =
        grep { !/11/ }
        grep { !/0/ }
        map  { first_pass($_) } @arr;
    unshift @seq, '';
    return @seq;
}

# the numbers will contain only the digits 1, 2 and 3, so to limit
# the amount of numbers we have to come up with, I first make everything
# base 4. This function is memoizable and so I memoized it.
sub first_pass ( $n ) {
    return $n if $n == 0;
    my @output;
    while ($n) {
        my $i = $n % 4;
        $n = int $n / 4;
        push @output, $i;
    }
    return join '', reverse @output;
}
```

```text
        2       2
        5       13
        10      32
        60      2223
        200     31221
```

#### Show Me The (JavaScript) Code

```javascript
"use strict";

let list = [2, 5, 10, 60, 200];

for (let i in list) {
  let n = list[i];
  let s = solve_sequence(n);
  console.log(["", n, s].join("\t"));
}

function solve_sequence(n) {
  let j = n * 2;
  let s = get_sequence(1 + j);
  while (s[n] == undefined) {
    j = j * 2;
    s = get_sequence(j);
  }
  return s[n];
}

function get_sequence(n) {
  n = parseInt(n);
  let sequence = Array(n)
    .fill("")
    .map((x, i) => first_pass(i + 1))
    .filter((x) => !x.toString().match(/0/))
    .filter((x) => !x.toString().match(/11/));
  sequence.unshift(0);
  return sequence;
}

function first_pass(n) {
  if (n == 0) {
    return 0;
  }
  let output = [];
  while (n) {
    let i = n % 4;
    n = parseInt(n / 4);
    output.push(i);
  }
  return output.reverse().join("");
}
```

```text
        2       2
        5       13
        10      32
        60      2223
        200     31221
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
