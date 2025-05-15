---
layout: post
title: "Decreasing Order, Oddly: Weekly Challenge #321"
author: "Dave Jacoby"
date: "2025-05-15 16:51:07 -0400"
categories: ""
---

Welcome to [_**Weekly Challenge #321**!_](https://theweeklychallenge.org/blog/perl-weekly-challenge-321/) **321** is **3 * 107** and a [Delannoy number](https://en.wikipedia.org/wiki/Delannoy_number). It is also a series of descending digits, `3,2,1`, and an odd number.

### Task 1: Distinct Average

> Submitted by: Mohammad Sajid Anwar  
> You are given an array of numbers with even length.
>
> Write a script to return the count of distinct average. The average is calculate by removing the minimum and the maximum, then average of the two.

#### Let's Talk About It

We are given an array of numbers with even length, but with no guarantee of order. We _could_ write `remove_min` and `remove_max`, or we could `sort` it numerically and `pop` and `shift`. This also means we can go with `while`, using the destruction of the list to signal the end.

Average is `sum / count`, so that's easy. We only want to know how many distinct averages there are, not how many pairs make each average, so we put them into a hash and count the keys at the end.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

my @examples = (

    [ 1, 2, 4, 3, 5, 6 ],
    [ 0, 2, 4, 8, 3, 5 ],
    [ 7, 3, 1, 0, 5, 9 ],
);

for my $example (@examples) {
    my $str    = join ', ', $example->@*;
    my $output = distinct_average( $example->@* );
    say <<"END";
    Input:  \$str = ($str)
    Output: $output
END
}

sub distinct_average(@ints) {
    # we're given an unsorted array but sorted would be more useful
    # and we lose nothing
    @ints = sort { $a <=> $b } @ints;
    my %output;
    # we remove the highest and lowest (first and last)
    # elements from a list, average them, and add the values
    # to a hash
    while ( @ints ) {
        my $min = shift @ints;
        my $max = pop @ints;
        my $avg = ( $min + $max ) / 2;
        $output{$avg}++;
    }
    # we don't care about how many times each get used,
    # merely the count
    return scalar keys %output;
}
```

```text
$ ./ch-1.pl 
    Input:  $str = (1, 2, 4, 3, 5, 6)
    Output: 1

    Input:  $str = (0, 2, 4, 8, 3, 5)
    Output: 2

    Input:  $str = (7, 3, 1, 0, 5, 9)
    Output: 2
```

### Task 2: Backspace Compare

> Submitted by: Mohammad Sajid Anwar  
> You are given two strings containing zero or more #.
>
> Write a script to return true if the two given strings are same by treating # as backspace.

#### Let's Talk About It

Consider the first string in the second example: `ab##`. If we did a global search, that would get `b#`, but removing that substring would leave `a#`. We need a repeating solution, so `while (match) { replace }`.

And because I wanted to do that one place, I put it in `remove backspaces`.

From there, it's a ternary operator returning `'true'` and `'false'` based on string equality.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use List::Util qw{ sum0 };

my @examples = (

    {
        str1 => "ab#c",
        str2 => "ad#c"
    },
    {
        str1 => "ab##",
        str2 => "a#b#"
    },
    {
        str1 => "a#b",
        str2 => "c"
    },
);

for my $example (@examples) {
    my $output = backspace_compare( $example );
    say <<"END";
    Input:  \$str1 = "$example->{str1}"
            \$str2 = "$example->{str2}"
    Output: $output
END
}

sub backspace_compare ($obj) {
    my $str1 = $obj->{str1};
    my $str2 = $obj->{str2};
    my $back1 = remove_backspaces($str1);
    my $back2 = remove_backspaces($str2);
    return $back1 eq $back2 ? 'true' : 'false';
}

sub remove_backspaces ( $str ) {
    while ( $str =~ /\w\#/mx ){
        $str =~ s/(\w\#)//mx;
    }
    return $str;
}
```

```text
$ ./ch-2.pl 
    Input:  $str1 = "ab#c"
            $str2 = "ad#c"
    Output: true

    Input:  $str1 = "ab##"
            $str2 = "a#b#"
    Output: true

    Input:  $str1 = "a#b"
            $str2 = "c"
    Output: false
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
