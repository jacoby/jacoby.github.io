---
layout: post
title: "Bitty Tours: Perl Weekly Challenge #121"
author: "Dave Jacoby"
date: "2021-07-13 14:40:51 -0400"
categories: ""
---

### TASK #1 › Invert Bit

> Submitted by: Mohammad S Anwar  
> You are given integers 0 <= `$m` <= 255 and 1 <= `$n` <= 8.
>
> Write a script to invert `$n` bit from the end of the binary representation of `$m` and print the decimal representation of the new binary number.

The basic actions are the same as we've covered many times recently: `sprintf '%08b', $var` to convert from decimal to binary, `oct('0b'.$var)` to convert back, and `substr($var,$n,1) = function_that_changes(substr($var,$n,1))` to change the value at one place.

The magic here is to flip a bit, and for that, `$var = 1 - $var` does that quickly and easily. (First pass, I did `($var + 1) % 2`, but subtraction is much simpler than modulus.)

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use feature qw{say state signatures};
use strict;
use warnings;
use utf8;
no warnings qw{ experimental };

use Getopt::Long;
use Carp;

my $m = 0;
my $n = 1;
GetOptions(
    'm=i' => \$m,
    'n=i' => \$n,
);
croak q{M out of range} if $m > 255 || $m < 0;
croak q{N out of range} if $n > 8   || $n < 1;

my $o = invert_bit( $m, $n );
print <<"END";
    m $m    n $n    o $o
END

sub invert_bit ( $m = 0, $n = 1 ) {
    my $bin = sprintf '%08b', $m;
    my $nn  = 8 - $n;
    substr( $bin, $nn, 1 ) = 1 - substr( $bin, $nn, 1 );
    return oct( '0b' . $bin );
}
```

```text
 jacoby > Bishop > mnt > c > Users > jacob > 121 > $ ./ch-1.pl -m 12 -n 3
    m 12    n 3    o 8
 jacoby > Bishop > mnt > c > Users > jacob > 121 > $ ./ch-1.pl -m 18 -n 4
    m 18    n 4    o 26
```

### TASK #2 › The Travelling Salesman

> Submitted by: Jorg Sommrey  
> You are given a NxN matrix containing the distances between N cities.
>
> Write a script to find a round trip of minimum length visiting all N cities exactly once and returning to the start.
>
> BONUS 1: For a given number N, create a random NxN distance matrix and find a solution for this matrix.  
> BONUS 2: Find a solution for a random matrix of size 15x15 or 20x20

Before we get too far into my explanations and excuses, I'm _very_ curious about the distance matrix.

```text
Matrix: [0, 5, 2, 7]
        [5, 0, 5, 3]
        [3, 1, 0, 6]
        [4, 5, 4, 0]
```

I'm not sure I can think of a place that takes almost half the time to get somewhere as it takes to get back, but it takes **4** time units to get from `3` to `0`, and **7** time units to get from `0` to `3`. Or maybe vice versa. I mean, there _may_ be one-way roads or issues of timely traffic density, but in general, if it takes you an hour to get there, it takes an hour to get back. If I was to do the bonus challenges (which I did not) (**_ETA:_ I did. I talked myself into it.**), I would try to be sure that `$map[$i][$j]`is equal to `$map[$j][$i]`.

The challenge is _Find a solution for a random matrix of size 15x15 or 20x20_, and that is for a good reason: [Travelling Salesman](https://en.wikipedia.org/wiki/Travelling_salesman_problem) is [**NP Hard**](https://en.wikipedia.org/wiki/NP-hardness). The 4x4 matrix has 6 solutions, which is 3!. (That's three factorial, not three emphasized. [I've written about math memes that use that confusion before.](https://jacoby.github.io/math/2018/02/19/solving-a-math-meme.html)) `1 * 2 * 3 = 6`. Take it to 5x5 and you get 25 solutions. It gets logarithmically harder as time goes on. At 15!, we're at **1.3076744e+12**, is a fantastically huge number, and going through them is all is going to suck all sorts of time.

(Funny story: I was talking to a community organizer who wanted software to generate efficient walks for leafletting. I told him "You _know_ that's one of the great unsolved problems Computer Science, right?")

A CS prof once said that dealing with NP problems is good, because there's no good solution so it's a license to hack. I would start limiting branches by keeping track of the current shortest branch length, and giving up when you pass that with partial paths. That will buy you something, but I'm not sure how much. The solution, of course, is to add it, create a huge matrix where every `$map[$x][$x] = 0` and probably `$map[$i][$j] = $map[$j][$i]` (because really), and let it heat silicon for hours.

I will leave that [as an exercise for the reader](http://www.catb.org/~esr/jargon/html/E/exercise--left-as-an.html).

I suppose I could imagine an iterative solution, but, and repeat it with me:

[**This looks like a job for _Recursion!_**](https://www.google.com/search?q=%22this+looks+like+a+job+for+recursion%22)

If I was writing this for work, I would pass solutions back, but I wanted the best tour and the best length as **dreaded global variables**. That is the kind of thing I might use `state` for, except it gets hairy if you're doing `travelling_salesman($map1); travelling_salesman($map2);`, so to allow an optimization I ended up avoiding, I forebore.

I _did_ grow the matrix to 5x5 (Hi, Faith!) for testing.

**_ETA:_ And also, `build_random_map` and all.**

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

use Carp;
use Getopt::Long;
use List::Util qw{sum0};

my $n   = 0;
my $map = [ [ 0, 5, 2, 7 ], [ 5, 0, 5, 3 ], [ 3, 1, 0, 6 ], [ 4, 5, 4, 0 ], ];

GetOptions( 'n=i' => \$n, );
croak q{N out of range} if $n > 20 || $n < 0;

if ( $n > 0 ) {
    $map = build_random_map($n);
}

my @final_tour;
my $f = 1000000;
travelling_salesman($map);
my $tour = join ' ', @final_tour;

say <<"END";
    length: $f
    tour:   $tour
END

say join "\n", '', map { join ' ', $_->@* } $map->@*;

sub travelling_salesman ( $map, $loc = 0, $tour = [] ) {
    push $tour->@*, $loc;
    my $l = tour_length( $map, $tour );
    return unless $l < $f;

    my %tour    = map  { ( $_, 1 ) } $tour->@*;
    my @options = grep { !$tour{$_} } 0 .. -1 + scalar $map->@*;

    if ( scalar @options ) {
        for my $o (@options) {
            my $next->@* = $tour->@*;
            travelling_salesman( $map, $o, $next );
        }
    }
    else {
        push $tour->@*, $tour->[0];
        my $l = tour_length( $map, $tour );
        say join ' ', 'END', $l, '', $f, '', $tour->@*;
        if ( $l < $f ) {
            @final_tour = $tour->@*;
            $f          = $l;
        }
    }
}

sub tour_length ( $map, $tour ) {
    my $n = -1 + scalar $map->@*;
    my @dist;
    for my $i ( 0 .. $n ) {
        my $j = $i + 1;
        next unless $tour->[$i];
        next unless $tour->[$j];
        my $x = $tour->[$i];
        my $y = $tour->[$j];
        my $d = $map->[$x][$y];
        push @dist, $d;
    }
    return sum0 @dist;
}

sub build_random_map ( $n ) {
    my $output = [];
    for my $i ( 0 .. -1 + $n ) {
        for my $j ( $i .. -1 + $n ) {
            my $r = 1 + int rand 9;
            $output->[$i][$j] = $r;
            $output->[$j][$i] = $r;
            $output->[$i][$j] = 0 if $i == $j;
        }
    }
    return $output;
}
```

```text
END 60  1000000  0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 0
END 55  60  0 1 2 3 4 5 6 7 8 9 10 11 12 14 13 0
END 53  55  0 1 2 3 4 5 6 7 8 9 10 11 13 12 14 0
END 48  53  0 1 2 3 4 5 6 7 8 9 10 11 13 14 12 0
END 47  48  0 1 2 3 4 5 6 7 8 9 10 12 14 13 11 0
END 44  47  0 1 2 3 4 5 6 7 8 9 11 10 12 14 13 0
END 43  44  0 1 2 3 4 5 6 7 8 9 11 13 10 12 14 0
END 41  43  0 1 2 3 4 5 6 7 8 9 11 13 14 12 10 0
END 40  41  0 1 2 3 4 5 6 7 8 10 12 14 13 11 9 0
END 39  40  0 1 2 3 4 5 6 9 11 13 10 12 14 7 8 0
END 38  39  0 1 2 3 4 7 6 5 9 11 10 13 14 12 8 0
END 37  38  0 1 2 3 4 7 6 5 9 11 13 10 14 12 8 0
END 36  37  0 1 2 3 4 7 6 5 9 11 13 14 12 10 8 0
END 35  36  0 1 2 3 6 5 9 11 13 10 4 7 14 12 8 0
END 34  35  0 1 2 3 6 5 9 11 13 14 12 10 4 7 8 0
END 33  34  0 1 2 3 8 7 4 9 11 13 14 12 6 5 10 0
END 32  33  0 1 2 4 7 6 3 8 12 14 13 11 9 5 10 0
END 31  32  0 1 2 4 7 6 5 9 11 13 10 12 14 3 8 0
END 30  31  0 1 3 2 4 5 6 9 11 13 10 12 14 7 8 0
END 29  30  0 1 3 2 4 7 6 5 9 11 10 13 14 12 8 0
END 28  29  0 1 3 2 4 7 6 5 9 11 13 10 14 12 8 0
END 27  28  0 1 3 2 4 7 6 5 9 11 13 14 12 10 8 0
END 26  27  0 1 3 6 5 2 4 7 8 10 12 14 13 11 9 0
END 25  26  0 1 3 6 9 11 13 14 12 10 5 2 4 7 8 0
END 24  25  0 1 3 8 7 4 2 5 6 9 11 13 14 12 10 0
END 23  24  0 1 5 2 4 7 6 9 11 13 10 12 14 3 8 0
END 22  23  0 1 7 4 2 5 6 9 11 13 10 12 14 3 8 0
END 21  22  0 4 7 1 10 12 14 13 11 9 6 5 2 3 8 0
END 20  21  0 8 3 6 5 2 4 7 1 10 12 14 13 11 9 0
    length: 20
    tour:   0 8 3 6 5 2 4 7 1 10 12 14 13 11 9 0


0 5 9 1 2 5 5 8 4 2 2 4 4 6 2
5 0 9 3 7 2 2 2 4 8 2 6 2 7 1
9 9 0 2 2 1 3 3 7 7 9 8 6 9 1
1 3 2 0 5 9 1 4 2 7 7 2 4 6 1
2 7 2 5 0 5 9 2 8 5 5 9 7 7 7
5 2 1 9 5 0 1 8 6 3 3 3 3 9 7
5 2 3 1 9 1 0 2 8 2 9 8 1 3 4
8 2 3 4 2 8 2 0 4 7 7 6 8 3 2
4 4 7 2 8 6 8 4 0 6 5 9 4 9 9
2 8 7 7 5 3 2 7 6 0 7 1 8 5 5
2 2 9 7 5 3 9 7 5 7 0 4 3 3 3
4 6 8 2 9 3 8 6 9 1 4 0 8 1 7
4 2 6 4 7 3 1 8 4 8 3 8 0 6 1
6 7 9 6 7 9 3 3 9 5 3 1 6 0 1
2 1 1 1 7 7 4 2 9 5 3 7 1 1 0

real    7m28.849s
user    7m22.969s
sys     0m0.500s
```

I ran it with `time`, so I have performance numbers, but that's not _really_ meaningful, because the field is random. They say that there has not been, in the history of cards, two properly-shuffled decks with the same card order, and if `52!` withstands the centuries-long Monte Carlo brute-force attack across humanity, I think that `(15*15)!` is pretty proof against repeated maps.

I'm trying with 20x20, and might quit because my laptop is hot and I want my terminal back. To compare solutions, it'd be better to generate matrixes externally and import them by filename or something, but eh. I'm at the end of the blog.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
