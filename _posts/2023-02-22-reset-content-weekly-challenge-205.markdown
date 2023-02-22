---
layout: post
title: "Reset Content: Weekly Challenge #205"
author: "Dave Jacoby"
date: "2023-02-22 09:39:58 -0500"
categories: ""
---

Welcome to [Weekly Challenge #205!](https://theweeklychallenge.org/blog/perl-weekly-challenge-205/)

**205** isn't on [http.cat](https://http.cat/), but it is an HTTP code, meaning ["Reset Content"](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/205), meaning to clear the document or reset the UI.

### Task 2: Maximum XOR

> Submitted by: Mohammad S Anwar  
> You are given an array of integers.
>
> Write a script to find the highest value obtained by XORing any two distinct members of the array.

#### Talk About The Problem!

I reversed the order of these because I think there's something to actually teach about this one, because we'll go back to [Boole](https://en.wikipedia.org/wiki/George_Boole). So much comes from him, Bayes and Babbage that I think hitting the index of _the Big Book of British Mathematics_ and reading about every name under _B_ would help me find the next big thing in computing.

When I was going for my CS degree, I took PHIL 101, Intro to Logic, and I learned a lot of formal logic that helped a lot with CS, and also the EE circuit design course I took as a lab science. To start, we should show the format with **And (&and;)** and **Or (&or;)**.

| X   | Y   | X &and; Y | X &or; Y |
| --- | --- | --------- | -------- |
| 0   | 0   | 0         | 0        |
| 0   | 1   | 0         | 1        |
| 1   | 0   | 0         | 1        |
| 1   | 1   | 1         | 1        |

There, in table form, we see that **X &and; Y** is only true when **X** is true _and_ **Y** is true, and **X &or; Y** is true when **X** is true _or_ **Y** is true, or both. So we know that and means and and or means or. So, what's XOR? That's exclusive OR.

| X   | Y   | X &oplus; Y |
| --- | --- | ----------- |
| 0   | 0   | 0           |
| 0   | 1   | 1           |
| 1   | 0   | 1           |
| 1   | 1   | 0           |

**X &oplus; Y** is true when **X** is true or **Y** is true, but not when both are true.

So, we've seen bits, but what about bytes? How does XOR work when we're looking at numbers? We compare the numbers at each position.

| Decimal | Binary   |
| ------- | -------- |
| 10      | 00001010 |
| 5       | 00000101 |
| 15      | 00001111 |

This is the case from the example where **5 &oplus; 10** equals **15**, because the bits don't overlap. With **8 &oplus; 16**, we get far different results.

| Decimal | Binary   |
| ------- | -------- |
| 7       | 00000111 |
| 15      | 00001111 |
| 8       | 00001000 |

Here, we see that a lot of the bits cancel out and we get 8. Isn't logic fun?

(This might be better if this was in a language like Kotlin, where  `fun` is the keyword to indicate a function/subroutine.)

Anyway, remembering the syntax for XOR in Perl was the hardest part for me. Otherwise, comparing one element in an index with everything else is a case of nested arrays, which seems to come up every time I solve a task iteratively.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ max };

my @examples = (

    [ 1,  2, 3, 4, 5, 6, 7 ],
    [ 2,  4, 1, 3 ],
    [ 10, 5, 7, 12, 8 ],
);

for my $e (@examples) {
    my $o     = max_xor( $e->@* );
    my $array = $e->@*;
    say <<"END";
    Input:  \@array = $array
    Output: $o
END
}

sub max_xor ( @array ) {
    my @output;
    for my $i ( 0 .. -2 + scalar @array ) {
        my $ii = $array[$i];
        for my $j ( $i + 1 .. -1 + scalar @array ) {
            my $jj = $array[$j];
            my $x =  $ii ^ $jj;
            push @output, $x;
        }
    }
    return max @output;
}
```

```text
$ ./ch-2.pl 
    Input:  @array = 7
    Output: 7

    Input:  @array = 4
    Output: 7

    Input:  @array = 5
    Output: 15
```

### Task 1: Third Highest

> Submitted by: Mohammad S Anwar  
> You are given an array of integers.
>
> Write a script to find out the Third Highest if found otherwise return the maximum.

#### Talk About The Problem!

Find the third highest value. Examples show we skip multiples. If less than three values, return the max. That's easy.

First, we sort high-to-low and remove duplicates. `uniq sort { $b <=> $a }` gives us that, and then, it's as easy as `return defined $output[2] ? $output[2] : $output`. OK, I use `max` from [List::Util](https://metacpan.org/pod/List::Util) because I wasn't careful and I already brought in `uniq`, but it could be as easy as that ternary after the sort.

Some might say that my two returns might be easier to read than a ternary. Mileage varies. If this wasn't toy code, I would want to handle the empty array case as well.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ uniq max };

my @examples = (

    [ 5, 3, 4 ],
    [ 5, 6 ],
    [ 5, 4, 4, 3 ],
);

for my $e (@examples) {
    my $list = join ',', $e->@*;
    my $out  = third_highest( $e->@* );
    say <<"END";
    Input:  \@array = ($list)
    Output: $out
END
}

sub third_highest ( @array ) {
    @array = uniq sort { $b <=> $a } @array;
    return max @array if scalar @array < 3;
    return $array[2];
}
```

```text
$ ./ch-1.pl 
    Input:  @array = (5,3,4)
    Output: 3

    Input:  @array = (5,6)
    Output: 6

    Input:  @array = (5,4,4,3)
    Output: 3
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon/the Fediverse](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
