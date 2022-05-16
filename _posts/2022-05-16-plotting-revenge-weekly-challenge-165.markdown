---
layout: post
title: "Plotting Revenge:: Weekly Challenge #165"
author: "Dave Jacoby"
date: "2022-05-16 16:22:06 -0400"
categories: ""
---

It's time for [Weekly Challenge #165](https://theweeklychallenge.org/blog/perl-weekly-challenge-165/).

[165](<https://en.wikipedia.org/wiki/165-(number)>) is of course not prime, being the product of 11 and 15. As 15 is the product of 3 and 5, 165 is a [Sphenic number](https://en.wikipedia.org/wiki/Sphenic_number). It is also a Self number, the description of which I don't quite understand:

> In number theory, a self number or Devlali number in a given number base {\displaystyle b}b is a natural number that cannot be written as the sum of any other natural number _**n**_ and the individual digits of _**n**_.

### Task 1: Scalable Vector Graphics (SVG)

> Submitted by: Ryan J Thompson  
> Scalable Vector Graphics (SVG) are not made of pixels, but lines, ellipses, and curves, that can be scaled to any size without any loss of quality. If you have ever tried to resize a small JPG or PNG, you know what I mean by “loss of quality”! What many people do not know about SVG files is, they are simply XML files, so they can easily be generated programmatically.
>
> For this task, you may use external library, such as Perl’s SVG library, maintained in recent years by our very own Mohammad S Anwar. You can instead generate the XML yourself; it’s actually quite simple. The source for the example image for Task #2 might be instructive.
>
> Your task is to accept a series of points and lines in the following format, one per line, in arbitrary order:
>
> - **Point:** x,y
> - **Line:** x1,y1,x2,y2
>
> Then, generate an SVG file plotting all points, and all lines. If done correctly, you can view the output `.svg` file in your browser.

This one is very much the quick entry into this field. Make something SVG and display it. In this case, the output _is_ XML, so we can have easily hard-coded a lot of the boilerplate like DOCTYPE, then added `<circle>` and `<line>` elements by hand, but what fun is that? Perl has a perfectly-good [SVG](https://metacpan.org/pod/SVG) module, so we should _use_ it!

Since I was there and thought it would be useful, I added borders.

The cool next step would be to pull configuration from `STDIN` or something, but I have the base of it here. The key is that a **point** is defined by two values, a **line** is defined by four values, and we're not going to be dealing with **rectangles** or other more complex shapes today.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use SVG;

my $config = <<'END';

53,10
53,10,23,30
23, 30

END

my @config = grep { /\d/ } split /\n/, $config;
my $svg    = SVG->new(
    height => 100,
    width  => 100,
);

for my $entry (@config) {
    my @coords = map { int $_ } split /,/, $entry;
    add_line( $svg, \@coords )         if scalar @coords == 4;
    add_point( $svg, \@coords, 'red' ) if scalar @coords == 2;
}

my $output = $svg->xmlify;
say $output;
exit;

sub add_line ( $svg, $coords, $color = 'black' ) {
    $svg->line(
        x1    => $coords->[0],
        y1    => $coords->[1],
        x2    => $coords->[2],
        y2    => $coords->[3],
        style => {
            stroke         => $color,
            'stroke-width' => 0.5,
            fill           => $color,
        }
    );

}

sub add_point ( $svg, $coords, $color = 'black' ) {
    $svg->circle(
        cx    => $coords->[0],
        cy    => $coords->[1],
        r     => 0.5,
        style => {
            stroke         => $color,
            'stroke-width' => 0.5,
            fill           => $color,
        }
    );
}


```

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<svg height="100" width="100" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	<circle cx="53" cy="10" r="0.5" style="fill: red; stroke: red; stroke-width: 0.5" />
	<line style="fill: black; stroke: black; stroke-width: 0.5" x1="53" x2="23" y1="10" y2="30" />
	<circle cx="23" cy="30" r="0.5" style="fill: red; stroke: red; stroke-width: 0.5" />
	<!--
	Generated using the Perl SVG Module V2.86
	by Ronan Oger
	Info: http://www.roitsystems.com/
	-->
</svg>
```

![SVG 1](https://jacoby.github.io/images/wc165-1.svg)

### Task 2: Line of Best Fit

> Submitted by: Ryan J Thompson  
> When you have a scatter plot of points, a **line of best fit** is the line that best describes the relationship between the points, and is very useful in statistics. Otherwise known as linear regression, here is an example of what such a line might look like:
>
> > See challenge
>
> The method most often used is known as the [least squares method](https://www.mathsisfun.com/data/least-squares-regression.html), as it is straightforward and efficient, but you may use any method that generates the correct result.
>
> Calculate the line of best fit for the following 48 points:
>
> > `333,129 39,189 140,156 292,134 393,52 160,166 362,122 13,193 341,104 320,113 109,177 203,152 343,100 225,110 23,186 282,102 284,98 205,133 297,114 292,126 339,112 327,79 253,136 61,169 128,176 346,72 316,103 124,162 65,181 159,137 212,116 337,86 215,136 153,137 390,104 100,180 76,188 77,181 69,195 92,186 275,96 250,147 34,174 213,134 186,129 189,154 361,82 363,89`
>
> Using your rudimentary graphing engine from **Task #1**, graph all points, as well as the line of best fit.

We've developed the primitive types, the _line_ and the _point_, and now we are to plot the points and draw a line that is close to the plotted points.

One thing I did is, for display purposes, change every _y_ to _height - y_, because the origin, in SVG terms, is the _upper_ left corner, while mathematically, it's the _lower_ left corner.

Beyond that, the math is fairly well spelled out. I used the plot given in the link's example to check my plot. I did a deep-dive with [List::Util](https://metacpan.org/pod/List::Util)'s `sum0`, `product`, `max` and `min` functions.

I think the next thing would be to scale whatever data we have to whatever image size is set. But while I could do that, today is not that day.

I also used [Getopt::Long](https://metacpan.org/pod/Getopt::Long) and `STDERR` to display the math so I could check it.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ max min product sum0 };
use SVG;
use Getopt::Long;

my $verbose = 0;
GetOptions( 'verbose' => \$verbose, );

my $config = <<'END';
333,129  39,189 140,156 292,134 393,52  160,166 362,122  13,193
341,104 320,113 109,177 203,152 343,100 225,110  23,186 282,102
284,98  205,133 297,114 292,126 339,112 327,79  253,136  61,169
128,176 346,72  316,103 124,162  65,181 159,137 212,116 337,86
215,136 153,137 390,104 100,180  76,188  77,181  69,195  92,186
275,96  250,147  34,174 213,134 186,129 189,154 361,82  363,89
END

# invert Y axis
my $w      = 400;
my $h      = 200;
my @config = map {
    [ map { int } split /,/, $_ ]
} grep { /\d/ } split /\s+/, $config;

say STDERR join "\n", map { join ',', $_->@* }
    sort { $a->[0] <=> $b->[0] } @config
    if $verbose;

# transform the Y axis because with SVG, 0 is in the
# upper left corner, but for traditional mathematics,
# it is in the lower left corner.
@config = map { $_->[1] = $h - $_->[1]; $_ } @config;

# a good next step might be to scale and orient the
# graph to a hardcoded maybe 500x500 plot size

my $svg = SVG->new(
    height => $h,
    width  => $w,
);

# outline the box
add_line( $svg, [ 0, 0, 0, $h ],   'gray', 3 );
add_line( $svg, [ 0, 0, $w, 0 ],   'gray', 3 );
add_line( $svg, [ $w, $h, 0, $h ], 'gray', 3 );
add_line( $svg, [ $w, $h, $w, 0 ], 'gray', 3 );

# plot every entry
for my $entry (@config) {
    my @coords = $entry->@*;
    add_point( $svg, \@coords, 'red', 2 );
}

# lots of math
my $maxx = max map { $_->[0] } @config;
my $minx = min map { $_->[0] } @config;

my $N     = scalar @config;
my $sumx  = sum0 map { $_->[0] } @config;
my $sumx2 = sum0 map { $_->[0]**2 } @config;
my $sumy  = sum0 map { $_->[1] } @config;
my $sumxy = sum0 map { product $_->@* } @config;

my $m = sprintf '%.2f',
    ( $N * $sumxy - ( $sumx * $sumy ) ) / ( $N * $sumx2 - ( $sumx**2 ) );
my $bi = sprintf '%.2f', ( $sumy - ( $m * $sumx ) ) / $N;

my $miny = $m * $minx + $bi;
my $maxy = $m * $maxx + $bi;

say STDERR <<"END" if $verbose;
    N:     $N
    sumx:  $sumx
    sumx2: $sumx2
    sumy:  $sumy
    sumxy: $sumxy
    m:     $m
    b:     $bi
    maxx: $maxx
    maxy: $maxy
    minx: $minx
    miny: $miny
  y = ${m}x + $bi

END

add_line( $svg, [ $maxx, $maxy, $minx, $miny ], 'blue' );

my $output = $svg->xmlify;
say $output;
exit;

sub add_line ( $svg, $coords, $color = 'black', $width = 0.5 ) {
    $svg->line(
        x1    => $coords->[0],
        y1    => $coords->[1],
        x2    => $coords->[2],
        y2    => $coords->[3],
        style => {
            stroke         => $color,
            'stroke-width' => $width,
            fill           => $color,
        }
    );

}

sub add_point ( $svg, $coords, $color = 'black', $width = 0.5 ) {
    $svg->circle(
        cx    => $coords->[0],
        cy    => $coords->[1],
        r     => 0.7,
        style => {
            stroke         => $color,
            'stroke-width' => $width,
            fill           => $color,
        }
    );
}


```

```text
$ ch-2.svg
13,193
23,186
34,174
39,189
61,169
65,181
69,195
76,188
77,181
92,186
100,180
109,177
124,162
128,176
140,156
153,137
159,137
160,166
186,129
189,154
203,152
205,133
212,116
213,134
215,136
225,110
250,147
253,136
275,96
282,102
284,98
292,134
292,126
297,114
316,103
320,113
327,79
333,129
337,86
339,112
341,104
343,100
346,72
361,82
362,122
363,89
390,104
393,52
    N:     48
    sumx:  10366
    sumx2: 2847440
    sumy:  3103
    sumxy: 852737
    m:     0.30
    b:     -0.14
    maxx: 393
    maxy: 117.76
    minx: 13
    miny: 3.76
  y = 0.30x + -0.14
```

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<svg height="200" width="400" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	<line style="fill: gray; stroke: gray; stroke-width: 3" x1="0" x2="0" y1="0" y2="200" />
	<line style="fill: gray; stroke: gray; stroke-width: 3" x1="0" x2="400" y1="0" y2="0" />
	<line style="fill: gray; stroke: gray; stroke-width: 3" x1="400" x2="0" y1="200" y2="200" />
	<line style="fill: gray; stroke: gray; stroke-width: 3" x1="400" x2="400" y1="200" y2="0" />
	<circle cx="333" cy="71" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="39" cy="11" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="140" cy="44" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="292" cy="66" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="393" cy="148" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="160" cy="34" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="362" cy="78" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="13" cy="7" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="341" cy="96" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="320" cy="87" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="109" cy="23" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="203" cy="48" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="343" cy="100" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="225" cy="90" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="23" cy="14" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="282" cy="98" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="284" cy="102" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="205" cy="67" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="297" cy="86" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="292" cy="74" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="339" cy="88" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="327" cy="121" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="253" cy="64" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="61" cy="31" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="128" cy="24" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="346" cy="128" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="316" cy="97" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="124" cy="38" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="65" cy="19" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="159" cy="63" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="212" cy="84" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="337" cy="114" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="215" cy="64" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="153" cy="63" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="390" cy="96" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="100" cy="20" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="76" cy="12" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="77" cy="19" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="69" cy="5" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="92" cy="14" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="275" cy="104" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="250" cy="53" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="34" cy="26" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="213" cy="66" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="186" cy="71" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="189" cy="46" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="361" cy="118" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<circle cx="363" cy="111" r="0.7" style="fill: red; stroke: red; stroke-width: 2" />
	<line style="fill: blue; stroke: blue; stroke-width: 0.5" x1="393" x2="13" y1="117.76" y2="3.76" />
	<!--
	Generated using the Perl SVG Module V2.86
	by Ronan Oger
	Info: http://www.roitsystems.com/
	-->
</svg>


```

![SVG 2](https://jacoby.github.io/images/wc165-2.svg)

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
