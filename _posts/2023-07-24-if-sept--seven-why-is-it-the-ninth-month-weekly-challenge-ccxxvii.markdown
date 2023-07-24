---
layout: post
title:  "If Sept = Seven, Why is it the Ninth Month?: Weekly Challenge CCXXVII"
author: "Dave Jacoby"
date:   "2023-07-24 14:04:46 -0400"
categories: ""
---

This is [Weekly Challenge #227](https://theweeklychallenge.org/blog/perl-weekly-challenge-227/). That's **CC** (200) + **XX** (20) + **VII** (7). If reversed the characters in that last one, that would be **IIV**. If the lower-valued characters come before a higher-valued character, that would be subtracted, so that would be 3, but of course it wouldn't, because we have **III**.

The common reasoning behind the discrepency between the naming of the last four (Septem is 7 but September is ninth, Octo is eight but October being tenth, Novem is nine but November being eleventh, Decem is 10 but December being twelth) is more about moving when the year starts than about creating months for Julius and Augustus Caesar, which is the common excuse.

**227** is a [prime number](https://en.wikipedia.org/wiki/Prime_number), and a [safe prime](https://en.wikipedia.org/wiki/Safe_and_Sophie_Germain_primes) at that.

### Task 1: Friday 13th
>
> Submitted by: Peter Campbell Smith  
> You are given a year number in the range 1753 to 9999.  
>
> Write a script to find out how many dates in the year are Friday 13th, assume that the current Gregorian calendar applies.  

#### Let's Talk It Out

I again quote myself quoting Dave Rolsky:

>**Do Not Write Your Own Date and Time Manipulation Code!**

I fall back on [DateTime](https://metacpan.org/pod/DateTime), as I always do, because when dealing with dates and times in Perl, Dave Rolsky did the work. And here it's easy to leap through all the months of a given year, create corresponding DateTime objects, and test if it's a Friday.

This piqued my curiosity. We might think that any month can have a Friday the 13th, but there are limits. This is because there are only 14 ways a year can go, and the two determining factors are the day of the week Jan 1 comes and whether it's a leap year.

So I wrote parallel code that tells us, in the whole time period we're talking, from 1753 to 9999, we get 1196 times where only May gets a Friday the 13th, 1176 times where it's September and December, and 1175 times for June.

There will never be more than 3 Friday the 13ths in a year, and they will either be February, March and November (907 times) or January, April and July (309 times). There are 289 times where March and November have Friday the 13th while February does not, and I'm sure that's about the leap year.

Only Friday, October 13th is the least common option, at 267 occurances.

My answer code just returns the count, not a list which months they are.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use DateTime;

my @examples = (
    1753,
    1800,
    1900,
    2000,
    2009, 
    2023,
    2100,
    3000,
    4000,
    9000,
    9999
);

for my $year (@examples) {
    my $count = find_friday13s($year);
    say <<~"END";
    Input:  \$year = $year
    Output: $count
    END
}

sub find_friday13s ($year) {
    my $count = 0;
    my @months;
    for my $month ( 1 .. 12 ) {
        my $dt = DateTime->now();
        $dt->set_year($year);
        $dt->set_day(13);
        $dt->set_month($month);
        $count++ if $dt->day_of_week == 5;
        push @months, $month if $dt->day_of_week == 5;

    }
    return $count;
}
```

```text
$ ./ch-1.pl 
Input:  $year = 1753
Output: 2

Input:  $year = 1800
Output: 1

Input:  $year = 1900
Output: 2

Input:  $year = 2000
Output: 1

Input:  $year = 2009
Output: 3

Input:  $year = 2023
Output: 2

Input:  $year = 2100
Output: 1

Input:  $year = 3000
Output: 1

Input:  $year = 4000
Output: 1

Input:  $year = 9000
Output: 1

Input:  $year = 9999
Output: 1
```

### Task 2: Roman Maths
>
> Submitted by: Peter Campbell Smith  
> Write a script to handle a 2-term arithmetic operation expressed in Roman numeral.  

#### Let's Talk It Out

Just as you don't just write your own date manipulation code, you don't just write your own Roman numeral converter. By convention, **9** would be **IX**, but it would make all the sense to me to continue on from 8 and write it **VIIII**, so wha?

Thankfully, we have [Roman](https://metacpan.org/pod/Roman), which gives us `arabic()` to convert a Roman numeral to a number we can use, and `Roman()` which converts it back in uppercase format. Using `roman()` would give us **ix** for 9 instead of **IX**.

I split, convert and eval here. If it wasn't input I'm happy with, I would do value testing and a dispatch table or something, because I don't want to just throw any code into `eval`. Stay safe, kids!

But we have to do some fit checking, because you can't write fractions/decimals, you can't write negative numbers, and **I̅V̅**  is how you write 4000 in Roman numerals, which is doable now with Unicode, but in 2015, when Roman was last modified (I think), Unicode was a bit less acceptable, so the under-4000 limit is a limitation of the Roman module, not the Perl language. Alas.

In the test cases given, **V / II** gives you **2.5**, but Roman converts it to **II**, so you when you get a decimal, you have to check, which is why I make `$roman = undef` when `$arabic =~ /\./`.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use Roman;

my @examples = (
    "IV + V",
    "M - I",
    "X / II",
    "XI * VI",
    "VII ** III",
    "V - V",
    "V / II",
    "MMM + M",
    "V - X",
);

for my $e (@examples) {
    my $pad = ' ' x (10 - length $e);
    my $output = roman_maths($e);
    print <<~"END";
    $e $pad => $output
    END
}

sub roman_maths ($equation) {
    my ( $first, $expression, $second ) = split /\s+/mx, $equation;
    my ( $f, $s ) = map { arabic($_) } $first, $second;
    my $arabic = eval( join ' ', $f, $expression, $s );
    my $roman = Roman($arabic);
    $roman = undef if $arabic =~ /\./mx;
    return $roman if defined $roman && $arabic > 0;
    return 'nulla' if $arabic == 0;
    return 'non potest' ;
}
```

```text
$ ./ch-2.pl 
IV + V      => IX
M - I       => CMXCIX
X / II      => V
XI * VI     => LXVI
VII ** III  => CCCXLIII
V - V       => nulla
V / II      => non potest
MMM + M     => non potest
V - X       => non potest
```

### Addendum

In writing this up, I was writing about the numbers Roman cannot express and I found myself writing *sanity check*. Then I looked at that word. It is the conventional term for making sure the values being passed are values that can be handled, but I'm guessing that this is a convention that'll be changing soon. I think it's close to the *data checks* that is being worked on with [Oshun](https://github.com/Perl-Oshun/oshun), but that seemed too specific. My wife suggested *fit check*, and I went with it. I'll gladly hear your suggestions.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
