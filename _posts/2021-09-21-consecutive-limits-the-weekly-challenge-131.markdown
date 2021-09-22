---
layout: post
title: "Consecutive Limits: The Weekly Challenge 131"
author: "Dave Jacoby"
date: "2021-09-21 15:20:48 -0400"
categories: ""
---

[Another week, another challenge.](https://theweeklychallenge.org/blog/perl-weekly-challenge-131/)

### TASK #1 › Consecutive Arrays

> Submitted by: Mark Anderson  
> You are given a sorted list of unique positive integers.
>
> Write a script to return list of arrays where the arrays are consecutive integers.

This is fairly simple. Start with an output array filled with arrays. For each number in the input array, if it isn't one more than the last number in the last array in the output array, push another array into the output array. Then, push that number onto the last subarray in the output array.

```text
[ 1, 2, 3, 6, 7, 8, 9 ]
[ [ ] ]

[ 2, 3, 6, 7, 8, 9 ]
[ [ 1 ] ]

[ 3, 6, 7, 8, 9 ]
[ [ 1, 2 ] ]

[ 6, 7, 8, 9 ]
[ [ 1, 2, 3 ] ]

[ 7, 8, 9 ]
[ [ 1, 2, 3 ], [ 6 ] ]

[ 8, 9 ]
[ [ 1, 2, 3 ], [ 6, 7 ] ]

[ 9 ]
[ [ 1, 2, 3 ], [ 6, 7, 8 ] ]

[ ]
[ [ 1, 2, 3 ], [ 6, 7, 8, 9 ] ]
```

So, since that's the process, what's the code?

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures };
no warnings qw{ experimental };

my @examples;
push @examples, [ 1,  2,  3,  6,  7,  8, 9 ];
push @examples, [ 11, 12, 14, 17, 18, 19 ];
push @examples, [ 2,  4,  6,  8 ];
push @examples, [ 1,  2,  3,  4, 5 ];

for my $e (@examples) {
    my $input  = join ', ', $e->@*;
    my $o      = consecutive_arrays( $e->@* );
    my $output = join ', ', map { qq{[$_]} }
        map { join ', ', $_->@* } $o->@*;

    say <<"END";
    Input:  ( $input )
    Output: ( $output )
END
}

sub consecutive_arrays( @array ) {
    my $output = [];
    while (@array) {
        my $n = shift @array;
        push $output->@*, []
            unless scalar $output->@*
            && $n == $output->[-1][-1] + 1;
        push $output->[-1]->@*, $n;
    }
    return $output;
}
```

```text
    Input:  ( 1, 2, 3, 6, 7, 8, 9 )
    Output: ( [1, 2, 3], [6, 7, 8, 9] )

    Input:  ( 11, 12, 14, 17, 18, 19 )
    Output: ( [11, 12], [14], [17, 18, 19] )

    Input:  ( 2, 4, 6, 8 )
    Output: ( [2], [4], [6], [8] )

    Input:  ( 1, 2, 3, 4, 5 )
    Output: ( [1, 2, 3, 4, 5] )
```

### TASK #2 › Find Pairs

> Submitted by: Yary  
> You are given a string of delimiter pairs and a string to search.
>
> Write a script to return two strings, the first with any characters matching the “opening character” set, the second with any matching the “closing character” set.

There's a more complex version of this where we capture what occurs within the matched delimiters, where we know that **Apple ][e** has both an opening and closing bracket, but doesn't delimit anything because the close comes before the open. At least, if it is counting opening and closing delimiters, counts an opening when it opens and a closing when it closes.

But today is not that day. I will engage with this task.

The Basically, we're given matched pairs of delimiters: `""[]()` gets broken up into `"" [] ()`, and the one on the left becomes a left delimiter and the one on the right becomes a right delimiter. When it's in there twice, like with `""`, that just puts `"` in both the left and right delimiter lists.

Or, rather, hashes, because `$left{$c}` is a quick and easy test.

So, for every character, we check. If it's a left delimiter, it goes onto the "left" string, and the same with the right. Well, _I'm_ doing a string; it would be as easy to push it to an array and stringify it at the last minute, but eh, concatenation is easy, right?

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures };
no warnings qw{ experimental };

my @examples;
push @examples,
    [ q{""[]()}, '"I like (parens) and the Apple ][+", they said.' ];
push @examples,
    [
    q{**//<>}, '/* This is a comment (in some languages) */ <could be a tag>'
    ];

for my $e (@examples) {
    my ( $delim, $string ) = $e->@*;
    my ($open, $close)  = find_pairs( $delim, $string );

    say <<"END";
    Input:  
        Delimiter pairs: $delim
        Search String: $string
    Output: 
        $open
        $close
END
}

sub find_pairs ( $delim, $string ) {
    my %left;
    my %right;
    my $left  = '';
    my $right = '';
    while ( length $delim ) {
        my $x = substr $delim, 0, 2;
        substr( $delim, 0, 2 ) = '';
        my ( $l, $r ) = split //, $x;
        $left{$l}  = 1;
        $right{$r} = 1;
    }
    for my $i ( 0 .. length $string ) {
        my $c = substr $string, $i, 1;
        $left  .= $c if $left{$c};
        $right .= $c if $right{$c};
    }
    return ( $left, $right );
}
```

```text
    Input:
        Delimiter pairs: ""[]()
        Search String: "I like (parens) and the Apple ][+", they said.
    Output:
        "(["
        ")]"

    Input:
        Delimiter pairs: **//<>
        Search String: /* This is a comment (in some languages) */ <could be a tag>
    Output:
        /**/<
        /**/>
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
