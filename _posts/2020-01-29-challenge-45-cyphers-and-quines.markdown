---
layout: post
title: "Challenge 45: Cyphers and Quines"
author: "Dave Jacoby"
date: "2020-01-29 13:45:53 -0500"
categories: ""
---

## Challenge 1

> The square secret code mechanism first removes any space from the original message. Then it lays down the message in a row of 8 columns. The coded message is then obtained by reading down the columns going left to right.
>
> For example, the message is “The quick brown fox jumps over the lazy dog”.
>
> Then the message would be laid out as below:

```text
thequick
brownfox
jumpsove
rthelazy
dog
```

> The code message would be as below:

```text
tbjrd hruto eomhg qwpe unsl ifoa covz kxey
```

> Write a script that accepts a message from command line and prints the equivalent coded message.

So, to me, much of this involves things I've use and I think talked about here before, like using regexes and `lc` to remove the things you can't use, `substr` to handle parts of a string, and `@ARGV` to take in input from the command line.

The key for me is to put the plaintext into an array, and instead of going `[0][0]`,`[0][1]`, go `[0][0]`,`[1][0]`. I considered using `substr` or a regex to remove the first letter from every string, but making a two-dimensional array seemed better to me.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures };
no warnings qw{ experimental::postderef experimental::signatures };

use JSON;
my $json = JSON->new;

my $string = 'The quick brown fox jumps over the lazy dog';

my $input = scalar @ARGV ? join ' ', @ARGV : $string;

my $code = encypher($input);
say $code;

sub encypher ( $plaintext ) {
    $plaintext = lc $plaintext;
    $plaintext =~ s/[^a-z]//gmx;
    my @work;

    while ( length $plaintext >= 8 ) {
        my $eight = substr $plaintext, 0,8;
        $plaintext =~ s/\w{8}//mix;
        push @work, $eight;
    }
    push @work, $plaintext;

    my @cyphertext;

    for my $i ( 0 .. scalar @work - 1 ) {
        my $word = $work[$i];
        for my $j ( 0 .. length $word ) {
            my $letter = substr $word, $j,1;
            next unless scalar $letter;
            $cyphertext[$j][$i] = $letter;
        }
    }

    return join ' ', map { join '', $_->@* } @cyphertext;
}
```

## Challenge 2

> Write a script that dumps its own source code. For example, say, the script name is **ch-2.pl** then the following command should returns nothing.
> 
> `$ perl ch-2.pl | diff - ch-2.pl`

The term for such programs is a [_Quine_](https://en.wikipedia.org/wiki/Quine_(computing)). I've thought about them and discussed them, even suggesting a JS program hidden in a QR code that, when when run, creates the QR code that it is hidden in.

In _this_ case, however, I decided that the thing to use is `$0`, which contains the program name.

```perl
#!/usr/bin/env perl

use strict;
use warnings;

use Cwd qw{abs_path};

my $file = abs_path($0);
if ( -f $file && open my $fh, '<', $file ) {
    print join '', <$fh>;
}
```

But reading the Quine page in Wikipedia makes me think that I'm not working hard enough. I'll submit this and supplement if I gain enlightenment before the end of the week.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
