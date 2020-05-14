---
layout: post
title: "Use Perl Features: current_sub"
author: "Dave Jacoby"
date: "2018-08-29 16:20:46 -0400"
? categories
---

This is another dive into the wonders available in [the `feature` pragma](https://metacpan.org/pod/feature), and I have [brian d foy](https://www.effectiveperlprogramming.com/) to thank for this one, because I did not get it at first.

`current_sub` gives you `__SUB__`, which is a reference to the current subroutine, or undef if not in a subroutine.

"And??", I thought.

Because, you know you're in a subroutine the minute you type `sub`, and you know you're not when you're outside of the subroutine's brackets. You can always call that `sub foo {...}` again with just `foo()`.

Except for anonymous subroutines.

> [**"Long story short: computers don't care about the names of things. People do." -- chromatic**](http://modernperlbooks.com/mt/2012/05/the-current-sub-in-perl-516.html)

The good pull quote came from chromatic, but the understanding came from brian, who created [a recursive countdown with anonymous subroutines and `current_sub`](https://www.effectiveperlprogramming.com/2012/02/use-__sub__-to-get-a-reference-to-the-current-subroutine/).

You need `__SUB__` because that's how a subroutine can recursively call itself.

I'm a programmer playing with recursion in a new way, and what's the first thing programmers looking at recursion go for? [Fibonacci!](https://en.wikipedia.org/wiki/Fibonacci_number)

```perl
use strict;
use warnings;
use feature qw{ current_sub say state };

sub fibber {
    sub {
        state $d = [];
        $d->[0] = 1;
        $d->[1] = 1;
        my $x = shift;
        if ( !defined $d->[$x] ) {
            my $y = __SUB__->( $x - 1 ) + __SUB__->( $x - 2 );
            $d->[$x] = $y;
        }
        say join '-', $x, $d->[$x];
        return $d->[$x];
        }
}

say fibber()->(10);

#   1-1
#   0-1
#   2-2
#   1-1
#   3-3
#   2-2
#   4-5
#   3-3
#   5-8
#   4-5
#   6-13
#   5-8
#   7-21
#   6-13
#   8-34
#   7-21
#   9-55
#   8-34
#   10-89
#   89
```

I'm flashing again at a code bunny I had after skimming [Higher Order Perl](https://hop.perl.plover.com/) where the occasional "let's depth-first traverse a whole big file system" tasks I have get different functional payloads depending on what I am asking for today, and that might be a thing to work on soon. I don't do much with anonymous subroutines, but when I do, this tool is so perfect.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
