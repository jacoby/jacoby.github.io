---
layout: post
title: "Weekly Challenge #149 Task 2: The Terror of the Largest Square"
author: "Dave Jacoby"
date: "2022-01-27 13:00:11 -0500"
categories: ""
---

I'm finishing off [Challenge #149](https://theweeklychallenge.org/blog/perl-weekly-challenge-149/). [It's the 35th prime number](<https://en.wikipedia.org/wiki/149_(number)>).

### TASK #2 › Largest Square

> Submitted by: Roger Bell_West  
> Given a number base, derive the largest perfect square with no repeated digits and return it as a string. (For base>10, use ‘A’..‘Z’.)

This is a tough cookie to crack, I gotta say.

Programmers like base 10, because that's how many fingers we have, and bases around squares of 2, because that works well with binary. The first few modules I looked at to help with base conversion were hard-coded to convert to those bases, so they didn't work as soon as I tried base 3, which is right up there.

I don't know [Ken Williams](https://metacpan.org/author/KWILLIAMS) (I don't think) but I am thankful for his [Math::BaseCalc](https://metacpan.org/pod/Math::BaseCalc), which allowed for conversion from any base to base 10. (Yes, I could've special-cased base 10 when I got there, but why?)

The clever here is that we want to _display_ base _n_ numbers but they're so much easier to work with in base 10, so I created a array with ranges that gives us all possible digits, and then used array slices to give us the character set we want. BaseCalc takes whatever _n_ characters you give it to do base _n_, so you can pass it a bunch of emoji if you want. I didn't, and I used state variables to hold onto both the BaseCalc objects and the computed numbers (but with my newer, saner algorithm, it's premature optimization).

The next clever is a number with **no repeated digits**. The largest possible base 10 number with 10 digits is `9999999999` but the largest possible **with no repeated digits** is `9876543210`, and if we start there, we don't have to think about `123456789` possibilities. I got to _this_ clever, but no farther, and running that with bigger numbers caused the program to segfault.

The _next_ bit of clever is that we're looking for **perfect squares**, and there are a _lot_ of imperfect squares. So, to avoid lots of numbers that will not work, we can instead take the square root of the largest number. In base 10, that's `99380.7990006118`, which is clearly not a perfect square, but if we start counting down from there (pin in that) we have almost a hundred thousand numbers to deal with, not 10 billion.

And I say _counting down_. I could do a for loop — `for ( reverse 1 .. sqrt $n ) { ... }` — but then you have a list in memory, and for bigger bases, that's a bigger list. This is what was segfaulting me. Just `int sqrt $n` and decrementing it while _n_ is greater than 0 will do it.

Once you get it to this level of clever, it's fairly short. Looking at it, I'm not loving the behavior past base 15, but I'm not sure what I'm actually looking for, so I'm calling it.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use Math::BaseCalc;
use List::Util qw{uniq};

my @range = ( 0 .. 9, 'A' .. 'Z' );

OUTER: for my $base ( 2 .. 20 ) {
    my $t      = $base - 1;
    my @digits = map { $range[$_] } ( 0 .. $t );
    my $digits = join '', @digits;
    my $max    = join '', reverse @digits;
    my $n      = convert_from( $max, $digits );
    my $sn     = int sqrt $n;
    while ( $sn > 0 ) {
        my $n   = $sn**2;
        my $x   = convert_to( $n, $digits );
        my $has = has_dupes($x);
        if ( !$has ) {
            say qq{f($base) = "$x"};
            next OUTER ;
        }
        $sn--;
    }
}

exit;

sub has_dupes ( $number ) {
    for my $d ( uniq split //, $number ) {
        my $d = () = grep { $_ eq $d } split //, $number;
        return 1 if $d > 1;
    }
    return 0;
}

{
    state $base = {};

    sub convert_from ( $number, $digits ) {
        state $table_from = {};
        my @digits = split //, $digits;
        if ( !defined $base->{$digits} ) {
            $base->{$digits} = Math::BaseCalc->new( digits => [@digits] );
        }
        if ( !$table_from->{$digits}{$number} ) {
            my $from = $base->{$digits}->from_base($number);
            $table_from->{$digits}{$number} = $from;
        }
        return $table_from->{$digits}{$number};
    }

    sub convert_to ( $number, $digits ) {
        state $table_to = {};
        my @digits = split //, $digits;
        if ( !defined $base->{$digits} ) {
            $base->{$digits} = Math::BaseCalc->new( digits => [@digits] );
        }
        if ( !$table_to->{$digits}{$number} ) {
            my $to = $base->{$digits}->to_base($number);
            $table_to->{$digits}{$number} = $to;
        }
        return $table_to->{$digits}{$number};
    }
}
```

```text
$ ./ch-2.pl 
f(2) = "1"
f(3) = "1"
f(4) = "3201"
f(5) = "4301"
f(6) = "452013"
f(7) = "6250341"
f(8) = "47302651"
f(9) = "823146570"
f(10) = "9814072356"
f(11) = "A8701245369"
f(12) = "B8750A649321"
f(13) = "CBA504216873"
f(14) = "DC71B30685A924"
f(15) = "EDAC93B24658701"
f(16) = "1"
f(17) = "0"
f(18) = "4"
f(19) = "C"
f(20) = "8"
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
