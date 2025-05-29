---
layout: post
title: "Orders Matter and Order Matters: Weekly Challenge #323"
author: "Dave Jacoby"
date: "2025-05-29 15:42:41 -0400"
categories: ""
---

Top
logo
Home
About
Chart
Champions
Team
Challenges
Perl/Review
Raku/Review
Recaps
Blogs
FAQ
Contact
The Weekly Challenge - 323
Friday, May 16, 2025| Tags: Perl, Raku

TABLE OF CONTENTS

1. HEADLINES
2. SPONSOR
3. RECAP
4. PERL REVIEW
5. RAKU REVIEW
6. CHART
7. NEW MEMBERS
8. GUESTS
9. TASK #1: Increment Decrement
10. TASK #2: Tax Amount

HEADLINES
Welcome to the Week #323 of The Weekly Challenge.

Welcome aboard, Yitzchak Scott-Thoennes and thanks for your first contributions in Perl and Python.

We now have 324 members and 28 guests in Team PWC.

With some late contributions, Week #322, became the best week of the year 2025 so far.

Happy Hacking!!

Last 5 weeks mainstream contribution stats. Thank you Team PWC for your support and encouragements.

Week Perl Raku Blog  
 318 44 23 19  
 319 38 20 16  
 320 46 26 18  
 321 44 26 27  
 322 44 24 25

Last 5 weeks guest contribution stats. Thank you each and every guest contributors for your time and efforts.

Week Guests Contributions Languages  
 318 10 48 16  
 319 14 58 22  
 320 14 62 23  
 321 13 61 23  
 322 12 52 18

TOP 10 Guest Languages
Do you see your favourite language in the Top #10? If not then why not contribute regularly and make it to the top.

1.  Python (3386)
2.  Rust (910)
3.  Ruby (799)
4.  Haskell (777)
5.  Lua (724)
6.  C++ (617)
7.  C (590)
8.  JavaScript (562)
9.  Go (486)
10. BQN (440)

Blogs with Creative Title

1. Ordered Format Array by Adam Russell.
2. Stringed Array by Arne Sommer.
3. String Format by Bob Lied.
4. Dashing This Off by Dave Jacoby.
5. Group Ranking by Jorg Sommrey.
6. Splitting and Sorting by Luca Ferrari.
7. Ranking Code, Ranking Numbers by Matthias Muth.
8. The array is rank, but the string is formatted by Packy Anderson.
9. More strings and arrays by Peter Campbell Smith.
10. The Strings Are Rank by Roger Bell_West.
11. Strings and Arrays by Simon Green.

GitHub Repository Stats

1. Commits: 43,653 (+106)
2. Pull Requests: 12,064 (+38)
3. Contributors: 260 (+1)
4. Fork: 327 (+1)
5. Stars: 191 (+2)

SPONSOR
With start of Week #268, we have a new sponsor Lance Wicks until the end of year 2025. Having said we are looking for more sponsors so that we can go back to weekly winner. If anyone interested please get in touch with us at perlweeklychallenge@yahoo.com. Thanks for your support in advance.

RECAP
Quick recap of The Weekly Challenge - 322 by Mohammad Sajid Anwar.

PERL REVIEW
If you missed any past reviews then please check out the collection.

RAKU REVIEW
If you missed any past reviews then please check out the collection.

CHART
Please take a look at the charts showing interesting data.

I would like to THANK every member of the team for their valuable suggestions. Please do share your experience with us.

NEW MEMBERS
Yitzchak Scott-Thoennes, an expert Perl hacker joined the Team PWC.

Please find out How to contribute?, if you have any doubts.

Please try the excellent tool EZPWC created by respected member Saif Ahmed of Team PWC.

GUESTS
Please check out the guest contributions for the Week #322.

Please find past solutions by respected guests. Please share your creative solutions in other languages.

### Task 1: Increment Decrement

> Submitted by: Mohammad Sajid Anwar  
> You are given a list of operations.
>
> Write a script to return the final value after performing the given operations in order. The initial value is always `0`.
>
> Possible Operations:
>
> - **`++x` or `x++`:** increment by 1
> - **`--x` or `x--`:** decrement by 1

#### Let's Talk About It

An aside before we go in: increment and decrement as prefix differ whether it comes before or after the number. Consider the following code block:

```perl
my $i = 1;
my $j = $i++;
my $k = ++$i;
say join ' ', $i,$j,$k;  # 3 1 3
```

`$i` equals `3`, because it gets incremented twice. `$j` gets assigned before the increment, because `$i` comes before `++`. `$k` gets assigned after the increment, so `$i` becomes `3`, then `$k` becomes `$i`. There's *no* assignment like that going on in in the midst of the operations, so it isn't germane to the problem, but it's an interesting piece of syntax that is easy to forget.

Anyway, I loop through the operations and increment and decrement based on whether the operation contains `++` or `--`, then return the result.

The *cool* way would be to use `scalar grep` to get a count of the plus and minuses, then `return 0 + $plus - $minus`. It's only slightly shorter, and probably similarly fast.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use List::Util qw{ sum0 };

my @examples = (

    [ "--x", "x++", "x++" ],
    [ "x++", "++x", "x++" ],
    [ "x++", "++x", "--x", "x--" ],
);

for my $example (@examples) {
    my $operations = join ', ', map { qq{"$_"} } $example->@*;
    my $output     = increment_decrement($example->@*);
    say <<"END";
    Input:  \@operations = ($operations)
    Output: $output
END
}

sub increment_decrement (@operations) {
    my $value = 0;
    for my $op ( @operations ) {
        $value ++ if $op =~ /\+\+/mx;
        $value -- if $op =~ /\-\-/mx;
    }
    return $value;
}
```

```text
$ ./ch-1.pl 
    Input:  @operations = ("--x", "x++", "x++")
    Output: 1

    Input:  @operations = ("x++", "++x", "x++")
    Output: 3

    Input:  @operations = ("x++", "++x", "--x", "x--")
    Output: 0
```

### Task 2: Tax Amount

> Submitted by: Mohammad Sajid Anwar  
> You are given an income amount and tax brackets.
>
> Write a script to calculate the total tax amount.

#### Let's Talk About It

We are taxed at the rate of a bracket for the income within a bracket. In the first example, the income is `10`. 

* The first bracket is between `0` and `3`, and the tax rate applies to the first `3` whatevers from the income of 10.
* The second bracket is between `3` and `7`, and the tax rate applies to everything above `7` and above `3`, which, again, is totally covered by the income, so that's `4`.
* The third bracket is between `7` and `12`, and that' just between `7` and `10` for us, and that's `3`.

Everything else is just multiplication and addition.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };
use List::Util   qw{ uniq };

my @examples = (

    { income => 10, tax => [ [ 3, 50 ], [ 7, 10 ], [ 12, 25 ] ] },
    { income => 2,  tax => [ [ 1, 0 ],  [ 4, 25 ], [ 5,  50 ] ] },
    { income => 0,  tax => [ [ 2, 50 ] ] },
);

for my $example (@examples) {
    my $income = $example->{income};
    my @tax    = $example->{tax}->@*;
    my $tax    = join ', ', map { qq{[ $_ ]} }
        map { join ', ', $_->@* } @tax;
    my $output = tax_amount($example);
    say <<"END";
    Input:  \@income = $income,
            \@tax = ($tax)
    Output: $output
END
}

sub tax_amount($example) {
    my $total  = 0;
    my $income = $example->{income};
    my @tax    = $example->{tax}->@*;
    for my $i ( 0 .. $#tax ) {
        my $bracket = $tax[$i];
        my ( $upto, $rate ) = $bracket->@*;
        my $prev = 0;
        $prev = $i - 1 >= 0 ? $tax[ $i - 1 ][0] : 0;
        my $subset = 0;
        if    ( $income >= $upto ) { $subset = $upto - $prev; }
        elsif ( $income >= $prev ) { $subset = $income - $prev; }
        my $subtax = $subset * ( $rate / 100 );
        $total += $subtax;
    }
    return sprintf '%.02f', $total;
}
```

```text
$ ./ch-2.pl 
    Input:  @income = 10,
            @tax = ([ 3, 50 ], [ 7, 10 ], [ 12, 25 ])
    Output: 2.65

    Input:  @income = 2,
            @tax = ([ 1, 0 ], [ 4, 25 ], [ 5, 50 ])
    Output: 0.25

    Input:  @income = 0,
            @tax = ([ 2, 50 ])
    Output: 0.00
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
