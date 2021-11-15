---
layout: post
title: "It's The Mullet Of Algorithms!: The Weekly Challenge #139"
author: "Dave Jacoby"
date: "2021-11-15 13:56:26 -0500"
categories: ""
---

[Once More into the Breech!](https://theweeklychallenge.org/blog/perl-weekly-challenge-139/)

### TASK #1 › JortSort

> Submitted by: Mohammad S Anwar  
> You are given a list of numbers.
>
> Write a script to implement JortSort. It should return true/false depending if the given list of numbers are already sorted.

First, let me say that I _love_ Jenn Schiffer. [Sarah Cooper](https://time.com/5874990/sarah-cooper-tiktok-trump/) might be the Internet's own comedian, but [Jenn is WebDev's own comedian](https://www.youtube.com/watch?v=wewAC5X_CZ8). [She's the greatest!](https://twitter.com/jennschiffer)

Here, she's created a new sorting algorithm. No. ["jortSort isn't a sorting algorithm. It's a sorting toolset."](https://jort.technology/).

It's actually more a boolean check: **Is this sorted (Y/N)?**

And the source is on the page!

```perl
var jortSort = function( array ) {

  // sort the array
  var originalArray = array.slice(0);
  array.sort( function(a,b){return a - b} );

  // compare to see if it was originally sorted
  for (var i = 0; i < originalArray.length; ++i) {
    if (originalArray[i] !== array[i]) return false;
  }

  return true;
};
```

JortSort _does the work_ or sorting, but simply tells you if you did it right or not. It steadfastly avoids being helpful. It, to me, is like replacing [Stack Overflow](https://stackoverflow.com/) with a small JS function. I've seen many SO users I'd love to see replced with small JS functions.

Again, I _love_ Jenn Schiffer.

So,

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say state postderef signatures };
no warnings qw{ experimental };

# JortSort - https://jort.technology/ - https://github.com/jennschiffer/jortsort

my @examples;
push @examples, [ 1 .. 5 ];
push @examples, [ 1, 3, 2, 4, 5 ];
push @examples, [ 1 .. 20 ];
push @examples, [ sort { rand 1 <=> rand 1 } 1 .. 20 ];

for my $input (@examples) {
    my $o = jortsort( $input->@* );
    my $i = join ',',$input->@*;
    say <<"END";
    Input: \@n = ($i)
    Output: $o
END
}

# basically? It's sorted already, or go back and try again.
sub jortsort (@array ) {
    my @copy = sort { $a <=> $b } @array;
    for my $i ( 0 .. -1 + scalar @array ) {
        return 0 if $copy[$i] ne $array[$i];
    }
    return 1;
}
```

```text
 $ ./ch-1.pl
    Input: @n = (1,2,3,4,5)
    Output: 1

    Input: @n = (1,3,2,4,5)
    Output: 0

    Input: @n = (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20)
    Output: 1

    Input: @n = (15,18,3,8,11,17,12,7,19,20,16,2,10,9,1,4,13,5,14,6)
    Output: 0
```

### TASK #2 › Long Primes

> Submitted by: Mohammad S Anwar  
> Write a script to generate first 5 Long Primes.
>
> A prime number (p) is called Long Prime if (1/p) has an infinite decimal expansion repeating every (p-1) digits.

And this is the serious one. [Let's think about Long Primes!](https://en.wikipedia.org/wiki/Full_reptend_prime)

So, for a number _n_, we must check:

- if _n_ is prime (so 4 is out)
- if _1/n_ is cyclic (so 2 is out)
- if the cycle for _1/n_ is as long as _n-1_ (so 3 is out)

The Wikipedia article gives us the first few, with a link to the page on the Online Encyclopedia of Integer Sequences [(OEIS)](https://oeis.org/) for this, so we can check our work.

The lowest Long Prime is _7_. Taken to 200 digits, that's `0.14285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714`, and we can clearly see the six-digit repetitions (`142857`). And it's the six-digit repetitions we're looking for: _3_ has a one-digit repetition, which is also a 2-digit repetition, but the one-digit rep comes first, so it isn't good enough to be a Long Prime.

Problem is, `1/7 == 0.142857142857143`, which covers us for _7_, but when we get longer, we need to deal with bigger floats.

[We need Big Floats](https://metacpan.org/pod/Math::BigFloat).

```perl
use Math::BigFloat;

Math::BigFloat->accuracy(200);

if (1) {
    my $b1    = Math::BigFloat->new(1);
    my $b7    = Math::BigFloat->new(7);
    my $ratio = $b1->bdiv($b7);
    say 1 / 7;
    say $ratio;
    exit;
}
__DATA__

0.142857142857143
0.14285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714285714
```

`accuracy` works on either the variable or class level to determine how many significant digits to show, so we can show we have enough digits to show the pattern.

From there, we need two to make a pattern: `my ($f1,$f2) = $alt =~ m{(\d{$i})}gmx`. I _know_ that this is the kind of thing that makes Perl haters bring out **line noise** comparisons, so:

- We don't need to check _every_ entry to see if there's repetition, but just the first two. We get a list context and fill two scalars with `my ($f1,$f2)=...`
- We're just doing _matching_, and everything that `$alt =~ m{regex}` matches gets sent to `($f1,$f2)`
- and `m{(\d{$i})}gmx` ... is like an Onion: it has layers. At center, it's a number made of `$i` digits, so `\d{$i}`. We want to get the output, not just a boolean showing it exists, so we put in parentheses, like `(\d{$i})`. As I said, that's a match, so `m{(\d{$i})}`, and we want it to be _global_, so we add `m{(\d{$i})}g`. I also add `mx` because that's best practice for regular expressions, even though it's single line and I don't need extra whitespace for comments. Maybe I should do that more...

Anyway, now, we have `$f1` and `$f2`. If `$f2` isn't defined, then we know it doesn't repeat, and we we can `return 0`. Beyond that, there are two other failure points: If `$f1` and `$f2` match and the cycle isn't _n-1_ characters long, and if `$f1` and `$f2` don't match as the cycle _is_ _n-1_ characters long.

If I was doing this with any other language, I might be thinking about how to expand the number of significant digits we're seeing.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

# https://en.wikipedia.org/wiki/Full_reptend_prime

#  The first five long primes are: 7, 17, 19, 23, 29

use Math::BigFloat;
Math::BigFloat->accuracy(200);
my @long_primes;
for my $i ( 1 .. 50 ) {
    next unless is_long_prime($i);
    push @long_primes, $i;
}
say 'The first five Long Primes are: ', join ', ', @long_primes;

sub is_long_prime ($n ) {
    Math::BigFloat->accuracy($n*3);
    return 0 unless is_prime($n);
    my $bign = Math::BigFloat->new($n);
    my $big1 = Math::BigFloat->new(1);
    my $big  = $big1->bdiv($bign);
    $big =~ s/0+$//mix;
    my $alt = $big;
    $alt =~ s/^0\.//;

    my $l = $n - 1;
    for my $i ( 1 .. $l ) {
        my ( $f1, $f2 ) = $alt =~ m{(\d{$i})}gmx;
        return 0 if !defined $f2;
        return 0 if $f1 == $f2 && $i < $l;
        return 0 if $f1 != $f2 && $i == $l;
    }

    return 1;
}

sub is_prime ( $n ) {
    my @factors = factor($n);
    return scalar @factors == 1 ? 1 : 0;
}

sub factor ( $n ) {
    my @factors;
    for my $i ( 1 .. $n - 1 ) {
        push @factors, $i if $n % $i == 0;
    }
    return @factors;
}
```

```text
$ ./ch-2.pl
The first five Long Primes are: 7, 17, 19, 23, 29, 47
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
