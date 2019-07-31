---
layout: post
title: "Five-Weekend Mondays and How Years Work"
author: "Dave Jacoby"
date: "2019-07-31 11:02:38 -0400"
categories: ""
---

[**Week 19, Task 1**](https://perlweeklychallenge.org/blog/perl-weekly-challenge-019/)

> Write a script to display months from the year 1900 to 2019 where you find 5 weekends i.e. 5 Friday, 5 Saturday and 5 Sunday.

The most brute force way would be to check every day of every month of every year from 1900 to this New Year's Eve, but no, we can be more clever than that.

Consider a month that gets us four-weekend months. It would need 4 \* 3 weekend days and 3 \* 4 weekday days, so 12 + 12 = 24 days at least. That's every month. Expand it to five weekends and that's 5 \* 3 + 4 \* 4 = 15 + 16 = 31 days. So, because _"Thirty days has September..."_ and all that, we can cut down the month list to January, March, May, July, August, October and December. And because the max month size fits the requirements perfectly, it can only be true in a month like this, with the first of the month coming on a Friday.

```text
  M   T   W   T   F   S   S
                  1   2   3
  4   5   6   7   8   9  10
 11  12  13  14  15  16  17
 18  19  20  21  22  23  24
 25  26  27  28  29  30  31
```

Adding to this, we have [DateTime](https://metacpan.org/pod/DateTime), which makes actually dealing with dates simple.

```perl
use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

use DateTime;

my @months = (1, 3, 5, 7, 8, 10, 12);
my $date = DateTime->now();
$date->set_day(1);
for my $year ( 1900 .. 2019 ) {
    $date->set_year($year);
    for my $month ( @months ) {
        $date->set_month($month);
        say $date->ymd if 5 == $date->day_of_week;
    }
}
```

But let's step back and think for a minute. How many possible unique years are there? January 1 can come on one of seven days of the week, and there are only leap years and non-leap years. So, 7 \* 2 = 14 possible unique years.

Look at a subset of my output and you'll see patterns.

```text
1901-03-01
1902-08-01
1903-05-01
1904-01-01
1904-07-01
1905-12-01
1907-03-01
1908-05-01
1909-01-01
1909-10-01
1910-07-01
1911-12-01
1912-03-01
1913-08-01
1914-05-01
1915-01-01
1915-10-01
1916-12-01
1918-03-01
1919-08-01
1920-10-01
1921-07-01
1922-12-01
1924-08-01
```

March 1901, followed by August 1902, then May 1903 and January 1904. March 1912, followed by August 1913, then May 1914 and January 1915. The pattern does not continue because 1904 was a leap year and 1915 wasn't.

I remember thinking as a child that each year had to be unique, but figured out intellectually that there can only be 14 in college, then put the thought away. Now, I understand that, not only are there only 14 possible years, each year can only be followed by one of two subsequent years. The clockwork binds tighter than I had believed.

But it opens up a new solution, where you know, because stored, if the year starts on a Friday, it will contain two five-weekend months, and one will be January. If the year is a leap year, the second will be July, and October if not. If it _is_ a leap year, the next year will have a five-weekend month in December, and none the year after that.

This code doesn't pull that full pattern, but it tells which months are five-weekend months and only uses DateTime to tell if it's a leap year and what day of the week it starts.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

use DateTime;

my $table = {};
$table->{"01"} = [];
$table->{"02"} = [3];
$table->{"03"} = [8];
$table->{"04"} = [5];
$table->{"05"} = [ 1, 10 ];
$table->{"06"} = [7];
$table->{"07"} = [12];
$table->{"11"} = [3];
$table->{"12"} = [8];
$table->{"13"} = [5];
$table->{"14"} = [10];
$table->{"15"} = [ 1, 7 ];
$table->{"16"} = [12];
$table->{"17"} = [];

my $date = DateTime->now();
$date->set_day(1);
$date->set_month(1);
for my $year ( 1900 .. 2019 ) {
    $date->set_year($year);
    my $dow  = $date->day_of_week;
    my $leap = $date->is_leap_year;
    my $key  = join '', $leap, $dow;
    for my $month ($table->{$key}->@*) {
        say join '-', map { sprintf '%02d',$_ } $year, $month, '1';
    }
}
```

And here we only check once per year, not seven times per year.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
