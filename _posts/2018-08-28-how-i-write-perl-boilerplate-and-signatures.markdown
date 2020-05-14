---
layout: post
title: "How I Write Perl: Boilerplate and Signatures"
author: "Dave Jacoby"
date: "2018-08-28 10:33:20 -0400"
categories: perl
---

First: Wikipedia, tell us what ["Boilerplate Text"](https://en.wikipedia.org/wiki/Boilerplate_text) is. Everybody got it? Good.

My Perl programs, the ones I write now, and, unless it breaks a thing, the stuff that I pull up and modify, all start with this.

```perl
#!/usr/bin/env perl
use strict ;
use warnings ;
use utf8 ;
use feature qw{ postderef say signatures state } ;
no warnings qw{ experimental::postderef experimental::signatures } ;
```

The [hashbang](<https://en.wikipedia.org/wiki/Shebang_(Unix)>) is a thing I pulled from a Python program, and what you get from it is, instead of hardcoding system Perl (`/usr/bin/perl`), it pulls whichever Perl is the first in your path. This could be system perl, or one you compiled yourself, our your group's official version.

`use strict` and `use warnings` are two of the keys to Modern Perl. What are they? Well, Perl has, by default, a wildly dynamic nature, where this is a valid first use of the variable `$foo`:

```perl
$foo = 1 ;
```

Let us throw context here. Yes, `$foo` is a common [metasyntactic variable](https://en.wikipedia.org/wiki/Metasyntactic_variable) — "I need a variable and I don't care what I call it; I'll just choose _foo_ — but let's pretend this relates to your travel plans, saying if a meal should be provided, and should have been `$food`. You have created a new variable by misspelling an old variable, and it is valid. If you `use strict`, you get this error:

```text
Global symbol "$foo" requires explicit package name (did you forget to declare "my $foo"?) at ./test.pl line 10.
Execution of ./test.pl aborted due to compilation errors.
```

`warnings` go a little deeper. Instead of operator overloading, Perl overloads the variables. Unlike, for example, Javascript, where two strings are concatenated with `+`, Perl uses that just for mathematical addition, but will find a numerically allowable take on a string and use that, so `"23" + 1` will be 24, and `"a" + 1` is NaN thus 0 plus one, so one. But "a" in math is probably not what you want, so Perl warns you:

```text
Argument "a" isn't numeric in addition (+) at ./test.pl line 10.
```

`use utf8` means that the internal variable representation mentioned in warnings has strings as UTF-8 instead of ASCII. [There is much more to `utf8` than I ever use](https://metacpan.org/pod/utf8), but I always put it in my programs. 🤷

`use feature` turns on a number of features. You can use them, but without those features, your Perl will still work for the ancient program your work relies on. The ones I use:

- **say:** Time was, if you wanted a newline, you would have to print `"\n"`, and if your string was not to be interpreted, `print 'like this'`, you would have to have it be an interpreted, double-quote string `print "like this\n"` so Perl could handle the newline, or do `print 'like this' . "\n"`, and isn't appending newlines just always ugly? I still have reason to `print`, but 99% of my output is done with `say`.
- **state:** I use this rarely, but it is occasionally useful. Say we wanted an iterator function, where each time it is called, it returns the next digit. This — `sub iterator { my $x = 1 ; return $x++ }` — would not work, but would instead just return 2. You could use lexical scoping — `{ my $x = 1 ; sub iterator { return $x++ } }` — but that's double the curly quotes. Using state — `sub iterator { state $x = 1 ; return $x++ }` — and `$x` will retain value between calls.
- **postderef:** This is a thing I like and use, but I really get where people don't. Between [YAML](https://metacpan.org/pod/YAML), [JSON](https://metacpan.org/pod/JSON) and [DBI](https://metacpan.org/pod/DBI), I get and use a lot of references, and I'm much more likely to create a hashref than a hash, or an arrayref for an array. If I want to use `$hashref`, it used to be `keys %{$hashref}`, and it could get worse if it's really `$data->{hashref}` you want the keys for. I find `keys $data->{->%*` and `$arrayref->@*` very readable, and that keeps it in a way that `$json->encode($arrayref)` doesn't complain about.
- **signatures:** This is mostly another readability thing. Take this function: `sub squared { my $number = shift @_ ; return $number ** 2 }` (Example code doesn't have to be a smart thing to write, it just has to make a point.) Most languages would put `$number` in the function definition, and that's what `signatures` gives us: `sub squared ( $number )){ return $number ** 2 }`

Both **signatures** and **postderef** are new, and as such, they currently carry warnings about their use, although I cannot coerce the postderef warning right now.

```text
The signatures feature is experimental at ./test.pl line 15.
```

A little more on signatures (I have to justify putting them in the title). It does a little more than just keeping you from having to shift out of `@_`. I don't like long argument lists, because then you start getting problems with forgetting order — "Is it `mysub( $foo, $bar, $blee, $quuz)` or `mysub( $foo,$bar, $quuz, $blee)`?" — which is another argument for using hashrefs and calling `$ref->{foo}` inside, but if you have a small number (three or less), you can have a manageable set of signatures.

```perl
sub mysub ( $foo, $bar=1 , $blee='armada' , $quuz='fmep') { ... }
```

This auto-sets lexical scope, so that the `$foo` inside `mysub()` is not the same as the `$foo` outside. Also, it presets initial variables, so `$bar` is 1 for `mysub('foo')` but 21 for `mysub('foo',21)`. It also ensures that all arguments are there: if I try `mysub()`, I get:

```text
Too few arguments for subroutine 'main::mysub' at ./test.pl line 34.
```

You _could_ do a lot of that without signatures...

```perl
sub mysub {
    my ( $foo, $bar, $blee, $quuz ) = @_;
    croak 'too few arguments' unless defined $foo;
    $bar  = defined $bar  ? $bar  : 1;
    $blee = defined $blee ? $blee : 'armada';
    $quuz = defined $quuz ? $quuz : 'fmep';
}
```

But don't you find that verbose and ugly? I'd rather get as quickly as I can to the details that matter.

*Note:*
[@bokutin](https://twitter.com/bokutin) asked about `//=`. I admit that this is an operator I hardly use and never remember. The above non-signature sub would be better written as:

```perl
sub mysub {
    my ( $foo, $bar, $blee, $quuz ) = @_;
    croak 'too few arguments' unless defined $foo;
    $bar  //= 1;
    $blee //= 'armada';
    $quuz //= 'fmep';
}
```

I agree, that's better. I still like signatures.

That is my standard Perl boilerplate. I have a number of go-to modules, which I'll get into in another blog post, but this is a code block I use for everything. If you have suggestions for different cool features to start using, like `lexical_subs`, I'd be glad to know how you use them.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
