---
layout: post
title: "Does That Make Friendship Equal Four?: Weekly Challenge #160"
author: "Dave Jacoby"
date: "2022-04-11 23:58:13 -0400"
categories: ""
---

On we go into [Weekly Challenge #160](https://theweeklychallenge.org/blog/perl-weekly-challenge-160/), which, for me, is being solved while I've absconded to an undisclosed location deep in the American Southwest.

[160](<https://en.wikipedia.org/wiki/160_(number)>) is the sum of the first 11 primes, as well as the sum of the cubes of the first three primes. There could be more fun to it, but I spent the day driving out to see burros.

![The burros I saw](https://jacoby.github.io/images/burros.jpg)

### TASK #1 › Four Is Magic

> Submitted by: Mohammad S Anwar  
> You are given a positive number, $n < 10.
>
> Write a script to generate english text sequence starting with the English cardinal representation of the given number, the word ‘is’ and then the English cardinal representation of the count of characters that made up the first word, followed by a comma. Continue until you reach four.

Here, the heavy lifting is done with [Lingua::EN::Numbers](https://metacpan.org/pod/Lingua::EN::Numbers), which makes the number-to-word (or `num2en`) transition quick and easy.

From there, we use a bit of regular expression magic and the GoatSe operator (and if you don't know the reference, revel in not knowing) to get the number of letters (which I'm using instead of string length, because it is slightly harder), and then running that into `num2en`. I then combine them in a string, coming up with, for example, `seven is five, `.

I append the result of a recursive call to the string, which would then generate `five is four, `, which of course leaves the base case. `return 'four is magic.' if $i == 4`.

So, four is magic because it is the one number whose number of characters (when written in English) is the same as it's value? Perhaps

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use Carp;
use Getopt::Long;
use Lingua::EN::Numbers qw(num2en);

my $n = 6;
GetOptions( 'number=i' => \$n, );
croak 'Out of range' if $n < 1;

say magic($n);

sub magic ( $i ) {
    return 'Four is magic.' if $i == 4;
    my $w   = num2en($i);
    my $c   = () = $w =~ /(\w)/gmix;
    my $d   = num2en($c);
    my $out = qq{$w is $d, };
    $out .= magic($c);
    return $out;
}
```

```text
$ for i in {0..20}; do echo $i ; ./ch-1.pl -n $i ; echo; done
0
Out of range at ./ch-1.pl line 14.

1
one is three, three is five, five is four, Four is magic.

2
two is three, three is five, five is four, Four is magic.

3
three is five, five is four, Four is magic.

4
Four is magic.

5
five is four, Four is magic.

6
six is three, three is five, five is four, Four is magic.

7
seven is five, five is four, Four is magic.

8
eight is five, five is four, Four is magic.

9
nine is four, Four is magic.

10
ten is three, three is five, five is four, Four is magic.

11
eleven is six, six is three, three is five, five is four, Four is magic.

12
twelve is six, six is three, three is five, five is four, Four is magic.

13
thirteen is eight, eight is five, five is four, Four is magic.

14
fourteen is eight, eight is five, five is four, Four is magic.

15
fifteen is seven, seven is five, five is four, Four is magic.

16
sixteen is seven, seven is five, five is four, Four is magic.

17
seventeen is nine, nine is four, Four is magic.

18
eighteen is eight, eight is five, five is four, Four is magic.

19
nineteen is eight, eight is five, five is four, Four is magic.

20
twenty is six, six is three, three is five, five is four, Four is magic.
```

### TASK #2 › Equilibrium Index

> Submitted by: Mohammad S Anwar  
> You are give an array of integers, @n.
>
> Write a script to find out the Equilibrium Index of the given array, if found.
>
> For an array A consisting n elements, index i is an equilibrium index if the sum of elements of subarray A[0…i-1] is equal to the sum of elements of subarray A[i+1…n-1].

I would love to go into greater detail here, explaining the `for` loop going through the insides of arrays, using array slices to cover each side, and all. But it's late and I'm tired.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use List::Util qw{ sum0 };

my @examples;
push @examples, [ 1, 3, 5, 7, 9 ];
push @examples, [ 1, 2, 3, 4, 5 ];
push @examples, [ 2, 4, 2 ];

for my $e (@examples) {
    my $i  = equilibrium_index( $e->@* );
    my $ee = join ', ', $e->@*;

    say <<"END";
        Input:  \@n = $ee
        Output: $i
END
}

sub equilibrium_index ( @array ) {

    for my $i ( 1 .. $#array - 1 ) {
        my @s1 = @array[ 0 .. $i - 1 ];
        my @s2 = @array[ $i + 1 .. $#array ];
        my $sum1 = sum0 @s1;
        my $sum2 = sum0 @s2;
        return $i if $sum1 == $sum2;
    }
    return -1;
}
```

```text
$ ./ch-2.pl
        Input:  @n = 1, 3, 5, 7, 9
        Output: 3

        Input:  @n = 1, 2, 3, 4, 5
        Output: -1

        Input:  @n = 2, 4, 2
        Output: 1
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
