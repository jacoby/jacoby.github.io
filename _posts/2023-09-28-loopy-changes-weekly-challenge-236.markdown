---
layout: post
title:  "Loopy Changes: Weekly Challenge #236"
author: "Dave Jacoby"
date:   "2023-09-28 14:59:10 -0400"
categories: ""
---

### Task 1: Exact Change

> Submitted by: Mohammad S Anwar  
> You are asked to sell juice each costs $5. You are given an array of bills. You can only sell ONE juice to each customer but make sure you return exact change back. You only have $5, $10 and $20 notes. You do not have any change in hand at first.  
>
> Write a script to find out if it is possible to sell to each customers with correct change.  

#### Let's Talk About It

I had to rethink this a few times. I knew how I was going to do it, because ...

**_This Looks Like A Job For Recursion!_**

There's a function that goes through every transaction, storing the bills in the till as an array and starting the recursive search for exact change, then removing the correct bills from the till.

There are a few cases we need to handle. 

* we have exact change
* we don't have enough in the till to make change
* we've counted out too much change
* we've gone through all the options and can't make the right change

I'm pretty sure that I could drop the `if ( $change )` part, but the code works so I'm leaving it in.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::MoreUtils qw( first_index );
use List::Util      qw( sum0 );

my @examples = (

    [ 5, 5, 5,  10, 20 ],
    [ 5, 5, 10, 10, 20 ],
    [ 5, 5, 5,  20 ],
);

for my $e (@examples) {
    my @ints   = $e->@*;
    my $ints   = join ', ', @ints;
    my $output = exact_change(@ints) ? 'true' : 'false';
    say <<~"END";
    Input:  \@ints = ($ints)
    Output: $output
    END
}

sub exact_change (@transactions) {
    my @till;
    my $till = 0;
T: for my $t (@transactions) {
        my $change = $t - 5;
        $till += 5;
        push @till, $t;
        if ($change) {
            my @bills = has_change( $change, \@till, [] );
            my $bills = sum0 @bills;
            return 0 if $change != $bills;
            for my $b (@bills) {
                my $fi = first_index { $_ == $b } @till;
                delete $till[$fi];
                @till = grep { defined } @till;
            }
        }
    }
    return 1;
}

sub has_change ( $change, $till, $values = [] ) {
    my @till = sort { $b <=> $a } $till->@*;    # sort big to small, big bills first
    my $sum  = sum0 $values->@*;
    return             if $sum > $change;   # too much change
    return             if !scalar @till;    # not enough in till
    return $values->@* if $sum == $change;  # exactly right
    for my $i ( 0 .. -1 + scalar @till ) {  # 
        my @copy = $values->@*;
        my $v    = shift @till;
        push @copy, $v;
        my @out = has_change( $change, \@till, \@copy );
        my $val = sum0 @out;
        return @out if $val == $change;
        push @till, $v;
    }
    return;
}
```

```text
$ ./ch-1.pl 
Input:  @ints = (5, 5, 5, 10, 20)
Output: true

Input:  @ints = (5, 5, 10, 10, 20)
Output: false

Input:  @ints = (5, 5, 5, 20)
Output: true
```

### Task 2: Array Loops

> Submitted by: Mark Anderson
> You are given an array of unique integers.
>
> Write a script to determine how many loops are in the given array.
>
> To determine a loop: Start at an index and take the number at array[index] and then proceed to that index and continue this until you end up at the starting index.

#### Let's Talk About It

This one goes two-tiered, just like the previous one, but there's just two cases to watch, which are

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ uniq };

my @examples = (

    [ 4, 6, 3,  8, 15, 0, 13, 18, 7, 16, 14, 19, 17, 5, 11, 1, 12, 2, 9, 10 ],
    [ 0, 1, 13, 7, 6,  8, 10, 11, 2, 14, 16, 4, 12, 9, 17, 5, 3, 18, 15, 19 ],
    [ 9, 8, 3,  11, 5, 7, 13, 19, 12, 4, 14, 10, 18, 2, 16, 1, 0, 15, 6, 17 ],
);

for my $e (@examples) {
    my @ints   = $e->@*;
    my $ints   = join ', ', @ints;
    my $output = find_loops( \@ints );
    say <<~"END";
    Input:  \@ints = 
        ($ints)
    Output: $output
    END
}

sub find_loops ($ints) {
    my $output = 0;
    my %no_go;
    for my $i ( 0 .. -1 + scalar $ints->@* ) {
        my $v = $ints->[$i];
        next if $no_go{$v};
        my @loop = ($v);
        my $loop = traverse_loop( $ints, \@loop );
        if ( $loop == -1 ) { }
        if ( scalar $loop->@* ) {
            map { $no_go{$_} = 1 } $loop->@*;
            $output++;
        }
    }
    return $output;
}

sub traverse_loop ( $ints, $loop ) {
    my $first = $loop->[0];
    my $last  = $loop->[-1];
    my $next  = $ints->[$last];
    if ( scalar $loop->@* > scalar $ints->@* ) { return -1 }
    if ( $next == $first )                     { return $loop }
    my $copy->@* = $loop->@*;
    push $copy->@*, $next;
    return traverse_loop( $ints, $copy );
}
```

```text
$ ./ch-2.pl 
Input:  @ints = 
    (4, 6, 3, 8, 15, 0, 13, 18, 7, 16, 14, 19, 17, 5, 11, 1, 12, 2, 9, 10)
Output: 3

Input:  @ints = 
    (0, 1, 13, 7, 6, 8, 10, 11, 2, 14, 16, 4, 12, 9, 17, 5, 3, 18, 15, 19)
Output: 6

Input:  @ints = 
    (9, 8, 3, 11, 5, 7, 13, 19, 12, 4, 14, 10, 18, 2, 16, 1, 0, 15, 6, 17)
Output: 1
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
