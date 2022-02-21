---
layout: post
title: "Luck is not a Factor!: Weekly Challenge #153"
author: "Dave Jacoby"
date: "2022-02-21 16:01:28 -0500"
categories: ""
---

Welcome to [Weekly Challenge #153](https://theweeklychallenge.org/blog/perl-weekly-challenge-153/). My weekly trip through [number trivia](<https://en.wikipedia.org/wiki/153_(number)>) tells me that the sum of the first five integers **(1! + 2! + 3! + 4! + 5)** equals 153, which might be an inspiration for this week's set of tasks.

[I've blogged about factorials in a previous, non-challenge post.](https://jacoby.github.io/math/2018/02/19/solving-a-math-meme.html) I showed the meme central from that post to my youngest son, who didn't get it 1) because of failure of applying PEMDAS and 2) not recognizing **n!** as meaning factorials. I don't know if I should credit that failure to his schools or myself.

### TASK #1 › Left Factorials

> Submitted by: Mohammad S Anwar  
> Write a script to compute **Left Factorials** of **1 to 10**. Please refer [OEIS A003422](http://oeis.org/A003422) for more information.

So, what's a _Left Factorial_? It's indicated by putting the exclamation point to the _left_ of the number, not the right, and it's defined as `!n = Sum{k=0..n-1} k!`. This is hardly more understandable than writing it with Σ. I can _write_ the code implied by that sort of thing, but _understanding_ what the greek letters mean is a big failure of my CS education.

Speaking of failures, a big Math failure is assuming (and adding to my code) `0! == 0`, when, non-intuitively, `0! == 1`. I _wrote_ that into my `factorial()` function, and not only was it not correct, it failed in a way that looked exactly like the results in [another OEIS sequence](http://oeis.org/A007489), which made me question whether the OEIS and the Task were right.

The good thing is that I now know better, and my code now runs.

The _other_ good thing is that, with such an easy definition, you can make a nice, compact functional solution, with the help of [List::Util](https://metacpan.org/pod/List::Util)'s `sum0` and `product`.

Let's start with the `factorial` function, which I make remember past answers with `state` rather than using [Memoize](https://metacpan.org/pod/Memoize). Thank you MJD, for this and for [_Higher Order Perl_](https://hop.perl.plover.com/), where I learned about it. This _might_ be premature optimization, but I think it's cool, so I did it. The core of it is one functional line: `$factorials->{$n} = product 1 .. $n`.

Once we get to actually solving the problem, that's just `sum0`, which I remind you, returns `0` instead of `undef` when given an empty set. That's simply `sum0 map { factorial($_) } 0 .. $n - 1`.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use List::Util qw{ sum0 product };

say join ', ', map { left_factorial($_) } 1 .. 10;

sub left_factorial( $n ) {
    return sum0 map { factorial($_) } 0 .. $n - 1;
}

sub factorial ( $n ) {
    return 1 if $n == 0;
    state $factorials ;
    if ( !$factorials->{$n} ) {
        $factorials->{$n} = product 1 .. $n;
    }
    return $factorials->{$n};
}
```

```text
$ ./ch-1.pl
1, 2, 4, 10, 34, 154, 874, 5914, 46234, 409114
```

### TASK #2 › Factorions

> Submitted by: Mohammad S Anwar
> You are given an integer, **$n**.
>
> Write a script to figure out if the given integer is **factorion**.
>
> > A **factorion** is a natural number that equals the sum of the factorials of its digits.

Again, this is `sum0` and `product` again. This one was simple from first appearances, so I tackled it first.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use List::Util qw{ sum0 product };

@ARGV = ( 123, 145 ) unless scalar @ARGV;

for my $i (@ARGV) {
    my $f = is_factorion($i);
    say join "\t", '', $i, $f;
}

sub is_factorion ( $n ) {
    my $f = factorion($n);
    return $f == $n ? 1 : 0;
}

sub factorion ( $n ) {
    return sum0 map { factorial($_) } split //, $n;
}

sub factorial ( $n ) {
    return 1 if $n == 0;
    state $factorials ;
    if ( !$factorials->{$n} ) {
        $factorials->{$n} = product 1 .. $n;
    }
    return $factorials->{$n};
}
```

```text
$ ./ch-2.pl 1 2 3 4 5 123 145 345
        1       1
        2       1
        3       0
        4       0
        5       0
        123     0
        145     1
        345     0
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
