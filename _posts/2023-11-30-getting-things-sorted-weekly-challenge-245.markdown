---
layout: post
title:  "Getting Things Sorted: Weekly Challenge #245"
author: "Dave Jacoby"
date:   "2023-11-30 13:21:06 -0500"
categories: ""
---

This is [Weekly Challenge #245!](https://theweeklychallenge.org/blog/perl-weekly-challenge-245/) **245** is the product of **5 * 7 * 7**. It is also the part of the California Penal Code dealing with [Assault with a Deadly Weapon](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=245), and the [Country Code](https://en.wikipedia.org/wiki/Telephone_numbers_in_Guinea-Bissau) for [Guinea-Bissau](https://en.wikipedia.org/wiki/Guinea-Bissau).


### Task 1: Sort Language
>
> Submitted by: Mohammad S Anwar  
> You are given two array of languages and its popularity.  
>
> Write a script to sort the language based on popularity.  

#### Let's Talk About It

This looks an awful lot like [something I talked about before.](https://jacoby.github.io/javascript/2018/11/07/schwartzian-transforms-in-javascript.html) Consider the case where you have a number of usernames and real names, like `djacoby: David Jacoby`, and you had dozens of lines or more, and you wanted to sort by surname instead of username.

```perl
my @sorted = 
    map { $_->[1] }
    sort { $a->[0] cmp $b->[0] }
    map { 
        my $x = $_ ; my ($y) = reverse split /\s/, $_ ; [$y,$x] 
    } 
    @unsorted;
```

This is called a [Schwartzian Transform](https://en.wikipedia.org/wiki/Schwartzian_transform). [It's named after Randal Schwartz, but he didn't name it](https://www.perl.com/article/the-history-of-the-schwartzian-transform/), but rather adapted it from a technique from LISP. Of course it doesn't have to be userIDs. Here we go through the indexes to create an arrayref for each language, containing `name` and `popularity`, sort on `popularity`, then remove the `popularity` value again. This gives us .

It's easy once you get it, but being able to switch to that functional mindset in the first place is the hard part. Once you get there, this sort of transform will become a well-used part of your toolbox. Thank you, [Randal](http://www.stonehenge.com/merlyn/).

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

my @examples = (

    {
        lang       => [ 'perl', 'c', 'python' ],
        popularity => [ 2,      1,   3 ],
    },
    {
        lang       => [ 'c++', 'haskell', 'java' ],
        popularity => [ 1,     3,         2 ],
    },
);

for my $e (@examples) {
    my @output     = sort_language($e);
    my $output     = join ', ', map { qq{'$_'} } @output;
    my $lang       = join ', ', map { qq{'$_'} } $e->{lang}->@*;
    my $popularity = join ', ', $e->{popularity}->@*;

    say <<~"END";
    Input:  \@lang = ($lang)
            \@popularity = ($popularity)
    Output: ($output)
    END
}

sub sort_language ($input) {
    # it's best to read things from the bottom.
    return map { $_->[1] }                                              # stripping popularity and returning the list of names
        sort { $a->[0] <=> $b->[0] }                                    # sorting the arrayrefs by popularity
        map  { [ $input->{popularity}->[$_], $input->{lang}->[$_] ] }   # creating the arrayrefs
        0 .. -1 + scalar $input->{lang}->@*;                            # looping through the array indexes
}
```

```text
$ ./ch-1.pl
Input:  @lang = ('perl', 'c', 'python')
        @popularity = (2, 1, 3)
Output: ('c', 'perl', 'python')

Input:  @lang = ('c++', 'haskell', 'java')
        @popularity = (1, 3, 2)
Output: ('c++', 'java', 'haskell')
```

### Task 2: Largest of Three
>
> Submitted by: Mohammad S Anwar
> You are given an array of integers >= 0.
>
> Write a script to return the largest number formed by concatenating some of the given integers in any order which is also multiple of 3. Return -1 if none found.

#### Let's Talk About It

This is another all-variations problem, and this time, I went with [Algorithm::Combinatorics](https://metacpan.org/pod/Algorithm::Combinatorics), another non-Core module that does something that is occasionally very useful.

My first pass had me capturing and collecting everything into `@output` and sorting it from there, but instead, I set `$o` to -1 and increase it when I find a combination that's greater than it, and return `$o`, which will be either the highest compliant combination, or -1.

Algorithm::Combinatorics ( and tools like it) allow you to set the number of values you use, so `90125` can get you `1920` or `250` or `21`. 

I use `0 + join '', $p->@*` because that non-math turns `0123` into `123`, which is just nicer.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use Algorithm::Combinatorics qw{ variations };

my @examples = (

    [ 8, 1, 9 ],
    [ 8, 6, 7, 1, 0 ],
    [1],
    [ 9, 0, 1, 2, 5 ]
);
for my $e (@examples) {
    my $input  = join ', ', $e->@*;
    my $output = largest_of_three( $e->@* );

    say <<~"END";
    Input:  \$input = ($input)
    Output:          $output
    END
}

sub largest_of_three (@input) {
    my $o = -1;
    for my $c ( reverse 1 .. scalar @input ) {
        my $iter = variations( \@input, $c );
        while ( my $p = $iter->next ) {
            my $combo = 0 + join '', $p->@*;
            next        if $combo % 3 != 0;
            $o = $combo if $combo > $o;
        }
    }
    return $o;
}
```

```text
$ ./ch-2.pl
Input:  $input = (8, 1, 9)
Output:          981

Input:  $input = (8, 6, 7, 1, 0)
Output:          8760

Input:  $input = (1)
Output:          -1

Input:  $input = (9, 0, 1, 2, 5)
Output:          9510
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
