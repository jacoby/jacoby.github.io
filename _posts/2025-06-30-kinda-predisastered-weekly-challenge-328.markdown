---
layout: post
title: "Kinda Pre-Disastered: Weekly Challenge #328"
author: "Dave Jacoby"
date: "2025-06-30 17:03:47 -0400"
categories: ""
---

Welcome to [_**Weekly Challenge #328!**_](https://theweeklychallenge.org/blog/perl-weekly-challenge-328/) I've kinda been busy with life stuff and skipped a few weeklys. For reasons, I've been doing these on Thursday, but because even more life, I'm doing this on a Monday.

How's _your_ week going?

### Task 1: Replace all ?

> Submitted by: Mohammad Sajid Anwar  
> You are given a string containing only lower case English letters and **?**.
>
> Write a script to replace all **?** in the given string so that the string doesn’t contain consecutive repeating characters.

#### Let's Talk About It

This is a top-level aside, but since it's related to this task, I'll put it here. There's a song called "96 Tears" from the 60s Garage Rock heyday that I love. You usually hear it announced as by **Question Mark and the Mysterians**, but the label says **? and the Mysterians**. Rock critics have said it's the first punk rock song ever. "Too many teardrops for one heart to be cryin'", as the song goes.

There is a way to test for repeated characters with a Perl regular expression. I've used it. I just can't remember how to do so, because that sort of coding is just something I have never really needed to do.

Wait. I found it. `/(\w)\1{1}/mx` should do it. I don't think I'll rewrite the solution to handle it, even if it would be cooler.

But I didn't do that for this one. I use `grep` to find the indexes of the `?`s, then go through the alphabet. I work on a copy, seeing if I add, for example, `a`, that there isn't an `aa` anywhere within the string. I do this, as I've discussed before, by using `substr` as an **lvalue**. If I don't find duplicated letters, I end the inner loop with `last` and go back to the outer loop, where the next index is.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

my @examples = (

    qw{ a?z pe?k gra?te b?a?c?d?a }
);

for my $input (@examples) {
    my $output = replace_all_Qs($input);
    say <<"END";
    Input:  \@str = "$input"
    Output:        "$output"
END
}

sub replace_all_Qs($example) {
    my @qs =
        grep { '?' eq substr( $example, $_, 1 ) } 0 .. -1 + length $example;
    for my $q (@qs) {
        for my $l ( 'A' .. 'Z' ) {
            my $ll = $l . $l;
            my $c = $example;
            substr( $c, $q, 1 ) = $l;
            if ( $c !~ /$ll/mix ) {
                $example = $c;
                last;
            }
        }
    }
    return $example;
}
```

```text
$ ./ch-1.pl
    Input:  @str = "a?z"
    Output:        "aBz"

    Input:  @str = "pe?k"
    Output:        "peAk"

    Input:  @str = "gra?te"
    Output:        "graBte"

    Input:  @str = "b?a?c?d?a"
    Output:        "bCaBcAdBa"
```

### Task 2: Good String

> Submitted by: Mohammad Sajid Anwar  
> You are given a string made up of lower and upper case English letters only.
>
> Write a script to return the good string of the given string. A string is called **good string** if it doesn’t have two adjacent same characters, one in upper case and other is lower case.

#### Let's Talk About It

In the specific case of the first example, _WeEeekly_, it isn't particularly important to work the specific lowercase-first and uppercase-first examples, because it doesn't _really_ matter if we catch _W**eE**eekly_ or _We**Ee**ekly_, but the other example shows that we need a recursive solution.

Y'see, there's _abBA_. First pass removes _a**bB**A_ from the equation, and that leaves _aA_. That could be ignored, but no, the example we're shown clears it.

And if there was a way I could reuse that match I found above, `/(\w)\1{1}/mx`, in a way where `$1` is uppercase and `\1` isn't, or vice versa, I could regex this and leave a shorter but less readable solution.

I'll mention `_is_uppercase()`, a subroutine I used to get a boolean answer, so I can know if I'm looking for `aA` or `Aa`. I certainly _could've_ kept that one line full of ternary operation in the subroutine, but I think it's neater to have a sub that says what it's doing than the line of code that does it. That's of course `return $char eq uc $char ? 1 : 0`, which is roughly `if ( $char equals an uppercase copy of $char ) { return 1 } else { return 0 }`, if you haven't seen ternary operators before.

If you want things to keep going until your logic says stop, named `while` loops with `next` and `last` are useful. My `good_string()` is `TOP: while (1) { code goes here ; last } return $input`, with `next TOP` starting over when we find a match.

For that we loop over every index, determine if the current character is uppercase, make an opposite, see if the next character is that opposite, fill the next index and the current index (in that order) with empty strings, then start over again. I do the `if (test) {} else {}` thing to duplicate the code and not just fill a common value and do the work after. Would be cleaner. Would do it in production. Might do it for personal projects.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

my @examples = (
    qw{ WeEeekly abBAdDabc }
);

for my $input (@examples) {
    my $output = good_string($input);
    say <<"END";
    Input:  \@str = "$input"
    Output:        "$output"
END
}

sub good_string ($input) {
TOP: while (1) {
        for my $i ( 0 .. -1 + length $input ) {
            my $c = substr $input, $i, 1;
            if ( _is_uppercase($c) ) {
                my $cc = lc $c;
                if ( $cc eq substr $input, $i + 1, 1 ) {
                    substr( $input, $i + 1, 1 ) = '';
                    substr( $input, $i,     1 ) = '';
                    next TOP;
                }
            }
            else {
                my $cc = uc $c;
                if ( $cc eq substr $input, $i + 1, 1 ) {
                    substr( $input, $i + 1, 1 ) = '';
                    substr( $input, $i,     1 ) = '';
                    next TOP;
                }
            }
        }
        last;
    }
    return $input;
}
sub _is_uppercase($char) { return $char eq uc $char ? 1 : 0; }
```

```text
$ ./ch-2.pl
    Input:  @str = "WeEeekly"
    Output:        "Weekly"

    Input:  @str = "abBAdDabc"
    Output:        "abc"
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
