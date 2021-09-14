---
layout: post
title: "A First Pass at Object::Pad"
author: "Dave Jacoby"
date: "2021-09-08 19:12:51 -0400"
categories: "perl,OOP,Corinne"
---

[Paul Evans](https://metacpan.org/author/PEVANS) talked about [Object::Pad](https://metacpan.org/pod/Object::Pad) to [Purdue Perl Mongers](https://purdue.pl/), which made me think about Object Orientation.

Historically, the module I'm responsible for that's run most often is a hackish double-wrapper around the DBI module so I can easily deal with MySQL and/or MariaDB without too much boilerplate, but the module I'm responsible for that I'm most likely to pull out as a programmer is my Node code that I use for [Weekly Challenge](https://theweeklychallenge.org/) tasks. It looks like this (repackaged to be stand-alone and not pasted into the task code):

```perl
package Node;
use strict;
use warnings;
use feature qw{ say postderef signatures };
no warnings qw{ experimental };

sub new ( $class, $value = 0 ) {
    my $self = {};
    $self->{value}  = $value;
    $self->{left}   = undef;
    $self->{right}  = undef;
    $self->{parent} = undef;
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

sub parent ($self ) {
    return $self->{parent};
}

sub depth ($self) {
    my $depth = 0;
    my $copy  = $self;
    while ( !$copy->is_root ) {
        $depth++;
        $copy = $copy->parent;
    }
    return $depth;
}

1
```

Let's see it in action:

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use Cwd qw( abs_path );
use File::Basename qw( dirname );
use lib dirname( abs_path($0) );
use Node;

my %nodes;
for my $n ( 1 .. 9 ) {
    $nodes{$n} = Node->new($n);
}

$nodes{1}->left( $nodes{2} );
$nodes{1}->right( $nodes{3} );
$nodes{2}->left( $nodes{4} );
$nodes{2}->right( $nodes{5} );
$nodes{3}->left( $nodes{6} );
$nodes{3}->right( $nodes{7} );
$nodes{4}->left( $nodes{8} );
$nodes{6}->right( $nodes{9} );

my $x = <<'END';

0              1
             /   \
1           2     3
          / \    / \
2        4   5  6   7
        /        \
3      8          9

END

say $x;
say join "\t", '>>>>', qw{ Value Root RorP LorD Leaf Depth }, '<<<<';
for my $n ( sort keys %nodes ) {
    say join "\t ",

        '>>>',
        $nodes{$n}->value,
        $nodes{$n}->is_root,
        ( $nodes{$n}->is_root ? 'R' : $nodes{$n}->parent->value ),
        (
        $nodes{$n}->is_leaf
        ? 'L'
        : join ' + ',
        defined $nodes{$n}->left  ? $nodes{$n}->left->value  : '_',
        defined $nodes{$n}->right ? $nodes{$n}->right->value : '_',
        ),
        $nodes{$n}->is_leaf,
        $nodes{$n}->depth,
        '<<<';
}
```

```text


0              1
             /   \
1           2     3
          / \    / \
2        4   5  6   7
        /        \
3      8          9


>>>>    Value   Root    RorP    LorD    Leaf    Depth   <<<<
>>>      1       1       R       2 + 3   0       0       <<<
>>>      2       0       1       4 + 5   0       1       <<<
>>>      3       0       1       6 + 7   0       1       <<<
>>>      4       0       2       8 + _   0       2       <<<
>>>      5       0       2       L       1       2       <<<
>>>      6       0       3       _ + 9   0       2       <<<
>>>      7       0       3       L       1       2       <<<
>>>      8       0       4       L       1       3       <<<
>>>      9       0       6       L       1       3       <<<
```

I'm okay with this. It isn't the greatest code, but I think it's all fairly understandable, and it works. For each node, we display the **Value**, whether it's a **Root** or not, Root or value of the parent (**RorP**), Leaf or the values of the child nodes (**LorD**), whether it's a **Leaf** and the level, or **Depth** of the node in the tree.

## The New Hotness

So, while trying to get my feet under me, I scratched together another library, `CorNode`, which uses Object::Pad (`Cor` because of Object::Pad's role as being a test implementation of [Corinne](https://dev.to/ovid/bringing-modern-oo-to-perl-51ak)) to get the functionality of `Node` using the new system.

```perl
use Object::Pad;

use strict;
use warnings;
use feature qw{ say postderef signatures };
no warnings qw{ experimental };

class CorNode {
    has $value :param = 0 ;
    has $parent :param = undef;
    has $left :param = undef;
    has $right :param = undef;

    method value ( $v = undef ) {
        if ( defined $v ) { $value = $v; }
        return $value
    }

    method left ( $node = undef ) {
        if ( defined $node ) {
            $left = $node;
            $node->parent($self);
        }
        return $left
    }

    method right ( $node = undef ) {
        if ( defined $node ) {
            $right = $node;
            $node->parent($self);
        }
        return $right
    }

    method parent ( $node = undef ) {
        if ( defined $node ) {
            $parent = $node;
        }
        return $parent
    }

    method is_root () {
        return defined $parent ? 0 : 1 ;
    }

    method is_leaf () {
        return ( defined $left || defined $right ) ? 0 : 1
    }

    method depth () {
        my $depth = 0;
        my $copy  = $self;
        while ( !$copy->is_root ) {
            $depth++;
            $copy = $copy->parent;
        }
        return $depth;
    }

}
```

The test code is almost identical, only by which module is called, and the output is identical.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use Cwd qw( abs_path );
use File::Basename qw( dirname );
use lib dirname( abs_path($0) );
use CorNode;

my %nodes;
for my $n ( 1 .. 9 ) {
    $nodes{$n} = CorNode->new( value => $n );
}

$nodes{1}->left( $nodes{2} );
$nodes{1}->right( $nodes{3} );
$nodes{2}->left( $nodes{4} );
$nodes{2}->right( $nodes{5} );
$nodes{3}->left( $nodes{6} );
$nodes{3}->right( $nodes{7} );
$nodes{4}->left( $nodes{8} );
$nodes{6}->right( $nodes{9} );

my $x = <<'END';

0              1
             /   \
1           2     3
          / \    / \
2        4   5  6   7
        /        \
3      8          9

END

say $x;
say join "\t", '>>>>', qw{ Value Root RorP LorD Leaf Depth }, '<<<<';
for my $n ( sort keys %nodes ) {
    say join "\t ",

        '>>>',
        $nodes{$n}->value,
        $nodes{$n}->is_root,
        ( $nodes{$n}->is_root ? 'R' : $nodes{$n}->parent->value ),
        (
        $nodes{$n}->is_leaf
        ? 'L'
        : join ' + ',
        defined $nodes{$n}->left  ? $nodes{$n}->left->value  : '_',
        defined $nodes{$n}->right ? $nodes{$n}->right->value : '_',
        ),
        $nodes{$n}->is_leaf,
        $nodes{$n}->depth,
        '<<<';
}
```

## Mea Culpa

As presented, I havent had need to write OOP code often. There's one time where it was a major part of my job, but I'm of the opinion that a lot of that OOP code was baked in because the code base predated modern virtualization. I haven't _really_ sipped the Kool-Aid, in part because I liked the cleverness but didn't think it solved any of my problems.

As such, either or both Node implementations might be ... well, ill-considered. I'd certainly like to know if there are better ways to do this. If you have suggestions on how to improve this, see below.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
