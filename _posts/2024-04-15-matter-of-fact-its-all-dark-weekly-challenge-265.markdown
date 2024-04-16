---
layout: post
title: "Matter Of Fact, It's All Dark: Weekly Challenge #265"
author: "Dave Jacoby"
date: "2024-04-15 17:34:01 -0400"
categories: ""
---

And now I solve **[Perl Weekly Challenge #265!](https://theweeklychallenge.org/blog/perl-weekly-challenge-265/)!!**

### Task 1: 33% Appearance

> Submitted by: Mohammad Sajid Anwar  
> You are given an array of integers, `@ints`.
>
> Write a script to find an integer in the given array that appeared **33%** or more. If more than one found, return the smallest. If none found then return undef.

#### Let's Talk About It

I look at this code and I see my greatest hits for Challenge code. Specifying my sort (`sort { $a <=> $b }`), using hashes to shortcut `uniq` are the two big things here.

I strongly considered using `sprintf` with the percentage math, but I decided that was a display hack for debugging code and useless for solving things.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ fc postderef say signatures state };

my @examples = (

    [ 1, 2, 3, 3, 3, 3, 4, 2 ],
    [ 1, 1 ],
    [ 1, 2, 3 ],
    [ 1, 2, 3, 5 ],
);

for my $example (@examples) {
    my $output = appearance(@$example);
    $output //= 'undef';
    my $input = join ',', @$example;
    say <<"END";
    Input:  \$ints = ($input)
    Output: $output
END
}

sub appearance (@ints) {
    my @output;
    my %hash;
    my $max = scalar @ints;
    map { $hash{$_}++ } @ints;
    for my $k ( sort { $a <=> $b } keys %hash ) {
        my $v = $hash{$k};
        my $p = 100 * $v / $max;
        next if $p < 33;
        push @output, $k;
    }
    return scalar @output ? shift @output : undef;
}
```

```text
$ ./ch-1.pl
    Input:  $ints = (1,2,3,3,3,3,4,2)
    Output: 3

    Input:  $ints = (1,1)
    Output: 1

    Input:  $ints = (1,2,3)
    Output: 1

    Input:  $ints = (1,2,3,5)
    Output: undef
```

### Task 2: Completing Word

> Submitted by: Mohammad Sajid Anwar  
> You are given a string, `$str` containing alphnumeric characters and array of strings (alphabetic characters only), `@str`.
>
> Write a script to find the shortest completing word. If none found return empty string.
>
> A completing word is a word that contains all the letters in the given string, ignoring space and number. If a letter appeared more than once in the given string then it must appear the same number or more in the word.

#### Let's Talk About It

I again use hashes to make things easy. `$hash{char} = count_of_chars`, and because I need to do this for both `$str` and the elements in `@str`, I pulled it into it's own function.

(Remember kids, if you use a block of code more than once, make it a subroutine, and if you copy that subroutine over from one program to another, make a module. If you _really_ find the code useful, consider creating a PAUSE account and sharing it with the community.)

The key is that, for every case-aligned character in `$str`, each element of `@str` has to have as many instances or more of that character. `$str = 'abcd'` and `$str[0] = 'abcde'` work because the question doesn't care that `e` doesn't exist in `$str`, simply that, if anything exists in `$str`, there's that much or more of it in `$str[0]`.

I think I should note the double-sort in `sort { length $a <=> length $b } sort { fc $a cmp fc $b }`. The far-right `sort` sorts words insensitive to case, in a way that uses case-folding, which makes it safe for Unicode. I try to use `fc` in cases where I don't think I need it, much like `sum0` from List::Util, in the same spirit as _Perl Best Practices_ suggests always using `/m` and `/x` for your regular expressions.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ fc say postderef signatures state };

my @examples = (

    {
        str  => 'aBc 11c',
        strs => [ 'accbbb', 'abc', 'abbc' ]
    },
    {
        str  => 'Da2 abc',
        strs => [ 'abcm', 'baacd', 'abaadc' ]
    },
    {
        str  => 'JB 007',
        strs => [ 'jj', 'bb', 'bjb' ]
    },
    {
        str  => 'ABABC',
        strs => [ 'ACAB', 'abcbac', 'bcbaa', 'CAbaB', 'abacab' ]
    },
);

for my $example (@examples) {
    my $output = completing_word($example);
    my $str    = $example->{str};
    my $strs   = join ', ', map { qq{'$_'} } $example->{strs}->@*;

    say <<"END";
    Input: \$str = '$str'
           \@str = ($strs)
    Output: '$output'
END
}

sub completing_word ($obj) {
    my @output;
    my $str  = $obj->{str};
    my @str  = $obj->{strs}->@*;
    my %base = str_disassemble($str);
OUTER: for my $sub (@str) {
        my %sub  = str_disassemble($sub);
        my %keys = map { $_ => 1 } keys %base;
        for my $k ( sort keys %keys ) {
            my $b = $base{$k} || 0;
            my $s = $sub{$k}  || 0;
            next OUTER unless $s >= $b;
        }
        push @output, $sub;
    }
    @output =
        sort { length $a <=> length $b } sort { fc $a cmp fc $b } @output;
    return shift @output;
}

sub str_disassemble ($str) {
    my %base;
    map { $base{$_}++ }
        map { lc $_ } grep { /[A-Za-z]/ } split //, $str;
    return %base;

}
```

```text
$ ./ch-2.pl
    Input: $str = 'aBc 11c'
           @str = ('accbbb', 'abc', 'abbc')
    Output: 'accbbb'

    Input: $str = 'Da2 abc'
           @str = ('abcm', 'baacd', 'abaadc')
    Output: 'baacd'

    Input: $str = 'JB 007'
           @str = ('jj', 'bb', 'bjb')
    Output: 'bjb'

    Input: $str = 'ABABC'
           @str = ('ACAB', 'abcbac', 'bcbaa', 'CAbaB', 'abacab')
    Output: 'bcbaa'
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
