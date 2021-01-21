---
layout: post
title: "[Bullwinkle, Lumpy, Tyrone]: Another Moose Stack"
author: "Dave Jacoby"
date: "2021-01-20 16:35:07 -0500"
categories: ""
---

[Ward Cunningham](https://en.wikipedia.org/wiki/Ward_Cunningham), father of the wiki, has his own eponymous law:

> **Cunningham's Law** : The best way to get the right answer on the Internet is not to ask a question, but to post the wrong answer

This is an absolute boon for bloggers, who can, when confused, [write up their best guess for a solution and watch their inboxes for corrections](https://jacoby.github.io/2021/01/17/a-stack-of-moose-perl-challenge-95-addendum.html). My footer says _"make an issue on my blog repo"_ for a reason.

In this case, GitHub user `@simbabque` took me up on it. I took his suggestions, tried it, it failed, I got short, he added more suggestions, and it began to work.

### Completion Backwards Principle

So, 99% or more of the package code would be in it's own `.pm`, but for challenge code, my tendency is to have everything in one file. I'm on _Task #1_, so the file is `ch-1.pl`. In short:

```perl
#! perl

# code goes here

package Stack;

# package goes here
```

For my halfway Moose\* code, it worked, but with the changes I received, it failed. It failed because all that Moose goodness wasn't yet in scope when I call the Moose package. I've used the above style for decades (on those few occasions where I had need to do this kind of package, usually for monkey-patching), so I had no idea that this sort of Python-esque setup was necessary.

```perl
#! perl

package Stack;

# package goes here

package main;

# code goes here
```

This still feels backwards to me. But it works, and like I said, 99% of the time I wouldn't have to worry.

> \* _I'm scared to move, I can't get loose / 'cause there's no such thing as a halfway Moose!_

### Consider Yourself Warned

A quick addition:

```perl
#! perl

use feature qw{ say signatures } ;
no warnings qw{ experimental } ;
package Stack;

# package goes here

package main;

use feature qw{ say signatures } ;
no warnings qw{ experimental } ;
# code goes here
```

`signatures` allows you to write `sub mycode ( $i ) { ... }` instead of `sub mycode { my $i = shift ; ... }`. It's a small thing, but I _like_ my code to have signatures. I consider it _cleaner_. Honestly, I am not sure what the adjective _cleaner_ really means for developers, and without wrongfully claiming OCD terminology for my personal use, I don't really have the vocabulary to express my feelings in that way. But it _is_ how I roll unless there's a shop style forbidding it.

And this code was poping warnings wherever in `Stack` I used signatures. As I understand it, it's about _scope_, and we should put logical braces between `package Stack` and `package main`, so the way to have Moose _see_ it is like this:

```perl
#! perl

package Stack;
use feature qw{ say signatures } ;
no warnings qw{ experimental } ;

# package goes here

package main;

use feature qw{ say signatures } ;
no warnings qw{ experimental } ;
# code goes here
```

And now I know to look at it like this, I _get_ it, but I know I looked right at it and failed to identify it as the cause of my loud eruptions of profanity.

### perldoc of const SORROW

This is stepping ahead, but I'm aware of constants in Perl. I don't _use_ them. I _have_ no use for them, but I know they're there.

```perl
use const PI = 3 ; # I'm in Indiana B)
```

Now, let us consider an array reference.

```perl
use const ARRAY = {} ;
```

What should this give us?

```perl
push ARRAY->@*, 1;
push ARRAY->@*, 2;
push ARRAY->@*, 3;
say join ', ', ARRAY->@*;
```

You'd _think_ `[ ]`, right? We're trying to modify a constant array, right?

Nope. We're simply saying that `ARRAY` cannot point to another thing. It will always be a reference to this anonymous array. I can `push` and `pull` and `shift` and `unshift` and `delete` with that array with impunity.

```text
1, 2 ,3
```

The same is true with `is`.

```perl
has 'stack' => (
    is  => 'rw',
    isa => 'ArrayRef',
);
```

All I'm gaining is the ability to say `$obj->{stack} = []`, which isn't good for so many reasons. This is a step in the more correct direction.

```perl
has 'stack' => (
    is  => 'ro',
    isa => 'ArrayRef',
);
```

### The Wacky Doctor's Game!

Consider the old game [_Operation!_](https://www.google.com/search?q=operation+game). If your tweezers touch the side of the incision while trying to extract the plastic body parts, the red nose of _Cavity Sam_, the Clown-meets-Shemp patient, glows red and a buzzer sounds. Nosing around the guts of an Object (like a board game) is frowned upon.

I _had_ been diving into the guts of my objects.

```perl
sub push {
    my $self = shift;
    my $val  = shift;
    push $self->{stack}->@*, $val;
}
```

I honestly didn't know better. There's a _lot_ of Moose documentation, but of the parts I skimmed, nothing seemed to directly address that problem, and nothing seemed to point to anything directly addressing that problem.

So, since I shouldn't get my own hands dirty with Object guts, I suppose I should let Moose handle it.

```perl
has '_stack' => (
    is      => 'ro',
    isa     => 'ArrayRef',
    builder => '_build__stack',
    traits  => ['Array'],
    handles => {
        push => 'push',
        pop  => 'pop',
        top  => 'get',
        _all => 'elements',
    },
);
```

[This is a jump ahead to **Traits** and the specific Traits an **Array** has](https://metacpan.org/pod/Moose::Meta::Attribute::Native::Trait::Array). Among these are `push`, `pop` and `get`, and there's magic\*\* to connecting object methods to trait methods.

![Not Doug Henning saying "Magic!"](https://jacoby.github.io/images/magic.gif)

I Hate Magic.

Not quite to the point that Conan the Barbarian hates magic, but then again, if I had a sword, maybe?

The problem with Magic is that when it fails to work (_<--Notice: The word is not **if**_), it is hard to discern what failed, where to fix it and why it failed.

Yes, I'm aware that nearly _everything_ I do professionally would be considered mystical 60 years ago. _I make sand think!_

> ** _Yes, ["Any sufficiently advanced technology is indistinguishable from magic"](https://en.wikipedia.org/wiki/Clarke's_three_laws), to pull out another eponymous law. This would imply that Moose's attributes are "sufficiently advanced". Sure. But when it fails to work and I don't understand why, or I want to add to it and don't understand something, I still want to hit something with a rock._

But here, now that I've been led deep into **Moose::Meta** to find what the default actions I can have, I know how to let Perl and Moose `handle` `push` and `pop` for me.

There's also `elements`, which returns all the elements on the stack. That's not the behavior I defined in `all`, but notice that it isn't mapped to `all`, but to `_all`.

The trivial thing here: the initial underline is convention for _"this is internal to the Object or something; this is not something you should play with_. We should no more play around with `_stack` than we should mess up the game patient's Funny Bone. I think most people reading this get that point, but if you don't know, now you know.

We'll cover it `all` next, but the key here is that we don't want to give the user an array of everything stacked, but we want to be able to access that array.

### Before After Sideways Around

This is a thing that I see, I get fascinated by, I find no application for in my current tasks, I forget, and I start again.

```perl
has '_stack' => (
    ...
    handles => {
        push => 'push',
        pop  => 'pop',
        top  => 'get',
        _all => 'elements',
    },
    ...
};
```

- `push`: adding to the stack ✅
- `pop`: removing from the stack ✅
- `min`: showing the lowest value on the stack ❎
- `top`: showing the top value on the stack ❓
- `all`: showing the internals of the stack ❎

With `all` we have a way to get what we want, but it isn't in the right form.

```perl
sub all ($self) {
    say join " ", '  --', $self->_all
        if defined $self->top;
}
```

Here, when the stack is `[1, 2, 3]`, we get output that tells us `-- 1 2 3`. It should do nothing on an empty stack, I previously decided.

- `all`: showing the internals of the stack ✅

So now we have to consider `top`.

`top` aliases `get`, and `get` has other behavior. Specifically, we're wanting `get(-1)`, but to get the deepest stacked, there's `get(0)`, and every point in between. We don't want that; we want it to _only_ get the top of the stack.

So, our options are to use `before` to go in front of our method, which can be cool but not what we need...

Or to use `after` to go behind our method, which can also be cool, but not what we need...

```perl
around 'top' => sub ( $orig, $self ) {
    return $self->$orig(-1);
};
```

`around` can _wrap_ or _replace_ the method. It would pass `$orig`, the name of the method being run `around`; `$self` being the object we're playing with, and `@attrib` or the rest of the attributes being sent to the method. We don't _want_ the developer using this module to have access to the whole stack; just the top. So we specify `(-1)`, the top of the stack. `around` declaws `get`, making `top` a nice housecat method.

And then there's `min`. The same issues with `Stack::min` and `List::Util::min` exists, so we use the same solution. I don't think `List::Util` exports anything by default (I'm seeing `@EXPORT_OK` but no `@EXPORT` in the source), but to be sure it drops nothing in the symbol table, we can `use List::Util qw{}`.

Otherwise, the only change is using `_all` instead of the Electro-Probe.

```perl
sub min ($self) {
    return List::Util::min $self->_all;
}
```

### Request for Comments

I went through and made a comment for everything. Well, I'm told that I don't need to add `use strict` and `use warnings` because Moose puts them on by default, but when I'm not locked down and wearing shorts, I can tend to being a little belt-and-suspenders. (**#ElasticIsMagic!**)

But again, while I know Perl, I don't know Moose, and so any addition, subtraction, correction or contraction you want to add, I would love to hear from you.

#### The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;

# This must come before `main`. Most Moose uses will be in a
# separate module, but for the Perl Challenge code, I try to
# keep in all in one file to avoid issues.

package Stack;

use Moose;

use List::Util qw{};                 # explicitly imports nothing
use feature qw{ say signatures };    # usually I add state, just so
                                     # I don't forget it, but I'm not
                                     # using it, so it's not here.

no warnings 'experimental';          # <-- THIS MUST BE AFTER use MOOSE
                                     #     OR warnings will still come

# consider constants. Specifically
#   use constant ARRAY => [];
# ARRAY isn't an array, but a reference to an array, and thus
# I can push and pop and shift and unshift and delete and other
# array methods on it. I just can't make it point to another
# reference.

# Same as here. is => 'ro' just means I can't change array refs
# midstream

# _stack IS an arrayref. It has the traits of an Array, as hidden
# in the docs
#   https://metacpan.org/pod/Moose::Meta::Attribute::Native::Trait::Array

# from traits, we get what it "handles", which are built in object
# methods. push exists as with standard arrays. pop exists as with
# standard arrays. top (what's at the top of the stack) renames
# get.  I mean, it's not identical behavior but I'll be happy with
# it and not send it an input value

# and elements lists all of the entries in the array. This is not
# default behavior. We want it so we can test. So we prepend an
# underline and alias _all

has '_stack' => (
    is      => 'ro',
    isa     => 'ArrayRef',
    builder => '_build__stack',
    traits  => ['Array'],
    handles => {
        push => 'push',
        pop  => 'pop',
        top  => 'get',
        _all => 'elements',
    },
);

# simply a function that returns an empty array
# we could have had builder => {[]}, but evidently
# builder => [] will just make things explode. 
sub _build__stack { [] }

# this is the kind of OOP stuf that, once I started seeing it,
# seemed like magic. we get before, after and around.

# before simply runs *before* a function is run
# after simply runs *after* a function is run

# around has more magic. It interrupts and wraps the
# function named. here it's interrupting the top function
# I complained about, strips any arguments I might have
# wanted to throw at it and specifies the last element,
# the top of the stack.

around 'top' => sub ( $orig, $self ) {
    return $self->$orig(-1);
};

# all, as mentioned, is a function meant to allow us to look
# into the stack and see all the things stacked, so we know
# everything is as it should be. Rather than try to poke
# at the internals, it uses _all to get the list, and top
# to see the top of the stack. If it returns undef, there's
# nothing to say, so it doesn't

sub all ($self) {
    say join " ", '  --', $self->_all
        if defined $self->top;
}

# because it has to be named "min", we can't just import
# min from List::Util, but instead have to Long::Name::subroutine
# it. It's the same, except we use _all to get the list instead
# of interacting with the guts directly

sub min ($self) {
    return List::Util::min $self->_all;
}

# this is boilerplate that keeps Moose load and/or run times
# from exploding. I don't know the magic behind this.

no Moose;
__PACKAGE__->meta->make_immutable;

package main;

# besides being moved down, this is exactly like my Challenge 95
# code.

use feature qw{ say signatures state };
no warnings qw{ experimental };

# I use `say` instead of `print` because the newlines
# improve readability in the output

my $stack = Stack->new;
$stack->push(2);
$stack->push(-1);
$stack->push(0);
$stack->all;    # 2, -1, 0

$stack->pop;    # removes 0
$stack->all;

say $stack->top;    # prints -1
$stack->push(0);

$stack->all;
say $stack->min;    # prints -1

say 'DONE';
exit;
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
