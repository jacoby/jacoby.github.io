---
layout: post
title: "Preel Weeakly: Weekly Challenge #255"
author: "Dave Jacoby"
date: "2024-02-05 13:34:27 -0500"
categories: ""
---

Welcome to **[Weekly Challenge #255!](https://theweeklychallenge.org/blog/perl-weekly-challenge-255/)**, **255** is the product of **3, 5 and 17**. It also equals **2<sup>8</sup> - 1**, which makes it a **[Mersenne number](https://en.wikipedia.org/wiki/Mersenne_prime)** but not a **Mersenne Prime**. And, of course, it is **11111111** in binary, which is the largest integer which can be represented by one byte.

### Task 1: Odd Character

> Submitted by: Mohammad Sajid Anwar
>
> You are given two strings, `$s` and `$t`. The string `$t` is generated using the shuffled characters of the string `$s` with an additional character.
>
> Write a script to find the additional character in the string `$t`..

#### Let's Talk About It

I wanted to use [List::Compare](https://metacpan.org/pod/List::Compare). It's a good module and is worth pushing, but...

OK, there _could_ be a way to use List::Compare to do this, but I don't know it off the top of my head. The problem is with `Perl` and `Preel`, and the `e`. List::Compare saw that both sides being compared had an `e` and that was good enough.

But that's OK, because it gave me a license to hack. Both strings were split into arrays and sorted, so that the equivalent letters come out. `"Perl"` becomes `["P", "e", "l", "r"]` and `"Preel"` becomes `["P", "e", "e", "l", "r"]`.

We then compare the arrays, one element at a time. I do it destructively, `pop`ing the elements, rather than keeping indexes, but that would work too. If the characters are the same, pop both. Else, if one array is longer than the other, pop that and put it in the output. By the rules and examples, the second word should be longer, but this code handles both cases.

(Remember the _X-Files_ movie? Early in it, after the inciting incident happens and the conspiracy people show up, one character, Bronschweig, says this line: **"Sir, the impossible scenario we never planned for? Well, we better come up with a plan."** There are cases in if statements that should not happen, like a case where the arrays don't start with the same character but neither is longer than the other. I always try to reference that line when writing an "impossible" case.)

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use Carp;
use List::Compare;

my @examples = (

    { s => "Perl",   t => "Preel" },
    { s => "Weekly", t => "Weeakly" },
    { s => "Box",    t => "Boxy" },
);

for my $example (@examples) {
    my $output = odd_character($example);
    my $s      = $example->{s};
    my $t      = $example->{t};

    say <<~"END";
    Input:  \$s = "$s" \$t = "$t"
    Output: $output
    END
}

sub odd_character ($input) {
    my @s = sort split //, $input->{s};
    my @t = sort split //, $input->{t};
    my @output;
    while ( @s && @t ) {
        if ( $s[0] eq $t[0] ) {
            shift @s;
            shift @t;
        }
        else {
            if ( scalar @s > scalar @t ) {
                push @output, shift @s;
            }
            elsif ( scalar @s < scalar @t ) {
                push @output, shift @t;
            }
            else { croak 'Impossible Scenario' }
        }
    }
    push @output, @s if @s;
    push @output, @t if @t;
    return shift @output;
}
```

```text
$ ./ch-1.pl
Input:  $s = "Perl" $t = "Preel"
Output: e

Input:  $s = "Weekly" $t = "Weeakly"
Output: a

Input:  $s = "Box" $t = "Boxy"
Output: y
```

### Task 2: Most Frequent Word

> Submitted by: Mohammad Sajid Anwar  
> You are given a paragraph `$p` and a banned word `$w`.
>
> Write a script to return the most frequent word that is not banned.

#### Let's Talk About It

I have done something and I feel no guilt about it.

I have committed (and now have published) functional code that uses `map` but doesn't fill an array. I have used it as a loop. `map { $hash{$_}++ } 1..10` wastes the result, but that would just be ten `1`s. I have seen people arguing that it's bad form, but besides maybe being slower (I could [Benchmark](https://metacpan.org/pod/Benchmark) it to know for sure), I don't see any solid reason why the functional technique is worse than loops.

But anyway, we split on one or more non-word characters `/\W+/`, which has the possibility of breaking `"isn't"` into `"isn"` and `"t"`, but the examples contain no contractions.

There's a thing that's ambiguous to me. Second example has `the` as the blocked word, but it isn't clear if `The` would also be blocked. That the correct output is `Perl` and not `perl` indicates to me that code folding isn't part of the solution. But while I'm mentioning that I'm not doing it, I think I should explain. We would previously write `lc $x eq lc $y` to compare to strings without bothering with case, but `lc` and `uc` don't affect Unicode, which is increasingly common in text. [`fc`](https://perldoc.perl.org/functions/fc) works with Unicode.

Anyway, we use `grep` to ensure that the blocked word doesn't get considered, and then `map { $hash{$_} ++ }` as discussed previously, to count each word. Once we're done, we can use `max` from the perrenial favorite, [List::Util](https://metacpan.org/pod/List::Util), on the hash. `keys` gives a list of keys to the hash, but `values` gives you access to the count, and thus we get the highest count. `grep {$hash{$_} == $max}` gives us a list of words that make that high count (presumably a list of one element), and then `return shift @output` gives us the first (only) entry and the correct solution.

If abusing functional techniques is wrong, I don't want to be right.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state fc };

use List::Util qw{ max };

my @examples = (

    {
        paragraph =>
            "Joe hit a ball, the hit ball flew far after it was hit.",
        word => "hit",
    },
    {
        paragraph =>
"Perl and Raku belong to the same family. Perl is the most popular language in the weekly challenge.",
        word => "the",
    }
);

for my $example (@examples) {
    my $output = most_frequent_word($example);
    my $p = $example->{paragraph};
    my $w = $example->{word};

    say <<~"END";
    Input:  \$p = "$p"
            \$w = "$w"
    Output: "$output"
    END
}

sub most_frequent_word ($obj) {
    my $paragraph   = $obj->{paragraph};
    my $banned_word = $obj->{word};
    my %hash;

    # some people REALLY hate map being used in this way, believing
    # that it should end in (start with) @array = , but clearly,
    map { $hash{$_}++ }
        grep { $_ ne $banned_word }
        split /\W+/, $paragraph;
    my $max = max values %hash;
    my @output =
        grep { $hash{$_} == $max } keys %hash;
    return shift @output;
}
```

```text
$ ./ch-2.pl
Input:  $p = "Joe hit a ball, the hit ball flew far after it was hit."
        $w = "hit"
Output: "ball"

Input:  $p = "Perl and Raku belong to the same family. Perl is the most popular language in the weekly challenge."
        $w = "the"
Output: "Perl"
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
