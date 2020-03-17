---
layout: post
title: "Minimax, British Coins and Old-School AI in Perl"
author: "Dave Jacoby"
date: "2020-03-16 19:36:00 -0400"
categories: ""
---

Again, this is inspired by the [Perl Weekly Challenge]()

## Task 1 - Stepping Numbers

> Write a script to accept two numbers between 100 and 999. It should then print all Stepping Numbers between them.
> 
> > A number is called a stepping number if the adjacent digits have a difference of 1. For example, 456 is a stepping number but 129 is not.

And, I'm assuming `454` is a stepping number, as is `654`.

I _could_ and probably _should_ stress on making sure that the code only handles sane values, maybe by removing or converting non-digit values in `@ARGV` and ensuring it only has three-digit numbers, but hey, it's toy code, right?

I made a function, `off_by_one`, that's three lines, but if I had done `1 == abs $i - $j` instead, it could be two lines. Ah, well, I've already done the PR.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental::postderef experimental::signatures };

if ( scalar @ARGV > 1 ) {
    my @nums = sort grep { $_ >= 100 && $_ <= 999 } map { int } @ARGV;
    my @list = get_stepping_numbers( $nums[0], $nums[-1] );
    say join ", ", @list;
}
else {
    my @list = get_stepping_numbers( 100, 999 );
    say join ", ", @list;
}

sub get_stepping_numbers ( $low, $high ) {
    my @output;
    for my $n ( $low .. $high ) {
        my @n = split //, $n;
        push @output, $n
            if off_by_one( $n[0], $n[1] ) && off_by_one( $n[1], $n[2] );
    }
    return @output;
}

sub off_by_one ( $i, $j ) {
    return 1 if $i == $j + 1;
    return 1 if $i == $j - 1;
    return 0;
}
```


## Task 2 - Lucky Winner

> Suppose there are following coins arranged on a table in a line in random order.
> 
> > £1, 50p, 1p, 10p, 5p, 20p, £2, 2p
> 
> Suppose you are playing against the computer. Player can only pick one coin at a time from either ends. Find out the lucky winner, who has the larger amounts in total?

There's a bunch of this has solutions I have used and blogged recently.

* **random** => `List::Util::shuffle`
* **British coinage** => hash table to decimal value, function for ease of use
* **playing against the computer** => `while` loops and `STDIN`

And ...

A while ago, I saw a video of a guy coding Tic-Tac-Toe in Javascript, using recursion and [the Minimax algorithm](https://en.wikipedia.org/wiki/Minimax) to make an in-browser game that played you to a standstill, because 1) the power of laptops today dwarfs the power of supercomputers in the 1980s, and 2) `The only winning move is not to play`.

And of course, [xkcd has mapped the optimal moves for Tic-Tac-Toe](https://xkcd.com/832/).

[ ![xkcd's tic-tac-toe map]( https://jacoby.github.io/images/tic_tac_toe.png ) ](https://xkcd.com/832/)

Time was, this was what they played with to teach computers to play chess, but the number of possible chess games is greater than the number of atoms in the observable universe. With Tic-Tac-Toe, you can only get 9 recursions deep, and with our all-coins game, only 8.

But when I worked on this, I was working off of my memory, and while I remembered that it uses recursion, I don't think I have the decision stuff optimized, because sometimes it pulls from left when "to me" the obvious choice is to pull from the right, and vice versa.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ fc postderef say signatures state switch };
no warnings qw{ 
    experimental::postderef 
    experimental::signatures 
    experimental::smartmatch 
    };

use utf8;
binmode STDOUT, ":encoding(UTF-8)";

use Carp;
use JSON;
use List::Util qw{ sum0 shuffle };

my $json = JSON->new->pretty->canonical;

# Suppose there are following coins arranged on a table
# in a line in random order.

#   £1, 50p, 1p, 10p, 5p, 20p, £2, 2p

# Suppose you are playing against the computer. Player
# can only pick one coin at a time from either ends.
# Find out the lucky winner, who has the larger amounts in total?

###########################################
# So, a game. A contest between the computer and the user
# about pulling coins of certain values from the left or
# right of a randomly-ordered set of coins.

#   * random order -> List::Util::shuffle
#   * from the right or left -> shift or pop
#   * pick one coin at a time -> while loop and STDIN.

# Which leaves how to determine what the best move is.
# I think the correct term is "decision trees", where the 
# computer iterates through all possible moves, then the 
# possible moves of the  opponent, then self, and over again, 
# until it determines all possible  outcomes, then judges 
# the best possible outcome and makes the choice.

# I saw a youtube video on how to code Tic-Tac-Toe in JS,
# which mentioned that this methodology is broken for 
# Chess, because the number of possible games is greater 
# than the number of atoms in the observable universe.
# Or someting like that.

# but given eight coins, we can only go so deep. 

my @coins = shuffle ( "£1", "50p", "1p", "10p", "5p", "20p", "£2", "2p" );
my @h_list;
my @c_list;
my @history;

while ( scalar @coins ) {
    display( \@coins, \@c_list, \@h_list, 1, \@history );

    my $coins = join ' ', @coins;
    say <<"END";
    Choose "L" or "R" to pick a coin from the list
    Or "Q" to quit

END
    print q{Choose(L/R/Q):};
    my $choice = uc <STDIN>;
    chomp $choice;

    if ( $choice eq 'Q' ) { say 'Good Game!' && exit; }
    if ( $choice eq 'L' || $choice eq 'R' ) {
        choice( 'HUMAN', $choice );
        my ( $comp, $score ) =
          decision_tree( \@coins, \@c_list, \@h_list, 1, \@history );
        choice( 'COMPUTER', $comp );
    }
}

display( \@coins, \@c_list, \@h_list, 1, \@history );
my $c_score = sum0 map { value($_) } @c_list;
my $h_score = sum0 map { value($_) } @h_list;

if ( $h_score > $c_score ) {
    say uc 'you won';
}
elsif ( $h_score == $c_score ) {
    say uc 'a tie!';
}
else { say uc 'too bad' }

# handles the array mangling behind a choice, either by human or computer
sub choice ( $player, $choice ) {
    my $coin;
    if ( $choice eq 'L' ) { $coin = shift @coins; }
    else {
        $coin = pop @coins;
    }

    if ( $player eq 'HUMAN' ) {
        push @h_list, $coin;
        push @history, join '', $choice, 'H';
    }
    else {
        push @c_list, $coin;
        push @history, join '', $choice, 'C';
    }
}

sub display ( $coins, $c_list, $h_list, $pos, $history ) {
    say '-' x 30;
    say 'COINS:    ' . join ', ', $coins->@*;
    say '          ' . sum0 map { value($_) } $coins->@*;
    say 'COMPUTER  ' . join ', ', $c_list->@*;
    say '          ' . sum0 map { value($_) } $c_list->@*;
    say 'HUMAN     ' . join ', ', $h_list->@*;
    say '          ' . sum0 map { value($_) } $h_list->@*;
    say 'POSITION  ' . $pos;
    say 'HISTORY   ' . join ', ', $history->@*;
    say '';
}

sub decision_tree ( $coins, $c_list, $h_list, $pos, $history, $depth = 0 ) {

    # croak 'Too Few Coins' if scalar @$coins < 2;
    # display( $coins, $c_list, $h_list, $pos, $history );

    if ( scalar @$coins == 0 ) {

        # display( $coins, $c_list, $h_list, $pos, $history );
        my $c_sum = sum0 map { value($_) } $c_list->@*;
        my $h_sum = sum0 map { value($_) } $h_list->@*;
        return ( 'L', $c_sum + 100 ) if $c_sum > $h_sum;
        return ( 'L', $c_sum );

    }

    my $left;
    my $right;
    {
        my $lhist;
        @$lhist = @$history;
        push @$lhist, join '', 'L', $pos ? 'C' : 'H';
        my $lcoins;
        my $clist;
        my $hlist;
        @$lcoins = @$coins;
        @$clist  = @$c_list;
        @$hlist  = @$h_list;
        my $coin = shift @$lcoins;
        if   ($pos) { push @$clist, $coin }
        else        { push @$hlist, $coin }
        ( undef, $left ) =
          decision_tree( $lcoins, $clist, $hlist, int !$pos, $lhist,
            $depth + 1 );
    }
    {
        my $lhist;
        @$lhist = @$history;
        push @$lhist, join '', 'R', $pos ? 'C' : 'H';
        my $lcoins;
        my $clist;
        my $hlist;
        @$lcoins = @$coins;
        @$clist  = @$c_list;
        @$hlist  = @$h_list;
        my $coin = pop @$lcoins;
        if   ($pos) { push @$clist, $coin }
        else        { push @$hlist, $coin }
        ( undef, $right ) =
          decision_tree( $lcoins, $clist, $hlist, int !$pos, $lhist,
            $depth + 1 );
    }

    # say join qq{\t}, $depth, 'LEFT', $left, 'RIGHT', $right;

    if ( $left > $right ) {
        return ( 'L', $left + 10 );
    }
    elsif ( $left < $right ) {
        return ( 'R', $right + 10 );
    }
    else {
        return ( 'R', $right );
    }
}

# IIRC, British coinage has gone decimal, so this is roughly the value of
# each of the coins, placed into a fuction so I can't accidentally change
# values
sub value( $coin ) {
    state $hash = {
        "£1" => 100,
        "£2" => 200,
        "10p" => 10,
        "1p"  => 1,
        "20p" => 20,
        "2p"  => 2,
        "50p" => 50,
        "5p"  => 5,
    };
    return $hash->{$coin} ? $hash->{$coin} : 0;
}
```

One example run:

```text
💻 jacoby@Marvin 20:18 43°F    _  ~/Dropbox 
$ ./decision_tree.pl 
------------------------------
COINS:    1p, £2, 5p, £1, 2p, 10p, 50p, 20p
          388
COMPUTER  
          0
HUMAN     
          0
POSITION  1
HISTORY   

    Choose "L" or "R" to pick a coin from the list
    Or "Q" to quit


Choose(L/R/Q):r
------------------------------
COINS:    1p, £2, 5p, £1, 2p, 10p
          318
COMPUTER  50p
          50
HUMAN     20p
          20
POSITION  1
HISTORY   RH, RC

    Choose "L" or "R" to pick a coin from the list
    Or "Q" to quit


Choose(L/R/Q):r
------------------------------
COINS:    1p, £2, 5p, £1
          306
COMPUTER  50p, 2p
          52
HUMAN     20p, 10p
          30
POSITION  1
HISTORY   RH, RC, RH, RC

    Choose "L" or "R" to pick a coin from the list
    Or "Q" to quit


Choose(L/R/Q):r
------------------------------
COINS:    1p, £2
          201
COMPUTER  50p, 2p, 5p
          57
HUMAN     20p, 10p, £1
          130
POSITION  1
HISTORY   RH, RC, RH, RC, RH, RC

    Choose "L" or "R" to pick a coin from the list
    Or "Q" to quit


Choose(L/R/Q):r
------------------------------
COINS:    
          0
COMPUTER  50p, 2p, 5p, 1p
          58
HUMAN     20p, 10p, £1, £2
          330
POSITION  1
HISTORY   RH, RC, RH, RC, RH, RC, RH, RC

YOU WON
```

I would like to reconsider this and find ways to make it harder, but as a whole, I'm happy with this code.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
