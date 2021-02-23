---
layout: post
title: "Spirals and Triangles: Perl Weekly Challenge #101"
author: "Dave Jacoby"
date: "2021-02-23 00:17:34 -0500"
categories: ""
---

### TASK #1 › Pack a Spiral

> Submitted by: Stuart Little  
> You are given an array `@A` of items (integers say, but they can be anything).
>
> Your task is to pack that array into an `MxN` matrix spirally counterclockwise, as tightly as possible.
>
> ‘Tightly’ means the absolute value `|M-N|` of the difference has to be as small as possible.

So, that "Tightly" thing, to me, means that it has to evenly, without gaps. The tightest you can wrap `1...7`, I beiieve, would be `1 2 3 4 5 6 7`.

So, how do we find the tightest matrix we can fill?

```perl
my $s = scalar @array;
my $m = 0;
my $n = 0;

for my $x ( 1 .. $s ) {
    for my $y ( 1 .. $s ) {
        # this is every case that gives us a matrix
        # of correct size
        if ( $x * $y == $s ) {
            # mm will be the smallest of the two sizes
            # and replaces m only when it is bigger than m
            # and n changes at the same time
            my ( $mm, $nn ) = sort { $a <=> $b } ( $x, $y );
            ( $m, $n ) = ( $mm, $nn ) if $mm > $m;
        }
    }
}
```

And now we have to spiral, and given a 3x3 matrix, it _looks_ like we want to start at index `2,0`. I suppose I could find a way to make this iterative, and I suppose I should look for an iterative solution once everyone's solutions are submitted.

However, this is me, and ...

**This looks like a job for _RECURSION!_**

If we're putting `1..9` on a 3x3 matrix, we want it to go like

```text
. . .     . . .     . . .     . . .     . . .
. . .     . . .     . . .     . . .     . . 4
. . .     1 . .     1 2 .     1 2 3     1 2 3

. . 5     . 6 5     7 6 5     7 6 5     7 6 5
. . 4     . . 4     . . 4     8 . 4     8 9 4
1 2 3     1 2 3     1 2 3     1 2 3     1 2 3
```

So, we go _right_ until the end of the matrix, then we go _up_ until the end of the matrix, then we go _left_ until the end of the matrix, then we go _down_ until we see already-entered values, then we go _right_ again until we run out of unfilled space. In _this_ case, I'm working with an arrayref, so I modify the base and don't have to return anything.

I have two `if ...elsif ... else` blocks, and because I may want to move things around, I often add an `if (0) {}` at the start. I do this so that I am free to change the order of the `elsif` statements without having to remember to change `elsif` to `if` simply because it becomes first. It should _never_ match, and sometimes, I add an appropriate X-Files quote: ["Sir, the impossible scenario we never planned for? Well, we better come up with a plan."](https://www.quotes.net/mquote/105920)

The first block determines if we need to change direction, and the second one calls the next recurse, based on that direction. I am _sure_ that I could redo this in a way that there's just one `if` block with nexted `if` blocks, but I'm certain that it's easier to read and understand this form.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

# You are given an array @A of items (integers say,
# but they can be anything).
#
# Your task is to pack that array into an MxN matrix
# spirally counterclockwise, as tightly as possible.

if (@ARGV) {
    spiral(@ARGV);
    exit;
}

my @input;
push @input, [ 1 .. 4 ];
push @input, [ 1 .. 6 ];
push @input, [ 1 .. 8 ];
push @input, [ 1 .. 9 ];
push @input, [ 1 .. 12 ];
push @input, [ 1 .. 15 ];
push @input, [ 1 .. 16 ];
push @input, [ 'A' .. 'Y' ];

for my $input (@input) { spiral( $input->@* ) }
exit;

sub spiral ( @array ) {
    my $s = scalar @array;
    my $m = 0;
    my $n = 0;
    my @mn;

    # find the size of the matrix
    for my $x ( 1 .. $s ) {
        for my $y ( 1 .. $s ) {
            if ( $x * $y == $s ) {
                my ( $mm, $nn ) = sort { $a <=> $b } ( $x, $y );
                ( $m, $n ) = ( $mm, $nn ) if $mm > $m;
            }
        }
    }

    # create the matrix we're filling, and fill the matrix
    my $base;
    for my $x ( 1 .. $m ) {
        for my $y ( 1 .. $n ) { $base->[ $x - 1 ][ $y - 1 ] = undef; }
    }
    make_spiral( $base, \@array, 0, $m, $n, $m - 1, 0, 0 );

    say join ', ', @array;
    say '';
    for my $i ( 0 .. -1 + $m ) {
        print '  ';
        for my $j ( 0 .. -1 + $n ) {
            print sprintf( '% 3s', $base->[$i][$j] ) || ' . ';
        }
        say '';
    }
    say '';
}

# again, this looks like a job for recursion

# direction:
#   0 = right
#   1 = up
#   2 = left
#   3 = down
sub make_spiral ( $base, $array, $dir, $m, $n, $x, $y, $i ) {
    my $s = scalar $array->@*;
    $base->[$x][$y] = $array->[$i];

    # handles cases when we need to change $dir
    if (0) { '' }
    elsif ( $dir == 0 && ( $y + 1 >= $n || defined $base->[$x][ $y + 1 ] ) ) {
        $dir = 1;
    }
    elsif ( $dir == 1 && ( $x - 1 < 0 || defined $base->[ $x - 1 ][$y] ) ) {
        $dir = 2;
    }
    elsif ( $dir == 2 && ( $y - 1 < 0 || defined $base->[$x][ $y - 1 ] ) ) {
        $dir = 3;
    }
    elsif ( $dir == 3 && ( $x + 1 < 0 || defined $base->[ $x + 1 ][$y] ) ) {
        $dir = 0;
    }

    # goes to the next spot in the matrix
    # if there's any places in the matrix open still
    if ( scalar grep { !defined } flatten($base) ) {
        if (0) { }
        elsif ( $dir == 0 ) {
            make_spiral( $base, $array, $dir, $m, $n, $x, $y + 1, $i + 1 );
        }
        elsif ( $dir == 1 ) {
            make_spiral( $base, $array, $dir, $m, $n, $x - 1, $y, $i + 1 );
        }
        elsif ( $dir == 2 ) {
            make_spiral( $base, $array, $dir, $m, $n, $x, $y - 1, $i + 1 );
        }
        elsif ( $dir == 3 ) {
            make_spiral( $base, $array, $dir, $m, $n, $x + 1, $y, $i + 1 );
        }
    }

}

# turns a matrix into an array
sub flatten ( $arrayref ) {
    return map { $_->@* } $arrayref->@*;
}
```

```text
1, 2, 3, 4

    4  3
    1  2

1, 2, 3, 4, 5, 6

    6  5  4
    1  2  3

1, 2, 3, 4, 5, 6, 7, 8

    8  7  6  5
    1  2  3  4

1, 2, 3, 4, 5, 6, 7, 8, 9

    7  6  5
    8  9  4
    1  2  3

1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12

    9  8  7  6
   10 11 12  5
    1  2  3  4

1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15

   11 10  9  8  7
   12 13 14 15  6
    1  2  3  4  5

1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16

   10  9  8  7
   11 16 15  6
   12 13 14  5
    1  2  3  4

A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y

    M  L  K  J  I
    N  W  V  U  H
    O  X  Y  T  G
    P  Q  R  S  F
    A  B  C  D  E
```

### TASK #2 › Origin-containing Triangle

> Submitted by: Stuart Little
> You are given three points in the plane, as a list of six co-ordinates: `A=(x1,y1)`, `B=(x2,y2)` and `C=(x3,y3)`.
>
> Write a script to find out if the triangle formed by the given three co-ordinates contain origin (0,0).
>
> Print 1 if found otherwise 0.

#### Show Me The Code

What are some of the ways to determine if a point is within a triangle? I can think of a few ways. Maybe drawing a ray from point `A` through the origin and seeing if it intersects `BC`, and so on.

The one that looked easiest would be to find the areas of `ABO`, `AOC` and `OBC`, and those areas should all add up to the area of `ABC` if the point is within `ABC`.

I admit that I search for and used an existing Perl solution for finding the area of a triangle. [Thank you, Flavio](https://github.polettix.it/ETOOBUSY/2020/10/01/area-of-triangle/).

A thing that wasn't required, but I felt was useful, was plotting the points of the triangle and the origin, so it would be easier to get a sense of the triangle. I also added the expected response to the data, so when you see `1 : 1` or `0 : 0` in the output, you know the response is as expected.

I suppose I could and perhaps should rewrite it as module so I can `prove t/ch-2.t` or something. Something to add to my to-do list, I suppose.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

use List::Util qw{min max sum};

# You are given three points in the plane, as a list of
# six co-ordinates: A=(x1,y1), B=(x2,y2) and C=(x3,y3).
#
# Write a script to find out if the triangle formed by
# the given three co-ordinates contain origin (0,0).
#
# Print 1 if found otherwise 0.

my @input;
push @input, [ [ [ 0,  1 ],  [ 1,  0 ],  [ 2,  2 ] ],  0 ];
push @input, [ [ [ 1,  1 ],  [ -1, 1 ],  [ 0,  -3 ] ], 1 ];
push @input, [ [ [ 0,  1 ],  [ 2,  0 ],  [ -6, 0 ] ],  1 ];
push @input, [ [ [ -5, 0 ],  [ 4,  3 ],  [ 3,  -4 ] ], 1 ];
push @input, [ [ [ 1,  2 ],  [ 4,  3 ],  [ 3,  4 ] ],  0 ];
push @input, [ [ [ -1, -2 ], [ -4, -3 ], [ -3, -4 ] ], 0 ];

for my $input (@input) {
    my ( $triangle, $test ) = $input->@*;
    my $output = contains_origin($triangle);
    say join "  ", map { join ',', $_->@* } $triangle->@*;
    say join ' : ', $test, $output;
    map_points($triangle);
}

# *A* way to determine if a point P is within the triangle
# formed by points A, B, C  is to find the area of the
# triangle, then find the sub-triangles formed by
#   P, A, B
#   P, A, C
#   P, B, C
# the area of ABC will equal the sums of the others, if
# P is within the triangle

sub contains_origin ( $triangle ) {
    my ( $A, $B, $C ) = $triangle->@*;
    my $o = [ 0, 0 ];
    my $area  = find_area( $A, $B, $C );
    my $area1 = find_area( $A, $B, $o );
    my $area2 = find_area( $A, $o, $C );
    my $area3 = find_area( $o, $B, $C );
    my $sum = sum $area1, $area2, $area3;
    return $sum == $area ? 1 : 0;
}

# I found another Perl programmer to show me how to find the area
# of a triangle
# https://github.polettix.it/ETOOBUSY/2020/10/01/area-of-triangle/

sub find_area ( $A, $B, $C ) {
    my ( $v_x, $v_y ) = map { $B->[$_] - $A->[$_] } 0 .. 1;
    my ( $w_x, $w_y ) = map { $C->[$_] - $A->[$_] } 0 .. 1;
    my $vv = $v_x * $v_x + $v_y * $v_y;
    my $ww = $w_x * $w_x + $w_y * $w_y;
    my $vw = $v_x * $w_x + $v_y * $w_y;
    return sqrt( $vv * $ww - $vw * $vw ) / 2;
}

# this is thrown in as a bonus: showing the graph with the origin
# represented as * and the points shown as +

sub map_points( $list ) {
    my %points;
    for my $p ( $list->@* ) { $points{ $p->[0] }{ $p->[1] } = 1; }
    my @x = map { $_->[0] } $list->@*;
    my @y = map { $_->[1] } $list->@*;
    my $minx = -1 + min 0, @x;
    my $miny = -1 + min 0, @y;
    my $maxx = 1 + max 0,  @x;
    my $maxy = 1 + max 0,  @y;
    say '';

    say join ' ', '+', ( map { '-' } $minx .. $maxx ), '+';

    for my $y ( reverse $miny .. $maxy ) {
        print '| ';
        for my $x ( $minx .. $maxx ) {
            if ( defined $points{$x}{$y} ) { print '+' }
            elsif ( $x == 0 && $y == 0 ) { print '*' }
            elsif ( $x == 0 ) { print '|' }
            elsif ( $y == 0 ) { print '-' }
            else              { print ' ' }
            print ' ';
        }
        say '|';
    }
    say join ' ', '+', ( map { '-' } $minx .. $maxx ), '+';
    say '';
}
```

```text
0,1  1,0  2,2
0 : 0

+ - - - - - +
|   |       |
|   |   +   |
|   +       |
| - * + - - |
|   |       |
+ - - - - - +

1,1  -1,1  0,-3
1 : 1

+ - - - - - +
|     |     |
|   + | +   |
| - - * - - |
|     |     |
|     |     |
|     +     |
|     |     |
+ - - - - - +

0,1  2,0  -6,0
1 : 1

+ - - - - - - - - - - - +
|               |       |
|               +       |
| - + - - - - - * - + - |
|               |       |
+ - - - - - - - - - - - +

-5,0  4,3  3,-4
1 : 1

+ - - - - - - - - - - - - +
|             |           |
|             |       +   |
|             |           |
|             |           |
| - + - - - - * - - - - - |
|             |           |
|             |           |
|             |           |
|             |     +     |
|             |           |
+ - - - - - - - - - - - - +

1,2  4,3  3,4
0 : 0

+ - - - - - - - +
|   |           |
|   |     +     |
|   |       +   |
|   | +         |
|   |           |
| - * - - - - - |
|   |           |
+ - - - - - - - +

-1,-2  -4,-3  -3,-4
0 : 0

+ - - - - - - - +
|           |   |
| - - - - - * - |
|           |   |
|         + |   |
|   +       |   |
|     +     |   |
|           |   |
+ - - - - - - - +
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
