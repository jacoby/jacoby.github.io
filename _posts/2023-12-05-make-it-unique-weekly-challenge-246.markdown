---
layout: post
title:  "Make It Unique: Weekly Challenge #246"
author: "Dave Jacoby"
date:   "2023-12-05 16:46:09 -0500"
categories: ""
---

And now we're on to [Weekly Challenge #246!](https://theweeklychallenge.org/blog/perl-weekly-challenge-246/) **246** is the product of **2, 3, and 41**. It is [Untouchable](https://en.wikipedia.org/wiki/Untouchable_number).

### Task 1: 6 out of 49

> Submitted by: Andreas Voegele  
> 6 out of 49 is a German lottery.  
>
> Write a script that outputs six unique random integers from the range 1 to 49.  

#### Let's Talk About It

I got this wrong on first pass.

"Six random integers"? That's cake.

"Between the range of 1 and 49?" More cake.

The word I missed is "unique". That's the word that makes this work.

If you want to include all the input, use a `for` loop, but if you're concerned about the output, use a `while` loop. Here, we're watching the number of keys in the hash, so we're randomizing a number, making it a key, and checking. The count doesn't matter, so we set to `1` instead of incrementing. I mean, we _could_ do that, but that makes a moving part that the next guy could get obsessed by. "Why increment?"

(Forgive me; I've been looking at something recently that I'm only 80% sure is someone using more shell than they understand, but trying to understand the possible cleverness in that 20%. Code, I believe, is like musical notation and mathematical expressions: most important as communication to others. When you write something ambiguous, you aren't showing off cleverness, just writing something intentionally confusing for your colleagues.)

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my %hash;

# Write a script that outputs six unique random integers 
# from the range 1 to 49.

# I had missed 'unique', which means we have to be sure we
# deal with duplicates. Use the random number as keys to a hash
# and you won't get duplicates.

# Adding the numeric sort just makes it pretty.

while ( scalar keys %hash < 6 ) {
    my $n = 1 + int rand 49;
    $hash{$n} = 1;
}

say join "\n", sort { $a <=> $b } keys %hash;

# And here is my first pass, which ignored "unique". 
# Because of that, it was very simple.

# say join "\n",
#     sort { $a <=> $b }      # and the example is sorted numerically, so we will
#     map { 1 + int rand 49 } # which are random and between 1 and 49
#                             # but int rand ( n ) will give a number between 0 and n-1
#                             # so adding 1 will put it at the right range
#     1 .. 6;                 # we want six numbers
```

```text
$ ./ch-1.pl 
6
19
34
36
40
49
```

### Task 2: Linear Recurrence of Second Order

> Submitted by: Jorg Sommrey
> You are given an array @a of five integers.
>
> Write a script to decide whether the given integers form a linear recurrence of second order with integer factors.
>
> A linear recurrence of second order has the form
>
> `a[n] = p * a[n-2] + q * a[n-1] with n > 1`
>
> where p and q must be integers.

#### Let's Talk About It

`p` and `q` must be integers, so we go through a lot of integers, do the math, and go `next` to the outer loop if you find one. If there's ever a case where, after a large array of integers, you don't find something that matches, we return true.

First pass, I had two different loops for both `p` and `q`, for both `1..100` and `-1, 1`, but it became much simpler when I rewrote for `-100..100`. There's no division to worry about.

And once you've sorted your `$p`s and `$q`s, it's simple mathematics and named loops.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @examples = (

    [ 1, 1, 2, 3,  5 ],
    [ 4, 2, 4, 5,  7 ],
    [ 4, 1, 2, -3, 8 ],
);

for my $e (@examples) {
    my $input  = join ', ', $e->@*;
    my $output = lrso( $e->@* );

    say <<~"END";
    Input:  \$input = ($input)
    Output:          $output
    END
}

sub lrso (@input) {
OUTER: for my $n ( 2 .. -1 + scalar @input ) {
        for my $p ( -100 .. 100 ) {
            my $pp = $p * $input[ $n - 2 ];
            for my $q ( -100 .. 100 ) {
                my $qq = $q * $input[ $n - 1 ];
                my $rr = $pp + $qq;
                next OUTER if $rr == $input[$n];
            }
        }
        return 'false';
    }
    return 'true';
}
```

```text
$ ./ch-2.pl 
Input:  $input = (1, 1, 2, 3, 5)
Output:          true

Input:  $input = (4, 2, 4, 5, 7)
Output:          false

Input:  $input = (4, 1, 2, -3, 8)
Output:          true
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
