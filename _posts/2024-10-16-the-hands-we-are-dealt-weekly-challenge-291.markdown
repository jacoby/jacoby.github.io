---
layout: post
title: "The Hands We Are Dealt: Weekly Challenge #291"
author: "Dave Jacoby"
date: "2024-10-16 14:47:07 -0400"
categories: ""
---

And we're on to **[Weekly Challenge #291](https://theweeklychallenge.org/blog/perl-weekly-challenge-291/)!** **291** is a multiple of 3, and it is the sum of the 52nd prime number (239), plus 52.

### Task 1: Middle Index

> Submitted by: Mohammad Sajid Anwar  
> You are given an array of integers, `@ints`.
>
> Write a script to find the leftmost middle index (MI) i.e. the smallest amongst all the possible ones.
>
> A middle index is an index where ints[0] + ints[1] + … + ints[MI-1] == ints[MI+1] + ints[MI+2] + … + ints[ints.length-1].
>
> > If `MI == 0`, the left side sum is considered to be `0`. Similarly, if `MI == ints.length - 1`, the right side sum is considered to be `0`. Return the leftmost MI that satisfies the condition, or `-1` if there is no such index.

#### Let's Talk About It

The key to remember is that `i` is not at play. Given a seven-element array and we're looking at element 4, the left will be elements 0-3 and the right will be elements 5-6.

We're looking for the lowest, so we iterate through indexes starting at 0, and pull out perrenial favorite [List::Util](https://metacpan.org/pod/List::Util) and `sum0`, with `my $suml = sum0 @array[ 0 .. $i - 1 ]` and `my $sumr = sum0 @array[ $i + 1 .. $l ]`.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use List::Util qw{ sum0 };

my @examples = (

    [ 2, 3,  -1, 8, 4 ],
    [ 1, -1, 4 ],
    [ 2, 5 ],
);

for my $example (@examples) {
    my $output = middle_index( $example->@* );
    my $input  = join ', ', $example->@*;
    say <<"END";
    Input:  \$ints = ($input)
    Output: $output
END
}

sub middle_index (@array) {
    my $l = -1 + scalar @array;
    for my $i ( 1 .. $l ) {
        my $suml = sum0 @array[ 0 .. $i - 1 ];
        my $sumr = sum0 @array[ $i + 1 .. $l ];
        return $i if $suml eq $sumr;
    }
    return -1;
}
```

```text

```

#### Task 2: Poker Hand Rankings

> Submitted by: Robbie Hatley  
> A draw poker hand consists of 5 cards, drawn from a pack of 52: no jokers, no wild cards. An ace can rank either high or low.
>
> Write a script to determine the following three things:

1. How many different 5-card hands can be dealt?
2. How many different hands of each of the 10 ranks can be dealt?
   [See here for descriptions of the 10 ranks of Poker hands](https://en.wikipedia.org/wiki/List_of_poker_hands#Hand-ranking_categories)
3. Check the ten numbers you get in step 2 by adding them together
   and showing that they're equal to the number you get in step 1.

#### Let's Talk About It

Given a finite set of cards, there's a finite number of possible shuffles. That is 52 choices for the first card, then 51 choices for the second (because you can't repeat that first card), and so on. That gets into factorials, specifically `52!`. That number has been described as ["beyond astronomically large"](https://czep.net/weblog/52cards.html). That number is `80658175170943878571660636856403766975289505440883277824000000000000`. A bit hard to work with, huh?

But we don't care about the whole deck, but just the first five, because that constitutes the hand, so we're looking for `52! - 47!`, or more simply written, `52 * 51 * 50 * 49 * 48`, or `311,875,200`. That's still a _lot_, but that's still too big.

Why?

Consider this hand:

- King of Hearts
- Queen of Hearts
- Ace of Hearts
- Jack of Hearts
- Ten of Hearts

This is one way of organizing it. You could also do:

- Ace of Hearts
- King of Hearts
- Queen of Hearts
- Jack of Hearts
- Ten of Hearts

For purposes of this task, this does not matter, so the number of possible Poker hands is `(52! - 47!)/5!`, or `311875200 / 120`, or `2,598,960` possible hands.

Mathematically removing the permutations of each particular hand took a while for me, so I thought I would talk it through.

But knowing there are going to be a large number of loops makes it necessary to loop carefully. I add on to my general method for **O(nlogn)** (I think).

```perl
for my $i1 ( 0 .. 51 ) {
    for my $i2 ( $i1 + 1 .. 51 ) {
        for my $i3 ( $i2 + 1 .. 51 ) {
            for my $i4 ( $i3 + 1 .. 51 ) {
                for my $i5 ( $i4 + 1 .. 51 ) {
                    ...
                }
            }
        }
    }
}
```

There are 10 hands described in the link:

1. Five of a Kind
2. Straight Flush
3. Four of a kind
4. Full house
5. Flush
6. Straight
7. Three of a kind
8. Two pair
9. One pair
10. High card

The first hand, _five of a kind_, is impossible with the rules of this task, because it requires cheating or wildcards to get another of any card into any hand.

For most of these hands, counting and sorting the ranks will get you the information you need. If there's only one of any card and that comes up first in a high-low sort, that means there are no pairs and that a _high card_ hand. If the first count is 2 and the second is 1, that's a _pair_, and if the second is 2, that's _two pair_. A _full house_ would give us 3 and 2, and so on.

This brings us to flushes and straights. A _flush_ is a hand with every card in the same suite (and no hands with a pair can be a flush), and a _straight_ is a hand where all the cards are in sequential order. Aces can be counted as low card, so **ace, two, three, four, five**, or top card, so **ten, jack, queen, king, ace**, but it cannot bridge, so **queen, king, ace, two, three** is not a valid straight.

You can of course combine these, so there's a _straight flush_. A _royal flush_ is a special case where the straight is ace-to-ten.

The way determine flushes is by doing `uniq sort` on the suites (`uniq` from List::Util!) and if there's just one, that's a flush.

With straights, I handle them more numerically. When they're sorted low-high, the low number plus 4 should equal the high number. _**four** five six seven **eight**_, for example. The special case is when the low card is an ace (`1`), because then the next highest must be `10` and the highest must be a king (`13`).

Because a _five of a kind_ hand is impossible, I didn't write a tester for it.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use List::Util qw{ sum0 uniq };

my @deck;

# 1  = ace
# 11 = jack
# 12 = queen
# 13 = king
my @ranks  = reverse qw{1 2 3 4 5 6 7 8 9 10 11 12 13};
my @suites = qw{ C S H D };
for my $suite (@suites) {
    for my $rank (@ranks) {
        push @deck, join '', $suite, $rank;
    }
}

my $count = 0;
my %hands;

for my $i1 ( 0 .. 51 ) {
    for my $i2 ( $i1 + 1 .. 51 ) {
        for my $i3 ( $i2 + 1 .. 51 ) {
            for my $i4 ( $i3 + 1 .. 51 ) {
                for my $i5 ( $i4 + 1 .. 51 ) {
                    my @indexes = ( $i1, $i2, $i3, $i4, $i5 );
                    my @hand    = sort map { $deck[$_] } @indexes;
                    my $hand    = join ', ', @hand;
                    my $verdict = judge_hand(@hand);
                    $hands{$verdict}++;
                    $count++;
                }
            }
        }
    }
}

for my $k ( sort { no warnings;int $a <=> int $b } keys %hands ) {
    say join "\n\t", $k, display_large_number($hands{$k});
}

say display_large_number( sum0 values %hands );
say display_large_number($count);
exit;

sub judge_hand (@hand) {
    my @suites   = get_suites(@hand);
    my @ranks    = get_ranks(@hand);
    my $flush    = is_flush(@hand);
    my $straight = is_straight(@hand);

    return '2  straight flush'  if $straight && $flush;
    return '3  four of a kind'  if is_four_of_a_kind(@hand);
    return '4  full house'      if is_full_house(@hand);
    return '5  flush'           if $flush;
    return '6  straight'        if $straight;
    return '7  three of a kind' if is_three_of_a_kind(@hand);
    return '8  two pair'        if is_two_pair(@hand);
    return '9  one pair'        if is_one_pair(@hand);
    return '10 high card';
}

sub done (@hand) {
    state $hash;
    my $hand = join ' ', @hand;
    if ( $hash->{$hand} ) {
        return 1;
    }
    $hash->{$hand}++;
    return 0;
}

sub display_large_number ($num) {
    my $x   = '';
    my $mun = reverse $num;
    while ( length $mun > 3 ) {
        my $t = substr $mun, 0, 3;
        substr( $mun, 0, 3 ) = '';
        $x .= $t . ',';
    }
    $x .= $mun;
    $x = reverse $x;
    return $x;
}

sub is_flush (@hand) {
    my @suites = get_suites(@hand);
    return 1 if scalar @suites == 1;
    return 0;
}

sub is_straight (@hand) {
    my @ranks = get_ranks(@hand);
    return 1 if $ranks[4] == $ranks[0] + 4;
    return 1 if $ranks[0] == 1 && $ranks[1] == 10 && $ranks[4] == 13;
    return 0;
}

sub is_full_house (@hand) {
    my @ranks = get_ranks(@hand);
    my %ranks;
    for my $r (@ranks) {
        $ranks{$r}++;
    }
    my @v = sort { $b <=> $a } values %ranks;
    return 1 if $v[0] == 3 && $v[1] == 2;
    return 0;
}

sub is_two_pair (@hand) {
    my @ranks = get_ranks(@hand);
    my %ranks;
    for my $r (@ranks) {
        $ranks{$r}++;
    }
    my @v = sort { $b <=> $a } values %ranks;
    return 1 if $v[0] == 2 && $v[1] == 2;
    return 0;
}

sub is_one_pair (@hand) {
    my @ranks = get_ranks(@hand);
    my %ranks;
    for my $r (@ranks) {
        $ranks{$r}++;
    }
    my @v = sort { $b <=> $a } values %ranks;
    return 1 if $v[0] == 2 && $v[1] == 1;
    return 0;
}

sub is_three_of_a_kind (@hand) {
    my @ranks = get_ranks(@hand);
    my %ranks;
    for my $r (@ranks) {
        $ranks{$r}++;
    }
    my @v = sort { $b <=> $a } values %ranks;
    return 1 if $v[0] == 3 && $v[1] == 1;
    return 0;
}

sub is_four_of_a_kind (@hand) {
    my @ranks = get_ranks(@hand);
    my %ranks;
    for my $r (@ranks) {
        $ranks{$r}++;
    }
    my @v = sort { $b <=> $a } values %ranks;
    return 1 if $v[0] == 4 && $v[1] == 1;
    return 0;
}

sub get_ranks(@hand) {
    my @ranks = sort { $a <=> $b } map {
        my $x = $_;
        $x =~ s/\D//mx;
        $x
    } @hand;
    return @ranks;
}

sub get_suites(@hand) {
    my @suites = uniq sort
        map { my $x = $_; $x =~ s/\d+//mx; $x } @hand;
    return @suites;
}
```

```text
$ ./ch-2.pl
2  straight flush
        40
3  four of a kind
        624
4  full house
        3,744
5  flush
        5,108
6  straight
        71,096
7  three of a kind
        49,600
8  two pair
        111,744
9  one pair
        1,054,464
10 high card
        1,302,540
2,598,960
2,598,960
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
