---
layout: post
title: "Weekly Challenge #333: Back in the Saddle Again"
author: "Dave Jacoby"
date: "2025-08-07 17:33:09 -0400"
categories: ""
---

Welcome to [_**Weekly Challenge #333!**_](https://theweeklychallenge.org/blog/perl-weekly-challenge-333/) It's been a while since I've done this. It's good to be back.

### Task 1: Straight Line

> Submitted by: Mohammad Sajid Anwar  
> You are given a list of co-ordinates.
>
> Write a script to find out if the given points make a straight line.

#### Let's Talk About It

Here's my thought: We're comparing the angle of every pair of points. We're doing the nested loop thing, and if you've done points **a** and **b** once, there's no reason to do them twice, so **b** starts at **a+1**.

(I'm seeing now that I could've popped the first one and compared it with every other. _C'est la vie._)

So, the comparison goes to angles. The angle from `0,0` to `1,1` is given by `atan2(1-0,1-0)` and is `0.785398163397448` radians or 45 degrees. Reverse the order and you get `-2.35619449019234` radians or -135 degrees. Rather than stress getting the correct order, I do both, storing them in a hash. If we get 1 key, it's `0` because it's all the same point, and that counts. If we get 2 keys, that's both directions and that counts. And if there's more, that means they're not all in the same line, and that's a false.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

my @examples = (

    [ [ 2,       1 ],       [ 2,       3 ],       [ 2,       5 ] ],
    [ [ 1,       4 ],       [ 3,       4 ],       [ 10,      4 ] ],
    [ [ 0,       0 ],       [ 1,       1 ],       [ 2,       3 ] ],
    [ [ 1,       1 ],       [ 1,       1 ],       [ 1,       1 ] ],
    [ [ 1000000, 1000000 ], [ 2000000, 2000000 ], [ 3000000, 3000000 ] ],
);

for my $input (@examples) {
    my $output = straight_line( $input->@* );
    my $str = join ',', map { qq{[$_]} } map { join ', ', $_->@* } $input->@*;
    say <<"END";
    Input:  \@str = ($str)
    Output:        $output
END
}

sub straight_line (@array) {
    my %angles;
    for my $i ( 0 .. $#array ) {
        my $k = $array[$i];
        for my $j ( $i + 1, $#array ) {
            next unless $i != $j;
            next unless defined $array[$j];
            my $l  = $array[$j];
            my $a1 = find_angle( $k, $l );
            my $a2 = find_angle( $l, $k );
            $angles{$a1} = 1;
            $angles{$a2} = 1;
        }
    }
    return scalar keys %angles <= 2 ? 'true' : 'false';
}

sub find_angle ( $p1, $p2 ) {
    return atan2(
        $p1->[1] - $p2->[1], $p1->[0] - $p2->[0]
        );
}
```

```text
$ ./ch-1.pl
    Input:  @str = ([2, 1],[2, 3],[2, 5])
    Output:        true

    Input:  @str = ([1, 4],[3, 4],[10, 4])
    Output:        true

    Input:  @str = ([0, 0],[1, 1],[2, 3])
    Output:        false

    Input:  @str = ([1, 1],[1, 1],[1, 1])
    Output:        true

    Input:  @str = ([1000000, 1000000],[2000000, 2000000],[3000000, 3000000])
    Output:        true
```

### Task 2: Duplicate Zeros

> Submitted by: Mohammad Sajid Anwar
> You are given an array of integers.
>
> Write a script to duplicate each occurrence of zero, shifting the remaining elements to the right. The elements beyond the length of the original array are not written.

#### Let's Talk About It

This is copying an array piece by piece, except:

- when there's a zero, we copy it twice
- we _never_ go past the length of the original array

I *could* handwave it, like `return @output[0..$#input]` or the like, but no, we're going to police ourselves twice: when copying `input[i]` and when adding the subsequent zero.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

my @examples = (

    [ 1, 0, 2, 3, 0, 4, 5, 0 ],
    [ 1, 2, 3 ],
    [ 1, 2, 3, 0 ],
    [ 0, 0, 1, 2 ],
    [ 1, 2, 0, 3, 4 ],

);

for my $input (@examples) {
    my $str    = join ',', $input->@*;
    my @output = duplicate_zeroes( $input->@* );
    my $output = join ',', @output;
    say <<"END";
    Input:  \@str = ($str)
    Output:        ($output)
END
}

sub duplicate_zeroes (@ints) {
    my @output;
    my $l = $#ints;
    for my $i ( 0 .. $l ) {
        my $n = $ints[$i];
        my $o = $#output;
        push @output, $n if $#output < $l;
        push @output, $n if $n == 0 && $#output < $l;
    }
    return @output;
}
```

```text
$ ./ch-2.pl 
    Input:  @str = (1,0,2,3,0,4,5,0)
    Output:        (1,0,0,2,3,0,0,4)

    Input:  @str = (1,2,3)
    Output:        (1,2,3)

    Input:  @str = (1,2,3,0)
    Output:        (1,2,3,0)

    Input:  @str = (0,0,1,2)
    Output:        (0,0,0,0)

    Input:  @str = (1,2,0,3,4)
    Output:        (1,2,0,0,3)
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
