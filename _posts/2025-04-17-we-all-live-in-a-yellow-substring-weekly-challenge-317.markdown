---
layout: post
title: "We All Live In A Yellow Substring: Weekly Challenge #317"
author: "Dave Jacoby"
date: "2025-04-17 14:27:26 -0400"
categories: ""
---

### Task 1: Acronyms

> Submitted by: Mohammad Sajid Anwar  
> You are given an array of words and a word.
>
> Write a script to return `true` if concatenating the first letter of each word in the given array matches the given word, return `false` otherwise.

#### Let's Talk About It!

So, we want to deal with every element in an array. `map {...} @array`

And we want to get the first character. `substr( $string, 0, 1 )`

And we want to join everything into a string. `join '', @array`

And we want to compare that string with another string. `$i eq $j`

And we want to return `true` or `false`. `return $i eq $j ? 'true' : 'false'`

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

my @examples = (

    {
        array => [ "Perl", "Weekly", "Challenge" ],
        word  => "PWC",
    },
    {
        array => [ "Bob", "Charlie", "Joe" ],
        word  => "BCJ",
    },
    {
        array => [ "Morning", "Good" ],
        word  => "MM",
    },
);

for my $example (@examples) {
    my $array  = join ', ', map { qq{"$_"} } $example->{array}->@*;
    my $word   = $example->{word};
    my $output = acronyms($example);
    say <<"END";
    Input:  \@array = ($array)
            \$word  = "$word"
    Output: $output
END
}

sub acronyms ($example) {
    my @array   = $example->{array}->@*;
    my $word    = $example->{word};
    my $acronym = join '', map { substr $_, 0, 1 } $example->{array}->@*;
    return $word eq $acronym ? 'true' : 'false';
}
```

```text
$ ./ch-1.pl
    Input:  @array = ("Perl", "Weekly", "Challenge")
            $word  = "PWC"
    Output: true

    Input:  @array = ("Bob", "Charlie", "Joe")
            $word  = "BCJ"
    Output: true

    Input:  @array = ("Morning", "Good")
            $word  = "MM"
    Output: false
```

### Task 2: Friendly Strings

> Submitted by: Mohammad Sajid Anwar
> You are given two strings.
>
> Write a script to return `true` if swapping any two letters in one string match the other string, return `false` otherwise.

#### Let's Talk About It!

Did we really need to make this challenge PG-rated?

I really thought about sorting both strings alphabetically, but that doesn't _really_ tell us anything. Consider `gins` and `sign`. So we have a two-loop solution where the second loop starts one after the first loop. I Think that's **O(nlogn)**.

And I think we can talk here about [**lvalue**](https://perldoc.perl.org/perlsub#Lvalue-subroutines) functions, which I haven't done in a while. Most functions can assign (`$x = function($y)`) but with an lvalue function, you can assign to it (`function($y) = $x`). `substr` is my most-used lvalue function. We can read from `substr`, but we can also write to `substr`. That makes it possible to write `substr($string2,$i,1) = substr($string1,$j,1)`. There's not a lot of places where I use this, but it is good to have it available.

And we get down to a design where we default to `false` while going through and finding the `true` case.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

my @examples = (

    [qw{desc dsec}],
    [qw{fuck fcuk}],
    [qw{poo eop}],
    [qw{stripe sprite}],
);

for my $example (@examples) {
    my ( $str1, $str2 ) = $example->@*;
    my $output = friendly_strings($example);
    say <<"END";
    Input:  \$str1 = "$str1",
            \$str2 = "$str2"
    Output: $output
END
}

sub friendly_strings ($example) {
    my ( $str1, $str2 ) = $example->@*;
    my $l = -1 + length $str1;
    for my $i ( 0 .. $l ) {
        for my $j ( $i + 1 .. $l ) {
            my $str1b = $str1;
            substr( $str1b, $i, 1 ) = substr( $str1, $j, 1 );
            substr( $str1b, $j, 1 ) = substr( $str1, $i, 1 );
            return 'true' if $str1b eq $str2;
        }
    }
    return 'false';
}
```

```text
$ ./ch-2.pl
    Input:  $str1 = "desc",
            $str2 = "dsec"
    Output: true

    Input:  $str1 = "fuck",
            $str2 = "fcuk"
    Output: true

    Input:  $str1 = "poo",
            $str2 = "eop"
    Output: false

    Input:  $str1 = "stripe",
            $str2 = "sprite"
    Output: true
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
