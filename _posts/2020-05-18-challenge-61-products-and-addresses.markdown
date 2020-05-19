---
layout: post
title: "Challenge 61: Products and Addresses"
author: "Dave Jacoby"
date: "2020-05-18 19:27:56 -0400"
categories: ""
---

[Perl Weekly Challenge #61](https://perlweeklychallenge.org/blog/perl-weekly-challenge-061/), with answers reversed because I want to.

### TASK #2 › IPv4 Partition

> Reviewed by: Ryan Thompson
>
> You are given a string containing only digits (0..9). The string should have between 4 and 12 digits.
>
> Write a script to print every possible valid IPv4 address that can be made by partitioning the input string.
>
> For the purpose of this challenge, a valid IPv4 address consists of four “octets” i.e. A, B, C and D, separated by dots (.).
>
> Each octet must be between 0 and 255, and must not have any leading zeroes. (e.g., 0 is OK, but 01 is not.)
>
> Example
> Input: `25525511135`
>
> Output:
>
> `255.255.11.135`
>
> `255.255.111.35`

_Should_ we still deal with IPv4 addresses anymore? Vint Cerf argues no.

![Vint Cerf Wants You!](https://jacoby.github.io/images/vint-cerf-ipv6.jpg)

[Source](https://www.6connect.com/resources/ipv6-and-the-transition-from-ipv4-explained/)

But, since it's the challenge, let's go.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings qw{ experimental };

my $input = '25525511135';
($input) = $ARGV[0] =~ /(\d+)/ if defined $ARGV[0];
my @input  = split //, $input;
my $output = '';

say join "\n\t", "$input =>", ipv4_partitions( $output, @input );

sub ipv4_partitions ( $output, @input ) {

    # this block ensures we only have "good" addresses go through
    # * no .1.1.1.1
    # * only four numbers
    # * only three periods
    # * no number greater than 255
    #   ( because only digits, no need to block negatives)
    # * no zero-pads - 0 is fine, 04 is not
    return if $output =~ /^\./;
    return if 4 < scalar split /\./, $output;
    return if grep { int $_ > 255 } split /\./, $output;
    return if grep { length $_ > 3 } split /\./, $output;
    return if grep { $_ =~ /0\d/ } split /\./, $output;
    my @zed;

    # if there's still digits to fit
    if ( scalar @input ) {
        my $next = shift @input;
        push @zed, ipv4_partitions( qq{$output\.$next}, @input );
        push @zed, ipv4_partitions( qq{$output$next},   @input );
    }
    else {
        # handles non-\d+.\d+.\d+.\d+ cases
        return if 4 != scalar split /\./, $output;
        push @zed, $output;
    }
    return @zed;
}
```

There's one IP address that I doubt I ever will forget, which is for the main DNS server for my former school and workplace. This is a good example because it shows what is and isn't allowed with zeroes.

```text
./ch-2.pl 128210115
128210115 =>
        1.28.210.115
        12.8.210.115
        12.82.10.115
        128.2.10.115
        128.21.0.115
        128.210.1.15
        128.210.11.5
```

### TASK #1 › Product SubArray

> Reviewed by: Ryan Thompson
>
> Given a list of 4 or more numbers, write a script to find the contiguous sublist that has the maximum product. The length of the sublist is irrelevant; your job is to maximize the product.
>
> Example
>
> Input: `[ 2, 5, -1, 3 ]`
>
> Output: `[ 2, 5 ]` which gives maximum product `10`.

I'm usng [JSON](https://metacpan.org/pod/JSON) to format the output.

```text
$ ./ch-1.pl 2 5 1 5  2
["2","5"]
```

Both `[2,5]` and `[5,2]` are valid as max, but we return `[2,5]` because it comes first.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings qw{ experimental };

use JSON;
my $json = JSON->new;

my @numbers = @ARGV;
@numbers = ( 2, 5, -1, 3 ) if scalar @ARGV < 4;

my @array = product_subarray(@numbers);
say $json->encode(@array);
exit;

sub product_subarray ( @numbers ) {
    my @output;
    for my $i ( 1 .. $#numbers ) {
        my $j       = $i - 1;
        my $product = $numbers[$j] * $numbers[$i];
        push @output, { p => $product, n => [ $numbers[$j], $numbers[$i] ], };
    }
    my ($output) = sort { $b->{p} <=> $a->{p} } @output;
    return $output->{n};
}
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
