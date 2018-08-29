---
layout: post
title: "Use Perl Features: lexical_subs"
author: "Dave Jacoby"
date: "2018-08-29 10:10:36 -0400"
categories: perl
---

[Previously, I explained my Perl boilerplate](https://jacoby.github.io/perl/2018/08/28/how-i-write-perl-boilerplate-and-signatures.html), including the `features` I use.

Thing is, [that isn't every feature](https://metacpan.org/pod/feature), so I became curious about the features that I don't `use`.

The first one I played with is `lexical_subs`. This gives us `my sub foo {}`, `state sub foo {}` and `our sub foo {}`.

And I wondered what use is this for.

[Andy Lester](https://twitter.com/petdance) gave me that reason.

Imagine you have a module, called `My::Examples.pm`, because creativity is wasted on example code. It could look like this:

```perl
package My::Examples;
use strict;
use warnings;
use feature qw{ say signatures };
no warnings qw{ experimental::signatures };
use Exporter qw{ import };
our @EXPORT = qw{ mysub };

sub _mangle_stuff ( $v )  { return qq{1 $v} }
sub _mangle_stuff2 ( $v ) { return qq{2 $v} }
sub mysub ( $x ) {
    say _mangle_stuff($x);
    say _mangle_stuff2($x);
}
1;
```

I cut down the code for readability, but essentially, you have two private subroutines (`_mangle_stuff()` and `_mangle_stuff2()`) and one public subroutine (`mysub()`), that is exported and used in the standard manner.

But private subroutines are private by convention, not by code. `mysub()` is in the symbol table, but you can get to `_mangle_stuff()` as `&My::Examples::_mangle_stuff()`.

This is where `lexical_subs` comes in.

```perl
package My::Examples;
use strict;
use warnings;
use feature qw{ say signatures };
no warnings qw{ experimental::signatures };
use Exporter qw{ import };
our @EXPORT = qw{ mysub };

my sub _mangle_stuff ( $v ) { return qq{1 $v} }
sub _mangle_stuff2 ( $v )    { return qq{2 $v} }
sub mysub ( $x ) {
    say _mangle_stuff($x);
    say _mangle_stuff2($x);
}
1
```

`_mangle_stuff()` scoped within `My::Examples`, meaning it does not exist outside it. So `mysub('Turtle');` gets you this in STDOUT.

```text
1 Turtle
2 Turtle
```

But if you go for the constituent parts ...

```perl
use feature qw{ say };
use Try::Tiny;
use My::Examples;

try { say &My::Examples::_mangle_stuff('Rickover'); }
catch { say 'Fail Rickover' };

try { say &My::Examples::_mangle_stuff2('South Dakota'); }
catch { say 'Fail SD' };
```

Gets you this:

```text
Fail Rickover
2 South Dakota
```

But while I'm thinking about subs and scopes and access, let me bring in two words.

`local` and [Monkey-Patching](https://davidwalsh.name/monkey-patching).

The derivation of the _monkey_ part of _monkey-patching_, we think, is _guerilla_ > _gorilla_ > _monkey_. The _patching_ part is standard: changing software.

`local` is an older thing that, most of the time is best replaced by `my`. The point where it isn't is when it _temporarily_ replaces existing variables. For example, when you `print @array`, it essentially does `print join $, , @array`, because `$,`, AKA `$OUTPUT_FIELD_SEPARATOR`. You can't do `my $, = '-'`, because `$,` exists, but you can do `local $, = '-'`.

```perl
my @array = 1..4;
say @array;     # 1234
local $, = '-',
say @array;     # 1-2-3-4
```

We can straight-up replace a module sub:

```perl
*My::Examples::_mangle_stuff2 = sub ($v) {
    return qq{Mangled2: $v};
};

mysub('Turtle');

# 1 Turtle
# Mangled2: Turtle
```

But we can also do it temporarily:

```perl
mysub('Los Angeles');
{
    # we handle Russian subs differently
    local *My::Examples::_mangle_stuff2 = sub ($v) {
        return qq{Mangled In Russian: $v};
    };
    mysub('Red October');
}
mysub('Nautilus');

# 1 Los Angeles
# 2 Los Angeles
# Subroutine My::Examples::_mangle_stuff2 redefined # at ./test.pl line 35.
# 1 Red October
# Mangled In Russian: Red October
# 1 Nautilus
# 2 Nautilus
```

But, while we can create _a_ `&My::Examples::_mangle_stuff`, we cannot get to _the_ `My::Examples::_mangle_stuff`

```perl
mysub('Los Angeles');
{
    # we handle Russian subs differently
    local *My::Examples::_mangle_stuff = sub ($v) {
        return qq{Mangled In Russian: $v};
    };
    mysub('Red October');
}
mysub('Nautilus');

# 1 Los Angeles
# 2 Los Angeles
# 1 Red October
# 2 Red October
# 1 Nautilus
# 2 Nautilus
```

This means the private sub `_mangle_stuff()` is really private.

If keeping your application devs out of your module devs' toys is a thing you have to do, though, that's a problem. For me, getting my teams to work together is simply me deciding that this is a thing I want to use or not. I rarely want to change the behavior of CPAN modules and I have write permission to everything else.

This means I have no reason to do this. It's neat to know **Perl Can Do That!!!**, but if I'm in a position where I have to work this hard to protect my module code from my users, I think I should work on my resume.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
