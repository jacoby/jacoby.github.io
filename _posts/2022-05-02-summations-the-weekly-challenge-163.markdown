---
layout: post
title: "Sum(mation)s: The Weekly Challenge #163"
author: "Dave Jacoby"
date: "2022-05-02 17:44:41 -0400"
categories: ""
---

[Weekly Challenge 164](https://theweeklychallenge.org/blog/perl-weekly-challenge-163/)

No number analysis besides 163 being prime. I'm a bit tired.

### Task 1: Sum Bitwise Operator

> Submitted by: Mohammad S Anwar  
> You are given list positive numbers, **@n**.
>
> Write script to calculate the sum of bitwise & operator for all unique pairs.

Let's see, what's clever and worthy of note? I went back to [Algorithms::Permutes](https://metacpan.org/pod/Algorithm::Permute) to get the pairs, and `sum0` from [List::Util](https://metacpan.org/pod/List::Util). Just judicious use of a hash to handle duplicates and there we go.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use Algorithm::Permute;
use List::Util qw{sum0};

my @n = @ARGV;
@n = ( 1, 2, 3 ) unless scalar @n;
my @pairs = get_pairs(@n);
my $n     = join ' ', @n;
my $sum   = sum0 map { $_->[0] & $_->[1] } @pairs;
say <<"END";
    Input:  ($n)
    Output: $sum
END
exit;

sub get_pairs( @array ) {
    my $p = Algorithm::Permute->new( \@array, 2 );
    my @output;
    my %x;
    while ( my @pair = $p->next ) {
        @pair = sort @pair;
        next if $x{ join ',', @pair }++;
        push @output, [@pair];
    }
    return @output;
}
```

```text
$ ./ch-1.pl 
    Input:  (1 2 3)
    Output: 3

$ ./ch-1.pl 2 3 4
    Input:  (2 3 4)
    Output: 2
```

### Task 2: Summations

> Submitted by: Mohammad S Anwar  
> You are given a list of positive numbers, **@n**.
>
> Write a script to find out the summations as described below.

Mostly this involves traversing arrays of arrays. It's just workmanlike. 

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @n = @ARGV;
@n = ( 1, 2, 3, 4, 5 ) unless scalar @n;
my $n = join ', ', @n;
my $s = summations(@n);
say <<"END";
    Input:  \@n = ($n)
    Output: $s
END

sub summations ( @n ) {
    my $max = -1 + scalar @n;
    my @x   = map {
        [ map { '' } 0 .. $max ]
    } 0 .. $max;
    $x[0]->@* = @n;

    for my $i ( 1 .. $max ) {
        for my $j ( $i .. $max ) {
            my $left  = $x[$i][ $j - 1 ] || 0;
            my $above = $x[ $i - 1 ][$j] || 0;
            $x[$i][$j] = $left + $above;
        }
    }
    return $x[$max][$max];
}
```

```text
$ ./ch-2.pl 
    Input:  @n = (1, 2, 3, 4, 5)
    Output: 42

$ ./ch-2.pl 1 3 5 7 9
    Input:  @n = (1, 3, 5, 7, 9)
    Output: 70
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
