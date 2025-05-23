---
layout: post
title: "Dashing This Off: Weekly Challenge #332"
author: "Dave Jacoby"
date: "2025-05-22 19:14:54 -0400"
categories: ""
---

Welcome to [_**Weekly Challenge #322!**_](https://theweeklychallenge.org/blog/perl-weekly-challenge-322/) **322** is an [untouchable number](https://en.wikipedia.org/wiki/Untouchable_number). I hadn't heard about them until researching this number.

### Task 1: String Format

> Submitted by: Mohammad Sajid Anwar  
> You are given a string and a positive integer.
>
> Write a script to format the string, removing any dashes, in groups of size given by the integer. The first group can be smaller than the integer but should have at least one character. Groups should be separated by dashes.

#### Let's Talk About It

We go backwards from the end of the string, and if the current group is shorter than `i`, we pull the dash. This involves `substr`, both as an _lvalue_ and an _rvalue_. I think this is solvable going front-to-back, not back-to-front like I did it, but going through the problem mentally, I didn't think I could get the example's answers that way.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use List::Util qw{ sum0 };

my @examples = (

    {
        str => 'ABC-D-E-F',
        i   => 3,
    },
    {
        str => 'A-BC-D-E',
        i   => 2,
    },
    {
        str => '-A-BC-DE',
        i   => 4,
    },
);

for my $example (@examples) {
    my $output = string_format($example);
    say <<"END";
    Input:  \$str = "$example->{str}"
            \$i   = $example->{i}
    Output: $output
END
}

sub string_format ($obj) {
    my $i   = $obj->{i};
    my $str = $obj->{str};
    $str = substr( $str, 1 ) while $str =~ /^-/mx;
    my $l = length $str;
    for my $x ( reverse 0 .. $l ) {
        my $c = substr( $str, $x, 1 );
        next if $c =~ /\w/mx;
        next if $x + 1 >= $l;
        my $group = substr( $str, $x + 1 );
        ($group) = split /-/, $group;
        if ( length $group < $i ) {
            substr( $str, $x, 1 ) = '';
        }
    }
    return $str;
}
```

```text
$ ./ch-1.pl
    Input:  $str = "ABC-D-E-F"
            $i   = 3
    Output: ABC-DEF

    Input:  $str = "A-BC-D-E"
            $i   = 2
    Output: A-BC-DE

    Input:  $str = "-A-BC-DE"
            $i   = 4
    Output: A-BCDE
```

### Task 2: Rank Array

> Submitted by: Mohammad Sajid Anwar
> You are given an array of integers.
>
> Write a script to return an array of the ranks of each element: the lowest value has rank 1, next lowest rank 2, etc. If two elements are the same then they share the same rank.

#### Let's Talk About It

Ranking goes according to numeric order, so we sort the integers and remove duplicates (`uniq sort @ints`, with `uniq` coming from List::Util), and then rank the first number `1`, the second `2` and so on. I then throw that into a hash, and `map` the ranks onto the original unsorted array.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };
use List::Util   qw{ uniq };

my @examples = (

    [ 55, 22, 44, 33 ],
    [ 10, 10, 10 ],
    [ 5, 1, 1, 4, 3 ],
);

for my $example (@examples) {
    my @ints   = $example->@*;
    my $ints   = join ', ', @ints;
    my @output = rank_array( $example->@* );
    my $output = join ', ', @output;
    say <<"END";
    Input:  \@ints = ($ints)
    Output: ($output)
END
}

sub rank_array (@ints) {
    my @sorted = uniq sort { $a <=> $b } @ints;
    my %ranks;
    my $r = 1;
    for my $s (@sorted) { $ranks{$s} = $r++; }
    return map { $ranks{$_} } @ints;
}
```

```text
$ ./ch-2.pl
    Input:  @ints = (55, 22, 44, 33)
    Output: (4, 1, 3, 2)

    Input:  @ints = (10, 10, 10)
    Output: (1, 1, 1)

    Input:  @ints = (5, 1, 1, 4, 3)
    Output: (4, 1, 1, 3, 2)
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
