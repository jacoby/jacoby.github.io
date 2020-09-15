---
layout: post
title: "Rotating Leaders: Perl Challenge 78"
author: "Dave Jacoby"
date: "2020-09-14 20:14:09 -0400"
categories: ""
---

### TASK #1 › Leader Element

> Submitted by: Mohammad S Anwar  
> You are given an array @A containing distinct integers.
>
> Write a script to find all leader elements in the array @A. Print (0) if none found.
>
> An element is leader if it is greater than all the elements to its right side.

So, we can go through every subarray we want with `while (array)` and `shift array`;

```
    9 10 7 5 6 1
    10 7 5 6 1
    7 5 6 1
    5 6 1
    6 1
    1
```

And so we're comparing the first element of the array, `$arr[0]`, and the largest value of the array, `max @arr` from [List::Util](https://metacpan.org/pod/List::Util), one of the great gifts Perl gives us.

This makes it very easy to handle this.

#### Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use List::Util qw{ max };

# You are given an array @A containing distinct integers.

# Write a script to find all leader elements in the array @A.
# Print (0) if none found.

# Input: @A = (9, 10, 7, 5, 6, 1)
# Output: (10, 7, 6, 1)

my @A;
@A = ( 9, 10, 7, 5, 6, 1 );
my @o1 = leader_element(@A);
say join ', ', @A;
say join ', ', @o1;
say '';

# Input: @A = (3, 4, 5)
# Output: (5)

@A = ( 3, 4, 5 );
my @o2 = leader_element(@A);
say join ', ', @A;
say join ', ', @o2;
say '';

sub leader_element ( @arr ) {
    my @output;

    while (@arr) {
        my $max = max @arr;
        push @output, $arr[0] if $max == $arr[0];
        shift @arr;
    }

    push @output, 0 unless scalar @output;
    return wantarray ? @output : \@output;
}
```

And, knowing both the input and the expected output, I'm thinking this is exactly the kind of code I could write using Test modules to get my head more fully into that.

### TASK #2 › Left Rotation

> Submitted by: Mohammad S Anwar
> You are given array @A containing positive numbers and @B containing one or more indices from the array @A.
>
> Write a script to left rotate @A so that the number at the first index of @B becomes the first element in the array. Similary, left rotate @A again so that the number at the second index of @B becomes the first element in the array.

It took the examples for me to _get_ this. First-pass is easy to get. We have the array of example 1, `[10, 20, 30, 40, 50]`, and one of the indexes, `3`.

```
     0   1   2   3   4
    10  20  30  40  50
```

So, we have the index of 3, so we want `40` to be the first in the array, with all the ones before thrown to the end.

```
    40  50  10  20  30
```

And then we're given a new index, `4`, which makes the rotation on the last element of the array. So, are we to go forward with the modified array, in which case the last element becoming first is `30`? Or are we to go back to the original, where it's `50`?

The example output says it's `50`, so I go forward with that. 

So, `for (1 .. $i) { push @arr, shift @arr }` is enough to move the array around.

#### Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

# You are given array @A containing positive numbers
# and @B containing one or more indices from the array @A.

# Write a script to left rotate @A so that the number
# at the first index of @B becomes the first element
# in the array. Similary, left rotate @A again so that
# the number at the second index of @B becomes the first
# element in the array.

#       and this is where you look into the examples to tell,
#       because by description, I would've thought that you
#       work again on the modified array, not starting over

my $o1 = left_rotation( [ 10, 20, 30, 40, 50 ], [ 3, 4 ] );
my $o2 = left_rotation( [ 7, 4, 2, 6, 3 ], [ 1, 3, 4 ] );

for my $o ( $o1, $o2 ) {
    for my $r ( $o->@* ) {
        print '[';
        print join ' ', $r->@*;
        say ']';
    }
    say '';
}

# Example 1
# [40 50 10 20 30]
# [50 10 20 30 40]

# Example 2
# [4 2 6 3 7]
# [6 3 7 4 2]
# [3 7 4 2 6]

sub left_rotation ( $nums, $indices ) {
    my @output;
    for my $i ( $indices->@* ) {
        my @new = $nums->@*;
        for ( 1 .. $i ) {
            push @new, shift @new;
        }
        push @output, [@new];
    }

    push @output, 0 unless scalar @output;
    return wantarray ? @output : \@output;
}
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
