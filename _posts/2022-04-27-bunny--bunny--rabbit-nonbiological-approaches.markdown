---
layout: post
title: "BUNNY + BUNNY = RABBIT: Non-Biological Approaches"
author: "Dave Jacoby"
date: "2022-04-27 13:14:46 -0400"
categories: ""
---

This is the problem as presented to me on Twitter.

> `_ B U N N Y +`  
> `_ B U N N Y =`  
> `R A B B I T`

Which is to say, there is a series of digits (0-9) that, when replacing the character placeholders, makes this mathematically true.

(`_` is just a space, not significant. I just wanted to get the alignment right, so it's clear that `Y` plus `Y` should equal `T`.)

Because I'm me, and because I know that since Poland dropped the Bombe on England, computers have been much better for defeating this kind of simple cypher. We have a set of letters ( **A, B, I, N,R, T, U, Y**) and Arabic numerals (**0, 1, 2, 3, 4, 5, 6, 7, 8, 9**), so it's a small matter of permutation to crack this wide open.

### The Brute-Force Permutations Approach

There are two stages for programming: Solving a problem, and solving a problem better.

To some extent, you only _need_ to solve the problem. Once it is solved, it is solved.

Here's my first pass:

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say signatures state };

use List::Util qw{ uniq };
use Algorithm::Permute;

my @letters = uniq sort split //, 'bunnyrabbit';
my $p = Algorithm::Permute->new( [ 0 .. 9 ], 8 );

while ( my @res = $p->next ) {
    next if $res[1] == 0; #b
    next if $res[4] == 0; #r
    my $bunny  = 'bunny';
    my $rabbit = 'rabbit';
    for my $i ( 0 .. 7 ) {
        $bunny =~ s/$letters[$i]/$res[$i]/gmix;
        $rabbit =~ s/$letters[$i]/$res[$i]/gmix;
    }
    my $result = add_rabbits( $bunny, $rabbit );
    next unless $result;
    say qq( $bunny + $bunny == $rabbit );
}

sub add_rabbits ( $bunny, $rabbit ) {
    return ( $bunny + $bunny == $rabbit ) ? 1 : 0;
}
```

```text
$ time ./oldbunny.pl
 52773 + 52773 == 105546

real    0m50.256s
user    0m18.750s
sys     0m0.125s
```

I'm using the go-to [Algorithm::Permute](https://metacpan.org/pod/Algorithm::Permute) to give us an iterator that gives us every possible eight-digit combination and we use regular expressions to go from `bunny` and `rabbit` to numbers, and then do the math. We have the solution and we can always know the solution, but now we go into solving the problem better.

My friend Walt Mankowski [shared a faster version](https://twitter.com/walt_man/status/1518382015934083072), followed by [an even faster version](https://twitter.com/walt_man/status/1518604261969383425), both of use [Algorithm::Combinatorics](https://metacpan.org/pod/Algorithm::Combinatorics), to both find the correct combinations and reordering each of the possible combinations to give all permutations. Strictly speaking, he does `combinations` on the numbers and `permutations` on the letters.

More importantly (I don't think there's a significant speed difference Algorithm::Permute and Algorithm::Combinatorics and you should use the one you like best), Walt uses concatenation instead of regular expressions. _This_ is the lesson I learned when I rewrote my solution. That and **"quit when you're ahead"**, meaning when you have the solution, you don't to run through more permutations and combinations.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say signatures state };

use Algorithm::Combinatorics qw(permutations combinations);
use Algorithm::Permute;

my @var = split '', 'BUNYRAIT';

my $p = Algorithm::Permute->new( [ 0 .. 9 ], 8 );
while ( my @list = $p->next ) {
    my %h = map { $var[$_] => $list[$_] } 0 .. 7;
    next unless $h{R} > 0;
    my $bunny  = bunny(%h);
    my $rabbit = rabbit(%h);
    if ( $bunny + $bunny == $rabbit ) {
        say join ' ', $bunny, '+', $bunny, '==', $rabbit;
        exit;
    }
}

sub bunny ( %h )  { return qq{$h{B}$h{U}$h{N}$h{N}$h{Y}} }
sub rabbit ( %h ) { return qq{$h{R}$h{A}$h{B}$h{B}$h{I}$h{T}} }
```

```text
$ time ./perm.pl
52773 + 52773 == 105546

real    0m0.403s
user    0m0.016s
sys     0m0.016s
```

### The Analog Approach

It is possible for you to brute force the issue, starting with **A == 0, B == 1, ...** and going through all the possibilities until you have it. This would be the pen-and-paper version of what I did above.

Or, you could decide to be clever.

I didn't _want_ to be clever, at least in that way, but I thought I'd ask what people's first steps would be.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">So, I saw this puzzle recently:<br><br> bunny +<br> bunny =<br> rabbit<br><br>If you wanted to not brute-force permutate the solution, where would you start?<br><br>(Because I know how to brute-force permute, that IS what I did.)</p>&mdash; Dave (Looking for something funny to put here) (@JacobyDave) <a href="https://twitter.com/JacobyDave/status/1518312669245288448?ref_src=twsrc%5Etfw">April 24, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Thankfully, however, [Gene Spafford](https://en.wikipedia.org/wiki/Gene_Spafford) was around to [solve the problem like an old-school cryptographer would.](https://twitter.com/TheRealSpaf/status/1518436721704292354)

> First, we have n+n being 2 diff values (b, i) so either y+y or n+n (or both) is greater than 9. Further, r must be 1 and b must be greater than 4 to generate the 6th digit.
>
> Here's a second step.
>
> Any digit added to itself results in even sum. Let's assume b is even. Then it must be 6 or 8 (recall it must carry to make r == 1). So, n+n is 6 or 8, n is 3, 4, 8, or 9. Also, u must be 3, 4, 8, or 9, but different from n.
>
> If n is 3 or 4, we get a contradiction: they add to 6 or 8 (even n) but do not carry over to u+u which must have the same sum, leading to u==n. If n is 8 or 9 we also get a contradiction: the carryover would only be 1, so it would make u+u+1 == b odd.
>
> Therefore, b must be odd.
>
> b must be 5, 7, or 9 (must add to 10 or more to produce r==1). Thus, for u+u to be odd, n+n must be > 4 to get the carry in. We also need n+n to add to 10 or more to make the leading n+n result in an odd sum.
>
> y must be less than 5, or else the second n+n would sum to b.
>
> So, we now have constraints and partial solution:
>
> > r == 1  
> > b == {5, 7, 9}  
> > n == {5, 6, 7, 8, 9} but different from b  
> > i == {0, 2, 4, 6, 8}  
> > y == {0, 2, 3, 4} but different from i
>
> We see b == 2n+1 mod 10
>
> > If n is 5, b is 1: contradiction.  
> > If n is 6, b is 3: contradiction.  
> > If n is 7, b is 5: possible.  
> > If n is 8, b is 7: possible.  
> > If n is 9, b is 9: contradiction.
>
> y must be less than 5 or we would have i == b.
>
> If n is 7, b is 5, a is 0, u is 2, r is 1, y must be 3 or 4.
>
> If n is 8, b is 7, a is 3, u is 4, r is 1 but any value for y leads to a contradiction (0 means y==t; 1, 2, 3, 4 all result in collisions).
>
> We end up with two solutions that work:
>
> `_52773 | _52774`  
> `_52773 | _52774`  
> `105546 | 105548`
>
> b=5,u=2,n=7,r=1,a=0,i=4,y={3,4}, t={6,8}

One of the things I love about Twitter is that I can ponder something like this, and really smart people come and show me how it's done.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
