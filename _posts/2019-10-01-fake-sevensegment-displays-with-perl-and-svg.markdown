---
layout: post
title: "Fake Seven-Segment Displays with Perl and SVG"
author: "Dave Jacoby"
date: "2019-10-01 15:32:27 -0400"
categories: ""
---

The second challenge for Perl Challenge, Week 28:

## Write a script to display **Digital Clock**. Feel free to be as creative as you can when displaying digits. We expect bare minimum something like **“14:10:11”**.

I used [SVG](https://metacpan.org/pod/SVG), a fun library I use for lots of interesting things -- different than what I do with SVGs with Javascript, actually -- and while I would normally think about making an ["analog" clock](https://jacoby.github.io/2019/09/13/scaled-vector-graphics-on-the-web-for-fun-and.html), this requirement made me think about the half-baked idea of reimplementing [seven-segment displays](https://en.wikipedia.org/wiki/Seven-segment_display) in SVG with Perl.

I use [DateTime](https://metacpan.org/pod/DateTime) to handle getting the time, because of course I do.

```perl
#!/usr/bin/env perl

# This program displays the time

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

use Carp;
use DateTime;
use SVG;

my $now = DateTime->now->set_time_zone('America/Indianapolis');

my $dark = '#333333';
my $lite = '#b0ec13';

digital_clock( map { sprintf '%02d', $_ } $now->hour,
    $now->minute, $now->second );

sub digital_clock ( $h, $m, $s ) {

    # create the SVG object
    my $svg = SVG->new(
        height => 230,
        width  => 800,
    );

    # use a rectangle to make the background dark
    $svg->rectangle(
        x      => 0,
        y      => 0,
        height => 230,
        width  => 800,
        fill   => '#222222',
    );

    # draw semicolons to separate hours from minutes from seconds
    for my $x ( 530, 260 ) {
        for my $y ( 70, 140 ) {
            $svg->circle(
                cx    => $x,
                cy    => $y,
                r     => 8,
                style => { fill => $lite }
            );

        }
    }

    # get separate numbers for separate segments
    my ( $h1, $h2 ) = split //, $h;
    my ( $m1, $m2 ) = split //, $m;
    my ( $s1, $s2 ) = split //, $s;

    #draw the segments
    draw_digit( $svg, 10,  10, segments($h1) );
    draw_digit( $svg, 140, 10, segments($h2) );

    draw_digit( $svg, 280, 10, segments($m1) );
    draw_digit( $svg, 410, 10, segments($m2) );

    draw_digit( $svg, 550, 10, segments($s1) );
    draw_digit( $svg, 680, 10, segments($s2) );

    # export the file
    my $output = $svg->xmlify;
    my $file   = 'digital_clock.svg';
    if ( open my $fh, '>', $file ) {
        print $fh $output;
        close $fh;
    }
}

sub draw_digit ( $svg, $x, $y, @s ) {

    # the abstract endpoints of each segment
    # offset by the passed-in x and y coordinates
    # x1,y1,x2,y2
    my @segments;
    push @segments, [ 0,   0,   100, 0 ];
    push @segments, [ 0,   0,   0,   100 ];
    push @segments, [ 100, 0,   100, 100 ];
    push @segments, [ 0,   100, 100, 100 ];
    push @segments, [ 0,   100, 0,   200 ];
    push @segments, [ 100, 100, 100, 200 ];
    push @segments, [ 0,   200, 100, 200 ];

    my $group = $svg->group(
        style => {
            fill => 'none',
        }
    );
    for my $segment ( 0 .. @segments ) {
        next unless defined $segments[$segment];
        my $stroke = $s[$segment] ? $lite : $dark;
        my $x1     = $x + $segments[$segment][0];
        my $y1     = $y + $segments[$segment][1];
        my $x2     = $x + $segments[$segment][2];
        my $y2     = $y + $segments[$segment][3];
        $group->line(
            x1    => $x1,
            y1    => $y1,
            x2    => $x2,
            y2    => $y2,
            style => {
                stroke         => $stroke,
                'stroke-width' => '10',
            }
        );
    }

}

sub segments ( $d ) {
    return ( 0, 1, 2, 3, 4, 5, 6 ) if 0;
    return ( 1, 1, 1, 0, 1, 1, 1 ) if $d == 0;
    return ( 0, 0, 1, 0, 0, 1, 0 ) if $d == 1;
    return ( 1, 0, 1, 1, 1, 0, 1 ) if $d == 2;
    return ( 1, 0, 1, 1, 0, 1, 1 ) if $d == 3;
    return ( 0, 1, 1, 1, 0, 1, 0 ) if $d == 4;
    return ( 1, 1, 0, 1, 0, 1, 1 ) if $d == 5;
    return ( 1, 1, 0, 1, 1, 1, 1 ) if $d == 6;
    return ( 1, 0, 1, 0, 0, 1, 0 ) if $d == 7;
    return ( 1, 1, 1, 1, 1, 1, 1 ) if $d == 8;
    return ( 1, 1, 1, 1, 0, 1, 0 ) if $d == 9;
    croak 'Out of Range Number';
}
```

And this writes a file like this:

![14:49:59](https://jacoby.github.io/images/digital_clock.svg)

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
