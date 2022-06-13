---
layout: post
title: "This Is Gonna Take FOREVER!: Weekly Challenge #168"
author: "Dave Jacoby"
date: "2022-06-08 09:51:47 -0400"
categories: ""
---

This is [Weekly Challenge $168](https://theweeklychallenge.org/blog/perl-weekly-challenge-168/). [168](https://en.wikipedia.org/wiki/168) is **2 * 2 * 2 * 3 * 7**. Discounting 1 and itself, 168 is divisible by **2, 3, 4, 6, 7, 8, 12, 14, 21, 24, 28, 42, 56, and 84**. If you sum those numbers, you get **311**, which is greater than itself, which makes it an [Abundant Number](https://en.wikipedia.org/wiki/Abundant_number).

### Task 1: Perrin Prime

> Submitted by: Roger Bell_West  
> The **Perrin sequence** is defined to start with `[3, 0, 2]`; after that, term **N** is the sum of terms **N-2** and **N-3**. (So it continues `3, 2, 5, 5, 7, ….`)
>
> > A **Perrin prime** is a number in the **Perrin sequence** which is also a **prime number**.
>
> Calculate the first **13 Perrin Primes**.

The Perrin Sequence is akin to Fibonacci, just **N-2** and **N-3** instead of **N-1** and **N-2**. The key, then, is to find the primes in them.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @perrin = ( 3, 0, 2 );
my %perrin_primes;
$perrin_primes{2} = 1;
$perrin_primes{3} = 1;

while ( scalar keys %perrin_primes < 13 ) {
    my $x = $perrin[-2] + $perrin[-3];
    push @perrin, $x;
    $perrin_primes{$x} = 1 if is_prime($x);
}

say join ' ', sort { $a <=> $b } keys %perrin_primes;
exit;

sub is_prime ($n) {
    die "Bad number $n" unless length $n;
    return 0 if $n == 0;
    return 0 if $n == 1;
    for ( 2 .. sqrt $n ) { return 0 unless $n % $_ }
    return 1;
}
```

```text
 ./ch-1.pl
2 3 5 7 17 29 277 367 853 14197 43721 1442968193 792606555396977
```

### Task 2: Home Prime

> Submitted by: Mohammad S Anwar  
> You are given an integer greater than 1.
>
> Write a script to find the **home prime** of the given number.
>
> In _number theory_, the _home prime_ **HP(n)** of an integer **n** greater than 1 is the _prime number_ obtained by repeatedly factoring the increasing concatenation of _prime factors_ including repetitions.
>
> Further information can be found on [Wikipedia](https://en.wikipedia.org/wiki/Home_prime) and [OEIS](https://oeis.org/A037274).

They give the example of **10** in the task and on Wikipedia, but it's not formatted so the iteratations are harder to pick out and understand.

- The factors of **10** are `[2,5]`, so we concatenate and get **25**
- The factors of **25** are `[5,5]`, so we concatenate and get **55**
- The factors of **55** are `[5,11]`, so we concatenate and get **511**
- The factors of **511** are `[7,73]`, so we concatenate and get **773**
- **773** is prime

For many numbers, it's that easy or easier. The home prime for **8**, however, is **3331113965338635107**. 19 digits. I've been running my solution against 8 for over a day, and so far, I'm just at **3347911118189**, whose factors are `[11, 613, 496501723]`. I _wanted_ to run it until it finishes or crashes before I blogged, but I don't think my computer will finish it before that point.

But going for the fastest possible way through, I went with [Math::Prime::XS](https://metacpan.org/pod/Math::Prime::XS) to get a faster, compiled XS `is_prime`, but didn't for the factorization. I think that I could make it *faster* if I find a module for that, but I doubt, especially for monsters like **8**, would make it *fast*. A snail moves faster than the movement of tectonic plates, but neither are up for a land speed record.

My code has [Try::Tiny](https://metacpan.org/pod/Try::Tiny) included, but I don't use [Carp](https://metacpan.org/pod/Carp) to `croak` and use it. I had functionality to protect against stack-smashingly large integers, but slow looping seems to be more the issue than ensuring halting. At least, for me; your mileage may vary.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use Carp;
use Try::Tiny;
use Math::Prime::XS qw{ is_prime };

$| = 1;

my @n = @ARGV;
push @n, 10 unless scalar @ARGV;

for my $i (@n) {
    try {
        my $p = get_home_prime($i);
        say join "\t", '-', $i, $p;
    }
    catch {
        say $_;
    };
}

sub get_home_prime($n) {
    my $p = $n;
    while ( !is_prime($p) ) {
        my @factors = get_factors($p);
        $p = join '', @factors;
        print qq{$p };
        # croak 'Too Big, Too Slow' if length $p > 10;
    }
    say '';
    return $p;
}

sub get_factors( $n ) {
    my @factors;
    for my $i ( 2 .. $n ) {
        next unless $n % $i == 0;
        while ( $n % $i == 0 ) {
            push @factors, $i;
            $n = $n / $i;
        }
    }
    return @factors;
}
```

```text
$ ./ch-2.pl 10
25 55 511 773
-       10      773

# so far; still computing
$ ./ch-2.pl 10
222 2337 31941 33371313 311123771 7149317941 22931219729 112084656339 3347911118189
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
