---
layout: post
title: "ABC ACB BAC BCA CAB CBA: Perl Weekly Challenge #115"
author: "Dave Jacoby"
date: "2021-06-01 19:15:25 -0400"
categories: ""
---

For last week's Challenge, I used the same technique to handle two tasks, being the [infinite `while(1)` loop](https://jacoby.github.io/2021/05/24/escape-from-the-infinite-loop-perl-weekly-challenge-114.html).

This week, I go to one well for two tasks again, and this is permutations. Given an array `['A', 'B', 'C']`, you want to get every possible arrangement of those three characters. See the title for the (sorted) result, but the mechanism to get this is within [Algorithm::Permute](https://metacpan.org/pod/Algorithm::Permute).

```perl
use Algorithm::Permute;
my @x    = 'A' ... 'C';
my $ap   = Algorithm::Permute->new( \@x );
my @pers;
while ( my @arr = $ap->next ) {
    push @pers, join '', @arr;
}
say join ' ', sort @pers;
```

`Algorithm::Permute->new()` creates an [iterator](https://www.perl.com/pub/2005/06/16/iterators.html/), which simply allows you to grab the next permutation instead of creating a whole array of them.

They don't come out in any particular order, so to get them into the form I wanted for the blog title, I `join`ed and then `sort`ed, using the default "It's a string" behavior for the sort.

### TASK #1 › String Chain

> Submitted by: Mohammad S Anwar  
> You are given an array of strings.
>
> Write a script to find out if the given strings can be chained to form a circle. Print 1 if found otherwise 0.
>
> A string $S can be put before another string $T in circle if the last character of $S is same as first character of $T.

So, we're given a list of strings, and simply put, the first character of one string in the list must match the last of another. They also must be _one_ chain: `abc dea ijk lmi` would give us two chains, not one, and should not match.

This looks like a job for permute to me, and the iterator form is great because we don't fill up an array with permutations beyond what you test.

I start with `f_char` and `l_char`, instead of putting the `substr` commands in directly, because I for one find `substr( $str, -1 + length $str, 1 )` a little long and clunky. A perfectly cromulent addition is memoization, either with [Memoize](https://metacpan.org/pod/Memoize) or a static hashref within the functions, but for this toy code, I'm happy as is.

We can iteratively test `f_char($arr[$i])` against `l_char($i-1)`, but if we leave it to that, we miss a link in the chain. I start with `if ( f_char( $res[0] ) eq l_char( $res[-1] ) ) { ... }` to ensure that the non-iteratable link is covered.

And again, with the iterator and Algorithm::Permute, we only go through every permutation if there's no chain.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

use Algorithm::Permute;

my @input;
push @input, [ "abc", "dea", "cd" ];
push @input, [ "ade", "cbd", "fgh" ];

for my $i (@input) {
    my $v = is_chain( $i->@* );
    say join " | ", $i->@*;
    say $v? 'We can form a circle' : 'We cannot for a circle';
    say ' ';
}

sub is_chain ( @links ) {
    my $p = Algorithm::Permute->new( [@links] );
    while ( my @res = $p->next ) {
        my $i = join '-', @res;
        my $c = 1;
        if ( f_char( $res[0] ) eq l_char( $res[-1] ) ) {
            for my $i ( 1 .. -1 + scalar @res ) {
                $c++ if l_char( $res[ $i - 1 ] ) eq f_char( $res[$i] );
            }
            return 1 if $c == scalar @links;
        }
    }
    return 0;
}

sub f_char( $str ) {
    return substr( $str, 0, 1 );
}

sub l_char( $str ) {
    return substr( $str, -1 + length $str, 1 );
}
```

```text
abc | dea | cd
We can form a circle

ade | cbd | fgh
We cannot for a circle
```

### TASK #2 › Largest Multiple

> Submitted by: Mohammad S Anwar  
> You are given a list of positive integers (0-9), single digit.
>
> Write a script to find the largest multiple of 2 that can be formed from the list.

We have two parts to this task:

- number formed with this list
- that is even (largest multiple of 2)

Without that "largest multiple of 2" requirement, it would be simple: `$n = join '', sort {$b<=>$a} @digits`, or reverse sorting the digits and making a number out of, which Perl does implicitly.

This makes the easiest solution Algorithm::Permute (if it's installed on your system), with `$i = 0 + join '', @res` (which is not a verbatim quote from my code), and testing `$i % 2 == 0` for evenness.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

use Algorithm::Permute;

my @input;
push @input, [ 1, 0, 2, 6 ];
push @input, [ 1, 4, 2, 8 ];
push @input, [ 4, 1, 7, 6 ];

for my $i (@input) {
    my @arr  = $i->@*;
    my $join = join ', ', @arr;
    my $len  = largest_even_number( @arr );
    say <<"END";
    INPUT:  ($join)
    OUTPUT: $len
END
}

sub largest_even_number( @digits ) {
    my $max = -1;
    my $p = Algorithm::Permute->new( [@digits] );
    while ( my @res = $p->next ) {
        my $i = join '', @res;
        $i += 0;
        next unless $i % 2 == 0;
        $max = $i if $i > $max;
    }
    return $max;
}
```

```text
    INPUT:  (1, 0, 2, 6)
    OUTPUT: 6210

    INPUT:  (1, 4, 2, 8)
    OUTPUT: 8412

    INPUT:  (4, 1, 7, 6)
    OUTPUT: 7614
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
