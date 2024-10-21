---
layout: post
title: "Comes A Time: Weekly Challenge #292"
author: "Dave Jacoby"
date: "2024-10-21 17:35:04 -0400"
categories: ""
---

Welcome to [**_Weekly Challenge #292_**](https://theweeklychallenge.org/blog/perl-weekly-challenge-292/). **292** the product of **2 _ 2 _ 73**. I would dig up more interesting numerical things, but this was a bit of a challenge (funny, that) and took longer than I had expected.

My other hobby is music, and my band, Greg Jones and the Wabash Ramblers, will be playing this Saturday. If you're in west central Indiana and are interested in corn and roots rock, hit me up for details!

### Task 1: Twice Largest

> Submitted by: Mohammad Sajid Anwar  
> You are given an array of integers, `@ints`, where the largest integer is unique.
>
> Write a script to find whether the largest element in the array is at least twice as big as every element in the given array. If it is return the index of the largest element or return `-1` otherwise.

#### Let's Talk About It

These are heavy [List::Util](https://metacpan.org/pod/List::Util) tasks. We're comparing the highest value entry in an array with the others, and we can find that with `max`.

> `my $max = max @array`

And once you have the max, you can find the index fairly easily with `first`.

> `my $index = first { $array[$\_] == $max } 0 .. -1 + scalar @array;

And now we loop through the array, skipping `$index`, and testing if `$max >= 2 * $v`.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use List::Util qw{ first max };

my @examples = (

    [ 2, 4, 1, 0 ],
    [ 1 .. 4 ],
    [ 1, 3, 5, 7, 11 ],
    [ 1, 3, 5, 7, 15 ],
);

for my $example (@examples) {
    my $output = twice_largest( $example->@* );
    my $input  = join ', ', $example->@*;
    say <<"END";
    Input:  \$ints = ($input)
    Output: $output
END
}

sub twice_largest (@array) {
    my $max = max @array;
    my $i   = first { $array[$_] == $max } 0 .. -1 + scalar @array;
    for my $j ( 0 .. -1 + scalar @array ) {
        next if $i == $j;
        my $v = $array[$j];
        my $r = $max >= 2 * $v ? 1 : 0;
        if ( !$r ) {
            return -1;
        }
    }
    return $i;
}

```

```text
$ ./ch-1.pl
    Input:  $ints = (2, 4, 1, 0)
    Output: 1

    Input:  $ints = (1, 2, 3, 4)
    Output: -1

    Input:  $ints = (1, 3, 5, 7, 11)
    Output: -1

    Input:  $ints = (1, 3, 5, 7, 15)
    Output: 4
```

### Task 2: Zuma Game

> Submitted by: Mohammad Sajid Anwar  
> You are given a single row of colored balls, `$row` and a random number of colored balls in `$hand`.
>
> Here is the variation of **Zuma** game as your goal is to clear all of the balls from the board. Pick any ball from your hand and insert it in between two balls in the row or on either end of the row. If there is a group of _three or more consecutive balls of the same color_ then remove the group of balls from the board. If there are no more balls on the board then you win the game. Repeat this process until you either win or do not have any more balls in your hand.
>
> Write a script to minimum number of balls you have to insert to clear all the balls from the board. If you cannot clear all the balls from the board using the balls in your hand, return `-1`.

#### Let's Talk About It

> Some people, when confronted with a problem, think "I know, I'll use regular expressions." Now they have two problems.
> — Jamie Zawinski

I get that. Really, I do. But a good chunk of the power of Perl is the power of their regular expressions. I'm sure I could do this in a way that didn't use regular expressions, but it seems tedious. I mean, I'm seeing substring manipulation and named while loops. As wild as you can get with regular expressions, and as unreadable as they can get, that's really the better choice.

And that'll be the first place to start. Assume we're given `WWBBWW` and given a chance to add a `B`. There are 3 useful places that can go: before the first `B`, between the `B`s and after the last `B`. The result will be identical, which is ending up with `WWBBBWW`, which means we can match and remove `BBB` and end up with `WWWWW`. The thing to remember is that we aren't just taking out `BBB`. Once that issue is resolved, we can take out `WWWW`. It's a cascade of removal.

Logically, it's simple. It's why we have `while` loops. `while ( test_for_issue() ) { fix_issue() }`, to pseudocode it. So the question goes to matching three or more of the same character.

If we were looking for any specific character, then `$char{3,}` would do it, but we're looking for anything. `[A-Z]` matches anything we're calling a ball in the Zuma context, and within the realm of regular expressions, we can group them with `([A-Z])`, and address it with `\1`. So, that's `while ( $board =~ /([A-Z])\1\1/mx) { ... }` to find 'em, and then we use substitution to do the fix. `$board =~ /([A-Z])\1\1+//gmx` does that substitution to everything that fits, and then we loop and try again.

And from there, there are things that just cut down on time. We're given a hand and a board. Take the second example hand, `WRBRW`. When we're testing, it just doesn't matter if we take the first or the second `W` or the first or second `R`, so I sort them and run `uniq` and `first` to only run `BRW`, while being sure to pass on the secondary `R` and `W` to the next recursion, because , ... `ahem` ...

_This Looks Like A Job For **Recursion!**_ 

I'm going to have to put that on RedBubble some day.

Anyway, similarly, as mentioned with the `WWBBWW` board, When we add in a `B`, it doesn't matter if we add it between the `B`s, before the first `B` or after the last. I often do something like `next if $hash{$hand}{$board}++`. Any truthiness to `$hash{$hand}{$board}` would result in going on to the next position.

I will admit that I did play a little with [Memoize](https://metacpan.org/pod/Memoize), but I wrote by passing hashes. If I used `zuma( $board, $hand, $used )`, then I probably would've been able make more use of it and thus worrying less about editing out unuseful paths, but alas, I am happy with what I have.

I suppose that means I have to get to what `$used` is for. I believe that naming variables counts as documentation, at least the most tertiary versio of it, and so `$used` is the balls that have been *used*, concatenated in order, and when we get, for example, a `2`, that means we got to a satisfactory ending by adding two characters/balls to `$used`, so `length $used` is `2`.

Within the recursion, I only save a value if it's `0` or greater, when I return, I return either the minimum value or `-1`, which handles a lot of thing very cleanly. This may have lots and lots of paths that end in failure, but we can just ignore them. `min`, of course, comes from List::Util.

And then there's `substr`. It is wonderful because it can be used as both an **lvalue** and an **rvalue**. By rvalue, I mean you can put it in the right side of an expression. `$value = substr($string,0,4)`, for example. It can also be assigned to, making it an lvalue. `substr( $string, 0, 0) = 'This string now starts with this sentence.`, for example. Very, very cool.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use List::Util qw{ first max min uniq };

my @examples = (

    { board => "WRRBBW",   hand => "RB" },
    { board => "WWRRBBWW", hand => "WRBRW" },
    { board => "G",        hand => "" },
    { board => "",         hand => "GGGGG" },
    { board => "GG",       hand => "GGGGG" },
    { board => "G",        hand => "GGGGG" },
);

for my $example (@examples) {
    $example->{hand} = join '', sort split //, $example->{hand};
    $example->{used} = '';
    my @output = zuma($example);
    my $output = join ' ', @output;
    my ( $board, $hand ) = map { $example->{$_} } qw{board hand};
    say <<"END";
    Input:  \$board = "$board", \$hand = "$hand"
    Output: $output
END
}

sub zuma ($example) {
    my @output;
    my %done;
    my ( $board, $hand, $used ) =
        map { $example->{$_} || '' } qw{board hand used};
    my $lboard = length $board || 0;
    my $lhand  = length $hand  || 0;
    my $lused  = length $used  || 0;

    # you've run out of balls on the board and have thus won
    if ( length $board == 0 ) { return $lused; }

    # You've run out of balls and cannot win
    if ( length $hand == 0 ) { return -1; }

    my @chars = uniq sort split //, $hand;
    for my $h (@chars) {
        my $chand = $hand;
        my $i =
            first { substr( $chand, $_, 1 ) eq $h } 0 .. -1 + length $chand;
        substr( $chand, $i, 1 ) = '';
        for my $j ( 0 .. length $board ) {
            my $cboard = $board;
            substr( $cboard, $j, 0 ) = $h;
            while ( $cboard =~ m{([A-Z])\1\1}mx ) {
                $cboard =~ s/([A-Z])\1\1+//gmx;
            }
            next if $done{$chand}{$cboard}++;
            my $obj = {};
            $obj->{board} = $cboard;
            $obj->{hand}  = $chand;
            $obj->{used}  = $used . $h;
            my $o = zuma($obj);
            push @output, $o if $o >= 0;
        }
    }
    @output = uniq sort { $a <=> $b } grep { defined } @output;
    if ( scalar @output ) { return min @output; }
    return -1;
}
```

```text
$ ./ch-2.pl
    Input:  $board = "WRRBBW", $hand = "RB"
    Output: -1

    Input:  $board = "WWRRBBWW", $hand = "WRBRW"
    Output: 2

    Input:  $board = "G", $hand = ""
    Output: -1

    Input:  $board = "", $hand = "GGGGG"
    Output: 0

    Input:  $board = "GG", $hand = "GGGGG"
    Output: 1

    Input:  $board = "G", $hand = "GGGGG"
    Output: 2
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
