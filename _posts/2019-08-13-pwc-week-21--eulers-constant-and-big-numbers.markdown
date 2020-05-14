---
layout: post
title: "PWC Week 21 - Euler's Constant and Big Numbers"
author: "Dave Jacoby"
date: "2019-08-13 17:28:05 -0400"
categories: ""
---

[Perl Weekly Challenge, Week 21, Task 1](https://perlweeklychallenge.org/blog/perl-weekly-challenge-021/)

> Write a script to calculate the value of e, also known as Euler’s number and Napier’s constant. Please checkout [wiki](<https://en.wikipedia.org/wiki/E_(mathematical_constant)>) page for more information.

Ok, so how do we do that?

> It is approximately equal to **2.71828**, and is the **limit of (1 + 1/n)n as n approaches infinity**...

They have it to trillions of digits, but we need to do better than five significant digits.

So, we proceed with **the simplest thing that could possibly work.**

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ fc postderef say signatures state switch unicode_strings };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

my $i = $ARGV[0];
$i //= 49;
$i += 0;    # force error if $i is non-numeric

my $n = 2**$i;
my $e = find_euler($n);

say <<"END";
    i = $i
    n = $n
    e = $e

END
exit;

sub find_euler ( $n ) {
    return ( ( 1 + ( 1 / $n ) )**$n );
}
```

```text
$ ./euler.pl 48
    i = 48
    n = 281474976710656
    e = 2.71828182845904

$ ./euler.pl 49
    i = 49
    n = 562949953421312
    e = 2.71828182845904

$ ./euler.pl 50
    i = 50
    n = 1.12589990684262e+15
    e = 2.71828182845904

$ ./euler.pl 51
    i = 51
    n = 2.25179981368525e+15
    e = 2.71828182845904

$ ./euler.pl 52
    i = 52
    n = 4.5035996273705e+15
    e = 2.71828182845905

$ ./euler.pl 53
    i = 53
    n = 9.00719925474099e+15
    e = 1
```

After 2<sup>49</sup>, Perl 5 will not give a representation of the number that's not rounded into scientific notation. As the wiki page gives us the first 50 digits -- **2.71828182845904523536028747135266249** -- we see that 48-51 had the first 14 significant digits correct, 2<sup>52</sup> leaped over, and 2<sup>53</sup>...

I do not have a strong theory about what's going on with 2<sup>53</sup>.

So, **let's add some complexity.**

And by adding _some_ complexity, I mean the slightest bit.

`use [bigint](https://metacpan.org/pod/bigint);`

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ fc postderef say signatures state switch unicode_strings };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

use bigint;

my $i = $ARGV[0];
$i //= 49;
$i += 0;    # force error if $i is non-numeric

my $n = 2**$i;
my $e = find_euler($n);

say <<"END";
    i = $i
    n = $n
    e = $e

END
exit;

sub find_euler ( $n ) {
    return ( ( 1 + ( 1 / $n ) )**$n );
}
```

```text
$ ./euler.pl 48
    i = 48
    n = 281474976710656
    e = 1

$ ./euler.pl 49
    i = 49
    n = 562949953421312
    e = 1

$ ./euler.pl 50
    i = 50
    n = 1125899906842624
    e = 1

$ ./euler.pl 51
    i = 51
    n = 2251799813685248
    e = 1

$ ./euler.pl 52
    i = 52
    n = 4503599627370496
    e = 1
```

Whatever broke 2<sup>53</sup> before is now breaking everything, and there is no [bigfloat](https://metacpan.org/pod/bigfloat) to bail us out.

I mean, there _is_ [Math::BigInt](https://metacpan.org/pod/Math::BigInt) and it _is_ in [Core](https://perldoc.perl.org/index-modules-M.html), and I _have_ looked at it.

And I've looked on Perlmonks.

And I've looked for blog posts, hoping for a better in for the module than the synopsis.

But, instead, I'm thinking about saying `euler.pl 51` without using `bigint` being good enough, and

[![I'm Okay With This.](https://jacoby.github.io/images/imokay.png)](https://jacoby.github.io/images/imokay.png)

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
