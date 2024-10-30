---
layout: post
title: "Taking A New Angle: Weekly Challenge #293"
author: "Dave Jacoby"
date: "2024-10-30 15:21:50 -0400"
categories: ""
---

Here we are, into Halloween and [_**Weekly Challenge #293!**_](https://theweeklychallenge.org/blog/perl-weekly-challenge-293/)

### Task 1: Similar Dominos

> Submitted by: Mohammad Sajid Anwar  
> You are given a list of dominos, `@dominos`.
>
> Write a script to return the number of dominoes that are similar to any other domino.
>
> `$dominos[i] = [a, b]` and `$dominos[j] = [c, d]` are same if either `(a = c and b = d)` or `(a = d and b = c)`.

#### Let's Talk About it

The key thing about dominos is that they're not directional. `1, 3` is the same as `3, 1`, so we need to orient them the same so that we can compare them. So, I numerically `sort` each domino, concatenate them, use a hash and `$hash{$value}++` to count them, sort the keys by values and return the highest value.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use List::Util qw{ first max };

my @examples = (

    [ [ 1, 3 ], [ 3, 1 ], [ 2, 4 ], [ 6, 8 ] ],
    [ [ 1, 2 ], [ 2, 1 ], [ 1, 1 ], [ 1, 2 ], [ 2, 2 ] ],
);

for my $example (@examples) {
    my $output = similar_dominos( $example->@* );
    my $input  = join ', ', map { qq{[$_]} }
        map { join ', ', $_->@* } $example->@*;
    say <<"END";
    Input:  \$ints = ($input)
    Output: $output
END
}

sub similar_dominos (@dominos) {
    my %hash;
    map { $hash{$_}++ }
        map { join ',', $_->@* }
        map {
        [ sort { $a <=> $b } $_->@* ]
        } @dominos;
    my @values =
        map  { $hash{$_} }
        sort { $hash{$b} <=> $hash{$a} }
        keys %hash;
    return shift @values;
}
```

```text
$ ./ch-1.pl
    Input:  $ints = ([1, 3], [3, 1], [2, 4], [6, 8])
    Output: 2

    Input:  $ints = ([1, 2], [2, 1], [1, 1], [1, 2], [2, 2])
    Output: 3

```

#### Task 2: Boomerang

> Submitted by: Mohammad Sajid Anwar
> You are given an array of points, `(x, y)`.
>
> Write a script to find out if the given points are a boomerang.
>
> A **boomerang** is a set of three points that are all distinct and not in a straight line.

#### Let's Talk About it

I had a thought, coded, committed and uploaded it, then had a thought and rewrote the thing.

Points are defined by `x` and `y` coordinates, and unlike dominos, you cannot flip them around. An `x` is an `x`. There's a lot of old standbys I go to, and this one makes use of [Algorithm::Permute](https://metacpan.org/pod/Algorithm::Permute). Say you want to deal with 3 elements, `A`, `B` and `C`. You pass in a reference to an array with those three elements and you get an iterator that gives you all the various ways for them to be arranged, which are:

> A B C  
> A C B  
> B A C  
> B C A  
> C A B  
> C B A

And the elements within that anonymous array can by anything, including two-element lists that are playing as points. 

My first pass involved finding the distance between `A` and `B` (defined as `i = B - A` for both `x` and `y` coordinates), and seeing if `B + i = C`. And the thing is, that's a test but not the right one. A **vector** is direction and magnitude, so in the `x,y` plane, `0,0` and `1,1` are separated by a vector `1,1`, so `2,2` would be the same vector away from `1,1`, but that's not the question. `3,3` would be on the same line, making those three points **not a boomerang**, but this test would mean nothing for the point `7,7`.

Clearly, I have committed a naiïve and wrong solution, and now I have to correct it. And it came to me while I had descended to sleep. The Permute idea is right, but I needed to find the angle starting at one point, `AB` and `AC` if you will. And as it turns out, I *had* that code in a toy project I wrote recently, using SVG graphics to create a Star Trek-like starscape. For that, I insert dots randomly within the image area, determine the distance and angle that is from the center, then move it 110% or so from the center on that same angle. This is the kind of thing that each generation goes into mathematics courses to learn, then immediately forget after the test.

```javascript
function angleDeg(x1, y1, x2, y2) {
    return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
}
```

Rather than say `my $pi = 3.14159`, I used [Math::Trig](https://metacpan.org/pod/Math::Trig) to give us `pi`. (I always consider using [utf8](https://metacpan.org/pod/utf8) to allow the use of unicode symbols as variable names so I can make it `$π`.) `atan2` doesn't need a module to be used.

And as is common, we write tests on the data, return `false` when they fail and `true` at the end. It's easier flow control than if statements. 

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use Algorithm::Permute;
use Math::Trig;
my @examples = (

    [ [ 1, 1 ], [ 2, 3 ], [ 3, 2 ] ],
    [ [ 1, 1 ], [ 2, 2 ], [ 3, 3 ] ],
    [ [ 1, 1 ], [ 1, 2 ], [ 2, 3 ] ],
    [ [ 1, 1 ], [ 1, 2 ], [ 1, 3 ] ],
    [ [ 1, 1 ], [ 2, 1 ], [ 3, 1 ] ],
    [ [ 0, 0 ], [ 2, 3 ], [ 4, 5 ] ],
    [ [ 1, 1 ], [ 1, 1 ], [ 1, 3 ] ],
);

for my $example (@examples) {
    my $input = join ', ', map { qq{[$_]} }
        map { join ', ', $_->@* } $example->@*;
    my $output = boomerang( $example->@* );
    say <<"END";
    Input:  \@points = ( $input )
    Output: $output
END
}

sub boomerang (@points) {

    # all distinct
    my %hash;
    map { $hash{$_}++ }
        map { join ',', $_->@* } @points;
    my @values =
        map  { $hash{$_} }
        sort { $hash{$b} <=> $hash{$a} }
        keys %hash;
    return 'false' if $values[0] > 1;

    # not in a straight line
    my $p = Algorithm::Permute->new( \@points );
    while ( my @d = $p->next ) {
        my $angle1 = get_angle( $d[0]->@*, $d[1]->@* );
        my $angle2 = get_angle( $d[0]->@*, $d[2]->@* );
        return 'false' if $angle1 == $angle2;
    }
    return 'true';
}

sub get_angle ( $x1, $y1, $x2, $y2 ) {
    return ( 180 / pi ) * atan2( $y2 - $y1, $x2 - $x1 );
}
```

```text
$ ./ch-2.pl 
    Input:  @points = ( [1, 1], [2, 3], [3, 2] )
    Output: true

    Input:  @points = ( [1, 1], [2, 2], [3, 3] )
    Output: false

    Input:  @points = ( [1, 1], [1, 2], [2, 3] )
    Output: true

    Input:  @points = ( [1, 1], [1, 2], [1, 3] )
    Output: false

    Input:  @points = ( [1, 1], [2, 1], [3, 1] )
    Output: false

    Input:  @points = ( [0, 0], [2, 3], [4, 5] )
    Output: true

    Input:  @points = ( [1, 1], [1, 1], [1, 3] )
    Output: false

```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
