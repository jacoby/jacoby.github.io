---
layout: post
title: "A Stack of Moose: Perl Challenge 95 addendum"
author: "Dave Jacoby"
date: "2021-01-17 17:56:04 -0500"
categories: ""
---

[I have already solved and blogged Challenge 95](https://jacoby.github.io/2021/01/11/ada-bob-hannah-nin-perl-weekly-challenge-95.html), and added:

> If I go ahead and Moose this solution, I’ll make another blog post.

And wouldn't you know, I got around to it. I have never done much with Moose and haven't fully put it into my head. I think that the big deal is that I write `has 'stack' => ( is => 'rw', isa => 'ArrayRef',)` instead of `sub new { ... }`, so that whatever is in `new()` gets handled. There's also case handling. In this case, we say `isa => 'ArrayRef'` but could've written `isa => 'ArrayRef[Int]'` to specify that theis will be a stack of integers, or `'ArrayRef[Num]'` to allow floating-point numbers as well. In the Challenge, we _know_ it'll just be `int`s, but in places where I don't have total control over what everyone else is trying, types make more and more sense.

Which puts me a decade or two behind the rest of the Perl community, perhaps? You know the parts of the language you use, and it never was something I felt encouraged to bolt onto our legacy code mess where I worked the most, so I don't feel bad about it.

Otherwise, there's a _lot_ that looks identical to the non-Moose version I posted previously. `List::Util::min` to avoid crossover with `Stack::min`. `return pop $self->{values}->@*`.

```perl
package Stack;

use strict;
use warnings;
use feature qw{ say signatures state };

use Moose;
use List::Util;

has 'stack' => (
    is  => 'rw',
    isa => 'ArrayRef',
);

sub all {
    my $self = shift;
    say join " ", '  --', $self->{stack}->@*
        if defined $self->{stack}[-1];
}

sub push {
    my $self = shift;
    my $val  = shift;
    push $self->{stack}->@*, $val;
}

sub top {
    my $self = shift;
    return defined $self->{stack}[-1] ? $self->{stack}[-1] : undef;
}

sub min {
    my $self = shift;
    return List::Util::min $self->{stack}->@*;
}

sub pop {
    my $self = shift;
    return defined $self->{stack}[-1]
        ? pop $self->{stack}->@*
        : '';
    return pop $self->{stack}->@*;
}

# I am told this is necessary to keep Moose overhead low. I suppose that means this cuts off the antlers?

no Moose;
__PACKAGE__->meta->make_immutable;
```

I've heard that `Moo` is a smaller `Moose`, so I tried cutting the `se` and running it, and there's a problem with the `ArrayRef`, which I didn't care enough to hunt down.

I guess, right now I'm somewhere between _"there's not enough difference here move from what I already do"_ and _"there's enough new hotness here that I need to get it into my head"_, and finding it a lot easier to search `"perl" "moose" "*keyword*"` than to dig through MetaCPAN for the answers to the questiosn I come up with.

Anyway, this is the promised MOose solution.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
