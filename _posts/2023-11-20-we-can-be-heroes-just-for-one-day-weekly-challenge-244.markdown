---
layout: post
title:  "We Can Be Heroes, Just For One Day: Weekly Challenge #244"
author: "Dave Jacoby"
date:   "2023-11-20 17:47:44 -0500"
categories: ""
---

And now we're on to [Weekly Challenge #244](https://theweeklychallenge.org/blog/perl-weekly-challenge-244/)! **244** is **2 * 2 * 61**, and is the sum of two non-zero fifth powers **(1<sup>5</sup> + 3<sup>5</sup>)**

### Task 1: Count Smaller

> Submitted by: Mohammad S Anwar
> You are given an array of integers.
>
> Write a script to calculate the number of integers smaller than the integer at each index.

#### Let's Talk This Through

I thought about creating a copy array and removing the values in question from it, but then I relized that `$v` will never be less than `$v`. `scalar` and `grep` are again crucial functional programming elements.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Compare;

my @examples = (

    [ 8, 1, 2, 2, 3 ],
    [ 6, 5, 4, 8 ],
    [ 2, 2, 2 ],
);
for my $e (@examples) {
    my @output = count_smaller( $e->@* );
    my $output = join ', ', @output;
    my $input  = join ', ', $e->@*;
    say <<~"END";
    Input:  \@int = ($input)
    Output: ($output)
    END
}

sub count_smaller (@input) {
    my @output;
    for my $v (@input) {
        # first pass, I copied the array to remove the current value
        # but once I realized that $v is never going to be less than 
        # itself, I decided to make it simpler.
        push @output, scalar grep { $_ < $v } @input;
    }
    return @output;
}
```

```text
$ ./ch-1.pl 
Input:  @int = (8, 1, 2, 2, 3)
Output: (4, 0, 1, 1, 3)

Input:  @int = (6, 5, 4, 8)
Output: (2, 1, 0, 3)

Input:  @int = (2, 2, 2)
Output: (0, 0, 0)
```

### Task 2: Group Hero

> Submitted by: Mohammad S Anwar
> You are given an array of integers representing the strength.
>
> Write a script to return the sum of the powers of all possible combinations; power is defined as the square of the largest number in a sequence, multiplied by the smallest.

#### Let's Talk This Through

I use [List::Util](https://metacpan.org/pod/List::Util)'s `min` and `max`, because List::Util. I'm also using [Math::Combinatorics](https://metacpan.org/pod/Math::Combinatorics), which is not a [Core module](https://perldoc.perl.org/modules) and I don't think I've mentioned it. It's different but similar to [Algorithm::Combinatorics](https://metacpan.org/pod/Algorithm::Combinatorics), which I often use.

(Looking back, I should probably have used A::C, but oh well.)

Anyway, Algorithm::Combinatorics allows you to have all the possible variations given the input, and also given the size desired. Once we get every variation, we get the smallest value, the largest value, and the rest is simple math. (We could sort the array, then go with `$array[0]` and `$array[-1]`, but since we have List:: Util...)

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ min max };
use Math::Combinatorics;

my @examples = (

    [ 2, 1, 4 ],
);

for my $e (@examples) {
    my $input  = join ', ', $e->@*;
    my $output = group_hero( $e->@* );

    say <<~"END";
    Input:  \$input = ($input)
    Output:          $output
    END
}

sub group_hero (@input) {
    my $output = 0;
    for my $c ( 1 .. scalar @input ) {
        my $comb = Math::Combinatorics->new( count => $c, data => [@input], );
        while ( my @combo = $comb->next_combination ) {
            my $min = min @combo;
            my $max = max @combo;
            my $str = $max**2 * $min;
            $output += $str;
        }
    }
    return $output;
}
```

```text
$ ./ch-2.pl 
Input:  $input = (2, 1, 4)
Output:          141
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
