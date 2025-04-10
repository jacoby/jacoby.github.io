---
layout: post
title: "Not Gonna Reference John: Weekly Challenge #316"
author: "Dave Jacoby"
date: "2025-04-10 18:32:24 -0400"
categories: ""
---

Welcome to [**Weekly Challenge #316!**](https://theweeklychallenge.org/blog/perl-weekly-challenge-316/)

### Task 1: Circular

> Submitted by: Mohammad Sajid Anwar  
> You are given a list of words.
>
> Write a script to find out whether the last character of each word is the first character of the following word.

#### Let's Talk About It

We're comparing the first character of one string with the last character of the previous string. This involves range from the second index to the last (`1 .. $#last`), the first letter of the current word (`substr $list[$i], 0, 1`), and the last letter of the previous word (`substr $list[$i-1], -1, 1`).

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

my @examples = (
    [ "perl", "loves", "scala" ],
    [ "love", "the",   "programming" ],
    [ "java", "awk",   "kotlin", "node.js" ],
);

for my $example (@examples) {
    my $output = circular( $example->@* );
    my $list   = join ',', map { qq{"$_"} } $example->@*;
    say <<"END";
    Input:  \@list = ($list)
    Output: $output
END
}

sub circular (@list) {
    for my $i ( 1 .. $#list ) {
        my $first = ( substr $list[$i], 0, 1 );
        my $last = ( substr $list[$i-1], -1, 1 );
        return 'false' unless $first eq $last;
    }
    return 'true';
}
```

```text
$ ./ch-1.pl
    Input:  @list = ("perl","loves","scala")
    Output: true

    Input:  @list = ("love","the","programming")
    Output: false

    Input:  @list = ("java","awk","kotlin","node.js")
    Output: true
```

### Task 2: Subsequence

> Submitted by: Mohammad Sajid Anwar  
> You are given two string.
>
> Write a script to find out if one string is a subsequence of another.
>
> A subsequence of a string is a new string that is formed from the original string by deleting some (can be none) of the characters without disturbing the relative positions of the remaining characters.

#### Let's Talk About It

This solution involves a lot of the same things, like `substr`. There's also the ternary operator (`return $i == $s ? 'true' : 'false'`).

We're looking for strings where certain letters occur in a specific order. For example, "**acb**" is within "j**ac**o**b**y". We loop through the first string, and each time the letters are the same, we iterate the index for the second array. If that index is the same number as the length of that string, then we return `true`, and if not, `false`.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

my @examples = (
    { str1 => "uvw", str2 => "bcudvew" },
    { str1 => "aec", str2 => "abcde" },
    { str1 => "sip", str2 => "javascript" },
);

for my $example (@examples) {
    my $str1   = $example->{str1};
    my $str2   = $example->{str2};
    my $output = subsequence($example);
    say <<"END";
    Input:  \$str1 = "$str1",
            \$str2 = "$str2"
    Output: $output
END
}

sub subsequence ($example) {
    my $i = 0;
    my $s = length $example->{str1};
    for my $j ( 0 .. -1 + length $example->{str2} ) {
        my $l1 = substr $example->{str1}, $i, 1;
        my $l2 = substr $example->{str2}, $j, 1;
        if ( $l1 eq $l2 ) { $i += 1; }
    }
    return $i == $s ? 'true' : 'false';
}
```

```text
$ ./ch-2.pl
    Input:  $str1 = "uvw",
            $str2 = "bcudvew"
    Output: true

    Input:  $str1 = "aec",
            $str2 = "abcde"
    Output: false

    Input:  $str1 = "sip",
            $str2 = "javascript"
    Output: true
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
