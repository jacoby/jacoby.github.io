---
layout: post
title: "Using caller() and longmess() to find the Source of your Problems"
author: "Dave Jacoby"
date: "2020-04-06 19:57:17 -0400"
categories: ""
---

### Let us begin

Code bases come in different types. The one I worked with before included inner loops of thousands of lines and functions with no input and no output, so all effects are side effects. The thing to say about that is that you can forget what means what and what goes where, but you always know where you are.

On the other end of the spectrum is code that uses modules, with short functions that call short functions that call short functions in another module that call short functions in another module and so on. In this situation, you can search for an error message or output string and find the function where you need to work, but you don't know where it connects to the rest.

My dive into this started with wondering if you can find the name of the current function, and [https://stackoverflow.com/a/2559821](StackOverflow) repeated the answer that [_Perl Cookbook_](https://www.oreilly.com/library/view/perl-cookbook/1565922433/ch10s05.html) gave, which is `caller()`.

Specifically,

```perl
$this_function = (caller(0))[3];
```

But you'll notice that I mentioned `caller()` and the example code mentions `caller(0)`. There's a reason for that. Or a few.

```perl
sub func_f() {
    say join "\n", '||', map { defined ? $_ : 'UNDEFINED'  } caller();
    say join "\n", '||', map { defined ? $_ : 'UNDEFINED'  } caller(0);
    say join "\n", '||', map { defined ? $_ : 'UNDEFINED'  } caller(1);
}
```

```text
||  # caller(), showing function name, package
    # and line number where function was called
        main
        ./ctest.pl
        18
||  # caller(0), adding the function name (mail::func_f),
    # wantarray (whether it was called asking for an
    # array to be returned -- well worth knowing),
    # evaltext and is_require (relating to it being
    # an eval block and not a proper function), hints,
    # bitmask and hinthash. I will have to look into
    # what hints are
        main
        ./ctest.pl
        18
        main::func_f
        1
        UNDEFINED
        UNDEFINED
        UNDEFINED
        478283490
        UUUUUUUUUUUU@T
        HASH(0x7ff4ae0d7778)
||  # caller(1). This is that same full treatment, except
    # showing the function that called it. Are you thinking
    # what I'm thinking?
        main
        ./ctest.pl
        17
        main::func_e
        1
        UNDEFINED
        UNDEFINED
        UNDEFINED
        478283490
        UUUUUUUUUUUU@T
        HASH(0x7ff4ae01cb68)
```

### I Get Deep

What I am thinking is _"Hey, you can just iterate until you see `undef` and take it down to the start!"_

```perl
package Caller;

use strict;
use warnings;
use Exporter qw{import};
our @EXPORT = qw{ wai };

sub wai {
    my $d = 0;
    while ( $d < 20 ) {
        my ( $package, $file, $line, $func ) = caller($d);
        return if !defined $line;
        say STDERR join "\n\t", qq{Depth: $d}, $package, $file, $line, $func;
        $d++;
    }
}

1
```

`wai` means **"Where am I?"**, if somehow the codebase I'm working with has more than 20 levels of indirection, I'll give up and become a lumberjack, leaping from tree to tree as they float down the mighty rivers of British Columbia!

But we'll want to use that `Caller` module somewhere, and let's put it in another module, so we can have fun with levels.

```perl
package DaveTest;

use strict;
use warnings;

use Carp qw{ longmess shortmess };
use Exporter qw{import};

use lib './lib';
use Caller;

our @EXPORT = qw{ dt };

sub dt {
    my $string = longmess( ( caller(0) )[3] );
    print STDERR qq{$string\n};
    wai();
}

1
```

(There's a spoiler there. Wait for it.)

And to bring it back to main:

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings qw{ experimental };

use lib './lib';
use DaveTest;

func_a();

sub func_a() { func_b() }
sub func_b() { func_c() }
sub func_c() { func_d() }
sub func_d() { func_e() }
sub func_e() { func_f() }

sub func_f() {
    dt();
}
```

Lots and lots of layers here to play with, and here's how the stack up:

```text
Depth: 0
        DaveTest
        lib/DaveTest.pm
        17
        Caller::wai
            # wai() is called on line 17 of lib/DaveTest.pm
            # in the DaveTest package
Depth: 1
        main
        ./ctest.pl
        21
        DaveTest::dt
            # dt() is called on line 21 of ctest.pl
            # in main
Depth: 2
        main
        ./ctest.pl
        18
        main::func_f
            # and so on, until
Depth: 3
        main
        ./ctest.pl
        17
        main::func_e
Depth: 4
        main
        ./ctest.pl
        16
        main::func_d
Depth: 5
        main
        ./ctest.pl
        15
        main::func_c
Depth: 6
        main
        ./ctest.pl
        14
        main::func_b
Depth: 7
        main
        ./ctest.pl
        12
        main::func_a
            # func_a() is called on line 12 of ctest.pl
```

I mentioned _spoilers_ earlier. Those spoilers are about [`Carp`](https://metacpan.org/pod/Carp), and the exportable functions `longmess` and `shortmess`.

`longmess` tells us:

```text
DaveTest::dt at ./ctest.pl line 21.
        main::func_f() called at ./ctest.pl line 18
        main::func_e() called at ./ctest.pl line 17
        main::func_d() called at ./ctest.pl line 16
        main::func_c() called at ./ctest.pl line 15
        main::func_b() called at ./ctest.pl line 14
        main::func_a() called at ./ctest.pl line 12
```

which more concise but omits the package data. I used the _Cookbook_ example of `(caller(0))[3]` to get `DaveTest::dt` into this text; `longmess()` puts your input into the beginning of that list, so `longmess('a silly string')` would return:

```text
a silly string at ./ctest.pl line 21.
        main::func_f() called at ./ctest.pl line 18
        main::func_e() called at ./ctest.pl line 17
        main::func_d() called at ./ctest.pl line 16
        main::func_c() called at ./ctest.pl line 15
        main::func_b() called at ./ctest.pl line 14
        main::func_a() called at ./ctest.pl line 12
```

So combining `caller()` and `longmess()` gives you a very useful thing.

If your codebase has grown to such an extent, that is.

**Note:** I use _function_ and _subroutine_ interchangeably. There's a distinction that some might find important, but I don't really, in most cases.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
