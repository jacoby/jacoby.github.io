---
layout: post
title:  "Split String Soup: Weekly Challenge #253"
author: "Dave Jacoby"
date:   "2024-01-22 16:02:48 -0500"
categories: ""
---

Welcome to **[Weekly Challenge #253](https://theweeklychallenge.org/blog/perl-weekly-challenge-253/)** **253** is the product of two primes, **11** and **23**, and thus it's a [semiprime](https://en.wikipedia.org/wiki/Semiprime) number. It is a Triangle Number, and I wrote some code to generate the triangle and show everyone what it means.

```text
$  triangle_number.pl -n 22
43
                     *
                    * *
                   * * *
                  * * * *
                 * * * * *
                * * * * * *
               * * * * * * *
              * * * * * * * *
             * * * * * * * * *
            * * * * * * * * * *
           * * * * * * * * * * *
          * * * * * * * * * * * *
         * * * * * * * * * * * * *
        * * * * * * * * * * * * * *
       * * * * * * * * * * * * * * *
      * * * * * * * * * * * * * * * *
     * * * * * * * * * * * * * * * * *
    * * * * * * * * * * * * * * * * * *
   * * * * * * * * * * * * * * * * * * *
  * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * *
* * * * * * * * * * * * * * * * * * * * * *
length of side: 22
number of dots: 253
```

### Task 1: Split Strings
>
> Submitted by: Mohammad S Anwar  
> You are given an array of strings and a character separator.  
>
> Write a script to return all words separated by the given character excluding empty string.  

#### Let's Talk About It

Often, there's one thing that's the key to the assignment. Here, that key is putting variables within a regular expression, especially in the cases given, where there's meaning. `$` in a regular expression marks the end of a string, and `.` will match any character.

What's the solution? [`quotemeta`](https://perldoc.perl.org/functions/quotemeta).

I've been a Perl developer for decades and never had need for this. I think there must've been a case where I put a variable into a regular expression, but it must've been few and controlled. `/$regex/` is a code red flag for me, so it took a while to find and understand it.

But otherwise, `map { split /$regex/, $_ }` grows the array, so you're getting `"a", "b", "c", "d", "e"` instead of something like  `"a", "b", [ "c", "d" ], "e"`, and once I have done the splitting, cases like `$perl$$` being split with `$` would have resulted in `[ "", "perl", "", "",]`, so using `grep { length $_ }` to ensure that each string isn't zero-length gives us an array with no empty entries.

I'm sure I could have written something like `return grep { length $_ } map { split /$sep/, $_ }  $hash->{words}->@*` to really shorten the code, but I like breaking it up so I can print the parts during assembly.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ sum0 };

my @examples = (

    {
        words     => [ "one.two.three", "four.five", "six" ],
        separator => ".",
    },
    {
        words     => [ '$perl$$', '$$raku$' ],
        separator => '$',
    },
    {
        words     => [qw{abracadabra}],
        separator => 'a',
    },
    {
        words     => [qw{Splits the string EXPR into a list of strings}],
        separator => 'i',
    }
);

for my $example (@examples) {
    my $input     = join ', ', map { qq{"$_"} } $example->{words}->@*;
    my @output    = split_strings($example);
    my $separator = $example->{separator};
    my $output    = join ', ', map { qq{"$_"} } @output;

    say <<~"END";
    Input:  \@words = ($input)
            \$separator = "$separator"
    Output: $output

    END
}

sub split_strings ($hash) {
    my $sep    = quotemeta( $hash->{separator} );
    my @words  = $hash->{words}->@*;
    my @output = grep { length $_ } map { split /$sep/, $_ } @words;
    return @output;
}
```

```text
$ ./ch-1.pl
Input:  @words = ("one.two.three", "four.five", "six")
        $separator = "."
Output: "one", "two", "three", "four", "five", "six"


Input:  @words = ("$perl$$", "$$raku$")
        $separator = "$"
Output: "perl", "raku"


Input:  @words = ("abracadabra")
        $separator = "a"
Output: "br", "c", "d", "br"


Input:  @words = ("Splits", "the", "string", "EXPR", "into", "a", "list", "of", "strings")
        $separator = "i"
Output: "Spl", "ts", "the", "str", "ng", "EXPR", "nto", "a", "l", "st", "of", "str", "ngs"
```

### Task 2: Weakest Row
>
> Submitted by: Mohammad S Anwar
> You are given an m x n binary matrix i.e. only 0 and 1 where 1 always appear before 0.
>
> A row i is weaker than a row j if one of the following is true:
>
> a) The number of 1s in row i is less than the number of 1s in row j.
> b) Both rows have the same number of 1 and i < j.
> Write a script to return the order of rows from weakest to strongest.

#### Let's Talk About It

I of course pulled out `pad` and `format_matrix` from previous matrix tasks. I'm sure we'll see them again.

We go through each row of the matrix (easy, and also a job for iteration(!)) and store the value of `sum0` from [List::Util](https://metacpan.org/pod/List::Util) in a hash. We sort the row indices numerically (because if `2` and `3` are equal, `2` goes first) and then again reversed but based on the `sum0`

(I've explained this, but `sum` errors when it finds an undefined value in the array it's summing, while `sum0` treats it as a zero, so `sum0` is a safer function and my go-to.)

I don't use functional means to generate `%rank`. I *have* written `my %hash; map {$hash{$_} = generate_value($_)} @source` or the like, but I do like expanding it out so the next time I look in, or when less experienced developers look into the solution, I have a greater chance of understanding the solution.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ max sum0 };

my @examples = (

    [
        [ 1, 1, 0, 0, 0 ],
        [ 1, 1, 1, 1, 0 ],
        [ 1, 0, 0, 0, 0 ],
        [ 1, 1, 0, 0, 0 ],
        [ 1, 1, 1, 1, 1 ]
    ],
    [ 
        [ 1, 0, 0, 0 ], 
        [ 1, 1, 1, 1 ], 
        [ 1, 0, 0, 0 ], 
        [ 1, 0, 0, 0 ] 
    ],
);

for my $input (@examples) {
    my @o      = weakest_row($input);
    my $output = join ', ', @o;
    my $matrix = format_matrix($input);

    say <<~"END";
    Input:  \$matrix = $matrix;
    Output: ($output)
    END
}

sub weakest_row ($matrix) {
    my %rank;
    for my $i ( 0 .. -1 + scalar $matrix->@* ) {
        my $r = $matrix->[$i];
        my $s = sum0 $r->@*;
        $rank{$i} = $s;
    }
    my @output = sort { $rank{$a} <=> $rank{$b} } sort keys %rank;
    return @output;
}

sub format_matrix ($matrix) {
    my $maxlen = max map { length $_ } map { $_->@* } $matrix->@*;
    my $output = join "\n                  ", '[', (
        map { qq{  [$_],} } map {
            join ',',
                map { pad( $_, 1 + $maxlen ) }
                $_->@*
        } map { $matrix->[$_] } 0 .. -1 + scalar $matrix->@*
        ),
        ']';
    return $output;
}

sub pad ( $str, $len = 4 ) { return sprintf "%${len}s", $str; }
```

```text
$ ./ch-2.pl
Input:  $matrix = [
                    [ 1, 1, 0, 0, 0],
                    [ 1, 1, 1, 1, 0],
                    [ 1, 0, 0, 0, 0],
                    [ 1, 1, 0, 0, 0],
                    [ 1, 1, 1, 1, 1],
                  ];
Output: (2, 0, 3, 1, 4)

Input:  $matrix = [
                    [ 1, 0, 0, 0],
                    [ 1, 1, 1, 1],
                    [ 1, 0, 0, 0],
                    [ 1, 0, 0, 0],
                  ];
Output: (0, 2, 3, 1)
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
