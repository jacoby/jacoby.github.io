---
layout: post
title: "Dev.To Challenge 10 - Calculator"
author: "Dave Jacoby"
date: "2019-07-07 14:02:58 -0400"
categories: ""
---

I read [dev.to](https://dev.to/) and occasionally write there, or reblog what I write here. Not _too_ much; I get deep, I code Perl, and I think that those two are not quite the dev.to audience.

Today I saw the [Daily Challenge #10](https://dev.to/thepracticaldev/daily-challenge-10-calculator-23n7)

> Create a simple calculator that given a string of operators (+ - \* and /) and numbers separated by spaces returns the value of that expression
>
> Example:
>
> `Calculator().evaluate("2 / 2 + 3 * 4 - 6") # => 7`
>
> Remember about the order of operations! Multiplications and divisions have a higher priority and should be performed left-to-right. Additions and subtractions have a lower priority and should also be performed left-to-right.

I first thought of a recursive solution, a mathematical variation of `mergesort`, until it became clear that this was _not_ the way to go, so, instead, I leaned on regular expressions. [Now I have two problems](https://web.archive.org/web/20140518225626/http://arstechnica.com/information-technology/2014/05/what-is-meant-by-now-you-have-two-problems/), sure, but I know this problem.

So, what does a number look like? [That is the source of a _lot_ of fun problems](https://jacoby.github.io/2018/09/19/i-find-the-strangest-bugs.html). The subset of possible number numbers we'll allow are signed whole and floating-point numbers, and the regular expression to give us this is `(-?\d+(?:\.\d+)?)`.

When they call Perl "white noise", `(-?\d+(?:\.\d+)?)` is the kind of thing they're talking about. So, let's break it up. We're wanting to work with what is matched, not just see that it's there, so we can access that, we have the outer `()`. If we just wanted one decimal digit, we would use `(\d)`, which would match any single digit 0-9. For one or more digits, we use `(\d+)`.

But that 0 to infinity, or as close to infinity as our computers will allow. We want negative infinity to positive infinity, so we want signed numbers. `(-?\d+)`.

That's good, but then there's decimals, the numbers between 0 and 1. We may not _want_ that, and the example expression doesn't want them, so we match 0 or 1 times (`()?)`), and prevent it from capturing, because we're not doing anything special with the decimal point (`(?:)?`), and then we add the point, is escaped so it's a literal dot (`(?:\.)?`), and then digits, because `1.` has no meaning for us (`(?:\d+)?`).

Giving us the big long match `(-?\d+(?:\.\d+)?)`.

The following code _works_, but I'm not happy with it. I'm thinking that an operator loop wrapping a while loop, `for my $oper ( qw{ * / + - } ) { ... }`, would remove a lot of what I consider copy-paste code, and I could probably store the regex. But this is example code, not anything I rely on, so eh.

```perl
#!/usr/bin/env perl

use strict ;
use warnings ;
use feature qw{ say postderef signatures state } ;
no warnings qw{ experimental::postderef experimental::signatures } ;

use Carp ;

my $string = "2 / 2 + 3 * 4 - 6" ;
say evaluate( $string ) ;
exit ;

# Remember MDAS
sub evaluate( $string) {
        while ( $string =~ m/(-?\d+(?:\.\d+)? \* -?\d+(?:\.\d+)?)/ ) {
            my $before = $1 ;
            my ( $i, $j ) = $before =~ m{(-?\d+(?:\.\d+)?)}g ;
            my $k = $i * $j ;
            $string =~ s/\Q$before/$k/mx ;
            }

        while ( $string =~ m/(-?\d+(?:\.\d+)? \/ -?\d+(?:\.\d+)?)/ ) {
            my $before = $1 ;
            my ( $i, $j ) = $before =~ m{(-?\d+(?:\.\d+)?)}g ;
            exit if $j == 0;
            my $k = $i / $j ;
            $string =~ s/\Q$before/$k/mx ;
            }

        while ( $string =~ m/(-?\d+(?:\.\d+)? \+ -?\d+(?:\.\d+)?)/ ) {
            my $before = $1 ;
            my ( $i, $j ) = $before =~ m{(-?\d+(?:\.\d+)?)}g ;
            my $k = $i + $j ;
            say $string;
            $string =~ s/\Q$before/$k/mx ;
            }

        while ( $string =~ m/(-?\d+(?:\.\d+)? - -?\d+(?:\.\d+)?)/ ) {
            my $before = $1 ;
            my ( $i, $j ) = $before =~ m{(-?\d+(?:\.\d+)?)}g ;
            my $k = $i - $j ;
            $string =~ s/\Q$before/$k/mx ;
            }

    return $string ;
    }
```

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
