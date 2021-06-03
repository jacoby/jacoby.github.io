---
layout: post
title: "TIL: substr and -1"
author: "Dave Jacoby"
date: "2021-06-03 17:45:45 -0400"
categories: ""
---

I like the Perl Weekly Challenges because I like to teach and I like to learn. This is why I like to blog my results; to allow others see the tools I reach for regularly.

[For Challenge #115](https://jacoby.github.io/2021/06/01/abc-acb-bac-bca-cab-cba-perl-weekly-challenge-115.html), I used this subroutine to make it easier to compare the first and last characters of strings.

```perl
sub l_char( $str ) {
    return substr( $str, -1 + length $str, 1 );
}
```

This is where I get to learn. [@adherzog](https://twitter.com/adherzog) on Twitter responded:

> [I think `substr()` can count backwards from the end of the string, eg. `substr( $str, -1, 1 )`](https://twitter.com/adherzog/status/1400544087745380363)

Hrmm. That would make thinks _so_ much easier. I don't think I understood that `substr` behaved like that. I strongly considered something like `my $last = reverse split //, $str` or `my @str = split //, $str; my last = $str[-1]` but decided that `substr` was sufficient, if a bit clunky.

But was it really clunky? Or did I just not know how to use it?

I keep a file, `test.pl`, around so I can take ideas I want to boil down to the basics, then keep them around for future use.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

if (1) {
    my $str = 'testing';
    for my $i ( 1 .. length($str) ) {
        my $noti = 0 - $i;
        my $j    = length($str) - $noti;
        say join "\t", '', $i, $noti, substr( $str, $noti, $j );
    }
    exit;
}
```

```text
        1       -1      g
        2       -2      ng
        3       -3      ing
        4       -4      ting
        5       -5      sting
        6       -6      esting
        7       -7      testing
```

So, `-1`, as well as the other _start from the end_ formulations, work in `substr` as well as list context.

**Today I Learned.**

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
