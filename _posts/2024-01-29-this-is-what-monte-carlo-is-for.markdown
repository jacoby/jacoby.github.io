---
layout: post
title: "This is what Monte Carlo is for!"
author: "Dave Jacoby"
date: "2024-01-29 13:54:50 -0500"
categories: ""
---

This comes from *[Retirement Plan](https://www.imdb.com/title/tt14827638/)*, a 2023 action comedy starring Nicolas Cage as a former government operative, retired and in the Cayman Islands, who get brought into trouble when his daughter and granddaughter are threatened.

In one scene, a hitman, played by Ron Perlman, is talking to Cage's granddaughter, played by Thalia Campbell. She's playing craps and he's explaining the rules, that she gets to keep rolling until she rolls a seven.

My wife comments that 7 is a pretty random number to choose. I, a gamer and programmer, said it isn't. If you randomly choose two numbers between 1 and 6, they're more likely to add up to seven than anything else. The fact that the opposite sides of dice add up to the number of sides plus 1 (normally; sometimes people make 'em wrong) shows this.

And, after recent Weekly Challenges, I was primed for some Monte Carlo method to prove my point, so I wrote some code that played craps a million times and proved it.

```text
$ ./craps.pl 
2        27624    2.8%  ##
3        55500    5.5%  #####
4        83135    8.3%  ########
5       111291   11.1%  ###########
6       139325   13.9%  #############
7       166944   16.7%  ################
8       139125   13.9%  #############
9       110820   11.1%  ###########
10       82973    8.3%  ########
11       55408    5.5%  #####
12       27855    2.8%  ##
```

**Boxcars** (6 + 6 = 12) is only achievable one way and appears 2.8% of the time. **Snake-eyes** (1 + 1 = 2) is only achievable one way and appears 2.8% of the time. A **seven** is achievable six ways (1 + 6, 2 + 5, 3 + 4, 4 + 3, 5 + 2, 6 + 1), and 2.8 * 6 equals 16.8, which is close enough to the result we get. A sixth of all rolls, statistically speaking, should be a seven.

But I suppose I should be like C3PO with Han Solo, and never tell you the odds...

#### Show Me The Code!

```perl
#!/usr/bin/env perl
use strict;
use warnings;
use experimental qw{ say signatures state fc };
use List::Util   qw{ sum0 };

my $top = 1_000_000;
my $hash;
for my $i ( 1 .. $top ) {
    my $d = sum0 map { d6() } 1 .. 2;
    $hash->{$d}++;
}
for my $k ( sort { $a <=> $b } keys $hash->%* ) {
    my $v   = sprintf '%6d',   $hash->{$k};
    my $p   = sprintf '%5.1f', 100 * $v / $top;
    my $bar = '#' x $p;
    say join "\t", $k, $v, ( $p . '%' ), $bar,;
}
sub d6 { return 1 + int rand 6 }
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
