---
layout: post
title:  "Can't Think of a Pithy Title: Perl Weekly Challenge #124"
author: "Dave Jacoby"
date:   "2021-08-03 14:23:42 -0400"
categories: ""
---

[Here we are again! ](https://theweeklychallenge.org/blog/perl-weekly-challenge-124/)

### TASK #1 › Happy Women Day
> Submitted by: Mohammad S Anwar
> Write a script to print the Venus Symbol, international gender symbol for women. Please feel free to use any character.
```text
    ^^^^^
   ^     ^
  ^       ^
 ^         ^
 ^         ^
 ^         ^
 ^         ^
 ^         ^
  ^       ^
   ^     ^
    ^^^^^
      ^
      ^
      ^
    ^^^^^
      ^
      ^
```

Want to draw a circle? That's 360 degrees, but many things in math are easier to handle in radians, so we convert to radians. Decide the radius, and you can use the radians and the radius to draw the whole thing. I'm putting this into a two-dimensional array, so we'll `int` everything. There's no such thing as `$x[0.2342346]`, right?

Once we've got that done, we draw the tail, but that's easy. A problem is that text characters are taller than wide, so I add a space to make 'em look less drawn out, like a Cinemascope movie projected with the wrong lens.

(What I graph as X and Y are a bit off of what plotting software think of, but if the circles are rough.)

After that, it's simple math to draw the tail, as long as you know where the center and the lowest point are.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use feature qw{say state signatures};
use strict;
use warnings;
use utf8;
no warnings qw{ experimental };

use constant pi => 3.14159;

my $clear  = '  ';
my $filled = ' #';

my @venus;
for my $i ( 0 .. 50 ) {
    for my $j ( 0 .. 40 ) {
        $venus[$i][$j] = $clear;
    }
}
my $maxx = 0;
for my $d ( 0 .. 360 ) {
    my $r   = deg2rad($d);
    my $len = 11;
    my $x   = 19 + int xPos( $len, $r );
    my $y   = 19 - int yPos( $len, $r );
    $venus[$x][$y] = $filled;
    $maxx = $x > $maxx ? $x : $maxx;
}

for my $i ( 0 .. 10 ) {
    $venus[ $maxx + $i ][19] = $filled;
    $venus[ $maxx + 5 ][ 24 - $i ] = $filled;

}

for my $row (@venus) {
    say join '', $row->@*;
}

sub deg2rad ($degrees) {
    return ( $degrees / 180 ) * pi;
}

sub xPos ( $len = 10, $rad = 0 ) {
    return $len * sin $rad;
}

sub yPos ( $len = 10, $rad = 0 ) {
    return $len * cos $rad;
}
```

```text


                               # # # # # # # # #
                           # # #               # # #
                         # #                       # #
                       # #                           # #
                     # #                               # #
                     #                                   #
                   # #                                   # #
                   #                                       #
                   #                                       #
                   #                                       #
                 # #                                       #
                   #                                       #
                   #                                       #
                   #                                       #
                   # #                                   # #
                     #                                   #
                     # #                               # #
                       # #                           # #
                         # #                       # #
                           # # #               # # #
                               # # # # # # # # #
                                       #
                                       #
                                       #
                                       #
                             # # # # # # # # # # #
                                       #
                                       #
                                       #
                                       #
                                       #
```

### TASK #2 › Tug of War
> Submitted by: Mohammad S Anwar  
> You are given a set of `$n` integers (n1, n2, n3, ….).  
>   
> Write a script to divide the set in two subsets of `n/2` sizes each so that the difference of the sum of two subsets is the least. If `$n` is even then each subset must be of size `$n/2` each. In case `$n` is odd then one subset must be `($n-1)/2` and other must be `($n+1)/2`.  

This looks like a job ... for [Algorithm::Permute](https://metacpan.org/pod/Algorithm::Permute). With reservations.

Permute is a common go-to module for me, because what it does is so useful for these challenges. Give it an arrayref and it gives you every possible variation. Given `A B C`, for example, you get

```text
C B A
B C A
B A C
C A B
A C B
A B C
```

With `(10, 20, 30, 40, 50, 60, 70, 80, 90, 100)` as a set, the first split is going to be `(10, 20, 30, 40, 50), (60, 70, 80, 90, 100)`. 

Except that it could also be `(10, 20, 30, 40, 50), (60, 70, 80, 100, 90)`. It could also be `(20, 10, 30, 40, 50), (60, 70, 80, 90, 100)`. So, whether or not this is a good split (it is not), it doesn't deserve to be handled twice. My answer? Sort, stringify, put into a hash and go `next` if that hash key exists.

We store the sets based on whether the current diff of sums is less than the stored diff of sums, which we start absurdly high.

Even when blocking identical sets, you can _still_ have multiple sets that math out correctly.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use feature qw{say state signatures};
use strict;
use warnings;
use utf8;
no warnings qw{ experimental };

use Algorithm::Permute;
use List::Util qw{sum};

my @sets;
push @sets, [ 10, -15, 20, 30, -25, 0, 5, 40, -5 ];
push @sets, [ 10, 20, 30, 40, 50, 60, 70, 80, 90, 100 ];

for my $set (@sets) {
    my ( $s1, $s2 ) = tug_of_war( $set->@* );
    my $sum1 = sum $s1->@*;
    my $sum2 = sum $s2->@*;
    say join ' ', 'Set =  ', $set->@*;
    say join ' ', 'Sub1 = ', $s1->@*;
    say "Sum1 = $sum1";
    say join ' ', 'Sub2 = ', $s2->@*;
    say "Sum2 = $sum2";
    say 'DIFF = ' . abs( $sum1 - $sum2 );
    say '';
}

sub tug_of_war (@set) {
    my $set->@* = @set;
    my %done;
    my $mdiff  = 2 * sum $set->@*;
    my $max    = scalar $set->@*;
    my $center = int( $max / 2 );
    my ( $set1, $set2 );
    my $p = Algorithm::Permute->new($set);

    while ( my @res = $p->next ) {
        my @sub1;
        my @sub2;
        for my $i ( 0 .. -1 + $max ) {
            my $n = $res[$i];
            if ( $i < $center ) {
                push @sub1, $n;
            }
            else {
                push @sub2, $n;
            }
        }
        my $comp = join ' ', ( sort { $a <=> $b } @sub1 ), '|',
            ( sort { $a <=> $b } @sub2 );
        next if $done{$comp}++;
        my $sub1 = sum @sub1;
        my $sub2 = sum @sub2;
        my $diff = abs( $sub1 - $sub2 );
        if ( $diff < $mdiff ) {
            $mdiff    = $diff;
            $set1->@* = sort { $a <=> $b } @sub1;
            $set2->@* = sort { $a <=> $b } @sub2;
        }
        else { next }
    }
    return ( $set1, $set2 );
}
```

```text
Set =   10 -15 20 30 -25 0 5 40 -5
Sub1 =  -25 5 20 30
Sum1 = 30
Sub2 =  -15 -5 0 10 40
Sum2 = 30
DIFF = 0

Set =   10 20 30 40 50 60 70 80 90 100
Sub1 =  30 40 50 60 90
Sum1 = 270
Sub2 =  10 20 70 80 100
Sum2 = 280
DIFF = 10
```



#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)


