---
layout: post
title: "More on Linked Lists"
author: "Dave Jacoby"
date: "2020-05-06 17:02:01 -0400"
categories: ""
---

[In my first pass on Challenge 59](https://jacoby.github.io/2020/05/04/challenge-59-lists-and-binary-xor.html), I wrote that you can treat Perl's arrays like linked lists. I do believe that to be true, Perl's arrays are resizable, for example, while C's are not.

But I grant that there was a whole lot of stolen base in the code sample I talked about, and when I solved it initially, I didn't feel I had time to more fully engage with the specifics, but later I did.

First, I again pull out my `Node` package, this time modifying it so that instead of `$obj->left()` and `$obj->right()`, there's simply `$obj->next()`. I should point that since there's still `$obj->parent()`, this is a **doubly linked list**, while without, it would simply be a **singly linked list**. I don't think I use `parent()` for anything, so in this case, it doesn't matter.

```perl
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

sub parent ( $self ) {
    return $self->{parent};
}
```

### Insert Wirth Joke Here

[Niklaus Wirth](https://en.wikipedia.org/wiki/Niklaus_Wirth) is a pioneering computer scientist: chief designer of Pascal, the person actually coined the phrase **"GOTO CONSIDERED HARMFUL"** and so on.

> [Whereas Europeans generally pronounce his name the right way ('Nick-louse Veert'), Americans invariably mangle it into 'Nickel's Worth.' This is to say that Europeans **call him by name**, but Americans **call him by value**. ](https://en.wikiquote.org/wiki/Niklaus_Wirth) h/t/ WikiQuote

For those not knowledgable about computers: Why are you reading this blog? But still, consider this C-ish pseudocode.

```C
a = 12;
my_sub( a );
print( a );
```

What gets printed? We don't _know_ what `my_sub()` does, but we can pretty much be sure that it got `12`, and didn't do anything that modified the 12 _in_ `a`. This is **passing by value**.

However,

```C
a = 12;
my_sub( *a );
print( a );
```

I _think_ this is the syntax; I haven't done much with C in the last few decades. But here, we're passing the address of `a`, and we can use it to change `a` from `12` to ... well, we don't know if 12 is a bigint or what, so. This is **passing by name**.

### Back to the Code

I _usually_ use references, Perl's safer take on C's very foot-gunny pointers, and I usually have `postderef` in my `use feature qw( ... )` because I find `$reference->@*` to be easier to read than `@$reference`.

[The Challenge](https://perlweeklychallenge.org/blog/perl-weekly-challenge-059/) is to reorder a linked list so that every value less than _k_ come before every value greater or equal than _k_, So first, we need to create a linked listed.


```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings qw{ experimental };

my $i;
my $k = 3;
my $head;
my $above;
my $below;

# create a linked list!
for my $i ( 1, 4, 3, 2, 5, 2 ) {
    add_node( \$head, $i );
}
say 'BEFORE';
display_list($head);
say '';

# BEFORE
# 1 -> 4 -> 3 -> 2 -> 5 -> 2
```

Before I get to the code, I will point out how we call `add_node( \$head, $i )`. `$head` is a reference to the first link in the list, but when we don't have a first link, it's just undefined. This changes, and we want the changes to be reflected the next time we add a link to the list. So, we need to pass by name, thus the reference, `\$head`.

`display_list()` isn't called on an empty list, we can just print nothing if $head isn't defined, so it can pass the value.

```perl
# adds a node/link to the end of the list,
# or creates the first if not set yet
sub add_node ( $node, $i ) {
    if ( defined $$node ) {
        my $last = get_last($$node);
        my $new  = Node->new($i);
        $last->next($new);
    }
    else {
        my $new = Node->new($i);
        $$node = $new;
    }
}
```

Here, `$node` is the reference to the node, or undefined, so when we want to actually work with it, we de-reference it, using `$$node`.

Yes, we have `postderef` so that _could_ be `$node->$*` as well. I didn't think to do this when I wrote this.

```perl
# given a node/link within the linked list,
# (usually the first link), it returns the last link
sub get_last( $node ) {
    return get_last( $node->next ) if $node->next;
    return $node;
}

# given a node/link within the linked list,
# (usually the first link), it recursively prints
# the values of each link
sub display_list( $node ) {
    return if !defined $node;
    print $node->value if $node;
    if ( $node->next ) {
        print ' -> ';
        display_list( $node->next );
    }
    else { say '' }
}
```

### Delinking and Relinking

With my first solution, to get the values separated to the less-than and greater-than-or-equal-to lists, I `shift`ed them.

I should remember that if they get removed from the front, that's `shift` and they get removed from the back, it's `pop`. But I didn't.

```perl
while ( defined $head ) {
    my $node = pop_head( \$head );
    my $l    = $node->value;
    if   ( $l < $k ) { add_node( \$below, $l ) }
    else             { add_node( \$above, $l ) }
}

sub pop_head ( $node ) {
    my $h = $$node;
    $$node = $$node->next;
    return $h;
}
```

`$above` and `$below` were, like `$head` undefined until given the head, and so I remove the link, `shift`ing with `pop_head`, pulling the value from the link, and adding a new link to the appropriate list, because the tool I wrote didn't reuse the links once unlinked.

Oh well. Now we have a list that's all the values below _k_ and one that's _k_ or higher. We want one list.

### We Link The List

And we get it by linking the last node in the first list to the first node in the other list.

```perl
my $blast = get_last($below);
$blast->next($above);

say 'AFTER';
display_list($below);
say '';

# AFTER
# 1 -> 2 -> 2 -> 4 -> 3 -> 5
```

I did enjoy this. And I got to use that `Wirth` joke!

But I'm not sure that I would use anything like this for work. I mean, maybe, but this is fun for me, not a thing I'm thinking I should dust off my PAUSE account and push a cool thing to CPAN. `my $blast = get_last($below) && $blast->next($above)` is cool , but `@blast = (@below,@above)` should do it all.

Arrays in C _cannot_ grow! This is why Linked Lists!

Arrays in Perl _can_ grow! This is why we're happy with them!

I mean, seriously, it's just this easy when you _don't_ have to think about linked lists.

```perl
print join ' -> ', sort { $a >= $k <=> $b >= $k }  1, 4, 3, 2, 5, 2  ;
```

Isn't that pretty? And simple?

### The Whole Thing

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings qw{ experimental };

my $i;
my $k = 3;
my $head;
my $above;
my $below;

# create a linked list!
for my $i ( 1, 4, 3, 2, 5, 2 ) {
    add_node( \$head, $i );
}
say 'BEFORE';
display_list($head);
say '';

# undo first linked list, create before & after
while ( defined $head ) {
    my $node = pop_head( \$head );
    my $l    = $node->value;
    if   ( $l < $k ) { add_node( \$below, $l ) }
    else             { add_node( \$above, $l ) }
}

# combine below and above
my $blast = get_last($below);
$blast->next($above);

say 'AFTER';
display_list($below);
say '';

exit;

sub pop_head ( $node ) {
    my $h = $$node;
    $$node = $$node->next;
    return $h;
}

sub add_node ( $node, $i ) {
    if ( defined $$node ) {
        my $last = get_last($$node);
        my $new  = Node->new($i);
        $last->next($new);
    }
    else {
        my $new = Node->new($i);
        $$node = $new;
    }
}

sub get_last( $node ) {
    return get_last( $node->next ) if $node->next;
    return $node;
}

sub display_list( $node ) {
    return if !defined $node;
    print $node->value if $node;
    if ( $node->next ) {
        print ' -> ';
        display_list( $node->next );
    }
    else { say '' }
}

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

sub parent ( $self )     {
    return $self->{parent};
}
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
