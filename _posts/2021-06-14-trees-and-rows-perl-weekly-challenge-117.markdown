---
layout: post
title: "Trees and Rows: Perl Weekly Challenge 117"
author: "Dave Jacoby"
date: "2021-06-14 19:14:57 -0400"
categories: ""
---

Another Week, another [Perl Weekly Challenge!](https://perlweeklychallenge.org/blog/perl-weekly-challenge-117/)

### TASK #1 › Missing Row

> Submitted by: Mohammad S Anwar  
> You are given text file with rows numbered 1-15 in random order but there is a catch one row in missing in the file.
>
> `11, Line Eleven`  
> `1, Line one`  
> `9, Line Nine`  
> `13, Line Thirteen`  
> `2, Line two`  
> `6, Line Six`  
> `8, Line Eight`  
> `10, Line Ten`  
> `7, Line Seven`  
> `4, Line Four`  
> `14, Line Fourteen`  
> `3, Line three`  
> `15, Line Fifteen`  
> `5, Line Five`
>
> Write a script to find the missing row number.

#### Generating the Test Data

It would be _too easy_ to just make it so `text_file_01.txt` was missing `1, Line one`, so I used the power of `sort` and `rand`.

Remember you do numeric sort like `sort { $a <=> $b }`. So, instead of `$a` and `$b`, I do `sort { rand 2 <=> rand 2}`, which gives me a randomized sort. Remember that, by default, `rand` gives a floating point value.

#### Solving the puzzle

Simply, I create an array from 0 to 15, giving each the value of the index — `0` gets `0`, `15` gets `15`, etc, and then, for each file, I extract the initial number, use that as an index, and use `sum` (safe here because I know there's no undefined values) to sum a whole lot of zeroes and the one remaining index/value.

#### Show Me The Code!

Generating the text files:

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

my $translate = {
    1  => 'One',
    2  => 'Two',
    3  => 'Three',
    4  => 'Four',
    5  => 'Five',
    6  => 'Six',
    7  => 'Seven',
    8  => 'Eight',
    9  => 'Nine',
    10 => 'Ten',
    11 => 'Eleven',
    12 => 'Twelve',
    13 => 'Thirteen',
    14 => 'Fourteen',
    15 => 'Fifteen',
};

my $c = 1;
for my $i ( sort { rand 2 <=> rand 2 } 1 .. 15 ) {
    my $filename = sprintf 'text_file_%02d.txt', $c;
    open my $fh , '>', $filename;
    for my $j ( sort { rand 2 <=> rand 2 } 1 .. 15 ) {
        next if $i == $j;
        my $w = $translate->{$j};
        $w = int rand 2 ? $w : lc $w ;
        say $fh qq{$j, Line $w};
    }
    $c++;
}
```

Solving the Task:

```perl
#!/usr/bin/env perl

# use generate_files.pl to create test files
# where the missing line number is _not_
# _necessarily_ the same as the file number.

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

use List::Util qw{ sum };

for my $file (@ARGV) {
    next unless -f $file;
    my $row = missing_row($file);
    say join "\t", $row, $file;
}

sub missing_row( $file ) {
    if ( -f $file && open my $fh, '<', $file ) {
        my @targets = map { $_ } 0 .. 15;
        my @x       = map { chomp $_; $_ } <$fh>;
        close $fh;
        for my $l (@x) { my ($d) = split /,/, $l; $targets[$d] = 0; }
        return sum @targets;
    }
    return 'none';
}
```

```text
 jacoby > Bishop > ~ > win > 117 > $ > ./ch-1.pl *txt
4       text_file_01.txt
14      text_file_02.txt
12      text_file_03.txt
3       text_file_04.txt
1       text_file_05.txt
2       text_file_06.txt
15      text_file_07.txt
6       text_file_08.txt
13      text_file_09.txt
7       text_file_10.txt
9       text_file_11.txt
8       text_file_12.txt
5       text_file_13.txt
10      text_file_14.txt
11      text_file_15.txt
```

### TASK #2 › Find Possible Paths

> Submitted by: E. Choroba
> You are given size of a triangle.
>
> Write a script to find all possible paths from top to the bottom right corner.
>
> In each step, we can either move horizontally to the right (H), or move downwards to the left (L) or right (R).
>
> BONUS: Try if it can handle triangle of size 10 or 20.

I went back to my `Node` code, adding a leg to give us `right`, `left` and `horizontal`. I'm half considering it a bad choice. In part, it's on me; I copied the `horizontal` method from the `right` method and forgot to adapt it, so I was getting bad results and not understanding it, and in part because part of me thinks it's too slow to do 20 without taking a long time.

I mean, it's recursive and has to cover _every_ possibility, so there's no choice but cover everything, but I'm thinking that I might do better with an array-of-arrays representation.

Anyway, as long as we're using objects and traversing a "tree", there are only three ways we have to handle:

    * `left`, which drops a level but  goes to the left
    * `right`, which drops a level but goes to the right
    * `horizontal`, which stays on the same level and goes to the right

I pre-find the end-point and send it along, so the recursion always knows where the endpoint is.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

# 1) make the triangle
# 2) traverse the triangle

use Carp;
use Getopt::Long;

my $n = 2;
GetOptions( 'number=i' => \$n );
croak 'Too Small' if $n < 0;

my $tree  = make_triangle($n);
my $start = $tree->[0][0];
my $end   = $start;
while ( $end->right ) {
    $end = $end->right;
}
traverse_tree( $start, $end );

my @output;

sub traverse_tree ( $node, $end, $path = '' ) {
    return unless $node;
    my $value = $node->value;
    my $ev    = $end->value();
    if ( $value eq $ev ) {
        push @output, $path;
    }
    my $l = $node->left;
    my $r = $node->right;
    my $h = $node->horizontal;
    my $flag =
           defined $l
        || defined $r
        || defined $h ? 1 : 0;
    traverse_tree( $h, $end, $path . 'H' ) if defined $h;
    traverse_tree( $l, $end, $path . 'L' ) if defined $l;
    traverse_tree( $r, $end, $path . 'R' ) if defined $r;
}

say join " ", sort { length $a <=> length $b } @output;

exit;

sub test_tree( $tree ) {
    say 'VALUE';
    for my $i ( 0 .. -1 + scalar $tree->@* ) {
        say join ' ', map { $_->value } $tree->[$i]->@*;
    }
    say 'LEFT';
    for my $i ( 0 .. -1 + scalar $tree->@* ) {
        say join ' ',
            map { defined $_->left ? $_->left->value : 'LLL' }
            $tree->[$i]->@*;
    }
    say 'RIGHT';
    for my $i ( 0 .. -1 + scalar $tree->@* ) {
        say join ' ',
            map { defined $_->right ? $_->right->value : 'RRR' }
            $tree->[$i]->@*;
    }
    say 'HORIZONTAL';
    for my $i ( 0 .. -1 + scalar $tree->@* ) {
        say join ' ',
            map { defined $_->horizontal ? $_->horizontal->value : 'HHH' }
            $tree->[$i]->@*;
    }
}

sub make_triangle( $n ) {
    my @rows;

    my $tree;
    for my $i ( 0 .. $n ) {
        for my $j ( 0 .. $i ) {
            my $k = 2 * ( int( $j / 2 ) );
            push $tree->[$i]->@*, Node->new(1);
        }
    }
    for my $i ( 0 .. $n ) {
        for my $j ( 0 .. -1 + scalar $tree->[$i]->@* ) {
            $tree->[$i][$j]->value( join ',', $i, $j );
        }
    }

    for my $i ( 0 .. $n ) {
        for my $j ( 0 .. -1 + scalar $tree->[$i]->@* ) {
            if ( defined $tree->[ $i + 1 ][$j] ) {
                $tree->[$i][$j]->left( $tree->[ $i + 1 ][$j] );
            }
            if ( defined $tree->[ $i + 1 ][ $j + 1 ] ) {
                $tree->[$i][$j]->right( $tree->[ $i + 1 ][ $j + 1 ] );
            }
            if ( $j < $i ) {
                $tree->[$i][$j]->horizontal( $tree->[$i][ $j + 1 ] );
            }
        }
    }
    return $tree;
}

package Node;

sub new ( $class, $value = 0 ) {
    my $self = {};
    $self->{value}      = $value;
    $self->{left}       = undef;
    $self->{right}      = undef;
    $self->{horizontal} = undef;
    $self->{parent}     = undef;
    return bless $self, $class;
}

sub value ( $self, $value = undef ) {
    if ( defined $value ) {
        $self->{value} = $value;
    }
    else {
        return $self->{value};
    }
}

sub is_root ( $self ) {
    return defined $self->{parent} ? 0 : 1;
}

sub is_leaf ( $self ) {
    return ( !defined $self->{left} && !defined $self->{right} )
        ? 1
        : 0;
}

sub left ( $self, $node = undef ) {
    if ( defined $node ) {
        $self->{left}   = $node;
        $node->{parent} = $self;
    }
    else {
        return $self->{left};
    }
}

sub right ( $self, $node = undef ) {
    if ( defined $node ) {
        $self->{right}  = $node;
        $node->{parent} = $self;
    }
    else {
        return $self->{right};
    }
}

sub horizontal ( $self, $node = undef ) {
    if ( defined $node ) {
        $self->{horizontal} = $node;
        $node->{parent}     = $self;
    }
    else {
        return $self->{horizontal};
    }
}

sub parent ($self ) {
    return $self->{parent};
}
```

```text
./ch-2.pl -n 1; ./ch-2.pl -n 2 ; ./ch-2.pl -n 4;./ch-2.pl -n 10R LH
RR LHR LRH RLH LHLH LLHH
RRRR LHRRR LRHRR LRRHR LRRRH RLHRR RLRHR RLRRH RRLHR RRLRH RRRLH LHLHRR LHLRHR LHLRRH LHRLHR LHRLRH LHRRLH LLHHRR LLHRHR LLHRRH LLRHHR LLRHRH LLRRHH LRHLHR LRHLRH LRHRLH LRLHHR LRLHRH LRLRHH LRRHLH LRRLHH RLHLHR RLHLRH RLHRLH RLLHHR RLLHRH RLLRHH RLRHLH RLRLHH RRLHLH RRLLHH LHLHLHR LHLHLRH LHLHRLH LHLLHHR LHLLHRH LHLLRHH LHLRHLH LHLRLHH LHRLHLH LHRLLHH LLHHLHR LLHHLRH LLHHRLH LLHLHHR LLHLHRH LLHLRHH LLHRHLH LLHRLHH LLLHHHR LLLHHRH LLLHRHH LLLRHHH LLRHHLH LLRHLHH LLRLHHH LRHLHLH LRHLLHH LRLHHLH LRLHLHH LRLLHHH RLHLHLH RLHLLHH RLLHHLH RLLHLHH RLLLHHH LHLHLHLH LHLHLLHH LHLLHHLH LHLLHLHH LHLLLHHH LLHHLHLH LLHHLLHH LLHLHHLH LLHLHLHH LLHLLHHH LLLHHHLH LLLHHLHH LLLHLHHH LLLLHHHH
RRRRRRRRRR LHRRRRRRRRR LRHRRRRRRRR LRRHRRRRRRR LRRRHRRRRRR LRRRRHRRRRR LRRRRRHRRRR LRRRRRRHRRR LRRRRRRRHRR LRRRRRRRRHR LRRRRRRRRRH RLHRRRRRRRR RLRHRRRRRRR RLRRHRRRRRR RLRRRHRRRRR RLRRRRHRRRR RLRRRRRHRRR RLRRRRRRHRR RLRRRRRRRHR RLRRRRRRRRH RRLHRRRRRRR RRLRHRRRRRR RRLRRHRRRRR RRLRRRHRRRR RRLRRRRHRRR RRLRRRRRHRR RRLRRRRRRHR RRLRRRRRRRH RRRLHRRRRRR RRRLRHRRRRR RRRLRRHRRRR RRRLRRRHRRR RRRLRRRRHRR RRRLRRRRRHR RRRLRRRRRRH RRRRLHRRRRR RRRRLRHRRRR RRRRLRRHRRR RRRRLRRRHRR RRRRLRRRRHR RRRRLRRRRRH RRRRRLHRRRR RRRRRLRHRRR RRRRRLRRHRR RRRRRLRRRHR RRRRRLRRRRH RRRRRRLHRRR RRRRRRLRHRR RRRRRRLRRHR RRRRRRLRRRH RRRRRRRLHRR RRRRRRRLRHR RRRRRRRLRRH RRRRRRRRLHR RRRRRRRRLRH RRRRRRRRRLH LHLHRRRRRRRR LHLRHRRRRRRR LHLRRHRRRRRR LHLRRRHRRRRR LHLRRRRHRRRR LHLRRRRRHRRR LHLRRRRRRHRR LHLRRRRRRRHR LHLRRRRRRRRH LHRLHRRRRRRR LHRLRHRRRRRR LHRLRRHRRRRR LHRLRRRHRRRR LHRLRRRRHRRR 
... A WHOLE LOT REDACTED ... 
LLLLLLLLHHHLHHHHHLHH LLLLLLLLHHHLHHHHLHHH LLLLLLLLHHHLHHHLHHHH LLLLLLLLHHHLHHLHHHHH LLLLLLLLHHHLHLHHHHHH LLLLLLLLHHHLLHHHHHHH LLLLLLLLHHLHHHHHHHLH LLLLLLLLHHLHHHHHHLHH LLLLLLLLHHLHHHHHLHHH LLLLLLLLHHLHHHHLHHHH LLLLLLLLHHLHHHLHHHHH LLLLLLLLHHLHHLHHHHHH LLLLLLLLHHLHLHHHHHHH LLLLLLLLHHLLHHHHHHHH LLLLLLLLHLHHHHHHHHLH LLLLLLLLHLHHHHHHHLHH LLLLLLLLHLHHHHHHLHHH LLLLLLLLHLHHHHHLHHHH LLLLLLLLHLHHHHLHHHHH LLLLLLLLHLHHHLHHHHHH LLLLLLLLHLHHLHHHHHHH LLLLLLLLHLHLHHHHHHHH LLLLLLLLHLLHHHHHHHHH LLLLLLLLLHHHHHHHHHLH LLLLLLLLLHHHHHHHHLHH LLLLLLLLLHHHHHHHLHHH LLLLLLLLLHHHHHHLHHHH LLLLLLLLLHHHHHLHHHHH LLLLLLLLLHHHHLHHHHHH LLLLLLLLLHHHLHHHHHHH LLLLLLLLLHHLHHHHHHHH LLLLLLLLLHLHHHHHHHHH LLLLLLLLLLHHHHHHHHHH
```

My test of `-n 20` is still running.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
