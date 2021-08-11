---
layout: post
title: "Computing the Effect of Advantage"
author: "Dave Jacoby"
date: "2021-08-11 16:30:44 -0400"
categories: ""
---

There are mechanisms in D&D 5e, **Advantage** and **Disadvantage**. Basically, Advantage means, when you roll, you roll twice and keep the better roll. Disadvantage means the opposite; you roll twice and keep the worst.

Last I played was AD&D in the 80s, so _new_ could still be decades old, but I've recently started watching Dimension 20 and becoming more familiar with what happened after I became an adult with responsibilities.

So, after understanding why it would come up, I decided to understand the result. I wrote code that made the rolls 10 million times, then showed me the results.

#### Normal

```text
NORMAL
        ROLL    CNT     MAX     AVG     PERC    BLOCK
        1       500336  501640  10      5.0034  #####
        2       498744  501640  10      4.9874  ####
        3       499964  501640  10      4.9996  ####
        4       499328  501640  10      4.9933  ####
        5       500378  501640  10      5.0038  #####
        6       498710  501640  10      4.9871  ####
        7       499798  501640  10      4.9980  ####
        8       499039  501640  10      4.9904  ####
        9       499554  501640  10      4.9955  ####
        10      499196  501640  10      4.9920  ####
        11      501384  501640  10      5.0138  #####
        12      499154  501640  10      4.9915  ####
        13      501640  501640  10      5.0164  #####
        14      500112  501640  10      5.0011  #####
        15      501159  501640  10      5.0116  #####
        16      500273  501640  10      5.0027  #####
        17      500893  501640  10      5.0089  #####
        18      499613  501640  10      4.9961  ####
        19      499946  501640  10      4.9995  ####
        20      500779  501640  10      5.0078  #####
```

This is random, so there's variable, but every number is within a pebble toss from being a 5% chance, and seeing that `100/20 == 5`, that tracks, as does the average being right at the center. So, the analysis works.

#### Advantage

```text
ADVANTAGE
        ROLL    CNT     MAX     AVG     PERC    BLOCK
        1       24970   975534  13      0.2497
        2       75003   975534  13      0.7500
        3       125124  975534  13      1.2512  #
        4       174964  975534  13      1.7496  #
        5       225133  975534  13      2.2513  ##
        6       275264  975534  13      2.7526  ##
        7       323521  975534  13      3.2352  ###
        8       375226  975534  13      3.7523  ###
        9       425252  975534  13      4.2525  ####
        10      474704  975534  13      4.7470  ####
        11      526639  975534  13      5.2664  #####
        12      575093  975534  13      5.7509  #####
        13      623744  975534  13      6.2374  ######
        14      673736  975534  13      6.7374  ######
        15      724289  975534  13      7.2429  #######
        16      775600  975534  13      7.7560  #######
        17      826843  975534  13      8.2684  ########
        18      875950  975534  13      8.7595  ########
        19      923411  975534  13      9.2341  #########
        20      975534  975534  13      9.7553  #########
```

Here, the average roll is 13, a natural 20 is the statistically most common result, at just shy of 10%. The power is evident.

#### Disadvantage

```text
DISADVANTAGE
        ROLL    CNT     MAX     AVG     PERC    BLOCK
        1       975930  975930  7       9.7593  #########
        2       924519  975930  7       9.2452  #########
        3       876680  975930  7       8.7668  ########
        4       825330  975930  7       8.2533  ########
        5       774850  975930  7       7.7485  #######
        6       724971  975930  7       7.2497  #######
        7       674952  975930  7       6.7495  ######
        8       623987  975930  7       6.2399  ######
        9       574753  975930  7       5.7475  #####
        10      524760  975930  7       5.2476  #####
        11      475416  975930  7       4.7542  ####
        12      425107  975930  7       4.2511  ####
        13      375485  975930  7       3.7548  ###
        14      324773  975930  7       3.2477  ###
        15      274635  975930  7       2.7464  ##
        16      224497  975930  7       2.2450  ##
        17      174780  975930  7       1.7478  #
        18      124667  975930  7       1.2467  #
        19      74897   975930  7       0.7490
        20      25011   975930  7       0.2501
```

And here, it looks like the opposite, which is understandable, because it is. The average is 7, or three below 10, just as the average for Advantage is three above. The statistically most common result is a natural 1, just shy of 10%.

#### Quad Disadvantage

At one point in Dimension 20's Fantasy High: The Sophomore Year, Fig was doing _something_ antisocial and annoying Brennan, so he said, for a homebrew rule, this was going to take a Quad Disadvantage roll: four rolls and you take the worst. Fig made it — she has crazy-good modifiers — but that was tough. I was redoing the analysis code, so I thought it would be easy to this.

```text
QUAD DISADVANTAGE
        ROLL    CNT     MAX     AVG     PERC    BLOCK
        1       1855748 1855748 4       18.5575 ##################
        2       1586842 1855748 4       15.8684 ###############
        3       1341491 1855748 4       13.4149 #############
        4       1124391 1855748 4       11.2439 ###########
        5       932683  1855748 4       9.3268  #########
        6       761891  1855748 4       7.6189  #######
        7       615093  1855748 4       6.1509  ######
        8       488757  1855748 4       4.8876  ####
        9       379663  1855748 4       3.7966  ###
        10      288366  1855748 4       2.8837  ##
        11      214185  1855748 4       2.1418  ##
        12      153834  1855748 4       1.5383  #
        13      106707  1855748 4       1.0671  #
        14      69248   1855748 4       0.6925
        15      42045   1855748 4       0.4204
        16      23109   1855748 4       0.2311
        17      10834   1855748 4       0.1083
        18      4064    1855748 4       0.0406
        19      978     1855748 4       0.0098
        20      71      1855748 4       0.0007
```

Here, we're getting close to a 20% chance of a 1, and an average roll of four. This is _very_ "don't go there" energy. If your DM starts talking about quad disadvantage, start thinking about changing your behavior.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use List::Util qw{ min max sum };

my $x = {};
my $y = {};
my $z = {};
my $q = {};

for my $i ( 1 .. 20 ) {
    $x->{$i} = 0;
    $y->{$i} = 0;
    $z->{$i} = 0;
    $q->{$i} = 0;
}

my $loop = 10_000_000;

for my $i ( 1 .. $loop ) {
    $x->{ d20() }++;
    $y->{ max( d20(), d20() ) }++;
    $z->{ min( d20(), d20() ) }++;
    $q->{ min( d20(), d20(), d20(), d20() ) }++;
}

analyze( 'normal',            $loop, $x );
analyze( 'advantage',         $loop, $y );
analyze( 'disadvantage',      $loop, $z );
analyze( 'quad disadvantage', $loop, $q );
exit;

sub analyze ( $tag, $loop, $hashref ) {
    say uc $tag;
    say join "\t", map { uc } '', 'roll', 'cnt', 'max', 'avg', 'perc',
        'block';
    my $sum = sum map { $_ * $hashref->{$_} } 1 .. 20;
    my $avg = int $sum / $loop;
    my $max = max values $hashref->%*;
    for my $i ( 1 .. 20 ) {
        my $c = $hashref->{$i};
        my $p = percent( $c, $loop );
        my $b = blocks( $c, $loop );
        say join "\t", '', $i, $c, $max, $avg, $p, $b;
    }
    say '';
}

sub d20 { return 1 + int rand 20 }

sub blocks ( $num, $denom ) {
    return '#' x int( ( 100 * $num ) / $denom );
}

sub percent ( $num, $denom ) {
    return sprintf '%.4f', ( 100 * $num ) / $denom;
}
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
