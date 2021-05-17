---
layout: post
title: "Insert Clever Title Here: Perl Weekly Challenge #113"
author: "Dave Jacoby"
date: "2021-05-17 12:08:16 -0400"
categories: ""
---

> Standing in the neutral zone  
> Living on sleep deprivation  
>  -— [Son Volt, "Route"](https://genius.com/Son-volt-route-lyrics)

It's time for [Perl Challenge #113](https://perlweeklychallenge.org/blog/perl-weekly-challenge-113/), and I'm not as well-rested as I might wish to be, which makes me a little less sure of my code than I might. I understand that some think that exhaustion can have a similar effect on programmers as [the Ballmer Peak](https://xkcd.com/323/), but this has never been something I subscribed to.

OK, I admit to having _"sleep is for wimps"_ as a catchphrase in the 1990s, but I promise you I said it _ironically_.

Anyway...

### TASK #1 › Represent Integer

> Submitted by: Mohammad S Anwar  
> You are given a positive integer `$N` and a digit `$D`.
>
> Write a script to check if `$N` can be represented as a sum of positive integers having `$D` at least once. If check passes print `1` otherwise `0`.

I grep for `$D` in the decimal representation of `$i`, which is a value somewhere between `1` and `$N`, and add it to `$s` if there's a match. I could try for a cool functional list-oriented solution, but not today.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say state postderef signatures };
no warnings qw{ experimental };

for my $d ( 7 .. 7 ) {
    for my $n ( 20 .. 30 ) {
        my $o = represent_int( $n, $d );
        say <<"END";
    INPUT: N = $n , D = $d
    OUTPUT: $o
END

    }
}

sub represent_int ( $n, $d ) {
    my $s = 0;
    for my $i ( 1 .. $n ) {
        $s += $i if $i =~ /$d/;
    }
    return $n == $s ? 1 : 0;
}
```

```text

    INPUT: N = 20 , D = 7
    OUTPUT: 0

    INPUT: N = 21 , D = 7
    OUTPUT: 0

    INPUT: N = 22 , D = 7
    OUTPUT: 0

    INPUT: N = 23 , D = 7
    OUTPUT: 0

    INPUT: N = 24 , D = 7
    OUTPUT: 1

    INPUT: N = 25 , D = 7
    OUTPUT: 0

    INPUT: N = 26 , D = 7
    OUTPUT: 0

    INPUT: N = 27 , D = 7
    OUTPUT: 0

    INPUT: N = 28 , D = 7
    OUTPUT: 0

    INPUT: N = 29 , D = 7
    OUTPUT: 0

    INPUT: N = 30 , D = 7
    OUTPUT: 0
```

### TASK #2 › Recreate Binary Tree

> Submitted by: Mohammad S Anwar  
> You are given a Binary Tree.
>
> Write a script to replace each node of the tree with the sum of all the remaining nodes.

I drag out my `Node` package again. One traversal to get the sum of all the node values, and another to transform the tree. As I comment, I could just as easily go through `%hash`, but assuming a disconnected node, that should not count for the sum nor be changed. 

I'm not coming up with a clever way of displaying a tree once it's created. It makes me sad.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say state postderef signatures };
no warnings qw{ experimental };

# make the
my %hash = map { $_ => Node->new($_) } 1 .. 7;
$hash{1}->left( $hash{2} );
$hash{1}->right( $hash{3} );
$hash{2}->left( $hash{4} );
$hash{3}->left( $hash{5} );
$hash{3}->right( $hash{6} );
$hash{4}->right( $hash{7} );

# we know the root of the
my $sum = get_sum( $hash{1} );
change_node_value( $hash{1}, $sum );
say $sum;

say qq{Too tired to display this in a clever way\n};

say '                    ' . $hash{1}->value;
say '                   /  \\';
say '                  ' . $hash{2}->value . '   ' . $hash{3}->value;
say '                 /    /  \\';
say '                '
    . $hash{4}->value . '   '
    . $hash{5}->value . '   '
    . $hash{6}->value;
say '                 \\ ';
say '                  ' . $hash{7}->value;
say '';

exit;

# we COULD just go through the whole hash
# table, but that wouldn't be treeish
sub change_node_value ( $node, $sum ) {
    my $v = $node->value;
    my $x = $sum - $v;
    $node->{value} = $x;
    if ( defined $node->left ) {
        change_node_value( $node->left, $sum );
    }
    if ( defined $node->right ) {
        change_node_value( $node->right, $sum );
    }
}

# we COULD just go through the whole hash
# table, but that wouldn't be treeish
sub get_sum( $node ) {
    my $sum = 0;
    $sum += $node->value;
    if ( defined $node->left ) {
        my $val = get_sum( $node->left );
        $sum += $val;
    }
    if ( defined $node->right ) {
        my $val = get_sum( $node->right );
        $sum += $val;
    }
    return $sum;
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
    return !defined $self->{left} && !defined $self->{right} ? 1 : 0;
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

```text
28
Too tired to display this in a clever way

                    27
                   /  \
                  26   25
                 /    /  \
                24   23   22
                 \
                  21

```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
