---
layout: post
title: "A Perfect Square Perfectly Squared: Weekly Challenge #256"
author: "Dave Jacoby"
date: "2024-02-12 16:28:10 -0500"
categories: ""
---

Welcome to **[Weekly Challenge #256!](https://theweeklychallenge.org/blog/perl-weekly-challenge-256/)** **256** is a [perfect square](https://en.wikipedia.org/wiki/Square_number), being **16<sup>2</sup>**. Of course, **4<sup>2</sup> = 16**, and also **2<sup>2</sup> = 4**, so 256 is a perfect square of a perfect square of a perfect square.

**256** is also [the area code of Huntsville, Alabama](https://en.wikipedia.org/wiki/Area_codes_256_and_938), a fact that must amuse some rocket scientists.

### Task 1: Maximum Pairs

> Submitted by: Mohammad Sajid Anwar
> You are given an array of distinct words, @words.
>
> Write a script to find the maximum pairs in the given array. The words $words[i] and $words[j] can be a pair one is reverse of the other.

#### Let's Talk About It

So, we're given an array of words. In the example cases, they're all two-letter words. A _pair_ is when two words, when sorted, are the same. `pw` and `wp` would be a pair, because they're both `wp`.

I use `map` in a void context again, instead of a `for` loop, splitting and sorting and joining each word, then use `map { $hash{$_}++}` to count all the individual munged words.

So, we have a pair when `$hash{$munge} > 1`, so I `grep` for that, and use `scalar` to get the count of what passes.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @examples = (

    [ "ab", "de", "ed", "bc" ],
    [ "aa", "ba", "cd", "ed" ],
    [ "uv", "qp", "st", "vu", "mn", "pq" ],
);

for my $example (@examples) {
    my $input  = join ', ', map { qq {"$_"} } $example->@*;
    my $output = maximum_pairs( $example->@* );

    say <<~"END";
    Input:  \@words = ($input)
    Output: $output
    END
}

sub maximum_pairs (@input) {
    my %hash;
    map {
        my $munge = join '', sort split //, $_;
        $hash{$munge}++
    } @input;
    return scalar grep { $_ > 1 } values %hash;
}
```

```text
$ ./ch-1.pl
Input:  @words = ("ab", "de", "ed", "bc")
Output: 1

Input:  @words = ("aa", "ba", "cd", "ed")
Output: 0

Input:  @words = ("uv", "qp", "st", "vu", "mn", "pq")
Output: 2
```

### Task 2: Merge Strings

> Submitted by: Mohammad Sajid Anwar
> You are given two strings, $str1 and $str2.
>
> Write a script to merge the given strings by adding in alternative order starting with the first string. If a string is longer than the other then append the remaining at the end.

#### Let's Talk About It

Normally, I would want to `split` both into arrays, then `push` the output into an array, one character at a time. I decided to do this with strings instead.

While there's both `$string` and `$string2`, I use `substr` to add the first characters to the output, then remove both first characters. I do this by using `substr` as both an [lvalue](https://perldoc.perl.org/perlglossary#lvalue), capable of being written to, and an [rvalue](https://perldoc.perl.org/perlglossary#rvalue), capable of being read from. That's so very useful.

Once one string or the other is empty, whe stop the `while` loop and join the remaining string to the output. Thing is, if either `$string1` or `$string2` is empty, `$output . $string1 . $string2` is equivalent to `$output . $string2 . $string1`, so returning the concatenated string finishes the job with no array-related functions like `join`.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @examples = (

    [ "abcd",   "1234" ],
    [ "abc",    "12345" ],
    [ "abcde",  "123" ],
);

for my $example (@examples) {
    my $output = merge_strings( $example->@* );
    my $p      = $example->[0];
    my $w      = $example->[1];

    say <<~"END";
    Input:  \$str1 = "$p", \$str2 = "$w"
    Output: "$output"
    END
}

sub merge_strings ( $str1, $str2 ) {
    my $output;
    while ( length $str1 && length $str2 ) {
        $output .= substr( $str1, 0, 1 ) .  substr( $str2, 0, 1 );
        substr( $str1, 0, 1 ) = '';
        substr( $str2, 0, 1 ) = '';
    }
    return $output . $str1 . $str2;
}
```

```text
$ ./ch-2.pl
Input:  $str1 = "abcd", $str2 = "1234"
Output: "a1b2c3d4"

Input:  $str1 = "abc", $str2 = "12345"
Output: "a1b2c345"

Input:  $str1 = "abcde", $str2 = "123"
Output: "a1b2c3de"

```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
