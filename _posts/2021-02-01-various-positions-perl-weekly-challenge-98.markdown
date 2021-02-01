---
layout: post
title: "Various Positions: Perl Weekly Challenge #98"
author: "Dave Jacoby"
date: "2021-02-01 17:22:01 -0500"
categories: ""
---

[Time for another Perl Challenge](https://perlweeklychallenge.org/blog/perl-weekly-challenge-098/)

### TASK #2 › Search Insert Position

> Submitted by: Mohammad S Anwar  
> You are given a sorted array of distinct integers `@N` and a target `$N`.
>
> Write a script to return the index of the given target if found otherwise place the target in the sorted array and return the index.

I put Task #2 first because I completed Task #2 first. Let's take the first example.

```text
    n:      3
    index:  0   1   2   3
    value:  1   2   3   4
```

- `index` is `0`, `value` is `1`. `n` is greater than `1`, so we go to the next index.
- `index` is `1`, `value` is `2`. `n` is greater than `2`, so we go to the next index.
- `index` is `2`, `value` is `3`. `n` is equal `3`, so return `index`.

Simple iteration, returning the index when `n` is greater or equal to the value.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

my @ns;
push @ns, [ 3,  [ 1,  2,  3,  4 ] ];
push @ns, [ 6,  [ 1,  3,  5,  7 ] ];
push @ns, [ 10, [ 12, 15, 16, 18 ] ];
push @ns, [ 19, [ 11, 13, 15, 17 ] ];

for my $m (@ns) {
    my $n = $m->[0];
    my @n = $m->[1]->@*;
    my $i = search_insert_position( $n, @n );
    say qq{Input:  \$n = $n};
    say qq{        \@n = } . join ', ', @n;
    say qq{Output: \$i = $i};
    say '';
}

sub search_insert_position ( $n, @n ) {
    my $i = 0;
    while ( $i < @n ) {
        return $i if $n <= $n[$i];
        $i++;
    }
    return $i;
}
```

```text
Input:  $n = 3
        @n = 1, 2, 3, 4
Output: $i = 2

Input:  $n = 6
        @n = 1, 3, 5, 7
Output: $i = 3

Input:  $n = 10
        @n = 12, 15, 16, 18
Output: $i = 0

Input:  $n = 19
        @n = 11, 13, 15, 17
Output: $i = 4
```

### TASK #1 › Read N-characters

> Submitted by: Mohammad S Anwar  
> You are given file `$FILE`.
>
> Create subroutine `readN($FILE, $number)` returns the first n-characters and moves the pointer to the `(n+1)th` character.

As a convention, `readN` returns an empty string, `''`, when there's nothing left in the string beyond the pointer. It also returns an empty string if `$FILE` doesn't exist, or isn't a file.

Another thing to watch for is the pointer for the current position. Because we're supposed to use `readN($FILE, $number)` and not `readN($FILE, $pointer)`, I should store the pointer within the function, and I should associate that pointer with the file name.

```perl
sub readN ( $file, $chars ) {
    state $index;
    $index->{$file} //= 0;
    my $i = $index->{$file};
    return '' unless -f $file;
    return '' unless -r $file;
    return '' if $i > -s $file;
    ...
}
```

`state` allows us to have a hashref within the function that stores where we are within the file. `//=` sets that value if it isn't set. `-f` ensures that `$file` is a file, not a directory or a symbolic link or something. `-r` ensures that the file is readable, because we can't pull text from a file we can't read. Finally, `-s` gives us the size of the file, so if the value for `$index->{$file}` is greater than the size, we can give up before opening the file.

I normally write `if ( -f $file && open my $fh, '<', $file ) { ... }`, but because I have already tested the file, I don't test again. Also, `open` will fail if I can't read `$file`, but it is good to be sure.

Because we're keeping track relating to each file, the test should juggle between multiple files, including some that don't exist. Again I use a hashref, and when I get that empty string from a file, I set `$flags->{$input} = 1`, then `sum0 values %$flags` and test it against the number of inputs to ensure I'm not infinite-looping when I've read all possible inputs.

```perl
my @inputs = qw{ twinkie input1.txt input2.txt };
while ( $flag < @inputs ) {
    state $flags;
    for my $input (@inputs) {
        my $output = readN( $input, $n );
        do {
            $flags->{$input} = 1;
            $flag = sum0 values %$flags;
            next;
        } if $output eq '';
        say qq{\t'$input'\t$n\t'$output'};
    }
}
```

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use List::Util qw{ sum0 };

my $n      = 4;
my $flag   = 0;
my @inputs = qw{ twinkie input1.txt input2.txt };
while ( $flag < @inputs ) {
    state $flags;
    for my $input (@inputs) {
        my $output = readN( $input, $n );
        do {
            $flags->{$input} = 1;
            $flag = sum0 values %$flags;
            next;
        } if $output eq '';
        say qq{\t'$input'\t$n\t'$output'};
    }
}

# returns empty string on failure cases, which include
#   * no file
#   * index beyond file length

sub readN ( $file, $chars ) {
    state $index;
    $index->{$file} //= 0;
    my $i = $index->{$file};
    return '' unless -f $file;
    return '' unless -r $file;
    return '' if $i > -s $file;
    my $output = '';

    if ( open my $fh, '<', $file ) {
        my $string = join '', <$fh>;
        $output = substr $string, $i, $chars;
        close $fh;
    }
    $index->{$file} += $chars;
    return $output;
}
```

```text
        'input1.txt'    4       '1234'
        'input2.txt'    4       'ABCD'
        'input1.txt'    4       '5678'
        'input2.txt'    4       'EFGH'
        'input1.txt'    4       '90'
        'input2.txt'    4       'IJKL'
        'input2.txt'    4       'MNOP'
        'input2.txt'    4       'QRST'
        'input2.txt'    4       'UVWX'
        'input2.txt'    4       'YZ'
```

#### You Can Do Better!

I searched for a way to read from the middle of a file, and sure enough, [`read`](https://perldoc.perl.org/functions/read) is precisely what I should've been looking for. My overhead is similar, but now I put the filehandle within the state hashref. I pull out `$fh` because it's shorter than `$fhs->{$file}`, but that's just lazy typing.

And it's a drop-in replacement for the previous `readN`, so I don't have to change any of the rest of the program.

```perl
sub readN ( $file, $chars ) {
    state $fhs;
    return '' unless -f $file;
    return '' unless -r $file;
    unless ( $fhs->{$file} ) { open $fhs->{$file}, '<', $file }

    my $fh = $fhs->{$file};
    my $output ;
    read $fh, $output, $chars;
    return $output;
}
```

```text
        'input1.txt'    4       '1234'
        'input2.txt'    4       'ABCD'
        'input1.txt'    4       '5678'
        'input2.txt'    4       'EFGH'
        'input1.txt'    4       '90'
        'input2.txt'    4       'IJKL'
        'input2.txt'    4       'MNOP'
        'input2.txt'    4       'QRST'
        'input2.txt'    4       'UVWX'
        'input2.txt'    4       'YZ'
```

It's good to remember, when you're trying to solve a problem, that some smart people might've already solve your problem already.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
