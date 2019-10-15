---
layout: post
title: "Blogging Challenge 30"
author: "Dave Jacoby"
date: "2019-10-15 11:36:53 -0400"
categories: ""
---

### Challenge 1

> Write a script to list dates for **Sunday Christmas** between **2019** and **2100**. For example, **25 Dec 2022** is Sunday.

I use `YYYY-MM-DD` even when signing documents, because [that's the standard](https://en.wikipedia.org/wiki/ISO_8601). But [DateTime](https://metacpan.org/pod/DateTime) makes it easy.

So, the problem is for every year 2019..2100, is Dec 25 a Sunday? DateTime makes that a very simple loop thing.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

# Write a script to list dates for Sunday Christmas between 2019 and 2100.
# For example, 25 Dec 2022 is Sunday.

# Christmas Day is always Dec 25.

use DateTime;

for my $year ( 2019 .. 2100 ) {
    my $dt = DateTime->new(
        year      => $year,
        month     => 12,
        day       => 25,
        hour      => 12,
        minute    => 0,
        second    => 0,
        time_zone => 'floating'
    );
    if ( 6 == $dt->day_of_week_0() ) { say $dt->date }
}

__DATA__

2022-12-25
2033-12-25
2039-12-25
2044-12-25
2050-12-25
2061-12-25
2067-12-25
2072-12-25
2078-12-25
2089-12-25

```

### Challenge 2

> Write a script to print all possible series of **3 positive numbers**, where in each series **at least one of the number is even** and **sum of the three numbers is always 12**. For example, **3,4,5**.

I get into this a bit in the comments, but if you sum an odd number of odd numbers, you will always get an odd number. If you are looking for an even number, like 12, at least one number will have to be even, just by basic math.

So, I've proven I don't need a positive-number test. A possible answer is `1 1 10`, because the word "unique" is not a part of the challenge, and so, looping numbers between 1 and 10 will give us all the options we want.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

my %done ;

for my $m ( 1 .. 10 ) {
    for my $n ( 1 .. 10 ) {
        for my $o ( 1 .. 10 ) {
            my $i = join ' ' , sort $m,$n,$o;
            next if $done{$i}++;;
            my $p = $m + $n + $o;
            next unless $p == 12;
            say qq{    $m + $n + $o = $p};
        }
    }
}

# but the trick to avoid duplicates is for $n to start with $m+1
# and $o to start with $n+1.

__DATA__

    1 + 1 + 10 = 12
    1 + 2 + 9 = 12
    1 + 3 + 8 = 12
    1 + 4 + 7 = 12
    1 + 5 + 6 = 12
    2 + 2 + 8 = 12
    2 + 3 + 7 = 12
    2 + 4 + 6 = 12
    2 + 5 + 5 = 12
    3 + 3 + 6 = 12
    3 + 4 + 5 = 12
    4 + 4 + 4 = 12
```

But, in writing through this idea, It struck me that instead of adding three numbers and seeing if they add up to 12, I can substract two numbers from 12 and test that it's positive. Two loops, not one, so it's just that much cooler.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

my %done;

for my $m ( 1 .. 10 ) {
    for my $n ( 1 .. 10 ) {
        my $o = 12 - ( $m + $n );
        next unless $o > 0;
        my $p = $m + $n + $o;
        my $i = join ' ', sort $m, $n, $o;
        next if $done{$i}++;
        say qq{    $m + $n + $o = $p};
    }
}

__DATA__

    1 + 1 + 10 = 12
    1 + 2 + 9 = 12
    1 + 3 + 8 = 12
    1 + 4 + 7 = 12
    1 + 5 + 6 = 12
    2 + 2 + 8 = 12
    2 + 3 + 7 = 12
    2 + 4 + 6 = 12
    2 + 5 + 5 = 12
    3 + 3 + 6 = 12
    3 + 4 + 5 = 12
    4 + 4 + 4 = 12
```

But, if we were looking for _unique_, using the original with this slight addition, would assure that duplicate numbers could not happen.

```perl
for my $m ( 1 .. 10 ) {
    for my $n ( $m + 1 .. 10 ) {
        for my $o ( $n + 1 .. 10 ) {
            my $i = join ' ' , sort $m,$n,$o;
            next if $done{$i}++;;
            my $p = $m + $n + $o;
            next unless $p == 12;
            say qq{    $m + $n + $o = $p};
        }
    }
}

```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
