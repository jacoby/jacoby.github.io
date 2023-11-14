---
layout: post
title:  "Walking The Floor Over You: Weekly Challenge #243"
author: "Dave Jacoby"
date:   "2023-11-14 14:19:20 -0500"
categories: ""
---

[We're on to Weekly Challenge #243!](https://theweeklychallenge.org/blog/perl-weekly-challenge-243/) **243** is **3<sup>5</sup>**.

### Task 1: Reverse Pairs
>
> Submitted by: Mohammad S Anwar  
> You are given an array of integers.  
>
> Write a script to return the number of reverse pairs in the given array.  
>
> A reverse pair is a pair (i, j) where: a) 0 <= i < j < nums.length and b) nums[i] > 2 * nums[j].  

#### Let's Talk About It

This is another case where the best way is iterative using nested arrays. I'm always iffy as to whether this gets **O(nlogn)** or not. But once we have the correct arrays, so we can't compare a number with itself, we just do some simple math and comparisons, and we add the number when it's correct.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Compare;

my @examples = (

    [ 1, 3, 2, 3, 1 ],
    [ 2, 4, 3, 5, 1 ],
);
for my $e (@examples) {
    my $output = reverse_pairs( $e->@* );
    my $input  = join ', ', $e->@*;
    say <<~"END";
    Input:  \@input = ($input)
    Output: $output
    END
}

sub reverse_pairs (@input) {
    my $output = 0;
    for my $i ( 0 .. -1 + scalar @input ) {
        my $ii = $input[$i];
        for my $j ( $i + 1 .. -1 + scalar @input ) {
            my $jj = $input[$j];
            $output++ if $ii > $jj * 2;
        }
    }
    return $output;
}
```

```text
$ ./ch-1.pl 
Input:  @input = (1, 3, 2, 3, 1)
Output: 2

Input:  @input = (2, 4, 3, 5, 1)
Output: 3
```

### Task 2: Floor Sum
>
> Submitted by: Mohammad S Anwar  
> You are given an array of positive integers (>=1).  
>
> Write a script to return the sum of floor(nums[i] / nums[j]) where 0 <= i,j < nums.length. The floor() function returns the integer part of the division.  

#### Let's Talk About It

Again with the nested loops, and because it's whole-array vs whole-array, I think this is definitely **O(n<sup>2</sup>)**, which means handling larger arrays would get suckier quickly, but the floor is the integer part of division, so `int( $num / $denom )` will do it. We could use `sum0` from List::Util (always a useful go-to) and replace the inner loop with   `sum0 map { int( $ii / $_ ) } @input`, but I don't like going functional unless I can go fully functional, and with two arrays, it kinda gets ugly.

(I never liked Perl Golf-style development, and try, even in my toy code, to write things I'll understand next time I read them.)

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @examples = (

    [ 2, 5, 9 ],
    [ 7, 7, 7, 7, 7, 7, 7 ],
);

for my $e (@examples) {
    my $input  = join ', ', $e->@*;
    my $output = floor_sum( $e->@* );

    say <<~"END";
    Input:  \$input = ($input)
    Output:          $output
    END
}

sub floor_sum (@input) {
    my $output = 0;
    for my $i ( 0 .. -1 + scalar @input ) {
        my $ii = $input[$i];
        for my $j ( 0 .. -1 + scalar @input ) {
            my $jj    = $input[$j];
            my $floor = int( $ii / $jj );
            $output += $floor;
        }
    }
    return $output;
}
```

```text
$ ./ch-2.pl 
Input:  $input = (2, 5, 9)
Output:          10

Input:  $input = (7, 7, 7, 7, 7, 7, 7)
Output:          49
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
