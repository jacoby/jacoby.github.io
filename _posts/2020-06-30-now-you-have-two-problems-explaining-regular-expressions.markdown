---
layout: post
title: "Now You Have Two Problems: Explaining Regular Expressions"
author: "Dave Jacoby"
date: "2020-06-30 17:56:06 -0400"
categories: ""
---

From a post in **The Perl Community**, a Facebook Group:

> Doubt 2: in perl:
>
> `s:\.(bat|pl)$::io;`
>
> `s:^.*[\\/]::o;`
>
> what s the above code does especially what is the use of ::io and ::o, here \$ means ends with .bat or pl right . simply it starts with 's:' wr the output of the cmd will store pls explain. Sorry if it is not valuable question as a beginner i dont have much knowledge on perl and like this so many doubts are , if u people dont mind i would like to clarify all the doubts in this forum.

OK, I'm not **in** the forum here, but regular expressions are good and fine things, so I'll explain here.

`s` means _substitution_, and is usually written like `s/ / /` or `s{ }{ }`, and the pattern matched in the left-hand section is replaced by what is in the right. Perl allows many things to be separators — _too many?_ — but here, they're using `:`. Don't do that. I'll rewrite with curly braces, or `{}`.

> `s{\.(bat|pl)\$}{}io;`
>
> `s{^.*[\\/]}{}o;`

For both, the end with `{}`, which means that whatever matches is replaced with nothing, not even a space. Below we match the letter `e` in the string and remove it.

```perl
my $string = 'regular expressions';
$string =~ s/e// ;
print $string
>>> rgular expressions
```

Then there's the modifiers. `/i` and `/o`. `/o` means _optimized_, and it often doesn't work as well as you might want.

To prove it, here's a benchmark you can run:

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental::signatures };

use Benchmark qw{:all};

cmpthese(
    10_000_000,
    {
        'Nonoptimized' => sub {
            my $string = 'Regular';
            $string =~ s/e//;
        },
        'Optimized' => sub {
            my $string = 'Regular';
            $string =~ s/e//o;
        }
    }
);
```

And a few results:

```text
$ for i in {1..5} ; do ./benchmark.pl ; done
                  Rate    Optimized Nonoptimized
Optimized    1373626/s           --          -8%
Nonoptimized 1494768/s           9%           --
                  Rate Nonoptimized    Optimized
Nonoptimized 1245330/s           --         -11%
Optimized    1394700/s          12%           --
                  Rate Nonoptimized    Optimized
Nonoptimized 1461988/s           --          -0%
Optimized    1466276/s           0%           --
                  Rate Nonoptimized    Optimized
Nonoptimized 1497006/s           --          -8%
Optimized    1623377/s           8%           --
                  Rate    Optimized Nonoptimized
Optimized    1615509/s           --          -3%
Nonoptimized 1658375/s           3%           --
```

Yeah, it improves the speed, but inconsistently. I used to use `/o` all the time, but I never use it any more.

The other modifier, `/i`, is _case insensitive_. `m{e}i` will match both `e` and `E`.

> `s{\.(bat|pl)$}{}io;`

The important part is `{\.(bat|pl)$}`, and we'll break that up.

Within a regular expression, `.` is the wildcard. It matches everything. `\.` escapes that, so here we're looking for a literal period character, followed by `(bat|pl)`, which is either the string `bat` or the string `pl`. With _this_ regular expression, we fill `$1` with either `bat` or `pl`, depending on what is in the string.

```
$_ = 'foo.pl';
s:\.(bat|pl):$1:io;
>>> foopl
```

We don't necessarily want to _capture_ the match, we just want to _match_ it. Non-capturing matches are written like `(?:bat:pl)`, which is **another** reason to not use `:` as your separator.

Finally, there are two special characters to note: `^` is the start of the string, and `$` represents the end of the string. So, if the string is `vampire.bat.py`, we don't want to match `.bat`, because that's not at the end of the string. So `.(?:bat|pl)$` only matches `.pm` and `.bat` (or capitalized), for removal.

Anyway...

The other regex, which is, again:

> `s:^.*[\\/]::o;`

It starts with the carot, `^`, which matches the start of the string. This is followed by `.*`. `.` is the wildcard, and `*` indicates zero-or-more instances of anything, followed by a character class, indicated by square brackets, containing a normal slash — `/` —  and a backslash — `\` — but since we use the backslash to escape special characters, we have to escape the backslash _with_ a blackslash, so `[\\/]`.

This regular expression matches everything up to and including the last slash or backslash, then replaces it with an absence. `/usr/bin/perl` would become `perl`, for example, but `/usr/bin/` would just be an empty string.

I think the point is to turn `/full/path/to/my/application/file.pl` and turn it into `file`. And, if that was my goal, I would do something different.

```perl
my ( $output ) = $string =~ m{([^\\/]+).(?:bat|pl)$}i;
```

For more information, read [Perldoc's `perlre`](https://metacpan.org/pod/perlre), the official documentation for Perl's regular expressions.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
