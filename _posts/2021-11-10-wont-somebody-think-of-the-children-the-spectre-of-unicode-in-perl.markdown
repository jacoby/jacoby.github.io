---
layout: post
title: "“Won't SOMEBODY Think Of The Children?!?!?”: The Spectre of Unicode in Perl"
author: "Dave Jacoby"
date: "2021-11-10 14:33:17 -0500"
categories: ""
---

Having lived through the 1980s, I'm not a big fan of Moral Panics, where there's a whole lot of "What if...?" and "We must _protect ourselves_!" and not a whole lot of really understanding the issue. I say "issue" instead of "problem" because I find there isn't one.

So, I look on [r/perl](https://www.reddit.com/r/perl/) and avoiding other things, and I see ["Scary, hard to detect code hiding"](https://www.reddit.com/r/perl/comments/qqw26x/scary_hard_to_detect_code_hiding/).

It points to a [blog post](https://certitude.consulting/blog/en/invisible-backdoor/) where they demonstrate how to use space-like unicode characters in Javascript. Specifically, they use `ㅤ`. That's [Hangul Filler](https://www.compart.com/en/unicode/U+3164), kids! You can read the whole thing, but in essence, they do an AJAX call where they can send another command that does what _it_ wants, hides it in `ㅤ`, then execs `ㅤ` after a `ping` and `curl`, and because the dev never sees `ㅤ` (unless they have space hightlighting turned on in their editor), they never even think that the non-JS "ending" commas are not actually "ending".

I mean, **Holy Significant Whitespace, Batman!**

To quote the person sending this:

> **Perl must be vulnerable to some if not all of these. What tools do we have/should we have in the perl ecosystem to help detect and warn or block these code smells?**

To my mind, Perl _comes_ with the solution to this.

Sigils. And `no utf-8` by default, but mostly sigils.

Perl has some _nice_ Unicode support, but lots of it is not what you think it is or want it to be. I would _♥_ it if `use utf-8` did the work of telling all the filehandles, but you have to do `binmode STDOUT, ':utf8'` instead. Mostly what you get from `utf-8` is the ability to use Unicode _in_ your code. That's a _fun_ thing, but I'm not sure it's _useful_.

For example:

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say };

use utf8;

if (1) {
    my $π = 3.14159;
    my $ㅤ = 'blank';
    say join '|', 1, $π, $ㅤ, 2;
    exit;
}

__DATA__

1|3.14159|blank|2
```

Here I'm using `$π` instead of `$pi` to hold the first handful of digits of Pi. I used to work in academic research, and there, PI means Primary Investigator, so having the Unicode character tells me that I'm definitely dealing with a mathematical constant and not a professor's name. Because I don't want to go over Unicode tables or search `pi unicode` whenever I want to use a variable name, I will likely only use this rarely.

Also, in a decade of coding for the lab, I never had to identify an important client and find the circumference of a circle in the same program. 😀

This is the important part of the example code.

```javascript
app.get('/network_health', async (req, res) => {
    const { timeout,ㅤ} = req.query;
    const checkCommands = [
        'ping -c 1 google.com',
        'curl -s http://example.com/',ㅤ
    ];
    ...
});
```

If you had this and formatted it, most JS formatters will remove the trailing commas, but here they survive it, because it's really ...

```javascript
app.get('/network_health', async (req, res) => {
    const { timeout, HANGUL_FILLER} = req.query;
    const checkCommands = [
        'ping -c 1 google.com',
        'curl -s http://example.com/', HANGUL_FILLER
    ];
    ...
});
```

And whatever `/network_health` sends long with the timeout will be run as you in the try/catch promise block I cut out for space.

But, while trailing commas are not liked in the JS world, they're incredibly common in Perl. (Or maybe they're possible in Perl and I just _really_ like them, because I want to be able to easily reorder the arrays I build by hand. YMMV.)

So, I get why, in non-Perl languages, you would have problems, and you might want to add a pre-commit hook that searches for `HANGUL_FILLER` in your code, but in Perl?

`my ($timeout, $ㅤ) = suspect_function()` and `my @commands = ( 'ping -c 1 google.com', 'curl -s http://example.com/', $ㅤ)` _will_ look funny, because when in Perl do you just see `$` just hanging there? Same thing with `@` and `%` and `&`, mostly.

I mean, look at this:

```perl
use utf8;
if (1) {
    my $π = 3.14159;
    my $ㅤ = 'blank';
    say join '|', 1, $π, $ㅤ, 2, &ㅤ, ㅤ(), 3;
    exit;
}

sub ㅤ () {
    return 'HANGUL_FILLER';
}
__DATA__
1|3.14159|blank|2|HANGUL_FILLER|HANGUL_FILLER|3
```

With masterful symbol table manipulation, you can stick `&ㅤ` or `ㅤ()` (the function answers to both) into `main` from a library, but that's it's own issue.

I suppose I could try to do `104 %ㅤ 20`, but I can't think of where `digit %hash digit` won't immediatly be a syntax error. Same thing with `digit @array digit`. But `&`...

```perl
use experimental qw{ say signatures state };
use utf8;

if (1) {
    my $x = 0;
    my $π = 3.14159;
    my $ㅤ = 'blank';
    say join '|', 1, $π, $ㅤ, 2, &ㅤ, ㅤ(), 3;
    ( $x, ㅤ($π) ) = ( 'lvalue', 'test' );
    exit;
}

sub ㅤ : lvalue ( $a='a', $b='b' ) {
    say join '|', $a, $b;
    return 'HANGUL_FILLER';
}
__DATA__

a|b
a|b
1|3.14159|blank|2|HANGUL_FILLER|HANGUL_FILLER|3
3.14159|b
Can't return a readonly value from lvalue subroutine at ./test.pl line 25.
```

Here, we have the `HANGUL_FILLER` subroutine, now defined as an lvalue, meaning it can sit on either side of the assignment. Here there's an error because I have forgotten (if I ever knew) how to tell if the function's being used in an lvalue context, but if I had it at hand, I would certainly `if` it. But there, yes.

And really, if someone is mucking around with your symbol table,

`($x,()) = 1..20` is _valid_, with `$x` getting 1 and the rest of the numbers dropping on the ground. But looking at that, I would likely shorten it to `($x)=1..20` anyway, so `( $x, ㅤ() )` would just look like a code smell.

So, personally, I'm not worried. There's enough you can do if you own `BadModule` and I `use BadModule` that throwing `ㅤ()` into this is the least of my worries, especially knowing that `before`, `after` and `around` can redefine _so_ _much_ of the functionality I expect. I see this as a non-issue, but one that could be caught with git hooks and regular expressions. Maybe I should write a Perl::Critic module for this?

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
