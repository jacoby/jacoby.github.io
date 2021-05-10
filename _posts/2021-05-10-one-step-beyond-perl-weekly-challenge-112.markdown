---
layout: post
title: "One Step Beyond: Perl Weekly Challenge #112"
author: "Dave Jacoby"
date: "2021-05-10 15:34:39 -0400"
categories: ""
---

[I'm diving headlong into the new Perl Weekly Challenge.](https://perlweeklychallenge.org/blog/perl-weekly-challenge-112/)

### TASK #1 › Canonical Path

> Submitted by: Mohammad S Anwar  
> You are given a string path, starting with a slash `‘/'`.
>
> Write a script to convert the given absolute path to the simplified canonical path.
>
> In a Unix-style file system:
>
> - A period `'.'` refers to the current directory
> - A double period `'..'` refers to the directory up a level
> - Multiple consecutive slashes ('//') are treated as a single slash `'/'`
>
> The canonical path format:
>
> - The path starts with a single slash `'/'`.
> - Any two directories are separated by a single slash `'/'`.
> - The path does not end with a trailing `'/'`.
> - The path only contains the directories on the path from the root directory to the target file or directory

I solved it with regular expressions. I could imagine an iterative solution, where we split on `/` and go through, dropping the entry if it is `.`, that and decrementing the index if it's `..` and so on, but really, the regular expression route seems the easiest to read and implement.

I used a while loop instead of a global regex, because the result of one change could be hidden. Take the third example, `/a/b/c/../..`. `s{/\w+/\.\.}{}gmix` would only match `/c/..`, not the one that would become `/b/..`.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say state postderef signatures };
no warnings qw{ experimental };

my @paths;
push @paths, "/a/";
push @paths, "/a/b/./c/";
push @paths, "/a/b//c/";
push @paths, "/a/b/c/../d/..";
push @paths, "/a/b/c/../..";
push @paths, "/a/b/c/";

for my $path (@paths) {
    my $cpath = canonical_path($path);
    say <<"END";
        path:       $path
        canonical:  $cpath
END
}

sub canonical_path ($path) {
    while ($path =~ m{/\w+/\.\.}mix
        || $path =~ m{//}mix
        || $path =~ m{/\./}mix )
    {
        $path =~ s{/\w+/\.\.}{/}mix;
        $path =~ s{//}{/}mix;
        $path =~ s{/\./}{/}mix;
    }
    $path =~ s{/$}{}mix;
    $path = qq{/$path} unless $path =~ m{^/}mix;
    return $path;
}
```

```text
        path:       /a/
        canonical:  /a

        path:       /a/b/./c/
        canonical:  /a/b/c

        path:       /a/b//c/
        canonical:  /a/b/c

        path:       /a/b/c/../d/..
        canonical:  /a/b

        path:       /a/b/c/../..
        canonical:  /a

        path:       /a/b/c/
        canonical:  /a/b/c
```

### TASK #2 › Climb Stairs

> Submitted by: Mohammad S Anwar  
> You are given `$n` steps to climb
>
> Write a script to find out the distinct ways to climb to the top. You are allowed to climb either 1 or 2 steps at a time.

What do I always say?

_This Looks Like A Job For **Recursion!**_

This looked very much like a job for recursion to me. You either take two steps or one. For each, either:

- you there's still steps, so you take another one
- you're a the top of the stairs, and so we count that one
- you've taken more steps than there are, so we don't count that

(I really gotta make merch.)

Unlike some previous tasks, the steps are not interchangable. `1 step + 2 steps` is distinct from `2 steps + 1 step`. 

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say state postderef signatures };
no warnings qw{ experimental };

my @values = ( 3, 4, 5 );
@values = @ARGV if @ARGV;

for my $v (@values) {
    my $c = 1;
    say '-' x 20;
    my @steps = climb_stairs($v);
    say qq{INPUT:  $v};
    say qq{OUTPUT: } . scalar @steps;
    for my $opt (@steps) {
        say qq{\tOption $c: $opt};
        $c++;
    }
}

sub climb_stairs ( $v, $max_steps = 2 ) {
    my @output;
    for my $n ( 1 .. $max_steps ) {
        my $step = $n < 2 ? '1 step' : "$n steps";
        my $w    = $v - $n;
        if ( $w > 0 ) {
            push @output,
                map { $step . ' + ' . $_ }
                climb_stairs( $w, $max_steps );
        }
        elsif ( $w == 0 ) { push @output, $step; }
    }
    return @output;
}
```

```text
--------------------
INPUT:  3
OUTPUT: 3
        Option 1: 1 step + 1 step + 1 step
        Option 2: 1 step + 2 steps
        Option 3: 2 steps + 1 step
--------------------
INPUT:  4
OUTPUT: 5
        Option 1: 1 step + 1 step + 1 step + 1 step
        Option 2: 1 step + 1 step + 2 steps
        Option 3: 1 step + 2 steps + 1 step
        Option 4: 2 steps + 1 step + 1 step
        Option 5: 2 steps + 2 steps
--------------------
INPUT:  5
OUTPUT: 8
        Option 1: 1 step + 1 step + 1 step + 1 step + 1 step
        Option 2: 1 step + 1 step + 1 step + 2 steps
        Option 3: 1 step + 1 step + 2 steps + 1 step
        Option 4: 1 step + 2 steps + 1 step + 1 step
        Option 5: 2 steps + 1 step + 1 step + 1 step
        Option 6: 1 step + 2 steps + 2 steps
        Option 7: 2 steps + 1 step + 2 steps
        Option 8: 2 steps + 2 steps + 1 step
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
