---
layout: post
title: "Object::Pad and Types? A Learning Experience"
author: "Dave Jacoby"
date: "2021-09-27 18:28:54 -0400"
categories: ""
---

[Previously in my investigation of Object::Pad](https://jacoby.github.io/2021/09/23/objectpad-again-this-time-with-subclassing.html), I created an implementation of a Point object, which I was able to extend to allow it to become a Point in 3D space by adding a z axis.

The next step? Do something with a Line consisting of two points.

Honestly, so far, just using arrayrefs has been easy enough for me:

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

my $i = [ 0, 0 ];
my $j = [ 3, 2 ];

my $distance = distance( $i, $j );
say $distance;

# 3.60555127546399

# As seen in
# https://jacoby.github.io/2021/07/27/ugly-and-square-perl-weekly-challenge-123.html
sub distance ( $p1, $p2 ) {
    return
        sqrt(
        ( ( $p1->[0] - $p2->[0] )**2 ) + ( ( $p1->[1] - $p2->[1] )**2 ) );
}
```

The point **J** is microscopically past 3.605 from point **I**, which is the origin. I personally think that rounding the result to the third decimal place is sufficient for nearly anything I'd want to do with it, and I do it rarely enough that an arrayref is sufficient to contain everything I would need.

Previously, I had a `CorPoint` class that contained thing I didn't need, because I wanted to learn how to use attributes. I wiped them, leaving only `x` and `y`.

```perl
use Object::Pad;

use strict;
use warnings;
use feature qw{ say postderef signatures };
no warnings qw{ experimental };

package CorPoint 0.01;

class CorPoint {
    has $x :param :mutator = 0;
    has $y :param :mutator = 0;

    method xy () {
        return join ', ',$x,$y;
    }
}
```

And now I need a **Line** object that takes two Point objects. I need to be able to say that they _must_ be Point objects, and we get that from [Object::Pad::SlotAttr::Isa](https://metacpan.org/pod/Object::Pad::SlotAttr::Isa) (which doesn't install on Strawberry Perl with `cpanm` but I was too far down this rabbit hole to shave that yak). I get to say `:Isa(CorPoint)`. I've tried to feed it non-CorPoint values and it silently drops to defaults. I'm not currently sure whether I'd want it to silently handle it or `croak` and complain. I think it depends on where I am in development.

```perl
use strict;
use warnings;
use feature qw{ say postderef signatures };
no warnings qw{ experimental };

use Carp;
use Object::Pad;
use Object::Pad::SlotAttr::Isa;

use lib '.';
use CorPoint;

package CorLine 0.01;

class CorLine {
    has $i :param :reader :Isa(CorPoint) = CorPoint->new();
    has $j :param :reader :Isa(CorPoint) = CorPoint->new();

    method distance {
        return 
            sqrt( ( ( $self->i->x - $self->j->x )**2 ) +
                ( ( $self->i->y - $self->j->y )**2 ) );
    }

    method dist {
        return sprintf '%0.3f', $self->distance;
    }
}
```

(I made the `dist` method because of my earlier _third-decimal place_ comment.)

So, now I can make an object where the values are objects of the specified class.

And, in place?

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use Cwd qw( abs_path );
use File::Basename qw( dirname );
use lib dirname( abs_path($0) );
use CorLine;
use CorPoint;

my $i = CorPoint->new( x => 5, y => 7 );
my $j = CorPoint->new( x => 3, y => 2 );
my $k = CorPoint->new();

my $l = CorPoint->new( 1, 4 ); # defaults to x=>0, y=>0
$l->x = 1;
$l->y = 4;

for my $p1 ( $i, $j, $k, $l ) {
    for my $p2 ( $i, $j, $k, $l ) {
        my $line = CorLine->new( i => $p1, j => $p2 );
        say join "\t",
            $line->i->xy,
            $line->j->xy,
            $line->dist,
            $line->distance,
            ;
    }
    say '';
}
```

And the output:

```text
5, 7    5, 7    0.000   0
5, 7    3, 2    5.385   5.3851648071345
5, 7    0, 0    8.602   8.60232526704263
5, 7    1, 4    5.000   5

3, 2    5, 7    5.385   5.3851648071345
3, 2    3, 2    0.000   0
3, 2    0, 0    3.606   3.60555127546399
3, 2    1, 4    2.828   2.82842712474619

0, 0    5, 7    8.602   8.60232526704263
0, 0    3, 2    3.606   3.60555127546399
0, 0    0, 0    0.000   0
0, 0    1, 4    4.123   4.12310562561766

1, 4    5, 7    5.000   5
1, 4    3, 2    2.828   2.82842712474619
1, 4    0, 0    4.123   4.12310562561766
1, 4    1, 4    0.000   0
```

As I mentioned previously, Paul Evans talked to Purdue Perl Mongers about this, and to get my understanding to the point where the code worked, I had to go back to the **See Also** at the end of his slides and do some searching to get to `SlotAttr::Isa`, but I'm now very happy with it.

There was [a recent Weekly Challenge](https://jacoby.github.io/2021/07/27/ugly-and-square-perl-weekly-challenge-123.html) where we're given four points and are to determine if they're squares. In the review, it was mentioned that mine failed because it assumed an order. I'm thinking that I can resolve that using these Points and Lines. My thought is that you take points **A**, **B**, **C** and **D**, make lines between all of them (you _can_ do **A->A**, sure, but why?), sort the pairs by length, and determine if the longest four lines have the same length. If they don't, it's not a square. 

But that's a task for another night.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
