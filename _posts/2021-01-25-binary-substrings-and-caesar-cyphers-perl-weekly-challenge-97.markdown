---
layout: post
title: "Binary Substrings and Caesar ciphers: Perl Weekly Challenge 97"
author: "Dave Jacoby"
date: "2021-01-25 17:09:58 -0500"
categories: ""
---

### TASK #1 › Caesar Cipher

> Submitted by: Mohammad S Anwar  
> You are given string `$S` containing alphabets A..Z only and a number `$N`.
>
> Write a script to encrypt the given string `$S` using Caesar Cipher with left shift of size `$N`.

Before we dive into this, I would like quote [Bruce Schneier](https://www.schneier.com/) from the intro to his book, [_Applied Cryptography_](https://www.schneier.com/books/applied-cryptography-2preface/).

> _There are two kinds of cryptography in this world: cryptography that will stop your kid sister from reading your files, and cryptography that will stop major governments from reading your files._

That book is about the latter, but this algorithm is definitely the former. You might've caught that, seeing that it's named after a man who turned the Roman Republic into the Roman Empire about 2000 years ago. [There are web tools that can decipher your code in fractions of a second.](https://www.dcode.fr/caesar-cipher) But it's fun to shovel bits around, isn't it?

In short, we start by choosing a cipher. Here, we're offsetting the alphabet by 3.

```text
ABCDEFGHIJKLMNOPQRSTUVWXYZ
   ABCDEFGHIJKLMNOPQRSTUVWXYZ
                          ^ snip
XYZABCDEFGHIJKLMNOPQRSTUVW
```

We then change every `A` in our plaintext to `X`, and so on.

If we _just_ wanted to do this, then we've recently seen that `tr///` is a perfect operator for this job.

```perl
my $ciphertext = $plaintext = tr/A-Z/X-ZA-W/r;
```

There's a problem with this, which is that `$N` can change, but the `tr` is set at compile time. I can't do `tr/$plain/$cipher/`, and I gave up on trying to make `eval "tr/$plain/$cipher/"` work how I wanted.

I _could_ do this, but it's silly.

```perl
my $ciphertext;
$ciphertext = $plaintext = tr/A-Z/ZA-Y/r if $N == 1;
$ciphertext = $plaintext = tr/A-Z/Y-ZA-X/r if $N == 2;
$ciphertext = $plaintext = tr/A-Z/X-ZA-W/r if $N == 3;
$ciphertext = $plaintext = tr/A-Z/W-ZA-V/r if $N == 4;
...
```

So, let us assume we get to the point where we have `@plain` being an array of our alphabet in order, and `@cipher` being the letters they translate to. This is a way you might think to do it:

```perl
my $ciphertext = $plaintext ;

for my $i ( 0..$#plain ) {
    $ciphertext =~ s/$plain[$i]/$cipher[$i]/gmx;
}
```

The problem here is that each letter is in both the plain and cipher list, so you have a great chance of moving from `A` to `X` to `U` to a totally messed-up ciphertext.

#### There Has To Be A Better Way!

The transfer should be on each individual letter, so create a hash table such that `$hash->{$plain} = $cipher`. So, to create the ciphertext, it's as easy as:

```perl
my $t = join '',
        map { $cipher{$_} ? $cipher{$_} : $_ }
        split //, $s;
```

This way, each character of the plaintext is encyphered individually, so we can't double-encrypt things accidentally.

#### The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use Getopt::Long;

my $n = 3;
my $s = 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG';

GetOptions(
    'number=i' => \$n,
    'string=s' => \$s,
);

caesar_cipher( $s, $n );

sub caesar_cipher ( $s, $n ) {
    my @alpha = 'A' .. 'Z';
    my @bet   = @alpha;
    for ( 1 .. $n ) {
        unshift @bet, pop @bet;
    }

    my $alpha  = join '', @alpha;
    my $bet    = join '', @bet;
    my %cipher = map { $alpha[$_] => $bet[$_] } 0 .. $#alpha;

    $s = uc $s;

    my $t = join '', map { $cipher{$_} ? $cipher{$_} : $_ } split //, $s;

    say <<"END";

    INPUT:
        \$S = "$s", \$N = $n
    OUTPUT:
        "$t"

    Plain:  $alpha
    cipher: $bet

END

}
```

#### TRADECRAFT

```text
QEB NRFZH YOLTK CLU GRJMP LSBO QEB IXWV ALD
```

`THE` is a particularly comon word in English. We look at this and we might want to find the three-letter words, and `QEB` shows up twice. Let's assume that `QEB` means `THE`.

```text
the NRFZH YOLTK CLU GRJMP LSBO the IXWV ALD
```

It's a start. No other `Q`, no other `E`, but there is `B`, and if we're right, that'll be an `E`

```text
the NRFZH YOLTK CLU GRJMP LSeO the IXWV ALD
```

Generally, you would want to remove anything from the plaintext that can't be encrypted and hidden, to avoid giving more hints than necessary.

```text
QEBNRFZHYOLTKCLUGRJMPLSBOQEBIXWVALD
```

Granted, it means you should write your plaintext unambiguously. `THETARGETISNOWHERE` is not what you would want to encrypt and send, either.

Although, you probably don't want learn your tradecraft from a random blog, either.

### TASK #2 › Binary Substrings

> Submitted by: Mohammad S Anwar
> You are given a binary string $B and an integer $S.
>
> Write a script to split the binary string $B of size $S and then find the minimum number of flips required to make it all the same.

There's a bitwise solution for this. Of this I am sure.

But this is Perl, and in Perl, we like strings. And last week, I used and blogged about exactly the thing that will tell me _exactly_ the thing to tell me the number of flips.

[Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance).

The next part is pulling substrings the size of `$S` ...

```perl
my $sub = substr( $C, 0, $S );
```

and removing them from the string ...

```perl
substr( $C, 0, $S ) = '';
```

and being thankful to remember that `substr` works both as an [**lvalue**](https://perldoc.perl.org/perlglossary#lvalue) and an [**rvalue**](https://perldoc.perl.org/perlglossary#rvalue).

In this case, we use it in a while loop, and the binary string `"101100101"` becomes `"100101"`, then `"101"`, then `""`, simply by removing the first `$S` characters.

#### The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use List::Util qw{min};

binary_substrings( '101100101', 3 );
binary_substrings( '10110111',  4 );
binary_substrings( '111100000000',  4 );

sub binary_substrings ( $B, $S ) {

    # we're comparing everything to the first substring in B
    # of size S, so let's pull it out here.
    # also copy B so it's unmodified when done.
    my $base = substr $B, 0, $S;
    my $C    = $B;

    my $total = 0;
    my @list;

    while ($C) {
        my $sub = substr( $C, 0, $S );
        substr( $C, 0, $S ) = '';

        # I feel there MUST be a bitwise operator that
        # would be perfect for this, but I never deal with
        # bitwise operators, and we dealt with edit distance
        # just last week
        my $d = levenshtein_distance( $base, $sub );
        $total += $d;

        # d < 1 is a bit of belt-and-suspenders thinking,
        # because coming from levenshtein, it will only be
        # a non-negative integer, but still...

        # and the examples distinguished between "1 flip" 
        # and "2 flips", so to handle singular and plural,
        # we move to three cases. 

        if    ( $d < 1 ) { push @list, qq{"$sub": 0 flip}; }
        elsif ( $d == 1 ) {
            push @list, qq{"$sub": 1 flip to make it "$base"};
        }
        else { push @list, qq{"$sub": $d flips to make it "$base"}; }
    }
    say qq{INPUT: \$B = "$B", \$S = $S};
    say qq{Output: $total};
    say join "\n\t", 'Binary Substrings:', @list;
    say '';
}

# -------------------------------------------------------------------
# straight copy of Wikipedia's "Levenshtein Distance"
sub levenshtein_distance {
    my ( $f, $g ) = @_;
    my @a = split //, $f;
    my @b = split //, $g;

    # There is an extra row and column in the matrix. This is the
    # distance from the empty string to a substring of the target.
    my @d;
    $d[$_][0] = $_ for ( 0 .. @a );
    $d[0][$_] = $_ for ( 0 .. @b );

    for my $i ( 1 .. @a ) {
        for my $j ( 1 .. @b ) {
            $d[$i][$j] = (
                  $a[ $i - 1 ] eq $b[ $j - 1 ]
                ? $d[ $i - 1 ][ $j - 1 ]
                : 1 + min(
                    $d[ $i - 1 ][$j],
                    $d[$i][ $j - 1 ],
                    $d[ $i - 1 ][ $j - 1 ]
                )
            );
        }
    }
    return $d[@a][@b];
}
```

```text
INPUT: $B = "101100101", $S = 3Output: 1
Binary Substrings:
        "101": 0 flip
        "100": 1 flip to make it "101"
        "101": 0 flip

INPUT: $B = "10110111", $S = 4
Output: 2
Binary Substrings:
        "1011": 0 flip
        "0111": 2 flips to make it "1011"

INPUT: $B = "111100000000", $S = 4
Output: 8
Binary Substrings:
        "1111": 0 flip
        "0000": 4 flips to make it "1111"
        "0000": 4 flips to make it "1111"
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
