---
layout: post
title: "Not Really Ready For Funny Titles: Weekly Challenge #315"
author: "Dave Jacoby"
date: "2025-04-03 21:46:04 -0400"
categories: ""
---

Welcome to [Weekly Challenge #315.](https://theweeklychallenge.org/blog/perl-weekly-challenge-315/) I try to make the introduction to each entry amusing and informational, but I just don't feel it this week. Sorry.

### Task 1: Find Words

> Submitted by: Mohammad Sajid Anwar  
> You are given a list of words and a character.>
>
> Write a script to return the index of word in the list where you find the given character.

#### Let's Talk About It

This is the most simple, given the correct subset of Perl knowledge. Create an array of valid indexes of each array. Search each word, addressed by that array, for the character in question with a simple regular expression. If it passes, pass that value. I use `grep` for this. Without `grep`, it becomes more complex, but as is, there's pulling the values into variables and `return grep { $list[$_] =~ /$char/ } 0 .. $#list;`

If anyone is looking for a Perl guy, contact me.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

my @examples = (
    {
        list => [ "the", "weekly", "challenge" ],
        char => "e",
    },
    {
        list => [ "perl", "raku", "python" ],
        char => "p",
    },
    {
        list => [ "abc", "def", "bbb", "bcd" ],
        char => "b",
    },
);

for my $example (@examples) {
    my $list   = join ',', map { qq{"$_"} } $example->{list}->@*;
    my $char   = $example->{char};
    my @output = find_words($example);
    my $output = join ', ', @output;
    say <<"END";
    Input:  \@list = ($list)
            \$char = "$char"
    Output: ($output)
END
}

sub find_words ($obj) {
    my @list = $obj->{list}->@*;
    my $char = $obj->{char};
    return grep { $list[$_] =~ /$char/ } 0 .. $#list;
}
```

```text
$ ./ch-1.pl 
    Input:  @list = ("the","weekly","challenge")
            $char = "e"
    Output: (0, 1, 2)

    Input:  @list = ("perl","raku","python")
            $char = "p"
    Output: (0, 2)

    Input:  @list = ("abc","def","bbb","bcd")
            $char = "b"
    Output: (0, 2, 3)
```

### Task 2: Find Third

> Submitted by: Mohammad Sajid Anwar  
> You are given a sentence and two words.
>
> Write a script to return all words in the given sentence that appear in sequence to the given two words.

#### Let's Talk About It

Every sentence becomes an array, split on newlines. Come to words like `won't` and it can become a bit weird, but in the examples given, we can split on `not a word character`, or `\W`.

From there, we're testing characters. `$array[$i]` should equal `$first`, `$array[$i+1]` should equal `$second` and `$array[$i+2]` should exist, so it can be pushed into the output array.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

my @examples = (
    {
        sentence =>
            "Perl is a my favourite language but Python is my favourite too.",
        first  => "my",
        second => "favourite",
    },
    {
        sentence =>
            "Barbie is a beautiful doll also also a beautiful princess.",
        first  => "a",
        second => "beautiful",
    },
    {
        sentence => "we will we will rock you rock you.",
        first    => "we",
        second   => "will",
    }
);

for my $example (@examples) {
    my @output = find_third($example);
    my $output = join ', ', map { qq{"$_"} } @output;
    my ( $first, $second, $sentence ) =
        map { $example->{$_} } qw{ first second sentence };
    say <<"END";
    Input:  \$sentence = "$sentence"
            \$first = "$first"
            \$second = "$second"
    Output: ($output)
END
}

sub find_third ($obj) {
    my @output;
    my ( $first, $second, $sentence ) =
        map { $obj->{$_} } qw{ first second sentence };
    my @sentence = split /\W+/, $sentence;
    for my $i ( 0 .. $#sentence ) {
        if (   $sentence[$i] eq $first
            && $sentence[ $i + 1 ] eq $second
            && defined $sentence[ $i + 2 ] )
        {
            push @output, $sentence[ $i + 2 ];
        }
    }
    return @output;
}
```

```text
$ ./ch-2.pl 
    Input:  $sentence = "Perl is a my favourite language but Python is my favourite too."
            $first = "my"
            $second = "favourite"
    Output: ("language", "too")

    Input:  $sentence = "Barbie is a beautiful doll also also a beautiful princess."
            $first = "a"
            $second = "beautiful"
    Output: ("doll", "princess")

    Input:  $sentence = "we will we will rock you rock you."
            $first = "we"
            $second = "will"
    Output: ("we", "rock")
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
