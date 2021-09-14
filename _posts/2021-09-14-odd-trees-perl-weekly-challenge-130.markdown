---
layout: post
title: "Odd Trees: (Perl) Weekly Challenge #130"
author: "Dave Jacoby"
date: "2021-09-14 14:33:06 -0400"
categories: ""
---

### TASK #1 › Odd Number

> Submitted by: Mohammad S Anwar  
> You are given an array of positive integers, such that all the numbers appear even number of times except one number.
>
> Write a script to find that integer.

So, to recast:

- take a bunch of integers
- count them
- filter out the integers with even counts
- return the first value (which _should_ be the _only_ value)

I'm using the functional way — `map { $hash{$_}++ } @array` — because I like it, but because there's no array being created from `@array`, there are those who thing I should use `for my $i ( @array ) { $hash{$i}++ }`. I get that, but I do like `map`.

This allows us to have the count of integers. We actually have a unique list of those integers, in the form of `keys %hash`, and pedants can `sort` that to make it pretty. Or not. now we want the odd numbers. We want not even, and a number is even if it's evenly divisibile by two, or `$i % 2 == 0`. Because we want odd numbers, we instead use `$i % 2 != 0`.

So, now we have a list of one (if the task is as promised), not one value. So we assign it to a number in list context: `my ($value) = grep {$hash{$_} % 2 != 0} sort keys %hash`. I mean, yeah, cast to array and shift works as well, but I like this.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures };
no warnings qw{ experimental };

use List::Util qw{ uniq };

use JSON;
my $json = JSON->new;

my @examples;
push @examples, [ 2, 5, 4, 4, 5, 5, 2 ];
push @examples, [ 1, 2, 3, 4, 3, 2, 1, 4, 4 ];

for my $e (@examples) {
    my $i = join ', ', $e->@*;
    my $o = odd_numbers( $e->@* );
    say "INPUT:  ( $i )";
    say "OUTPUT: $o";
    say '';
}

sub odd_numbers( @array ) {
    my $x;
    map { $x->{$_}++ } @array;
    my ($o) =
        grep { 0 != $x->{$_} % 2 } uniq sort @array;
    return $o;
}
```

```text
INPUT:  ( 2, 5, 4, 4, 5, 5, 2 )
OUTPUT: 5

INPUT:  ( 1, 2, 3, 4, 3, 2, 1, 4, 4 )
OUTPUT: 4
```

### TASK #2 › Binary Search Tree

> Submitted by: Mohammad S Anwar  
> You are given a tree.
>
> Write a script to find out if the given tree is Binary Search Tree (BST).
>
> According to wikipedia, the definition of BST:
>
> > A binary search tree is a rooted binary tree, whose internal nodes each store a key (and optionally, an associated value), and each has two distinguished sub-trees, commonly denoted left and right. The tree additionally satisfies the binary search property: the key in each node is greater than or equal to any key stored in the left sub-tree, and less than or equal to any key stored in the right sub-tree. The leaves (final nodes) of the tree contain no key and have no structure to distinguish them from one another.

#### Show Me The Code!

I pull out the [Node](https://www.google.com/search?q=site%3Ajacoby.github.io+Node) code. In other places, I have it separated into a module (and [redone with Object::Pad!](https://jacoby.github.io/perl,oop,corinne/2021/09/08/a-first-pass-at-objectpad.html)), but for the challenge, I _like_ having it all in one file, so those wanting to try it just need to run it.

This time, I added two methods, which I call `bst` and `is_bst`, because I lack forethought. The convention is that methods that are internal and shouldn't be used outside the object is `_name`, or in this case, `_is_bst`, because what I need to make this recursive.

...

_\*ahem\*_

_**[THIS looks like a JOB for RECURSION!](https://www.google.com/search?q=%22this+looks+like+a+job+for+recursion%22)**_

(Someday I'll have it on Teespring, I swear.)

So, when we run `$node->is_bst`, there are three choices:

- **It is a leaf.** It has no children to the left or the right. We put the value in the list and return the list. _(There is a joke. I want to use the joke. It isn't a nice joke. I won't use it.)_
- **There is a problem**. There are a few ways to have a problem.

  - there is a value in `left` that is greater than the current node's value
  - there is a value in `right` that is less than the current node's value
  - a child returns an undefined value, which means we're passing on a previous non-bst node

  For the `left` and `right`, I use `grep` to create arrays with every value that _should_ be there if they're bst nodes, and test if they're the same size. If not, I return `undef`.

- **All is good.** `return [@left, $self->value , @right]`. If all is right, this will, node-by-node, return a sorted list.

The _problem_ is, of course, that the examples show boolean — one or zero, true or false — not an array or an undefined value. _This_ conversion, in the form of `return defined $o ? 1 : 0`, is the entire reason for the `bst` method.

(The code in the blog is not 100% the same as submitted. Blogging it means reading and explaining it, and the version in the PR is not necessarily going to pass my post-submission hindsight. Mark Gardiner described it in the Perl CS Discord, saying he's seen bad code in reviews explained with "...it was late", to which he responds "But it's morning now." I try to keep that up for pay code, but toy code? Eh, as long as I don't have to look at it.)

(I have to look at it again to blog it. That's why it's fixed a little here.)

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures };
no warnings qw{ experimental };

{
    say uc 'example 1';
    my $nodes;
    for my $v (qw( 4 5 6 8 9 )) {
        $nodes->{$v} = Node->new($v);
    }
    $nodes->{8}->left( $nodes->{5} );
    $nodes->{8}->right( $nodes->{9} );
    $nodes->{5}->left( $nodes->{4} );
    $nodes->{5}->right( $nodes->{6} );
    say $nodes->{8}->bst();
    say '';
}

{
    say uc 'example 2';
    my $nodes;
    for my $v (qw( 3 4 5 6 7 )) {
        $nodes->{$v} = Node->new($v);
    }
    $nodes->{5}->left( $nodes->{4} );
    $nodes->{5}->right( $nodes->{7} );
    $nodes->{4}->left( $nodes->{3} );
    $nodes->{4}->right( $nodes->{6} );
    say $nodes->{5}->bst();
    say '';
}

package Node;
use List::Util qw{sum0};

sub new ( $class, $value = 0 ) {
    my $self = {};
    $self->{value}      = $value;
    $self->{left}       = undef;
    $self->{right}      = undef;
    $self->{horizontal} = undef;
    $self->{parent}     = undef;
    return bless $self, $class;
}

# is_bst needs to have either an undefined value,
# indicating non-bst, or an array, to determination
# if the parent node is bst, but that's not the
# output the task needs, so here we massage it into
# place
sub bst ( $self ) {
    my $o = $self->is_bst();
    return defined $o ? 1 : 0;
}

# if a node is a leaf, it's balanced
# otherwise, we get the values from the left and right
# we then filter them to remove any that would not be
# in that list if the tree wasn't bst
# if the arrays aren't of equal size, return undef
# if the next level of nodes returns undef, return undef
# ultimate output will either be a sorted list of
# values or undef, and that's basically true or false
sub is_bst( $self ) {

    if ( $self->is_leaf ) { return [ $self->value ]; }

    my @left;
    my @right;
    if ( defined $self->left ) {
        my $local = $self->left()->is_bst();
        return undef if !defined $local;
        push @left, $local->@*;
    }
    if ( defined $self->right ) {
        my $local = $self->right()->is_bst();
        return undef if !defined $local;
        push @right, $local->@*;
    }
    my @left2  = grep { $_ < $self->value } @left;
    my @right2 = grep { $_ > $self->value } @right;

    return undef if scalar @left != scalar @left2;
    return undef if scalar @right != scalar @right2;
    return [ @left, $self->value, @right ];
}

sub distance ( $self ) {
    my $d    = 0;
    my $copy = $self;
    while ( !$copy->is_root ) {
        $copy = $copy->parent;
        $d++;
    }
    return $d;
}

sub value ( $self, $value = undef ) {
    if ( defined $value ) {
        $self->{value} = $value;
    }
    else {
        return $self->{value};
    }
}

sub is_root ( $self ) {
    return defined $self->{parent} ? 0 : 1;
}

sub is_leaf ( $self ) {
    return ( !defined $self->{left} && !defined $self->{right} )
        ? 1
        : 0;
}

sub left ( $self, $node = undef ) {
    if ( defined $node ) {
        $self->{left}   = $node;
        $node->{parent} = $self;
    }
    else {
        return $self->{left};
    }
}

sub right ( $self, $node = undef ) {
    if ( defined $node ) {
        $self->{right}  = $node;
        $node->{parent} = $self;
    }
    else {
        return $self->{right};
    }
}

sub horizontal ( $self, $node = undef ) {
    if ( defined $node ) {
        $self->{horizontal} = $node;
        $node->{parent}     = $self;
    }
    else {
        return $self->{horizontal};
    }
}

sub parent ($self ) {
    return $self->{parent};
}
```

```text
EXAMPLE 1
1

EXAMPLE 2
0
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
