---
layout: post
title: "Middle Digits to Validation: The Weekly Challenge #135"
author: "Dave Jacoby"
date: "2021-10-18 18:59:33 -0400"
categories: ""
---

And here we are again, in [The Weekly Challenge #135](https://theweeklychallenge.org/blog/perl-weekly-challenge-135/)

### TASK #1 › Middle 3-digits

> Submitted by: Mohammad S Anwar  
> You are given an integer.
>
> Write a script find out the middle 3-digits of the given integer, if possible otherwise throw sensible error.

What do we get from the instructions?

- We drop all non-digit characters right off the bat, because these are collections of _digits_ not _numbers_. `-123` is a number, sure, but `-` is _not_ a digit. Similarly, `123.45` would become `12345` before the next step.
- And that next step is _no fudging!_ The middle 3, so there must be a middle 3, so there must be an odd number of digits. This is crucial.
- More crucial than there being enough digits to find 3, because `10` gets rejected not because **too short** but because it has **even number of digits**.

This gives us an order of operations. Get rid of those non-digit characters first. On that result, check for evenness, then check for length. After that, we then remove beginning and ending digits. I keep the value a scalar and do `subst $v, 0, 1 = ''` and `subst $v, -1, 1 = ''` until the size is right. The first obvious alternative is to convert to an array, then `shift` and `pop` until everything is as we want it. There must be other ways, but I can't think of any quick-and-easy solutions.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say state postderef signatures };
no warnings qw{ experimental };

my @examples = qw{
    1234567
    -123
    1
    10
};

for my $i (@examples) {
    my $o = middle_3($i);
    say <<"END";
    Input: \$n = $i
    Output: $o
END
}

sub middle_3 ( $n ) {
    $n =~ s/\D//gmx;
    my $s = length $n;
    return 'even number of digits' if ( $s % 2 ) == 0;
    return 'too short'             if $s < 3;
    while ( length $n > 3 ) {
        substr( $n, 0,  1 ) = '';
        substr( $n, -1, 1 ) = '';
    }
    return $n;
}
```

```text
    Input: $n = 1234567
    Output: 345

    Input: $n = -123
    Output: 123

    Input: $n = 1
    Output: too short

    Input: $n = 10
    Output: even number of digits
```

### TASK #2 › Validate SEDOL

> Submitted by: Mohammad S Anwar  
> You are given 7-characters alphanumeric SEDOL.
>
> Write a script to validate the given SEDOL. Print 1 if it is a valid SEDOL otherwise 0.
>
> For more information about SEDOL, please checkout the [wikipedia](https://en.wikipedia.org/wiki/SEDOL) page.

I think linking to Wikipedia was a mistake here, because one of the first things it has is a Javascript solution taken from [Rosetta Code](http://rosettacode.org/wiki/SEDOLs), next to a link to it. Rather than reading it like a plain-text specification, it starts being "How do I do _that_ in Perl?" or whatever your language of choice is.

So, let's look at some things.

It's said the characters in a SEDOL numbers can contain digits or uppercase letters, but no vowels. The JS code writes all the letters out, but I think it's easier to read `/^[0-9A-Z]{6}$/ && ! /[AEIOU]/`. For anyone less experienced with regular expressions:

- `[0-9A-Z]` is a character class containing either a digit or an uppercase number
- adding the curly brackets gives us `[0-9A-Z]{6}`, meaning we want six characters, not just one
- The carot in front and dollar in back — `^[0-9A-Z]{6}$/` — mean we want it to start and end with those six, with nothing else
- and we're matching, which gives us a boolean, which we can negate, like we do with the class of vowels: `!/[AEIOU]/`. I do not think there's quick-and-easy way to fill a character class with vowels, but there are only five, so eh.

We're multiplying by preset factors, which we fill into an array. We're comparing positions, so we use an index. `for my $i (0..5)` instead of `for my $v (@sebol)`, for example. Each of the digits we're pulling are base36, and the removal of vowels could simply to keep the system from generating rude words. The dirty way to convert to base36 from base10 would be akin to:

```perl
    # assuming $i < 36
    my @chars = (0..9,'A'..'Z');
    return $chars[$i];
```

But we're kinda doing the reverse, so instead:

```perl
    # for one charachter/digit; this would be more
    # complex for multiple charactrers
    my @chars = (0..9,'A'..'Z');
    for my $i ( 0..35 ) {
        return $i if $c eq $chars[$i];
    }
    return -1
```

(If I was going to use this _for real_, I would be wanting to use [Math::Int2Base](https://metacpan.org/pod/Math::Int2Base), but I would also be tempted to use [Business::SEDOL](https://metacpan.org/pod/Business::SEDOL) as well. I mean, if we have a perfectly round wheel, why invent your own?)

And, finally, the check. I don't think I see check digits all that much in newer protocols, because there's error-checking built into the fundamental things these are built on, but this is an old protocol that people's finances rely on, so it works out.

A SEDOL number is 6 digits, which are then run through a bunch of work to get the seventh, which is the check. If any digit is changed, it will no longer match.

> The character values are multiplied by the weights. The check digit is chosen to make the total sum, including the check digit, a multiple of 10, which can be calculated from the weighted sum of the first six characters as (10 − (weighted sum modulo 10)) modulo 10.

And, suddenly I'm _glad_ I'm seeing the code instead of having to parse it.

> `var check = (10 - sum%10) % 10;`

which I turn into

> `my $end = ( 10 - $sum % 10 ) % 10;`

using `$end` because it made sense to me for `$check` to hold the check value.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures };
no warnings qw{ experimental };

my @examples = qw{
    2936921
    1234567
    B0YBKL9
    A0YBKL9
    0263494
};

for my $i (@examples) {
    my $o = validate_sedol($i);
    say <<"END";
    Input: \$sedol = '$i'
    Output: $o
END
}

sub validate_sedol($n) {
    my @weight = ( 1, 3, 1, 7, 3, 9, 1 );
    my $sebol  = substr $n, 0,  6;
    my $check  = substr $n, -1, 1;

    # they can contain letters and numbers,
    # but not vowels. Done with two regexes
    # because otherwise is long and ugly.
    if ( $sebol =~ /^[0-9A-Z]{6}$/mx && $sebol !~ /[AEIOU]/mx ) {
        my $sum = 0;
        for my $i ( 0 .. 5 ) {
            my $w = $weight[$i];
            my $s = substr $n, $i, 1;
            my $c = to10($s);    # from base36 to base10
            $sum += ( $w * $c );
        }
        my $end = ( 10 - $sum % 10 ) % 10;
        return 1 if $end eq $check;
    }
    return 0;
}

sub to10 ( $b36 ) {
    my @s = ( 0 .. 9, 'A' .. 'Z' );
    for my $i ( 0 .. 35 ) {
        if ( $s[$i] eq $b36 ) {
            return $i;
        }
    }
    return -1;
}
```

```text
    Input: $sedol = '2936921'
    Output: 1

    Input: $sedol = '1234567'
    Output: 0

    Input: $sedol = 'B0YBKL9'
    Output: 1

    Input: $sedol = 'A0YBKL9'
    Output: 0

    Input: $sedol = '0263494'
    Output: 1
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
