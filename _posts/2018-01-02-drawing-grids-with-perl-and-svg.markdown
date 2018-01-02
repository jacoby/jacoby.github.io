---
layout: post
title:  "Drawing Grids with Perl and SVG"
author: "Dave Jacoby"
date:   "2018-01-02 14:39:17 -0500"
categories: svg
---

[My friend Brian](https://twitter.com/brianwisti) wrote and blogged on [using Python and Pillow to make grids so he can art(https://randomgeekery.org/2017/11/24/drawing-grids-with-python-and-pillow/)].

I thought "Cool". And then I thought "But I don't *like* Python!", and decided to re-implement this in Perl. 

I also decided to go SVG, because that fits my use case. I am much more likely to want to throw to a laser cutter, so something that more naturally pops into Inkscape is good for me.

I have also written Spirograph stuff that outputs in SVG. I might revisit later. This is *much* simpler, with no sine or cosine necessary.

Anyway...

``` perl
#!/usr/bin/env perl

use strict ;
use warnings ;
use utf8 ;
use feature qw{ postderef say signatures state } ;
no warnings qw{ experimental::postderef experimental::signatures } ;

use Carp ;
use Getopt::Long ;
use Pod::Usage ; # when I fix my man/help screens
use SVG ;

my $config = config() ;

...

sub config () {
    my $config = {
        dot    => 0,
        height => 600,
        width  => 600,
        step   => 10,
        file   => 'graph.svg',
        } ;
    GetOptions(
        'man'      => \$config->{ man },
        'height=i' => \$config->{ height },
        'width=i'  => \$config->{ width },
        'step=i'   => \$config->{ step },
        'dot'      => \$config->{ dot },
        'file=s'   => \$config->{ file },
        ) ;

    exit if $config->{ height } < 100 ;
    exit if $config->{ width } < 100 ;
    exit if $config->{ step } < 1 ;
    exit if $config->{ man } ;
    return $config ;
    }

```

Brian uses `sys.argv`, but I have long since decided that argument order is going to inevitably end in confusion, going with options and [Getopt::Long](https://metacpan.org/pod/Getopt::Long). Perl's motto is *There's More Than One Way To Do It*, and the `Getopt` section of Getopt is full of ways to do it, but some are better than others, and unless I'm just slurping and joining ARGV, I have standardized on Getopt::Long.

The `field=i` in `GetOptions()` also ensures that those are integer fields.

I will also point out that [Pod::Usage](https://metacpan.org/pod/Pod::Usage) is in there, but not used. I do use it a lot, and this would be where and how it tells us that `--height 20` and `--step -10` are just not on. But, as is, it just exits.

I do this, in part, because I know that `--help` and `--height` will compete for `-h`. I will have to consider the flags sometime.

``` perl
my $svg = SVG->new(
    height => $config->{ height },
    width  => $config->{ width },
    ) ;

...

my $output = $svg->xmlify ;
if ( open my $fh, '>', $config->{ file } ) {
    print $fh $output ;
    close $fh ;
    say 'Done' ;
    }
else {
    say 'fail' ;
    }
```

If we just stop here, we just create an empty SVG file.

``` xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<svg height="600" width="600" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	<!-- 
	Generated using the Perl SVG Module V2.64
	by Ronan Oger
	Info: http://www.roitsystems.com/
 -->
</svg>
```

I have long said "I hate XML; I love RSS", and this follows. I don't have to dive into the innards of SVG files often, if at all, so as long as it stays consistent, I am happy with it.

Looking back at GetOptions, you'll notice a boolean flag for `--dots`. From Field Notes, I have become a fan of graph paper that uses dots instead of lines to create the graph. So, here, I have added that option. It also allows me to show drawing both circles and lines in SVG.

``` perl
if ( $config->{ dot } ) {
    my $height = $config->{ height } ;
    my $width  = $config->{ width } ;
    my $step   = $config->{ step } ;

    for ( my $h = 0 ; $h <= $height ; $h = $h + $step ) {
        for ( my $v = 0 ; $v <= $width ; $v = $v + $step ) {
            $svg->circle(
                cx    => $v,
                cy    => $h,
                r     => 0.5,
                style => {
                    stroke         => 'black',
                    'stroke-width' => 0.2,
                    fill           => 'black',
                    }
                    ) ;
            }
        }

    say 'DOT' ;
    }
else {
    say 'LINE' ;
    my $height = $config->{ height } ;
    my $width  = $config->{ width } ;
    my $step   = $config->{ step } ;

    # horizontal
    for ( my $h = 0 ; $h <= $height ; $h = $h + $step ) {
        $svg->line(
            x1    => 0,
            y1    => $h,
            x2    => $width,
            y2    => $h,
            style => {
                stroke         => 'black',
                'stroke-width' => 0.2,
                fill           => 'none',
                }
                ) ;
        }

    # vertical
    for ( my $v = 0 ; $v <= $width ; $v = $v + $step ) {
        $svg->line(
            x1    => $v,
            y1    => $0,
            x2    => $v,
            y2    => $height,
            style => {
                stroke         => 'black',
                'stroke-width' => 0.2,
                fill           => 'none',
                }
                ) ;
        }
    }
```

I copied variables out of `$config` to avoid some verbosity inside the loops. I'm not 100% happy with this. I could definitely see this as a violation of **DRY**.

The syntax for `$svg->line()` and `$svg->circle()` are, I think, far more important than for loops. I leave adding stroke and fill values as an exercise to the reader.

[The full code is available as a GitHub Gist.](https://gist.github.com/jacoby/adaf5cda20c60453489c1d518eb80075)

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


