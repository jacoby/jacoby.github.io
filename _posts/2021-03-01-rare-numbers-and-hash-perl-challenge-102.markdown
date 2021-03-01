---
layout: post
title: "Rare Numbers and Hash: Perl Challenge #102"
author: "Dave Jacoby"
date: "2021-03-01 15:41:02 -0500"
categories: ""
---

### TASK #1 › Rare Numbers

> Submitted by: Mohammad S Anwar  
> You are given a positive integer `$N`.
>
> Write a script to generate all Rare numbers of size `$N` if exists. Please checkout the [**page**](http://www.shyamsundergupta.com/rare.htm) for more information about it.

Just as a thing, `00001` is not a number of size `5` because the initial zeroes go away, so we start at `10000`. This is figured out with a bit of mappery: `join '', map { $_ == 1 ? 1 : 0 } 1 .. $N`. And of course, we end with `99999`, which is simply `9 x $N`.

This is _slow_ because we _have_ to check every value between `$low` and `$high`. With `$N <= 7`, the time taken is negligable, but getting much farther, we start looking at thousands to millions of possible numbers to test. It strikes me that, as an optimization, we test `r1`, the reversed number, as well as `r` and `next` early if we've already covered them, but my solution does not currently cover that option. It is also slow because `sqrt` is so known to be slow that public key encryption is built upon that slowness.

An issue I _had_ to solve before going forward is that `sqrt($r-$r1)` fails if `$r < $r1`. Yes, this is _exactly_ where the reversal solution would fit, but eh.

And speaking of reversals, I think this week's tasks reverse my go-to methodology for these challenges. These _don't_ look like a job for recursion. I'm pretty sure it would resource-hog and behave terribly and not be better than this iterative take.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

use Carp;

my $i = shift @ARGV;
$i //= 2;
croak 'non-positive integer' if $i < 1;
croak 'not an integer'       if $i =~ /\D/;

say join "\n\t", "RARE NUMBERS: $i", rare_numbers($i), '';

# a number r is "rare" when:
#   - r1 is that number reversed
#   - sqrt(r+r1) is an integer
#   - sqrt(r-r1) is an integer
sub rare_numbers ( $i ) {
    my @output;

    # given i == 5,
    # low is 10000, the smallest five-digit number
    # high is 99999, the highest five-digit number
    my $low  = join '', map { $_ == 1 ? 1 : 0 } 1 .. $i;
    my $high = 9 x $i;

    for my $r ( $low .. $high ) {
        my $r1 = reverse $r;
        next if $r - $r1 < 0;    # early block for thing that break sqrt

        my $s1 = sqrt( $r + $r1 );
        next if $s1 =~ /\D/;     # test if integer

        my $s2 = sqrt( $r - $r1 );
        next if $s2 =~ /\D/;     # test if integer

        push @output, $r;
    }
    return @output;
}
```

```text
## for i in {1..9}; do time ./ch-1 $i ; done

RARE NUMBERS: 1
        2
        8


real    0m0.039s
user    0m0.000s
sys     0m0.000s
RARE NUMBERS: 2
        65


real    0m0.035s
user    0m0.016s
sys     0m0.000s
RARE NUMBERS: 3
        242


real    0m0.039s
user    0m0.000s
sys     0m0.031s
RARE NUMBERS: 4


real    0m0.039s
user    0m0.000s
sys     0m0.016s
RARE NUMBERS: 5
        20402
        24642


real    0m0.091s
user    0m0.063s
sys     0m0.000s
RARE NUMBERS: 6
        621770


real    0m0.537s
user    0m0.500s
sys     0m0.031s
RARE NUMBERS: 7
        2004002
        2138312
        2468642


real    0m5.383s
user    0m5.281s
sys     0m0.047s
RARE NUMBERS: 8
        85099058


real    1m6.035s
user    1m4.859s
sys     0m0.109s
RARE NUMBERS: 9
        200040002
        204060402
        242484242
        281089082
        291080192


real    11m15.996s
user    11m6.047s
sys     0m0.984s
```

### TASK #2 › Hash-counting String

> Submitted by: Stuart Little  
> You are given a positive integer `$N`.
>
> Write a script to produce Hash-counting string of that length.
>
> The definition of a hash-counting string is as follows:
>
> - the string consists only of digits 0-9 and hashes, ‘#’
> - there are no two consecutive hashes: ‘##’ does not appear in your string
> - the last character is a hash
> - the number immediately preceding each hash (if it exists) is the position of that hash in the string, with the position being counted up from 1
>
> It can be shown that for every positive integer N there is exactly one such length-N string.

The trick here is to look at the _always_. There's _always_ a hash at the end. If there's an always, take care of it first, which means we build from the end. Let's look at the case of `10`. `$output` starts as the empty string, and `$O` is copied from `$N` and is `10`.

- `$output = '#' . $output`, and is thus `#`. The length of `$output` is less than `$N` (I use `$i` for `$N` in my code, and `$j` for `$O`), so we also `$output = $O . $output`. Now `$output == '10#'`, so we make `$O` 10 - 3, or `7`.
- `$output = '#' . $output`, and is thus `#10#`. The length of `$output` is less than `$N`, so we also `$output = $O . $output`. Now `$output == '7#10#'`, and `$O` == 10 - 5 == 7.
- `$output = '#' . $output`, and is thus `#7#10#`. The length of `$output` is less than `$N`, so we also `$output = $O . $output`. Now `$output == '5#7#10#'`, and `$O` == 10 - 7 == 3.
- `$output = '#' . $output`, and is thus `#5#7#10#`. The length of `$output` is less than `$N`, so we also `$output = $O . $output`. Now `$output == '3#5#7#10#'`, and `$O` == 10 - 9 == 1.
- `$output = '#' . $output`, and is thus `#3#5#7#10#`. The length of `$output` is equal to `$N`, so stop.

There's nothing too hard here

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

use Carp;

my $i = shift @ARGV;
$i //= 2;
croak 'non-positive integer' if $i < 1;
croak 'not an integer'       if $i =~ /\D/;

say join "\t", $i, hash_count($i);

sub hash_count( $i ) {
    my $output = '';
    my $j      = $i;
    while ( $j > 0 ) {
        $output = '#' . $output;
        $output = $j . $output if length $output < $i;
        $j = $i - length $output;
    }
    return $output;
}
```

I didn't bother to try to add time to this, because it's almost instant.

```text
for i in {1..50} ; do ./ch-2.pl $i ; done
1       #
2       2#
3       #3#
4       2#4#
5       #3#5#
6       2#4#6#
7       #3#5#7#
8       2#4#6#8#
9       #3#5#7#9#
10      #3#5#7#10#
11      2#4#6#8#11#
12      #3#5#7#9#12#
13      #3#5#7#10#13#
14      2#4#6#8#11#14#
15      #3#5#7#9#12#15#
16      #3#5#7#10#13#16#
17      2#4#6#8#11#14#17#
18      #3#5#7#9#12#15#18#
19      #3#5#7#10#13#16#19#
20      2#4#6#8#11#14#17#20#
21      #3#5#7#9#12#15#18#21#
22      #3#5#7#10#13#16#19#22#
23      2#4#6#8#11#14#17#20#23#
24      #3#5#7#9#12#15#18#21#24#
25      #3#5#7#10#13#16#19#22#25#
26      2#4#6#8#11#14#17#20#23#26#
27      #3#5#7#9#12#15#18#21#24#27#
28      #3#5#7#10#13#16#19#22#25#28#
29      2#4#6#8#11#14#17#20#23#26#29#
30      #3#5#7#9#12#15#18#21#24#27#30#
31      #3#5#7#10#13#16#19#22#25#28#31#
32      2#4#6#8#11#14#17#20#23#26#29#32#
33      #3#5#7#9#12#15#18#21#24#27#30#33#
34      #3#5#7#10#13#16#19#22#25#28#31#34#
35      2#4#6#8#11#14#17#20#23#26#29#32#35#
36      #3#5#7#9#12#15#18#21#24#27#30#33#36#
37      #3#5#7#10#13#16#19#22#25#28#31#34#37#
38      2#4#6#8#11#14#17#20#23#26#29#32#35#38#
39      #3#5#7#9#12#15#18#21#24#27#30#33#36#39#
40      #3#5#7#10#13#16#19#22#25#28#31#34#37#40#
41      2#4#6#8#11#14#17#20#23#26#29#32#35#38#41#
42      #3#5#7#9#12#15#18#21#24#27#30#33#36#39#42#
43      #3#5#7#10#13#16#19#22#25#28#31#34#37#40#43#
44      2#4#6#8#11#14#17#20#23#26#29#32#35#38#41#44#
45      #3#5#7#9#12#15#18#21#24#27#30#33#36#39#42#45#
46      #3#5#7#10#13#16#19#22#25#28#31#34#37#40#43#46#
47      2#4#6#8#11#14#17#20#23#26#29#32#35#38#41#44#47#
48      #3#5#7#9#12#15#18#21#24#27#30#33#36#39#42#45#48#
49      #3#5#7#10#13#16#19#22#25#28#31#34#37#40#43#46#49#
50      2#4#6#8#11#14#17#20#23#26#29#32#35#38#41#44#47#50#
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
