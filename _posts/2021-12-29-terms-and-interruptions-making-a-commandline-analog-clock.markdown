---
layout: post
title: "Terms and Interruptions: Making a Command-Line Analog Clock"
author: "Dave Jacoby"
date: "2021-12-29 14:52:07 -0500"
categories: ""
---

<img src="https://jacoby.github.io/images/analog_clock.png"> <small>Clock is mine. Earthrise picture is from [Apollo 8 and NASA](https://apod.nasa.gov/apod/ap181224.html).</small>

Making analog clocks with computers is one of my favorite things. Back in the days of CGI, I learned how to make an image in Perl, then

Lately, my playing has been much more in the world of [Javascript and SVG](https://elastic-swirles-0dbf3c.netlify.app/), making the least traditional designs that can still be read as clocks.

But lately I've been thinking more about making one for terminal use. I've never done much with command-line that uses more than basic Getopt-style flags. That's not quite true: I've adapted code that uses the symbol table as a dispatch table and reads the desired commands like git does.

```text
$ git pulp
git: 'pulp' is not a git command. See 'git --help'.

The most similar command is
        pull
```

But by and large, I followed the [Unix philosophy](https://en.wikipedia.org/wiki/Unix_philosophy) allowing the output to be pumped into `grep` or `awk` or whatever I needed to feed it into, or just used it as a trigger, with most cases having no visible output. By and large, nothing needed or wanted to, for example, know the width and height of the terminal window.

I guess I have to credit Mohammad S. Anwar and the Weekly Challenges, like [Challenge #120](https://theweeklychallenge.org/blog/perl-weekly-challenge-120/), with bringing this to mind.

Skimming through the code, there are only a few "clever" things I'm doing.

### "Nice" Exit

I decided that I would want to have a "nice" exit, with a cleared screen instead of the last case of the clock, so I used [`%SIG`](https://perldoc.perl.org/variables/%25SIG) to trap `ctrl-C` to exit the program how I wanted to.

Be sparing with your abuse of this, because it can cause surprise, while the ["Principle of Least Surprise"](https://en.wikipedia.org/wiki/Principle_of_least_astonishment) is a UI/UX bedrock.

```perl
$SIG{INT} = \&tsktsk;

sub tsktsk {
    clear_screen();
    say "THANK YOU";
    exit;
}
```

### Width and Height

If we're to draw anything, we'll want to get the height and width of the terminal window, which we get with `GetTerminalSize` from [Term::ReadKey](https://metacpan.org/pod/Term::ReadKey). It returns the dimensions both in characters and pixels, but here, we're just using characters.

Beyond that, characters are taller than they are wide. I think it's roughly 2/3s as wide as tall, but for our purposes here, using half the size makes the conversion easy. We also cut a line off the height to be sure we're short and not jittery.

```perl
# docs say this mneeds to be called with an
# output filehandle on Windows.
my ( $wchar, $hchar, $wpixels, $hpixels ) = GetTerminalSize();
$hchar -= 2;
$wchar /= 2;
my $centerx = int( $wchar / 2 );
my $centery = int( $hchar / 2 );
```

### Screen Clearing

This is mentioned but moved past in the `%SIG` section, but here we see how to use [Term::Cap](https://metacpan.org/pod/Term::Cap) to give us access to `Tputs`, which allows us to`clear_screen`.

```perl
my ($delay,$tcap);

sub clear_screen { $tcap->Tputs( 'cl', 1, *STDOUT ) }

sub init {
    $|     = 1;
    $delay = ( shift() || 0 ) * 0.005;
    my $termios = POSIX::Termios->new();
    $termios->getattr;
    my $ospeed = $termios->getospeed;
    $tcap = Term::Cap->Tgetent( { TERM => undef, OSPEED => $ospeed } );
    $tcap->Trequire(qw(cl cm cd));
}
```

### Avoiding the "Right" Way

I'm sure there's a way to write a character to a specific X,Y coordinate in a terminal with Perl. I have never known it. It didn't come to me in the casual Googling as I wrote this. But I knew that, knowing the size of the terminal, I could assign something to every position. Arrays!

```perl
my @array;
for my $y ( 0 .. -1 + $hchar ) {
    for my $x ( 0 .. -1 + $wchar ) {
        $array[$y][$x] = '  ';
    }
}
```

### Did I Promise There Would Be No Math? I Didn't Think So.

Ever wonder why we define a circle as being 360 degrees? Because you have a wide number of factors to split it in and still keep simple integer math. The key ones to keep in mind are **12 \* 30** and **6 \* 60**, meaning that you can do simple multiplication to get the degrees.

But<sub>1</sub>, we don't want that, because with the orientation we're using, **0,0** is at the top left, not the bottom left. We can work around that, though.

But<sub>2</sub>, we don't _really_ want that pure integer math, because we can do something clever. I'm writing this at 5:06pm, and if we _use_ that, feed `5.1` into the system instead of `5`, then as we get closer to the next hour, the hour hand _looks_ closer to the next hour, instead of making a 30° jump from, in this case, `5` to `6`. The 6° jumps for the minute hand

But<sub>2</sub>, we don't _really_ want that pure integer math, because we can do something clever. I'm writing this at 5:06pm, and if we _use_ that, feed `5.1` into the system instead of `5`, then as we get closer to the next hour, the hour hand _looks_ closer to the next hour, instead of making a 30° jump from, in this case, `5` to `6`. The 6° jumps for the minute hand are smaller and less jarring, but we can smooth them out a bit as well. I'm refreshing on the second, not using fractional-second sleep, so that's as low as we can go.

But<sub>3</sub>, we don't actually want _degrees_, we want [_radians!_](https://en.wikipedia.org/wiki/Radian) and can get them with `deg2rad` from [Math::Trig](https://metacpan.org/pod/Math::Trig).

So, we have a direction in radians, and using `min` from [List::Util](https://metacpan.org/pod/List::Util) to find the smalles of `$centerx` and `$centery` to allow us to dynamically size the clock face, how do we draw the hands? Math it out from the previously-discovered center.

```perl
my $xpos = $centerx + int xpos( $l, $rad );
my $ypos = $centery - int ypos( $l, $rad );

sub xpos ( $length, $radians ) { return $length * sin($radians) }

sub ypos ( $length, $radians ) { return $length * cos($radians) }
```

I'm handwaving [DateTime](https://metacpan.org/pod/DateTime) because I refer to it a lot and the documentation is very good.

### Show Me The Code

Here is the complete thing. There are a few things I could do to improve this. I could put characters outside the circle of the face to make the circle easier to distinguish. I could follow [brain d foy's suggestion](https://www.perl.com/article/use-terminal-colors-to-distinguish-information/) and use [Term::ANSIColor](https://metacpan.org/pod/Term::ANSIColor) to do things like make the second hand red (which I recall from every classroom clock I've seen). I could actually learn how to write to specific locations. I'm certainly open to suggestions.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use DateTime;
use List::Util qw{ min };
use Math::Trig qw(deg2rad);
use Term::Cap;
use Term::ReadKey;

$SIG{INT} = \&tsktsk;

sub tsktsk {
    clear_screen();
    say "THANK YOU";
    exit;
}

my ( $delay, $tcap );

init();    # Initialize Term::Cap.
tick();
exit;

sub tick() {
    while (1) {
        clear_screen();
        my ( $wchar, $hchar, $wpixels, $hpixels ) = GetTerminalSize();
        $hchar -= 2;
        $wchar /= 2;
        my $centerx = int( $wchar / 2 );
        my $centery = int( $hchar / 2 );

        my @array;
        for my $y ( 0 .. -1 + $hchar ) {
            for my $x ( 0 .. -1 + $wchar ) {
                $array[$y][$x] = '  ';
            }
        }

        my $now = DateTime->now;
        $now->set_time_zone('America/New_York');
        my $h  = $now->hour;
        my $m  = $now->minute;
        my $s  = $now->second;
        my $ss = $s % 10;
        my $r  = ( min $centerx, $centery ) - 2;

        # hour marks
        for ( my $deg = 30 ; $deg <= 360 ; $deg += 30 ) {
            my $d    = $deg / 30;
            my $rad  = deg2rad($deg);
            my $xpos = $centerx + int xpos( $r, $rad );
            my $ypos = $centery - int ypos( $r, $rad );
            $array[$ypos][$xpos] = sprintf '%02d', $d;
        }

        # hour hand
        $h %= 12;
        my $mfrac = ( $m / 60 );
        for my $l ( 1 .. $r * ( 2 / 3 ) ) {
            my $rad  = deg2rad( ( $h + $mfrac ) * 30 );
            my $xpos = $centerx + int xpos( $l, $rad );
            my $ypos = $centery - int ypos( $l, $rad );
            $array[$ypos][$xpos] = 'h ';
        }

        # minute hand
        my $sfrac = ( $s / 60 );
        for my $l ( 1 .. $r * 0.9 ) {
            my $rad  = deg2rad( ( $m + $sfrac ) * 6 );
            my $xpos = $centerx + int xpos( $l, $rad );
            my $ypos = $centery - int ypos( $l, $rad );
            $array[$ypos][$xpos] = 'm ';
        }

        # second hand
        for my $l ( 1 .. $r * 0.8 ) {
            my $rad  = deg2rad( $s * 6 );
            my $xpos = $centerx + int xpos( $l, $rad );
            my $ypos = $centery - int ypos( $l, $rad );
            $array[$ypos][$xpos] = 's ';
        }
        $array[$centery][$centerx] = '# ';
        say join "\n", map { join '', $_->@* } @array;
        sleep 1;
    }
}

sub xpos ( $length, $radians ) { return $length * sin($radians) }

sub ypos ( $length, $radians ) { return $length * cos($radians) }

sub clear_screen { $tcap->Tputs( 'cl', 1, *STDOUT ) }

sub init {
    $|     = 1;
    $delay = ( shift() || 0 ) * 0.005;
    my $termios = POSIX::Termios->new();
    $termios->getattr;
    my $ospeed = $termios->getospeed;
    $tcap = Term::Cap->Tgetent( { TERM => undef, OSPEED => $ospeed } );
    $tcap->Trequire(qw(cl cm cd));
}
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
