---
layout: post
title:  "Camelia Goes To Monte Carlo: Weekly Challenge #252"
author: "Dave Jacoby"
date:   "2024-01-15 16:44:01 -0500"
categories: ""
---

And now, **[Weekly Challenge #252](https://theweeklychallenge.org/blog/perl-weekly-challenge-252/).** **[252](https://en.wikipedia.org/wiki/252_(number))** is the product of **2, 2, 3, 3 and 7**. It is a [practical number](https://en.wikipedia.org/wiki/Practical_number), and also the new area code for parts of coastal North Carolina. I spent over two years in a place that's still 919, which used to be the state area code. ("Operator give me 919", the phone company ads sang.)

It seemingly is also an [Angel Number](https://numerologynation.com/angel-number-252/).

> "With its amplified core of duality, the angel numbers 252 relate strongly to the strength of your relationship with your partner, while at the same time reminding you that you’re still your own person."

So there's *that*.

### Task 1: Special Numbers
>
> Submitted by: Mohammad S Anwar  
> You are given an array of integers, `@ints`.  
>
> Write a script to find the sum of the squares of all special elements of the given array.  
>
> An element `$ints[i]` of `@ints` is called *special* if `i` divides `n`, i.e. `n % i == 0`, where `n` is the length of the given array. Also the array is 1-indexed for the task.  

#### Let's Talk About It

It took me a while to accept that the value of `$ints[$i]` is immaterial to the "does this pass or not", but `$ints[$i] ** 2` is crucial to the actual result. This breaks the problem up into three basic parts: a filter to exclude numbers where it doesn't divide evenly ( or `grep`), a filter to turn `$i` into `$ints[$i] ** 2` (or `map`) and a way to find the sum (or `sum0` from the always useful [List::Util](https://metacpan.org/pod/List::Util)).

That looks like a case for functional programming, doesn't it?

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ sum0 };

my @examples = (

    [ 1, 2, 3, 4 ],
    [ 2, 7, 1, 19, 18, 3 ],
);

for my $example (@examples) {
    my $input  = join ', ', $example->@*;
    my $output = special_numbers( $example->@* );

    say <<~"END";
    Input:  \$ints = ($input)
    Output: $output
    END
}

sub special_numbers (@input) {
    my $output = 0;
    my $n      = scalar @input;
    return 
        sum0 
        map { $input[ $_ - 1 ] ** 2 } 
        grep { $n % $_ == 0 } 
        1 .. scalar @input;

    ## the longer form I wrote first
    # for my $i ( 1 .. scalar @input ) {
    #     if ( $n % $i == 0 ) {
    #         my $v = $input[ $i - 1 ];
    #         $output += ( $v**2 );
    #     }
    # }
    # return $output;
}
```

```text
$ ./ch-1.pl 
Input:  $ints = (1, 2, 3, 4)
Output: 21

Input:  $ints = (2, 7, 1, 19, 18, 3)
Output: 63
```

### Task 2: Unique Sum Zero
>
> Submitted by: Mohammad S Anwar  
> You are given an integer, $n.  
>
> Write a script to find an array containing $n unique integers such that they add up to zero.  

#### Let's Talk About It

This looks like a job for ... let's face it, I *could've* done this with iteration. I didn't, opting for recursion because I just haven't used it a lot recently, but I could've. What this really seems to call for is the judicious use of random numbers.

Most human problems can be solved by an appropriate charge of ... random numbers. (Yes, I changed that quote.) We're supposed to  come up with *n* numbers that add up to zero, and we can come up with a prescribed list and a prescribed order, but do we really want to? We've gone through the trouble of teaching finine state machines to dream up practically random numbers, so might as well use them. (Note: They're random enough for most purposes, but not random enough for serious (cryptographic) purposes. Be aware of your domain.)

When you solve a problem by throwing random numbers at it, that's called [Monte Carlo](https://en.wikipedia.org/wiki/Monte_Carlo_method) (named after where you see spies and rich people gamble in movies). One way you can use them is by [generating X and Y coordinates between 0 and 1, finding the distance from the origin, and using that to estimate **π**](https://varlogrant.blogspot.com/2017/03/coding-for-pi-day.html).

Here, we're just picking numbers between -9 and 9, putting it into the list, and when we get to the right length of a list, we use `sum0` (of course) to add 'em up, and if they don't equal zero, we back off and try again. And you have to be able to time out because you random-numbered yourself into a circle, so I limit to 100 tries. Maybe high, but it works and avoids an infinite loop.

I mean, it doesn't *look like* a job for recursion, but we made it work. And speaking of which, I start the recursive function with `return [0] if $input == 1`, but I don't *need* it. The algorithm would do the right thing anyway.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ sum0 };
use JSON;
my $j = JSON->new->pretty;

my @examples = ( 1, 3, 4, 5, 7 );
for my $input (@examples) {
    my $o      = unique_sum_zero($input);
    my $output = join ', ', $o->@*;

    say <<~"END";
    Input:  \$matrix = $input
    Output: ($output)
    END
}

sub unique_sum_zero ( $input, $list = [] ) {
    return [0] if $input == 1;             # handle zero case
    if ( $input == scalar $list->@* ) {    # control recursion
        return $list if 0 == sum0 $list->@*;
        return -1;
    }
    my $c = 0;
    while (1) {
        my @list = $list->@*;
        my $n = -9 + int rand 19;           # generates a number between -9 and 9
        next if grep { $_ == $n } @list;    # removes duplicates
        push @list, $n;
        my $return = unique_sum_zero( $input, \@list );
        if ( ref $return && ref $return eq 'ARRAY' ) {
            return $return;
        }

        # if you have bad numbers, it'll be hard to recover
        # so we'll give up after a while
        return -1 if $c++ > 100;
    }
    return -1;
}
```

```text
$ ./ch-2.pl 
Input:  $matrix = 1
Output: (0)

Input:  $matrix = 3
Output: (1, -9, 8)

Input:  $matrix = 4
Output: (-5, -9, 6, 8)

Input:  $matrix = 5
Output: (4, 2, 3, -9, 0)

Input:  $matrix = 7
Output: (6, 5, 8, -7, -9, -4, 1)
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
