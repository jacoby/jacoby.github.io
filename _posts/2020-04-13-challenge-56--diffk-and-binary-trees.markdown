---
layout: post
title: "Challenge 56 - Diff-K and Binary Trees"
author: "Dave Jacoby"
date: "2020-04-13 18:21:34 -0400"
categories: ""
---

Responding to [Perl Weekly Challenge #56](https://perlweeklychallenge.org/blog/perl-weekly-challenge-056/)

### TASK #1 - Diff-K

> You are given an array **@N** of positive integers (sorted) and another non negative integer **k**.
>
> Write a script to find if there exists 2 indices **i** and **j** such that **A[i] - A[j] = k** and **i != j**.
>
> It should print the pairs of indices, if any such pairs exist.
>
> Example:
>
> `@N = (2, 7, 9)` <br>  `$k = 2`
>
> Output : `2,1`

I'm assuming the givens -- sorted array of positive integers, non-negative integer, and passing an array and separating them in the signature in `( $k, @N )`.

If `k = N[j] - N[i]`, `k >= 0` and `i != j`, `k` can only equal `0` if there are duplicate integers, so `N[i] == N[j]` can be true as long as `i !- j`.

So, nested loops where `j` is outside and `i` is inside, starting with `j+1`.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ fc postderef say signatures state switch };
no warnings qw{ experimental };

diffk( 2, 2, 7, 9 );

sub diffk ( $k, @N ) {
    for my $j ( 0 .. -1 + scalar @N ) {
        for my $i ( $j + 1 .. -1 + scalar @N ) {
            next if $i == $j;
            next unless $k == $N[$i] - $N[$j];
            say join ", ", $i, $j;
        }
    }

}

# $ ./ch-1.pl
# 2, 1
```

### TASK #2 - Path Sum

> You are given a binary tree and a sum, write a script to find if the tree has a path such that adding up all the values along the path equals the given sum. Only complete paths (from root to leaf node) may be considered for a sum.
>
> Given the below binary tree and sum = 22, the partial path sum 5 → 8 → 9 = 22 is not valid.
>
> The script should return the path 5 → 4 → 11 → 2 whose sum is 22.

```text
          5
         / \
        4   8
       /   / \
      11  13  9
     /  \      \
    7    2      1
```

This looks like a job for _**Recursion!**_

I mean, can you do iteration over a tree?

And we also need a concept of a Node, where it has a value, has children, and knows if it's a leaf or not. I recall trees being read left-to-right, so **5->4->11->7** is read before **5->4->11->2**, so child sorting isn't necessary. We're keeping this tree binary by ourselves, not enforcing it within the code, so this is a fairly naive Node implementation.

I solved this once without a `parent` link, keeping track of totals and paths, but then I thought a moment and considered the ease, and being able to trace up once you find a leaf makes the code easier. The spidering assumes an acyclic graph; I could easily make something with cycles and make it loop through forever, but that wouldn't solve this problem, would it?

```perl
package Node;

sub new ( $class, $value = 0 ) {
    my $self = {};
    $self->{value}    = $value;
    $self->{children} = [];
    $self->{parent}   = undef;
    return bless $self, $class;
}

sub value ( $self ) {
    return $self->{value};
}

sub is_root ( $self ) {
    return defined $self->{parent} ? 0 : 1;
}

sub is_leaf ( $self ) {
    return scalar $self->{children}->@* ? 0 : 1;
}

sub add_child ( $self, $node ) {
    $node->{parent} = $self;
    push $self->{children}->@*, $node;
}

sub children( $self ) {
    return $self->{children}->@*;
}

sub parent ($self ) {
    return $self->{parent};
}
```

I tried to do `$node->add_child( new Node(8))` but it wasn't working for me,
so I create a hash full of nodes and create the tree that way.

```perl
# make the tree
my $hash->%* = map { $_ => new Node($_) } 1 .. 13;
$hash->{5}->add_child( $hash->{4} );
$hash->{5}->add_child( $hash->{8} );
$hash->{4}->add_child( $hash->{11} );
$hash->{11}->add_child( $hash->{7} );
$hash->{11}->add_child( $hash->{2} );
$hash->{8}->add_child( $hash->{13} );
$hash->{8}->add_child( $hash->{9} );
$hash->{9}->add_child( $hash->{1} );
```

Yes, there are some nodes that are created but not included, but that's fine.

The only thing left is to traverse the tree. Once we find a leaf node, we trace it back to the root, making the total and the path as we go.

```perl
spider_tree( $hash->{5}, 22 );

sub spider_tree ( $node, $value ) {
    if ( $node->is_leaf() ) {
        my $x = $node;
        my $t = $x->value();
        my @p = ( $x->value() );
        while ( !$x->is_root ) {
            $x = $x->parent();
            $t += $x->value();
            unshift @p, $x->value();
        }
        if ( $t == $value ) {
            say $t;
            say join ' -> ', @p;
        }
    }
    for my $child ( $node->children() ) {
        spider_tree( $child, $value );
    }
}
```

The code as a whole:

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings qw{ experimental };

# make the tree
my $hash->%* = map { $_ => new Node($_) } 1 .. 13;
$hash->{5}->add_child( $hash->{4} );
$hash->{5}->add_child( $hash->{8} );
$hash->{4}->add_child( $hash->{11} );
$hash->{11}->add_child( $hash->{7} );
$hash->{11}->add_child( $hash->{2} );
$hash->{8}->add_child( $hash->{13} );
$hash->{8}->add_child( $hash->{9} );
$hash->{9}->add_child( $hash->{1} );

spider_tree( $hash->{5}, 22 );

sub spider_tree ( $node, $value ) {
    if ( $node->is_leaf() ) {
        my $x = $node;
        my $t = $x->value();
        my @p = ( $x->value() );
        while ( !$x->is_root ) {
            $x = $x->parent();
            $t += $x->value();
            unshift @p, $x->value();
        }
        if ( $t == $value ) {
            say $t;
            say join ' -> ', @p;
        }
    }
    for my $child ( $node->children() ) {
        spider_tree( $child, $value );
    }
}

package Node;

sub new ( $class, $value = 0 ) {
    my $self = {};
    $self->{value}    = $value;
    $self->{children} = [];
    $self->{parent}   = undef;
    return bless $self, $class;
}

sub value ( $self ) {
    return $self->{value};
}

sub is_root ( $self ) {
    return defined $self->{parent} ? 0 : 1;
}

sub is_leaf ( $self ) {
    return scalar $self->{children}->@* ? 0 : 1;
}

sub add_child ( $self, $node ) {
    $node->{parent} = $self;
    push $self->{children}->@*, $node;
}

sub children( $self ) {
    return $self->{children}->@*;
}

sub parent ($self ) {
    return $self->{parent};
}

# $ ./ch-2.pl
# 22  22  5->4->11->2
```

A friend asked about the Word Ladder code I wrote about when engaging with Dijkstra's Algorithm, titled ["Graphs are not that Scary"](https://varlogrant.blogspot.com/2016/11/graphs-are-not-that-scary.html), and I think this code proves that point again.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io)
