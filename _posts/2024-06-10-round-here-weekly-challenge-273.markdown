---
layout: post
title: "Round Here: Weekly Challenge #273"
author: "Dave Jacoby"
date: "2024-06-10 17:54:55 -0400"
categories: ""
---

Welcome to [**Weekly Challenge #273!**](https://theweeklychallenge.org/blog/perl-weekly-challenge-273/) I would dive into what kind of number **273** is, but I just don't have it in me right now.

### Task 1: Percentage of Character

> Submitted by: Mohammad Sajid Anwar  
> You are given a string, `$str` and a character `$char`.
>
> Write a script to return the percentage, nearest whole, of given character in the given string.

#### Let's Talk About It

This moves toward a question I hadn't thought to engage before, which goes to rounding. I hadn't ever even thought to round before. Cut off at so many significant digits, sure, or cast as int, but not rounded to nearest whole number.

Because I always found it to be a useful tool, I went with `sprintf`, specifically with zero significant digits, or `sprintf '%.0f', $number`, and I found unexpected behavior.

```perl

for my $f (map { $_ + 0.5 } 0 ..5 ) {
    my $w = sprintf '%.0f', $f;
    my $o = $w < $f ? 'down' : 'up';
    say qq{  $f round $o to $w };
}

  0.5 round down to 0 
  1.5 round up to 2 
  2.5 round down to 2 
  3.5 round up to 4 
  4.5 round down to 4 
  5.5 round up to 6 
```

The defined, IEEE-approved behavior, is to round to the nearest even number at `0.5`, and the example problem that hits this point rounds the wrong way.

Back in elementary school, the rounding rule was **2.5** rounds to **3**, not **2**. I wrote a `round` function that behaves as I had learned it. I know that [Math::Round](https://metacpan.org/pod/Math::Round) exists, but I decided against it.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ bitwise fc postderef say signatures state };

use List::Util qw{max};

my @examples = (

    { str => "perl",      char => "e" },
    { str => "java",      char => "a" },
    { str => "python",    char => "m" },
    { str => "ada",       char => "a" },
    { str => "ballerina", char => "l" },
    { str => "analitik",  char => "k" },
);
for my $example (@examples) {
    my $char    = $example->{char};
    my $str     = $example->{str};
    my @str     = split //, $str;
    my $count   = scalar grep { $_ eq $char } @str;
    my $total   = scalar @str;
    my $output  = round( 100 * $count / $total );
    say <<"END";
Input:  \$str = "$str", \$char = "$char"
Output: "$output"
END
}

sub round ($number) {
    my $int = int $number;
    return $number if $number == $int;
    my $r = $number - $int;
    return $r < 0.5 ? $int : $int + 1;
}
```

```text
$ ./ch-1.pl 
^[[AInput:  $str = "perl", $char = "e"
Output: "25"

Input:  $str = "java", $char = "a"
Output: "50"

Input:  $str = "python", $char = "m"
Output: "0"

Input:  $str = "ada", $char = "a"
Output: "67"

Input:  $str = "ballerina", $char = "l"
Output: "22"

Input:  $str = "analitik", $char = "k"
Output: "13"
```

### Task 2: B After A

> Submitted by: Mohammad Sajid Anwar  
> You are given a string, `$str`.
>
> Write a script to return `true` if there is at least one `b`, and no `a` appears after the first `b`.

#### Let's Talk About It

I think this is all fairly clear pattern matching and `substr`.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ fc say postderef signatures state };

use List::Util qw{ sum0 };

my @examples = (

    "aabb",
    "abab",
    "aaa",
    "bbb",
);

for my $example (@examples) {
    my $output = baftera($example);

    say <<"END";
Input:  \$str = "$example"
Output: $output
END
}

sub baftera ($str) {
    return 'false' unless $str =~ /b/mix;
    my $has_b = 0;
    for my $i ( 0 .. length $str ) {
        my $char = substr $str, $i, 1;
        $has_b = 1 if $char eq 'b';
        return 'false' if $has_b && $char eq 'a';
    }
    return 'true';
}
```

```text
$ ./ch-2.pl 
Input:  $str = "aabb"
Output: true

Input:  $str = "abab"
Output: false

Input:  $str = "aaa"
Output: false

Input:  $str = "bbb"
Output: true
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
