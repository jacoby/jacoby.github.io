---
layout: post
title: "Perl Challenge 117 Redux: Permutations!"
author: "Dave Jacoby"
date: "2021-06-15 16:24:22 -0400"
categories: ""
---

[I have "solved" Challenge 117 Task 2 previously](https://jacoby.github.io/2021/06/14/trees-and-rows-perl-weekly-challenge-117.html), but I have another take.

OK, given `N=3`, you get this string as the shortest path:

```text
RRR
```

which looks like

```text
    \
     \
      \
```

You can replace any `R` with an `L` and an `H`, and they can occur in any position and any order, except you cannot start with an `H` and you cannot end with an `L`.

```text
    RRR     LHRR    LRHR    LRRH    RLRH    RRLH
    \       /_      /       /       \       \
     \        \     \_      \       /        \
      \        \      \      \_     \_       /_
```

So, given this, it is no longer a graph problem, requiring a `Node` implementation.

It is simply a string problem requiring splitting, filtering and [Algorith::Permute](https://metacpan.org/pod/Algorithm::Permute). There _is_ a problem. Let's replace the letters in `RRR` with their locations -> `123`. We know that this permutes to:

```text
    123    132    213
    231    312    321
```

But that's still:

```text
    RRR    RRR    RRR
    RRR    RRR    RRR
```

Therefore, there must be filtering, simply `next if $hash{$x}++`, and here, instead of returning a list, I'm dumping to `STDOUT`, and I'm seeing a lag around here:

```text
...
8476    RHHLRHLLRRRRR
8477    RHHLHRRRRRLLR
8478    RHHLHRRRRLRLR
8479    RHHLHRRRRLLRR
8480    RHHLHRRRLRRLR
8481    RHHLHRRRLRLRR
8482    RHHLHRRRLLRRR
8483    RHHLHRRLRRRLR
8484    RHHLHRRLRRLRR
8485    RHHLHRRLRLRRR
8486    RHHLHRRLLRRRR
8487    RHHLHRLRRRRLR
8488    RHHLHRLRRRLRR
8489    RHHLHRLRRLRRR
8490    RHHLHRLRLRRRR
8491    RHHLHRLLRRRRR
8492    RHHLHLRRRRRLR
8493    RHHLHLRRRRLRR
8494    RHHLHLRRRLRRR
...
```

Because there's less memory clog because I'm not making a triangle full of objects and not storing them, I'm thinking that there's an advantage to doing a Permute solution. _But_, while the graph solution hits every option, it only does so once. Making an independent permute solution might be harder to read and write than the mercenary CPAN solution, but you can add in [Memoize](https://metacpan.org/pod/Memoize) such that you can ensure no long responses.

I'm finishing this blog response as I'm running time tests on my laptop to see which is "better", so I won't have the answer until later.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

use Carp;
use Getopt::Long;
use List::Util qw{ uniq };
use Algorithm::Permute;

my $n = 2;
GetOptions( 'number=i' => \$n );
croak 'Too Small' if $n < 0;

my @solutions = solve_triangle($n);
# say join ' ', ( scalar @solutions ), @solutions, ( scalar @solutions );

sub solve_triangle ( $n ) {
    my @output;
    my $string = 'R' x $n;
    push @output, $string;
    my %hash;
    my $c = 1;
    while ( $string =~ /R/ ) {
        $string =~ s/R/LH/;
        my @list = split //, $string;
        my $p    = Algorithm::Permute->new( \@list );
        while ( my @res = $p->next ) {
            my $x = join '', @res;
            next if $x =~ m{^H|L$};
            # push @output, $x;
            next if $hash{$x}++;
            say join "\t", $c, $x ;
            $c++;
        }
    }
    return sort { length $b <=> length $a } uniq @output;
}
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
