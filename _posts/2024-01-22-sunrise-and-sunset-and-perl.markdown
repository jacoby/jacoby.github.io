---
layout: post
title:  "Sunrise and Sunset and Perl"
author: "Dave Jacoby"
date:   "2024-01-22 18:28:23 -0500"
categories: ""
---

I'm on Mastodon (see below) and yesterday someone I follow was talking about looking up when sunrise and sunset are in different locations.

I responded:

> **I wrote some Perl that can give you sunrise and sunset based on date and latitude and longitude, but I'm sure there's variability based on geography, like in the dark hollows of Appalachia.**

I did slightly more than that, though.

First, I used Google's Geolocation API to determine my location.

And I used DarkSky's weather API to determine the weather based on that location. DarkSky got bought by Apple and closed the API.

Not that the location changed much, because this code basically always ran from an office in a subbasement.

And, if you have sunrise and sunset, it stands to reason that [Solar Noon](https://en.wikipedia.org/wiki/Solar_time) would be the time that's halfway between the two. Where I am, I am an hour drive or so from the border between Eastern and Central time, and there's some wiggle, but by and large, our solar noon occurs at 1pm during the winter, because of location in the time zome, and 2pm in the summer, because Daylight Saving Time. People complain about how early the sun sets in winter, and how late it rises, but DST does nothing about that, and just about every change is people trying to legislate away the reality of being on a ball of mud with a 23-degree axial tilt.

But anyway, given a location and a day, you can determine when sunrise and sunset are. I use [DateTime::Event::Sunrise](https://metacpan.org/pod/DateTime::Event::Sunrise).

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say signatures state fc };
use utf8;

use DateTime::Event::Sunrise;
use JSON::XS;

my $json = JSON::XS->new->pretty->canonical;
my $lat  = 40.41352210705339;                # Purdue University Airport (LAF)
my $long = -86.93235418084471;               # Purdue University Airport (LAF)

my $dtes = DateTime::Event::Sunrise->new(
    latitude  => $lat,
    longitude => $long,
);
my $now = DateTime->now()->set_time_zone('America/Indianapolis');
my $day_length =
    $dtes->sunset_datetime($now)
    ->subtract_datetime( $dtes->sunrise_datetime($now) );

my $obj;
$obj->{lat}           = $lat;
$obj->{lng}           = $long;
$obj->{date}          = $now->ymd;
$obj->{epoch}         = $now->epoch;
$obj->{sunrise_hms}   = $dtes->sunrise_datetime($now)->hms;
$obj->{sunrise_epoch} = $dtes->sunrise_datetime($now)->epoch;
$obj->{sunset_hms}    = $dtes->sunset_datetime($now)->hms;
$obj->{sunset_epoch}  = $dtes->sunset_datetime($now)->epoch;
$obj->{day_length}    = join ':',
    $day_length->in_units( 'hours', 'minutes', 'seconds' );
say $json->encode($obj);

exit;
```

```text
$ sunrise_sunset.pl 
{
   "date" : "2024-01-22",
   "day_length" : "9:47:59",
   "epoch" : 1705966185,
   "lat" : 40.4135221070534,
   "lng" : -86.9323541808447,
   "sunrise_epoch" : 1705928714,
   "sunrise_hms" : "08:05:14",
   "sunset_epoch" : 1705963993,
   "sunset_hms" : "17:53:13"
}
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
