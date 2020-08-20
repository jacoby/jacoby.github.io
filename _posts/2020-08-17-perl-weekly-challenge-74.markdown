---
layout: post
title: "Perl Weekly Challenge #74"
author: "Dave Jacoby"
date: "2020-08-17 16:42:24 -0400"
categories: ""
---

### TASK #1 › Majority Element

> Submitted by: Mohammad S Anwar  
> You are given an array of integers of size `$N`.
>
> Write a script to find the majority element. If none found then print -1.
>
> > Majority element in the list is the one that appears more than floor(size_of_list/2).

If we have `@array`, we can do `my $floor = scalar @array / 2`, so that part's easy.

We want to know how many there are of any element. `map { $hash{$_}++ } @array`.

I wanted to go directly to the biggest, but that isn't strictly necessary, because since it has to constitute _more than half_, sorting is not required. But still: `sort { $hash{$b} <=> $hash{$a} } keys %hash`.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use List::Util qw{ first };
use JSON;
my $json = JSON->new->pretty->canonical;

my @array;
push @array, [ 1, 2, 2, 3, 2, 4, 2 ];
push @array, [ 1, 3, 1, 2, 4, 5 ];

for my $i (@array) {
    my $output = majority_element( $i->@* );
    print 'Input: @A = (';
    print  join ', ', $i->@*;
    say ')';
    say qq{Output: $output};
    say '';
}

sub majority_element ( @array ) {
    my $floor = scalar @array / 2;
    my %hash;
    map { $hash{$_}++ } @array;

    # strictly speaking, this sort isn't necessary, but I like it.
    for my $k ( sort { $hash{$b} <=> $hash{$a} } keys %hash ) {
        my $v = $hash{$k};
        return $k if $v > $floor;
    }

    return -1;
}
```

### TASK #2 › FNR Character

> Submitted by: Mohammad S Anwar  
> You are given a string `$S`.
>
> Write a script to print the series of first non-repeating character (left -> right) for the given string. Print `#` if none found.

I loop through the string and use `substr($string,$index,1)` to get the current string, and throw it into an array for later testing. Now, a few days later, I'm thinking that I can get the whole left-to-current string with `substr($string,0,$index)`, but I have the code submitted already.

For every letter `$l`, we add it to a hash like `$hash->{$l}++`, which means:

- if the letter hasn't been used, there's no entry
- if the letter has been used, the value is 1
- if the letter has been used and is repeating, the value will be greater than 1

I think it's fairly straightforward.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use List::Util qw{ first };
use JSON;
my $json = JSON->new->pretty->canonical;

my @strings = qw{
    ababc
    xyzzyx
};

for my $string (@strings) {
    my $output = fnr($string);
    say qq{Input:   $string};
    say qq{Output:  $output};
    say '';
}

sub fnr ( $s ) {
    my @output;
    my @done;
    for my $i ( 0 .. length $s ) {
        my $l = substr( $s, $i, 1 );
        push @done, $l;
        my %hash;
        map { $hash{$_}++ } @done;
        my $o = '#';
        for my $m ( reverse @done ) {
            if ( $hash{$m} < 2 ) { $o = $m; last }
        }
        push @output, $o;

    }
    return join '', @output;
    return uc $s;
}
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
