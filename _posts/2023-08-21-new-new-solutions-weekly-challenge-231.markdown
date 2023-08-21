---
layout: post
title:  "New New Solutions: Weekly Challenge #231"
author: "Dave Jacoby"
date:   "2023-08-21 12:19:12 -0400"
categories: ""
---

Welcome to [Weekly Challenge #231!](https://theweeklychallenge.org/blog/perl-weekly-challenge-231/) **231** is the product of three prime numbers, **3**, **7** and **1**. It is also the designator for a road in the US Highway System, [US 231](https://en.wikipedia.org/wiki/U.S._Route_231), which extends from the Florida Panhandle to just outside of Chicago in it's Indiana suburbs.

In the place I live, US 231 used to go through downtown and across a bridge. US highway development has a stage when it tries to go through towns, and when the traffic and the town are both large enough, it tries to bypass the town, and so then there were Old 231, which went through downtown, and 231, which connected to a road next to the river. For about a decade, I lived in a house very near Old 231.

Years later, they decided to fully and completely bypass the whole metropolitan area, and so they built a full-on four-lane divided highway from where I lived, past the school where I worked, to where it connected to another US highway.

So, where I live, there's Old 231, Old New 231, and New New 231. This has *nothing* to do with these programming puzzles, but it is exactly the main thing I think about when I see that number.

### Task 1: Min Max
>
> Submitted by: Mohammad S Anwar  
> You are given an array of distinct integers.  
>
> Write a script to find all elements that is neither minimum nor maximum. Return -1 if you can’t.  

#### Let's Talk About It

We start with needing to pull the min and max out of the array. The non-module way would be with something like `my @sorted = sort { $a <=> $b } @array`, with the specification because Perl defaults to alphabetic sort, and we could easily end up with `1, 11, 2, 3` which is *not* what we want. We would then do `my $min = shift @sorted` and `my $max = pop @sorted`.

I didn't do that. My go-to, [List::Util](https://metacpan.org/pod/List::Util), has `min` and `max` just to make that easier. From there, we have the wonders of functional programming working for us, and can simply grep away values that equal `$min` and `$max`.

Then, the big thing is to return -1 when you have an empty array and the array otherwise. One thing I like about terminators like `return` is that it saves you from having to do `else` statements.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw( min max );

my @examples = (

    [ 3, 2, 1, 4 ],
    [ 3, 1 ],
    [ 2, 1, 3 ],
);

for my $e (@examples) {
    my @input  = $e->@*;
    my $input  = join ', ', @input;
    my @output = not_min_max(@input);
    my $output;
    say join ' ', @output;
    if ( $output[0] == -1 ) {
        $output = $output[0];
    }
    else {
        $output = join ', ', @output;
        $output = qq{($output)};
    }
    say <<~"END";
    Input:  \@ints = ($input)
    Output: $output
    END
}

sub not_min_max (@array) {
    my $min    = min @array;
    my $max    = max @array;
    my @output = grep { $_ != $min } grep { $_ != $max } @array;
    return @output if @output;
    return -1;
}
```

```text
$  ./ch-1.pl 
3 2
Input:  @ints = (3, 2, 1, 4)
Output: (3, 2)

-1
Input:  @ints = (3, 1)
Output: -1

2
Input:  @ints = (2, 1, 3)
Output: (2)
```

### Task 2: Senior Citizens
>
> Submitted by: Mohammad S Anwar  
> You are given a list of passenger details in the form “9999999999A1122”, where 9 denotes the phone number, A the sex, 1 the age and 2 the seat number.  
>
> Write a script to return the count of all senior citizens (age >= 60).  

#### Let's Talk About It

It might've been easier to just pull the right subsection of the the form, but I elected to parse the whole thing. And since I was there, I also elected to use the `/x` of the default `/mx` that Chapter 12 of [Perl Best Practices](https://www.oreilly.com/library/view/perl-best-practices/0596001738/) suggests, which I used to do something I don't do enough, comment the regular expression to explain what I'm doing.

The big part of the task is reading the data, and I could imagine a number of ways to go, including `substr`, but I know enough about regexes to do it this way.

(Now, suddenly, I'm considering benchmarking `substr` vs regex to see if `substr` is significantly faster. I'm sure it's faster, but I don't know that it's fast enough for it to matter.)

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @examples = (

    [ "7868190130M7522", "5303914400F9211", "9273338290F4010" ],
    [ "1313579440F2036", "2921522980M5644" ],
);

for my $e (@examples) {
     my @input  = $e->@*;
     my $input = map { qq{"$_"} } @input;
     my $output = seniors( @input );
    say <<~"END";
    Input:  \@words = ($input)
    Output: $output
    END
}

sub seniors ( @input ) {
    my $count = 0 ;
    for my $passenger ( @input ) {
        my ( $phone, $gender, $age, $seat ) = 
            $passenger =~ m{
                ^           # the start of the data
                (\d{10})    # phone number is ten digits
                (\w)        # gender is one character
                (\d{2})     # age is two digits (rollover for older passengers?)
                (\d{2})     # seat number is two digits
                            # m{...}x allows for whitespace and comments
                            # so you can explain your regular expressions, 
                            # which is such a win
                $           # end of the line
                }mx;
        $count++ if $age >= 60;
    }
    return $count;
}
```

```text
$ ./ch-2.pl 
Input:  @words = (3)
Output: 2

Input:  @words = (2)
Output: 0
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
