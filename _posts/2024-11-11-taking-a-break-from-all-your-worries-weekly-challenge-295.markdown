---
layout: post
title: "Taking A Break From All Your Worries: Weekly Challenge #295"
author: "Dave Jacoby"
date: "2024-11-11 17:40:07 -0500"
categories: ""
---

Welcome to [**Weekly Challenge #295!**](https://theweeklychallenge.org/blog/perl-weekly-challenge-295/) **295** is a compound number, the product of **5** and **59**.

I didn't submit an answer last week, because the second task indicated it needed an **O(n)** answer, and I was thinking that my solution was **O(nlogn)** and couldn't think through and find a better answer.

### Task 1: Word Break

> Submitted by: Mohammad Sajid Anwar
>
> You are given a string, `$str`, and list of words, `@words`.
>
> Write a script to return `true` or `false` whether the given string can be segmented into a space separated sequence of one or more words from the given list.

#### Let's Talk About It

There's a very good test case for this. `$str = "sonsanddaughters"` and `@words => [ "sons", "sand", "daughters" ]`. Let us go through this.

Each word is within the example text:

* "**sons**anddaughters"
* "son**sand**daughters"
* "sonsand**daughters**"

The problem comes because you cannot join **sons** and **sand** to make **sonsand**, but only **sonssand**. I decided that, rather than trying permutation and joining, it'd be easier to use regular expressions and **remove** options. Loop through each word in `@words` and see if it can be found within `$str`. If it can, remove it. If it can't, return `false`.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

my @examples = (

    { str => 'weeklychallenge',  words => [ "challenge", "weekly" ] },
    { str => "perlrakuperl",     words => [ "raku",      "perl" ] },
    { str => "sonsanddaughters", words => [ "sons", "sand", "daughters" ] },
);

for my $example (@examples) {
    my $output = word_break($example);
    my $str    = $example->{str};
    my $words  = join ', ', map { qq{"$_"} } $example->{words}->@*;
    say <<"END";
    Input:  \$str   = $str,
            \@words = ($words)
    Output: $output
END
}

sub word_break ($object) {
    my $str   = $object->{str};
    my @words = $object->{words}->@*;
    for my $word (@words) {
        if ( $str =~ /$word/ ) { $str =~ s/$word//; }
        else                   { return 'false' }
    }
    return 'true';
}
```

```text
$ ./ch-1.pl
    Input:  $str   = weeklychallenge,
            @words = ("challenge", "weekly")
    Output: true

    Input:  $str   = perlrakuperl,
            @words = ("raku", "perl")
    Output: true

    Input:  $str   = sonsanddaughters,
            @words = ("sons", "sand", "daughters")
    Output: false

```

### Task 2: Jump Game

> Submitted by: Mohammad Sajid Anwar
>
> You are given an array of integers, `@ints`.
>
> Write a script to find the minimum number of jumps to reach the last element. `$ints[$i]` represents the maximum length of a forward jump from the index `$i`. In case last element is unreachable then return `-1`.

#### Let's Talk About It

**This** looks like a **job** for **_Recursion!_**

It really does.

If `n` is in a given position, that means that any positon between `1` and `n` is possible, and if you land on a position where `n == 0`, you are stuck and cannot move forward.

So, the win and loss conditions go first, because recursion. If we jump to the right spot, we return the depth because we've won. If not, we return nothing.

After that, we loop through the possible jumps, incrementing the depth, pushing what we get out into an array.

We don't need every result, just the lowest result greater than `-1`, so that's `grep` to ensure non-negative results and `min` from [List::Util](https://metacpan.org/pod/List::Util), that very useful module, to only return the best win, if there's anything in the output array. And, if not, return `-1`.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use List::Util qw{min};

my @examples = (

    [ 4 ], # win from beginning
    [ 4, 1 ], # one-round win
    [ 2, 3, 1, 1, 4 ],
    [ 2, 3, 0, 4 ],
    [ 2, 0, 0, 4 ], # unwinnable
);

for my $example (@examples) {
    my $output = jump_game($example);
    my $input  = join ', ', $example->@*;
    say <<"END";
    Input:  \$ints = ($input)
    Output: $output
END
}

sub jump_game ( $ints, $position = 0, $depth = 0 ) {
    my @output;
    my $last = -1 + scalar @$ints;          # address of target
    return $depth if $position == $last;    # win condition
    return        if $position > $last;     # lose condition
    my $v = $ints->[$position];
    for my $i ( 1 .. $v ) {     # zero means infinite loop
        my $j = $i + $position; # next position
        push @output, jump_game( $ints, $j, $depth + 1 );
    }
    @output = grep {$_ > -1} @output;
    return min @output if scalar @output;
    return -1;
}
```

```text
$ ./ch-2.pl 
    Input:  $ints = (4)
    Output: 0

    Input:  $ints = (4, 1)
    Output: 1

    Input:  $ints = (2, 3, 1, 1, 4)
    Output: 2

    Input:  $ints = (2, 3, 0, 4)
    Output: 2

    Input:  $ints = (2, 0, 0, 4)
    Output: -1
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
