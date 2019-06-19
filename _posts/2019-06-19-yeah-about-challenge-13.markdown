---
layout: post
title:  "Yeah, about Challenge 13"
author: "Dave Jacoby"
date:   "2019-06-19 13:49:56 -0400"
categories: ""
---

I read the challenge just before Sawyer X's keynote, so I didn't pay so much attention it. I'm ... a _little_ shamed.

## Challenge 1

```perl
#!/usr/bin/env perl

# Perl Weekly Challenge 013-1

# Write a script to print the date of last Friday of every month
# of a given year. For example, if the given year is 2019
# then it should print the following:

# 2019/01/25
# 2019/02/22
# 2019/03/29
# 2019/04/26
# 2019/05/31
# 2019/06/28
# 2019/07/26
# 2019/08/30
# 2019/09/27
# 2019/10/25
# 2019/11/29
# 2019/12/27

# I should not have read the challenge during the start of TPC

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

use DateTime;

my $year = shift @ARGV;
$year //= 2019; # because sawyer x mentioned the //= operator to applause

last_fridays($year);

# best to not think of this in terms of the year, but as 12
# instances of last friday in the month
sub last_fridays ( $year ) {
    for my $mon ( 1 .. 12 ) { say last_friday( $year, $mon ); }
}

sub last_friday ( $year, $mon ) {
    # Thank you Dave Rolsky and everyone else who made this simple

    # Months are not of a standard size. We don't know the last day
    # but we do know what the first day is
    my $dt = DateTime->new(
        year      => $year,
        month     => $mon,
        day       => 1,
        hour      => 12,
        minute    => 0,
        second    => 0,
        time_zone => 'floating'
    );

    # and no month is 32 days long
    $dt->add( days => 32 );

    # while does nothing if the test is true
    $dt->subtract( days => 1 ) while $dt->day_of_week != 5; # find a friday
    $dt->subtract( days => 7 ) while $dt->month != $mon;    # and move backto the right month
    return $dt->ymd('/'); # example solution uses slashes
}

__DATA__

2019/01/25
2019/02/22
2019/03/29
2019/04/26
2019/05/31
2019/06/28
2019/07/26
2019/08/30
2019/09/27
2019/10/25
2019/11/29
2019/12/27
```

In short:
* we start at the first of every month
* jump forward 32 days, because that's longer than any month
* back up by days to a Friday
* back up a week until we're within the month in question.

The quick-and-easy way would be to get month number `$n+1`, but I'm not 100% that the 13th month of 2019 is something DateTime would accept.

Again, [Dave Rolsky](https://metacpan.org/author/DROLSKY) exists, and he and the other contributors to [`DateTime`](https://metacpan.org/pod/DateTime) who made it very easy to handle time, by eating the parallel sins of the planet's orbit slowing and politicians juggling time zones.

I should buy him a pizza.

## Challenge 2

The question is less "can I make this" and much more "is this thing I made _correct_?", and I'm not convinced that the output is the correct one, although the functions are simple and easily implementable.

```perl
#!/usr/bin/env perl

# Perl Weekly Challenge 013-2

# Write a script to demonstrate Mutually Recursive methods.
# Two methods are mutually recursive if the first method calls
# the second and the second calls first in turn. Using the
# mutually recursive methods, generate Hofstadter Female
# and Male sequences.

##  F ( 0 ) = 1   ;   M ( 0 ) = 0
##  F ( n ) = n − M ( F ( n − 1 ) ) , n > 0
##  M ( n ) = n − F ( M ( n − 1 ) ) , n > 0.

# Thinking through this problem

# ff(1) = 1 - mm( ff( 0 ) )
# ff(1) = 1 - mm( 1 )
# mm(1) = 1 - ff( mm( 0 ) )
# mm(1) = 1 - ff( 0 )
# mm(1) = 1 - 1
# mm(1) = 0
# ff(1) = 1 - 0
# ff(1) = 1

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch fc };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

for my $n ( 0 .. 3 ) {
    my $f = ff($n);
    my $m = mm($n);
    # say '';
    say qq{ f( $n ) = $f \t m( $n ) = $m };
}

exit;

sub ff( $n ) {
    # print qq{ ff($n) };
    return 1 if $n == 0 ;
    return $n - mm( ff( $n-1 ));
}

# using mm() because m() is a match operator, and using ff() to
# keep consistent, even though there isn't an f() operator.
sub mm( $n ) {
    # print qq{ mm($n) };
    return 0 if $n == 0 ;
    return $n - ff( mm( $n-1 ));
}

__DATA__
 ff(0)  mm(0)
 f( 0 ) = 1 	 m( 0 ) = 0

 ff(1)  ff(0)  mm(1)  mm(0)  ff(0)  mm(1)  mm(0)  ff(0)
 f( 1 ) = 1 	 m( 1 ) = 0

  ^^^ Verified

 ff(2)  ff(1)  ff(0)  mm(1)  mm(0)  ff(0)  mm(1)  mm(0)  ff(0)  mm(2)  mm(1)  mm(0)  ff(0)  ff(0)
 f( 2 ) = 2 	 m( 2 ) = 1

 ff(3)  ff(2)  ff(1)  ff(0)  mm(1)  mm(0)  ff(0)  mm(1)  mm(0)  ff(0)  mm(2)  mm(1)  mm(0)  ff(0)  ff(0)  mm(3)  mm(2)  mm(1)  mm(0)  ff(0)  ff(0)  ff(1)  ff(0)  mm(1)  mm(0)  ff(0)
 f( 3 ) = 2 	 m( 3 ) = 2
```

So, I am sure that `ff()` can call `mm()` and  `mm()` can call `ff()`, but I'm not sure that this does and what it shows us.

This, actually, seems like a good candidate to [Memoize](https://metacpan.org/pod/Memoize), so you only have to solve for `ff(n)` once. ([Higher Order Perl](https://hop.perl.plover.com/) a) will make you a better programmer and b) is available free. Look into it.)

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).