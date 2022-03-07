---
layout: post
title: "I Ain't No Fortunate One: Weekly Challege #155"
author: "Dave Jacoby"
date: "2022-03-07 13:16:28 -0500"
categories: ""
---

We're now at [Weekly Challege #155](https://theweeklychallenge.org/blog/perl-weekly-challenge-155/). **[155](<https://en.wikipedia.org/wiki/155_(number)>)** is the product of the primes **5** and **31**, making it a **compound** number. I feel I _must_ have heard _compound_ as a term for not-prime numbers, but I don't actually recall seeing it. It is also [deficient](https://en.wikipedia.org/wiki/Deficient_number) and [odious](https://en.wikipedia.org/wiki/Odious_number), which sounds a _lot_ like mathematicians scouring through a dictionary to find names for new number sets.

![](https://jacoby.github.io/images/sunflower_smaller.jpg)

### TASK #2 › Pisano Period

> Submitted by: Mohammad S Anwar  
> Write a script to find the period of the **3rd Pisano Period**.
>
> > In number theory, the nth Pisano period, written as π(n), is the period with which the sequence of Fibonacci numbers taken modulo n repeats.
>
> The Fibonacci numbers are the numbers in the integer sequence:
>
> `0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, ...`
>
> For any integer n, the sequence of Fibonacci numbers F(i) taken modulo n is periodic. The Pisano period, denoted π(n), is the value of the period of this sequence. For example, the sequence of Fibonacci numbers modulo 3 begins:
>
> `0, 1, 1, 2, 0, 2, 2, 1,`  
> `0, 1, 1, 2, 0, 2, 2, 1,`  
> `0, 1, 1, 2, 0, 2, 2, 1, ...`
>
> This sequence has period 8, so π(3) = 8.

For reasons, I'm covering Task #2 before Task #1. A core one is that ...

- the Perl CS Discord pointed to ...
- a [Hacker News thread](https://news.ycombinator.com/item?id=30564287) about ...
- [a blog post about](https://www.noulakaz.net/2007/03/18/a-regular-expression-to-check-for-prime-numbers/)...
- [Abigail's `is_prime` regex solution](http://montreal.pm.org/tech/neil_kandalgaonkar.shtml)...
- which is `perl -wle 'print "Prime" if (1 x shift) !~ /^1?$|^(11+?)\1+$/' [number]`

And of course I needed to look and understand it.

- `(1 x shift)` just creates a string that's `1` repeated the same number of times as the number in question: `1 x 3 => 111`, for example.
- `=~` means we're running the following regex against that string
- `/^1?$/` covers the **0** and **1** cases, where `(1 x shift)` would result in an empty string or `1`. Both this and the next section start with `^` and end with `$`, meaning we're talking about the whole string.
- `(11+?)`, which checks to see if there are 2 or more **1**s, [non-greedily](https://perldoc.perl.org/perlre). I _think_, in this case, it means we're starting with **11** and going out, rather than **all the 1s** and cutting back.\
  > By default, a quantified subpattern is "greedy", that is, it will match as many times as possible (given a particular starting location) while still allowing the rest of the pattern to match. If you want it to match the minimum number of times possible, follow the quantifier with a "?". Note that the meanings don't change, just the "greediness"
- `\1+` matches the matched value one or more times. Assume we're seeing if **9** is prime, and the match for `(11+?)` is `111`. `111` is found within `111111111` three times — `111 111 111` — and thus 9 is not prime.

We _aren't_ looking for primes in this task, but we are looking for repetition, so that's how I'm going forward.

I'll say, however, that I am, in the code below, generating the matches with just digits, which would become problematic once we get to two-digit numbers, because then it wouldn't know the difference between `1,11` and `11,1` because my join would only generate `111`, but as we're looking for single-digit divisors (I think), that isn't a problem with this code.

You shouldn't be surprised if you see an addendum post about this task.

```perl
# when going beyond the basics, it is good to know you can
# comment your regular expressions
do { ... } if $mod =~ /
            ^           # start of string being matched
            (\d{3,})    # a digit of three or more characters
                        # (to avoid matching 1,1 at the beginning
                        # of every fibonacci series)
            \1+         # the previous match, repeated once or more
            $           # end of string being matched
            /mx;
```

Another way I'm going forward is with **iterators**. Clearly, I could just use a standard iteration function to generate fibonacci numbers, but I decided to create _fibo_factory_, a subroutine that creates an anonymous subroutine that, each time it's called, returns the next fibonacci value. When I'm done with another divisor, I start fresh with a new iterator. I don't _need_ to do that, but it's the kind of higher-order thinking I don't think I do enough of in my challenge answers.

Beyond that, I think I use my standard complement of Modern Perl features, such as `say`, `state`, `postderef` and `signatures`, as well as loop labels. If there's a thing you don't understand here, don't hesitate to ask.

That is to say, I'm confident in all the code I created, but I'm less confident that I'm actually giving the requested answer. What I'm displaying is the divisor, the period of the the repetition and the actual repeats. I'll look at other answers to find if I'm correct here.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

OUTER: for my $j ( 2 .. 10 ) {
    my @mod;
    my $fib = fibo_factory();
    for my $i ( 1 .. 60 ) {
        my $f = $fib->();
        my $m = $f % $j;
        push @mod, $m;
        my $mod = join '', @mod;
        do {
            my $sub = $1;
            say join "\t", ' ', $j, ( length $sub ), $sub;
            next OUTER;
            }
            if $mod =~ /
            ^           # start of string being matched
            (\d{3,})    # a digit of three or more characters
                        # (to avoid matching 1,1 at the beginning
                        # of every fibonacci series)
            \1+         # the previous match, repeated once or more
            $           # end of string being matched
            /mx;
    }
}

# creates an anonymous function that's an iterator, returning the next
# fibonacci value each time it's called.
sub fibo_factory ( ) {
    return sub {
        state $calls = 0;
        state @fibonacci;
        $fibonacci[0] = 1 unless $fibonacci[0];
        $fibonacci[1] = 1 unless $fibonacci[1];
        $calls++;
        return 1 if $calls < 3;
        push @fibonacci, $fibonacci[-1] + $fibonacci[-2];
        return $fibonacci[-1];
    }
}

# abigail's prime regex, insspiration for my repeats test
sub is_prime ($n) {
    return ( 1 x $n ) !~ /^1?$|^(11+?)\1+$/ ? 1 : 0;
}

```

```text
$ ./ch-2.pl
        2       3       110
        3       8       11202210
        4       6       112310
        5       20      11230331404432022410
        6       24      112352134150554314532510
        7       16      1123516066542610
        8       12      112350552710
        9       24      112358437180887641562810
```

### TASK #1 › Fortunate Numbers

> Submitted by: Mohammad S Anwar  
> Write a script to produce first **8 Fortunate Numbers** (unique and sorted).
>
> According to [Wikipedia](https://en.wikipedia.org/wiki/Fortunate_number)
>
> > A Fortunate number, named after Reo Fortune, is the smallest integer m > 1 such that, for a given positive integer n, pn# + m is a prime number, where the primorial pn# is the product of the first n prime numbers.
>
> **Expected Output**  
> 3, 5, 7, 13, 17, 19, 23, 37

It's good to know the expected output. In this case, it's because **23** shows up once, but if you just list the first eight fortunate numbers, 23 shows up twice and 37 not at all. I handle this with `uniq sort { $a <=> $b }`, taking `uniq` (as well as `product`) from the favored package, [List::Util](https://metacpan.org/pod/List::Util)

I pulled out my less-cool older `is_prime`, because Abigail's code cause perl to complain about too much recursion. (**"This Looks Like A Job For...!**) My `is_prime` is all about the iteration because, in this context, it makes sense.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use List::Util qw{ product uniq };

my $c = 1;
my @fortune;
my @prime;

OUTER: while ( $c < 40 && scalar @fortune < 8 ) {
    $c++;
    if ( is_prime($c) ) {
        push @prime, $c;
        my $p = product @prime;
        my $d = 1;
        while ( $d < 50 ) {
            $d++;
            my $f  = $p + $d;
            my $is = is_prime($f);
            if ($is) {
                # the non-sorted, non-unique list of the first
                # eight fortunate numbers contains 23 twice, so
                # 1) we need to accomodate that possibility by
                #   starting each $d back at 2, and
                # 2) we need to remove it before the outer while
                #   loop accounts for it
                # so that's why $d=1 in the while loop and
                # why we don't just push $d
                @fortune = uniq sort { $a <=> $b } @fortune, $d;
                next OUTER;
            }
        }
    }
}
say 'FORTUNATE NUMBERS: ' . join ', ', @fortune;

# using my is_prime rather than Abigail's, because that
# one was giving me "too much recursion" errors.
sub is_prime ($n) {
    for ( 2 .. sqrt $n ) { return 0 unless $n % $_ }
    return 1;
}
```

```text
$ ./ch-1.pl
FORTUNATE NUMBERS: 3, 5, 7, 13, 17, 19, 23, 37
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
