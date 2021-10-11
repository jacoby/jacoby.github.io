---
layout: post
title: "There Are Wrong Ways To Skin A Cat: The Weekly Challenge #134"
author: "Dave Jacoby"
date: "2021-10-11 17:28:13 -0400"
categories: ""
---

### TASK #1 › Pandigital Numbers

> Submitted by: Mohammad S Anwar  
> Write a script to generate first 5 `Pandigital Numbers` in base 10.
>
> As per the [wikipedia](https://en.wikipedia.org/wiki/Pandigital_number), it says:
>
> > A pandigital number is an integer that in a given base has among its significant digits each digit used in the base at least once.

Looking at this, I'm thinking of the Motto of Perl:

> **There's More Than One Way To Do It**

So, the numbers we're looking for:

- contain all ten digits in base-10: `0, 1, 2, 3, 4, 5, 6, 7, 8, 9`
- are the smallest of them, so it ...
- starts with 1, followeed by 0, and
- has no repeats

There's one way to do it: start at **1,000,000,000** and start counting up.

```perl
sub pandigital_3 {
    my @output;
    my $i = 1023456789;
    while ( scalar @output < 5 ) {
        push @output, $i if is_pandigital($i);
        $i++;
    }
    return @output[0..4];
}

sub is_pandigital ( $n ) {
    for my $i ( 0 .. 9 ) {
        return 0 unless $n =~ /$i/
    }
    return 1;
}
```

The fifth minus the first (**spoiler warning**) is only 189, so if we _start_ at the lowest number, the count isn't bad, but then we're not **generating** them, and that's a number that's over a trillion. This is not ideal. Don't do it this way.

Another way to go is to ask MetaCPAN for help, and one way I often go is with [Algorithm::Permute](https://metacpan.org/pod/Algorithm::Permute). I _like_ Algorithm::Permute, and it _works_, but the problem with that is that it doesn't come out ordered, so we find _all_ permutations, sort them and pull out the first five. Not my favorite, either, but if I was _really_ optimizing for developer time, I might go with it.

But the way I **really like?** What do you think?

> **[THIS Looks Like A Job For _RECURSION_!](https://www.google.com/search?q=this+looks+like+a+job+for+recursion)**

We _know_ we start with `1` and want the smallest numbers, so we can build it up, going with lowest of available choices, and if we push to a global variable, we can know to give up after five.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say state postderef signatures };
no warnings qw{ experimental };

use Algorithm::Permute;

my @x = pandigital_1();
my @y = pandigital_2();
my @z = pandigital_3();

my @headers = qw{I PANDIGITAL1 PANDIGITAL2 PANDIGITAL3};
say join "\t", @headers;
say join "\t", map {s/./-/gmix;$_} @headers;
for my $i ( 0 .. 4 ) {
    say join "\t", $i, $x[$i], $y[$i], $z[$i];
}


sub pandigital_1 {
    my @output;
    my @nums = ( 0, 2 .. 9 );
    my $p    = Algorithm::Permute->new( \@nums );
    while ( my @res = $p->next ) {
        my $n = join '', 1, @res;
        push @output, $n;
    }
    @output = sort { $a <=> $b } @output;
    return @output[ 0 .. 4 ];
}

sub pandigital_2 {
    my $output = [];
    my $state  = [1];
    _pandigital_2( $output, $state );
    my @output = $output->@*;
    return @output[ 0 .. 4 ];
}

sub _pandigital_2 ( $output, $state ) {
    my %state  = map  { $_ => 1 } $state->@*;
    my @digits = grep { !$state{$_} } 0 .. 9;
    if ( scalar $output->@* > 5 ) { return }
    if ( scalar $state->@* == 10 ) {
        my $pandigit = join '', $state->@*;
        push $output->@*, $pandigit;
        return;
    }
    for my $i (@digits) {
        my $newstate->@* = $state->@*;
        push $newstate->@*, $i;
        _pandigital_2( $output, $newstate );
    }
    return;
}

sub pandigital_3 {
    my @output;
    my $i = 1023456789;
    while ( scalar @output < 5 ) {
        push @output, $i if is_pandigital($i);
        $i++;
    }
    return @output[ 0 .. 4 ];
}

sub is_pandigital ( $n ) {
    for my $i ( 0 .. 9 ) {
        return 0 unless $n =~ /$i/;
    }
    return 1;
}
```

```text
I       PANDIGITAL1     PANDIGITAL2     PANDIGITAL3
-       -----------     -----------     -----------
0       1023456789      1023456789      1023456789
1       1023456798      1023456798      1023456798
2       1023456879      1023456879      1023456879
3       1023456897      1023456897      1023456897
4       1023456978      1023456978      1023456978
```

### TASK #2 › Distinct Terms Count

> Submitted by: Mohammad S Anwar  
> You are given 2 positive numbers, $m and $n.
>
> Write a script to generate multiplcation table and display count of distinct terms.

So, let's think this through.

- Create the matrix
- Flatten the matrix and find unique values
- Count those unique values
- Pretty-print it

There's nothing too hard here.

- Create the matrix: `for my $i ( 1..$x ) { for my $j ( 1 .. $y) { $m[$i-1][$j-1] = $i * $j } }`
- Flatten the matrix: `@f = map {$_->@*} $m->@*`
- Count the unique values: `@f = uniq sort {$a<=>$b} flatten($matrix); $c = scalar @f`

And, because we're not putting this to the web where the browser will do centering, I use `sprintf` a lot.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures };
no warnings qw{ experimental };

use Carp;
use Getopt::Long;
use List::Util qw{ uniq };

my $x = 3;
my $y = $x;

GetOptions(
    'x=i' => \$x,
    'y=i' => \$y,
);

croak 'X not positive' unless $x > 0;
croak 'Y not positive' unless $x > 0;
croak 'X not integer'  unless $x == int $x;
croak 'Y not integer'  unless $y == int $y;

make_table( $x, $y );

sub make_table ( $x, $y ) {
    my @headers = make_line( 'x', '|', 1 .. $y );
    my $headers = join ' ', @headers;
    my $line    = $headers;
    $line =~ s/\|/+/gmix;
    $line =~ s/[\w\s]/-/gmix;

    say qq{\$x = $x , \$y = $y };
    say '';
    say $headers;
    say $line;
    my $matrix = make_matrix( $x, $y );
    my @dt = uniq sort {$a<=>$b} flatten_matrix($matrix);
    my $dt = join ', ', @dt;
    my $count = scalar @dt;

    my $c = 0;
    for my $i ( $matrix->@* ) {
        $c++;
        my $line = make_line( $c, '|', $i->@* );
        say $line;
    }
    say '';
    say qq{Distinct Terms: $dt};
    say qq{Count: $count};
}

sub make_line ( @array ) {
    my @headers = ( map { sprintf '%3s', $_ } @array );
    return join ' ', @headers;
}

sub make_matrix ( $x, $y ) {
    my $matrix;
    for my $i ( 0 .. $x - 1 ) {
        my $ii = $i + 1;
        for my $j ( 0 .. $y - 1 ) {
            my $jj = $j + 1;
            my $tt = $ii * $jj;
            $matrix->[$i][$j] = $tt;
        }
    }
    return $matrix;
}

sub flatten_matrix ( $matrix ) {
    return map { $_->@* } $matrix->@*;
}
```

```text
 time ./ch-2.pl -x 10 -y 10
$x = 10 , $y = 10 

  x   |   1   2   3   4   5   6   7   8   9  10
------+----------------------------------------
  1   |   1   2   3   4   5   6   7   8   9  10
  2   |   2   4   6   8  10  12  14  16  18  20
  3   |   3   6   9  12  15  18  21  24  27  30
  4   |   4   8  12  16  20  24  28  32  36  40
  5   |   5  10  15  20  25  30  35  40  45  50
  6   |   6  12  18  24  30  36  42  48  54  60
  7   |   7  14  21  28  35  42  49  56  63  70
  8   |   8  16  24  32  40  48  56  64  72  80
  9   |   9  18  27  36  45  54  63  72  81  90
 10   |  10  20  30  40  50  60  70  80  90 100

Distinct Terms: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 24, 25, 27, 28, 30, 32, 35, 36, 40, 42, 45, 48, 49, 50, 54, 56, 60, 63, 64, 70, 72, 80, 81, 90, 100
Count: 42

real    0m0.091s
user    0m0.000s
sys     0m0.047s
```

### Personal Note

I'm thinking back to elementary school, where we had **timed times table test**. I never thought this was a smart thing: I can _figure out_ that 7 \* 8 is 56, so I don't need to drill it into my head. Some of the other things I drilled, well... I mean, I could never math out the pronunciation of **Ua Mau ke Ea o ka ʻĀina i ka Pono**, but the only time as an adult where that came to the fore is watching a parent in _The Rugrats_ mispronounce it and explaining the error to my Rugrats-aged children who did not care.

Anyway, knowing I can write something that'll generate that times table in a 100th of a second _so_ justifies my eight-year-old's distaste for such busywork.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)

```

```
