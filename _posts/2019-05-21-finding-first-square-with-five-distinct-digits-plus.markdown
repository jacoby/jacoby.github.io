---
layout: post
title: "Finding First Square with Five Distinct Digits, Plus"
author: "Dave Jacoby"
date: "2019-05-21 10:15:06 -0400"
categories: ""
---

Another [Perl Weekly Challenge!](https://perlweeklychallenge.org/blog/perl-weekly-challenge-009/)

> Write a script that finds the first square number that has at least 5 distinct digits. This was proposed by **Laurent Rosenfeld**.

I rarely have need to deal with squares, so each time I do, it's a little bit of a shock that the syntax is `10 ** 2 == 100` and not `10 ^ 2 == 100`, but that's what Perl does. So, a series of numbers and squaring.

But we don't know how high the list goes, so we couldn't just go with `for ( 1..100) {...}`, but would have to go on indefinitely.

```perl
my $n = 0 ;
while (1) {
    $n++;
    my $s = $n**2;
    ...
}
```

That's good, but a bit messy. We have variables all over.

```perl
while (1) {
    state $n = 0;
    $n++;
    ...
}
```

We can work with that, and this introduces the `state` feature I always keep in my boilerplate. If that said `my $n = 0`, it would be recreated and reset to zero each time the loop repeats, but `state $n` only creates the variable on first pass. `$n` is only scoped within the while loop.

_But_, if we're going to that, we can do another, hipper thing.

**Iterators.**

```perl
# note 1: $n++ increases $n AFTER returning, so first return would be 0
sub iter1 () { state $n = 0; return $n++ }

# note 2: ++$n increases $n BEFORE returning, so first return would be 1
sub iter2 () { state $n = 0; return ++$n }

say join ':', iter1(),iter2(); # 0:1
say join ':', iter1(),iter2(); # 1:2
say join ':', iter1(),iter2(); # 2:3
```

In this case, we're looking for the square, but don't much care for the square root, so...

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

use List::Util qw{uniq};

while (1) {
    my $d = infinite_iterator(); # gets set each loop
    if ( test($d) ) { say $d ; exit; }
}

sub infinite_iterator {
    state $x = 0;
    return ++$x**2; # $x += 1; $s = $x squared; return $s;
}

sub test ( $square ) {
    my @square = uniq split //, $square;
    return scalar @square > 4 ? 1 : 0 ;
    # that is a ternary operator, and it is the same as
    #   return 1 if scalar @square > 4;
    #   return 0;
}
```

I think these challenges are feeding my inner Perl Golfer, and I'm not sure it's best for my code base.

> Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it. -- **Brian Kernighan**

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
