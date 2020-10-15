---
layout: post
title: "Perl Challenge #82"
author: "Dave Jacoby"
date: "2020-10-14 19:08:15 -0400"
categories: ""
---

### TASK #1 › Common Factors

> Submitted by: Niels van Dijke  
> You are given 2 positive numbers $M and $N.
>
> Write a script to list all common factors of the given numbers.

I'm asserting that `$M` will be lower than `$N`, and all possible numbers will be between `1` and `$M`, which means all possible answers are in the range `1 .. $M`. I (again) use [List::Util](https://metacpan.org/pod/List::Util)'s `min` and `max` to easily determining which is which, and use modulo (`%`) to figure out if a number is a factor.

#### The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use List::Util qw{ min max };

push @ARGV, 12, 18 unless scalar @ARGV;

common_factors( min(@ARGV), max(@ARGV));

sub common_factors( $min , $max ) {
    my @factors ;
    say qq{MIN: $min};
    say qq{MAX: $max};

    for my $i ( 1 .. $min ) {
        push @factors, $i if 
            $min % $i == 0 && 
            $max % $i == 0;
    }
    say join ',', @factors;
}
```

```bash
$ ./ch-1.pl 1200 1800
MIN: 1200
MAX: 1800
1,2,3,4,5,6,8,10,12,15,20,24,25,30,40,50,60,75,100,120,150,200,300,600
```

### TASK #2 › Interleave String

> Submitted by: Mohammad S Anwar  
> You are given 3 strings: \$A, \$B and \$C.
>
> Write a script to check if $C is created by interleave \$A and \$B.
>
> Print 1 if check is success otherwise 0.

Here I hedge a bet: If the strings to interleave are `PERL` and `code`, I could see it ending up as both `cPoEdReL` and `PcEoRdLe`, without much within the question explaining which would be more likely, so I test for both.

A feature I use is that you can use the substring as both an rvalue — `my $var = substr( 'ABC123', 0, 1 )` — and an lvalue — `substr( 'ABC123', 1, 1 ) = $var` — so instead of converting the strings to arrays and popping values, I can keep them as strings and remove characters as necessary.

I keep two check variables, `$afirst` and `$bfirst`, and test both against `$C` to see if we have a match.

(Because `$a` and `$b` are part of Perl's `sort`, I avoid using `$a` and `$b` specifically, and because of trying to understand code later, I try to avoid one-letter variable names in general.)

#### The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

my ( $aa, $bb, $cc ) = @ARGV;

$aa //= "XY";
$bb //= "X";
$cc //= "XXY";

say check_interleave( $aa, $bb, $cc );

sub check_interleave ( $aa, $bb, $cc ) {
    my $afirst;
    my $bfirst;

    while ( $aa ne "" || $bb ne "" ) {
        my $la = substr $aa, 0, 1;
        my $lb = substr $bb, 0, 1;
        $afirst .= $la . $lb;
        $bfirst .= $lb . $la;
        substr( $aa, 0, 1 ) = '';
        substr( $bb, 0, 1 ) = '';
    }
    return 1 if $cc eq $afirst;
    return 1 if $cc eq $bfirst;
    return 0;
}
```

```powershell
PS C:\Users\jacob\82> .\ch-2.pl 'perl' 'CODE' 'pCeOrDlE'
1
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
