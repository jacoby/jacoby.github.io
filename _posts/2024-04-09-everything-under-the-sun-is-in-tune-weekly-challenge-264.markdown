---
layout: post
title: "Everything Under The Sun Is In Tune: Weekly Challenge #264"
author: "Dave Jacoby"
date: "2024-04-09 15:33:29 -0400"
categories: ""
---

[![From NASA HQ PHOTO on Flickr](https://jacoby-lpwk.onrender.com/images/nasa_eclipse.jpg) <br> From NASA HQ PHOTO ](https://www.flickr.com/photos/nasahqphoto/53640745976/in/album-72177720315879304/)

But the Sun is eclipsed by the moon.

This is **[Weekly Challenge #264](https://theweeklychallenge.org/blog/perl-weekly-challenge-264/)**

This week's challenge came out on the day of the [2024 Total Solar Eclipse](https://science.nasa.gov/eclipses/future-eclipses/eclipse-2024/), and I live maybe a half-hour drive outside of the zone of totality, so instead of jumping on it, taking care of the Challenge first thing, I drove to a road next to a field in Indiana and saw my first total eclipse. The next ones we could see in the US will be in 2044 and 2045, so I took my chance while I could.

Holding eclipse glasses over your camera phone will not get a good photo of the corona.

### Task 1: Greatest English Letter

> Submitted by: Mohammad Sajid Anwar  
> You are given a string, $str, made up of only alphabetic characters `[a..zA..Z]`.
>
> Write a script to return the greatest english letter in the given string.
>
> A letter is greatest if it occurs as lower and upper case. Also letter ‘b’ is greater than ‘a’ if ‘b’ appears after ‘a’ in the English alphabet.

#### Let's Talk About It

We're looking for a matched pair of characters, uppercase and lowercase. So, we need a way to mark for each letter if theres both an uppercase and a lowercase. As I often do, I store things in a hash. If there's no `U` in the hash value and the letter is uppercase, I append the `U`, and same with `L` for lowercase. And then, use grep to find the solution, if any.

To get into the habit, I used _fold case_, or `fc`, rather than `uc` or `lc`.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ fc postderef say signatures state };

my @examples = (

    'PeRlwEeKLy',
    'ChaLlenge',
    'The',
);

for my $example (@examples) {
    my $output = greatest_letter($example);
    say <<"END";
    Input:  \$str = "$example"
    Output: "$output"
END
}

sub greatest_letter ($str) {
    my @letters = split //, $str;
    my %hash;
    for my $l (@letters) {
        my $L = uc $l;
        $hash{$L} ||= '';
        if ( $L eq uc $l ) {
            if ( $L eq $l ) {    # uppercase
                if ( $hash{$L} !~ /U/ ) {
                    $hash{$L} .= 'U';
                }
            }
            else {               # lowercase
                if ( $hash{$L} !~ /L/ ) {
                    $hash{$L} .= 'L';
                }
            }
        }
    }
    my @contenders =
        grep { length $hash{$_} == 2 }
        sort { $b cmp $a }
        keys %hash;
    return @contenders ? shift @contenders : '';
}
```

```text
$ ./ch-1.pl
    Input:  $str = "PeRlwEeKLy"
    Output: "L"

    Input:  $str = "ChaLlenge"
    Output: "L"

    Input:  $str = "The"
    Output: ""
```

### Task 2: Target Array

> Submitted by: Mohammad Sajid Anwar
>
> You are given two arrays of integers, `@source` and `@indices`. The @indices can only contains integers `0 <= i < size of @source`.
>
> Write a script to create target array by insert at index `$indices[i]` the value `$source[i]`.

#### Let's Talk About It

This forced me to learn `splice`, which I literally have never done before. I have played with splices, like `@array = @array[0..3], 8 , @array[4..8]`, but not using the `splice` function, which clearly makes things _so_ much easier.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @examples = (
    { source => [ 0, 1, 2, 3, 4 ], indices => [ 0, 1, 2, 2, 1 ] },
    { source => [ 1, 2, 3, 4, 0 ], indices => [ 0, 1, 2, 3, 0 ] },
    { source => [1],               indices => [0] },
    { source => [ 9, 0, 1, 2, 5 ], indices => [ 2, 1, 1, 2, 0 ] },
);

for my $example (@examples) {
    my @output  = target_array($example);
    my $output  = join ', ', @output;
    my $source  = join ', ', $example->{source}->@*;
    my $indices = join ', ', $example->{indices}->@*;

    say <<"END";
        Input: \@source  = ($source)
               \@indices = ($indices)
        Output: [ $output ]
END
}

sub target_array ($obj) {
    my @source  = $obj->{source}->@*;
    my @indices = $obj->{indices}->@*;
    my @target;
    for my $k ( 0 .. $#source ) {
        my $s = $source[$k];
        my $i = $indices[$k];
        if ( defined $target[$i] ) {
            splice( @target, $i, 1, $s, $target[$i] );
        }
        else {
            splice( @target, $i, 1, $s );
        }
    }
    return @target;
}
```

```text
$ ./ch-2.pl

        Input: @source  = (0, 1, 2, 3, 4)
               @indices = (0, 1, 2, 2, 1)
        Output: [ 0, 4, 1, 3, 2 ]

        Input: @source  = (1, 2, 3, 4, 0)
               @indices = (0, 1, 2, 3, 0)
        Output: [ 0, 1, 2, 3, 4 ]

        Input: @source  = (1)
               @indices = (0)
        Output: [ 1 ]

        Input: @source  = (9, 0, 1, 2, 5)
               @indices = (0, 1, 2, 1, 2)
        Output: [ 9, 2, 5, 0, 1 ]
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
