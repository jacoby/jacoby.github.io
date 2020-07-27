---
layout: post
title: "Perl Weekly Challenge #71: Peaks and Links"
author: "Dave Jacoby"
date: "2020-07-27 17:16:40 -0400"
categories: ""
---

### TASK #1 › Peak Element

> Submitted by: Mohammad S Anwar
>
> You are given positive integer `$N` (>1).
>
> Write a script to create an array of size `$N` with random unique elements between **1** and **50**.
>
> In the end it should print **peak elements** in the array, if found.
>
> > An array element is called peak if it is bigger than it’s neighbour.

This has several interesting parts for people inexperienced with Perl. I often go over them again, in hopes that people use the Perl Weekly Challenge to learn Perl, and that my contributions help.

In my order:

- **create an array of size `$N` with random unique elements between _1_ and _50_**

  This means that `$N` _must_ be 50 or less, because you cannot have more than 50 unique elements when each element is valued between 1 and 50.

  If we struck out _unique_, creating a random number between 1 and 50 is simply `1 + int rand 50`. `rand` creates a random floating-point between 0 and 1. `int rand 50` will give us numbers between _0_ and _49_, so we add 1 to get into the range we want.

  Then, creating an array with `$N` values would be as easy as `@array = map { 1 + int rand 50 } 1 .. $n`, but this would not give unique results, and sorting out repeated values would make the final array smaller than `$n`. I used a while loop that pushed a value onto the array if it's unique, and only stopped if we hit the right array size.

  Of course, now that I have that submitted, I realized that it could be done with an [iterator](https://www.perl.com/pub/2005/06/16/iterators.html/).

  Higher order programming is _fun!_

```perl
sub gen_iterator ( @range ) {
    return sub {
        return '' unless scalar @range;
        @range = sort { rand() <=> rand() } @range;
        return shift @range;
        }
}
my $iter = gen_iterator( 1 .. 50 );
my @array = map { $iter->() } 1 .. 50;
```

- **In the end it should print _peak elements_ in the array, if found**

  **Peak elements** are those whose neighbors are less than it is. Given the array `[1, 4, 3]`, the peak array would be `[4]`, but switch to `[3, 1, 4]` and the array would be `[3, 4]`. If `@array = (3, 1, 4)`, then testing index `1` would be `if ( $array[1] > $array[0] && $array[1] > $array[2] ) { push @peaks, $array[1] }`, but of course we need to be able to test every element in the array.

  There are special cases. If the array is `[1]`, that sole element is a peak, so the array _is_ the peak array. If the element is the first element, it should only compare with the second element. If the element is the ultimate element, it should only compare with the penultimate element. (It pays to enrich your word power.)

  And I use `JSON` to format the output because that's very close to the example.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use Carp;
use Getopt::Long;
use JSON;

my $json = JSON->new->space_after;

# a few interesting things before the solving actual
# things

# you are given a number $n where $n > 1
my @array;
my $n = 1;
GetOptions( 'number=i' => \$n, );

# we CANNOT have an array of unique elements, random or no,
# if the desired size is greater than the pool of numbers.
croak 'N needs to be greater than 1' if $n < 1;
croak 'N needs to be less than 50'   if $n > 50;

# write a script that creates an array of size $n
# with random unique elements between 1 and 50
while ( scalar @array < $n ) {
    my $j = 1 + int rand 50;
    push @array, $j unless grep { $j == $_ } @array;
}

# In the end it should print peak elements in the array, if found.
my @peaks = peak_elements(@array);

# I combine print and say to get the output as written in the
# example

print 'Array: ';
say $json->encode( \@array );
print 'Peak:  ';
say $json->encode( \@peaks );

exit;

# a peak element is one that is larger than it's neighbors.
# in abstract, array[i] > array[i-1] && array[i] > array[i+1]
# but this is entirely the base case. Exceptions include:
#   * array size = 1, so it is a peak in and of itself
#   * first element, which only compares against the next element
#   * last element, which only compares against the previous element
# example results are correct, but order is weird. MY solution
# adds peaks in order they are found.

# for example:
# Array: [35, 12, 48, 22, 6, 21, 46, 1, 23, 31]
# Peak:  [35,     48,            46,        31]

sub peak_elements ( @array ) {
    return @array if scalar @array == 1;
    my @output;

    for my $i ( 0 .. $#array ) {
        if ( $i == 0 ) {
            push @output, $array[$i] if $array[$i] > $array[ $i + 1 ];
        }
        elsif ( $i == $#array ) {
            push @output, $array[$i] if $array[$i] > $array[ $i - 1 ];
        }
        else {
            push @output, $array[$i]
                if $array[$i] > $array[ $i - 1 ]
                && $array[$i] > $array[ $i + 1 ];
        }
    }

    return @output;
}

```

### TASK #2 › Trim Linked List

> Submitted by: Mohammad S Anwar
>
> You are given a singly linked list and a positive integer `$N` (>0).
>
> Write a script to remove the `$Nth` node from the end of the linked list and print the linked list.
>
> If `$N` is greater than the size of the linked list then remove the first node of the list.
>
> NOTE: Please use pure linked list implementation.

I'm basing this on the Linked List implementation I used in [Challenge #59](https://perlweeklychallenge.org/blog/perl-weekly-challenge-059/), adding a few bits as needed.

The deepest point is `remove`, which, in the general case, is as simple as:
- finding the `previous` and `next` link
- make `previous->next` be `next`
- make `next->previous` be `previous`

If there's no next, you simply make `previous->next = undef`. With no `previous`, there is a problem, because `start` remains `start` outside the function. My solution is to set `start->value = next->value` and remove `next`.

Other than that, I think there's a lot of bookkeeping code, making sure I'm addressing the correct link.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use Getopt::Long;
my $n = 1;
GetOptions( 'number=i' => \$n, );

my $start;
for my $i ( 1 .. 5 ) {
    if ( !defined $start ) {
        $start = Node->new($i);
    }
    else {
        my $last = get_last($start);
        $last->next( Node->new($i) );
    }
}

trim_list( $start, $n );

sub trim_list ( $link, $n = 1 ) {

    # how big is the linked list?
    my $i = 0;
    my $s = $link;

    while ( defined $s ) {
        $i++;
        $s = $s->{next};
    }

    my $stop = $i - $n + 1;
    $stop = $stop < 1 ? 1 : $stop;

    $i = 1;
    $s = $link;
    while ( defined $s ) {

        $s->remove if $i == $stop;
        $s = $s->{next};
        $i++;
    }

    show_list($start);
}

sub show_list( $link ) {
    while ( defined $link ) {
        print $link->{value} || '';
        if ( defined $link->{next} ) {
            print ' -> '
                if defined $link->{next};
        }
        else { print "\n" if !defined $link->{next}; }
        $link = $link->{next};
    }
}

sub get_last( $node ) {
    return get_last( $node->next ) if $node->next;
    return $node;
}

# copied and pasted from my Challenge #59 code

######### ######### ######### ######### ######### ######### #########
# The same old Node code, but instead of left and right,
# it just has next

package Node;

sub new ( $class, $value = 0 ) {
    my $self = {};
    $self->{value}  = $value;
    $self->{next}   = undef;
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

sub next ( $self, $node = undef ) {
    if ( defined $node ) {
        $self->{next}   = $node;
        $node->{parent} = $self;
    }
    else {
        return $self->{next};
    }
}

sub parent ($self ) {
    return $self->{parent};
}

# this one is added.
# because we cannot replace self, we must redefine
# $self and remove next when trying to remove first
# element
sub remove ( $self ) {
    my $parent = $self->{parent};
    my $next   = $self->{next};

    if ( defined $parent && defined $next ) {
        $parent->{next} = $next;
        $next->{parent} = $parent;
    }
    elsif ( defined $parent ) {
        $parent->{next} = undef;
    }
    elsif ( defined $next ) {
        $self->{value} = $next->{value};
        $next->remove;
    }
}
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
