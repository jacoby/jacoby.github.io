---
layout: post
title: "Why Is This Interesting? Weekly Challenge #280"
author: "Dave Jacoby"
date: "2024-07-29 15:35:49 -0400"
categories: ""
---

Welcome to **[Weekly Challenge #280!](https://theweeklychallenge.org/blog/perl-weekly-challenge-280/)**

It's been a few challenges since I actually wrote up my answer, and that is, in part, because I'm not seeing my answers as novel. My "Why is this interesting?" is entirely pointed at my solutions, just to be clear. I like engaging in these problems, but coming up with "Oh, _this_ is easily solved with this CPAN module" or whatever doesn't always seem helpful.

And I guess that's a testament to Perl. "Easy things should be easy, and hard things should be possible", and Perl makes so much easy.

So, maybe the answer is to come up with harder and sillier solutions? Or maybe I should switch to another language? 

Or, alternately, I'm writing things that don't interest me, as a person who is rapidly approaching 30 years as a Perl developer, and that there are possibly people who can benefit from these posts.

Questions, comments and hoots of dirision can be sent via the links in the footer.

### Task 1: Twice Appearance

> Submitted by: Mohammad Sajid Anwar  
> You are given a string, `$str`, containing lowercase English letters only.
>
> Write a script to print the first letter that appears twice.

#### Let's Talk About It

This is a challenge that falls right in line with what I normally do. I split the string (`split //, $str`) rather than use an index and `substr` because as a developer, it's faster for me to deal with the array. I bet it's faster to use substrings, but that you'd need many longer strings for it to be noticable.

And I use a hash to keep track if a letter has been used twice.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ bitwise fc postderef say signatures state };

my @examples = (

    qw{
        acbddbca
        abccd
        abcdabbb
    },
);

for my $example (@examples) {
    my $output  = twice_appearance($example);
    say <<"END";
    Input:  \@str = "$example"
    Output: "$output"
END
}

sub twice_appearance ($input) {
    my $hash;
    for my $i ( split //, $input ) {
        $hash->{$i}++;
        return $i if $hash->{$i} > 1;
    }
    return '';
}
```

```text

```

### Task 2: Count Asterisks

> Submitted by: Mohammad Sajid Anwar
> You are given a string, `$str`, where every two consecutive vertical bars are grouped into a pair.
>
> Write a script to return the number of asterisks, `*`, excluding any between each pair of vertical bars.

#### Let's Talk About It

In writing it up, it strikes me that anything but a pipe and an asterisk is immaterial, so it would be a good start to do a regular expression like `s/[^\|\*]//gmix` and clear it all out. I don't do that. Instead, I use a greedy query and pull out the pairs, then do a match on asterisk and listify the results. I have used `mix` as my standard for regular expressions for years (thank you, Damian Conway), but I often fail to comment the regular expression, even though I can. Both pieces of clever are below.

I think `scalar grep {/\*/} split //, $str` is probably a bit more me, but once I decided I wanted to do the match game, I guess I needed to listify my **BLANK**.

(If you're an old person who watched 80s game shows, you get that.)

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ fc say postderef signatures state };

my @examples = (

    'p|*e*rl|w**e|*ekly|',
    'perl',
    'th|ewe|e**|k|l***ych|alleng|e',

);

for my $input (@examples) {
    my $output = count_asterisks($input);

    say <<"END";
    Input:  \$str = "$input"
    Output: $output
END
}

sub count_asterisks ($str) {
    $str =~ s{
                # if we can comment a regex, we probably should
        \|      # a pipe character
        [^\|]*  # zero or more non-pip characters
        \|      # a pipe character
        }{  }gmix;

    # the = () = forces it into a list context, and
    # otherwise you'd get a boolean result.
    my $c = () = $str =~ /(\*)/gmix;
    return $c;
}


```

```text

```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
