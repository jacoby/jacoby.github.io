---
layout: post
title: "London Patterns: Perl Weekly Challenge #99"
author: "Dave Jacoby"
date: "2021-02-11 14:56:26 -0500"
categories: ""
---

### Laws of Big Numbers

We're about to hit a rollover: This is the writeup for [Challenge #99](https://perlweeklychallenge.org/blog/perl-weekly-challenge-099/), which puts this as the last challenge before a rollover.

We as people like to put big numbers as milestones. In part, I think it's about how we like all those zeroes. There's not a significant difference between **100** and **99** beyond the size of the string needed to hold it.

Still, I'm hoping for some fun challenges.

I'm flashing on how perl's `localtime` function, when called in an array context, would returns `($sec ,$min, $hour, $mday, $mon, $year, $wday, $yday, $isdst)`, and that `$year` wasn't just the last two digits of the year (this would be written now as `21`) but rather the current year minus `1900` (which would be `121`).

Because misunderstanding, Perl's version of the Y2K bug was having developers concatenate `19` and `$year` instead of adding `1900` and `$year`. For this reason, the Y2K Yet Another Perl Conference is listed as **YAPC 19100**.

I don't expect issues with Perl Weekly Challenge numbers for a few years. The directories are `\d\d\d` not `\d\d\d\d`, so they'll time out eventually. I mean, in 2038, about the same time as the [Epochalypse](https://en.wikipedia.org/wiki/Year_2038_problem), and if we're still using Perl and making Perl challenges, I'm sure we'll make the required changes.

Just one of those things that I feel lead to share each time a rollover happens near me.

in other languages.

### TASK #1 › Pattern Match

> Submitted by: Mohammad S Anwar  
> You are given a string `$S` and a pattern `$P`.
>
> Write a script to check if given pattern validate the entire string. Print 1 if pass otherwise 0.
>
> The patterns can also have the following characters:
>
> **? - Match any single character.**  
> **\* - Match any sequence of characters.**

Let's consider the examples:

| Example | Input | Pattern | Output | Reasoning                                                                    |
| ------- | ----- | ------- | ------ | ---------------------------------------------------------------------------- |
| 1       | abcde | a\*e    | 1      | starts with a, any amount of anything, ends with e                           |
| 2       | abcde | a\*d    | 0      | starts with a, ends with e, anything inside                                  |
| 3       | abcde | ?b\*d   | 0      | starts with something, b as second char, any number of anything, ends with d |
| 4       | abcde | a\*c?e  | 1      | starts with a, any number of anything, a c, any one character, ends with e   |

The easiest way to solve this is turn `$P` into a simple Perl regular expression.

With Example 2, we that we're matching whole strings, not substrings, so the carot (`^`) meaning the beginning of the line, and the dollar sign (`$`) meaning the end of the line are implicit. So `$pattern = "^$pattern\$"` will get that going.

Then there's the two wildcards: `?` and `*`. It can take a little thinking to disentangle this. Here, `?` means one space that can be any character, while in Perl regular expressions, it indicates that the preceeding will occur zero or one times. `a?b` would match `ab` or `b`. The analogous character would be `.`.

Similarly, `*` means any positive number of anything. `a*b` would match `aeb`, `aeb` and `aeeeeeeeeeeeeeeeeeeeeeeeeeeeeeb`. As a matter of fact, it should match `aeeeeabeaeeeeeb`, because it starts with `a` and ends with `b`. It should not match `ab`, though, unless the rule's different than I expect. Perl's regular expression for zero-or-more is `.*`, while `.+` matches once or more. So `a.*b` would match `ab`, but `a.+b` would not.

Because those characters already have meaning in Perl's pattern matching, it is easy to get primed into ascribing the wrong meanings. I must admit that this happened to me. Thankfully, I was corrected before I started writing this.

So, with those transpositions in mind, we can generate a new `$pattern`, and then we can `return $S =~ /$pattern/`, except we kinda can't, because `//` doesn't return true and false as `1` and `0`, but rather `1` and `undef` which is not what we were asked for. So, we can engage a ternary operator and `return $S =~ /$pattern/ ? 1 : 0`

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{say signatures };
no warnings qw{experimental};

my @arr;
push @arr, [ 'abcde', 'a*e' ];
push @arr, [ 'abcde', 'a*d' ];
push @arr, [ 'abcde', '?b*d' ];
push @arr, [ 'abcde', 'a?c*e' ];

for my $n (@arr) {
    my $p = pattern_match( $n->@* );
    say $n->[0];
    say $n->[1];
    say $p;
}

sub pattern_match ( $S, $P ) {
    my $pattern = $P;

    # this was my first pass on this part
    # $pattern =~ s/\*/.*/g;
    # $pattern =~ s/\?/.?/g;
    #
    # a comment from Jonas Berlin (xkr47)
    # made me reconsider. By the rules of the
    # task, ? is ONE character and * is MANY
    # CHARACTERS, but in Perl's regular
    # expressions, .? is ZERO OR ONE CHARACTER
    # and .* is ZERO OR MORE CHARACTERS
    # to get ONE OR MORE CHARACTERS, we instead
    # use .+ and to get ONE CHARACTER, we use .
    #
    # but of course, we need to match the WHOLE
    # string, so we're matching the beginning (^)
    # and the end ($)

    $pattern =~ s/\*/.+/g;
    $pattern =~ s/\?/./g;
    $pattern = qq{^$pattern\$};
    return $S =~ /$pattern/mix ? 1 : 0;
}
```

```text
abcde
a*e
1
abcde
a*d
0
abcde
?b*d
0
abcde
a?c*e
1
```

Perhaps I should work on formatting here...

### TASK #2 › Unique Subsequence

> Submitted by: Mohammad S Anwar  
> You are given two strings `$S` and `$T`.
>
> Write a script to find out count of different unique subsequences matching `$T` without changing the position of characters.

To explain, we have the second example, with string `london` and pattern `lon`. `l` must come first, followed by `o` and then `n`. But they don't have to be contiguous. For the `london` example, we therefore have three results.

> **lon**don  
>  **lo**ndo**n**  
>  **l**ond**on**

#### This Looks Like A Job For _RECURSION!_

I mean, I think I _could_ do it with iteration, but it's just easier to think it through with recursion.

So, we start out with:

- the string `london`
- the pattern `lon`
- the index for the string, which starts at `0`
- the index for the pattern, which starts at `0`
- an arrayref to hold which holds the positions

```text
london, lon, 0, 0, []
    string:    london
               ^
    pattern:   lon
               ^
```

Because there's only one `l`, the first letter MUST be used, but because our program doesn't know this, so we need to handle both the case where it is included — `unique_sub( $S, $T, 1, 1, [0] )` — and the case where it isn't — `unique_sub( $S, $T, 1, 0, [] )`. The next recursions for the second case will go on trying to match the rest of the word with `l` of `lon` and failing, so we'll follow `1,1`.

```text
london, lon, 1, 1, [0]
    string:    london
                ^
    pattern:   lon
                ^
unique_sub( $S, $T, 2, 2, [0,1] )
unique_sub( $S, $T, 2, 1, [0] )
```

Again following the first path:

```text
london, lon, 2, 2, [0,1]
    string:    london
                 ^
    pattern:   lon
                 ^
unique_sub( $S, $T, 3, 3, [0,1,2] )
unique_sub( $S, $T, 3, 2, [0,1] )
```

The first case is now complete, so we don't go down that anymore, but there's still the case where we don't match the `n`.

```text
london, lon, 3, 2, [0,1]
    string:    london
                  ^
    pattern:   lon
                 ^
unique_sub( $S, $T, 4, 2, [0,1] )
```

```text
london, lon, 4, 2, [0,1]
    string:    london
                   ^
    pattern:   lon
                 ^
unique_sub( $S, $T, 5, 2, [0,1] )
```

```text
london, lon, 5, 2, [0,1]
    string:    london
                    ^
    pattern:   lon
                 ^
```

We're at the end of the string, so we can't go forward, but we have a match, getting us `[lo] ndo [n]`, which is represented as the key `0.1.5`, which gets passed back.

(I could put in anonymous arrays rather than strings, but I find these strings a little easier to deal with.)

Eventually, we get `0.1.2`, `0.1.5` and `0.4.5`.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{say state signatures };
no warnings qw{experimental};

my @arr;

push @arr, [ 'littleit',    'lit' ];
push @arr, [ 'london',      'lon' ];
push @arr, [ 'abracadabra', 'abra' ];
push @arr, [ 'mississippi', 'miss' ];

for my $n (@arr) {
    my @p = unique_sub( $n->@* );
    say '';
    for my $o (@p) {
        state $c = 0;
        $c++;
        my $string = display_sub( $n->[0], $o );
        say qq{  $c:  $string };
    }
}

sub unique_sub ( $S, $T, $p = 0, $q = 0, $done = undef ) {
    if ( $p > length $S ) { return }
    $done //= [];
    my @output;
    my $l   = length $T;
    my $l1  = substr $S, $p, 1;
    my $l2  = substr $T, $q, 1;
    my $key = join '.', $done->@*;

    # THE CASE OF NO MATCH
    my $copy->@* = $done->@*;
    push @output, unique_sub( $S, $T, $p + 1, $q, $copy );

    # THE CASE OF MATCH
    if ( $l1 eq $l2 ) {    # is a match
        if ( $q < $l ) {    # is not a complete match
            push $copy->@*, $p;
            push @output, unique_sub( $S, $T, $p + 1, $q + 1, $copy );
        }
        elsif ( $l == $q ) {    # is a complete match
            push @output, $key;
        }
    }
    return sort @output;
}

sub display_sub ( $string, $key ) {
    my @key   = split /\D/, $key;
    my %key   = map { $_ => 1 } @key;
    my $state = 0;
    my $output;

    for my $i ( 0 .. length $string ) {
        my $l = substr( $string, $i, 1 );
        my $k = $key{$i} || 0;

        $output .= ' [' if $state == 0 && $k == 1;
        $output .= '] ' if $state == 1 && $k == 0;
        $output .= $l;
        $state = $k;
    }

    $output .= '] ' if $state == 1;
    $output =~ s/^\s+//mix;
    return $output;
}
```

```text

  1:  [lit] tleit
  2:  [li] t [t] leit
  3:  [li] ttlei [t]
  4:  [l] ittle [it]
  5:  litt [l] e [it]

  6:  [lon] don
  7:  [lo] ndo [n]
  8:  [l] ond [on]

  9:  [abr] acadabr [a]
  10:  [abra] cadabra
  11:  [abr] ac [a] dabra
  12:  [abr] acad [a] bra
  13:  [ab] racadab [ra]
  14:  [a] bracada [bra]
  15:  abr [a] cada [bra]
  16:  abrac [a] da [bra]
  17:  abracad [abra]

  18:  [miss] issippi
  19:  [mis] si [s] sippi
  20:  [mis] sis [s] ippi
  21:  [mi] s [s] i [s] sippi
  22:  [mi] s [s] is [s] ippi
  23:  [mi] ssi [ss] ippi
  24:  [m] iss [iss] ippi
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
