---
layout: post
title: "Arrayed Against Me: Weekly Challenge #263"
author: "Dave Jacoby"
date: "2024-04-02 16:54:14 -0400"
categories: ""
---

[This is ]()

### Task 1: Target Index

> Submitted by: Mohammad Sajid Anwar  
> You are given an array of integers, @ints and a target element $k.
>
> Write a script to return the list of indices in the sorted array where the element is same as the given target element.

#### Let's Talk About It

We're looking for the indices, so we loop through the indices for each array and look for `$k == $sorted[$_]`, and we're sorting first because we're told to return the indices in the sorted array, but we're given an unsorted array.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @examples = (

    { ints => [ 1, 5, 3, 2, 4, 2 ], k => 2 },
    { ints => [ 1, 2, 4, 3, 5 ],    k => 6 },
    { ints => [ 5, 3, 2, 4, 2, 1 ], k => 4 },
);

for my $example (@examples) {
    my @output = target_index($example);
    my $output = join ', ', @output;
    my $ints   = join ', ', $example->{ints}->@*;
    my $k      = $example->{k};
    say <<"END";
    Input:  \@ints = ($ints), \$k = $k
    Output: ($output)
END
}

sub target_index ($obj) {
    my @sorted = sort { $a <=> $b } $obj->{ints}->@*;
    my $k      = $obj->{k};
    my @output = grep { $k == $sorted[$_] } 0 .. $#sorted;
    return @output;
}
```

```text
$ ./ch-1.pl
    Input:  @ints = (1, 5, 3, 2, 4, 2), $k = 2
    Output: (1, 2)

    Input:  @ints = (1, 2, 4, 3, 5), $k = 6
    Output: ()

    Input:  @ints = (5, 3, 2, 4, 2, 1), $k = 4
    Output: (4)
```

### Task 2: Merge Items

> Submitted by: Mohammad Sajid Anwar  
> You are given two 2-D array of positive integers, $items1 and $items2 where element is pair of (item_id, item_quantity).
>
> Write a script to return the merged items.

#### Let's Talk About It

This is slightly more complex, because we're dealing with 2-dimensional arrays, but logically, we're putting things into a hash and taking it back out. 

Each element is `[id,quantity]`, and we do the merging with addition and hashes, and map back to a 2-dimensional array when done.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @examples = (

    {
        items1 => [ [ 1, 1 ], [ 2, 1 ], [ 3, 2 ] ],
        items2 => [ [ 2, 2 ], [ 1, 3 ] ],
    },
    {
        items1 => [ [ 1, 2 ], [ 2, 3 ], [ 1, 3 ], [ 3, 2 ] ],
        items2 => [ [ 3, 1 ], [ 1, 3 ] ],
    },
    {
        items1 => [ [ 1, 1 ], [ 2, 2 ], [ 3, 3 ] ],
        items2 => [ [ 2, 3 ], [ 2, 4 ] ],
    }
);

for my $example (@examples) {
    my @output = merge_items($example);
    my $output = join ', ', map { make_block($_) } @output;
    my $items1 = join ', ', map { make_block($_) } $example->{items1}->@*;
    my $items2 = join ', ', map { make_block($_) } $example->{items2}->@*;

    say <<"END";
    Input: \@items1 = [ $items1 ]
           \@items2 = [ $items2 ]
    Output: [ $output ]
END
}

sub make_block ($ref) {
    my $list =  join ',', $ref->@*;
    return qq{[$list]};
}

sub merge_items ($example) {
    my %output;
    for my $p ( $example->{items1}->@*, $example->{items2}->@* ) {
        my ( $item_id, $quantity ) = $p->@*;
        $output{$item_id} += $quantity;
    }
    return map { [ int $_, $output{$_} ] } sort keys %output;
}
```

```text
$ ./ch-2.pl 
    Input: @items1 = [ [1,1], [2,1], [3,2] ]
           @items2 = [ [2,2], [1,3] ]
    Output: [ [1,4], [2,3], [3,2] ]

    Input: @items1 = [ [1,2], [2,3], [1,3], [3,2] ]
           @items2 = [ [3,1], [1,3] ]
    Output: [ [1,8], [2,3], [3,3] ]

    Input: @items1 = [ [1,1], [2,2], [3,3] ]
           @items2 = [ [2,3], [2,4] ]
    Output: [ [1,1], [2,9], [3,3] ]
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
