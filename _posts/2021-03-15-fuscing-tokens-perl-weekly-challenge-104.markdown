---
layout: post
title: "FUSCing Tokens: Perl Weekly Challenge 104"
author: "Dave Jacoby"
date: "2021-03-15 19:00:13 -0400"
categories: ""
---

Here we go again!

### TASK #1 › FUSC Sequence

> Submitted by: Mohammad S Anwar  
> Write a script to generate first 50 members of FUSC Sequence. Please refer to OEIS for more information.\_
>
> The sequence defined as below:
>
> fusc(0) = 0  
> fusc(1) = 1  
> for n > 1:  
> when n is even: fusc(n) = fusc(n / 2),  
> when n is odd: fusc(n) = fusc((n-1)/2) + fusc((n+1)/2)

Reading the [Online Encyclopedia of Integer Sequences](http://oeis.org/A002487) about this confused me, in part because the
`row` business below confused me.

```text
If the terms are written as an array:

column 0 1 2 3 4 5 6 7 8 9 ...

row 0: 0

row 1: 1

row 2: 1,2

row 3: 1,3,2,3

row 4: 1,4,3,5,2,5,3,4

row 5: 1,5,4,7,3,8,5,7,2,7,5,8,3,7,4,5

row 6: 1,6,5,9,4,11,7,10,3,11,8,13,5,12,7,9,2,9,7,12,5,13,8,11,3,10,...
```

So, then I looked at [Rosetta Code](https://rosettacode.org/wiki/Fusc_sequence#Perl), first at non-Perl solutions, then at the Perl solution. That confused me because I thought that `comma` had something to do with the answer, but instead was answering a Rosetta Code-specific thing. `stern_diatomic` as a function name didn't make sense to me, and I've done little enough bitwise operators that it took a few readings to see what it's actually doing, and I don't fully see it. I _was_ able to use it to check my math when I finally got it.

> fusc(0) = 0  
> fusc(1) = 1  
> for n > 1:  
> when n is even: fusc(n) = fusc(n / 2),  
> when n is odd: fusc(n) = fusc((n-1)/2) + fusc((n+1)/2)

`fusc(n)` is defined in terms of `fusc(less_than_n)`.

[**This looks like a job for _Recursion!_**](https://www.google.com/search?q=%22this+looks+like+a+job+for+recursion%21%22)

Once you get what you're _not_ asked for, you can get back to the simple rules we're given and move forward.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

say join ', ', map { fusc($_) } 0 .. 60;

sub fusc ( $n ) {

    # fusc(0) = 0
    # fusc(1) = 1
    return $n if $n < 2;

    # when n is even: fusc(n) = fusc(n / 2),
    return fusc( int $n / 2 ) if $n % 2 == 0;

    # when n is odd: fusc(n) = fusc((n-1)/2) + fusc((n+1)/2)
    return fusc( int( $n - 1 ) / 2 ) + fusc( ( $n + 1 ) / 2 );
}

exit;
```

```text
# LINE BREAKS ADDED FOR READABILITY

    0, 1, 1, 2, 1, 3, 2, 3, 1, 4, 3, 5, 2, 5, 3, 4, 1, 5, 4, 7, 3,
    8, 5, 7, 2, 7, 5, 8, 3, 7, 4, 5, 1, 6, 5, 9, 4, 11, 7, 10, 3,
    11, 8, 13, 5, 12, 7, 9, 2, 9, 7, 12, 5, 13, 8, 11, 3, 10, 7,
    11, 4
```

### TASK #2 › NIM Game

> Submitted by: Mohammad S Anwar  
> Write a script to simulate the NIM Game.
>
> It is played between 2 players. For the purpose of this task, let assume you play against the machine.
>
> There are 3 simple rules to follow:
>
> a) You have 12 tokens  
> b) Each player can pick 1, 2 or 3 tokens at a time  
> c) The player who picks the last token wins the game

The challenges are, of course:

1. Opponent "AI"
2. User Input
3. Judging

This _could_ have been a Recursion solution, but this time, it didn't seem to call for it.

#### Opponent "AI"

This was simple:

- If there are three tokens, take the win
- If there are two tokens, take the win
- Otherwise, take one token

I could imagine writing a smarter opponent who would try to push the user to where there are four tokens, but that's a lot more clever than we're asked for in this task. Maybe next time?

#### User Input

Two big questions:

- How to get the inputs?
- What are acceptable inputs?

We use the _diamond operator_ (`<>`) to get input, and then remove things we don't want.

```perl
    my $d = <>;
    $d =~ s/\D//gmix;
```

The choices are 1, 2 or 3 tokens. Except if there are two available tokens, you _can't_ take three tokens.

```perl
    my $max = 3;
    $max = $tokens if $tokens < $max;
    my $list = join ', ', 1 .. $max;

    ...

    my $c;
    while ( !defined $c ) {
        say qq{    Choose your tokens ($list)};
        my $d = <>;
        $d =~ s/\D//gmix;
        if ( length $d > 0 && $d > 0 && $d <= $max ) { $c = $d }
        else                                         { say 'Not valid input' }
    }
    return $c
```

With some regex work, we can ensure that `$d`, the input, is either an empty string, zero, or a positive integer. `length $d > 0` ensures it's not an empty string, and `$d > 0` ensures it's not a zero. Now we need to make sure that it's less than `$max`.

(I _could_ do `$c = <>` and `$c = undef unless is_valid($c)`, but I think that this solution is more readable when I come back to it later.)

#### Judging

In my first pass, I did the opponent's choice first. I would first remove the opponent's choice from the token value and test if it was zero, and I wasn't getting the `Winner` announcement I expected, so I tested if `$op == $tokens` instead, exiting if true, and then doing `$tokens -= $op`. There must have been a reason why my expected tests weren't happy, but I'm happy with it now.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

nim_game(12);

sub nim_game( $tokens ) {
    my $plural;
    while ($tokens) {
        $plural = $tokens == 1 ? 'token' : 'tokens';
        say qq{There are $tokens $plural};

        # you
        my $pp = player_choice($tokens);
        $plural = $pp == 1 ? 'token' : 'tokens';
        say qq{    You chose $pp $plural \n};
        if ( $tokens == $pp ) {
            say 'You have won!';
            exit;
        }
        $tokens -= $pp;

        # opponent
        my $op = opponent_choice($tokens);
        $plural = $op == 1 ? 'token' : 'tokens';
        say qq{    Opponent chose $op $plural \n};
        if ( $tokens == $op ) {
            say 'Opponent has won!';
            exit;
        }
        $tokens -= $op;
    }
}

sub player_choice( $tokens ) {
    my $max = 3;
    $max = $tokens if $tokens < $max;
    my $list = join ', ', 1 .. $max;
    my $c;
    while ( !defined $c ) {
        say qq{    Choose your tokens ($list)};
        my $d = <>;
        $d =~ s/\D//gmix;
        if ( length $d > 0 && $d > 0 && $d <= $max ) { $c = $d }
        else                                         { say 'Not valid input' }
    }
    return $c;
}

# sneaky opponent AI
sub opponent_choice( $tokens ) {
    return 3 if $tokens == 3;
    return 2 if $tokens == 2;
    return 1;
}
```

```text
There are 12 tokens
    Choose your tokens (1, 2, 3)
3
    You chose 3 tokens 

    Opponent chose 1 token 

There are 8 tokens
    Choose your tokens (1, 2, 3)
2
    You chose 2 tokens 

    Opponent chose 1 token 

There are 5 tokens
    Choose your tokens (1, 2, 3)
1
    You chose 1 token 

    Opponent chose 1 token 

There are 3 tokens
    Choose your tokens (1, 2, 3)
3
    You chose 3 tokens 

You have won!
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
