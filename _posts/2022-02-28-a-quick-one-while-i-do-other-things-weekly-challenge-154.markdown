---
layout: post
title: "A Quick One While I Do Other Things: Weekly Challenge #154"
author: "Dave Jacoby"
date: "2022-02-28 12:31:48 -0500"
categories: ""
---

[Weekly Challenge #154](https://theweeklychallenge.org/blog/perl-weekly-challenge-154/)! [154](<https://en.wikipedia.org/wiki/154_(number)>) = 2 _ 7 _ 11, and there is no number where the sum of the digits equals 154, which makes it [noncototient](https://en.wikipedia.org/wiki/Noncototient), which is a new concept to me.

### TASK #1 › Missing Permutation

> Submitted by: Mohammad S Anwar
>
> You are given possible permutations of the string 'PERL'.
>
> Write a script to find any permutations missing from the list.

We're given this sample set.

```text
PELR, PREL, PERL, PRLE, PLER, PLRE, EPRL, EPLR, ERPL,
ERLP, ELPR, ELRP, RPEL, RPLE, REPL, RELP, RLPE, RLEP,
LPER, LPRE, LEPR, LRPE, LREP
```

The key module, for me, is [Algorithm::Permute](https://metacpan.org/pod/Algorithm::Permute), which provides an iterator that will give you every variation. You have to split the string into a list, pass it the list, and join the list into a string. Then, you can see if that string exists in the sample set, via `grep`.

**Or...**

I don't use it here, but there's [List::Compare](https://metacpan.org/pod/List::Compare), which takes two lists and provides methods to get what is in which list compared to what's in another list. I decided that this required extra steps, unneeded for this task, but it's well worth using.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use Algorithm::Permute;

my @sample = sort grep { /\w/ } split /\W+/, <<'END';
    PELR PREL PERL PRLE PLER PLRE EPRL EPLR ERPL
    ERLP ELPR ELRP RPEL RPLE REPL RELP RLPE RLEP
    LPER LPRE LEPR LRPE LREP 
END

my $p = Algorithm::Permute->new( [ split //, $sample[0] ] );
while ( my @str = $p->next ) {
    my $str = join '', @str;
    say $str unless grep { /$str/ } @sample;
}
```

```text
./ch-1.pl 
LERP
```

### TASK #2 › Padovan Prime

> Submitted by: Mohammad S Anwar  
> A **Padovan Prime** is a **Padovan Number** that’s also prime.
>
> In number theory, the Padovan sequence is the sequence of integers P(n) defined by the initial values.
>
> `P(0) = P(1) = P(2) = 1`
>
> and then followed by
>
> `P(n) = P(n-2) + P(n-3)`
>
> First few Padovan Numbers are as below:
>
> `1, 1, 1, 2, 2, 3, 4, 5, 7, 9, 12, 16, 21, 28, 37, ...`
>
> Write a script to compute first 10 distinct Padovan Primes.

I was fairly worried that we'd start needing [Math::BigInt](https://metacpan.org/pod/Math::BigInt) for `3093215881333057`, the tenth Padovan Prime, but it turns out we're good. Probably necessary for the eleventh, but we're going for 1 through 10.

Padovan Numbers seem like a variation of Fibonacci Numbers, but instead of adding the last two together, we add two of the last three. This means that it behaves like Fibonacci: recursive solutions blow up and take forever unless you memoize, but iterative solutions are fast.

I pulled out my existing `is_prime` function, and I use `uniq` from [List::Util](https://metacpan.org/pod/List::Util) to ensure that we don't get `2` in the list twice. I _should_ do it some other way, like `next if $n == $primes[-1]`, but I'm okay with this use.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use List::Util qw{ uniq };

my @primes;

# redo as iterator?
my @padovan;
push @padovan, 1, 1, 1;
while ( scalar @primes < 10 ) {
    my $n = $padovan[-3] + $padovan[-2];
    push @padovan, $n;
    push @primes,  $n if is_prime($n);
    @primes = uniq @primes;
}

say join ' ', @primes;

sub is_prime ($n) {
    for ( 2 .. sqrt $n ) { return unless $n % $_ }
    return 1;
}
```

```text
./ch-2.pl 
2 3 5 7 37 151 3329 23833 13091204281 3093215881333057
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
