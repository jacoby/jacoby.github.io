---
layout: post
title: "Mind The Gap: Weekly Challenge #198"
author: "Dave Jacoby"
date: "2023-01-03 11:42:42 -0500"
categories: ""
---

Here we are, solving [Weekly Challenge #198](https://theweeklychallenge.org/blog/perl-weekly-challenge-198/) **198** is of course **11 _ 2 _ 3 \* 3**, [which is the smallest number written as the sum of four squares in ten ways](<https://en.wikipedia.org/wiki/190_(number)#Integers_from_191_to_199>). It is also the number of ridges on a US dollar coin.

### Task 1: Max Gap

> Submitted by: Mohammad S Anwar  
> You are given a list of integers, @list.
>
> Write a script to find the total pairs in the sorted list where 2 consecutive elements has the max gap. If the list contains less then 2 elements then return 0.

We are tasked with dealing with sorted lists, but given unsorted lists, so I sort first thing. Well, after dealing with the zero case.

I went with starting indexing with 1 and looking back, because this meant I'd never have to worry about a list entry being undefined. I had considered bringing in `min` and `max` from [List::Util](https://metacpan.org/pod/List::Util), but `abs` is right there, so I used it. I also used a hash to hold the number of gaps of each particular size.

I could've found `$max` with `my $max = max keys %hash`. It _is_ in Core, but I decided against. I also could've done `return $hash{ max keys %hash }`, but that seems like a crime against readability.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ fc say postderef signatures state };

my @examples = ( [ 1, 0, 3, 0, 0, 5 ], [ 2, 5, 8, 1 ], [3] );

for my $e (@examples) {
    my @list = $e->@*;
    my $out  = max_gap(@list);
    my $list = join ', ', @list;
    say <<"END";
    Input:  \@list = ($list)
    Output: $out
END
}

sub max_gap( @list ) {
    return 0 if scalar @list < 2;
    @list = sort @list;
    my %hash;
    for my $i ( 1 .. -1 + scalar @list ) {
        my $gap = abs $list[$i] - $list[ $i - 1 ];
        $hash{$gap}++;
    }
    my ($max) = sort { $b <=> $a } keys %hash;
    return $hash{$max};
}
```

```text
$  ./ch-1.pl
    Input:  @list = (1, 0, 3, 0, 0, 5)
    Output: 2

    Input:  @list = (2, 5, 8, 1)
    Output: 2

    Input:  @list = (3)
    Output: 0
```

### Task 2: Prime Count

> Submitted by: Mohammad S Anwar  
> You are given an integer $n > 0.
>
> Write a script to print the count of primes less than $n.

So, we find all the possible prime numbers between 2 and `$n`. I say 2 and not 1 because [1 is not prime](https://blogs.scientificamerican.com/roots-of-unity/why-isnt-1-a-prime-number/). My regular expression for finding primes thinks it is, so let's avoid it.

Again, all the possible prime numbers between 2 and `$n`, which means we can start with `2 .. $n`. Then we can use `grep` to filter out non-primes, with [a regular expression I found via Stack Overflow](https://stackoverflow.com/questions/66939593/using-for-loop-finding-prime-number-between-1-100) referencing the link I put in the code. [I have made my own `is_prime` function before](https://jacoby.github.io/2020/08/31/challenge-76-word-search-and-sum-primes.html) but I decided to go with this one.

And we're asked for the count of primes, so `return`ing `scalar` of that result is exactly the problem we're asked to solve.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };
use Algorithm::Permute;

my @examples = ( 10, 15, 1, 25 );

for my $e (@examples) {
    my $out = prime_count($e);
    say <<"END";
    Input:  \$n = $e
    Output: $out
END
}

# 1 is not a prime, but 2 is, but the regex in is_prime accepts 1, so
# we start on 2 and go to the given max
# grep ( is_prime($_) ) gives only the list of primes
# scalar gives us the count, which is what we want
sub prime_count ( $e ) {
    return scalar grep { is_prime($_) } 2 .. $e;
}

# https://catonmat.net/perl-regex-that-matches-composite-numbers
sub is_prime ( $n ) { ( '1' x $n ) !~ /\A(11+?)\1+\z/ }
```

```text
$  ./ch-2.pl
    Input:  $n = 10
    Output: 4

    Input:  $n = 15
    Output: 6

    Input:  $n = 1
    Output: 0

    Input:  $n = 25
    Output: 9
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
