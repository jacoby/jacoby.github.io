---
layout: post
title: "Common Paths and an issue with postderef?"
author: "Dave Jacoby"
date: "2019-06-11 13:45:37 -0400"
categories: ""
---

I started in on the [Perl Weekly Challenge](https://perlweeklychallenge.org/blog/perl-weekly-challenge-012/) and jumped to **Challlenge #2**.

> Write a script that finds the common directory path,
> given a collection of paths and directory separator.
> For example, if the following paths are supplied.

My first thought would be to put everything into hashrefs, and check how deep in `1 == scalar keys $hashref` was true, but I found it difficult to think about how to dynamically make `$hashref->{""}{a}{b}{c}{d}`.

So, instead of hashrefs, arrayrefs. That's easy. `my @p2 = map { [ split m{/} ] } grep { m{^/} } @paths`.

First pass, I had a two-exit solution, which is insufficiently clever and insufficiently DRY, so I thought again and came up with this:

```perl
# excuse the lack of headers -- see elow

my @p2 = map { [ split m{/} ] } grep { m{^/} } @paths;

while (1) {
    state $c = 0;
    my $d = 0;
    for my $p (@p2) {
        if ( !defined $p2[$d][$c] || $p2[0][$c] ne $p2[$d][$c] ) {
            say join '/', $p2[0][ 0 .. $c - 1];
            exit;
        }
        $d++;
    }
    $c++;
}
```

```text
a
```

No. Wait...

`0 .. 2` is a range, and it should give us `0,1,2`. And `$p2[0][0,1,2]` should be an array slice of `$p2[0]`, and should be `['','a','b']`.

```perl
        if ( !defined $p2[$d][$c] || $p2[0][$c] ne $p2[$d][$c] ) {
            say join '/', $p2[0][ 0 .. $c - 1];
            say join '/', $p2[0][ 0 , 1, 2];
            exit;
        }
```

```text
a
b
```

Umm...

This is seriously violating the [Priniciple of Least Astonishment](https://en.wikipedia.org/wiki/Principle_of_least_astonishment) for me.

Dang it, let's force it.

```perl
        if ( !defined $p2[$d][$c] || $p2[0][$c] ne $p2[$d][$c] ) {
            say join '/', @{ $p2[0] }[ 0 .. $c - 1 ];
            exit;
        }
```

```text
/a/b
```

That looks better.

That program, in full:

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say state };
no warnings qw{ experimental::postderef };

my @paths;
push @paths, '/a/b/c/d';
push @paths, '/a/b/cd';
push @paths, '/a/b/cc';
push @paths, '/a/b/c/d/e';

my @p2 = map { [ split m{/} ] } grep { m{^/} } @paths;

while (1) {
    state $c = 0;
    my $d = 0;
    for my $p (@p2) {
        if ( !defined $p2[$d][$c] || $p2[0][$c] ne $p2[$d][$c] ) {
            say join '/', @{ $p2[0] }[ 0 .. $c - 1 ];
            exit;
        }
        $d++;
    }
    $c++;
}

exit;
```

We could've gone with `join '/', map { $p2[0][$_] } 0 .. $c - 1`, and that's the one I put in the repo, but dereferencing in a non-`postderef` way proves, I think, that it is a bug with `postderef`. So, now I have to file a bug report or something. I didn't expect that.

Anyway, Happy Coding!

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
