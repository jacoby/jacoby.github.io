---
layout: post
title: "reverse_vowels('Weekly Challenge') eq 'Weekly Challenge': Weekly Challenge #254"
author: "Dave Jacoby"
date: "2024-01-29 15:43:30 -0500"
categories: ""
---

Welcome to **[Weekly Challenge #254!]()** **254**, the product of **2 and 127**, is a _semiprime_ number. It is [deficient](https://en.wikipedia.org/wiki/Deficient_number), in that the sum of its divisors is **130**, which is less than itself.

**254** is also the area code for [Waco, Texas](https://www.allareacodes.com/254).

### Task 1: Three Power

> Submitted by: Mohammad S Anwar  
> You are given a positive integer, `$n`.
>
> Write a script to return **true** if the given integer is a power of three otherwise return **false**.

#### Let's Talk About It

So, cube roots are easy. `$n ** 3` gets you the cube, and `$n ** 1/3` gets you the cube root.

But it isn't that simple, because _everything_ is a power of three if you get beyond whole numbers. And that's the core of my test. `$n == int $n`. If we cast as an integer, wiping away the floating point, are they still equal?

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @examples = ( 27, 0, 6 );

for my $example (@examples) {
    my $output    = three_power($example);
    say $output;

    say <<~"END";
    Input:  \$n = $example
    Output: $output
    END
}

sub three_power ($input) {
    my $cuberoot= $input ** (1/3);
    return ( $cuberoot == int $cuberoot ) ? 'true' : 'false';
}
```

```text
$ ./ch-1.pl 
true
Input:  $n = 27
Output: true

true
Input:  $n = 0
Output: true

false
Input:  $n = 6
Output: false
```

### Task 2: Reverse Vowels

> Submitted by: Mohammad S Anwar  
> You are given a string, `$s`.
>
> Write a script to reverse all the vowels (a, e, i, o, u) in the given string.

#### Let's Talk About It

We'll want a list of all the vowels in the string, so we'll break apart the string (`split //, $string`), collect the vowels ( `grep {/[aeiou]/mix}`), make them all lowercase for convenience (`map {lc}`) and `reverse` them, so they're in the right order when we start to replace.

Which we do with `substr`, which works as both an **lvalue** (`substr($string,1,1) = $char`) and an **rvalue** (`$char = substr($string,1,1)`). We loop through an index value for all characters, testing if it's a vowel (again with `/[aeiou]/mix`), converting to the case of the letter it replaces (`$n = uc $n if $c eq uc $c`), then replacing (`substr( $string, $i, 1 ) = $n`).

I'll point out that both `Perl` from the examples and `weekly challenge` come out the same, because their vowels are *palindromic:* `e` and `eeaee` and the case may be, so `e` replaced `e`. They're *totally* different `e`s, I swear. 

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ max sum0 };

my @examples = ( "Raku", "Perl", "Julia", "Uiua", "Dave", 'signatures', 'weekly challenge' );

for my $example (@examples) {
    my $output = reverse_vowels($example);

    say <<~"END";
    Input:  \$s = "$example"
    Output: "$output"
    END
}

sub reverse_vowels ($string) {
    my @vowels =
        reverse
        map  { lc }
        grep { /[aeiou]/mix }
        split //, $string;
    for my $i ( 0 .. -1 + length $string ) {
        my $c = substr( $string, $i, 1 );
        my $v = $c =~ /[aeiou]/mix ? 1 : 0;
        if ( $c =~ /[aeiou]/mix ) {
            my $n = shift @vowels;
            $n = uc $n if $c eq uc $c;
            substr( $string, $i, 1 ) = $n;
        }
    }

    return $string;
}
```

```text
$ ./ch-2.pl 
Input:  $s = "Raku"
Output: "Ruka"

Input:  $s = "Perl"
Output: "Perl"

Input:  $s = "Julia"
Output: "Jaliu"

Input:  $s = "Uiua"
Output: "Auiu"

Input:  $s = "Dave"
Output: "Deva"

Input:  $s = "signatures"
Output: "segnutaris"

Input:  $s = "weekly challenge"
Output: "weekly challenge"
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
