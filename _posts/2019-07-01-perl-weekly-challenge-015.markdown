---
layout: post
title: "Perl Weekly Challenge 015"
author: "Dave Jacoby"
date: "2019-07-01 12:30:50 -0400"
categories: ""
---

## Challenge 1

> Write a script to generate first 10 strong and weak prime numbers.

Which is determined by:

> Strong `Prime number p(n) when p(n) > [ p(n-1) + p(n+1) ] / 2`
>
> Weak `Prime number p(n) when p(n) < [ p(n-1) + p(n+1) ] / 2`

This led me to a question. 2 is `p(1)`, so how do we work that into this? `p(n-1)` is not defined, because 2 is the lowest prime. Or is it? Please tell men.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental::postderef experimental::signatures };

# Write a script to generate first 10 strong and weak prime numbers.

# https://en.wikipedia.org/wiki/Strong_prime
#  (which contains a list of strong primes to ensure things are correct)

my @primes;
my @strong;
my @weak;

# create list of primes to judge strong, weak or balanced
while ( @strong < 10 && @weak < 10 ) {
    state $c += 1;
    if ( is_prime($c) ) { push @primes, $c }
    last if scalar @primes > 100;
}

for my $n ( 1 .. @primes ) {
    my $swb = is_strong($n);
    my $o   = $primes[$n];
    push @strong, $o if $swb == 1;
    push @weak,   $o if $swb == -1;
    last if @weak > 10 && @strong > 10;
}
say 'strong:  ' . join ", ",  @strong[0..9];
say 'weak:    ' . join ", ",  @weak[0..9];
exit;

# 1 if strong
# -1 if weak
# 0 if balanced
sub is_strong ( $n ) {
    my $o = $primes[$n];
    return 3 if $n <= 0;    # no n-1 -- look up this special case
    return 4
        if !$primes[ $n + 1 ];  # no n+1 -- we should be done well before then
    my $p = ( $primes[ $n - 1 ] + $primes[ $n + 1 ] ) / 2;
    return 1  if $o > $p;
    return -1 if $o < $p;
    return 0;
}

# this one again
sub is_prime ( $n ) {
    my @factors = factor($n);
    return scalar @factors == 1 ? 1 : 0;
}

# this has a slight modification, going only to sqrt $n, because
# there can't be a factor above that. Duh.
sub factor ( $n ) {
    my @factors;
    for my $i ( 1 .. sqrt $n ) {
        push @factors, $i if $n % $i == 0;
    }
    return @factors;
}
```

```text
strong:  11, 17, 29, 37, 41, 59, 67, 71, 79, 97
weak:    3, 7, 13, 19, 23, 31, 43, 47, 61, 73
```

Unless 2 _is_ a weak prime. I believe in my code, but I don't know if it fully conforms with the mathematical definition.

## Challenge 2

> Write a script to implement Vigenère cipher. The script should be able encode and decode. Checkout [wiki page](https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher) for more information.

Crypto! And old-school crypto at that. [There are two kinds of cryptography in this world: cryptography that will stop
your kid sister from reading your files, and cryptography that will stop major governments from reading your files.](https://www.schneier.com/books/applied_cryptography/) This challenge is about the former.

The core of this sort of cypher is this box:

```text
   0 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1 1 2 2 2 2 2 2
   0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
00 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
01 B C D E F G H I J K L M N O P Q R S T U V W X Y Z A
02 C D E F G H I J K L M N O P Q R S T U V W X Y Z A B
03 D E F G H I J K L M N O P Q R S T U V W X Y Z A B C
04 E F G H I J K L M N O P Q R S T U V W X Y Z A B C D
05 F G H I J K L M N O P Q R S T U V W X Y Z A B C D E
06 G H I J K L M N O P Q R S T U V W X Y Z A B C D E F
07 H I J K L M N O P Q R S T U V W X Y Z A B C D E F G
08 I J K L M N O P Q R S T U V W X Y Z A B C D E F G H
09 J K L M N O P Q R S T U V W X Y Z A B C D E F G H I
10 K L M N O P Q R S T U V W X Y Z A B C D E F G H I J
11 L M N O P Q R S T U V W X Y Z A B C D E F G H I J K
12 M N O P Q R S T U V W X Y Z A B C D E F G H I J K L
13 N O P Q R S T U V W X Y Z A B C D E F G H I J K L M
14 O P Q R S T U V W X Y Z A B C D E F G H I J K L M N
15 P Q R S T U V W X Y Z A B C D E F G H I J K L M N O
16 Q R S T U V W X Y Z A B C D E F G H I J K L M N O P
17 R S T U V W X Y Z A B C D E F G H I J K L M N O P Q
18 S T U V W X Y Z A B C D E F G H I J K L M N O P Q R
19 T U V W X Y Z A B C D E F G H I J K L M N O P Q R S
20 U V W X Y Z A B C D E F G H I J K L M N O P Q R S T
21 V W X Y Z A B C D E F G H I J K L M N O P Q R S T U
22 W X Y Z A B C D E F G H I J K L M N O P Q R S T U V
23 X Y Z A B C D E F G H I J K L M N O P Q R S T U V W
24 Y Z A B C D E F G H I J K L M N O P Q R S T U V W X
25 Z A B C D E F G H I J K L M N O P Q R S T U V W X Y
```

Assume the keyword is 'NEXT' and the cleartext is 'PERLCHALLENGE', you start with finding `N` is letter 13 and `P` is letter 15, finding that row 13, column 15 gives us `C` (and actually, row 15, column 13 gives us the same), so our cyphertext starts with `C`.

To reverse it, we find which column gives us cyphertext `C` when row is 13, which is 15, which is `P`.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state fc };
no warnings qw{ experimental::postderef experimental::signatures };

my $keyword   = 'ATTACKATDAWN';
my $cleartext = <<'END';
Write a script to implement Vigenere cipher.
The script should be able encode and decode.
END

# the point ISN'T to show off Getopt or File I/O techniques
# so I'm going way simple here.
$keyword   = $ARGV[0] ? $ARGV[0] : $keyword;
$cleartext = $ARGV[1] ? $ARGV[1] : $cleartext;

$keyword =~ tr/a-z/A-Z/;
$keyword =~ s/\W//g;
$cleartext =~ tr/a-z/A-Z/;    # or uc $cleartext. TMTOWTDI
$cleartext =~ s/\W//g;        # text that isn't alpha isn't encrypted
                              # and can give the game away.

my $cyphertext = encode_vigenere( $keyword, $cleartext );
my $decrypt = decode_vigenere( $keyword, $cyphertext );
say <<"END";
    CLEAR:
        $cleartext
    CYPHER:
        $cyphertext
    DECRYPT:
        $decrypt
END
exit;

sub encode_vigenere ( $keyword, $cleartext ) {
    my @keyword = split m{}, $keyword;
    my @base    = make_core_cypher();
    my @alpha   = 'A' .. 'Z';
    my %alpha   = map { $alpha[$_] => $_ } 0 .. 25;
    my @cypher;
    for my $clear ( split m{}, $cleartext ) {
        state $c = 0;
        # here's where I made a mistake, and wrote my decode to
        # work with my mistake. I was using $c % length $keyword
        # as the column determiner, rather than the index of the
        # letter at position $c % length $keyword.
        # the keyword 'aaaa' should give a cyphertext that's the
        # same as the cleartext.

        # If your algorithm cannot return an encrypted letter
        # that's the same as the clear letter, you have an
        # attack vector, but if your keyword is all "a" with this,
        # you have not encrypted anything.

        # and, really, long-term viability is not helped by
        # short variable names
        my $k = $keyword[ $c % length $keyword ];
        my $d = $alpha{$k};
        my $e = $alpha{$clear};
        my $f = $base[$d][$e];
        push @cypher, $f;
        $c++;
    }
    return join '', @cypher;
}

sub decode_vigenere ( $keyword, $cyphertext ) {
    my @keyword = split m{}, $keyword;
    my @base    = make_core_cypher();
    my @alpha   = 'A' .. 'Z';
    my %alpha   = map { $alpha[$_] => $_ } 0 .. 25;
    my @clear;
    for my $cypher ( split m{}, $cyphertext ) {
        state $c = 0;
        my $k = $keyword[ $c % length $keyword ];
        my $d = $alpha{$k};
        my $e;
        for my $i ( 0 .. 25 ) {
            $e = $i if $base[$d][$i] eq $cypher;
        }
        my $f = $alpha[$e];
        push @clear, $f;
        $c++;
    }
    return join '', @clear;
}

sub make_core_cypher () {
    my @alpha = 'A' .. 'Z';
    my @output;
    for my $i ( 0 .. 25 ) {
        for my $j ( 0 .. 25 ) {
            my $k = ( $i + $j ) % 26;
            my $l = $alpha[$k];
            $output[$i][$j] = $l;
        }
    }
    return @output;
}
```

```text
    CLEAR:
        WRITEASCRIPTTOIMPLEMENTVIGENERECIPHERTHESCRIPTSHOULDBEABLEENCODEANDDECODE
    CYPHER:
        WKBTGKSVUILGTHBMRVEFHNPIIZXNGBEVLPDRRMAEUMRBSTOUONEDDOAUOEAACHWECXDWHCKQE
    DECRYPT:
        WRITEASCRIPTTOIMPLEMENTVIGENERECIPHERTHESCRIPTSHOULDBEABLEENCODEANDDECODE
```

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
