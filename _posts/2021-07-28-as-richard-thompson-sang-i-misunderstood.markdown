---
layout: post
title:  "As Richard Thompson sang, I "Misunderstood""
author: "Dave Jacoby"
date:   "2021-07-28 15:08:21 -0400"
categories: ""
---

[Thank you, Adam D. Herzog](https://twitter.com/adherzog/status/1420457692334804997), who corrected my previous code/blog about [the Weekly Challenge on Ugly Numbers](https://jacoby.github.io/2021/07/27/ugly-and-square-perl-weekly-challenge-123.html).

> It's worded a little ambiguously, but I think an Ugly Number has 2, 3, or 5 as the _only_ possible prime factors.

OK, that makes sense. There is no link to a definition or larger set for Ugly Numbers, and the set, bound by **1** and **12**, is not going to be large enough to show me wrong like, for example, **36** would.

It's an all-too-common occurance that software is made to incorrect or misunderstood requirements.

OK. Back to the drawing board.

We're kinda one step removed from the solution. We're not looking to see if **n** is an Ugly number, we're trying to find the **n**th Ugly number.

So, we loop infinitely, iterating when we find an Ugly number and quitting when we've found the right one. So, `my $u=0;while(1) { $u++ }` is the core.

So, how do we determine if something is _Ugly_? We factor out 2, 3 and 5, and see if there's anything left but 1.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use feature qw{say state signatures};
use strict;
use warnings;
use utf8;
no warnings qw{ experimental };

use Carp;
use Getopt::Long;

my $n = 8;

GetOptions( 'n=i' => \$n, );
carp 'Bad Input' unless $n > 0;

my $u = get_ugly($n);
say "Input:  \$n = $n  Output: $u";

sub get_ugly ( $n ) {
    my $c = 0;
    my $u = 0;
    while (1) {
        $u++;
        my $f = is_ugly($u) ? 1 : 0;
        $c++ if $f;
        return $u if $n == $c;
    }
}

sub is_ugly( $n ) {
    for my $i ( 2, 3, 5 ) {
        while ( $n % $i == 0 ) {
            $n /= $i;
        }
    }
    return $n == 1 ? 1 : 0;
}
```

```text
$ for i in {1..20} ; do ./ch-1.pl -n $i ; done
Input:  $n = 1  Output: 1
Input:  $n = 2  Output: 2
Input:  $n = 3  Output: 3
Input:  $n = 4  Output: 4
Input:  $n = 5  Output: 5
Input:  $n = 6  Output: 6
Input:  $n = 7  Output: 8
Input:  $n = 8  Output: 9
Input:  $n = 9  Output: 10
Input:  $n = 10  Output: 12
Input:  $n = 11  Output: 15
Input:  $n = 12  Output: 16
Input:  $n = 13  Output: 18
Input:  $n = 14  Output: 20
Input:  $n = 15  Output: 24
Input:  $n = 16  Output: 25
Input:  $n = 17  Output: 27
Input:  $n = 18  Output: 30
Input:  $n = 19  Output: 32
Input:  $n = 20  Output: 36
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
