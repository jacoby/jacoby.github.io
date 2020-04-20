---
layout: post
title:  "Challenge 57: Mostly Binary Trees"
author: "Dave Jacoby"
date:   "2020-04-20 18:31:02 -0400"
categories: ""
---



## TASK #2 › Shortest Unique Prefix

> Write a script to find the shortest unique prefix for each each word in the given list. The prefixes will not necessarily be of the same length.
>
> Sample Input
>
> `[ "alphabet", "book", "carpet", "cadmium", "cadeau", "alpine" ]`
>
> Expected Output
>
> `[ "alph", "b", "car", "cadm", "cade", "alpi" ]`

It seems that a lot of these challenges are analogous of the [Completion Backward Principle](https://open.spotify.com/album/3YVb9ns1i0WdzF1cdnLYWi?si=WnMGxQgDSUahGzN8NJldJw), which states that for a long-playing record, the best songs are at the beginning of side B, or in this case, the toughest problems are the second task.

In this case, the interesting bits to play with are `substr`, which gives you a part of the string in question, and `grep`, which returns an array that matches what you want. Also, named loops, I suppose.

```perl
sub sup( @words ) {
    for my $word (@words) {
        my $c = 1;
      INNER: while (1) {

            # returns the first c characters of a string
            my $sub = substr( $word, 0, $c );

            # returns the number of matches for that substring
            my $n   = scalar grep { m{^$sub} } @words;

            # when we've identified the smallest string
            if ( $n == 1 ) {
                push @output, $sub;
                last INNER;
            }

            # when the smallest unique prefix is the whole string
            if ( $sub eq $word ) {
                push @output, $word;
                last INNER;
            }
            $c++;
        }
    }
    return @output;
}
```

## TASK #1 › Invert Tree

> You are given a **full binary tree** of any height, similar to the one below:
> 
> ![first tree](https://perlweeklychallenge.org/images/blog/pwc-057-1.svg)
> 
> Write a script to **invert** the tree, by mirroring the children of every node, from left to right. The expected output from the tree above would be:
> 
> ![reversed tree](https://perlweeklychallenge.org/images/blog/pwc-057-2.svg)
> 
> The input can be any sensible machine-readable binary tree format of your choosing, and the output should be the same format.

### BONUS

> In addition to the above, you may wish to pretty-print your binary tree in a human readable text-based format similar to the following:

```
       1
      /  \
     3    2
    / \  / \
   7   6 5  4
```

First, we modify last week's `Node`. Rather than having an array for children, we have distinct `left` and `right`.

```perl
package Node;

sub new ( $class, $value = 0 ) {
    my $self = {};
    $self->{value}  = $value;
    $self->{left}   = undef;
    $self->{right}  = undef;
    $self->{parent} = undef;
    return bless $self, $class;
}

sub value ( $self ) {
    return $self->{value};
}

sub is_root ( $self ) {
    return defined $self->{parent} ? 0 : 1;
}

sub is_leaf ( $self ) {
    return $self->{left} eq undef
      && $self->{right} eq undef ? 1 : 0;
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

sub parent ($self ) {
    return $self->{parent};
}
```

With that, a reminder that, [_"(as) a programmer, all you're dealing with are arrays and hashes. Nothing scary."_](https://varlogrant.blogspot.com/2016/11/graphs-are-not-that-scary.html) In this case, a list of nodes and a list of edges. In this case, it is important to keep track of whether the node is on a left or right edge, so we'll have a `nodes` array, a hash of `left` edges and a hash of `right` edges.

```json
{
  "left": {
    "1": 2,
    "2": 4,
    "3": 6
  },
  "nodes": [1, 2, 3, 4, 5, 6, 7],
  "right": {
    "1": 3,
    "2": 5,
    "3": 7
  }
}
```

We _could_ throw everything into a [Graph](https://metacpan.org/pod/Graph) object, especially if we wanted to export with [Graph::D3](https://metacpan.org/pod/Graph::D3) so we can have visualization fun with [D3.js](https://d3js.org/), but that's _far_ beyond where the requirements go. I'm just using JSON to make everything transparent and working without installing non-Core modules.

So, how do we import a tree? And while we're on it, how do we export a tree? 

In short, we create a hash of nodes, so when we want the node for `4`, we just look in `$nodes{4}`, but each node, where applicable, has a `left` and `right` child set, and looking back to `Node`, you'll see that when `$root->left($node)` is run, not only does `$root->{left} == $node`, but `$node->{parent} == $root`.

Since `import_tree` is making a hash of `Node`s from arrays and hashes, `export_tree` is making arrays and hashes from a hash of `Node`s.

Plus, `import_tree` only reads from a file, while `export_tree` prints to either a file or to STDOUT.

```perl
sub import_tree ( $file = "" ) {
    if ( -f $file && open my $fh, '<', $file ) {
        my $text  = join '', <$fh>;
        my $obj   = $json->decode($text);
        my %nodes = map { $_ => Node->new($_) } $obj->{nodes}->@*;
        for my $id ( $obj->{nodes}->@* ) {
            my $left  = $obj->{left}{$id};
            my $right = $obj->{right}{$id};
            $nodes{$id}->left( $nodes{$left} )   if defined $left;
            $nodes{$id}->right( $nodes{$right} ) if defined $right;
        }
        return wantarray ? %nodes : \%nodes;
    }
    exit;
}

sub export_tree ( $nodes, $file = undef ) {
    my $obj = {};
    for my $node ( values $nodes->%* ) {
        my $left  = $node->left();
        my $right = $node->right();
        my $id    = $node->value();
        push $obj->{nodes}->@*, $id;
        $obj->{left}{$id}  = $left->value()  if $left;
        $obj->{right}{$id} = $right->value() if $right;
    }
    $obj->{nodes}->@* = sort $obj->{nodes}->@*;
    if ( defined $file && open my $fh, '>', $file ) {
        say $fh $json->encode($obj);
    }
    else {
        say $json->encode($obj);
    }
}
```

So, the reversal. I had thoughts about whole-tree reversals and such, but really, that's too much work. For every node, you just have to replace the left child with the right and vice versa. Again, we're _way_ relying on the data to not be a cyclic graph, although I suppose we could add a `done` hash to avoid doubling up. 

```perl
sub reverse_tree( $node ) {
    if ( defined $node->left() && defined $node->right() ) {
        my $store = $node->left();
        $node->left( $node->right() );
        $node->right($store);
    }
    elsif ( defined $node->left() ) {
        $node->right( $node->left() );
        $node->{left} = undef;
    }
    elsif ( defined $node->right() ) {
        $node->left( $node->right() );
        $node->{right} = undef;
    }
    reverse_tree( $node->left() )  if $node->left();
    reverse_tree( $node->right() ) if $node->right();
}
```

We need to find the root of the tree and run `reverse_tree` on that, or else we'll have a partial reversal, but that's easy.

```perl
sub find_root( $node ) {
    return $node if ( $node->is_root );
    return find_root( $node->parent() );
}
```

We can also find if this _is_ a binary tree, rather than trust that it is.

```perl
sub tree_depth ( $node ) {
    return 0 if $node->is_root();
    return 1 + tree_depth( $node->parent() );
}

sub is_binary_tree ( $node ) {
    state $depth = -1;

    # if all the leaves are at the same depth
    # return 1, else return 0
    if ( $node->is_leaf ) {
        my $d = tree_depth($node);
        $depth = $d if $depth < 0;
        return 0 if $depth != $d;
        return 1;
    }

    # return 0 if we don't have two children
    return 0 unless defined $node->left && defined $node->right;
    return ( is_binary_tree( $node->left ) && is_binary_tree( $node->right ) );
}
```

Then there's the **Bonus**, and while it _works_, I'm not happiest with the aesthetics of it.

```perl
sub display_tree ( $node, $depth = 0, $arrayref = [] ) {

    # instead of hash or Node display, we're pulling it
    # to $arrayref->[ depth ][ left .. right ]
    if ($node) {
        push $arrayref->[$depth]->@*, $node->value();
        display_tree( $node->left(),  $depth + 1, $arrayref );
        display_tree( $node->right(), $depth + 1, $arrayref );
    }
    else {
        push $arrayref->[$depth]->@*, '_';
    }

    # when we've recursed and returned to the root
    if ( $depth == 0 ) {
        my $max   = $arrayref->@*;
        my $w     = 4 + ( 2**$max );
        my $edges = q{/  \\};
        for my $i ( 0 .. -1 + scalar $arrayref->@* ) {
            my $l = $arrayref->[$i];
            next unless scalar grep { $_ ne '_' } $l->@*;
            if ( $i > 0 ) {
                my $l    = $arrayref->[ $i - 1 ];
                my $str2 = join '    ', map { $edges } $l->@*;
                my $pad2 = ' ' x ( $w - int( 0.5 * length $str2 ) );
                say qq{$pad2$str2};
            }
            my $str = join '    ', $l->@*;
            my $pad = ' ' x ( $w - int( 0.5 * length $str ) );
            say qq{$pad$str};
        }
    }
}
```

In short, we pull it into an array-of-arrays and display and indent things based on that. There's alignment and tweaking to be done, but below is the code 

```text
                    1
                  /  \
                 2    3
              /  \    /  \
            4    5    6    7
                    1
                  /  \
                 3    2
              /  \    /  \
            7    6    5    4
```

Now, the code in total.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ fc postderef say signatures state switch };
no warnings qw{ experimental };

use List::Util qw{max};
use JSON;

my $json  = JSON->new->pretty->canonical;
my %nodes = import_tree( $ARGV[0] );

my ($rand) = keys %nodes;
my $root = find_root( $nodes{$rand} );

if ( is_binary_tree($root) ) {
    display_tree($root);
    reverse_tree($root);
    display_tree($root);
    export_tree( \%nodes, $ARGV[1] );
}

exit;

sub tree_depth ( $node ) {
    return 0 if $node->is_root();
    return 1 + tree_depth( $node->parent() );
}

sub is_binary_tree ( $node ) {
    state $depth = -1;

    # if all the leaves are at the same depth
    # return 1, else return 0
    if ( $node->is_leaf ) {
        my $d = tree_depth($node);
        $depth = $d if $depth < 0;
        return 0 if $depth != $d;
        return 1;
    }

    # return 0 if we don't have two children
    return 0 unless defined $node->left && defined $node->right;
    return ( is_binary_tree( $node->left ) && is_binary_tree( $node->right ) );
}

sub display_tree ( $node, $depth = 0, $arrayref = [] ) {

    # instead of hash or Node display, we're pulling it
    # to $arrayref->[ depth ][ left .. right ]
    if ($node) {
        push $arrayref->[$depth]->@*, $node->value();
        display_tree( $node->left(),  $depth + 1, $arrayref );
        display_tree( $node->right(), $depth + 1, $arrayref );
    }
    else {
        push $arrayref->[$depth]->@*, '_';
    }

    # when we've recursed and returned to the root
    if ( $depth == 0 ) {
        my $max   = $arrayref->@*;
        my $w     = 4 + ( 2**$max );
        my $edges = q{/  \\};
        for my $i ( 0 .. -1 + scalar $arrayref->@* ) {
            my $l = $arrayref->[$i];
            next unless scalar grep { $_ ne '_' } $l->@*;
            if ( $i > 0 ) {
                my $l    = $arrayref->[ $i - 1 ];
                my $str2 = join '    ', map { $edges } $l->@*;
                my $pad2 = ' ' x ( $w - int( 0.5 * length $str2 ) );
                say qq{$pad2$str2};
            }
            my $str = join '    ', $l->@*;
            my $pad = ' ' x ( $w - int( 0.5 * length $str ) );
            say qq{$pad$str};
        }
    }
}

sub reverse_tree( $node ) {
    if ( defined $node->left() && defined $node->right() ) {
        my $store = $node->left();
        $node->left( $node->right() );
        $node->right($store);
    }
    elsif ( defined $node->left() ) {
        $node->right( $node->left() );
        $node->{left} = undef;
    }
    elsif ( defined $node->right() ) {
        $node->left( $node->right() );
        $node->{right} = undef;
    }
    reverse_tree( $node->left() )  if $node->left();
    reverse_tree( $node->right() ) if $node->right();
}

sub find_root( $node ) {
    return $node if ( $node->is_root );
    return find_root( $node->parent() );
}

sub import_tree ( $file = "" ) {
    if ( -f $file && open my $fh, '<', $file ) {
        my $text  = join '', <$fh>;
        my $obj   = $json->decode($text);
        my %nodes = map { $_ => Node->new($_) } $obj->{nodes}->@*;
        for my $id ( $obj->{nodes}->@* ) {
            my $left  = $obj->{left}{$id};
            my $right = $obj->{right}{$id};
            $nodes{$id}->left( $nodes{$left} )   if defined $left;
            $nodes{$id}->right( $nodes{$right} ) if defined $right;
        }
        return wantarray ? %nodes : \%nodes;
    }
    exit;
}

sub export_tree ( $nodes, $file = undef ) {
    my $obj = {};
    for my $node ( values $nodes->%* ) {
        my $left  = $node->left();
        my $right = $node->right();
        my $id    = $node->value();
        push $obj->{nodes}->@*, $id;
        $obj->{left}{$id}  = $left->value()  if $left;
        $obj->{right}{$id} = $right->value() if $right;
    }
    $obj->{nodes}->@* = sort $obj->{nodes}->@*;
    if ( defined $file && open my $fh, '>', $file ) {
        say $fh $json->encode($obj);
    }
    else {
        say $json->encode($obj);
    }
}

package Node;

sub new ( $class, $value = 0 ) {
    my $self = {};
    $self->{value}  = $value;
    $self->{left}   = undef;
    $self->{right}  = undef;
    $self->{parent} = undef;
    return bless $self, $class;
}

sub value ( $self ) {
    return $self->{value};
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

sub parent ($self ) {
    return $self->{parent};
}
```


#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
