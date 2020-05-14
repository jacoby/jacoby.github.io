---
layout: post
title: "Niven Numbers in Perl and Javascript"
author: "Dave Jacoby"
date: "2019-05-06 18:50:39 -0400"
categories: ""
---

## The Problem

> Print all the niven numbers from 0 to 50 inclusive, each on their own line. A niven number is a non-negative number that is divisible by the sum of its digits.

## Discussion

`n % 0` included `n / 0`, which is bad. So, despite _0 to 50 inclusive_, I'm starting at one.

## Perl

```perl
#!/usr/bin/env perl

use feature qw{ say };
use strict;
use warnings;

use List::Util qw{sum};

for my $i ( 1 .. 50 ) {
    my @j = split //, $i; # split the number into characters
    my $k = sum @j;       # Perl doesn't overload operators,
                          # but overloads types, so if you do
                          # a math operation on a scalar, it
                          # finds the most number-like
                          # interpretation of that scalar

    my $l = $i % $k == 0; # true if it divides evenly.
    say $i if $l;         # say if true
                          # we COULD combine these two
}
```

```

1
2
3
4
5
6
7
8
9
10
12
18
20
21
24
27
30
36
40
42
45
48
50
```

## Javascript

```javascript
"use strict;";
console.log(
  Array(50)     // a 50-element array
    .fill()     // touch everything so we can map it
    .map((n, i) => 1 + i) // and make it [1,2,3,4...]
    .filter(n => {
      let o = n
        .toString()
        .split("")
        .map(v => 0 + parseInt(v))
        .reduce((a, v) => (a += 0 + parseInt(v)));
      let p = n % o == 0;
      return p;
    })
);
```

```javascript
[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 18, 20, 21, 24, 27, 30, 36, 40, 42, 45, 48, 50 ]
```

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
