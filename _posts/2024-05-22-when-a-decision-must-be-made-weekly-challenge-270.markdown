---
layout: post
title: "When A Decision Must Be Made: Weekly Challenge #270"
author: "Dave Jacoby"
date: "2024-05-22 19:05:41 -0400"
categories: ""
---

Here we go into **[Weekly Challenge #270!](https://theweeklychallenge.org/blog/perl-weekly-challenge-270/)**

The biggest thing in my head about 270, besides it being clearly not a prime, is that the [US Interstate Highway System](https://en.wikipedia.org/wiki/Interstate_Highway_System#Numbering_system) uses one- or two-digit numbers, ending in odd numbers, primarily **5**, for North-South, and even numbers, primarily **0**, for East-West, with the lowest numbers being the most south and west, giving us _the Five_ meeting _the Ten_ in Los Angeles. _Interstate 70_ goes from Maryland to Utah, and goes through St. Louis, Missouri. Commonly, a third digit is added to indicate spur lines or beltways. There are four places designated as [**Interstate 270**](https://en.wikipedia.org/wiki/Interstate_270), and one of them was about 360 yards (330 meters) where I lived in St. Louis.

It's also a natural number, 3/4th of a turn, surrounded by twin primes, and an Area Code for Bowling Green, Kentucky.

### Task 1: Special Positions

> Submitted by: Mohammad Sajid Anwar  
> You are given a `m x n` binary matrix.
>
> Write a script to return the number of special positions in the given binary matrix.
>
> > A position `(i, j)` is called special if `$matrix[i][j] == 1` and all other elements in the row `i` and column `j` are `0`.

#### Let's Talk About This

I really don't know what to say. It's a matrix, so it's a multidimensional array. Back in CS 180, we were warned against iterating on the first element in your multidimensional array over the second, because you're jumping all over the disk (if I remember), but I have since benchmarked it and don't think there's much of a problem.

"Anymore" or "Now that we have copious caches and solid-state drives" _might_ be a key addition to this sentence.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ bitwise fc postderef say signatures state };

my @examples = (

    [ [ 1, 0, 0 ],
      [ 0, 0, 1 ],
      [ 1, 0, 0 ], ],
    [ [ 1, 0, 0 ],
      [ 0, 1, 0 ],
      [ 0, 0, 1 ],
    ],

);
for my $example (@examples) {
    my $output = special_positions($example);
    my $input = display_matrix( $example);
say <<"END";
    Input:  \$matrix =
        [ $input ]
    Output: $output
END
}

sub special_positions ($matrix) {
    my $output = 0;
OUTER: for my $i ( 0 .. -1 + scalar keys $matrix->@* ) {
        for my $j ( 0 .. -1 + scalar keys $matrix->[$i]->@* ) {
            for my $x ( 0 .. -1 + scalar keys $matrix->[$i]->@* ) {
                my $v = $matrix->[$i][$x];
                next OUTER if $v == 0 && $x == $j;
                next OUTER if $v != 0 && $x != $j;
            }
            for my $y ( 0 .. -1 + scalar keys $matrix->@* ) {
                my $v = $matrix->[$y][$j];
                next OUTER if $v == 0 && $y == $i;
                next OUTER if $v != 0 && $y != $i;
            }
            $output++;
        }
    }
    return $output;
}

sub display_matrix ($matrix) {
    return join ",\n          ",
        map { join ' ', '[', ( join ', ', $_->@* ), ']' } $matrix->@*;
}
```

```text
$ ./ch-1.pl
    Input:  $matrix =
        [ [ 1, 0, 0 ],
          [ 0, 0, 1 ],
          [ 1, 0, 0 ] ]
    Output: 0

    Input:  $matrix =
        [ [ 1, 0, 0 ],
          [ 0, 1, 0 ],
          [ 0, 0, 1 ] ]
    Output: 1
```

###Task 2: Equalize Array

> Submitted by: Mohammad Sajid Anwar  
> You are give an array of integers, `@ints` and two integers, `$x` and `$y`.
>
> Write a script to execute one of the two options:
>
> > **Level 1:** Pick an index `i` of the given array and do `$ints[i] += 1`
> >
> > **Level 2:** Pick two different indices `i,j` and do `$ints[i] +=1` and `$ints[j] += 1`.
>
> You are allowed to perform as many levels as you want to make every elements in the given array equal. There is cost attach for each level, for Level 1, the cost is `$x` and `$y` for Level 2.
>
> In the end return the minimum cost to get the work done.

#### Let's Talk About This

I thought a lot about making this recursive, finding all possible solutions and such, but then it hit me: If the cost for Level 2 is less than half the cost of Level One, it is always the cheaper option, so you can build that into the _if_ statement and make it an iterative solution.

No **This Looks Like A Job for _Recursion!!!!_** today.

Looking back, I think if this was more _real_ code, I would put the _find the first entry less than max and iterate it_ into another function, but I'm happy with what I have.

I again use [List::Util](https://metacpan.org/pod/List::Util) to make this easy, going with `first` and `max`. I use `first { $ints[$_] < $max } 0 .. -1 + scalar @ints` to find indexes where the value is less than `max(@ints)`. I do that once or twice, depending on the costs of Level 1 and 2 actions.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ fc say postderef signatures state };

use List::Util qw{ first max };

my @examples = (

    [ 3, 2, 4, 1 ],
    [ 2, 1, 2, 3, 3, 3, 5 ],
    [ 1, 3, 2, 3, 3, 3, 5 ],
);

for my $example (@examples) {
    my $output = distribute_elements( $example->@* );
    my ( $x, $y, @ints ) = $example->@*;
    my $ints = join ', ', @ints;

    say <<"END";
        Input:  \@ints = ($ints), \$x = $x, \$y = $y
        Output: $output
END
}

sub distribute_elements (@input) {
    my ( $x, $y, @ints ) = @input;
    my $max   = max @ints;
    my $count = scalar grep { $_ < $max } @ints;
    my $cost  = 0;
    my $check = $x * 2 >= $y ? 1 : 0;
    while ($count) {
        if ( $check && $count > 1 ) {
            my $f = first { $ints[$_] < $max } 0 .. -1 + scalar @ints;
            my $s =
                first { $ints[$_] < $max && $_ != $f } 0 .. -1 + scalar @ints;
            $ints[$f]++;
            $ints[$s]++;
            $cost += $y;
        }
        else {
            my $f = ( first { $ints[$_] < $max } 0 .. -1 + scalar @ints );
            $ints[$f]++;
            $cost += $x;
        }
        $count = scalar grep { $_ < $max } @ints;
    }
    return $cost;
}
```

```text
$ ./ch-2.pl
        Input:  @ints = (4, 1), $x = 3, $y = 2
        Output: 9

        Input:  @ints = (2, 3, 3, 3, 5), $x = 2, $y = 1
        Output: 6

        Input:  @ints = (2, 3, 3, 3, 5), $x = 1, $y = 3
        Output: 9
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
