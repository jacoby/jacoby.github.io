---
layout: post
title:  "Sunrise and Sunset in Perl"
author: "Dave Jacoby"
date:   "2019-12-02 18:03:39 -0500"
categories: ""
---

The first task, `count the number of weekdays in each month of 2019`, is an easy task for a developer familiar with [DateTime](https://metacpan.org/pod/DateTime). The second task is harder.

> Write a script to find out the **DayLight** gain/loss in the month of **December 2019** as compared to **November 2019** in the city of **London**. 

We are provided links to [timeanddate.com](https://www.timeanddate.com/) to give us daily sunrise and sunset values, but there's no need, because CPAN contains [DateTime::Event::Sunrise](https://metacpan.org/pod/DateTime::Event::Sunrise).

I ran into this when trying to find [Solar Noon](https://jacoby.github.io/2018/07/30/about-time-finding-solar-noon.html), the point in time halfway between sunrise and sunset. Where I live, geography and DST puts solar noon at right before 2pm. 

Here, instead of my current location, I use the Google-provided latitude and longitude for London.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
  qw{ experimental::postderef experimental::smartmatch experimental::signatures };

use DateTime;
use DateTime::Duration;
use DateTime::Event::Sunrise;
use List::Util qw{sum};

# The problem for this week is determing the gain/loss of sunlight between
# November 2019 and December 2019. Links were given to provide sunrise
# and sunset, but Perl already gives us that info, with DateTime::Event::Sunrise,
# with Google giving us the location of London.

my $london_lat = 51.509865;
my $london_lon = -0.118092;
my $dtes       = DateTime::Event::Sunrise->new(
    latitude  => $london_lat,
    longitude => $london_lon,
);

# here we create a day duration so we can leap forward
# and a starting day of Nov 1
my $day   = DateTime::Duration->new( days => 1 );
my $start = DateTime->new(
    year      => 2019,
    month     => 11,
    day       => 1,
    hour      => 12,
    minute    => 0,
    second    => 0,
    time_zone => 'Europe/London',
);

# This while loop gives us every day between Nov 1 and Dec 31,
# which we handle with a while loop, collecting a list of
# day lengths per month.
my $months = {};
while ( $start->year == 2019 ) {
    my $day_length = day_length( $start, $dtes );
    push $months->{ $start->month_name }->@*, $day_length;
    $start->add($day);
}

# The question is to determine the daylight gain/loss
# between these months, but the problem is that November
# has 30 days and December has 31, so the shorter days
# would be offset by the extra days.
#
# I chose to show the difference in average day length,
# but moving to the difference in total sunlight time
# would simply require removing the averaging and
# using the sum of seconds of daytime
for my $m ( 'November', 'December' ) {
    my $sum     = sum $months->{$m}->@*;
    my $days    = scalar $months->{$m}->@*;
    my $average = int $sum / $days;
    my ( $hours, $minutes ) = seconds_to_hours($average);
    say qq{$m: $hours hours, $minutes minutes};
}

exit;

# Here we return the number of hours and minutes
# that a certain number of seconds contains. Could 
# possibly be done better with DateTime::Duration
sub seconds_to_hours ( $seconds ) {
    my $hours   = int $seconds / 3600;
    my $rem     = $seconds % 3600;
    my $minutes = int $rem / 60;
    return $hours, $minutes;
}

# $dtes is a location to work with, and $day is a DateTime object
# which uses the date but not the time parts to determine sunrise
# and sunset as DateTime objects, which we can export in epoch
# format to get the number of seconds since the Unix epoch.
# Sunset - Sunrise gives us the number of second in a day.
sub day_length ( $day, $dtes ) {
    my $sunrise = $dtes->sunrise_datetime($day);
    my $sunset  = $dtes->sunset_datetime($day);
    return $sunset->epoch - $sunrise->epoch;
}

___DATA___

November: 8 hours, 53 minutes
December: 7 hours, 55 minutes
```

November gets about an hour more sun a day in London than December, on average. As I mention in the code comments, I'm taking an average of the days, not the total time with sunlight for each month, but modifying the code to work on the sum of time in sunlight would be an easy change.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


