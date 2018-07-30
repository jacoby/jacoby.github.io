---
layout: post
title:  "About Time: Finding Solar Noon"
author: "Dave Jacoby"
date:   "2018-07-30 12:49:25 -0400"
categories: 
---

I had a [code bunny](https://www.urbandictionary.com/define.php?term=plot%20bunny) a while ago for an app that gives you the time centered on "solar noon", the time of day when the sun is directly above you.

Because "Hey, I'd have to learn _so_ much to write a phone app!", I let the bunny linger, until I decided to implement it in Perl, minimizing the number of steps I'd have to learn. Once I had it down as a command-line tool, I'd just have to learn to do the mobile-app steps.

And, as it turns out, I had a good chunk of that knowledge already.

[Here are a whole lot of arguments for you to use a DateTime library](https://infiniteundo.com/post/25326999628/falsehoods-programmers-believe-about-time). Time is weird, because 1) the ball of mud you're spinning on is not entirely consistent in it's spin and 2) politicians have a say, and have had a say since we started measuring it. As I am a Perl guy, my choice is [DateTime](https://metacpan.org/pod/DateTime). I forgot to thank Dave Rolsky for his work on DateTime at TPC this year, but plan to buy him a drink of whatever he chooses next year.

```perl
use DateTime;
my $day = DateTime->now();
$day->set_time_zone('America/Indianapolis');
print $day->iso8601;    # 2018-07-30T13:26:56
```

So, that gives us a good start. I know I'm close enough to 40.4975218, -86.9962171 that the difference between that and where I am is insignificant, so we can proceed, using [DateTime::Event::Sunrise](https://metacpan.org/pod/DateTime::Event::Sunrise).

```perl
use DateTime;
use DateTime::Event::Sunrise;
my $dtes = DateTime::Event::Sunrise->new(
    latitude  => '40.4975218',
    longitude => '-86.9962171',
);
my $day = DateTime->now();
$day->set_time_zone('America/Indianapolis');
my $solar_offset = ( $dtes->sunset_datetime($day)->epoch -
        $dtes->sunrise_datetime($day)->epoch ) / 2;
my $solar_noon = $dtes->sunrise_datetime($day);
$solar_noon->add( seconds => $solar_offset );
```

What we get from DateTime::Event::Sunrise isn't noon, but rather sunrise and sunset. And solar noon will be the point equidistant from both, right?

So, this work for me, right now, because I'm in the lab which is with the CEP of an ICBM detonation at those coordinates. But if I'm not there?

```perl
use JSON::XS ;
use LWP::Protocol::https ;
use LWP::UserAgent ;

my $json  = JSON::XS->new->pretty ;
my $agent = LWP::UserAgent->new ;

my $url = 'https://www.googleapis.com/geolocation/v1/geolocate?key='
    . $Google_API_key ;
my $object = {} ;
my $r = $agent->post( $url, $object ) ;
if ( $r->is_success ) {
    my $j = $r->content ;
    my $o = $json->decode($j) ;
    my $location {
        lat => $o->{location}{lat},
        lng => $o->{location}{lng},
        acc => $o->{accuracy},
        } ;
    }
```

This, of course, assumes you have a key for the [Google Geolocation API](https://developers.google.com/maps/documentation/geolocation/intro), which isn't too hard to get. There's also a Geocoding API, where, given a latitude and longitude, it tells you a good amount of information about where (it thinks) you are.

```
Latitude:    40.4975218
Longitude:   -86.9962171
Accuracy:    5892
https://www.google.com/maps/place/40.4975218+-86.9962171

United States
country
political

Indiana, USA
administrative_area_level_1
political

Lafayette, IN, IN, USA
political

Tippecanoe County, IN, USA
administrative_area_level_2
political

West Lafayette, IN 47906, USA
postal_code

Wabash Township, IN, USA
administrative_area_level_3
political

4718 W 500 N, West Lafayette, IN 47906, USA
street_address
```

Again, not my house. I have no idea why my work IP address is pointing so far out. I should bug my admins about that. But, it is close enough for this to work.

```
💻 ✔ jacoby@oz 14:07 68°F     ~
$ ./solar_noon_today.pl

Today: 2018-07-30
    Sunrise: 06:43:37
    Noon:    13:54:25
    Sunset:  21:05:13
```

So, in my location, solar noon occurs at almost 2pm. Why is that?

First off, there's time zones. When moving between locations was slow and difficult, everyone worked off solar time, but when it became possible to move quickly east-west, it became hard to keep a good timetables. The passenger coming from New York and the clerk at the train station in Albany would have a significant variance in their clocks.

So, time zones were set up in the late 1800s, grouping everyone from the tip of Maine to the eastern suburbs of Chicago into Eastern Time, with the same noon. This, of course, puts noon before solar noon for some people, and after for most people, actually.

[![Map of world time zones, showing how close to solar they are](https://kottke.org/plus/misc/images/time-zone-offset.jpg "Map of world time zones, showing how close to solar they are")](https://kottke.org/14/02/time-zone-offset-map)

I'm a 40-minute drive from border to Illinois and the next time zone, so I'm close, but not quite at the one-hour mark.

And the other hour? It's summer, so Daylight Saving Time. Sunrise, without it, would be before 6am and putting sunset at 8. If we get rid of that hour when we're sleeping, that gives us another hour after work for us to play golf and eat ice cream. To my mind, the only reasonable pro-DST argument is "all the other kids are doing it", but we have it.

But I still have `America/Indianapolis` hard-coded, because while I get **America**, **Indiana**, **Tippecanoe County**, **Wabash Township** and **West Lafayette** from Google, I do not get **America/Indianapolis** or **EDT** or **GMT-4**.

Shub-Internet tells me that [https://developers.google.com/maps/documentation/timezone/intro](Google has an API for that as well), but I have yet to create a key and work that. Exercise for the reader?

Anyway, this is the current state of my Solar Noon program, which was adapted from my current weather program. (I work in a sub-basement, so I can't just look out a window.) May you soon marvel at how unnatural your relationship to the sun actually is.

```perl
#!/usr/bin/env perl

# Find Solar Noon

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental::postderef experimental::signatures };

use Carp;
use Data::Dumper;
use DateTime;
use DateTime::Event::Sunrise;
use IO::Interactive qw{ interactive };
use JSON::XS;
use YAML::XS qw{ Dump DumpFile LoadFile };

use lib $ENV{HOME} . '/lib';
use GoogleGeo; # I may need to more fully rock this and release
               # as WebService::Google::Geo or something

my $json     = JSON::XS->new->pretty->canonical;
my $config   = config();
my $location = geolocate( $config->{geolocate} );
croak 'No Location Data' unless $location->{lat};

my $dtes = DateTime::Event::Sunrise->new(
    latitude  => $location->{lat},
    longitude => $location->{lng},
);

my $day = DateTime->now();
$day->set_time_zone('America/Indianapolis');

my $solar_offset =
    ( $dtes->sunset_datetime($day)->epoch -
        $dtes->sunrise_datetime($day)->epoch ) / 2;
my $solar_noon = $dtes->sunrise_datetime($day);
$solar_noon->add( seconds => $solar_offset );

my $iso     = $day->iso8601;
my $ymd     = $day->ymd;
my $is_dst  = $day->is_dst;
my $sunrise = $dtes->sunrise_datetime($day)->hms;
my $sunset  = $dtes->sunset_datetime($day)->hms;
my $noon    = $solar_noon->hms;

# say join "\t", $day->ymd, $day->is_dst, $sunrise, $noon, $sunset;

say <<"END";

Today: $ymd
    Sunrise: $sunrise
    Noon:    $noon
    Sunset:  $sunset
END

exit;

# ======================================================================
# Reads configuration data from YAML files. Dies if no valid config files
sub config {
    my $geofile = $ENV{HOME} . '/.googlegeo.yaml';
    croak 'no Geolocation config' unless -f $geofile;
    my $keys = LoadFile($geofile);

    my $forecastfile = $ENV{HOME} . '/.forecast.yaml';
    croak 'no forecast config' unless -f $forecastfile;
    my $fkeys = LoadFile($forecastfile);
    $keys->{forecast} = $fkeys->{apikey};
    croak 'No forecast key' unless $keys->{forecast};
    croak 'No forecast key' unless $keys->{geolocate};
    return $keys;
}

# ======================================================================
# Takes the config for the API keys and the location, giving us lat and lng
# returns the forecast object or an empty hash if failing
sub get_forecast {
    my ( $config, $location ) = @_;
    my $url =
          'https://api.darksky.net/forecast/'
        . $config->{forecast} . '/'
        . ( join ',', map { $location->{$_} } qw{ lat lng } );
    my $agent = LWP::UserAgent->new( ssl_opts => { verify_hostname => 0 } );
    my $response = $agent->get($url);

    if ( $response->is_success ) {
        my $content  = $response->content;
        my $forecast = decode_json $content ;
        return $forecast;
    }
    return {};
}

sub store ( $obj ) {
    my $data_file = $ENV{HOME} . '/.sunset.yaml';
    say {interactive} Dump $obj ;
    DumpFile( $data_file, $obj );
}
```


If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
