---
layout: post
title: "Comparing Two Lists"
author: "Dave Jacoby"
date: "2019-05-24 10:48:23 -0400"
categories: ""
---

[Olaf Alders](https://twitter.com/olafalders/) demonstrated [creating a Twitter list of CPAN authors](http://www.olafalders.com/2019/05/23/creating-a-twitter-list-of-cpan-authors/), using a tool simply named [`t`](https://github.com/sferik/t). That someone make such a good all-in-one Twitter tool while my scripts are in an un-unified state gives me some small amount of shame, but that's not why I'm writing.

His list comes from [MetaCPAN](https://metacpan.org/) and [`MetaCPAN::Client`](https://metacpan.org/pod/MetaCPAN::Client). I have created another list over time, containing developers and organizations that use Perl but may not tweet primarily about it, much less contribute to CPAN. I compared the lists to see who I should pay attention to but don't, but that isn't why I'm writing.

I'm writing because I used `t` to get his list and my list, and there is an easy way to compare two lists in Perl.

[`List::Compare`](https://metacpan.org/pod/List::Compare).

Give `List::Compare` two arrayrefs and you can get back:

- **Union:** the entries in both list
- **Intersection:** The entries that both lists share
- **Unique:** The entries only in the first list
- **Complement:** The entries only in the second list

I prepared this infographic.

![Quick Visual Guide to List::Compare](https://jacoby.github.io/images/list_compare.jpg)

I pulled the list membership with [`t list members olafalders/cpan-authors`](https://twitter.com/olafalders/lists/cpan-authors) and [`t list members jacobydave/perl`](https://twitter.com/jacobydave/lists/perl), put them into files, and used the following code to give me who is in both, who is just in Olaf's and who is just in mine.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings qw{ experimental::postderef experimental::smartmatch experimental::signatures };

use List::Compare;

my @dave = open_and_dump('dave_perl');
my @olaf = open_and_dump('olaf_perl');

my $lc = List::Compare->new( \@dave, \@olaf );

say join "\n\t", q{INTERSECTION},
    sort { lc $a cmp lc $b } $lc->get_intersection;
say join "\n\t", q{UNIQUE (Dave)}, sort { lc $a cmp lc $b } $lc->get_unique;
say join "\n\t", q{COMPLEMENT (Olaf)},
    sort { lc $a cmp lc $b } $lc->get_complement;

sub open_and_dump($filename) {
    if ( -f $filename && open my $fh, '<', $filename ) {
        my @arr =
            map { chomp; $_ } <$fh>;
        return @arr;
    }
}
```

I won't put that list here, because it's _so_ easy to make your own and time will change both lists, but the number of lines of code dedicated to playing with lists is smaller than the number of lines dedicated to file reading. This is compact and readable, and oh so cool. So, try `List::Compare`.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
