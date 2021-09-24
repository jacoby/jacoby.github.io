---
layout: post
title: "Object::Pad Again! This Time, With Subclassing!"
author: "Dave Jacoby"
date: "2021-09-23 19:37:34 -0400"
categories: ""
---

[When we left off](https://jacoby.github.io/perl/2021/09/22/a-first-pass-at-objectpad-some-more.html), we had a Node implementation in Cor/[Object::Pad](https://metacpan.org/pod/Object::Pad), called _CorNode_. Sticking with that convention, and following the [Moose Cookbook](https://metacpan.org/dist/Moose/view/lib/Moose/Cookbook/Basics/Point_AttributesAndSubclassing.pod), I jumped ahead to Points! Included is a cheet sheet to remind me what the `has` attributes do.

```perl
use Object::Pad;

use strict;
use warnings;
use feature qw{ say postderef signatures };
no warnings qw{ experimental };

package CorPoint 0.01;

# because :param,   $x->new(x=>1)
# because :reader,  $x->y
# because :mutator, $x->q = 1
# because :mutator, $y=$x->q
# because :writer,  $x->set_r('Poe')

class CorPoint {
    has $x :param :reader = 0;
    has $y :param :reader = 0;
    has $q :mutator = 0;
    has $r :writer = 'Ovid';

    method xy () {
        return join ', ',$x,$y;
    }

    method rrr () { return $r }

    BUILD {
        say 'BUILD: '. $self->xy;
    }
}
```

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use lib '/mnt/c/Users/jacob';
use CorPoint;

my $i = CorPoint->new( x => 1, y => 1 );
my $j = CorPoint->new( x => 2, y => 3 );
my $k = CorPoint->new();
my $l = CorPoint->new( q => 7 );

display_hack( $i, $j, $k, $l );
$l->set_r('Poe');
display_hack( $i, $j, $k, $l );

sub display_hack( @arr ) {
    say '-' x 20;
    say join "\t", qw{ reference x y xy q writer };
    for my $p (@arr) {
        say join "\t", ref $p, $p->x, $p->y, $p->xy, $p->q, $p->rrr,;
    }
}
```

```text
$ ./points.pl
BUILD: 1, 1
BUILD: 2, 3
BUILD: 0, 0
BUILD: 0, 0
--------------------
reference       x       y       xy      q       writer
CorPoint        1       1       1, 1    0       Ovid
CorPoint        2       3       2, 3    0       Ovid
CorPoint        0       0       0, 0    0       Ovid
CorPoint        0       0       0, 0    0       Ovid
--------------------
reference       x       y       xy      q       writer
CorPoint        1       1       1, 1    0       Ovid
CorPoint        2       3       2, 3    0       Ovid
CorPoint        0       0       0, 0    0       Ovid
CorPoint        0       0       0, 0    0       Poe
```

I'm not sure _if_ I'll do anything with `BUILD`. If there was a `distance_to_origin` method, I could compute it in `BUILD` and keep it as a variable, but that would mean I couldn't change my x and ys without explicitly doing it, _or_ just make it a method. But it's hear so we can see that it works and where it shows up. (I've not made `ADJUST` work, either. Not being sure what I could do if it worked, I'm leaving it be.)

But the Moose Cookbook jumps to extending `Point` into `Point3D` by adding a `z`. I mean, clearly, there's no reason for a functional, non-research Point object to have `q` and `r`, right? So I'm kinda leaning that way>?

Anyway...

```perl
use Object::Pad;

use strict;
use warnings;
use feature qw{ say postderef signatures };
no warnings qw{ experimental };

use lib '.';
use CorPoint;

package CorPoint3D 0.01;

class CorPoint3D isa CorPoint {
    has $z :param :reader = 0;

    method xyz () {
        return join ', ', $self->x, $self->y, $self->z;
    }

    method xy :override () {
        return join ',', $self->x, $self->y;
    }
}
```

In context:

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use Cwd qw( abs_path );
use lib '/mnt/c/Users/jacob';
use CorPoint3D;

my $i = CorPoint3D->new( x => 1, y => 1 );
my $j = CorPoint3D->new( x => 2, y => 3, z => 4 );
my $k = CorPoint3D->new();
my $l = CorPoint3D->new( q => 7 );

display_hack( $i, $j, $k, $l );
$l->set_r('Poe');
display_hack( $i, $j, $k, $l );

sub display_hack( @arr ) {
    say '-' x 20;
    say join "\t", qw{ reference x y xy xyz q writer };
    for my $p (@arr) {
        say join "\t", ref $p, $p->x, $p->y, $p->xy, $p->xyz, $p->q, $p->rrr,;
    }
}
```

```text
BUILD: 1,1
BUILD: 2,3
BUILD: 0,0
BUILD: 0,0
--------------------
reference       x       y       xy      xyz     q       writer
CorPoint3D      1       1       1,1     1, 1, 0 0       Ovid
CorPoint3D      2       3       2,3     2, 3, 4 0       Ovid
CorPoint3D      0       0       0,0     0, 0, 0 0       Ovid
CorPoint3D      0       0       0,0     0, 0, 0 0       Ovid
--------------------
reference       x       y       xy      xyz     q       writer
CorPoint3D      1       1       1,1     1, 1, 0 0       Ovid
CorPoint3D      2       3       2,3     2, 3, 4 0       Ovid
CorPoint3D      0       0       0,0     0, 0, 0 0       Ovid
CorPoint3D      0       0       0,0     0, 0, 0 0       Poe
```

Here we add `z` as both a `param` (so `new->CorPoint3d(z=>3)` works, as does `$obj->z`), as well as an `xyz` method, that, like `CorPoint`'s `xy` method, returns a comma-separated string of the coordinates.

Because I was playing, I also overrid that `xy` method to remove the space in the concatenation. What I'm thinking should come _soon_ is `before`, `after` and `around`, which I've seen used in anger. I think that, if you have the proper modern infrastructure, you don't need to have `before` and `around` as much to adjust the objects into the form you need. But I'm just an unfrozen caveman programmer, and these new ideas confuse and frighten me.

So, now that I have subclassing, I think the next thing is to use these in typing. I'm thinking that I should make a line that takes two points and has a `length` method. Or, a `CorLine` that takes two `CorPoint`s, and I use another in a more Roles context to force the `length` method, which then needs to redo the line into `CorLine3D` using `CorPoint3D`s instead of `CorPoint`s. I guess I'm seeing the sense behind types that I've missed so far.

I _like_ these experiments so far. I'm beginning to see the use for them, kinda. But a common go-to for me is filling data into a hashref and feeding that to Template Toolkit. I know what happens in TT when I give it a scalar, but what happens when I give it a `CorPoint`? It seems to add problems without solving them, at least in my most common use cases. Then again, I think I write fairly trailing-edge Perl.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
