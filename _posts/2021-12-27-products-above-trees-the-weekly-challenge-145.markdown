---
layout: post
title: "Products above Trees?: The Weekly Challenge #145"
author: "Dave Jacoby"
date: "2021-12-27 18:09:45 -0500"
categories: ""
---

I'm back, and walking through my solution to [Weekly Challenge #145](https://theweeklychallenge.org/blog/perl-weekly-challenge-145/). That's 19 \* 5, and there must be [some other properties it has](<https://en.wikipedia.org/wiki/145_(number)>)...

It's a strong Fermat pseudoprime! It's pentagonal and a centered square number! Also **145** == **12<sup>2</sup> + 1<sup>2</sup>** == **8<sup>2</sup> + 8<sup>2</sup>** and also **145** == **1!** + **4!** + **5!**, which sounds like a _bunch_ of challenge prompts to me.

### TASK #1 › Dot Product

> Submitted by: Mohammad S Anwar  
> You are given 2 arrays of same size, **@a** and **@b**.
>
> Write a script to implement **Dot Product**.

Because we're promised _2 arrays of same size_, and are told to do dot products, I'm assuming that I'm going to be getting two arrays, the same size, filled with numbers. Not that non-number strings can't be treated like numbers. Consider `my $a = 'a'; while (1) { say $a++ }` some time.

Sorry, but reading Ovid talk about how Perl should have types some day brought that to mind. If I was writing production code, I would absolutely check to see that I'm getting two arrays, that what they're arrays of look like numbers, and that the arrays are of the same size. I _like_ demonstrating that reasonably-clever bog-standard Perl 5 can be readable, but protecting your code from iffy input is good.

Moving forward, we have two arrays of the same length, so

> `1 ... scalar @array`

will give you a number for every position, but it's one-indexed and we like zero-indexing, so

> `map { $_ - 1 } 1 .. scalar @array`

will give you something to address the same position in both arrays. Another map

> `map { $x->[$_] * $y->[$_] } map { $_ - 1 } 1 .. scalar @array`

then gives you each product, which, for the example, would be `[4, 10, 18]`, so we go back to [List::Util](https://metacpan.org/pod/List::Util) for `sum`, and return that sum.

It's pretty much a one-liner solution!

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say state postderef signatures };
no warnings qw{ experimental };

use List::Util qw{ sum };

my @examples;
push @examples, [ [ 1, 2, 3 ], [ 4, 5, 6 ] ];
push @examples,
    [ [ map { int rand 10 } 1 .. 5 ], [ map { int rand 10 } 1 .. 5 ], ];

for my $e (@examples) {
    my $a = join ', ', $e->[0]->@*;
    my $b = join ', ', $e->[1]->@*;
    my $o = dot_product( $e->@* );
    say <<"END";
        \@a = ($a)
        \@b = ($b)
        \$dot_product = $o
END
}

sub dot_product ( $x, $y ) {
    return sum
        map { $x->[$_] * $y->[$_] }
        map { $_ - 1 } 1 .. scalar $x->@*;
}
```

```text
$ ./ch-1.pl
        @a = (1, 2, 3)
        @b = (4, 5, 6)
        $dot_product = 32

        @a = (6, 9, 6, 0, 7)
        @b = (1, 2, 0, 4, 6)
        $dot_product = 66
```

### TASK #2 › Palindromic Tree

> Submitted by: Mohammad S Anwar  
> You are given a string **$s**.
>
> Write a script to create a **Palindromic Tree** for the given string.
>
> I found this [blog](https://medium.com/@alessiopiergiacomi/eertree-or-palindromic-tree-82453e75025b) exaplaining **Palindromic Tree** in detail.

I did not read the description of the eertree, but rather, looked at the output and built back. The string `redivider` has five distinct letters: `r,e,d,i,v`, which we get by removing duplicates. From that, we look for substrings that both start and end with that letter, and by starting at the widest and working in, we can be sure we're getting the biggest palindrome if there is one, so we can skip out then. If we were doing recursion, we could just return, but this is an iterative solution, so we're using loop labels.

I would assume there's an implicit data structure I'm missing, but I matched the output, so _shrug emoji_?

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

my @examples;
push @examples, 'redivider';
push @examples, 'deific';
push @examples, 'rotors';
push @examples, 'challenge';
push @examples, 'champion';
push @examples, 'christmas';
push @examples, 'sever';
push @examples, 'seer';
push @examples, 'reverse';

for my $e (@examples) {
    palindrome_tree($e);
    say '';
}

sub palindrome_tree($e ) {
    my %d;
    my @output;
    my @letters = grep { $d{$_}++ < 1 } split //, $e;

    say $e;

    for my $i (@letters) {
        push @output, $i;
        my $len = length $e;
    LETTER: for my $x ( 0 .. $len ) {
            my $l = substr $e, $x, 1;
            next if $l ne $i;
            my $string = substr $e, $x;
            my $slen   = length $string;
            for my $y ( reverse 2 .. $slen ) {
                my $substr  = substr $string, 0, $y;
                my $reverse = reverse $substr;
                if ( $substr eq $reverse ) {
                    push @output, $substr;
                    next LETTER;
                }
            }
        }
    }
    say join ' ', @output;
}
```

```text
$ ./ch-2.pl
redivider
r redivider e edivide d divid i ivi v

deific
d e i ifi f c

rotors
r rotor o oto t s

challenge
c h a l ll e n g

champion
c h a m p i o n

christmas
c h r i s t m a

sever
s e eve v r

seer
s e ee r

reverse
r rever e eve v s
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
