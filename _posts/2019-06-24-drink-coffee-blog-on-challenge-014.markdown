---
layout: post
title: "Drink Coffee, Blog on Challenge 014"
author: "Dave Jacoby"
date: "2019-06-24 10:27:12 -0400"
categories: ""
---

[Perl Weekly Challenge #014 is out!](https://perlweeklychallenge.org/blog/perl-weekly-challenge-014/)

I worked on these last night while watching John Oliver, and now I blog!

## Challenge 1

> Write a script to generate Van Eck’s sequence starts with 0. For more information, please check out wikipedia page. This challenge was proposed by team member **Andrezgz**.

As always with the number play challenges, I have to read carefully and, if possible, get the expected answer for checking.

> Let a0 = 0. 
> Then, for n ≥ 0, if there exists an m < n such that am = an,
> take the largest such m and set an+1 = n − m;
> otherwise an+1 = 0.

There, that makes sense. Kinda. I just ran it on a series of numbers, rather than make a subroutine out if it. And, it seems, the best way to get `van_eck(40)`  is to loop and get `van_eck(0)` and `(1)` and so on. This does not naturally give itself over to a recursive solution.

Looking back, it seems like the better way (which is more _O(n)_ and less _O(nlogn)_), would be to reverse the `0..$n-1` range and `last` on the first one, rather than cover all of the range to find the highest, and if this was real and working on much higher numbers, I'd go there. But I was playing with `next` and `last` in the other challenge, so I left it.

```perl
#!/usr/bin/env perl

use strict ;
use warnings ;
use feature qw{ postderef say signatures state } ;
no warnings qw{ experimental::postderef experimental::signatures } ;

use Carp;

# Write a script to generate Van Eck’s sequence starts with 0.
# For more information, please check out wikipedia page.
# This challenge was proposed by team member Andrezgz.

# 0, 0, 1, 0, 2, 0, 2, 2, 1, 6, 0, 5, 0, 2, 6, 5, 4, 0, 5 ... [1]

# let a[0] = 0
my @a ;
push @a , 0;

for my $n ( 0 .. 30 ) {

    # otherwise a[n+1]=0
    $a[$n+1] = 0;

    # for n >= 0, if there exists an m < n such that a[m] == a[n],
    # take the largest such m and set a[n+1] = n-m,
    for my $m ( 0 .. $n -1 ) {
        $a[$n+1] = $n - $m if $a[$n]==$a[$m];
    }
    say qq{n = $n \t a[n] = $a[$n]};
}

__DATA__

n = 0 	 a[n] = 0
n = 1 	 a[n] = 0
n = 2 	 a[n] = 1
n = 3 	 a[n] = 0
n = 4 	 a[n] = 2
n = 5 	 a[n] = 0
n = 6 	 a[n] = 2
n = 7 	 a[n] = 2
n = 8 	 a[n] = 1
n = 9 	 a[n] = 6
n = 10 	 a[n] = 0
n = 11 	 a[n] = 5
n = 12 	 a[n] = 0
n = 13 	 a[n] = 2
n = 14 	 a[n] = 6
n = 15 	 a[n] = 5
n = 16 	 a[n] = 4
n = 17 	 a[n] = 0
n = 18 	 a[n] = 5
n = 19 	 a[n] = 3
n = 20 	 a[n] = 0
n = 21 	 a[n] = 3
n = 22 	 a[n] = 2
n = 23 	 a[n] = 9
n = 24 	 a[n] = 0
n = 25 	 a[n] = 4
n = 26 	 a[n] = 9
n = 27 	 a[n] = 3
n = 28 	 a[n] = 6
n = 29 	 a[n] = 14
n = 30 	 a[n] = 0
```

## Challenge 2

> Using only the official postal (2-letter) abbreviations for the 50 U.S. states, write a script to find the longest English word you can spell? Here is the list of U.S. states abbreviations as per wikipedia page. This challenge was proposed by team member **Neil Bowers**.

**Bring in the States!**

```text
    AL AK AZ AR CA CO CT DE FL GA
    HI ID IL IN IA KS KY LA ME MD
    MA MI MN MS MO MT NE NV NH NJ
    NM NY NC ND OH OK OR PA RI SC
    CD TN TX UT VT VA WA WV WI WY
```

This time, instead of my traditional, curated, collected from password researchers list of words, I went with `/usr/share/dict/words`. I also went through some clever on first pass, then realized that `while` and `shift` are not as good as `for` and `last`.

For each word, first I split apart each word with `/\w{2}/g`, turning `"DEAL"` into `["DE","AL"]`, and then rejoined them, comparing the output with the input, to make sure I have something valid to work with. Double-duty, this also ensured that words with odd numbers of letters, like `"DEALS"` were never in play.

If you're looking at `for (){ for () { next } }`, the assumption is that you're breaking out of the inner loop only, so label the outer loop as `FOR` (because naming is not where I wanted to waste my creativity) and ran `next FOR` to make sure the word is skipped.

I half-considered having `$longest` as a state variable, but no, I needed it outside so I just said the longest of the list.

When doing things like `$states{$wo} ? 1 : 0`, I do the ternary operator because otherwise I get `1` or `undef`, and that makes testing it a bit hairy. I suppose I should've put a defined or, but I've committed this code already, so eh.

```perl
#!/usr/bin/env perl

use feature qw{ say };
use strict;
use warnings;

# Using only the official postal (2-letter) abbreviations for the
# 50 U.S. states, write a script to find the longest English word
# you can spell? Here is the list of U.S. states abbreviations as
# per wikipedia page. This challenge was proposed by team member
# Neil Bowers.

# using the %states hash makes for easy testing
my %states = map { $_ => 1 } qw{
    AL AK AZ AR CA CO CT DE FL GA
    HI ID IL IN IA KS KY LA ME MD
    MA MI MN MS MO MT NE NV NH NJ
    NM NY NC ND OH OK OR PA RI SC
    CD TN TX UT VT VA WA WV WI WY
};

# more universally available than my go-to dictionary DB
my @words;
if ( open my $fh, '<', '/usr/share/dict/words' ) {
    @words = map { chomp; uc $_ } <$fh>;
}

my $longest = '';
FOR: for my $word (@words) {
    my @word = $word =~ /(\w{2})/g;

    # there are apostrophes and unicode in that list
    # this ensures that what we're looking at is valid.
    my $join = join '', @word;
    next unless $join eq $word;

    # we check every letter pair and determine if it's in
    # the states hash. we have labelled the outside for loop
    # as FOR, so we can `next` on the outer loop, not just the
    # inner loop.
    for my $wo ( @word ) {
        my $n = $states{$wo} ? 1 : 0;
        next FOR unless $n;
    }

    # words that are not entirely made out of state abbreviations
    # will not reach this point. And this will ignore words of
    # identical size to the found longest, but I know they don't
    # exist.
    $longest = $word if length $longest < length $word;
}
say $longest;

__DATA__

CACOGALACTIA

    noun In pathology, a bad condition of the milk.
```

I don't know it, and that definition sounds like a bad translation, but again, eh.

## Challenge 3?

> Find the given city current time using the Geo DB Cities API. The API challenge is **optional** but we would love to see your solution.

It's the API challenge. As much as I love `LWP` and `Mojo::UserAgent`, I think I'll dig out of my post-TPCiP work pile before I think on it.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
