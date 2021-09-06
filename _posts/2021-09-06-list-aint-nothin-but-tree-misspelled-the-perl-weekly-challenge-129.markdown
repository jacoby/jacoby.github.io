---
layout: post
title: "'List' Ain't Nothin' But 'Tree' Misspelled: The (Perl) Weekly Challenge #129"
author: "Dave Jacoby"
date: "2021-09-06 14:55:45 -0400"
categories: ""
---

Yes, it's another [Weekly Challenge](https://theweeklychallenge.org/blog/perl-weekly-challenge-129/). It's also a thinly-veiled Harlan Ellison reference, at least for me. More later.

### TASK #1 › Root Distance

> Submitted by: Mohammad S Anwar  
> You are given a tree and a node of the given tree.
>
> Write a script to find out the distance of the given node from the root.

Because it's a tree, _of course_ I pull out my Node library again. It makes it so simple!

Because the nodes both form the tree _and_ exist in a hash, getting to the node in question is as easy as `$nodes{$n}`, and we simply climb (up? down?) to the root and count the steps, and that's our result! 

The library has accumulated a number of methods that were important for whatever task they were added for, but are immaterial for most things I'd want to use them for.

Because I can do it so easily, I printed the root distance for every node. Because I was doing both example trees, I decided to not try to handle user input.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures };
no warnings qw{ experimental };

# Planting the first tree
my %nodes;
for my $n ( 1 .. 6 ) {
    my $node = Node->new($n);
    $nodes{$n} = $node;
}
$nodes{1}->left( $nodes{2} );
$nodes{1}->right( $nodes{3} );
$nodes{3}->right( $nodes{4} );
$nodes{4}->left( $nodes{5} );
$nodes{4}->right( $nodes{6} );

say uc 'tree 1';
for my $n ( 1 .. 6 ) {
    my $d = root_distanced( \%nodes, $n );
    say qq{    Node:     $n};
    say qq{    Distance: $d};
    say '';
}

# Planting the second tree
%nodes = ();
for my $n ( 1 .. 9 ) {
    my $node = Node->new($n);
    $nodes{$n} = $node;
}
$nodes{1}->left( $nodes{2} );
$nodes{1}->right( $nodes{3} );
$nodes{2}->left( $nodes{4} );
$nodes{3}->right( $nodes{5} );
$nodes{4}->right( $nodes{6} );
$nodes{5}->left( $nodes{7} );
$nodes{6}->right( $nodes{8} );
$nodes{6}->right( $nodes{9} );

say uc 'tree 2';
for my $n ( 1 .. 9 ) {
    my $d = root_distanced( \%nodes, $n );
    say qq{    Node:     $n};
    say qq{    Distance: $d};
    say '';
}

exit;

# it's fairly simple. If the node is not the root, 
# we travel up (down?) the tree until we find the root.
sub root_distanced ( $nodes, $n ) {
    my $d    = 0;
    my $node = $nodes->{$n};
    while ( !$node->is_root() ) {
        $d++;
        $node = $node->parent();
    }
    return $d;
}

# OF COURSE I pull out my Node code!

package Node;

sub new ( $class, $value = 0 ) {
    my $self = {};
    $self->{value}      = $value;
    $self->{left}       = undef;
    $self->{right}      = undef;
    $self->{horizontal} = undef;
    $self->{parent}     = undef;
    return bless $self, $class;
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

TREE 1
    Node:     1
    Distance: 0

    Node:     2
    Distance: 1

    Node:     3
    Distance: 1

    Node:     4
    Distance: 2

    Node:     5
    Distance: 3

    Node:     6
    Distance: 3

TREE 2
    Node:     1
    Distance: 0

    Node:     2
    Distance: 1

    Node:     3
    Distance: 1

    Node:     4
    Distance: 2

    Node:     5
    Distance: 2

    Node:     6
    Distance: 3

    Node:     7
    Distance: 3

    Node:     8
    Distance: 4

    Node:     9
    Distance: 4
```

### TASK #2 › Add Linked Lists

> Submitted by: Mohammad S Anwar
> You are given two linked list having single digit positive numbers.
>
> Write a script to add the two linked list and create a new linked representing the sum of the two linked list numbers. The two linked lists may or may not have the same number of elements.
>
> HINT: Just a suggestion, feel free to come up with your own unique way to deal with the task. I am expecting a class representing linked list. It should have methods to create a linked list given list of single digit positive numbers and a method to add new member. Also have a method that takes 2 linked list objects and returns a new linked list. Finally a method to print the linked list object in a user friendly format.

I'll put my caveat up front: the output list is reversed from the way it is best read. It isn't as clear in the first example, but the second? 5 + 5 = 10. Remainder = 1, push in 0. 5 + 4 + 1 = 10. Remainder is 1, push in 0. 3 + 6 + 1 = 10. Remainder = 1, push in 0. 2 + 0 + 1 = 3, so push in 3. 1 + 0 (no remainder)  = 1, so push in 1. I should `push`, but `unshift` is a lot simpler. Maybe `reverse_linked_list`?

I did, again, use my Node library, because a tree is kinda a linked list that can sprout a second list out of each node, so if we just just use `right`, we have everything we need.

Anyway, we turn lists into linked lists, then pass the lists (well, the addresses of the root nodes) to the function.

There, we traverse both lists (if we can; assume a value of `0` when there's no defined node), pull the value, add, modulus 10 to see what gets set as a new value, and use the remainder to do the math for the next pair.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures };
no warnings qw{ experimental };

use JSON;
my $json = JSON->new;

my @examples;
push @examples, [ [ 1, 2, 3 ], [ 3, 2, 1 ], ];
push @examples, [ [ 1, 2, 3, 4, 5 ], [ 6, 5, 5 ], ];

for my $e (@examples) {
    my ( $l1, $l2 ) = $e->@*;
    my $ll1 = create_linked_list($l1);
    my $ll2 = create_linked_list($l2);
    my $added = add_linked_lists( $ll1, $ll2 );
    print 'L1:      ';
    print_list($ll1);
    print 'L2:      ';
    print_list($ll2);
    print 'Output:  ';
    print_list($added);
    say '';
}

sub add_linked_lists ( $ll1, $ll2 ) {
    my $root;
    my $remainder = 0;
    while ( defined $ll1 ) {
        my $v1;
        my $v2;
        if ( defined $ll1 ) {
            $v1  = $ll1->value();
            $ll1 = $ll1->right();
        }
        else { $v1 = 0; }

        if ( defined $ll2 ) {
            $v2  = $ll2->value();
            $ll2 = $ll2->right();
        }
        else { $v2 = 0; }

        my $vv = $v1 + $v2 + $remainder;
        my $v  = $vv % 10;
        $remainder = int( $vv / 10 );

        my $node = Node->new($v);
        $node->right($root);
        $root = $node;

    }
    return $root;
}

sub create_linked_list( $ref ) {
    my $root;
    for my $v ( $ref->@* ) {
        my $node = Node->new($v);
        $node->right($root);
        $root = $node;
    }
    return $root;
}

sub print_list ( $node ) {
    print '>> ';
    while ( defined $node ) {
        print $node->value();
        print ' -> ' if defined $node->right();
        $node = $node->right();
    }
    say ' <<';
}

# if we ignore left() and parent(), Node works as a singly-linked list

package Node;

sub new ( $class, $value = 0 ) {
    my $self = {};
    $self->{value}      = $value;
    $self->{left}       = undef;
    $self->{right}      = undef;
    $self->{horizontal} = undef;
    $self->{parent}     = undef;
    return bless $self, $class;
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
L1:      >> 3 -> 2 -> 1 <<
L2:      >> 1 -> 2 -> 3 <<
Output:  >> 4 -> 4 -> 4 <<

L1:      >> 5 -> 4 -> 3 -> 2 -> 1 <<
L2:      >> 5 -> 5 -> 6 <<
Output:  >> 1 -> 3 -> 0 -> 0 -> 0 <<
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
