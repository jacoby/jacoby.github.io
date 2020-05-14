---
layout: post
title: "Computers Are A Mistake"
author: "Dave Jacoby"
date: "2019-09-19 15:25:07 -0400"
categories: ""
---

[From Twitter: ![@shiekhgray: My fiance just sent me a code snippet of a function that returns a function that returns a ternary that returns two different functions depending...computers are a mistake.](https://jacoby.github.io/images/mistake.png) ](https://twitter.com/shiekhgray/status/1174731837148737536)

That's me with the Ian Malcolm wisdom, and that made me think.

In fact, I took it as a challenge.

I'm taking "returns a ternary" as meaning the ternary determines what function it returns.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say };
no warnings qw{ experimental::postderef };

my $comment = <<'END';
    My fiance just sent me a code snippet of a function 
    that returns a function 
    that returns a ternary 
    that returns two different functions depending...
    computers are a mistake.

END

my $function = sub {
    say 'outer';
    return sub {
        my $key = shift;
        say qq{SECOND: $key};
        $key //= 1;
        return $key % 2 == 0
            ? sub { say 'first' }
            : sub { say 'last' }
    }
};

my $x = $function->();
my $y = $x->( int rand 10 );
my $z = $y->();
```

Yes, computers were a mistake.

Yes, so were digital watches.

Yes, it was probably a mistake to get down from the trees.

But we're here, so we might as well enjoy it.

Should I try again in Javascript?

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
