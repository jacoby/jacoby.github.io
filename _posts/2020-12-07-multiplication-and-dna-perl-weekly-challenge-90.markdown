---
layout: post
title: "Multiplication and DNA: Perl Weekly Challenge #90"
author: "Dave Jacoby"
date: "2020-12-07 22:47:53 -0500"
categories: ""
---

### TASK #1 › DNA Sequence

> Submitted by: Mohammad S Anwar
>
> DNA is a long, chainlike molecule which has two strands twisted into a double helix. The two strands are made up of simpler molecules called nucleotides. Each nucleotide is composed of one of the four nitrogen-containing nucleobases cytosine (C), guanine (G), adenine (A) and thymine (T).
>
> You are given DNA sequence, `GTAAACCCCTTTTCATTTAGACAGATCGACTCCTTATCCATTCTCAGAGATGTGTTGCTGGTCGCCG`.
>
> Write a script to print nucleiobase count in the given DNA sequence. Also print the complementary sequence where Thymine (T) on one strand is always facing an adenine (A) and vice versa; guanine (G) is always facing a cytosine (C) and vice versa.
>
> To get the complementary sequence use the following mapping:
>
> **T** => **A**  
> **A** => **T**  
> **G** => **C**  
> **C** => **G**

That last bit makes you think _hash table_, doesn't it?

Two things make this _very_ easy. The first is **transform**, spelled `tr///`, which is a very forgotten part of Perl, I think. I mean, I have gone a decade between uses, I'm \_quite_sure, but here, it's the simplest possible way to go. `tr/CG/GC/` finds every `C` and makes it a `G` and vice versa. If we wanted to add lowercaseto it, `tr/CGcg/GCgc/` would do it.

The second is how you can pipeline Perl. If we're counting letters, it's easier to do that if we `split` things into an array. For any of the four letters, we can cut out the others with `grep`. So, we're getting an array of letters — `A, A, A, A, A` — and we want the count of characters, not the characters themselves, which means `scalar` does that work.

I could wrap it all in a `map`, but it's more understandable to me, and I believe most learning programmers, to use a `for` loop.

#### The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

my $sequence =  'GTAAACCCCTTTTCATTTAGACAGATCGACTCCTTATCCATTCTCAGAGATGTGTTGCTGGTCGCCG' ;
my $complement = $sequence;
$complement =~ tr/TACG/ATGC/;

say <<"END";
    Sequence:   $sequence
    Complement: $complement
END

for my $i ( qw( A T C G ) ) {
    my $n = scalar grep {/$i/} split // , $sequence;
    say qq(    $i: $n );
}
```

```
    Sequence:   GTAAACCCCTTTTCATTTAGACAGATCGACTCCTTATCCATTCTCAGAGATGTGTTGCTGGTCGCCG
    Complement: CATTTGGGGAAAAGTAAATCTGTCTAGCTGAGGAATAGGTAAGAGTCTCTACACAACGACCAGCGGC

    A: 14
    T: 22
    C: 18
    G: 13
```

### TASK #2 › Ethiopian Multiplication

#### The Code

> Submitted by: Mohammad S Anwar
> You are given two positive numbers $A and $B.
>
> Write a script to demonstrate [**Ethiopian Multiplication**](https://threesixty360.wordpress.com/2009/06/09/ethiopian-multiplication/) using the given numbers.

I don't _fully_ get Ethiopian Multiplication, but for a thumbnail view, we'll take **4 * 5**:

> **4 * 5** becomes **2 * 10**  
> **2 * 10** becomes **1 * 20**  
> **1 * 20** gets *banked* because **1** is odd  
> **4 * 5** is **20**, so it checks out  

I used a `do { ... } while ( ... )` to ensure that things get handled at least once. I used `looks_like_number` from [Scalar::Util](https://metacpan.org/pod/Scalar::Util) mostly to make sure what I pull from ARGV is what I want.

#### The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use Scalar::Util qw{looks_like_number};

# I should have put int in here as well, but this is as I PRd it.
# Oh well.
my ( $m, $n ) = map { abs int $_ } grep { looks_like_number $_ } @ARGV;

$m //= 17;
$n //= 38;

say <<"END";

    m $m
    n $n
END

say egyptian( $m, $n );
say $m * $n;

exit;

sub egyptian ( $m, $n ) {
    my $o = 0;
    my $i = 1;
    do {
        my $e = $m % 2 != 0 ? 1 : 0;
        say join "\t", $o, $e, $i, $m, $n;
        $o += $n if $e;
        $i *= 2;
        $m = int $m / 2;
        $n = $n * 2;
    } while ( $m > 0 );
    return $o;
}
```

The first column is the current result, the second is whether `m` is even or odd, determining if `n` will be added to the current result. Third column is `i`, which starts as **1** but doubles each time. The explanations of Ethiopian Multiplication on the first page of the Google search all use that, but I don't think it's remotely helpful, but oh well. And the last two columns are the current values of `m` and `n`.

The last two lines are the output value of `ethiopian()` and the normal multiplication output, to literally check my math.

```
jacoby@Bishop:~/win/90$ ./ch-2.pl 

    m 17
    n 38

0       1       1       17      38
38      0       2       8       76
38      0       4       4       152
38      0       8       2       304
38      1       16      1       608
646
646
jacoby@Bishop:~/win/90$ ./ch-2.pl 4 5

    m 4
    n 5

0       0       1       4       5
0       0       2       2       10
0       1       4       1       20
20
20
jacoby@Bishop:~/win/90$ ./ch-2.pl 5 4

    m 5
    n 4

0       1       1       5       4
4       0       2       2       8
4       1       4       1       16
20
20
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
