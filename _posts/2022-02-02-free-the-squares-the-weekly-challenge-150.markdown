---
layout: post
title: "Free The Squares!: The Weekly Challenge #150"
author: "Dave Jacoby"
date: "2022-02-02 15:57:22 -0500"
categories: ""
---

Welcome to [Weekly Challenge #150](https://theweeklychallenge.org/blog/perl-weekly-challenge-150/)

I thought that [150 would be a fairly boring number](<https://en.wikipedia.org/wiki/150_(number)>), but it's the sum of eight consecutive primes, so it's got that going for it.

### TASK #1 › Fibonacci Words

> Submitted by: Mohammad S Anwar  
> You are given two strings having same number of digits, **\$a** and **\$b**.

I didn't expend

> Write a script to generate **Fibonacci Words** by concatenation of the previous two strings. Finally print 51st digit of the first term having at least 51 digits.

I didn't test that what it said we're given is what we're given, and in this simple case, I didn't use Getopt::Long to allow command-line input, or even pull out the first two values in ARGV. [_Exercise For The Reader_](http://catb.org/jargon/html/E/exercise--left-as-an.html) and all that.

So, there are therefore these things to do:

* combine two strings in such a way that it mimics a Fibonacci sequence, such that `array[i] = array[i-2] . array[-1]`. for values of `i` greater than 1.
* stop when the length of the newest one is greater than 51.
* return the 51st character. _This_ is one to be careful about. Most languages and tools, including `substr`, use zero-indexing, which means they start counting at `0` not `1`, so it implicitly adds one to the number we're looking for.  

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use Getopt::Long;
use List::Util qw{ sum0 max };

say fibonacci_words( '1234', '5678' );

sub fibonacci_words ( $word1, $word2 ) {
    my @words;
    push @words, $word1, $word2;
    while ( length $words[-1] < 51 ) {
        my $w = $words[-2] . $words[-1];
        push @words, $w;
    }
    my $last = pop @words;
    # zero indexing leads to possible fencepost error
    return substr $last, 50, 1;
}
```

```text
$ ./ch-1.pl 
7
```

### TASK #2 › Square-free Integer

> Submitted by: Mohammad S Anwar  
> Write a script to generate all square-free integers <= 500.
>
> > In mathematics, a square-free integer (or squarefree integer) is an integer which is divisible by no perfect square other than 1. That is, its prime factorization has exactly one factor for each prime that appears in it. For example, 10 = 2 ⋅ 5 is square-free, but 18 = 2 ⋅ 3 ⋅ 3 is not, because 18 is divisible by 9 = 3\*\*2.

So, for all integers between 1 and 500, we factor them, and if any prime shows up twice in the list, we skip it.

Because we're dealing with hundreds of numbers, I decided to create a pretty-printer that indents the output to fit the terminal window.

Once things slowed down this week and I could spend time on the problems, they got solved quickly.

Assuming I didn't do anything silly...

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use Term::ReadKey;

display_pretty( square_free_integers() );

sub square_free_integers () {
    my @sfi;
    my $max = 500;

OUTER: for my $i ( 1 .. $max ) {
        my @factors = factors($i);
        for my $f (@factors) {
            my $g = () = grep { /$f/ } @factors;
            next OUTER if $g > 1;
        }
        push @sfi, $i;
    }

    return @sfi;
}

sub factors ( $n ) {
    my @factors;
    my $i = 2;
    while ( $i < $n ) {
        while ( $n % $i == 0 ) {
            $n /= $i;
            push @factors, $i;
        }
        $i++;
    }
    return @factors;
}

sub display_pretty( @arr ) {
    my ( $wchar, undef ) = GetTerminalSize();
    $wchar //= 80;
    my $line;

    while ( scalar @arr > 1 ) {
        my $n = shift @arr;
        $line .= qq{$n, };
        if ( (length $line )+ 5 > $wchar ) {
            say $line;
            $line = '';
        }
    }
    $line .= shift @arr;
    say $line;
}
```

```text
$ ./ch-2.pl 
1, 2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 
17, 19, 21, 22, 23, 26, 29, 30, 31, 
33, 34, 35, 37, 38, 39, 41, 42, 43, 
46, 47, 51, 53, 55, 57, 58, 59, 61, 
62, 65, 66, 67, 69, 70, 71, 73, 74, 
77, 78, 79, 82, 83, 85, 86, 87, 89, 
91, 93, 94, 95, 97, 101, 102, 103, 
105, 106, 107, 109, 110, 111, 113, 
114, 115, 118, 119, 122, 123, 127, 
129, 130, 131, 133, 134, 137, 138, 
139, 141, 142, 143, 145, 146, 149, 
151, 154, 155, 157, 158, 159, 161, 
163, 165, 166, 167, 170, 173, 174, 
177, 178, 179, 181, 182, 183, 185, 
186, 187, 190, 191, 193, 194, 195, 
197, 199, 201, 202, 203, 205, 206, 
209, 210, 211, 213, 214, 215, 217, 
218, 219, 221, 222, 223, 226, 227, 
229, 230, 231, 233, 235, 237, 238, 
239, 241, 246, 247, 249, 251, 253, 
254, 255, 257, 258, 259, 262, 263, 
265, 266, 267, 269, 271, 273, 274, 
277, 278, 281, 282, 283, 285, 286, 
287, 290, 291, 293, 295, 298, 299, 
301, 302, 303, 305, 307, 309, 310, 
311, 313, 314, 317, 318, 319, 321, 
322, 323, 326, 327, 329, 330, 331, 
334, 335, 337, 339, 341, 345, 346, 
347, 349, 353, 354, 355, 357, 358, 
359, 362, 365, 366, 367, 370, 371, 
373, 374, 377, 379, 381, 382, 383, 
385, 386, 389, 390, 391, 393, 394, 
395, 397, 398, 399, 401, 402, 403, 
406, 407, 409, 410, 411, 413, 415, 
417, 418, 419, 421, 422, 426, 427, 
429, 430, 431, 433, 434, 435, 437, 
438, 439, 442, 443, 445, 446, 447, 
449, 451, 453, 454, 455, 457, 458, 
461, 462, 463, 465, 466, 467, 469, 
470, 471, 473, 474, 478, 479, 481, 
482, 483, 485, 487, 489, 491, 493, 
494, 497, 498, 499
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
