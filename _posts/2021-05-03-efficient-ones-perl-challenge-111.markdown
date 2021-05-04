---
layout: post
title: "Efficient Ones :Perl Challenge 111"
author: "Dave Jacoby"
date: "2021-05-03 19:37:55 -0400"
categories: ""
---

Here we go, onto [Perl Challenge #111](https://perlweeklychallenge.org/blog/perl-weekly-challenge-111/)

### TASK #1 › Search Matrix

> Submitted by: Mohammad S Anwar  
> You are given 5x5 matrix filled with integers such that each row is sorted from left to right and the first integer of each row is greater than the last integer of the previous row.
>
> Write a script to find a given integer in the matrix using an efficient search algorithm.

So, there are _many_ ways of doing this. But we aren't asked for just any way to do this, but for an efficient one. We can of course _conjecture_ about what efficent algorithms would be for our task, but what's better than conjecture?

Using [Benchmark](https://metacpan.org/pod/Benchmark) to demonstrate that our chosen algorithm is fast.

(I feel, at this point, to mention that "premature optimization is the root of all evil." ([Not Knuth, but Sir Tony Hoare](https://ubiquity.acm.org/article.cfm?id=1513451).) If, in any specific application, this matrix search is done rarely, getting the best wall-time solution might not be worth spending much time thinking about it.

So, to demonstrate benchmarking, I wrote four options.

- Go through every value in the matrix and return `1` if the value is in the matrix.
- Turn the matrix into a hash, then see if the value is in the hash.
- Turn the matrix into a hash, which is a state value, then see if the value is in the hash. This _should_ make every query after the first a little faster.
- The best for this specific structured data (I think), being to go through each row and determine if the value is between the highest and lowest value, and only then go through that row to determine if it's a value within.

Discussion on the results after...

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict ;
use warnings ;
use feature qw{ say state postderef signatures } ;
no warnings qw{ experimental } ;

use Benchmark qw(:all) ;

# You are given 5x5 matrix filled with integers such that
# each row is sorted from left to right and the first
# integer of each row is greater than the last integer of
# the previous row.

# Write a script to find a given integer in the matrix
# using an efficient search algorithm.

# But how do we know what's efficient?

my $matrix = [
    [ 1,  2,  3,  5,  7 ],
    [ 9,  11, 15, 19, 20 ],
    [ 23, 24, 25, 29, 31 ],
    [ 32, 33, 39, 40, 42 ],
    [ 45, 47, 48, 49, 50 ],
    ] ;
my $input1 = 35 ;
my $input2 = 39 ;

say uc 'are these correct?' ;
say join "\t", '', '0', $input1, is_in_matrix_0( $matrix, $input1 ) ;
say join "\t", '', '0', $input2, is_in_matrix_0( $matrix, $input2 ) ;
say join "\t", '', '1', $input1, is_in_matrix_1( $matrix, $input1 ) ;
say join "\t", '', '1', $input2, is_in_matrix_1( $matrix, $input2 ) ;
say join "\t", '', '2', $input1, is_in_matrix_2( $matrix, $input1 ) ;
say join "\t", '', '2', $input2, is_in_matrix_2( $matrix, $input2 ) ;
say join "\t", '', '3', $input1, is_in_matrix_3( $matrix, $input1 ) ;
say join "\t", '', '3', $input2, is_in_matrix_3( $matrix, $input2 ) ;
say '' ;

say uc 'which is fastest?' ;
say '' ;
my $count = 10_000_000 ;

my $results = timethese(
    $count,
    {
        'Sub0' => sub { is_in_matrix_0( $matrix, $input1 )  },
        'Sub1' => sub { is_in_matrix_1( $matrix, $input1 )  },
        'Sub2' => sub { is_in_matrix_2( $matrix, $input1 )  },
        'Sub3' => sub { is_in_matrix_3( $matrix, $input1 )  },
        },
    'none'
    ) ;
cmpthese( $results ) ;

# the SECOND WORST way: check everything unless/until
# we find a match
sub is_in_matrix_0 ( $matrix, $input ) {
    my $hash = {} ;
    for my $row ( $matrix->@* ) {
        for my $v ( $row->@* ) {
            return 1 if $v == $input;
            }
        }
    return 0 ;
    }

# the WORST way: put it all into a hash and check the hash
sub is_in_matrix_1 ( $matrix, $input ) {
    my $hash = {} ;
    for my $row ( $matrix->@* ) {
        for my $v ( $row->@* ) {
            $hash->{ $v }++ ;
            }
        }
    return $hash->{ $input } ? 1 : 0 ;
    }

# SLIGHTLY less bad: the same but *memoized*
sub is_in_matrix_2 ( $matrix, $input ) {
    state $hash = {} ;
    if ( !defined $hash->{ $matrix->[ -1 ][ -1 ] } ) {
        for my $row ( $matrix->@* ) {
            for my $v ( $row->@* ) { $hash->{ $v }++ ; }
            }
        }
    return $hash->{ $input } ? 1 : 0 ;
    }

# Checking every row to see if the value is within range
# and THEN checking if it's in that row
sub is_in_matrix_3 ( $matrix, $input ) {
    for my $row ( $matrix->@* ) {
        if ( $input > $row->[ 0 ] && $input < $row->[ -1 ] ) {
            for my $v ( $row->@* ) { return 1 if $v == $input ; }
            }
        }
    return 0 ;
    }
```

```text
PS C:\Users\jacob\Documents\GitHub\perlweeklychallenge-club\challenge-111\dave-jacoby\perl> perl .\ch-1.pl
ARE THESE CORRECT?
        0       35      0
        0       39      1
        1       35      0
        1       39      1
        2       35      0
        2       39      1
        3       35      0
        3       39      1

WHICH IS FASTEST?

          Rate  Sub1  Sub0  Sub3  Sub2
Sub1  233155/s    --  -67%  -83%  -94%
Sub0  700280/s  200%    --  -49%  -82%
Sub3 1382361/s  493%   97%    --  -65%
Sub2 3924647/s 1583%  460%  184%    --
PS
```

**Sub2** is the _memoized_ way, and the fastest shown here. So, it is proven that hash lookups are fast. The problem is that we don't check which matrix we're looking at, so if we check against another matrix within the same code, the `state` hash will have the same values, so, it's _efficient_ but _incorrect_.

If we stringify the matrix and use it as the key, that would make it more correct.

**Sub3** is the one with minimal searching, knowing that the value will be between `$row->[0]` and `$row->[-1]`, or it won't be there at all. I think there are minor efficiencies yet available, but among the _correct_ responses, it's the most efficent.

**Sub0** beats **Sub1**, and that's because **Sub1** _must_ touch every entry in the matrix, while **Sub0** stops if it finds a value. (I suspect the differences would be minimal if we were searching for `50` or `51`).

### TASK #2 › Ordered Letters

> Submitted by: E. Choroba  
> Given a word, you can sort its letters alphabetically (case insensitive). For example, “beekeeper” becomes “beeeeekpr” and “dictionary” becomes “acdiinorty”.
>
> Write a script to find the longest English words that don’t change when their letters are sorted.

The easy way to get to longest is to sort the words we're looking at, conveniently placed in `/usr/share/dict/words`, and sort it by length first thing. I'm against seeing one-letter words as words, so I shrink the array size by grepping them out, but that's not strictly necessary.

Here we're doing that functional list thing, `split`ting the word into a list, `sort`ing the list, and `join`ing again. No magic. I believe the closest thing to magic is knowing where my OS has a words list. I'm not even sure Windows 10 _has_ one.

This solution also uses `state` to the list of answers small, but there are other ways of doing so.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say state postderef signatures };
no warnings qw{ experimental };

my @words = get_words();

for my $word (@words) {
    state $c = 0;
    my $sort = sort_word($word);
    if ( $sort eq $word ) {
        say $word;
        last if $c++ > 5;
    }
}

sub get_words {
    my $dict = '/usr/share/dict/words';
    my @words;
    if ( -f $dict && open my $fh, '<', $dict ) {
        @words =
            sort { length $b <=> length $a }
            grep { length $_ > 1 }
            map  { chomp $_; lc $_ } <$fh>;
    }
    return @words;
}

sub sort_word ( $word ) {
    return join '', sort split //, $word;
}
```

```text
 $ > ./ch-2.pl
billowy
abbott
bellow
deimos
abbess
abhors
accent
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
