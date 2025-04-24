---
layout: post
title: "Your Embrace and My Collapse: Weekly Challenge #318"
author: "Dave Jacoby"
date: "2025-04-24 14:28:23 -0400"
categories: ""
---

Welcome to [**_Weekly Challenge #318!_**](https://theweeklychallenge.org/blog/perl-weekly-challenge-318/) **318** is a [sphenic number](https://en.wikipedia.org/wiki/Sphenic_number) and is also [the area code for the northern part of Louisiana](https://en.wikipedia.org/wiki/Area_code_318).

### Task 1: Group Position

> Submitted by: Mohammad Sajid Anwar  
> You are given a string of lowercase letters.
>
> Write a script to find the position of all groups in the given string. Three or more consecutive letters form a group. Return "” if none found.

#### Let's Talk About It

So, if we're given `skulllike`, we're to expect `lll`. And I had a little problem with it. It's _all_ regular expressions (or at least my solution is; you might see another way, like nested for loops and `substr`) and I was having problems with the correct backreferences, so my first pass was like:

```perl
my @chars = $example =~ m{(\w)\1{2,}}gmx;
for my $c (@chars) {
    my $str = $example =~ m{($c{3,})}mix;
    push @output, $str;
}
```
But consider this regex: `((\w)\w\w)`

We want to get `abc` and not just `a`. On the outside, we're looking at `$1` matching `abc` and `$2` matching the inner `a`. That's outside; inside the regex, we'd be dealing with `\1` and `\2`, and `((\w)\1)` is the outer match referencing itself.

So, we get to `@output = $example =~ m{((\w)\2{2,}}`. 
The first element is the least number of allowable matches, and after the comma would be the maximum. `'aaaaaaaaaa' =~ m{(\w{2,5})}mx` would put `aaaaa` into `$1`, not all ten `a`s.

But `@array = $string =~ /(match(match))/gmx` puts `$1` and `$2` into `@array`. We know we have to have a certain size, so we can just `grep` out any shorter string, and we have basically a one-line answer.

Which, of course, I added 15 lines of comments to. 

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

my @examples = (qw{ abccccd aaabcddddeefff abcdd });

for my $example (@examples) {
    my @output = group_position($example);
    my $output = join ', ', map { qq{"$_"} } @output;
    say <<"END";
    Input:  \$str = "$example"
    Output: $output
END
}

sub group_position ($example) {
    return grep { length $_ > 2 } $example =~ m{
            # (\w) matches any word character
            # (\w)\1{2,} matches when there's one characters
            #   that is followed by two or more identical
            #   characters. The form is { at least, no more than}
            # ((\w)\1) would give problems because it's trying to
            #   use the outer match
            # ((\w)\2) would return first the repeated characters
            #   (like "aa") and then the first match itself ("a")
            # ((\w)\2{2,}) returns the "aaaaa" and then the "a"
            #
            # there is perhaps magic that allows (\w) to be used
            # within the regex but pass out, but I don't know it.
            # Therefore the grep.
            #
            # also //x allows you to comment your complex regular
            # expressions.

            ( (\w)\2{2,} )
            }gmx;
}
```

```text
$ ./ch-1.pl
    Input:  $str = "abccccd"
    Output: "cccc"

    Input:  $str = "aaabcddddeefff"
    Output: "aaa", "dddd", "fff"

    Input:  $str = "abcdd"
    Output:
```

### Task 2: Reverse Equals

> Submitted by: Roger Bell_West  
> You are given two arrays of integers, each containing the same elements as the other.
>
> Write a script to return true if one array can be made to equal the other by reversing exactly one contiguous subarray.

#### Let's Talk About It

This is similar to [last week's](https://jacoby-lpwk.onrender.com/2025/04/17/we-all-live-in-a-yellow-substring-weekly-challenge-317.html) second task, except instead of strings, we're dealing with (and copying) arrays. Looping through indexes and stringifying the arrays for comparison.

I suppose going through element by element is the better way to compare arrays, but if you can stringify them, it works fine.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

my @examples = (

    [ [ 3, 2, 1, 4 ], [ 1, 2, 3, 4 ], ],
    [
        [ 1, 3, 4 ],
        [ 4, 1, 3 ],
    ],
    [
        [2],
        [2],
    ],

);

for my $example (@examples) {
    my $source = join ', ', $example->[0]->@*;
    my $target = join ', ', $example->[1]->@*;
    my $output = reverse_equals($example);
    say <<"END";
        Input:  \@source = ($source)
                \@target = ($target)
        Output: $output
END
}

sub reverse_equals ($obj) {
    my @source = $obj->[0]->@*;
    my @target = $obj->[1]->@*;
    for my $i ( 0 .. $#source ) {
        for my $j ( $i + 1 .. $#source ) {
            my @copy = map { $_ } @source;
            $copy[$i] = $source[$j];
            $copy[$j] = $source[$i];
            my $t    = join ' ', @target;
            my $c    = join ' ', @copy;
            return 'true' if $c eq $t;
        }
    }

    return 'false';
}
```

```text
$ ./ch-2.pl 
        Input:  @source = (3, 2, 1, 4)
                @target = (1, 2, 3, 4)
        Output: true

        Input:  @source = (1, 3, 4)
                @target = (4, 1, 3)
        Output: false

        Input:  @source = (2)
                @target = (2)
        Output: false
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
