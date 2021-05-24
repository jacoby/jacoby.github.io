---
layout: post
title: "Escape From The Infinite Loop: Perl Weekly Challenge #114"
author: "Dave Jacoby"
date: "2021-05-24 12:54:08 -0400"
categories: ""
---

I don't normally put much prefix commentary, barely enough to say that this is solving [Perl Weekly Challenge #114](https://perlweeklychallenge.org/blog/perl-weekly-challenge-114/) or whichever challenge we're on.

This time is different, because both challenges roughly take the form **Find the Next Integer That...**, and there's a common solution to both.

```perl
    while (1) {
        $n++;
        my $r = whatever($n);
        return $n if $r;
    }
```

`whatever()` is the test to see if $n is the next thing we're looking for. and `while (1)` is an infinite loop. We can trust that it will halt, because not only are there more numbers that contain the characteristic we're looking for, there are _infinite_ numbers containing that characteristic. Unless there aren't — we can't find the _next negative number_ by going higher — but those are not the problems we're looking for here.

And, of course, we start in with the incrementing, because we don't want to test against the number given, because it might return itself, and that's not _next_.

### TASK #1 › Next Palindrome Number

> Submitted by: Mohammad S Anwar  
> You are given a positive integer `$N`.
>
> Write a script to find out the next `Palindrome Number` higher than the given integer `$N`.

The _obvious_ thing is that scalars in Perl can behave like numbers _and_ strings, and so it's simple to reverse a number by using how you'd reverse a string. I would normally `join '', reverse split m{} $var` but TIL about `scalar reverse $var`, so I did that.

The _clever_ thing is that I add `0` to the result of the reversal, and this strips out the zero prefix, because, at that point, it thinks it's a string. The proper reversal of `89` is `98`, not `980`.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say state postderef signatures };
no warnings qw{ experimental };

my @list = ( 1234, 999 );
@list = @ARGV ? @ARGV : @list;

for my $n (@list) {
    my $p = next_palindrome($n);
    say <<"END";
    Input:  $n
    Output: $p
END
}

sub next_palindrome ( $n ) {
    while (1) {
        $n++;
        my $r = 0 + reverse_string($n);
        return $n if $n == $r;
    }
}

sub reverse_string ( $s ) {
    return scalar reverse $s;
}
```

```text
    Input:  1234
    Output: 1331

    Input:  999
    Output: 1001
```

### TASK #2 › Higher Integer Set Bits

> Submitted by: Mohammad S Anwar  
> You are given a positive integer `$N`.
>
> Write a script to find the next higher integer having the same number of 1 bits in binary representation as `$N`.

First important thing here is `sum0` from [List::Util](https://metacpan.org/pod/List::Util). OK, I should probably use `sum` instead of `sum0`, but there's a safety catch. `sum()` returns `undef`, while  `sum0()` returns `0`. When summing the digits of a binary number, you should have `1`s and `0`s and no empty strings, but I like to be sure.

Second thing is how to get that binary number in the first place, and that comes from `sprintf '%b', $var`. You of course get the list version by `split m{}`, and then `sum0` adds it all up. It's binary, so the zeros don't count. I'd have to flip the bits if we were looking for the same number of zeroes, and remember byte size and all that.

I remember thinking there's a third thing to mention, but between the prefix and the above two things I can't think of it. I think this is fairly straightforward code.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say state postderef signatures };
no warnings qw{ experimental };

use List::Util qq{sum0};

my @list = ( 12, 3 );
@list = @ARGV ? @ARGV : @list;

for my $n (@list) {
    my $h = hisb($n);
    say <<"END";
    Input:  $n
    Output: $h
END
}

sub hisb ( $n ) {
    my $m = $n;
    my $b = sum0 split m{}, sprintf '%b', $m;
    while (1) {
        $m++;
        my $d = sum0 split m{}, sprintf '%b', $m;
        return $m if $b == $d;
    }
}
```

```text
    Input:  12
    Output: 17

    Input:  3
    Output: 5
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
