---
layout: post
title: "Trees and Triples: The (Perl) Weekly Challenge #125"
author: "Dave Jacoby"
date: "2021-08-09 15:02:54 -0400"
categories: ""
---

### TASK #1 › Pythagorean Triples

> Submitted by: Cheok-Yin Fung  
> You are given a positive integer `$N`.
>
> Write a script to print all **Pythagorean Triples** containing `$N` as a member. Print -1 if it can’t be a member of any.
>
> Triples with the same set of elements are considered the same, i.e. if your script has already printed (3, 4, 5), (4, 3, 5) should not be printed.
>
> The famous Pythagorean theorem states that in a right angle triangle, the length of the two shorter sides and the length of the longest side are related by a2+b2 = c2.
>
> A **Pythagorean triple** refers to the triple of three integers whose lengths can compose a right-angled triangle.

**A<sup>2</sup> + B<sup>2</sup> = C<sup>2</sup>**

Thing to remember that there's little difference between **A** and **B** here, so you basically need to handle the cases of **A** and **C**. The **C** case is, of course, **A<sup>2</sup> + B<sup>2</sup>**. Handling the **A** case requires solving for C<sup>2</sup> - B<sup>2</sup>.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use feature qw{say state signatures};
use strict;
use warnings;
use utf8;
no warnings qw{ experimental };

use List::Util qw{ uniq };
use JSON;
use Carp;
use Getopt::Long;
my $json = JSON->new->canonical->space_after;

my $n = 5;
GetOptions( 'n=i' => \$n, );

carp 'out of range' if $n <= 0;

my $p = pythagorean_triples($n);
say <<"END";

    INPUT: $n
    OUTPUT: $p

END

sub pythagorean_triples( $n ) {
    my @output;

    push @output, pt_a($n);
    push @output, pt_c($n);

    @output = grep { defined } @output;
    return join ", ", @output if @output;
    return -1;
}

sub pt_a ($n ) {
    my @output;
    my $n2 = $n**2;

    for my $b1 ( 1 .. $n2 ) {
        my $b2 = $b1**2;
        my $c2 = $n2 + $b2;
        my $c  = sqrt $c2;
        next unless int $c == $c;
        my @x = sort { $a <=> $b } map { int $_ } $n, $b1, $c;
        push @output, $json->encode( \@x );
    }
    return uniq @output if @output;
    return undef;
}

sub pt_c ($n ) {
    my @output;
    my $n2 = $n**2;

    for my $a1 ( 1 .. $n2 ) {
        my $a2 = $a1**2;
        for my $b1 ( 1 .. $n2 ) {
            my $b2 = $b1**2;
            my $c2 = $a2 + $b2;
            next if $c2 > $n2;
            if ( $n2 == $c2 ) {
                my @x = sort { $a <=> $b } map { int $_ } $a1, $b1, $n;
                push @output, $json->encode( \@x );
            }
        }
    }
    return uniq @output if @output;
    return undef;
}
```

```text
 $ ./ch-1.pl

    INPUT: 5
    OUTPUT: [3, 4, 5], [5, 12, 13]


$ ./ch-1.pl -n 1

    INPUT: 1
    OUTPUT: -1


$ ./ch-1.pl -n 15

    INPUT: 15
    OUTPUT: [15, 112, 113], [15, 20, 25], [15, 36, 39], [8, 15, 17], [9, 12, 15]


$ ./ch-1.pl -n 25

    INPUT: 25
    OUTPUT: [15, 20, 25], [25, 312, 313], [25, 60, 65], [7, 24, 25]


$ ./ch-1.pl -n 13

    INPUT: 13
    OUTPUT: [13, 84, 85], [5, 12, 13]


```

### TASK #2 › Binary Tree Diameter

> Submitted by: Mohammad S Anwar  
> You are given binary tree as below:

```text
      1
     / \
   2     5
  / \   / \
 3   4 6   7
          / \
         8  10
        /
       9
```

> Write a script to find the diameter of the given binary tree.
>
> The diameter of a binary tree is the length of the longest path between any two nodes in a tree. It doesn’t have to pass through the root.

I grabbed my Node code, which allows me to build the tree. I use a hash of nodes, so I can individually interact with them outside of the tree. I have `is_leaf`, so I can start the search only on leaf nodes. I trust I don't have to prove that, unless you aren't on a leaf node, you don't have the longest diameter.

If you're on a leaf, you're either at the start or at an end. I test if there are options to move to left, right or parent, and add them to a list. Just as a matter of variable juggling, it's easier to see "Are there any other nodes to travel to?" and handle that yes/no, than to do that if you're at a node and the path is longer than 2. At least, I think so.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use feature qw{say state signatures};
use strict;
use warnings;
use utf8;
no warnings qw{ experimental };

use List::Util qw{ max };
use JSON;
my $json = JSON->new->space_after->canonical;

my %nodes;
for my $n ( 1 .. 10 ) {
    my $node = Node->new($n);
    $nodes{$n} = $node;
}

$nodes{1}->left( $nodes{2} );
$nodes{1}->right( $nodes{5} );
$nodes{2}->left( $nodes{3} );
$nodes{2}->right( $nodes{4} );
$nodes{5}->left( $nodes{6} );
$nodes{5}->right( $nodes{7} );
$nodes{7}->left( $nodes{8} );
$nodes{7}->right( $nodes{10} );
$nodes{8}->left( $nodes{9} );

my @diameters;
for my $node ( sort values %nodes ) {
    my $v = $node->value();
    my $l = $node->is_leaf();
    push @diameters, btd($node) if $l;
}

my $max = max map { scalar $_->@* } @diameters;
my $done;

@diameters =
    grep {
    my $s1 = join ' ', $_->@*;
    my $s2 = join ' ', reverse $_->@*;
    $done->{$s1}++;
    $done->{$s2}++;
    $done->{$s1} < 2;
    }
    grep { scalar $_->@* == $max }
    sort { scalar $b->@* <=> scalar $a->@* } @diameters;

say join "\n", map { join " ", ( scalar $_->@* ), ':', $_->@* }

    @diameters;

sub btd ( $node, $path = [] ) {
    my @output;
    my $v = $node->value();
    push $path->@*, $v;

    my @options;
    if ( defined $node->parent() ) {
        my $p  = $node->parent();
        my $pv = $p->value();
        my $is = grep /$pv/, $path->@* ? 1 : 0;
        if ( !grep /$pv/, $path->@* ) {
            push @options, 'parent';
        }
    }
    if ( defined $node->left() ) {
        my $p  = $node->left();
        my $pv = $p->value();
        my $is = grep /$pv/, $path->@* ? 1 : 0;
        if ( !grep /$pv/, $path->@* ) {
            push @options, 'left';
        }
    }
    if ( defined $node->right() ) {
        my $p  = $node->right();
        my $pv = $p->value();
        my $is = grep /$pv/, $path->@* ? 1 : 0;
        if ( !grep /$pv/, $path->@* ) {
            push @options, 'right';
        }
    }

    if (@options) {
        for my $option (@options) {
            if ( $option eq 'parent' ) {
                my $p = $node->parent();
                my $path2->@* = map { int } $path->@*;
                push @output, btd( $p, $path2 );
            }
            if ( $option eq 'left' ) {
                my $p = $node->left();
                my $path2->@* = map { int } $path->@*;
                push @output, btd( $p, $path2 );
            }
            if ( $option eq 'right' ) {
                my $p = $node->right();
                my $path2->@* = map { int } $path->@*;
                push @output, btd( $p, $path2 );
            }
        }
    }
    else {
        push @output, [ map { int } $path->@* ];
    }

    return @output;
}

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
7 : 3 2 1 5 7 8 9
7 : 4 2 1 5 7 8 9
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
