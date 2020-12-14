---
layout: post
title: "Perl Challenge 91: Jumping Numbers and Counting Numbers"
author: "Dave Jacoby"
date: "2020-12-14 13:27:49 -0500"
categories: ""
---

Another week blogging [a Perl Weekly Challenge!](https://perlweeklychallenge.org/blog/perl-weekly-challenge-091/)

### TASK #1 › Count Number

> Submitted by: Mohammad S Anwar  
> You are given a positive number `$N`.
>
> Write a script to count number and display as you read it.

Given the 80s Yes album _90125_, we'd go _"one zero, one one, one two, one five, one nine"_, or `1011121519`.

Which _can_ get ambiguous if you start counting large numbers, because if there were 101112 `1`s and 51 `9`s, it would give the same output. But eh.

I didn't do cleanup, because even if this was a negative number, we don't have to worry about anything `\D`, so I just go through `0..9`, get the number of instances and add to the output.

Notice how the examples don't start out with `00` to indicate a lack of zeroes? `if` or `grep` to the rescue! I wrote a solution that used `for` and `if` and another that uses `map` and `grep`.

But we want to count the number of times a character is used, and splitting the string into an array is wasteful of memory. So, how do you get the count of the times a character is used? We'll switch prog rock bands and go to Rush's classic _2112_. A first stop is `$x = $N =~ /2/g`, but that'll just say _"I found it!"_, or `1` in boolean parlance. We'll grab the `2` with `$x = $N =~ /(2)/`, but that's just proving it was a 2, which we're already sure of. We want every `2`, so we run `$x = $N =~ /(2)/g` and get `22`, but we want `2` meaning we have two `2`s.

The solution is as follows `$x = () = $N =~ /(2)/`, which forces a list context and gives us the size of the list. `=()=` is sometimes called the **goatse** operator, and if you don't know why, don't look it up.

#### Let's See The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

my @examples = qw{1122234 2333445 12345 90125 };

for my $example (@examples) {
    my $output = count_number($example);
    my $o2     = count_number2($example);
    say '  input: ' . $example;
    say ' output: ' . $output;
    say 'output2: ' . $o2;
    say '';
}

sub count_number( $input ) {
    my $output = '';
    for my $i ( 0 .. 9 ) {
        my $x = () = $input =~ /($i)/gmx;
        $output .= $x . $i if $x;
    }
    return $output;
}

sub count_number2( $input ) {
    return join '', map {
        my $x = () = $input =~ /($_)/g;
        $x . $_; }
        grep { $input =~ /$_/ } 0 .. 9;
}
```

### TASK #2 › Jump Game

> Submitted by: Mohammad S Anwar  
> You are given an array of positive numbers `@N`, where value at each index determines how far you are allowed to jump further.
>
> Write a script to decide if you can jump to the last index. Print **1** if you are able to reach the last index otherwise **0**.

We'll run through the two examples, first with `1, 2, 1, 2`:

- index is `0` and `$n[0]` is `1`, so we add `1` to the index
- index is `1` and `$n[1]` is `1`, so we add `2` to the index
- index is `3` and that's the last index — `0,1,2,3` — and we have a **_win!_**

In contrast, with `2, 1, 1, 0, 2`:

- index is `0` and `$n[0]` is `2`, so we add `2` to the index
- index is `2` and `$n[2]` is `1`, so we add `1` to the index
- index is `3` and `$n[3]` is `0`, so we add `0` to the index
- index is `3` and `$n[3]` is `0`, so we add `0` to the index
- I think we've seen this one before...

We've hit one failure point: we can't move the index to progress. (It says _array of positive numbers_, and zero is neither positive nor negative, but I'll work with it.) The easier failure point is when we've gone past the end of the array. Going negative would introduce `$n[-1]`, which is simply the end of the index, but we're _sure_ that _array of positive numbers_ excludes negative numbers, so that won't happen. We'd have to add a case to handle that if so, but otherwise, it's simply

- if this is the last index, win
- if this is beyond the last index, lose
- if the current value is zero, lose
- if this is below the last index, add the current value to the current index and go again

_(My first pass had code to extract the last index to test against, but I decided to rewrite without that value. It may be **slightly** clearer, but I like it better this way.)_

#### Let's See The Code

```perl
sub jump_game( @n ) {
    say join ' ', @n;
    my $i = 0;
    while (1) {
        if ( !defined $n[$i] )                         { last }
        if ( $n[$i] == 0 )                             { last }
        if ( defined $n[$i] && !defined $n[ $i + 1 ] ) { return 1 }
        $i += $n[$i];
    }
    return 0;
}
```

```text
1 2 1 2
1
2 1 1 0 2
0
1 9 9 2
0
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
