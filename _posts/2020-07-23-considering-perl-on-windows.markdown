---
layout: post
title: "Considering Perl on Windows"
author: "Dave Jacoby"
date: "2020-07-23 18:39:08 -0400"
categories: ""
---

I am writing on this idea for another site, but at this point, I don't know _what_ I'm going to write for that audience, so I'm gonna write for myself and see if I can come up with a thought as to what I need to write for others.

### Why?

Once, long ago, I saw it presented that Perl is the Cliff Notes for Unix. (A quick search for that phrase attributes it to Larry Wall. I don't _believe_ I read it from Larry, but I'm happy with that thought.) In work environments where I didn't _have_ Unix, I went to Cygwin and ActiveState Perl to get myself _something_ that behaves like my beloved Unix when otherwise I had Windows Explorer and cmd.

These days, I have [WSL](https://docs.microsoft.com/en-us/windows/wsl/about), which gives me a full-on Linux userland in a Windows context, with the package manager of my OS of choice as well as `cpanm` for anything I might want. I hadn't needed Perl on the Windows Side as well.

Except.

Sometimes I want to code Perl. Surprising, I know. Sometimes, that Perl is not meant to run on the local machine, but I still want `perltidy` and `perlcritic` and — honestly, mostly `perltidy` — and while there's [a VS Code extension for `perltidy`](https://marketplace.visualstudio.com/items?itemName=sfodje.perltidy), it calls out to the _real_ `perltidy`, so it would only work if I had it installed.

### How?

I have used and liked [ActiveState Perl](https://www.activestate.com/products/perl/downloads/) which is and has been a perfectly wonderful and current Perl on Windows. ActiveState prepackages modules into PPMs, and that works. I don't like rethinking how I admin Perl when I move to a new machine, so a while ago, I started using [Strawberry Perl](http://strawberryperl.com/), which allows me to add modules with `cpan` and `cpanm`.

Additionally, Microsoft has been dipping it's toes in packages starting with NuGet in Visual Studio, and then [Chocolatey](https://chocolatey.org/packages?q=perl), from which you can install either Perl. There's also [WinGet], which I know is shiny and new but haven't used yet. You can install without a package manager, but getting the base to the new hotness is probably easier within one.

### What do I do with it?

By and large, I want to do the same things that I would do on Linux, so "It's Perl, so treat it like Perl". But it would be good to engage with Windows-specific things.

I've never controlled the mouse position in Linux. _Within_ Linux, I suppose. I once wrote code for an Arduino HID device that moved the mouse back and forth, so the screen would not lock, but I haven't done it from the inside.

I _can_ do it within Windows, with [Win32::GUIRobot](https://metacpan.org/pod/Win32::GUIRobot), however. I can get the dimensions of the screen, take screen shots and, yes, set (and click) the mouse with the power of Perl.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use Win32::GUIRobot qw{:all};
use Math::Trig qw(deg2rad);

my $width  = ScreenWidth;
my $height = ScreenHeight;
my $depth  = ScreenDepth;

# $x and $y are the coordinates for center of the screen, 
# and the radius of the circle we're going to draw with the
# mouse pointer
my $x   = $width / 2;
my $y   = $height / 2;
my $rad = $height / 3;

# We're starting at -90 so we start at 12 o'clock
# instead of 3 o'clock, and we're going in this code
# by nines, because 360 was chosen to be evenly divisible
# by many numbers.

# note: programmers are lazy typists, and this is a problem
# here because we have radius, determining the size of the
# circle we're drawing, and radians, which is a mathematically
# more convenient way of expressing the angle than degrees.
# Don't be like me; make your variable names long.
for ( my $deg = -90 ; $deg <= 270 ; $deg += 9 ) {
    my ( $nx, $ny ) = get_xy( $deg, $x, $y, $rad );
    MouseMove $nx, $ny;
}

# this is the bit that turns the degrees into X,Y coordinates
# to move the mouse to. I mostly know this because I have fun
# writing clocks. Geometry is so fun!
sub get_xy ( $deg, $x, $y, $radius ) {
    my $rad = deg2rad($deg);
    my $nx  = int $x + ( $radius * cos($rad) );
    my $ny  = int $y + ( $radius * sin($rad) );
    return $nx, $ny;
}
```

I think I'm gonna have to make a video of this working.

### How do you help?

If you know good modules within `Win32` or otherwise Windows-centric that do cool but perhaps more _useful_ things than make circles with a mouse pointer, hit me up.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
