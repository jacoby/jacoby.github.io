---
layout: post
title: "See Other: Weekly Challenge #303"
author: "Dave Jacoby"
date: "2025-01-11 16:00:49 -0500"
categories: ""
---

Welcome To [_**Weekly Challenge #303!**_](https://theweeklychallenge.org/blog/perl-weekly-challenge-303/) Because it's been over a year, I forgot about the HTTP status codes, and the opportunities for blog names based on them.

![https://http.cat/images/303](https://http.cat/images/303.jpg)

See also:

- [300 - Multiple Choices](https://http.cat/images/300)
- [301 - Moved Permanently](https://http.cat/images/301)
- [302 - Found](https://http.cat/images/302)

**303** is also a compound number (**101** \* **3**) and the Area Code for Denver, Colorado, and the surrounding area. Interestingly, **301** is the area code for western Maryland, including the areas around the District of Columbia. If you were to [go back to Rockville and waste another year](https://genius.com/Rem-dont-go-back-to-rockville-lyrics), you'd be _301-ing_ to _301_.

Due to a time crunch, I didn't do these in Python. Maybe next time.

### Task 1: 3-digits Even

> Submitted by: Mohammad Sajid Anwar  
> You are given a list (3 or more) of positive integers, @ints.
>
> Write a script to return all even 3-digits integers that can be formed using the integers in the given list.

#### Let's Talk About It

This is another problem where Algorithm::Permute becomes useful, but you have to watch the output, because `[3, 3, 3]` gives you three permutations: `[3, 3, 3]`, `[3, 3, 3]` and `[3, 3, 3]`.

Perl makes conversion from string to integer easy, and I use `0 + $string` to turn numbers like `011` to `11`. I avoid duplications with `next` and a hashref, and determine evenness with modulus.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use Algorithm::Permute;

my @examples = (

    [ 2, 1, 3, 0 ],
    [ 2, 2, 8, 8, 2 ],
);

for my $example (@examples) {
    my @output = even_3_digits( $example->@* );
    my $output = join ', ', @output;
    my $input  = join ', ', $example->@*;
    say <<"END";
    Input:  \@ints = ($input)
    Output: ($output)
END
}

sub even_3_digits(@array) {
    my @output;
    my $done;
    my $p = Algorithm::Permute->new( \@array, 3 );
    while ( my @p = $p->next() ) {
        my $int = 0 + ( join '', @p );
        next if $int < 100;
        next if $int % 2 != 0;
        next if $done->{$int}++;
        push @output, $int;
    }
    @output = sort @output;
    return @output;
}

```

```text
$ ./ch-1.pl
    Input:  @ints = (2, 1, 3, 0)
    Output: (102, 120, 130, 132, 210, 230, 302, 310, 312, 320)

    Input:  @ints = (2, 2, 8, 8, 2)
    Output: (222, 228, 282, 288, 822, 828, 882)
```

#### Task 2: Delete and Earn

> Submitted by: Mohammad Sajid Anwar  
> You are given an array of integers, `@ints`.
>
> Write a script to return the maximum number of points you can earn by applying the following operation some number of times.
>
> > Pick any `ints[i]` and delete it to earn `ints[i]` points.  
> > Afterwards, you must delete every element equal to `ints[i] - 1` and every element equal to `ints[i] + 1`.

#### Let's Talk About It

Ahem.

...

_THIS looks like a job for ... **RECURSION!**_

For my solution, I choose one of the unique values of the array. For the example of `[2, 2, 3, 3, 3, 4]`, I go with `[2, 3, 4]` because any one of the **3**s will give the same result.

The work of removing all the **2**s and **4**s from the array, and the first **3** in the array takes place first, as well adding the chosen **3** to the point tally, occurs before testing for end conditions, and then we go with the unique remaining values and go again.

I go to List::Util again. `first { $array[$_] == $n } 0 .. -1 + scalar @array` gives us the index of the value we need to remove from the array. `uniq sort @array` gives us every individual value without repeats. `max @output` removes everything but the maximum number of points at each recursion, which is what we seek.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use List::Util qw{ first max uniq };
use Carp;

my @examples = (

    [ 3, 4, 2 ],
    [ 2, 2, 3, 3, 3, 4 ],
    [qw{ 1 1 1 2 2 2 3 3 3 4 4 4 5 5 }],
);

for my $example (@examples) {
    my $ints   = join ', ', $example->@*;
    my $output = delete_and_earn( $example->@* );
    say <<"END";
    Input:  \@ints = ($ints)
    Output: $output
END
}

sub delete_and_earn (@array) {
    my @output;
    for my $i ( uniq sort @array ) {
        push @output, _delete_and_earn( $i, 0, @array );
    }
    return max @output;
}

sub _delete_and_earn ( $n, $v, @array ) {
    my @output;
    $v += $n;
    @array = grep { $_ != $n - 1 } @array;
    @array = grep { $_ != $n + 1 } @array;
    my $i = first { $array[$_] == $n } 0 .. -1 + scalar @array;
    $array[$i] = undef;
    @array = grep { defined } @array;
    if ( !scalar @array ) {
        return $v;
    }
    for my $nn ( uniq sort @array ) {
        push @output, _delete_and_earn( $nn, $v, @array );
    }
    return max @output;
}
```

```text
$ ./ch-2.pl
    Input:  @ints = (3, 4, 2)
    Output: 6

    Input:  @ints = (2, 2, 3, 3, 3, 4)
    Output: 9

    Input:  @ints = (1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5)
    Output: 22
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
