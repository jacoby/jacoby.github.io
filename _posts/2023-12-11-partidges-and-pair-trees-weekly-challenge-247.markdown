---
layout: post
title:  "Partridges and Pair Trees: Weekly Challenge #247"
author: "Dave Jacoby"
date:   "2023-12-11 14:57:32 -0500"
categories: ""
---

It is now time for [Weekly Challenge #247](https://theweeklychallenge.org/blog/perl-weekly-challenge-247/) **247** is the product of **13** and **19**, making it a [brillant number](https://www.alpertron.com.ar/BRILLIANT.HTM).

### Task 1: Secret Santa

> Submitted by: Andreas Voegele  
> Secret Santa is a Christmas tradition in which members of a group are randomly assigned a person to whom they give a gift.  
>  
> You are given a list of names. Write a script that tries to team persons from different families.  

#### Let's Talk About This

With Secret Santas, there are two crucial rules.

* Every participant must receive a gift
* No participant should receive a gift from themselves

To avoid someone gifting themselves, we create an array of participants and remove that person. We then randomize the order of that list (because people shouldn't know who their Santa is) and going through that array, choosing the first who hasn't already been chosen.

Problem, this can sometimes end with someone gifting themselves, or, because we have made it so we can't do that, a participant neither gifting or receiving, thus not participating.

I *might* look at this problem and start thinking about this another way, saying things like **"This Looks Like A Job For Recursion!"**, but then, the simpler way is to wrap it up with a loop, and when the number of participants isn't equal to the number of matched participants, give up, erase the hash table, and start again.

A note: I use clever `for` functionality — `delete $done{$_} foreach keys %done` — but probably could've gone with `%done = []`, but I have writen what I have written.

I also use a fair amount of functional programming, but that's mostly for the display, and entirely commented in place. It seemed like a good and didactic decision, but I normally believe that comments are less for what the code is doing (because the code says what it's doing) and more for why. For the display code, I want it to always sort `"Dr. Alpha", "Mr. Alpha", "Mrs. Alpha", "Mr. Beta"` that way, with the sort of the surname taking precedence, but sorting by title for those with the same surname. I like the consistency, y'know. I am able to go back to the [Schwartzian Transform](https://jacoby.github.io/javascript/2018/11/07/schwartzian-transforms-in-javascript.html) for this purpose. It's a technique where, once you understand it, you find reason to use it all over.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @examples = (

    [
        'Mr. Wall',
        'Mrs. Wall',
        'Mr. Anwar',
        'Mrs. Anwar',
        'Mr. Conway',
        'Mr. Cross',
    ],

    [ 'Mr. Wall', 'Mrs. Wall', 'Mr. Anwar', ],
);

for my $example (@examples) {
    my %output = secret_santa( $example->@* );
    my $input  = join ",\n\t", map { qq{"$_"} }    # quote surname
        map  { $_->[0] }                           # remove surname element
        sort { $a->[1] cmp $b->[1] }               # sort on surname
        map {
        [ $_, ( reverse split /\s/, $_ )[0] ]
        }    # start schartzian transform on surname
        sort { $a cmp $b } $example->@*; # sort alphabetically for consistency
    my $output = join "\n\t",
        map  { qq{$_ -> $output{$_}} }    # combine santa and giftee
        map  { $_->[0] }                  # remove surname element
        sort { $a->[1] cmp $b->[1] }      # sort on surname
        map {
        [ $_, ( reverse split /\s/, $_ )[0] ]
        }    # start schartzian transform on surname
        sort { $a cmp $b } keys %output; # sort alphabetically for consistency

    say <<~"END";
    Input:  \$input = (
            $input
            );
    Output:
            $output
    END

}

# 1) everybody gets matched
# 2) nobody gets matched to themself
sub secret_santa (@input) {
    my %done;

    while ( scalar keys %done < scalar @input ) {
        for my $name (@input) {
            my %chosen = reverse %done;
            my @others =
                sort { rand 10 <=> rand 10 } grep { $_ ne $name } @input;
            for my $giftee (@others) {
                next if $chosen{$giftee};
                $done{$name} = $giftee;
            }
        }

        # if, at the end of the array, there's a missing person,
        #   delete the whole hash table and start again
        if (scalar keys %done < scalar @input ) {
            delete $done{$_} foreach keys %done;
        }
    }
    return %done;
}
```

```text
$ ./ch-1.pl 
Input:  $input = (
        "Mr. Anwar",
        "Mrs. Anwar",
        "Mr. Conway",
        "Mr. Cross",
        "Mr. Wall",
        "Mrs. Wall"
        );
Output:
        Mr. Anwar -> Mr. Wall
        Mrs. Anwar -> Mr. Anwar
        Mr. Conway -> Mrs. Anwar
        Mr. Cross -> Mrs. Wall
        Mr. Wall -> Mr. Conway
        Mrs. Wall -> Mr. Cross

Input:  $input = (
        "Mr. Anwar",
        "Mr. Wall",
        "Mrs. Wall"
        );
Output:
        Mr. Anwar -> Mrs. Wall
        Mr. Wall -> Mr. Anwar
        Mrs. Wall -> Mr. Wall
```

### Task 2: Most Frequent Letter Pair

> Submitted by: Jorg Sommrey  
> You are given a string S of lower case letters 'a'..'z'.
>
> Write a script that finds the pair of consecutive letters in S that appears most frequently. If there is more than one such pair, chose the one that is the lexicographically first.

#### Let's Talk About This

I'd be tempted to turn the string into an array and work with slices, but really, no need. `substr` is your friend, and so is `length`, with -1 to the index because computers start at zero and another -1 because we only want pairs of characters. Then, `$hash{$key}++` will mean every pair will be counted.

Then we 1) sort lexically (because the example mentions that) and then 2) sort by the count. I could `shift` or something, but what I do is `($scalar) = @list`, which assigns the first value in `@list` to `$scalar`.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @examples = (

    'abcdbca',
    'cdeabeabfcdfabgcd',
);

for my $e (@examples) {
    my $output = most_frequent_letter_pair($e);

    say <<~"END";
    Input:  \$input = '$e'
    Output:          '$output'
    END
}

sub most_frequent_letter_pair ($string) {
    my %data;
    for my $i ( 0 .. -2 + length $string ) {
        my $sub = substr $string, $i, 2;
        $data{$sub}++;
    }

    # ($scalar) = @list will assign the first element in the list to $scalar
    my ($first) = sort { $data{$b} <=> $data{$a} }    # second sort on value
        sort keys %data;    # first sort on lexographic value
    return $first;
}
```

```text
$ ./ch-2.pl 
Input:  $input = 'abcdbca'
Output:          'bc'

Input:  $input = 'cdeabeabfcdfabgcd'
Output:          'ab'
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
