---
layout: post
title: "Dr. Metropolis and His Amazing MANIAC Machine!: The Weekly Challenge #151"
author: "Dave Jacoby"
date: "2022-02-07 16:18:54 -0500"
categories: ""
---

On to a high-proof challenge, [#151](https://theweeklychallenge.org/blog/perl-weekly-challenge-151/)!

I have started looking up the special properties of each number, to inspire myself to think more in terms of Number Theory, and I found that [151](<https://en.wikipedia.org/wiki/151_(number)>) is a prime number. It is also a [Lucky Number](https://en.wikipedia.org/wiki/Lucky_number). I didn't know there was a formal definition for lucky numbers, just that you picked one you liked and that seemed to pop up a lot, thus [23](https://www.imdb.com/title/tt0481369/) and [42](https://en.wikipedia.org/wiki/The_Hitchhiker%27s_Guide_to_the_Galaxy).

> _This sieve is similar to the Sieve of Eratosthenes that generates the primes, but it eliminates numbers based on their position in the remaining set, instead of their value (or position in the initial set of natural numbers)._
>
> _The term was introduced in 1956 in a paper by Gardiner, Lazarus, Metropolis and Ulam. They suggest also calling its defining sieve, "the sieve of Josephus Flavius" because of its similarity with the counting-out game in the Josephus problem._

Any of the authors of that paper could've drawn my attention, but it's _Metropolis_ that did.

He's specifically [Nicholas Metropolis](Nicholas Metropolis), a Greek mathematician who earned his PhD at the University of Chicago, worked on the Manhattan Project and developed the [Monte Carlo method](https://en.wikipedia.org/wiki/Monte_Carlo_method). [I've written about using Monte Carlo to estimate Pi.](https://varlogrant.blogspot.com/2017/03/coding-for-pi-day.html) He built two computers, MANIAC and MANIAC II, hoping to stop people from using silly forced acronyms for machine names, but like putting pictures of cats on the Internet, you can't stop giving computers silly names. (I'm typing this on a computer named _Bishop_, because I tend to use names of Androids and AIs from science fiction, and Bishop was the android in _Aliens_. My phones and tablets all get _Blade Runner_ names. I'm part of the problem.)

I think a Doctor named Metropolis with a machine named MANIAC is primed to be the best kind of villain, a Superman Villain. Superman vs Doctor Metropolis! I want to know more about him, for only that reason.

![His Los Alamos badge ID](https://upload.wikimedia.org/wikipedia/commons/5/58/Metropolis_Nicholas_Badge.gif)

Not that the man is particularly villainous. I love this story:

> _In his memoirs, Stanislaw Ulam remembers that a small group, including himself, Metropolis, Calkin, Konopinski, Kistiakowsky, Teller and von Neumann, spent several evenings at Los Alamos playing poker. They played for very small sums, but: "Metropolis once described what a triumph it was to win ten dollars from John von Neumann, author of a famous treatise on game theory. He then bought his book for five dollars and pasted the other five inside the cover as a symbol of his victory."_

I get that Weekly Challenge problems don't usually come with Monte Carlo solutions, but I kinda think we should, if only to honor this man.

And if I can get a comic panel of him out-thinking Superman for small and quite silly stakes, I would love that as well.

### TASK #1 › Binary Tree Depth

> Submitted by: Mohammad S Anwar  
> You are given binary tree.
>
> Write a script to find the minimum depth.
>
> > The minimum depth is the number of nodes from the root to the nearest leaf node (node without any children).

I did everything but display the tree. I should do that some time.

I pulled out my _Node_ code again. I think I might've had depth as part of my Node code before, but I wrote something fresh, by which I mean it likely does everything the same. Start with a variable that's `0` and, as long as your $node isn't a root node, increment and go to the node's parent.

```perl
sub node_depth ( $node ) {
    my $d = 0;
    while ( !$node->is_root ) {
        $d++;
        $node = $node->parent;
    }
    return $d;
}
```

My issue, and the clever I pulled out for this, is how to turn a string into a tree, and once I saw `'1 | 2 3 | 4 5'`, I got it. Split the thing into an array, like `[1],[2,3],[4,5]`.

Now, how big can each level be? 2<sup>depth</sup>, with zero-indexed numbers. Level 0 is the root, and 2<sup>1</sup> is 1. **There Can Be Only One.** `</highlander>` Next level has 2<sup>1</sup>, which is 2. 2<sup>2</sup> is 4, and so on. We don't _see_ a full second or third depth, but I can pad that out with ranges.

I suppose we _could_ just end there. We find the lowest depth in the data and return _that_, but no. Let's rewrite Example 1:

```text

Input: '1 | 2 3 | 4 5 * * | * * * * 6'

                1
               / \
              2   3
             / \
            4   5

                    6
```

Here, that orphan node, _6_, would be a root and a leaf. I mean it's not _in_ the graph, but nothing in the program knows this. We could find*root on every node and remove any that doesn't connect to the most common root. Here, I simply remove any from the list that's a root, which includes \_6*.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

my @input;
push @input, '1 | 2 3 | 4 5';
push @input, '1 | 2 3 | 4 * * 5 | * 6';
push @input, '1 | 3 5 | 7 9 11';
push @input, '1 | 2 | 3 | 4 | 5 6 | * * 7 | * * * * 8';
push @input, '1 | 2 | 3 | 4 | 5 6 | * * 7 | * * * * * * 8';
push @input, '1 | 2 | 3 | 4 | 5 | 6 | 7 | 8';

for my $i (@input) {
    my $depth = make_tree($i);
    say <<"END";
    Input:  '$i'
    Output: $depth
END
}

sub make_tree( $input ) {
    my @rows;
    my $e = 0;

    my @input = split m{\s*\|\s*}, $input;    # basis for all the rows
    my %nodes =
        map { $_ => Node->new($_) }
        grep { /\d+/ } split m{\D}, $input;    # create all the nodes

    # here's where the tree is made
    for my $r (@input) {
        my $w   = -1 + 2**$e;
        my @i   = split /\s+/, $r;
        my @row = map { $i[$_] || '*' } 0 .. $w;
        push @rows, \@row;
        for my $n ( 0 .. $w ) {
            my $val  = $row[$n];
            my $node = $nodes{$val};
            my $lr   = $n % 2;
            my $p    = ' ';
            my $u    = ' ';
            if ( $e > 0 ) { $u = int( $n / 2 ); $p = $rows[ $e - 1 ][$u]; }
            my $parent = $nodes{$p};
            if ( defined $node && defined $parent ) {
                my $v = $node->value;
                if   ($lr) { $nodes{$p}->left( $nodes{$v} ); }
                else       { $nodes{$p}->right( $nodes{$v} ); }
            }
        }
        $e++;
    }

    my @o =                         # REMEMBER, READ THIS BACK TO FRONT
        sort { $a <=> $b }          # sort low to high
        map  { 1 + node_depth($_) } # 1 + node_depth = number of nodes involved
        grep { ! $_->is_root }      # each node is not a root
        grep { $_->is_leaf }        # each node is a leaf
        map  { $nodes{$_} }         # turn it into nodes
        keys %nodes;                # the keys to the nodes
    return $o[0]; # and we pull the first one, which should be
}

sub node_depth ( $node ) {
    my $d = 0;
    while ( !$node->is_root ) {
        $d++;
        $node = $node->parent;
    }
    return $d;
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
```

```text
$ ./ch-1.pl
    Input:  '1 | 2 3 | 4 5'
    Output: 2

    Input:  '1 | 2 3 | 4 * * 5 | * 6'
    Output: 3

    Input:  '1 | 3 5 | 7 9 11'
    Output: 3

    Input:  '1 | 2 | 3 | 4 | 5 6 | * * 7 | * * * * 8'
    Output: 5

    Input:  '1 | 2 | 3 | 4 | 5 6 | * * 7 | * * * * * * 8'
    Output: 5

    Input:  '1 | 2 | 3 | 4 | 5 | 6 | 7 | 8'
    Output: 8
```

### TASK #2 › Rob The House

> Submitted by: Mohammad S Anwar  
> You are planning to rob a row of houses, always starting with the first and moving in the same direction. However, you can’t rob two adjacent houses.
>
> Write a script to find the highest possible gain that can be achieved.

I'm not so sure I should participate in this one. I don't want to aid and abet someone else's crime spree, and I'm unwilling to start one of my own.

But, this once should be okay...

Here I'm using a recursive function to find every option, and using the function that calls it to disentangle things and display the lowest. Again, I use [List::Util](https://metacpan.org/pod/List::Util) and `sum0`, because `sum []` isn't defined but `sum0 []` is _0_.

I mention the recursion, and there are two cases:

- we didn't use this index, and we jump forward one spot
- we did use this index, and we jump forward two spots

Because we want to explain ourselves, we return the high score and the list of the houses we're going to target.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use List::Util qw{ sum0 };

my @blocks;
push @blocks, [ 2, 4, 5 ];
push @blocks, [ 4, 2, 3, 6, 5, 3 ];
push @blocks, [ 6, 7, 0, 1, 1, 5, 0, 2, 0, 4 ];

for my $block (@blocks) {
    my ( $value, $list ) = plan_robberies($block);
}

sub plan_robberies( $block ) {
    my $b = join ', ', @$block;
    my @x = _plan($block);
    say <<"END";
        Input:  ($b)
        Output: $x[0][0]
                $x[0][1]
END
}

sub _plan ( $block, $index = 0, $list = '' ) {
    my @output;
    if ( !defined $block->[$index] ) {
        my $sum = _score( $block, $list );
        return [ $sum, $list ];
    }

    # don't include this value
    push @output, _plan( $block, $index + 1, $list );

    # include this value
    push @output,
        _plan( $block, $index + 2, join ', ', grep { /\d/ } $list, $index );

    @output = sort { $b->[0] <=> $a->[0] } @output;
    return @output;
}

sub _score ( $block, $list ) {
    return sum0 map { $block->[$_] } grep { /\d/ } split /\D+/, $list;
}
```

```text
$ ./ch-2.pl
        Input:  (2, 4, 5)
        Output: 7
                0, 2

        Input:  (4, 2, 3, 6, 5, 3)
        Output: 13
                0, 3, 5

        Input:  (6, 7, 0, 1, 1, 5, 0, 2, 0, 4)
        Output: 19
                1, 3, 5, 7, 9
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
