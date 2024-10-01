---
layout: post
title: "Irregular Use of Regular Expressions: Weekly Challenge #289"
author: "Dave Jacoby"
date: "2024-10-01 14:56:04 -0400"
categories: ""
---

Welcome to [**_Weekly Challenge #289!_**](https://theweeklychallenge.org/blog/perl-weekly-challenge-289/) **289** is a perfect square of a prime number (**17<sup>2</sup>**). It is also an Area Code for southern Canada, covering the Toronto area.

### Task 1: Third Maximum

> Submitted by: Mohammad Sajid Anwar  
> You are given an array of integers, `@ints`.
>
> Write a script to find the third distinct maximum in the given array. If third maximum doesn’t exist then return the maximum number.

#### Let's Talk About It!

So, we sort `@ints` high-to-low and remove duplicates. If there are three entries, we return the third value, but if not, return the first. I again avail myself of `uniq` from [List::Util](https://metacpan.org/pod/List::Util).

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use List::Util qw{ uniq };

my @examples = (

    [ 5, 6, 4, 1 ],
    [ 4, 5 ],
    [ 1, 2, 2, 3 ],

);

for my $example (@examples) {
    my $output = third_maximum( $example->@* );
    my $input  = join ', ', $example->@*;
    say <<"END";
    Input:  \$ints = ($input)
    Output: $output
END
}

sub third_maximum (@array) {
    my @new = reverse uniq sort @array;
    return $new[2] if defined $new[2];
    return shift @new;
}
```

```text
$ ./ch-1.pl
    Input:  $ints = (5, 6, 4, 1)
    Output: 4

    Input:  $ints = (4, 5)
    Output: 5

    Input:  $ints = (1, 2, 2, 3)
    Output: 1
```

#### Padding The Commentary

I always [tidy](https://metacpan.org/dist/Perl-Tidy/view/lib/Perl/Tidy.pod) my code, and I've come up with a specific and ideosyncratic `.perltidyrc`, which I started by copying the one in _Perl Best Practices_.

The problem, to me, is that the PBP version used the shortened version, and that seemed like not commenting your code. Do you trust yourself to understand what `-cti=0` means after not editing or changing your settings for a year or three?

```perl
# Dave's perltidyrc

--indent-columns=4
--continuation-indentation=4
--maximum-line-length=78

--noopening-sub-brace-on-new-line
--backup-and-modify-in-place

--standard-output
--standard-error-output

--output-line-ending=unix
```

### Task 2: Jumbled Letters

> Submitted by: Ryan Thompson
> An Internet legend dating back to at least 2001 goes something like this:
>
> > _Aoccdrnig to a rscheearch at Cmabrigde Uinervtisy, it deosn’t mttaer in waht oredr the ltteers in a wrod are, the olny iprmoetnt tihng is taht the frist and lsat ltteer be at the rghit pclae. The rset can be a toatl mses and you can sitll raed it wouthit porbelm. Tihs is bcuseae the huamn mnid deos not raed ervey lteter by istlef, but the wrod as a wlohe._
>
> This supposed Cambridge research is unfortunately an urban legend. However, the effect has been studied. For example—and with a title that probably made the journal’s editor a little nervous—_Raeding wrods with jubmled lettres: there is a cost_ by Rayner, White, et. al. looked at reading speed and comprehension of jumbled text.
>
> Your task is to write a program that takes English text as its input and outputs a jumbled version as follows:
>
> 1. The first and last letter of every word must stay the same
> 1. The remaining letters in the word are scrambled in a random order (if that happens to be the original order, that is OK).
> 1. Whitespace, punctuation, and capitalization must stay the same
> 1. The order of words does not change, only the letters inside the word
>
> So, for example, “Perl” could become “Prel”, or stay as “Perl,” but it could not become “Pelr” or “lreP”.

#### Let's Talk About It!

It struck me that the easiest way to handle this would be to use regular expressions.

> "Some people, when confronted with a problem, think "I know, I'll use regular expressions." Now they have two problems."
>
> **— Jamie Zawinski**

I am convinced that a _lot_ of the bad opinion people have of Perl comes from looking at regular expressions and not getting it. Of course, a lot comes from people writing Perl Golf and optimizing for length and not clarity. I have _never_ liked that.

Anyway, I know I have a problem, which is to find every word, so I can do something about it. Lets match that pattern!

> `s/(\w+)//`

That's a start, but then we have to the complex part of separating out the first and last letter within the function.

> `s/\w(\w+)\w//`

That's good, but now we've lost those first and last letters. Let's match them too!

> `s/(\w)(\w+)(\w)//`

Let us plant some flags now. Because Perl Best Practices, I generally set a few flags on my regexes. 

* `/x` extends formatting, so you can, for example, comment your regex
* `/m` extends the boundaries of `^` and `$` to the string, not the line
* `/i` makes the match case sensitive, which isn't so important here, but I generally throw it in, in case I forget and change the regex later
* `/g` makes the match global, so that the code runs on each match, not just the first
* `/e` is the most important one, because that evaluates the replacement section of the regex, which usually is questionable, but here, it makes it so we can send the match to a function.

> `s/(\w)(\w+)(\w)//gmex`

That's all well and good, but now we have to do something. Each match gets a `$number` variable, the first being `$1`, etc. This gets evaluated, so instead of formatting it like text, we format it like code.

> `s/(\w)(\w+)(\w)/ $1 . jumble_letters( $2 ) . $3 /gmex`

And then there's the actual randomization work, and you can use `sort` for that. `sort { $a <=> $b }` sorts things numerically, so, instead of two real values within the block, add some random numbers, like `sort { rand 10 <=> rand 10 }`. I'm using standard `split` and `join` to break the string into a list and restringifying it.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use List::Util qw{ min max };

my @examples = (

    'Perl is different. In a nutshell, Perl is designed to make
the easy jobs easy, without making the hard jobs impossible.',

    'According to Larry Wall(1), the original author of the Perl
programming language, there are three great virtues of a
programmer; Laziness, Impatience and Hubris.',

    q{If you haven't used regular expressions before, a tutorial
introduction is available in perlretut. If you know just a
little about them, a quick-start introduction is available
in perlrequick.},

    'THIS looks like a job for RECURSION!',
);

for my $input (@examples) {
    my $output = $input;
    $output =~ s{(\w)(\w+)(\w)}{ $1 . jumble_letters( $2 ) . $3 }gmxe;

    say $input;
    say '-----';
    say $output;
    say '';
}

sub jumble_letters ($str) {
    $str = join '', sort { rand 10 <=> rand 10 }
        split //, $str;
    return $str;
}
```

```text
$ ./ch-2.pl
Perl is different. In a nutshell, Perl is designed to make
the easy jobs easy, without making the hard jobs impossible.
-----
Prel is dnfeeirft. In a nheltsul, Prel is desneigd to make
the esay jobs esay, whoiutt making the hrad jbos iosbsplime.

According to Larry Wall(1), the original author of the Perl
programming language, there are three great virtues of a
programmer; Laziness, Impatience and Hubris.
-----
Acocrndig to Lrary Wlal(1), the oaniirgl atouhr of the Prel
pirnmmagrog lgungaae, terhe are tehre garet verutis of a
pgarrmeomr; Laesnizs, Itmaepicne and Hribus.

If you haven't used regular expressions before, a tutorial
introduction is available in perlretut. If you know just a
little about them, a quick-start introduction is available
in perlrequick.
-----
If you hevan't uesd rlaegur eionesspxrs brfoee, a ttiuarol
idiutcoontrn is albvaaile in peletrrut. If you know jsut a
ltilte aubot them, a qcuik-start iodcrtiutnon is allaviabe
in pcilueqrrek.

THIS looks like a job for RECURSION!
-----
THIS lkoos lkie a job for ROISRUECN!

```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
