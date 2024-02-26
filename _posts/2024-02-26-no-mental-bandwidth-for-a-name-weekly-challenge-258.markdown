---
layout: post
title: "No Mental Bandwidth For A Name: Weekly Challenge #258"
author: "Dave Jacoby"
date: "2024-02-26 11:15:38 -0500"
categories: ""
---

[**Welcome to Weekly Challenge #258!**](https://theweeklychallenge.org/blog/perl-weekly-challenge-258/)

I'm working on a lot of things and can't work up the creativity to come up with the facts about **258** today. Incidentally, if you're looking for an experience Perl guy, ways to contact me are listed below.

### Task 1: Count Even Digits Number

> Submitted by: Mohammad Sajid Anwar
> You are given a array of positive integers, @ints.
>
> Write a script to find out how many integers have even number of digits.

#### Let's Talk About It

I wasn't trying to "victory lap" this one, really, but on first glance, I had this. 

Perl variables are simultaneously strings and numbers. We use variable overloading, not operator overloading, so if you do a math thing on a string, Perl will find the most number-y take on that variable, and if you do a string thing, it'll treat it as such.

If you want to find the length of a string, use `length`.

If you want to find an even number, use modulus, or `%`.

If you want to only pass only the number with an even number of digits, use `grep { ( length $_ ) % 2 == 0 }`. The parentheses are important because otherwise, it'll try to get the length of `$_ % 2 `.

If you want to find the length of an array, use `scalar`.

So, `scalar grep { ( length $_ ) % 2 == 0 }`. You could probably golf that down a lot, but to me, this is the minimal readable size of this solution.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @examples = (

    [ 10,  1, 111, 24, 1000 ],
    [ 111, 1, 11111 ],
    [ 2,   8, 1024, 256 ],
);

for my $example (@examples) {
    my $output = scalar grep { ( length $_ ) % 2 == 0 } $example->@*;
    my $ints   = join ', ', $example->@*;

    say <<~"END";
    Input:  \@ints = ($ints)
    Output: $output
    END
}
```

```text
$ ./ch-1.pl 
Input:  @ints = (10, 1, 111, 24, 1000)
Output: 3

Input:  @ints = (111, 1, 11111)
Output: 0

Input:  @ints = (2, 8, 1024, 256)
Output: 1
```

### Task 2: Sum of Values

> Submitted by: Mohammad Sajid Anwar
> You are given an array of integers, @int and an integer $k.
>
> Write a script to find the sum of values whose index binary representation has exactly $k number of 1-bit set.

#### Let's Talk About It

I use `sprintf` a fair amount, as an easy way to left-pad numbers and a way to cut long floating point numbers to a more usable set of significant digits, but it also, with `'%b'`, converts a number to binary. 

`split //` splits between every character, so combining them turns `5` into `[1,0,1]`.

[List::Util](https://metacpan.org/pod/List::Util) has `sum0`, but I suppose I could've nodded to the previous task and written `scalar grep { $_ == 1 }` instead. Alas.

I could do it in a more functional way. I actually wrote it.

```perl
return sum0 map { $_->[1] }
        grep { $_->[2] == $k }
        map { [ $_, $ints[$_], sum0 split //, sprintf '%b', $_ ] } 0 .. $#ints;
```

But that's about the size of the iterative version, and it's much less readable to me.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ sum0 };

my @examples = (

    {
        ints => [ 2, 5, 9, 11, 3 ],
        k    => 1
    },
    {
        ints => [ 2, 5, 9, 11, 3 ],
        k    => 2
    },
    {
        ints => [ 2, 5, 9, 11, 3 ],
        k    => 0
    }
);

for my $example (@examples) {
    my @output = sum_of_values($example);
    my $ints   = join ', ', $example->{ints}->@*;
    my $k      = join ', ', $example->{k};
    my $output = join ', ', @output;

    say <<~"END";
    Input:  \@ints = ($ints), \$k = $k
    Output: $output
    END
}

sub sum_of_values ($obj) {
    my @ints   = $obj->{ints}->@*;
    my $k      = $obj->{k};
    my $output = 0;

    for my $i ( 0 .. $#ints ) {
        my $s = sum0 split //, sprintf '%b', $i;
        $output += $ints[$i] if $s == $k;
    }
    return $output;
}
```

```text
$ ./ch-2.pl 
Input:  @ints = (2, 5, 9, 11, 3), $k = 1
Output: 17

Input:  @ints = (2, 5, 9, 11, 3), $k = 2
Output: 11

Input:  @ints = (2, 5, 9, 11, 3), $k = 0
Output: 2
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
