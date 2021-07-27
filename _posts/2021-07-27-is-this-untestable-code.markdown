---
layout: post
title: "Is this Untestable Code"
author: "Dave Jacoby"
date: "2021-07-27 15:36:16 -0400"
categories: ""
---

![Is this Untestable Code?](https://jacoby.github.io/images/untestable_code.jpg)

I'm doing some work for an ex-boss, modifying code I wrote nine years ago. This relates to biological sciences, specifically telling a scientific instrument what is going on it, so that the techs don't have to type nearly as much.

What I found is that the instrument takes an input that's a ZIP file full of XML, only two of which need to have input. Because I was teaching myself [Template Toolkit](http://www.template-toolkit.org/), and because I don't hate myself enough to try to convince a tool built to make general XML to try to make _this_ XML, I made those two XML files into templates and filled them with what is necessary.

This is kinda the way things were loading (call it **Old Order**):

```text
    1   2   3   4   5   6   7   8
    9   10  11  12  13  14  15  16
    17  18  19  20  21  22  23  24
    25  26  27  28  29  30  31  32
    33  34  35  36  37  38  39  40
    41  42  43  44  45  46  47  48
```

But this is the way we want it now (call it **New Order**):

```text
    1   4   7   10  13  16  19  22
    2   5   8   11  14  17  20  23
    3   6   9   12  15  18  21  24
    25  28  31  34  37  40  43  46
    26  29  32  35  38  41  44  47
    27  30  33  36  39  42  45  48
```

With some hand-waiving that is crucial to the task at hand but isn't necessary for this blog post. The key thought,for those who might read this from the biological end of computing, is _multichannel pipettes_. We want three wells filled with a sample, and it's easier if you try to fill **A6**, **B6**, and **C6** than, for example, **A6**, **A7** and **B1**.

```text
grep sub *pm
sub make_file {
sub clone_Directory {
sub read_Directory {
sub plate_template {
sub experiment_template {
```

The work of the module in question is to:

- copy the directory into `/scratch` (`clone_Directory`)
- create a **plate record** and write into the copied directory (`plate_template`)
- create an **experiment record** and write into the copied directory (`experiment_template`)
- get a **list of filenames** in that copied directory (`read_directory`)
- feed the list into [IO::Compress::Zip](https://metacpan.org/pod/IO::Compress::Zip) \* pass that zip file out to where it's to be used (`make_file`)

(I believe in expending creativity in appropriate places, and I try to avoid expending it on function names.)

The input is a list of samples and a few other details, with a _lot_ of the default behavior of the instrument's software built in. The default behavior of the instrument is **Old Order**. The data structures fed into the templates only exist in `plate_template` and `experiment_template`, so stopping before the write stage to expose the structures isn't a thing.

We didn't write test code at the lab. I knew that `prove` existed and we on occasion made `t/` directories, but we didn't do much of anything beyond that. I'm thinking that, if I had a function that munged the data into the correct array form, and a separate function that shoved the array into a template, then it would be easier to adapt to the new form.

Meanwhile, I've been looking at this as the quick way to juggle an array into a different order. Not as complex as a [Schwartzian Transform](https://jacoby.github.io/javascript/2018/11/07/schwartzian-transforms-in-javascript.html) but still interesting.

```perl
    my @aa;
    for my $a1 ( 'A' .. 'Z' ) {
        for my $a2 ( 'A' .. 'Z' ) {
            push @aa, "$a1$a2";
        }
    }

    my @x = 0 .. 47;
    my @y;

    my $i = 0;
    for my $y ( 0 .. 7 ) {
        for my $x ( 0 .. 2 ) {
            $y[$x][$y] = $x[$i];
            $i++;
        }
    }
    for my $y ( 0 .. 7 ) {
        for my $x ( 3 .. 5 ) {
            $y[$x][$y] = $x[$i];
            $i++;
        }
    }

    for my $x ( 0 .. 5 ) {
        for my $y ( 0 .. 7 ) {
            print " $y[$x][$y] ";
        }
        say '';
    }
    say '';

    say join " ", @x;
    say '';
    say join " ", map { $aa[$_] } @x;
    say '';
    say join " ", map { $_->@* } @y;
    say '';
    say join " ", map { $aa[$_] } map { $_->@* } @y;
```

```text
OUTPUT:

 0  3  6  9  12  15  18  21
 1  4  7  10  13  16  19  22
 2  5  8  11  14  17  20  23
 24  27  30  33  36  39  42  45
 25  28  31  34  37  40  43  46
 26  29  32  35  38  41  44  47

0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47

AA AB AC AD AE AF AG AH AI AJ AK AL AM AN AO AP AQ AR AS AT AU AV AW AX AY AZ BA BB BC BD BE BF BG BH BI BJ BK BL BM BN BO BP BQ BR BS BT BU BV

0 3 6 9 12 15 18 21 1 4 7 10 13 16 19 22 2 5 8 11 14 17 20 23 24 27 30 33 36 39 42 45 25 28 31 34 37 40 43 46 26 29 32 35 38 41 44 47

AA AD AG AJ AM AP AS AV AB AE AH AK AN AQ AT AW AC AF AI AL AO AR AU AX AY BB BE BH BK BN BQ BT AZ BC BF BI BL BO BR BU BA BD BG BJ BM BP BS BV
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
