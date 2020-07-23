---
layout: post
title: "Perl Weekly Challenge #70"
author: "Dave Jacoby"
date: "2020-07-22 22:22:59 -0400"
categories: ""
---

### TASK #1 › Character Swapping

> Submitted by: Mohammad S Anwar
>
> You are given a string `$S` of size `$N`.
>
> You are also given swap count `$C` and offset `$O` such that `$C >= 1`, `$O >= 1`, `$C <= $O` and `$C + $O <= $N`.
>
> **UPDATE: 2020-07-20 16:10:00**
> Pete Houston suggested to put additional constraint i.e. `$C <= $O`. He presented the use case `$S = 'abcd'`, `$C = 2`, `$O = 1`.
>
> Write a script to perform character swapping like below:

```text
$S[ 1 % $N ] <=> $S[ (1 + $O) % $N ]
$S[ 2 % $N ] <=> $S[ (2 + $O) % $N ]
$S[ 3 % $N ] <=> $S[ (3 + $O) % $N ]
...
...
$S[ $C % $N ] <=> $S[ ($C + $O) % $N ]
```

**Example 1**

```text
Input:
    $S = 'perlandraku'
    $C = 3
    $O = 4

Character Swapping:
    swap 1: e <=> n = pnrlaedraku
    swap 2: r <=> d = pndlaerraku
    swap 3: l <=> r = pndraerlaku

Output:
    pndraerlaku
```

And the developers said **"huh?"**

What was happening and why wasn't immediately clear, until I created the `for my $i ( 2 .. $c ) { ... }` loop. Then, duh, it's the character in **this** location swaps with the one in **that** location. _Why_ you'd want to do such a thing remains a mystery, but _how_ you'd do it is clearer.

**Notes:**

- `Getopt::Long` is useful, the suggested to-use Getopt module from _Perl Best Practices_. Here we can force the values into the correct types, which we then control further with `croak`.
- `substr` can be _both_ an rvalue and an lvalue, making it easy to do the swap. I _could_ do `$x = substr($string,$p1,1); substr($string,$p1,1) = substr($string,$p2,1); substr($string,$p2,1) = $x;` But economimizing one register is false efficiency.
- I'm personally iffy on continuing with Heredocs, thinking that they're the kind of wonky perlisms that make Perl hard to parse. I should test against [Guacamole](https://metacpan.org/pod/Guacamole) one of these days. But, for this toy code, I'm happy to keep it.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental::signatures };

use Carp;
use Getopt::Long;

# base case is the example;
my $string = 'perlandroku';
my $count  = 3;
my $offset = 4;

GetOptions(
    'string=s' => \$string,
    'count=i'  => \$count,
    'offset=i' => \$offset,
);

# constraints
my $n = length $string;
$n >= 0               || croak 'String too short';
$count >= 1           || croak 'Swap Count < 1';
$offset >= 1          || croak 'Offset < 1';
$count <= $offset     || croak 'Count > Offset';
$offset + $count < $n || croak 'Offset + Count < length of String';

char_swap( $string, $count, $offset );

sub char_swap ( $string, $count, $offset ) {
    my $n = length $string;
    print <<"END";
Input:
    S: $string
    C: $count
    O: $offset

Character Swapping:
END

    for my $c ( 1 .. $count ) {

        # the locations within the string
        my $p1 = ( $c % $n );
        my $p2 = ( $c + $offset ) % $n;

        # the characters in said positions
        my $c1 = substr $string, $p1, 1;
        my $c2 = substr $string, $p2, 1;

        # since we have the characters stored already
        # we don't need to store one and place the other
        substr( $string, $p1, 1 ) = $c2;
        substr( $string, $p2, 1 ) = $c1;

        say qq{    swap $c: $c1 <=> $c2 = $string};
    }
    print <<"END";

Output:
    $string
END
}
```

### TASK #2 › Gray Code Sequence

> Submitted by: Mohammad S Anwar
>
> You are given an integer `2 <= $N <= 5`.
>
> Write a script to generate `$N-bit` gray code sequence.
>
> To generate the 3-bit Gray code sequence from the 2-bit Gray code sequence, follow the step below:

```text
2-bit Gray Code sequence
[0, 1, 3, 2]

Binary form of the sequence
a) S1 = [00, 01, 11, 10]

Reverse of S1
b) S2 = [10, 11, 01, 00]

Prefix all entries of S1 with '0'
c) S1 = [000, 001, 011, 010]

Prefix all entries of S2 with '1'
d) S2 = [110, 111, 101, 100]

Concatenate S1 and S2 gives 3-bit Gray Code sequence
e) [000, 001, 011, 010, 110, 111, 101, 100]

3-bit Gray Code sequence
[0, 1, 3, 2, 6, 7, 5, 4]
```

**Example**

```text
Input: \$N = 4

Output: [0, 1, 3, 2, 6, 7, 5, 4, 12, 13, 15, 14, 10, 11, 9, 8]
```

Is there anything clever and worth noting in this? I documented it a lot, so I don't think there's much to add.

Well, I used `space_after` in my [JSON](https://metacpan.org/pod/JSON) object to give me an output close to that in the example, and there's also `space_before`, so read through and see which cool things you can use.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental::signatures };

use Carp;
use Getopt::Long;
use JSON;

# base case is the example;
my $n = 2;

GetOptions( 'number=i' => \$n, );

# constraints
2 <= $n || croak 'N too small';
$n <= 5 || croak 'M too big';

say qq{n: $n};

grey_code($n);

sub grey_code ( $n ) {

    # I THINK...
    # a zero-bit grey sequence would be []
    # for one bit, add '0' to each nothing to the left,
    #   '1' to each nothing to the right,
    #    so we get the one-bit grey sequence of [ 0, 1 ]
    # for a two-bit grey sequence, we do the same, but
    #   with actual sequences, which become
    # [ 00 , 01 , 11, 10 ], which, when turned back to
    # decimal, becomes...
    my @sequence = ( 0, 1, 3, 2 );

    # conceptually, we need a while, not a do-while, because
    # the sequence, right now, is a correct two-bit grey sequence
    if ( $n > 2 ) {
        for my $i ( 3 .. $n ) {
            # s1 is sequence converted to binary
            # s2 is s1 reversed
            my @s1 = map { dec2bin( $_, $i ) } @sequence;
            my @s2 = reverse @s1;

            # we append 0 to all entries in s1
            # and 1 to all the s2 entries
            @s1 = map { '0' . $_ } @s1;
            @s2 = map { '1' . $_ } @s2;

            # and then we join the two into one,
            my @s3 = ( @s1, @s2 );
            @sequence = map { bin2dec($_) } @s3;
        }
    }

    # JSON object here because it makes this function more
    # "pure"
    my $json = JSON->new->space_after;
    say $json->encode( \@sequence );
}

# not the dec2bin given by the Perl Cookbook, because
# we need to control the number of bits, because both
# 00000010 and 010 are 2, but only one behaves correctly
# when 1 is prepended.
# By the way, I LOVE sprintf.
sub dec2bin ( $n, $i = 2 ) {
    return sprintf "%0${i}b", $n;
}

# bin2dec as taken from the Perl Cookbook
sub bin2dec ($bin) {
    return unpack( "N", pack( "B32", substr( "0" x 32 . $bin, -32 ) ) );
}
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
