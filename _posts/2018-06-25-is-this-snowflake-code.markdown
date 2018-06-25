---
layout: post
title:  "Is This Snowflake Code?"
author: "Dave Jacoby"
date:   "2018-06-25 13:29:26 -0400"
categories: 
---

This started with clicking a link in the IRC channel for yapc, which is all about Perl, but I don't think the point is very language specific.

The link is [Please Don't Write Snowflake Code](https://blog.urth.org/2012/10/07/please-dont-write-snowflake-code/) by Dave Rolsky, which, being from six years ago, isn't meant (I don't believe) to be a dig at kids today being sheltered, but for a coder developing preferences that isolate from the rest of the coding community.

> Besides the prototype issue, none of these are wrong (and the prototype thing is arguably intended as documentation). The code works as written, and the meaning is more or less clear.
> 
> But it’s weird, because it’s not what most people other do. It’s a unique snowflake.
> 
> It’s a distraction.
> 
> Instead of looking at the code, experienced Perl programmers will spend time going “WTF” and wondering why this code looks different from all the other code they’ve seen.

I get that. When I look at and contribute to other people's projects, I try to code to their conventions, and I do not have custom changes to the VS Code formatters for Javascript, CSS, HTML and whatever else I may have installed. SQL?

But I have 19 lines of perltidyrc, which gets pretty close to what I like to see:

```
    --backup-and-modify-in-place
    --block-brace-tightness=0
    --brace-tightness=0
    --closing-token-indentation=3
    --continuation-indentation=4
    --indent-block-comments 
    --indent-closing-brace  
    --indent-columns=4
    --maximum-line-length=100
    --no-outdent-long-quotes
    --noopening-sub-brace-on-new-line 
    --opening-brace-always-on-right
    --paren-tightness=0
    --space-for-semicolon
    --space-terminal-semicolon
    --square-bracket-tightness=0
    --stack-opening-tokens
    --vertical-tightness-closing=0
    --vertical-tightness=0
```

I started this from [the .perltidyrc](https://gist.github.com/kimmel/1305940) from *[Perl Best Practices](http://shop.oreilly.com/product/9780596001735.do)*, with the first change being verbose, because you are never going to remember what `-cti=0` or `-bt=1` mean after years of not changing your rc file.

But I developed my preferred indentation style well before I started with Perl, taking early C-as-subset-of-C++ courses as a CS undergraduate. It is pretty close to [Ratliff style](https://en.wikipedia.org/wiki/Indentation_style#Ratliff_style). Pulling from brute-force Sudoku code I wrote years ago, I tidied it with an empty config file and then with my preferred style.

```perl
# default style
use strict;
use warnings;
use feature qw{ say postderef signatures };
no warnings qw{ experimental::postderef experimental::signatures };
use subs qw{ solve_sudoku test_solution display_puzzle no_go_list };

use Data::Dumper;

my @array;
my @test;
my $x        = 0;
my $debug    = 0;
my $outcount = 0;

#READ IN DATA
while ( my $line = <DATA> ) {
    chomp $line;
    $line =~ s{\D}{ }mxg;
    my @line = split m{|}mx, $line;
    for my $y ( 0 .. 8 ) {
        my $digit = ' ';
        $digit = $line[$y] if defined $line[$y];
        $array[$x][$y] = $digit;
    }
    $x++;
}
solve_sudoku( 0, 0, '' );

```

```perl
# my preferences
#!/usr/bin/perl

use strict ;
use warnings ;
use feature qw{ say postderef signatures } ;
no warnings qw{ experimental::postderef experimental::signatures } ;
use subs qw{ solve_sudoku test_solution display_puzzle no_go_list } ;

use Data::Dumper ;

my @array ;
my @test ;
my $x        = 0 ;
my $debug    = 0 ;
my $outcount = 0 ;

#READ IN DATA
while ( my $line = <DATA> ) {
    chomp $line ;
    $line =~ s{\D}{ }mxg ;
    my @line = split m{|}mx, $line ;
    for my $y ( 0 .. 8 ) {
        my $digit = ' ' ;
        $digit = $line[ $y ] if defined $line[ $y ] ;
        $array[ $x ][ $y ] = $digit ;
        }
    $x++ ;
    }
solve_sudoku( 0, 0, '' ) ;
```

The main differences I see are spaces (or lack of) after semicolons and whether the closing brackets are indented with the code they enclose or not. Oh yes, if the braces around array indexes are tight or not. 

I've seen Stack Overflow people re-edit my code to something that won't run because they so hated my indenting, which is in part why I don't try to help there anymore. But I don't believe these are too far into the fringe. 

So, is this weird indenting that's unreadable for anyone not Dave? Or am I fretting for nothing?

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
