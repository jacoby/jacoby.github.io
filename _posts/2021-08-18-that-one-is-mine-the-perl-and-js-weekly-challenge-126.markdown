---
layout: post
title: "That One Is Mine: The (Perl and JS) Weekly Challenge #126"
author: "Dave Jacoby"
date: "2021-08-18 18:37:26 -0400"
categories: ""
---

### TASK #1 › Count Numbers

> Submitted by: Mohammad S Anwar  
> You are given a positive integer $N.
>
> Write a script to print count of numbers from 1 to $N that don’t contain digit 1.

There are two things we need for this: a range of numbers from 2 to $N (because why include 1 if it's just always going to be excluded?) and a filter to knock out the `1`s.

In perl, range is `2 .. $n` and the filter is `grep { ! /1/ }`, which makes this quite close to a one-liner. I mean yes, it _can_ be as simple as ` perl -e 'print join " ", grep {!/1/} 2..60'`, but I don't like writing command-line Perl.

With Node, the range part is harder: `let array = Array(n).fill().map((x, i) => i + 1)`. This brings in the unnecessary 1. If I was more clever, I would work around it, but I dunno, I don't think that adding clever to this problem does more than obfuscate things.

For filtering, we actually _get_ `filter`. In this case, we go through the list, converting every value to string because `1` doesn't exist until you take it out of integer and put a base on it, then `filter` for that `1`.

It's `! x.toString().match(/1/)` and not `x.toString().match(!/1/)` because we want to exclude ones, not see if there's any number _but_ one.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict ;
use warnings ;
use feature qw{ say postderef signatures state } ;
no warnings qw{ experimental } ;

use Carp;
use Getopt::Long;

my $n = 15;
GetOptions(
    'n=i' => \$n
);

croak 'Out of Range!' if $n < 1;

say join ', ' , dont_contain( $n );

sub dont_contain ($n ) {
    return grep { ! /1/ } 1 .. $n
}
```

```javascript
"use strict";

let n = 126;
let list = Array(n)
  .fill()
  .map((x, i) => i + 1)
  .filter((x) => !x.toString().match(/1/));
console.log(list.join(", "));
```

### TASK #2 › Minesweeper Game

> Submitted by: Cheok-Yin Fung  
> You are given a rectangle with points marked with either x or \*. Please consider the x as a land mine.
>
> Write a script to print a rectangle with numbers and x as in the Minesweeper game.
>
> A number in a square of the minesweeper game indicates the number of mines within the neighbouring squares (usually 8), also implies that there are no bombs on that square.

Once you get it into a multidimensional array, it's fairly easy. Go to each mine, circle around it, and if those cells are 1) _in_ the multidimensional array and 2) not actual mines themselves, they get iterated.

I think the clever and useful bit is getting the minefield into the multidimensional array. With Perl, `split` and `map` an `END` block. There are lots of languages, including JS and Python, which I wish had `END` blocks. With JS, the trick _I_ use is to put it into a comment in an anonymous function, cast the function to string, then split up that string. It's hackish, but it works.

I'll say that, while there is _much_ in JS to love, I often find myself missing `COMMAND if logic`, like `next if $xx < 0` and the like. But I make it work.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict ;
use warnings ;
use feature qw{ say postderef signatures state } ;
no warnings qw{ experimental } ;

use JSON ;
my $json = JSON->new->space_after->utf8 ;

my $field = <<END;
x * * * x * x x x x
* * * * * * * * * x
* * * * x * x * x *
* * * x x * * * * *
x * * * x * * * * x
END

my @field = map { [ split /\s/, $_ ] }
    split /\n/, $field ;

my $h = -1 + scalar @field ;
my $w = -1 + scalar $field[ 0 ]->@* ;

my @map ;

for my $i ( 0 .. $h ) {
    for my $j ( 0 .. $w ) {
        $map[ $i ][ $j ] = $field[ $i ][ $j ] eq 'x' ? 'x' : 0 ;
        }
    }

for my $i ( 0 .. $h ) {
    for my $j ( 0 .. $w ) {
        next unless $map[ $i ][ $j ] eq 'x' ;
        for my $x ( -1 .. 1 ) {
            for my $y ( -1 .. 1 ) {
                my $xx = $i + $x ;
                my $yy = $j + $y ;
                next if $xx == 0 && $yy == 0 ;
                next if $xx < 0 ;
                next if $yy < 0 ;
                next if $xx > $h ;
                next if $yy > $w ;
                next if $map[ $xx ][ $yy ] eq 'x' ;
                $map[ $xx ][ $yy ]++ ;
                }
            }
        }
    }
show_map( \@map ) ;

sub show_map ( $ref ) {
    say '-' x 20 ;
    say join "\n", map { join ' ', $_->@* } $ref->@* ;
    say '-' x 20 ;
    say '' ;
    }
```

```javascript
"use strict";

let minemap = [];
let field = function () {
  /*
x * * * x * x x x x
* * * * * * * * * x
* * * * x * x * x *
* * * x x * * * * *
x * * * x * * * * x
*/
}
  .toString()
  .split(/\/\*/)[1]
  .split(/\*\//)[0]
  .split(/\n/)
  .filter((x) => String(x).match(/\w/));

let maxx = 0;
let maxy = 0;

for (let x in field) {
  maxx = x;
  let rowstr = field[x];
  let row = rowstr.split(/\s+/g);
  minemap[x] = new Array(row.length);
  for (let y in row) {
    maxy = y;
    minemap[x][y] = "0";
    if (row[y] === "x") {
      minemap[x][y] = "x";
    }
  }
}
for (let x = 0; x <= maxx; x++) {
  for (let y = 0; y <= maxy; y++) {
    if (minemap[x][y] === "x") {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (!(i == 0 && i == j)) {
            let xx = x + i;
            let yy = y + j;
            if (xx >= 0 && yy >= 0 && xx <= maxx && yy <= maxy) {
              if (minemap[xx][yy] != "x") {
                minemap[xx][yy]++;
              }
            }
          }
        }
      }
    }
  }
}
for (let x = 0; x <= maxx; x++) {
  console.log(minemap[x].join(" "));
}
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
