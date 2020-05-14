---
layout: post
title: "FizzBuzz One-Liner In Perl"
author: "Dave Jacoby"
date: "2019-03-25 13:25:58 -0400"
categories: ""
---

**[The Challenge:](https://twitter.com/PerlWChallenge)**

> Write one-liner to solve FizzBuzz problem and print number 1-20.
> However, any number divisible by 3 should be replaced by the word fizz and any divisible by 5 by the word buzz. Numbers divisible by both become fizz buzz.

It's a common one, and [my all-time favorite solution](http://joelgrus.com/2016/05/23/fizz-buzz-in-tensorflow/) begins with:

```python
import numpy as np
import tensorflow as tf
```

But there's a word in there that changes everything.

**"one-liner"**

A one-liner is code that is typed in at the prompt, in the form `perl -e '[CODE GOES HERE]'`. It doesn't _have_ to be Perl -- for example try this with Node: `node -p '0.1 + 0.2'` -- but Perl borrowed a lot from `sed` and `awk`, which are meant to be used in this way.

This word brings me chills, because "one-liner" tends toward [Perl Golf](http://perlgolf.sourceforge.net/), and Perl Golf tends toward solutions that are oblique, indecypherable and unmaintainable.

> Everyone knows that debugging is twice as hard as writing a program in the first place. So if you're as clever as you can be when you write it, how will you ever debug it?
> -- [Brian Kernighan](https://en.wikiquote.org/wiki/Brian_Kernighan)

So, I asked for clarification, and no, we're wanting an elegant solution. Shub-Internet suggests _elegant_ means _(of a scientific theory or solution to a problem) pleasingly ingenious and simple_, so let's get simple!

```perl
#!/usr/bin/env perl
use strict;
use warnings;
for my $i ( 1 .. 20 ) {
    if ( $i % 3 == 0 && $i % 5 == 0 ) { print 'fizzbuzz' }
    elsif ( $i % 3 == 0 ) { print 'fizz' }
    elsif ( $i % 5 == 0 ) { print 'buzz' }
    else { print $i }
    print "\n";
}
```

Here we're not holding onto flags or anything. Just one variable, `$i`. I defend the elegance of this code because there's four cases: divisible by 3, divisible by 5, divisible by both, and divisible by neither.

This covers all four cases, but we can get simpler.

```perl
#!/usr/bin/env perl
use strict;
use warnings;
for my $i ( 1 .. 20 ) {
    if ( $i % 3 == 0 ) { print 'fizz' }
    if ( $i % 5 == 0 ) { print 'buzz' }
    if ( $i % 3 != 0 && $i % 5 != 0 ) { print $i }
    print "\n";
}
```

> **Quick Note:** `%` is `modulus`, which isn't a thing you're taught until you start with computing. It's basically `remainders`. Consider `10 / 3`, which equals `3.3333333...`. `10 % 3` is essentially `10 - (3*3)`, or `1`. `9 - (3 * 3)` is `0`. If you don't have a CS background, this makes up for a month of CS 101.

I don't like the `$i % $n == 0` test, and I think we can get better. I had tried `! $i % $n`, but that didn't behave for me, so I'm thinking **ternary** operators. For those who don't know, we can take:

```perl
if ( $i % 3 ) { print '' }
else { print 'fizz' }
```

and replace it with

```perl
print $i % 3 ? '':'fizz';
```

[This is not a Perlism; it exists in many languages.](https://en.wikipedia.org/wiki/%3F:)

> **Quick Note:** Here, we are playing with truth. Within conditionals, `false` means `0` and `true` means `not 0`. With `%3`, we can get the values `0`, `1`, and `2`, and both `1` and `2` count as `true`. That's another free week of CS 101, and a little bit of Boolean for PHIL 131 - Introduction to Logic.

Using the ternary operator, we can get down to:

```perl
#!/usr/bin/env perl
use strict;
use warnings;
for my $i ( 1 .. 20 ) {
    print $i % 3 ? '':'fizz';
    print $i % 5 ? '':'buzz';
    print $i % 3 && $i % 5 ? $i : '';
    print "\n";
}
```

That's ... okay, but still not something I would type out.

So we drop the strictures. I will not make a program that does not start out with `use strict; use warnings;` but one-liners are different. Those can be ejected, and with it, `my`. And, also, `$i`;

```bash
perl -e 'for (1..20) { print ; print "\n" }'
```

This gives us that range, because unless we designate a variable, it's `$_`. Read [`perlvar`](https://perldoc.perl.org/perlvar.html#SPECIAL-VARIABLES) for more details.

A thing to remember is that we're hitting on a point where both your shell and Perl have opinions about single-quotes and double-quotes. Perl allows you to replace `'foo'` with `q{foo}`, and `"bar"` with `qq{bar}`, but we won't be doing that here.

```bash
$ perl -e 'for (1..20) { print $_ % 3 ? "" : "fizz" ; print $_ % 5 ? "" : "buzz" ; print $_ % 3 && $_ % 5 ? $_ : "" ; print "\n" }'
1
2
fizz
4
buzz
fizz
7
8
fizz
buzz
11
fizz
13
14
fizzbuzz
16
17
fizz
19
buzz
```

I have been informed that `perl -E` gives you all the features that have been added during the time of Modern Perl, which in this case, would allow me to swap `print "\n"` with `say ""`, which I don't regard as a big difference. Good to know in the future, because I love `say`, but in this case, macht nicht.

If I was more of a code golfer, I could probably make that more terse, but as is, I think this is elegant and readable, which is as good as a one-liner can be.

Now, what can I do with `node -e`?

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
