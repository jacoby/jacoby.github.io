---
layout: post
title:  "Don't Be Sad: Weekly Challenge 29"
author: "Dave Jacoby"
date:   "2023-08-07 11:16:57 -0400"
categories: ""
---

Welcome to [Weekly Challenge #229!](https://theweeklychallenge.org/blog/perl-weekly-challenge-229/)

[**229**](https://en.wikipedia.org/wiki/229_(number)) is an [Area Code](https://en.wikipedia.org/wiki/List_of_North_American_Numbering_Plan_area_codes) in southern Georgia. I was surprised to see that, growing up when the area codes had *1* or *0* as the middle digit. With *227*, it is a [twin prime](https://en.wikipedia.org/wiki/Twin_prime).

### Task 1: Lexicographic Order
>
> Submitted by: Mohammad S Anwar  
> You are given an array of strings.  
>
> Write a script to delete element which is not lexicographically sorted (forwards or backwards) and return the count of deletions.  

#### Let's Talk About It

This is about the lexical (alphabetical) sort, and that's easy: `join '', sort split //, $str`.

To reverse it, `reverse` it: `join '', reverse sort split //, $str`.

We then do string comparisons to be sure it's the same. The belt-and-suspenders don't-trust-input move would be to force case (the hip kids are all using `fc`, meaning *fold case*, because that handles unicode) so that we wouldn't get a case like `Zabc`, but I'm happy with how it is.

Because the task says **"delete element"**, I create a second array and collect the passing values, and because it says **"return the count"**, I do just that. I *could* have just kept the count and not recreated the array, and if I was going strict with **delete**, I would have looped through the array indexes, which would allow me to `delete $array[$i]` instead.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw( sum0 );

my @examples = (

    [ "abc", "bce", "cae", ],
    [ "yxz", "cba", "mon", ],
);

for my $e (@examples) {
    my @array  = $e->@*;
    my $array  = join ', ', map { qq{"$_"} } @array;
    my $output = lex_order(@array);
    say <<~"END";
    Input:  \@int = ($array)
    Output: $output
    END
}

sub lex_order (@array) {
    my @output;
    for my $str (@array) {
        my $abc = join '', sort split //, $str;
        my $cba = join '', reverse sort split //, $str;
        next if $str eq $abc;
        next if $str eq $cba;
        push @output, $str;
    }
    my $output = scalar @output;
    return $output;
}
```

```text
$ ./ch-1.pl 
Input:  @int = ("abc", "bce", "cae")
Output: 1

Input:  @int = ("yxz", "cba", "mon")
Output: 2
```

### Task 2: Two out of Three
>
> Submitted by: Mohammad S Anwar
> You are given three array of integers.
>
> Write a script to return all the elements that are present in at least 2 out of 3 given arrays.

#### Let's Talk About It

For this one, the secret sauce is `uniq`, found in my favorite module on CPAN, [List::Util](https://metacpan.org/pod/List::Util). Consider the first array in the first example: `1, 1, 2, 4`. If we falsely assume each integer is included once, that array alone could count as two-out-of-three when it just appears in one.

Then, for every unique element in each sub-array, we go through and use a hash to count them. The value for each key at the end should be *1*, *2* or *3*, and we use `grep { $hash{$_} > 1} keys %hash` to find the keys whose values are in the correct range.

I also `sort` the output because I like things to be consistent, and hash key order is not.

**Note:** I love many modules on CPAN. List::Util is just particularly useful for the kind of problems we see in the Weekly Challenge, and so I mention it a lot. But yes, I *do* love List::Util.

Beyond that, I use `use postderef` because I like `$array->@*` over `@$array` and `$array[0]->@*` over ... however you'd specify the elements of a nested arrayref that's the first element of the outer array without *postderef*. I use `say` instead of `print` so I don't have to manually append newlines all over the place. I use `<<~"END"` for my heredocs so I can indent them with the block level of the surrounding code.

I also use `signatures` because I like how every other language uses them, and would prefer to not have to sort that stuff out in the first lines of my subroutine.

I *hardly* use `state`, but just enough that leaving it out of my boilerplate block isn't advisable.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw( uniq );

my @examples = (

    [ [ 1, 1, 2, 4 ],    [ 2, 4 ],          [4], ],
    [ [ 4, 1 ],          [ 2, 4 ],          [ 1, 2 ], ],
    [ [ 9, 0, 1, 2, 5 ], [ 9, 0, 2, 1, 0 ], [ 1, 9, 8, 4 ], ],
);

for my $e (@examples) {
    my @array  = $e->@*;
    my @output = two_out_of_three(@array);
    my $output = join ', ', @output;

    my $array1 = join ', ', $array[0]->@*;
    my $array2 = join ', ', $array[1]->@*;
    my $array3 = join ', ', $array[2]->@*;

    say <<~"END";
    Input:  \@array1 = ($array1)
            \@array2 = ($array2)
            \@array3 = ($array3)
    Output: ($output)
    END
}

sub two_out_of_three (@array) {
    my %hash;
    for my $s (@array) {
        my @sub = $s->@*;
        my @mid = uniq @sub;
        for my $int (@mid) {
            $hash{$int}++;
        }
    }
    return sort grep { $hash{$_} > 1 } keys %hash;
}
```

```text
$ ./ch-2.pl 
Input:  @array1 = (1, 1, 2, 4)
        @array2 = (2, 4)
        @array3 = (4)
Output: (2, 4)

Input:  @array1 = (4, 1)
        @array2 = (2, 4)
        @array3 = (1, 2)
Output: (1, 2, 4)

Input:  @array1 = (9, 0, 1, 2, 5)
        @array2 = (9, 0, 2, 1, 0)
        @array3 = (1, 9, 8, 4)
Output: (0, 1, 2, 9)
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
