---
layout: post
title: "Pernicious and Weird Are The Numbers We Two Can Share: Weekly Challenge #156"
author: "Dave Jacoby"
date: "2022-03-14 10:56:55 -0400"
categories: ""
---

It's [(Perl) Weekly Challenge #156](https://theweeklychallenge.org/blog/perl-weekly-challenge-156/)! 156 is a [Harshad number](https://en.wikipedia.org/wiki/Harshad_number), which means that it is divisible by the sum of it's digits. _Harshad_ is from Sanskrit and it means it gives joy. I think that means [D. R. Kaprekar](https://en.wikipedia.org/wiki/D._R._Kaprekar) is the [Marie Kondo](https://www.netflix.com/title/80209379) of number theory. It's nice to have a repeatable, algorithmic answer to the question "Does this spark joy?"

### Hey, It's Pi Day!

I'm pulling back out some code from eight years ago where I demonstrate

- how to estimate pi in a few different ways
- that you can use the character π as part of your variable names

There's no Pi-related tasks in this one. Maybe one will come around when we get to [Tau Day](https://tauday.com/).

```perl
#!/usr/bin/env perl

use feature qw{ say } ;
use strict ;
use warnings ;
use utf8 ;

my $π = 3.14159 ;

my $est2  = estimate_2() ;
my $diff2 = sprintf '%.5f',abs $π - $est2 ;
say qq{Estimate 2: $est2 - off by $diff2} ;

my $est1  = estimate_1() ;
my $diff1 = sprintf '%.5f',abs $π - $est1 ;
say qq{Estimate 1: $est1 - off by $diff1} ;

exit ;

# concept here is that the area of a circle = π * rsquared
# if r == 1, area = π. If we just take the part of the circle
# where x and y are positive, that'll be π/4. So, take a random
# point between 0,0 and 1,1 see if the distance between it and
# 0,0 is < 1. If so, we increment, and the count / the number
# so far is an estimate of π.

# because randomness, this will change each time you run it

sub estimate_1 {
    srand ;
    my $inside = 0.0 ;
    my $pi ;
    for my $i ( 1 .. 1_000_000 ) {
        my $x = rand ;
        my $y = rand ;
        $inside++ if $x * $x + $y * $y < 1.0 ;
        $pi = sprintf '%.5f', 4 * $inside / $i ;
        }
    return $pi ;
    }

# concept here is that π can be estimated by 4 ( 1 - 1/3 + 1/5 - 1/7 ...)
# so we get closer the further we go
sub estimate_2 {
    my $pi = 0;
    my $c  = 0;
    for my $i ( 0 .. 1_000_000 ) {
        my $j = 2 * $i + 1 ;
        if ( $i % 2 == 1 ) { $c -= 1 / $j ; }
        else               { $c += 1 / $j ; }
        $pi = sprintf '%.5f', 4 * $c ;
        }
    return $pi ;
    }
```

### TASK #1 › Pernicious Numbers

> Submitted by: Mohammad S Anwar  
> Write a script to permute first **10 Pernicious Numbers**.
>
> > A pernicious number is a positive integer which has prime number of ones in its binary representation.
>
> The first pernicious number is 3 since binary representation of 3 = (11) and 1 + 1 = 2, which is a prime.
>
> Expected Output  
> `3, 5, 6, 7, 9, 10, 11, 12, 13, 14 `

In reverse order:

- **binary representation:** `sprintf '%b' $n`
- **number of ones:** `sum0 split //, $n`
- **is_prime:** I've shown that one a lot recently

So, `push @pernicious, $n if is_prime(count_ones(to_binary($n)))` does the trick.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use List::Util qw{ product sum0 uniq };

my @pernicious;
my $i = 0;
while ( scalar @pernicious < 10 ) {
    $i++;
    if ( is_prime( count_ones( to_binary($i) ) ) ) {
        push @pernicious, $i;
    }
}
say join ', ', @pernicious;

sub count_ones( $n ) {
    return sum0 split //, $n;
}

sub to_binary( $n ) {
    return sprintf '%b', $n;
}

sub is_prime ($n) {
    return 0 if $n == 0 || $n == 1;
    for ( 2 .. sqrt $n ) { return 0 unless $n % $_ }
    return 1;
}
```

```text
$ ./ch-1.pl
3, 5, 6, 7, 9, 10, 11, 12, 13, 14
```

### TASK #2 › Weird Number

> Submitted by: Mohammad S Anwar
> You are given number, `$n > 0`.
>
> Write a script to find out if the given number is a Weird Number.
>
> According to [Wikipedia](https://en.wikipedia.org/wiki/Weird_number), it is defined as:
>
> > The sum of the proper divisors (divisors including 1 but not itself) of the number is greater than the number, but no subset of those divisors sums to the number itself.

So, a number is **Weird** if

- sum of the proper divisors is greater than the number, but
- there's no combination of the proper divisors whose sum equals the number

So, we go back to [List::Util](https://metacpan.org/pod/List::Util) and `sum0`. (Reminder: `sum0` and not `sum` because `sum0()` is `0` and `sum()` is `undef`. _Always use `sum0`_ would be _my_ Perl Best Practice.) Otherwise, finding the factors is a functional one-liner: `grep { $n % $_ == 0 } 1 .. $n - 1`.

The "sum of combination of proper divisors" part, well...

**THIS looks like a JOB for _RECURSION!_**

So, there's the necessary values: the number and an arrayref of divisors of the number. Then there's the index of the list, and the current set, which is an array, not an arrayref, which makes moving forward easy.

```perl
    # appends the current factor to @values
    return 1 if subset_sum( $n, $factors, $i + 1, @values, $factors->[$i] );

    # appends the 0 to @values
    return 1 if subset_sum( $n, $factors, $i + 1, @values, 0 );
```

And then, when we're at the end, we see if the sum equals the number.

```perl
    if ( !defined $factors->[$i] ) {
        my $sum = sum0 @values;
        return $n == $sum ? 1 : 0;
    }
```

Plus, of course, the usefulness of [Getopt::Long](https://metacpan.org/pod/Getopt::Long).

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use Carp;
use Getopt::Long;
use List::Util qw{ sum0 };
use Scalar::Util qw{ looks_like_number };

my $n = 12;
GetOptions( 'number=i' => \$n );
croak "Not Greater than 0" unless $n > 0;

my $w = is_weird($n);
say <<"END";
    Input:  \$n = $n
    Output: $w
END

sub is_weird ( $n ) {
    my $m       = $n;
    my @factors = grep { $n % $_ == 0 } 1 .. $n - 1;
    my $sum     = sum0 @factors;
    my $w       = subset_sum( $n, \@factors );
    return ( $sum > $n && !$w ) ? 1 : 0;
}

sub subset_sum ( $n, $factors, $i = 0, @values ) {
    if ( !defined $factors->[$i] ) {
        my $sum = sum0 @values;
        return $n == $sum ? 1 : 0;
    }
    my @o;
    return 1 if subset_sum( $n, $factors, $i + 1, @values, $factors->[$i] );
    return 1 if subset_sum( $n, $factors, $i + 1, @values, 0 );
    return 0;
}
```

```text
$ ./ch-2.pl -n 12
    Input:  $n = 12
    Output: 0

$ ./ch-2.pl -n 70
    Input:  $n = 70
    Output: 1

$ ./ch-2.pl -n 5830
    Input:  $n = 5830
    Output: 1

$ ./ch-2.pl -n 5831
    Input:  $n = 5831
    Output: 0
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
