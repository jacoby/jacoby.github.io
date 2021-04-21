---
layout: post
title: "Iterations and Permutations: Perl Weekly Challenge 109"
author: "Dave Jacoby"
date: "2021-04-21 15:29:54 -0400"
categories: ""
---

I finally got to [Perl Weekly Challenge 109](https://perlweeklychallenge.org/blog/perl-weekly-challenge-109/). Enjoy!

### TASK #1 › Chowla Numbers

> Submitted by: Mohammad S Anwar  
> Write a script to generate first 20 Chowla Numbers, named after, Sarvadaman D. S. Chowla, a London born Indian American mathematician. It is defined as:
>
> > `C(n) = sum of divisors of n except 1 and n`  
> > <small>NOTE: Updated the above definition as suggested by Abigail [2021/04/19 18:40].</small>

I admit that the first reading of this task didn't give me an immediate idea for a solution, but once I started poking it it, the old-fashioned iterative solution became clear. I know I'm _This Looks Like A Job For **Recursion!**_ guy, but this never looked like the thing.

Once I had the iterative solution, I worked at getting a functional solution, which is more and more becoming a preference, in part because that keeps lots of interim variations of the array in question from clogging up memory. Let's look at that version:

```perl
sub chowla2 ( $n ) {            # COMMENTARY IN REVERSE
    return sum0                 # sum9 returns zero if given
                                #   empty list
        grep { $n % $_ == 0 }   # include only integers that
                                #   go evenly into $n
        grep { $_ != 1 }        # exclude 1, as instructed
        grep { $_ != $n }       # exclude $n, as instructed
        1 .. $n;                # all the numbers between 1 and $n
}
```

The _good_ thing about the for-loop solution is that you don't need to import or reimplement `sum0`, but I do find the functional take easier to understand.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

use List::Util qw{sum0};

my @test = ( 0, 0, 0, 2, 0, 5, 0, 6, 3, 7, 0, 15, 0, 9, 8, 14, 0, 20, 0, 21 );

say join ', ', @test;
say join ', ', map { chowla($_) } 1 .. 20;
say join ', ', map { chowla2($_) } 1 .. 20;

# the old-fashioned for-loop way
sub chowla ( $n ) {
    my $c = 0;
    for my $i ( 1 .. $n ) {
        my $m = $n % $i;
        next     if $i == 1 || $i == $n;
        $c += $i if $m == 0;
    }
    return $c;
}

# the new, hot functional approach
# using sum0 because if given an empty list,
# sum0 returns zero instead of undef
sub chowla2 ( $n ) {
    return sum0
        grep { $n % $_ == 0 }
        grep { $_ != 1 }
        grep { $_ != $n } 1 .. $n;
}
```

```text
0, 0, 0, 2, 0, 5, 0, 6, 3, 7, 0, 15, 0, 9, 8, 14, 0, 20, 0, 21
0, 0, 0, 2, 0, 5, 0, 6, 3, 7, 0, 15, 0, 9, 8, 14, 0, 20, 0, 21
0, 0, 0, 2, 0, 5, 0, 6, 3, 7, 0, 15, 0, 9, 8, 14, 0, 20, 0, 21
```

#### Once More, With ~~Feeling~~ Javascript!

I say that JS arrow functions are like functional Perl but backwards, with certain complications. Like a lack of built-in range, like `1..20`.

To do that, we:

- create an anonymous `Array` with however many values as we want
- `fill` with nothing it so that later functions see all the entries
- `map` each entry as index + `, because we want 1 through 20, not 0 through 19
- use `filter` to exclude 1, as instructed
- use `filter` to exclude the number we're going to, as instructed
- use `filter` to exclude any value that doesn't go evenly into the number we're going to
- use `reduce` to build our own `sum0`, with the value after the comma being what gets returned if the list is empty

```javascript
"use strict";

let list = Array(20)
  .fill()
  .map((x, i) => i + 1)
  .map((x) => chowla(x));
console.log(list.join(", "));

function chowla(n) {
  return Array(n)
    .fill()
    .map((x, i) => i + 1)
    .filter((x) => x != 1)
    .filter((x) => x != n)
    .filter((x) => n % x == 0)
    .reduce((a, v) => a + v, 0);
}
```

### TASK #2 › Four Squares Puzzle

> Submitted by: Mohammad S Anwar  
> You are given four squares as below with numbers named `a,b,c,d,e,f,g`.

```text
              (1)                    (3)
        ╔══════════════╗      ╔══════════════╗
        ║              ║      ║              ║
        ║      a       ║      ║      e       ║
        ║              ║ (2)  ║              ║  (4)
        ║          ┌───╫──────╫───┐      ┌───╫─────────┐
        ║          │   ║      ║   │      │   ║         │
        ║          │ b ║      ║ d │      │ f ║         │
        ║          │   ║      ║   │      │   ║         │
        ║          │   ║      ║   │      │   ║         │
        ╚══════════╪═══╝      ╚═══╪══════╪═══╝         │
                   │       c      │      │      g      │
                   │              │      │             │
                   │              │      │             │
                   └──────────────┘      └─────────────┘
```

> Write a script to place the given unique numbers in the square box so that sum of numbers in each box is the same.

I feel this is reminiscent of [ch45t1, Olympic Rings](https://perlweeklychallenge.org/blog/perl-weekly-challenge-043/), and as Recursion Guy, my first thought was to go that way, but then I thought about [Algorithm::Permute](https://metacpan.org/pod/Algorithm::Permute), which, when given `[1,2,3]`, gives us

```text
[1, 2, 3]
[1, 3, 2]
[2, 1, 3]
[2, 3, 1]
[3, 1, 2]
[3, 2, 1]
```

Actually, an iterator that gives us these, and not in that order, but still. Still, instead of a (likely recursive) function that gives us all possible permutations, we have someone else's function give us them.

Once we have them, it's just a matter of putting them into boxes and testing them.

```perl
        my $b1   = _box_1(@perm);
        my $b2   = _box_2(@perm);
        next if $b1 != $b2;
        my $b3 = _box_3(@perm);
        next if $b1 != $b3;
        my $b4 = _box_4(@perm);
        next if $b1 != $b4;
```

The `_box_n` functions pull the code out, but really, it's simple math. `my $b1 = _box_1(@perm)` could just as easily have been `my $b1 = $perm[0] + $perm[1]`. I _do_ avoid doing `_box_3` and `_box_4` until we _know_ that `_box_1(@perm)` equals `_box_2(@perm)`, so we don't do calculations that we don't need to.

(`$a` and `$b` have a specific role in Perl, being the named variables used in defining your `sort` function, so I usually avoid using them, but since I am not using `sort` here, I decided to go with the task's naming convention.)

Of course, as with other tasks, there's symmetry here. What's good for `a + b` is good for `f + g` and vice versa.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

use Algorithm::Permute;

my $map = <<'END';
              (1)                    (3)
        ╔══════════════╗      ╔══════════════╗
        ║              ║      ║              ║
        ║      a       ║      ║      e       ║
        ║              ║ (2)  ║              ║  (4)
        ║          ┌───╫──────╫───┐      ┌───╫─────────┐
        ║          │   ║      ║   │      │   ║         │
        ║          │ b ║      ║ d │      │ f ║         │
        ║          │   ║      ║   │      │   ║         │
        ║          │   ║      ║   │      │   ║         │
        ╚══════════╪═══╝      ╚═══╪══════╪═══╝         │
                   │       c      │      │      g      │
                   │              │      │             │
                   │              │      │             │
                   └──────────────┘      └─────────────┘
END

four_squares( 1 .. 7 );

sub four_squares ( @array ) {
    my $array = join ', ', @array;
    my $ap    = Algorithm::Permute->new( \@array );
    while ( my @perm = $ap->next ) {
        my $b1   = _box_1(@perm);
        my $b2   = _box_2(@perm);
        next if $b1 != $b2;
        my $b3 = _box_3(@perm);
        next if $b1 != $b3;
        my $b4 = _box_4(@perm);
        next if $b1 != $b4;

        my $a = $perm[0];
        my $b = $perm[1];
        my $c = $perm[2];
        my $d = $perm[3];
        my $e = $perm[4];
        my $f = $perm[5];
        my $g = $perm[6];

        say <<"END";
        a = $a          e = $e
        b = $b          f = $f
        c = $c          g = $g
        d = $d
        Box1 = a + b     = $a + $b     = $b1
        Box2 = b + c + d = $b + $c + $d = $b2
        Box3 = d + e + f = $d + $e + $f = $b3
        Box4 = f + g     = $f + $g     = $b4
END

    }

}

sub _box_1( @array ) {
    return $array[0] + $array[1];
}

sub _box_2( @array ) {
    return $array[1] + $array[2] + $array[3];
}

sub _box_3( @array ) {
    return $array[3] + $array[4] + $array[5];
}

sub _box_4( @array ) {
    return $array[5] + $array[6];
}
```

```text
        a = 7          e = 1
        b = 3          f = 4
        c = 2          g = 6
        d = 5
        Box1 = a + b     = 7 + 3     = 10
        Box2 = b + c + d = 3 + 2 + 5 = 10
        Box3 = d + e + f = 5 + 1 + 4 = 10
        Box4 = f + g     = 4 + 6     = 10

        a = 3          e = 5
        b = 7          f = 4
        c = 2          g = 6
        d = 1
        Box1 = a + b     = 3 + 7     = 10
        Box2 = b + c + d = 7 + 2 + 1 = 10
        Box3 = d + e + f = 1 + 5 + 4 = 10
        Box4 = f + g     = 4 + 6     = 10

        a = 5          e = 1
        b = 6          f = 7
        c = 2          g = 4
        d = 3
        Box1 = a + b     = 5 + 6     = 11
        Box2 = b + c + d = 6 + 2 + 3 = 11
        Box3 = d + e + f = 3 + 1 + 7 = 11
        Box4 = f + g     = 7 + 4     = 11

        a = 7          e = 3
        b = 2          f = 5
        c = 6          g = 4
        d = 1
        Box1 = a + b     = 7 + 2     = 9
        Box2 = b + c + d = 2 + 6 + 1 = 9
        Box3 = d + e + f = 1 + 3 + 5 = 9
        Box4 = f + g     = 5 + 4     = 9

        a = 4          e = 6
        b = 5          f = 2
        c = 3          g = 7
        d = 1
        Box1 = a + b     = 4 + 5     = 9
        Box2 = b + c + d = 5 + 3 + 1 = 9
        Box3 = d + e + f = 1 + 6 + 2 = 9
        Box4 = f + g     = 2 + 7     = 9

        a = 4          e = 2
        b = 7          f = 6
        c = 1          g = 5
        d = 3
        Box1 = a + b     = 4 + 7     = 11
        Box2 = b + c + d = 7 + 1 + 3 = 11
        Box3 = d + e + f = 3 + 2 + 6 = 11
        Box4 = f + g     = 6 + 5     = 11

        a = 6          e = 2
        b = 4          f = 7
        c = 5          g = 3
        d = 1
        Box1 = a + b     = 6 + 4     = 10
        Box2 = b + c + d = 4 + 5 + 1 = 10
        Box3 = d + e + f = 1 + 2 + 7 = 10
        Box4 = f + g     = 7 + 3     = 10

        a = 6          e = 2
        b = 4          f = 3
        c = 1          g = 7
        d = 5
        Box1 = a + b     = 6 + 4     = 10
        Box2 = b + c + d = 4 + 1 + 5 = 10
        Box3 = d + e + f = 5 + 2 + 3 = 10
        Box4 = f + g     = 3 + 7     = 10
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
