---
layout: post
title: "Trapped Bits: Perl Weekly Challenge #79"
author: "Dave Jacoby"
date: "2020-09-23 16:59:17 -0400"
categories: ""
---

Last week, I was gently notified that my solutions are insufficiently epic, so this time, I'm going further into my explanation in hopes that I identify further epicness as I proceed.

### TASK #1 › Count Set Bits

> Submitted by: Mohammad S Anwar  
> You are given a positive number **\$N**.
>
> Write a script to count the total numbrer of set bits of the binary representations of all numbers from **1** to **\$N** and return **\$total_count_set_bit % 1000000007**.

There is a phrase I've taken from listicle journalism: _Oddly Specific_. Modulus on 1,000,000,007 is oddly specific. However, since I only do the Perl Weekly Challenge, I didn't know that [it's a common thing among programming competitions](https://www.geeksforgeeks.org/modulo-1097-1000000007/).

As I write this up, I'm running the first challenge with **\$N = 1000000007** , to get a sense of the time and if I need to rewrite it. If not...

It seems fairly simple. For every number between **0** and **\$N**, get the binary representation with sprintf. (I start with 0 instead of 1, kinda because it felt right, but really, there's 0 **1**s in `00000000`.) Starting with **3**, that converts to `011`, which we arrayify to `[0,1,1]`, and we use `sum` from [List::Util](https://metacpan.org/pod/List::Util) to get 2. We keep a running **@total**, from which we modulus 1000000007.

Hrm.

I then save **\$t** as a modulus of **\$total**, rather than `$total = ( $total + $c ) % 1000000007`. I'm not sure that's the Right Thing at this point, but it is what I have written, so I'll stick with that.

```perl
sub count_set_bits( $n ) {
    my $total = 0;
    my $t     = 0;
    for my $i ( 0 .. $n ) {
        my $b = sprintf '%b', $i;
        my $c = sum split m{|}, $b;
        $total += $c;
        $t = $total % 1000000007;
    }
    return $t;
}
```

I'll switch over and add on should ` time ./ch-1.pl -n 1000000007` prove to be horrible.

...

Checking back. I've written all of the next one, and there's no sign that my challenge 1 test will return. I think I just chose a stupid big **\$N**. As such, I'll proceed as if this is good. 

### The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use Carp;
use List::Util qw{ sum };
use Getopt::Long;

my $n = 4;
GetOptions( 'n=i' => \$n, );
croak 'Non-positive number' if $n < 0;

my $total = count_set_bits($n);
say $total;

sub count_set_bits( $n ) {
    my $total = 0;
    my $t     = 0;
    for my $i ( 0 .. $n ) {
        my $b = sprintf '%b', $i;
        my $c = sum split m{|}, $b;
        $total += $c;
        $t = $total % 1000000007;
    }

    return $t;
}
```

```text
$ time ./ch-1.pl -n 1000000007
846928146

real    189m44.515s
user    189m42.880s
sys     0m1.484s
```

So it takes three hours to get to a billion and 7. I honestly don't know if that's to be expected or I lack clever.

### TASK #2 › Trapped Rain Water

> Submitted by: Mohammad S Anwar  
> You are given an array of positive numbers @N.
>
> Write a script to represent it as Histogram Chart and find out how much water it can trap.

One thing that made my last one sub-awesome was the fact that I had forgotten about **array slices**. Given the array `[2, 1, 4, 1, 2, 5]`, if we're looking a the fourth element, **\$N[3] == 1**, we can slice the array into `[2, 1, 4]` and `[2, 5]`. We can go back to [List::Util](https://metacpan.org/pod/List::Util) to use `max` on both splices, getting `4` and `5` respectively, so we can tell that there will be trapped rain in the fourth column, but at this point, we can't see how much.

I count down from the maximum value in **@N** and go down from there, but it's just as doable to start with the smallest positive number, **1**. The histogram for Example 1 looks like this:

```text
     5           #
     4     #     #
     3     #     #
     2 #   #   # #
     1 # # # # # #
     _ _ _ _ _ _ _
       2 1 4 1 2 5
```

Looking conceptually like a dual-dimensional array, we start with index **0,0**, which is is when we're looking at **2** in comparison with the lowest value, **5**.

- _Look at self:_ There is no `#` in that position. It is not a peak or trap.
- _Look to right:_ There is one value greater or equal to the array's highest value, so there is a peak to the right.
- _Look to the left:_ There are no values greater or equal to the array's highest value to the left. There's _nothing_ to the left, actually.

So there is no trapped water here.

We move on to **0,5**.

- _Look at self:_ There is a `#` in that position. It is a peak.

We'll jump ahead to **2,4**. This is deep into the second **1** column.

- _Look at self:_ There is no `#` in that position. It is not a peak or trap.
- _Look to right:_ There two values greater or equal to the current value of **2** (**2** and **5**), so there is a peak to the right.
- _Look to the left:_ There is one value greater or equal to the array's current value of **2** (simply **2**), so there's a peak to the left.

I keep and return a count, but I also create a filled histogram, to double-check my work.

```text
$ ./ch-2.pl
5            #
4      # . . #
3      # . . #
2  # . # . # #
1  # # # # # #

   2 1 4 1 2 5

6 units trapped
```

#### The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use Getopt::Long;
use List::Util qw{ max sum0 };

my @n = grep { $_ >= 1 } @ARGV;
@n = ( 2, 1, 4, 1, 2, 5 ) unless scalar @n;

# make_histogram(@n);
my $trapped = trap_rain_water(@n);

my $units = $trapped == 1 ? 'unit' : 'units';
say qq{$trapped $units trapped};

sub make_histogram ( @n ) {
    my $max = max @n;
    say '';
    for my $i ( reverse 1 .. $max ) {
        my @h = map { $i <= $_ ? '#' : ' ' } @n;
        say join ' ', $i, @h;
    }
    say join '-', ' ', map { '-' } @n;
    say join ' ', ' ', @n;
    say '';
}

sub trap_rain_water ( @n ) {
    my $max = max @n;
    my $s   = scalar @n;
    my $c   = 0;

    my @hist;

    for my $i ( reverse 1 .. $max ) {
        my $z = sum0 map { $i <= $_ ? 1 : 0 } @n;
        my @h;
        my $hh = [];
        push $hh->@*, $i, '';

        for my $j ( 0 .. $s - 1 ) {
            my $e = $n[$j];              # equals
            my $p = $e >= $i ? 1 : 0;    # is peak

            my @lt = @n[ 0 .. $j - 1 ];
            my @gt = @n[ $j + 1 .. $s - 1 ];
            my $lt = scalar grep { $_ >= $i } @lt;          # is peak to left
            my $gt = scalar grep { $_ >= $i } @gt;          # is peak to right
            my $t  = $p != 1 && $lt > 0 && $gt > 0 ? 1 : 0; # has trapped
            $c += $t;

            push @h, $e >= $i ? '#' : $t;
            my $v = ' ';
            $v = '#' if $p;
            $v = '.' if $t;
            push $hh->@*, $v;
        }

        push @hist, $hh;
    }

    say join "\n", map { join ' ', $_->@* } @hist, [], [ ' ', '', @n ];
    say '';

    return $c;
}
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
