---
layout: post
title: "More Moose Hunting: Singly-Linked List"
author: "Dave Jacoby"
date: "2021-01-28 18:47:31 -0500"
categories: ""
---

Lately, I've started to skill-up on [Moose](https://metacpan.org/pod/Moose), a _"postmodern object system for Perl 5"_.

I'm _somewhat_ familiar with pre-Moose objects, and I'm becoming increasingly conversant in Moose's techniques. A problem is that there's a _lot_ in there, and not only do you need to understand _what_ your options are and _how_ to use them, but _why_ we use different options and avoid others. I'd say that Moose is a whole different language implemented in and used with Perl.

And how do we learn a language? We use it.

So I put together some code to implement a _node_ for a [_singly-linked list_](https://en.wikipedia.org/wiki/Linked_list#Singly_linked_list). Honestly, I _never_ see these things in the wild, but I generally live my life in high-level languages like Perl and Javascript which have arrays that can be resized on the fly, at both ends _and_ in the middle, while the languages on which all of our modern computing technology relies do not have this. It would not surprise me to find that Perl's Arrays are internally doubly-linked lists.

So, what do I think I'll need from a node in this context. Well, there's the _value_, because if it isn't holding _something_, then why are we trying to store any of it? Then there's _next_, which is a reference to the next node (link?) in the list.

And what might we want to _do_ with this, beyond setting a value, getting a value, setting the next node, and getting the next node? There's _last_, which would return the last node in the list. There's also _list_, which would return a list of every value in the list, which would be great for ensuring what we have is right.

### Singly-Linked List, or SSL

```perl
package SSL;

use Moose;
use feature qw{ say signatures state };
no warnings qw{ experimental };

has '_value' => (
    traits  => ['Number'],
    is      => 'ro',
    isa     => 'Int',
    default => '9',
    handles => {
        'get' => 'abs',
        'set' => 'set',
    },
);

has 'next' => (
    is      => 'rw',
    default => undef,
);

sub last ( $self ) {
    return $self unless defined $self->next;
    return $self->next->last();
}

sub list ( $self ) {
    my $n;
    my $value = $self->get;
    my $next  = $self->next;
    if ( defined $next ) {
        $n = $next->list;
    }
    return join ', ', grep { defined } $value, $n;
}

no Moose;
__PACKAGE__->meta->make_immutable;
```

OK, I couldn't find or think of a `get` equivalent within [Moose::Meta::Attribute::Native::Trait::Number](https://metacpan.org/pod/Moose::Meta::Attribute::Native::Trait::Number), and I wasn't _planning_ on using negative numbers, I used `abs`. Because it's obvious, there _must_ be a way, so I simply couldn't find it. (My friend Gizmo commented that it's `package Real`, but `has 'integer'`, while [real numbers](https://www.britannica.com/science/real-number) include  fractions and decimals, etc. I was too focused on trying to return the value.)

It seems that I could've just added this — `sub get ( $self ) { return $self->{_value} }` — but that includes the sort of digging into the object that I'm told is discouraged. `:shrug:`

And, as we'll see, when we actually _use_ it, I do a lot of `$node->{next} = $obj` and the like. Maybe I should write `make_next`?

Honestly, I personally have more issues with my method names than with my methods.

### Using the library

It is striking me now, as I write the blog post, that this would be an opportune time to address another weak spot in my Perl-fu, test writing. I can smell my dinner starting to cook, so I'm not going to spend time writing tests and pushing this back until after dinner, so I'll show the kinda not-test tests I write to be sure my stuff works.

Here I wrote several methods to create a list from a collection of nodes, which go to _pushing_ everything, _unshifting_ everything, and _sorting_ everything as I insert. 

I tested `make_linked_list` and `make_reversed_linked_list` in an earlier iteration of the coding, and then I wrote `make_sorted_linked_list` to prove that I could do all the things.

To get all possible variations of an array, I used [Algorithm::Permute](https://metacpan.org/pod/Algorithm::Permute). Given an array `[1, 2, 3]`, for example, you get:

```text
[1,2,3]
[1,3,2]
[2,1,3]
[2,3,1]
[3,1,2]
[3,2,1]
```

So I wrote something that created a larger array of numbers, came up with all permutations, and tested against a pre-sorted array of the same numbers, and just told me when things failed.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use lib '.';
use SLL;

use Algorithm::Permute;

{
    my $top = 9;
    my $p = Algorithm::Permute->new( [ 1 .. $top ] );
    while ( my @vals = $p->next ) {
        my $test  = join ', ', 1 .. $top;
        my @array = map { my $i = SSL->new; $i->set($_); $i } @vals;

        my $head;

        # $head = make_linked_list(@array);
        # say $head->list;
        # $head = make_reversed_linked_list(@array);
        # say $head->list;

        $head = make_sorted_linked_list(@array);
        my $check = $head->list;
        if ( $check ne $test ) {
            say join '__', map { $_->get } @array;
            say join "\t", $check, $test, $check eq $test ? 'true' : 'false';
            say '';
        }
    }

}
exit;

sub make_linked_list ( @array ) {
    my $head;
    map { $_->{next} = undef } @array;
    for my $i (@array) {
        my $v = $i->get();
        if ( !defined $head ) { $head = $i; }
        else                  { my $last = $head->last; $last->{next} = $i; }
    }
    return $head;
}

sub make_reversed_linked_list ( @array ) {
    my $head;
    map { $_->{next} = undef } @array;
    for my $i (@array) {
        if   ( !defined $head ) { $head      = $i; }
        else                    { $i->{next} = $head; $head = $i; }
    }
    return $head;
}

sub make_sorted_linked_list ( @array ) {
    my $head;
    map { $_->{next} = undef } @array;
OUTER: for my $node (@array) {
        if    ( !defined $head ) { $head = $node; }
        elsif ( $node->get < $head->get ) {
            $node->{next} = $head;
            $head = $node;
        }
        else {
            my $curr = $head;
            while ($curr) {
                if ( !$curr->next ) {
                    $curr->{next} = $node;
                    $curr = $curr->next;
                    next OUTER;
                }
                if ( $curr->next && $node->get < $curr->next->get ) {
                    $node->{next} = $curr->next;
                    $curr->{next} = $node;
                    $curr         = $curr->next;
                    next OUTER;
                }
                $curr = $curr->next;
            }
        }
    }
    return $head;

}
```

And the output:

```bash
$ time ./test.pl 
real    0m48.253s
user    0m47.172s
sys     0m0.109s
```

I used `[1..9]` here, so if I had it just print everything and not just errors, there'd be **362,880** entries, which is a bit more than I would want to put into my blog.

This is my best as of 8pm. I'm going to post this and spend time with family. If you have a response, be thorough but be nice, please!

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
