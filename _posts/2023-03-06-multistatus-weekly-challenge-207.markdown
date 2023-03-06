---
layout: post
title: "Multi-Status: Weekly Challenge #207"
author: "Dave Jacoby"
date: "2023-03-06 11:25:03 -0500"
categories: ""
---

Here we are, at [Weekly Challenge #207](https://theweeklychallenge.org/blog/perl-weekly-challenge-207/)! **207** is the area code for Maine, a composite number (3<sup>2</sup> x 23) and a [deficient number](https://en.wikipedia.org/wiki/Deficient_number), but, until the list of HTTP response codes gets exhausted, I'll lean toward them, and 207 means "Multi-Status", or _Conveys information about multiple resources, for situations where multiple status codes might be appropriate._

[![HTTP CATS: 207](https://http.cat/207)](https://http.cat/207)

### Task 1: Keyboard Word

> Submitted by: Mohammad S Anwar
>
> You are given an array of words.
>
> Write a script to print all the words in the given array that can be types using alphabet on only one row of the keyboard.
>
> Let us assume the keys are arranged as below:
>
> Row 1: `qwertyuiop`  
> Row 2: `asdfghjkl`  
> Row 3: `zxcvbnm`

#### Let's Talk This Through

I remember talking to a friend when we were both in school. I said "I like my name, 'Dave', because you only need one hand to type it."

"Same with 'stewardesses'", he replied.

So, of course, I had to figure out if he was right (every letter in "stewardesses" is written with the left hand on a QWERTY keyboard), what else works like that (using the word lists I got from [CERIAS](https://www.cerias.purdue.edu/), I found "sweaterdresses" to be the longest left-hand word), and what about the other hand (because the "useful" vowels are under the left hand, you get more scientific words like ["phyllophyllin"](https://en.wiktionary.org/wiki/phyllophyllin)).

Here, instead of spliting by hands, we split by rows. The code for this isn't like the code I wrote all those decades ago, but it's a bit related. And, using `/usr/share/dict/words`, I've found the longest one-row word is "typewriter", so there's that.

(An obvious "fix" would be to use `state` and only create `%my_row_1` and the like once, but I'm not sure that you're buying much at this scale.)

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ fc say postderef signatures state };

use DateTime;

my @examples = (

    [qw{ Hello Alaska Dad Peace }],
    [qw{ OMG Bye }],
);

for my $e (@examples) {
    my $list  = join ',', map { qq{"$_"} } $e->@*;
    my $out   = keyboard_word( $e->@* );
    my $olist = join ',', map { qq{"$_"} } $out->@*;
    say <<"END";
    Input:  \@array = ($list)
    Output: ($olist)
END
}

sub keyboard_word ( @array ) {
    my @output;
    my %row_1 = map { $_ => 1 } split //, 'qwertyuiop';
    my %row_2 = map { $_ => 1 } split //, 'asdfghjkl';
    my %row_3 = map { $_ => 1 } split //, 'zxcvbnm';

    for my $Word (@array) {
        my $count;
        for my $l ( map { fc $_ } split //, $Word ) {
            $count->{1}++ if $row_1{$l};
            $count->{2}++ if $row_2{$l};
            $count->{3}++ if $row_3{$l};
        }
        push @output, $Word unless scalar keys $count->%* > 1;
    }
    return wantarray ? @output : \@output;
}
```

```text
$ ./ch-1.pl 
    Input:  @array = ("Hello","Alaska","Dad","Peace")
    Output: ("Alaska","Dad")

    Input:  @array = ("OMG","Bye")
    Output: ()
```

### Task 2: H-Index

> Submitted by: Mohammad S Anwar  
> You are given an array of integers containing citations a researcher has received for each paper.
>
> Write a script to compute the researcher’s H-Index. For more information please checkout the wikipedia page.
>
> > The H-Index is the largest number h such that h articles have at least h citations each. For example, if an author has five publications, with 9, 7, 6, 2, and 1 citations (ordered from greatest to least), then the author’s h-index is 3, because the author has three publications with 3 or more citations. However, the author does not have four publications with 4 or more citations.

#### Let's Talk This Through

The key things are comparing the size of an array, using `grep` to get the right subset and getting the count, not the subset. For that last line, we have `=()=`. There is a term for that operator. I will not tell you the name.

From there, we use a `for` loop (but could've used `while`) to iterate through the possibile numbers. Fairly simple.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ max };

my @examples = (

    [ 10, 8, 5, 4, 3 ],
    [ 25, 8, 5, 3, 3 ],
);

for my $e (@examples) {
    my $o     = h_index( $e->@* );
    my $array = join ', ', $e->@*;
    say <<"END";
    Input:  \@array = $array
    Output: $o
END
}

sub h_index ( @citations ) {
    my $max = max @citations;
    for my $h ( 1 .. $max ) {
        my $i = () = grep { $_ >= $h } @citations;
        return $h - 1 if $i < $h;
    }
    return 0;
}
```

```text
$ ./ch-2.pl 
    Input:  @array = 10, 8, 5, 4, 3
    Output: 4

    Input:  @array = 25, 8, 5, 3, 3
    Output: 3
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
