---
layout: post
title:  "Two One-Liners and Short Programs: Weekly Challenge #230"
author: "Dave Jacoby"
date:   "2023-08-14 11:29:25 -0400"
categories: ""
---

We are at [Weekly Challenge #230](https://theweeklychallenge.org/blog/perl-weekly-challenge-230/), and my children would like to remind you that this is a great time to schedule a dentist appointment. ("Tooth hurty")

### Task 1: Separate Digits

> Submitted by: Mohammad S Anwar  
> You are given an array of positive integers.  
>
> Write a script to separate the given array into single digits.  

#### Let's Talk About It

Today's challenges seem to be very easily handled with one-liner functional solutions. In this case, we split each number into digits and retain order, so `map` and `split` does it. `@output = map { split $_, // } @input`. This is not a *true* Perl one-liner, but the functional programming tools provides allows for an expression rather than a subroutine.

Here it is as a one-liner:

```perl
perl -E 'say join q{, }, map {split //} @ARGV' 1 34 5 6
1, 3, 4, 5, 6
```

(It could be done better, I'm sure. I don't like going to one-liners as a general rule.)

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw( sum0 );

my @examples = (

[1, 34, 5, 6],
[1, 24, 51, 60],
);

for my $e (@examples) {
    my @input  = $e->@*;
    my $input = join ', ', @input;
    my @output = map { split //, $_ } @input;
    my $output = join ', ', @output;
    say <<~"END";
    Input:  \@ints = ($input)
    Output: ($output)
    END
}
```

```text
$ ./ch-1.pl 
Input:  @ints = (1, 34, 5, 6)
Output: (1, 3, 4, 5, 6)

Input:  @ints = (1, 24, 51, 60)
Output: (1, 2, 4, 5, 1, 6, 0)
```

### Task 2: Count Words

> Submitted by: Mohammad S Anwar
> You are given an array of words made up of alphabetic characters and a prefix.
>
> Write a script to return the count of words that starts with the given prefix.

#### Let's Talk About It

Here I separate out the work into a subroutine, but that subroutine has two lines, so I could've easily done the same as before and done the work inside the loop, with `scalar` and `grep` rather than `map` and `split`.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw( uniq );

my @examples = (

    {
        words  => [ "pay", "attention", "practice", "attend" ],
        prefix => "at"
    },
    {
        words  => [ "janet", "julia", "java", "javascript" ],
        prefix => "ja"
    },
);

for my $e (@examples) {
    my $prefix = $e->{prefix};
    my @input  = $e->{words}->@*;
    my $input = join ', ', map {qq{"$_"}} @input;
    my $output = count_words($e);
    say <<~"END";
    Input:  \@words = ($input)
            \$prefix = "$prefix"
    Output: $output
    END
}

sub count_words ($ref) {
    my $prefix = $ref->{prefix};
    return scalar grep { $_ =~ /^$prefix/ } $ref->{words}->@*;
}
```

```text
$ ./ch-2.pl 
Input:  @words = ("pay", "attention", "practice", "attend")
        $prefix = "at"
Output: 2

Input:  @words = ("janet", "julia", "java", "javascript")
        $prefix = "ja"
Output: 3
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
