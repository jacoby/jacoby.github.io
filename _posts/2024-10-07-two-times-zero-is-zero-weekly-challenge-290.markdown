---
layout: post
title: "Two Times Zero is Zero: Weekly Challenge #290"
author: "Dave Jacoby"
date: "2024-10-07 16:06:00 -0400"
categories: ""
---

Here we start [Weekly Challenge #290](https://theweeklychallenge.org/blog/perl-weekly-challenge-290/)

**290** is the telephone country code for [Saint Helena](https://en.wikipedia.org/wiki/Saint_Helena), a remote island in the South Atlantic Ocean where Napoleon Bonaparte spent his second exile. There's a video maker who made a [documentary discussing the creation of an airport on the island](https://www.youtube.com/watch?v=5-QejUTDCWw).

### Task 1: Double Exist

> Submitted by: Mohammad Sajid Anwar  
> You are given an array of integers, @ints.
>
> Write a script to find if there exist two indices $i and $j such that:
>
> 1. `$i != $j`
> 2. `0 <= ($i, $j) < scalar @ints`
> 3. `$ints[$i] == 2 \* $ints[$j]`

#### Let's Talk About It!

At first, I thought that point #1 was not particularly limiting, because it's a rare case where `$i == 2 * $1`, but then I remember that this is true when `$i == 0`, so it is a valid constraint.

Here I loop across the whole array twice. For larger data sets, starting the second loop at `$i + 1` and comparing `2 * $i == $j` as well as `2 * $j == $i` would get better performance, but at the sizes we're dealing with, that's not significant.

And as is common with these sort of things, it returns `true` when truth can be proved, and returns `false` at the end of the function once all the options have been tested.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use List::Util qw{ uniq };

my @examples = (

    [ 6, 2, 3, 3 ],
    [ 3, 1, 4, 13 ],
    [ 2, 1, 4, 2 ],
    [ 1, 1, 0 ],
    [ 1, 1, 0, 0 ],
);

# [ 1, 1, 0 ] is false, because 1 isn't 2 * 0
# [ 1, 1, 0, 0 ] is true, because 0 is 2 * 0

for my $example (@examples) {
    my $output = doubles_exist( $example->@* );
    my $input  = join ', ', $example->@*;
    say <<"END";
    Input:  \$ints = ($input)
    Output: $output
END
}

sub doubles_exist (@array) {
    for my $i ( 0 .. -1 + scalar @array ) {
        for my $j ( 0 .. -1 + scalar @array ) {
            next if $i == $j;
            my ( $ii, $jj ) = map { $array[$_] } $i, $j;
            return 'true' if $ii == 2 * $jj;
        }
    }
    return 'false';
}
```

```text
PS C:\Users\jacob\Documents\GitHub\perlweeklychallenge-club\challenge-290\dave-jacoby> .\perl\ch-1.pl
    Input:  $ints = (6, 2, 3, 3)
    Output: true

    Input:  $ints = (3, 1, 4, 13)
    Output: false

    Input:  $ints = (2, 1, 4, 2)
    Output: true

    Input:  $ints = (1, 1, 0)
    Output: false

    Input:  $ints = (1, 1, 0, 0)
    Output: true
```

### Task 2: Luhn’s Algorithm

> Submitted by: Andrezgz  
> You are given a string `$str` containing digits (and possibly other characters which can be ignored). The last digit is the payload; consider it separately. Counting from the right, double the value of the first, third, etc. of the remaining digits.
>
> For each value now greater than 9, sum its digits.
>
> The correct check digit is that which, added to the sum of all values, would bring the total mod 10 to zero.
>
> Return true if and only if the payload is equal to the correct check digit.
>
> It was originally posted on [reddit](https://www.reddit.com/r/coolguides/comments/1faosv9/a_cool_guide_on_how_to_validate_credit_card/?rdt=51254).

#### Let's Talk About It!

This is how we know a credit card number is valid, without going so far as to seeing if there's a specific card with this number. I think that checksums generally live lower on the stack than I normally work, because I don't see them in the client code I've dealt with, but it's a cool idea.

I'll highlight one constraint: **For each value now greater than 9, sum its digits.** That'll only be a worry when you're on the odd-numbered entries, but guess what? The sum of the digits of a single-digit number is that digit, so split and sum every number. I of course use `sum0` from [List::Util](https://metacpan.org/pod/List::Util). `sum` would work, but I like the behavior when you hit an empty list with `sum0` better.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use List::Util qw{sum0};

my @examples = (

    "17893729974",
    "4137 8947 1175 5904",
    "4137 8974 1175 5904",
);

for my $input (@examples) {
    my $output = luhns_algorithm($input);

    say <<"END";
    Input:  "$input"
    Output: $output
END
}

sub luhns_algorithm ($str) {
    $str =~ s/\D+//gmx;
    my @str     = split //, $str;
    my $payload = pop @str;
    my $x   = 0;
    my $sum = 0;
    for my $i ( reverse 0 .. -1 + scalar @str ) {
        my $d = $str[$i];
        $d *= 2 if $x % 2 == 0;
        my $e = sum0( split //, $d );
        $sum += $e;
        $x++;
    }
    return  ( ( ( ( $sum + $payload ) % 10 ) == 0 ) ? 'true' : 'false' );
}
```

```text
PS C:\Users\jacob\Documents\GitHub\perlweeklychallenge-club\challenge-290\dave-jacoby> .\perl\ch-2.pl
    Input:  "17893729974"
    Output: true

    Input:  "4137 8947 1175 5904"
    Output: true

    Input:  "4137 8974 1175 5904"
    Output: false

PS C:\Users\jacob\Documents\GitHub\perlweeklychallenge-club\challenge-290\dave-jacoby>
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
