---
layout: post
title: "Traveling Through Another Dimension: Weekly Challenge #324"
author: "Dave Jacoby"
date: "2025-06-05 18:02:25 -0400"
categories: ""
---

You're traveling through another dimension.

A dimension not just of length but of width.

A journey into a wonderous land whose boundaries are set by integers but can grow as far as your computer can count.

That's a signpost ahead. Next stop: [_**Weekly Challenge #324**_](https://theweeklychallenge.org/blog/perl-weekly-challenge-324/)

### Task 1: 2D Array

> Submitted by: Mohammad Sajid Anwar  
> You are given an array of integers and two integers `$r` amd `$c`.
>
> Write a script to create two dimension array having `$r` rows and `$c` columns using the given array.

#### Let's Talk About It

The key is to do the math for which row and column we're at while iterating through the input. Specifically, iterating on the column index, resetting to zero and iterating the row index when it equals `$c`.

When there's a case of `{ r => 2, c => 2, ints => [ 1, 2, 3, 4, 5, 6 ] }`, the output should also be `([1, 2], [3, 4])` because the instructions call for a two-by-two array, but the examples don't give an example with limits like that. Adding something like `next if $rr >= $r` should handle that.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

my @examples = (

    { r => 2, c => 2, ints => [ 1, 2, 3, 4 ] },
    { r => 1, c => 3, ints => [ 1, 2, 3 ] },
    { r => 4, c => 1, ints => [ 1, 2, 3, 4 ] },
);

for my $example (@examples) {
    my $r      = $example->{r};
    my $c      = $example->{c};
    my $ints   = join ', ', $example->{ints}->@*;
    my @output = two_d_array($example);
    my $output = join ', ', map { qq{[$_]} }
        map { join ', ', $_->@* } @output;
    say <<"END";
    Input:  \@ints = ($ints),
            \$r = $r,
            \$c = $c
    Output: ($output)
END
}

sub two_d_array($example) {
    my @output;
    my $r    = $example->{r};
    my $c    = $example->{c};
    my @ints = $example->{ints}->@*;
    my $rr   = my $cc = 0;
    for my $i (@ints) {
        $output[$rr][$cc] = $i;
        $cc++;
        if ( $cc >= $c ) {
            $cc = 0;
            $rr++;
        }
    }
    return wantarray ? @output : \@output;
}
```

```text
$ ./ch-1.pl
    Input:  @ints = (1, 2, 3, 4),
            $r = 2,
            $c = 2
    Output: ([1, 2], [3, 4])

    Input:  @ints = (1, 2, 3),
            $r = 1,
            $c = 3
    Output: ([1, 2, 3])

    Input:  @ints = (1, 2, 3, 4),
            $r = 4,
            $c = 1
    Output: ([1], [2], [3], [4])
```

### Task 2: Total XOR

> Submitted by: Mohammad Sajid Anwar  
> You are given an array of integers.
>
> Write a script to return the sum of `total XOR` for every subset of given array.

#### Let's Talk About It

I don't think I've dealt with [exclusive or](https://en.wikipedia.org/wiki/Exclusive_or) professionally. It's just not the type of computing I tend to do. I'm familiar, of course. It's `true` when `X` is `true` or `Y` is `true`, but `false` when both `X` and `Y` are `true`.

| X   | Y   | X XOR Y |
| --- | --- | ------- |
| 0   | 0   | 0       |
| 1   | 0   | 1       |
| 0   | 1   | 1       |
| 1   | 1   | 0       |

And this expands to the binary representations of numbers.

| base-10 | base-1 |
| ------- | ------ |
| 1       | 0001   |
| 3       | 0011   |
| 2       | 0010   |

So I created a function, `find_xor` to do the work. `X = 0`. For every `Y` in the array, `X = X ^ Y`. In the end, return `X`.

But that gives us one of the possible subsets of `@ints`. Here is where we go to [Algorithm::Permute](https://metacpan.org/pod/Algorithm::Permute), which I feel I mention a lot.

Thing is, given an array `[1, 2, 3]`, it will give us `[1, 2, 3]`,`[1, 3, 2]`,`[2, 1, 3]`,`[2, 3, 1]`,`[3, 1, 2]` and `[3, 2, 1]`. We only want one of those.

So, instead of the ints, I use the indices, sort the indices, and use my favorite `next if $done{$x}++` trick. Remember last week with the prefix iteration and suffix iteration? Here, `$done{$x}` gets iterated after the test, so "Nope, `$done{$x}` doesn't exist!", then suddenly it does. A simple `map` then gives us the correct order. I mean, it kinda doesn't matter, [XOR is commutative and associative](https://en.wikipedia.org/wiki/Exclusive_or#Properties), but it's good to be able to preserve order when necessary and not just aesthetically pleasing.

A quick note: In many instances, `sort @ints` is not what you want, because sorting `1..10` will give you `1, 10, 2, 3, 4, 5, 6, 7, 8, 9`. In this case, it doesn't matter, because duplicates will always sort the same in the alphabetical way. Just, when order really matters, remember `sort { $a <=> $b } @ints`.

A wonderful thing about Algorithm::Permute is that you can set it to give you the size of the permutations, which means we loop from `1` to `$#ints`. And of course, `$sum += find_xor(@array)`.

I notice `my $s = function(@input); $sum += $s` and the like, and that's a part of me testing. I generally use print debugging, and here, we can print `$s` so I know internal state before going on. Yes, I could run a _real_ debugger, and VS Code's **Perl Debug Adapter** has been useful once or twice, but I don't use it often, while I add print statements all over. But the above should probably be `$sum += function(@input)` instead.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };
use Algorithm::Permute;

my @examples = (

    [ 1, 3 ],
    [ 5, 1, 6 ],
    [ 3, 4, 5, 6, 7, 8 ],
);

for my $example (@examples) {
    my $ints   = join ', ', $example->@*;
    my $output = total_xor( $example->@* );
    say <<"END";
    Input:  \@ints = ($ints)
    Output: $output
END
}

sub total_xor(@example) {
    my $sum     = 0;
    my @indices = 0 .. $#example;
    for my $l ( 1 .. scalar @example ) {
        my %done;
        my $p = Algorithm::Permute->new( \@indices, $l );
        while ( my @x = sort $p->next ) {
            my $x = join ' ', sort @x;
            next if $done{$x}++;
            my @y = map { $example[$_] } @x;
            my $s = find_xor(@y);
            $sum += $s;
        }
    }
    return $sum;
}

sub find_xor (@array) {
    my $x = 0;
    while (@array) { my $i = shift @array; $x = $x ^ $i; }
    return $x;
}
```

```text
$ ./ch-2.pl
    Input:  @ints = (1, 3)
    Output: 6

    Input:  @ints = (5, 1, 6)
    Output: 28

    Input:  @ints = (3, 4, 5, 6, 7, 8)
    Output: 480
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
