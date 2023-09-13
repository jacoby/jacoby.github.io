---
layout: post
title:  "Back By Lack of Demand: Weekly Challenge #234"
author: "Dave Jacoby"
date:   "2023-09-13 16:09:07 -0400"
categories: ""
---

Welcome to [Weekly Challege #234!](https://theweeklychallenge.org/blog/perl-weekly-challenge-234/) I couldn't come up with a title last week, so I didn't blog it.

We're on to [**234**](https://en.wikipedia.org/wiki/234_(number)), which is the product of **2**, **3**, **3** and **13**. It is the [US Area Code for Akron, OH](https://www.allareacodes.com/234), [the country code for Nigeria](https://countrycode.org/nigeria), and a [practial number](https://en.wikipedia.org/wiki/Practical_number).

### Task 1: Common Characters
>
> Submitted by: Mohammad S Anwar  
> You are given an array of words made up of alphabetic characters only.  
>
> Write a script to return all alphabetic characters that show up in all words including duplicates.  

#### Let's Talk About This

It wasn't immediately clear to me how to engage this problem. The initial idea hung up, my Recursion plan went off the rails, and then I remembered `first_index` from [List::MoreUtils](https://metacpan.org/pod/List::MoreUtils). `my $first = first_index { $_ == 1 } @array` tells you the index of the first element that matches. I used `sort` to find the lowest character, then `first_index` to find which one it was, then used `substr` and an lvalue to remove that first character.

This looked like a job for Iteration, I guess.

I get `["a", "j"]` instead of `[j"","a"]` for the first example, but I'll live with that.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util      qw( uniq );
use List::MoreUtils qw( first_index );

my @examples = (

    [ "java",  "javascript", "julia" ],
    [ "bella", "label",      "roller" ],
    [ "cool",  "lock",       "cook" ],
    [qw{ pizza prince pepper pauper }],
);

for my $e (@examples) {
    my @words = $e->@*;
    my $words = join ', ', map { qq{"$_"} } @words;
    my @output = common_chars(@words);
    my $output = join ', ', map { qq{"$_"} } @output;
    say <<~"END";
    Input:  \@words = ($words)
    Output: ($output)
    END
}

sub common_chars (@words) {
    @words = map { join '', sort split //, $_ } @words;
    my $done = 0;
    my @common;

    my $c = 0;
OUTER: while (1) {
        my $test = scalar uniq sort map { substr $_, 0, 1 } @words;
        $c++;
        if ( $test == 1 ) {
            push @common, substr( $words[0], 0, 1 );
            map { substr( $_, 0, 1 ) = '' } @words;
            next OUTER;
        }
        else {
            my @first   = grep { /\w/ } map { substr $_, 0, 1 } @words;
            my ($first) = sort @first;
            my $fi      = first_index { $_ eq $first } @first;
            substr( $words[$fi], 0, 1 ) = '';
        }
        last OUTER if $c > 20;
    }
    return @common;
}
```

```text
$ ./ch-1.pl
Input:  @words = ("java", "javascript", "julia")
Output: ("a", "j")

Input:  @words = ("bella", "label", "roller")
Output: ("e", "l", "l")

Input:  @words = ("cool", "lock", "cook")
Output: ("c", "o")

Input:  @words = ("pizza", "prince", "pepper", "pauper")
Output: ("p")
```

### Task 2: Unequal Triplets
>
> Submitted by: Mohammad S Anwar  
> You are given an array of positive integers.  
>
> Write a script to find the number of triplets (i, j, k) that satisfies num[i] != num[j], num[j] != num[k] and num[k] != num[i].  

#### Let's Talk About This

Here, I guess the interesting thing in this one is the nested loop thing getting a third nested loop. I 

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ uniq };

my @examples = (

    [ 4, 4, 2, 4,  3 ],
    [ 1, 1, 1, 1,  1 ],
    [ 4, 7, 1, 10, 7, 4, 1, 1 ],
);

for my $e (@examples) {
    my @ints   = $e->@*;
    my $ints   = join ',', @ints;
    my $output = unequal_triplets(@ints);
    say <<~"END";
    Input:  \@ints = ($ints)
    Output: ($output)
    END
}

sub unequal_triplets (@ints) {
    my $c = 0;
    for my $i ( 0 .. -1 + scalar @ints ) {
        for my $j ( $i + 1 .. -1 + scalar @ints ) {
            for my $k ( $j + 1 .. -1 + scalar @ints ) {
                next if $ints[$i] == $ints[$j];
                next if $ints[$i] == $ints[$k];
                next if $ints[$j] == $ints[$k];
                $c++;
            }
        }
    }
    return $c;
}
```

```text
$  ./ch-2.pl
Input:  @ints = (4,4,2,4,3)
Output: (3)

Input:  @ints = (1,1,1,1,1)
Output: (0)

Input:  @ints = (4,7,1,10,7,4,1,1)
Output: (28)
```


#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
