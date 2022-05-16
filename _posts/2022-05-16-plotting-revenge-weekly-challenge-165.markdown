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

This one is very much the quick entry into this field. 

#### Show Me The Code

```perl

```

```text

```

![SVG 1](https://jacoby.github.io/images/165-1.svg)

![SVG 1](https://jacoby.github.io/images/imokay.png)

### Task 2: Line of Best Fit

> Submitted by: Ryan J Thompson  
> When you have a scatter plot of points, a line of best fit is the line that best describes the relationship between the points, and is very useful in statistics. Otherwise known as linear regression, here is an example of what such a line might look like:
>
> > See challenge
>
> The method most often used is known as the least squares method, as it is straightforward and efficient, but you may use any method that generates the correct result.
>
> Calculate the line of best fit for the following 48 points:
>
> > `333,129 39,189 140,156 292,134 393,52 160,166 362,122 13,193 341,104 320,113 109,177 203,152 343,100 225,110 23,186 282,102 284,98 205,133 297,114 292,126 339,112 327,79 253,136 61,169 128,176 346,72 316,103 124,162 65,181 159,137 212,116 337,86 215,136 153,137 390,104 100,180 76,188 77,181 69,195 92,186 275,96 250,147 34,174 213,134 186,129 189,154 361,82 363,89`  
>
> Using your rudimentary graphing engine from Task #1, graph all points, as well as the line of best fit.

```perl

```

```text

```

![SVG 2](https://jacoby.github.io/images/165-2.svg)

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
