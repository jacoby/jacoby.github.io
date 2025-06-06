---
layout: post
title: "Orders Matter and Order Matters: Weekly Challenge #323"
author: "Dave Jacoby"
date: "2025-05-29 15:42:41 -0400"
categories: ""
---

Welcome to [_**Weekly Challenge #323**_](https://theweeklychallenge.org/blog/perl-weekly-challenge-323/)

[**323**](<https://en.wikipedia.org/wiki/323_(number)>) is a _semiprime_, a _Lucas pseudoprime_ and a _Fibonacci semiprime_.

### Task 1: Increment Decrement

> Submitted by: Mohammad Sajid Anwar  
> You are given a list of operations.
>
> Write a script to return the final value after performing the given operations in order. The initial value is always `0`.
>
> Possible Operations:
>
> - **`++x` or `x++`:** increment by 1
> - **`--x` or `x--`:** decrement by 1

#### Let's Talk About It

An aside before we go in: increment and decrement as prefix differ whether it comes before or after the number. Consider the following code block:

```perl
my $i = 1;
my $j = $i++;
my $k = ++$i;
say join ' ', $i,$j,$k;  # 3 1 3
```

`$i` equals `3`, because it gets incremented twice. `$j` gets assigned before the increment, because `$i` comes before `++`. `$k` gets assigned after the increment, so `$i` becomes `3`, then `$k` becomes `$i`. There's _no_ assignment like that going on in in the midst of the operations, so it isn't germane to the problem, but it's an interesting piece of syntax that is easy to forget.

Anyway, I loop through the operations and increment and decrement based on whether the operation contains `++` or `--`, then return the result.

The _cool_ way would be to use `scalar grep` to get a count of the plus and minuses, then `return 0 + $plus - $minus`. It's only slightly shorter, and probably similarly fast.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use List::Util qw{ sum0 };

my @examples = (

    [ "--x", "x++", "x++" ],
    [ "x++", "++x", "x++" ],
    [ "x++", "++x", "--x", "x--" ],
);

for my $example (@examples) {
    my $operations = join ', ', map { qq{"$_"} } $example->@*;
    my $output     = increment_decrement($example->@*);
    say <<"END";
    Input:  \@operations = ($operations)
    Output: $output
END
}

sub increment_decrement (@operations) {
    my $value = 0;
    for my $op ( @operations ) {
        $value ++ if $op =~ /\+\+/mx;
        $value -- if $op =~ /\-\-/mx;
    }
    return $value;
}
```

```text
$ ./ch-1.pl
    Input:  @operations = ("--x", "x++", "x++")
    Output: 1

    Input:  @operations = ("x++", "++x", "x++")
    Output: 3

    Input:  @operations = ("x++", "++x", "--x", "x--")
    Output: 0
```

### Task 2: Tax Amount

> Submitted by: Mohammad Sajid Anwar  
> You are given an income amount and tax brackets.
>
> Write a script to calculate the total tax amount.

#### Let's Talk About It

We are taxed at the rate of a bracket for the income within a bracket. In the first example, the income is `10`.

- The first bracket is between `0` and `3`, and the tax rate applies to the first `3` whatevers from the income of 10.
- The second bracket is between `3` and `7`, and the tax rate applies to everything above `7` and above `3`, which, again, is totally covered by the income, so that's `4`.
- The third bracket is between `7` and `12`, and that' just between `7` and `10` for us, and that's `3`.

Everything else is just multiplication and addition.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };
use List::Util   qw{ uniq };

my @examples = (

    { income => 10, tax => [ [ 3, 50 ], [ 7, 10 ], [ 12, 25 ] ] },
    { income => 2,  tax => [ [ 1, 0 ],  [ 4, 25 ], [ 5,  50 ] ] },
    { income => 0,  tax => [ [ 2, 50 ] ] },
);

for my $example (@examples) {
    my $income = $example->{income};
    my @tax    = $example->{tax}->@*;
    my $tax    = join ', ', map { qq{[ $_ ]} }
        map { join ', ', $_->@* } @tax;
    my $output = tax_amount($example);
    say <<"END";
    Input:  \@income = $income,
            \@tax = ($tax)
    Output: $output
END
}

sub tax_amount($example) {
    my $total  = 0;
    my $income = $example->{income};
    my @tax    = $example->{tax}->@*;
    for my $i ( 0 .. $#tax ) {
        my $bracket = $tax[$i];
        my ( $upto, $rate ) = $bracket->@*;
        my $prev = 0;
        $prev = $i - 1 >= 0 ? $tax[ $i - 1 ][0] : 0;
        my $subset = 0;
        if    ( $income >= $upto ) { $subset = $upto - $prev; }
        elsif ( $income >= $prev ) { $subset = $income - $prev; }
        my $subtax = $subset * ( $rate / 100 );
        $total += $subtax;
    }
    return sprintf '%.02f', $total;
}
```

```text
$ ./ch-2.pl
    Input:  @income = 10,
            @tax = ([ 3, 50 ], [ 7, 10 ], [ 12, 25 ])
    Output: 2.65

    Input:  @income = 2,
            @tax = ([ 1, 0 ], [ 4, 25 ], [ 5, 50 ])
    Output: 0.25

    Input:  @income = 0,
            @tax = ([ 2, 50 ])
    Output: 0.00
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
