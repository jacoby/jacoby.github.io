---
layout: post
title: "Perl Weekly Challenge #72"
author: "Dave Jacoby"
date: "2020-08-03 14:17:45 -0400"
categories: ""
---

[](https://perlweeklychallenge.org/blog/perl-weekly-challenge-072/)

### TASK #1 › Trailing Zeroes

> Submitted by: Mohammad S Anwar
>
> You are given a positive integer \$N (<= 10).
>
> Write a script to print number of trailing zeroes in \$N!.

There are two basic issues here:

- [Factorial](https://jacoby.github.io/math/2018/02/19/solving-a-math-meme.html)
- Character counting

For those without the math background, **factorial** means _multiply every digit from 1 to n together_. For _5!_, for example, it's _1 * 2 * 3 * 4 * 5 = 120_. This can be done many ways. I chose _reduce_.

Reduce is commonly paired with _map_, which allows you to modify and expand an array, but reduce allows you to get one value for the array. We can say _sum_ with `reduce { $a + $b }`. _min_ would be `reduce { $a < $b ? $a : $b }`, and thus _max_ would be `reduce { $a > $b ? $a : $b }`.

But, what we need here is _factorial_.

`reduce { $a * $b } 1 .. $n`.

Next is counting the number of trailing zeroes.

This looks like a job for **Regular Expressions!**

So, match a trailing zero. `$f =~ /0$/`

Match one or more trailing zeroes. `$f =~ /0+$/`

Let's store that. `my ($z) = $f =~ /(0+)$/`

So, n = `7`, f = n! = `5040`, and z would be `0`. `length $z` would be `1`. There we have it.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use Carp;
use Getopt::Long;
use List::Util qw{ reduce };

my $n = 4;
GetOptions( 'n=i' => \$n, );
croak 'n must be positive' if $n < 1;
croak 'n must be less than 11' if $n > 10;

my $f = factorial($n);
my $t = trailing($f);

my $zero = 'zero';
$zero = 'zeroes' if $t > 1;

say qq{Output: $n as N! = $f has $t trailing $zero};

sub trailing( $f ) {
    my ($z) = $f =~ /(0+)$/mix;
    return length $z || 0;
}

sub factorial ( $n ) {
    return reduce { $a * $b } 1 .. $n;
}
```

### TASK #2 › Lines Range

> Submitted by: Mohammad S Anwar
>
> You are given a text file name $file and range $A - $B where $A <= \$B.
>
> Write a script to display lines range $A and $B in the given file.

I don't think I've shown File IO in a while, if ever.

If we added `use English`, we could use the name of the current program as `$PROGRAM_NAME`, but since I'm not doing anything else with that, I'll just use `my $f = $0`.

I use [Carp](https://metacpan.org/pod/Carp) and `croak` to handle bad input, including the file test `-f` to ensure that the file we have exists, as well as ensure that the range min and max make sense.

And now, we open the file so we can check the lines. I normally do a file check when I open the file — `if ( -f $file && open my $fh, '<', $file ) { ... }` — but the file check occurs earlier, so that isn't necessary. Then there's simply numbering each line and printing the line when the number is right. Easy peasy.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use Carp;
use Getopt::Long;

my $f = $0; # this program
my $a = 1;
my $b = 4;
GetOptions(
    'f=s' => \$f,
    'a=i' => \$a,
    'b=i' => \$b,
);

show_lines( $a, $b, $f );

sub show_lines ( $a, $b, $f ) {
    my $c = 0;
    if ( open my $fh, '<', $f ) {
        my @array = <$fh>;
        for my $i (@array) {
            $c++;
            next if $c > $b;
            next if $c < $a;
            print $i ;
        }
    }
}
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
