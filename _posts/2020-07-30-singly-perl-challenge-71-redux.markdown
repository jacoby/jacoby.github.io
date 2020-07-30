---
layout: post
title:  "Singly: Perl Challenge #71 Redux"
author: "Dave Jacoby"
date:   "2020-07-30 14:51:44 -0400"
categories: ""
---

Thank you, Walt Mankowski! In response to my [first pass](https://jacoby.github.io/2020/07/27/perl-weekly-challenge-71-peaks-and-links.html), he wrote:

> Nice writeup! In part 1, I missed the part where the random numbers were supposed to be unique. In part 2, it looks like you missed the part about it being a _singly_ linked list. 😀

Oh, smell. 

A **doubly-linked list** looks like:

```text
┌──────┐           ┌──────┐           ┌──────┐
│ node │ --next--> │ node │ --next--> │ node │
│      │ <--prev-->│      │ <--prev-->│      │
└──────┘           └──────┘           └──────┘
```

There are links going both forward to the next node and back to the previous. With a **singly-linked list**, like they said in the movie **Gumball Rally**, "What's behind us? Not important!"

```text
┌──────┐           ┌──────┐           ┌──────┐
│ node │ --next--> │ node │ --next--> │ node │
└──────┘           └──────┘           └──────┘
```

There's not much I was doing with the previous. The think you _could_ _do_ with prev links is to go to the start and count backwards, which I don't do.

_Most_ of the changes to my Node class are simple, just comment out anything mentioning `prev` or `parent`.

```perl
package Node;

sub new ( $class, $value = 0 ) {
    my $self = {};
    $self->{value}  = $value;
    $self->{next}   = undef;
    # $self->{parent} = undef;
    return bless $self, $class;
}

sub value ( $self ) {
    return $self->{value};
}

# sub is_root ( $self ) {
#     return defined $self->{parent} ? 0 : 1;
# }

sub is_leaf ( $self ) {
    return ( !defined $self->{left} && !defined $self->{right} )
        ? 1
        : 0;
}

sub next ( $self, $node = undef ) {
    if ( defined $node ) {
        $self->{next}   = $node;
        # $node->{parent} = $self;
    }
    else {
        return $self->{next};
    }
}

# sub parent ($self ) {
#     return $self->{parent};
# }
```

There's still the pesky matter of removal, which I'll get to later.

Walt also suggested an explicit `start` node, so that we go `start -> 1 -> 2 -> 3 -> 4 -> 5`, which makes the list creation a little simpler, and I expect will make the removal code simpler.

```perl
my $start = Node->new('0');
for my $i ( 1 .. 5 ) {
    my $last = get_last($start);
    $last->next( Node->new($i) );
}
```

So, let's start trimming this. 

```perl
trim_list( $start, $n );

sub trim_list ( $link, $n = 1 ) {

    # how big is the linked list?
    my $i = 0;
    my $s = $link;

    while ( defined $s ) {
        $i++;
        $s = $s->{next};
    }
    my $stop = $i - $n;
    $stop = $stop < 1 ? 1 : $stop;

    my $k = 1;
    $s = $start;
    while ( $s->next ) {
        my $v = $s->next->value;
        if ( $stop == $k ) {
            $s->remove_next;
            last;
        }
        $s = $s->next;
        $k++;
    }
    show_list( $start->next );
}
```

Very similar to the original. It's that last while loop where things change. I'm looking at and removing `$s->next` rather than `$s`, and using both `last` (because why go through the rest of the list if we're done?) and using `$s->remove_next` rather than `$s->remove`. Let's look at that.

```perl
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

sub remove_next( $self ) {
    my $next = $self->{next};
    if ( defined $next ) {
        $self->{next} = $next->{next};
    }
}
```

When we're 1) using a start node and 2) not having to look back, that allows us to have a _much_ simpler remove function.

So, there you have it; a singly-linked list solution.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use Getopt::Long;
my $n = 1;
GetOptions( 'number=i' => \$n, );

my $start = Node->new('0');
for my $i ( 1 .. 5 ) {
    my $last = get_last($start);
    $last->next( Node->new($i) );
}

# show_list($start->next); #so we don't get the start node
trim_list( $start, $n );

exit;

sub trim_list ( $link, $n = 1 ) {

    # how big is the linked list?
    my $i = 0;
    my $s = $link;

    while ( defined $s ) {
        $i++;
        $s = $s->{next};
    }
    my $stop = $i - $n;
    $stop = $stop < 1 ? 1 : $stop;

    my $k = 1;
    $s = $link;
    while ( $s->next ) {
        if ( $stop == $k ) {
            $s->remove_next;
            last;
        }
        $s = $s->next;
        $k++;
    }
    show_list( $start->next );
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

######### ######### ######### ######### ######### ######### #########
# Now a singly-linked list, meaning no pointing back to the start

package Node;

sub new ( $class, $value = 0 ) {
    my $self = {};
    $self->{value} = $value;
    $self->{next}  = undef;

    # $self->{parent} = undef;
    return bless $self, $class;
}

sub value ( $self ) {
    return $self->{value};
}

# sub is_root ( $self ) {
#     return defined $self->{parent} ? 0 : 1;
# }

sub is_leaf ( $self ) {
    return ( !defined $self->{left} && !defined $self->{right} )
        ? 1
        : 0;
}

sub next ( $self, $node = undef ) {
    if ( defined $node ) {
        $self->{next} = $node;

        # $node->{parent} = $self;
    }
    else {
        return $self->{next};
    }
}

# sub parent ($self ) {
#     return $self->{parent};
# }

sub remove_next( $self ) {
    my $next = $self->{next};
    if ( defined $next ) {
        $self->{next} = $next->{next};
    }
}
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
