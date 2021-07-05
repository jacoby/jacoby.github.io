---
layout: post
title: "It's About Time: Weekly Challenge #120"
author: "Dave Jacoby"
date: "2021-07-05 17:21:16 -0400"
categories: ""
---

### TASK #1 › Swap Odd/Even Bits

> Submitted by: Mohammad S Anwar  
> You are given a positive integer $N less than or equal to 255.
>
> Write a script to swap the odd positioned bit with even positioned bit and print the decimal equivalent of the new binary representation.

This one goes back to skills we've dealt with a lot recently, including `reverse` in a scalar context and switching between binary and decimal representations.

I _think_ the only thing I had to look into was finding a way to get the numbers into pairs, which I did via regular expressions. Once there, I used `scalar reverse` to swap the bits.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use feature qw{say state signatures};
use strict;
use warnings;
use utf8;
no warnings qw{ experimental };

for my $n ( 18, 101 ) {
    say join "\t", '', $n, swap_bits($n);
}

sub swap_bits ($n) {
    my $b = sprintf '%08b', $n;
    my $r = join '', map { scalar reverse($_) } ( $b =~ /../g );
    my $s = oct( '0b' . $r );
    return $s;
}
```

```text
        18      33
        101     154
```


### TASK #2 › Clock Angle

> Submitted by: Mohammad S Anwar  
> You are given time `$T` in the format `hh:mm`.
>
> Write a script to find the smaller angle formed by the hands of an analog clock at a given time.
>
> HINT: A analog clock is divided up into 12 sectors. One sector represents 30 degree (360/12 = 30).

**HINT 2:** You watch an analog clock and there usually isn't a blocky action. There is instead a smooth action, and at 11:30, the hour hand isn't dead on the 11, but halfway between 11 and 12.

Therefore, strictly speaking, the placement of your minute hand is dependent on the second hand, and the placement of the hour hand is dependent on the minute hand. _But_, we're not given a second hand, so that's immaterial.

I had expected the [JS clocks I like building](https://jacoby.github.io/clock2/) to have a lot more to do with this, but there's no need to switch to radians like you would if you were actually planning to place the hands onto a clock face. We're just finding the angle. Geometry prefers to put 0 degrees at 3 o'clock rather than 12 o'clock, so that's good.

Speaking of angle, that angle will at max be 180 degrees, because the moment it goes to 181 degrees, the short angle will be on the other side and be 179.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

my @times = qw{ 3:10 4:00 4:20 6:00 11:59 12:00 3:21 };
@times = map { "11:$_" } 20 .. 65;

for my $time (@times) {
    $time = fix_time($time);
    my $angle = clock_angle($time);
    say join "\t", '', $time, $angle;
}

sub fix_time ($time) {
    my ( $hour, $minute ) = split /:/, $time;
    $hour += 1 if $minute >= 60;
    $minute = sprintf '%02d', $minute % 60;
    $hour   = $hour % 12;
    $hour   = $hour ? $hour : 12;
    return join ':', $hour, $minute;
}

sub clock_angle ($time) {
    my ( $hour, $minute ) = split /:/, $time;
    my $minute_angle = minute_angle($minute);
    my $hour_angle   = hour_angle( $hour, $minute );
    my ( $min, $max ) = sort $minute_angle, $hour_angle;
    my $angle = $max - $min;
    if ( $angle > 180 ) {
        $angle = abs $min - $max;
    }
    if ( $angle > 180 ) {
        $angle = 360 - $angle;
    }
    return $angle;
}

sub hour_angle ( $hour, $minute ) {
    $hour++ if $minute > 60;
    return ( ( $hour % 12 ) * 30 ) + ( ( $minute % 60 ) / 2 );
}

sub minute_angle ($minute) {
    return 6 * ( $minute % 60 );
}
```

```text
	11:20	140
	11:21	145.5
	11:22	151
	11:23	156.5
	11:24	162
	11:25	167.5
	11:26	173
	11:27	178.5
	11:28	176
	11:29	170.5
	11:30	165
	11:31	159.5
	11:32	154
	11:33	148.5
	11:34	143
	11:35	137.5
	11:36	132
	11:37	126.5
	11:38	121
	11:39	115.5
	11:40	110
	11:41	104.5
	11:42	99
	11:43	93.5
	11:44	88
	11:45	82.5
	11:46	77
	11:47	71.5
	11:48	66
	11:49	60.5
	11:50	55
	11:51	49.5
	11:52	44
	11:53	38.5
	11:54	33
	11:55	27.5
	11:56	22
	11:57	16.5
	11:58	11
	11:59	5.5
	12:00	0
	12:01	5.5
	12:02	11
	12:03	16.5
	12:04	22
	12:05	27.5
```


#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
