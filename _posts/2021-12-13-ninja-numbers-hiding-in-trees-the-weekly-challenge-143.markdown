---
layout: post
title: "Ninja Numbers Hiding In Trees: The Weekly Challenge #143"
author: "Dave Jacoby"
date: "2021-12-13 20:49:19 -0500"
categories: ""
---

[The Weekly Challenge #143, or 11 \* 13](https://theweeklychallenge.org/blog/perl-weekly-challenge-143/)

I mean, there's lots of fun number-theoretical problems in the Weekly Challenges, so might as well analyze the challenge numbers, right?

### TASK #1 › Calculator

> Submitted by: Mohammad S Anwar  
> You are given a string, `$s`, containing mathematical expression.
>
> Write a script to print the result of the mathematical expression. To keep it simple, please only accept `+ - * ()`.

First off, what's the easiest way to do this?

Have something else do it, of course! _When in doubt, shell it out_, as the saying doesn't go. In this case, `qx{ "echo '$math' | bc" }` is the core of letting previously solved problems do the work.

But, assuming we _really_ do the work, _how_ would we do the work?

The standard order of operations is **Parentheses Exponents Multiplication Division Addition Subtraction**, or **PEMDAS**. In this casem, we are instructed to only worry about **P-M-AS**.

And for the last three cases — Multiplication, Addition, and Subtraction — I really think that, instead of my favorite technique, _Recursion_, there's a solid case for _Iteration_.

```perl
    # multiplication
    while ( $s =~ / \d+ \s* \* \s* \d+ /mx ) {
        $s =~ s/( (\d+) \s* \* \s* (\d+) )/ $2 * $3 /emx;
    }
```

I am aware that the DSL we call _regex_ is a powerful aspect that causes cowards to hate and fear Perl and retire to less powerful and useful languages. (Hey, I don't _really_ mean that, but if they can throw spite, I do so to.)

There are three flags on the matches and substitutes: `/e`, `/m` and `/x`. As always, read [perlre](https://metacpan.org/dist/perl/view/pod/perlre.pod) for more information, but:

- `/m` allows multiline input, so if the given function looked like `1\n*\n2`, there's nothing that would limit this regex from matching it all. Mostly an _always add_ from [_Perl Best Practices_](https://www.oreilly.com/library/view/perl-best-practices/0596001738/)
- `/x` allows you to add whitespace, which is good for readability. For example, `$s =~ / \d+ \s* \* \s* \d+ /mx` vs `$s =~ /\d+\s*\*\s*\d+/mx`, which is a bit more unreadable. We _could_ do better, like:
  ```perl
       $s =~ / \d+ # a digit of one or more characters
               \s* # zero or more whitespace characters
               \*  # a multiplication character
               \s* # zero or more whitespace characters
               \d+ # a digit of one or more characters
               /mx
  ```
- `/e` makes the second part of a substituted (`s/a/b/`, for example), executable. Honestly, there was a point where this was a regular thing I did, especially when [I was trying to parse HTML with regular expressions](https://stackoverflow.com/questions/1732348/regex-match-open-tags-except-xhtml-self-contained-tags/1732454#1732454), but let's not speak of those times. Here' we're marking a whole _A \* B_ equation, identifying _A_ and _B_ so we can do math to them, and also _A \* B_, so the result of the math can replace the whole equation with the result.

Maybe _that_ should've been the commmenting-the-regex example...

So, that gives us **MAS**, but we want **PMAS**, so what's next? We can extract the parentheticals, remove the surrounding parentheses, do the math as normal, then fill it in.

Or, rather...

**This Looks Like A Job For _RECURSION!_**

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say state postderef signatures };
no warnings qw{ experimental };

my @examples;
push @examples, '( 5 * 10 )  - ( 12 * 3 )';
push @examples, '10 + 20 - 5';
push @examples, '(10 + 20 - 5) * 2';
push @examples, '( ( 10 * 20 ) - 5) * 2';

for my $i (@examples) {
    my $o  = calculator($i);
    my $o2 = bc($i);
    say <<"END";
    Input:  \$i = $i
    Output: $o
    BC:     $o2
END
}

sub calculator( $s) {

    # parens
    while ( $s =~ /\([\s\d\+\-\*]+\)/mix ) {
        $s =~ s/\(([\s\d\+\-\*]+\))/calculator( unbracket( $1 ))/e;
    }

    # multiplication

    while ( $s =~ / \d+ \s* \* \s* \d+ /mx ) {
        $s =~ s/( (\d+) \s* \* \s* (\d+) )/ $2 * $3 /emx;
    }

    # addition

    while ( $s =~ / \d+ \s* \+ \s* \d+ /mx ) {
        $s =~ s/( (\d+) \s* \+ \s* (\d+) )/ $2 + $3 /emx;
    }

    # subtraction
    while ( $s =~ / \d+ \s* \- \s* \d+ /mx ) {
        $s =~ s/( (\d+) \s* \- \s* (\d+) )/ $2 - $3 /emx;
    }
    return $s;
}

sub unbracket( $s ) {
    $s =~ s/^\(//;
    $s =~ s/\)$//;
    return $s;
}

# This is the easy way, using pre-existing code
sub bc( $s) {
    my $cmd = qq{ echo '$s' | bc  };
    my $x   = qx{$cmd};
    chomp $x;
    return $x;
}
```

```text
$ ./ch-1.pl
    Input:  $i = ( 5 * 10 )  - ( 12 * 3 )
    Output:  14
    BC:     14

    Input:  $i = 10 + 20 - 5
    Output: 25
    BC:     25

    Input:  $i = (10 + 20 - 5) * 2
    Output: 50
    BC:     50

    Input:  $i = ( ( 10 * 20 ) - 5) * 2
    Output:   390
    BC:     390
```

### TASK #2 › Stealthy Number

> Submitted by: Mohammad S Anwar
> You are given a positive number, `$n`.
>
> Write a script to find out if the given number is **Stealthy Number**.
>
> > A positive integer N is stealthy, if there exist positive integers a, b, c, d such that `a * b = c * d = N` and `a + b = c + d + 1`.

So, we've been working with divisors a lot, and we can get every `X * Y = N` pair fairly easily in one loop. A little bit of busy work and sorting give us arrays of unique pairs.

From there, we go with `for my $i ( 0 .. -1 + scalar @factors )` and `for my $j ( i + 1 .. -1 + scalar @factors )`, and combining those, we _should_ get no doubled indexes and **O(nlogn)**. We then do the other test, which are strictly speaking 2 tests:

- `a + b + 1 = c + d`
- `a + b - 1 = c + d`

OF course, there _is_ a quick-and-easy way to test — `1 = abs( ($a + $b) - ($c + $d) )` — and we only need one for a number to be stealthy.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

my @examples = qw( 6 12 24 36 );

for my $i (@examples) {
    my $o = stealthy_numbers($i);
    say <<"END";
    Input:  \$n = $i
    Output: $o
END
}

sub stealthy_numbers ( $n ) {
    my @factors = get_factor_pairs($n);
    for my $i ( 0 .. -1 + scalar @factors ) {
        my ( $ix, $iy ) = $factors[$i]->@*;
        for my $j ( $i + 1 .. -1 + scalar @factors ) {
            my ( $jx, $jy ) = $factors[$j]->@*;
            my $addi = $ix + $iy;
            my $addj = $jx + $jy;
            return 1 if abs( $addi - $addj ) == 1;
        }
    }
    return 0;
}

sub get_factor_pairs( $n ) {
    my %hash;
    for my $x ( map { int $_ } 1 .. $n ) {
        next unless $n % $x == 0;
        my $y  = $n / $x;
        my $xy = join ',', sort { $a <=> $b } $x, $y;
        $hash{$xy} = 1;
    }
    return map { [ split /,/, $_ ] } sort keys %hash;
}
```

```text
$ ./ch-2.pl
    Input:  $n = 6
    Output: 0

    Input:  $n = 12
    Output: 1

    Input:  $n = 24
    Output: 1

    Input:  $n = 36
    Output: 1
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
