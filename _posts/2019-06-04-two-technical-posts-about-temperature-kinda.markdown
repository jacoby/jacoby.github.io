---
layout: post
title: "Two Technical Posts about Temperature, Kinda"
author: "Dave Jacoby"
date: "2019-06-04 10:18:54 -0400"
categories: ""
---

This is another [Perl Weekly Challenge](https://perlweeklychallenge.org/blog/perl-weekly-challenge-011/) post.

## Challenge 1

> Write a script that computes the equal point in the Fahrenheit and Celsius scales, knowing that the freezing point of water is 32 °F and 0 °C, and that the boiling point of water is 212 °F and 100 °C. This challenge was proposed by **Laurent Rosenfeld**.

I _know_ the answer is -40°, because I've thought about this before, and it's been one of those questions.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ say };

# Write a script that computes the equal point in the
# Fahrenheit and Celsius scales, knowing that the
# freezing point of water is 32 °F and 0 °C,
# and that the boiling point of water is 212 °F and 100 °C.
# This challenge was proposed by Laurent Rosenfeld.

# 32  F == 0 C -> F' = F - 32
# 100 C == 212F == 180F'
# 5   C == 9 F'
# Therefore, C = ( 5/9 ( F - 32 ) )
# And        F = 32 + ( 9/5 C )

# We're talking computing, so brute force is allowed

my $c  = -39;   # we COULD start at 0, but I know the answer...
my $f  = 32;    # I need $f > $c at this point, but we could do while...

while ( $c < $f ) {
    $c -= 0.1;
    $f  = 32 + ( $c * 9 / 5 );
}

say qq{$c °C == $f °F };
```

```
-40 °C == -40 °F
```

## Challenge 2

> Write a script to create an Identity Matrix for the given size. For example, if the size is 4, then create Identity Matrix 4x4. For more information about **Identity Matrix**, please read the [wiki page](https://en.wikipedia.org/wiki/Identity_matrix).

This isn't weather, and the level of math this requires is a level I passed by the grace of my professor, and I no longer retain any knowledge of. Pass.

## Challenge 3

> Using [Open Weather Map API](https://openweathermap.org/current), write a script to fetch the current weather for an arbitrary city. Note that you will need to sign up for Open Weather Map’s free tier and then wait a couple hours before your API key will be valid. This challenge was proposed by **Joelle Maslak**. The API challenge is **optional** but would love to see your solution.

So, Challenge 2 was _mandatory_? Oops.

Anyway,

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch fc };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

# usage: ./pc011c3.pl london,uk washington,us paris

use JSON;
use Mojo::UserAgent;
use YAML qw{LoadFile};

my $json = JSON->new->pretty->canonical;
my $mojo = Mojo::UserAgent->new;

my $conf = LoadFile join '/', $ENV{HOME}, '.openweather.yml';
my $key  = $conf->{key};

for my $location (@ARGV) {
    my $query    = {
        q     => $location,
        appid => $key,
    };

    my $url = 'https://api.openweathermap.org/data/2.5/weather';
    my $res = $mojo->get( $url => form => $query )->result;
    if ( $res->is_success ) {
        my $obj = $json->decode( $res->body );
        say $json->encode($obj);
    } else {
        say $res->{code};
    }
}

# OK, verbose in JSON and not quite readable, but it fulfills the
# letter of the challenge.
```

And checking the weather for Beijing:

```json
{
   "base" : "stations",
   "clouds" : {
      "all" : 0
   },
   "cod" : 200,
   "coord" : {
      "lat" : 39.91,
      "lon" : 116.39
   },
   "dt" : 1559660955,
   "id" : 1816670,
   "main" : {
      "humidity" : 77,
      "pressure" : 1007,
      "temp" : 297.3,
      "temp_max" : 301.48,
      "temp_min" : 294.15
   },
   "name" : "Beijing",
   "sys" : {
      "country" : "CN",
      "id" : 9609,
      "message" : 0.0045,
      "sunrise" : 1559594838,
      "sunset" : 1559648299,
      "type" : 1
   },
   "timezone" : 28800,
   "visibility" : 10000,
   "weather" : [
      {
         "description" : "clear sky",
         "icon" : "01n",
         "id" : 800,
         "main" : "Clear"
      }
   ],
   "wind" : {
      "deg" : 20,
      "speed" : 1
   }
}
```

A few times, I have started poking at a work-related API with the thought that I'd dust off my PAUSE account and make `Web::WorkAPI`, but then it was just this easy to make it work, and I thought "It's not worth it to take up valueable CPAN namespace, is it?"

With `CPAN` and equiv, `pretty` means indented, and `canonical` alphabetizes the hashrefs. There's also `utf8`, if you're looking at expanded character sets. I remember it but it isn't part of the template I always bring in. It likely should be.

`YAML qw{LoadFile}` is my way of storing the API key without hard-coding it into the program. Take it.

## More Weather

I use something similar, but using [Dark Sky](https://darksky.net/dev), to keep the current temperature on my desktop. Well, by _current_, I mean _within 10 minutes_, because I don't need to refresh it **that** much. I simply put it into a YAML file and have a script in my prompt handle it. Because it's a desktop and not mobile, I just store the latitude and longitude and check from there.

But then, there's my laptops.

It's not _often_ that they leave an area that's functionally the same weather as my work desktop, but it does happen.

So...

```perl
#!/usr/bin/env perl

# Determines current location based on IP address using Google
# Geolocation, finds current temperature via the DarkSky API
# and stores it into a YAML file, so that get_temp.pl can be
# in the bash prompt to display current local temperature.

use strict ;
use warnings ;
use utf8 ;
use feature qw{ postderef say signatures state } ;
no warnings qw{ experimental::postderef experimental::signatures } ;

use Carp ;
use Data::Dumper ;
use DateTime ;
use IO::Interactive qw{ interactive } ;
use JSON::XS ;
use YAML::XS qw{ DumpFile LoadFile } ;

use lib $ENV{ HOME } . '/lib' ;
use GoogleGeo ;

my $json     = JSON::XS->new->pretty->canonical ;
my $config   = config() ;
my $location = geolocate( $config->{ geolocate } ) ;
croak 'No Location Data' unless $location->{ lat } ;

my $forecast = get_forecast( $config, $location ) ;
croak 'No Location Data' unless $forecast->{ currently } ;
my $current = $forecast->{ currently } ;

say { interactive } $json->encode( $location ) ;
say { interactive } $json->encode( $current ) ;

my $now     = DateTime->now()->set_time_zone( 'America/New_York' )
    ->datetime() ;
my $temp_f  = int $current->{ temperature } ;
my $icon    = $current->{ icon } ;
my $summary = $current->{ summary } ;
store( $now, $temp_f, $icon, $summary ) ;

exit ;

# ======================================================================
# Reads configuration data from YAML files. Dies if no valid config files
sub config {
    my $geofile = $ENV{ HOME } . '/.googlegeo.yaml' ;
    croak 'no Geolocation config' unless -f $geofile ;
    my $keys = LoadFile( $geofile ) ;

    my $forecastfile = $ENV{ HOME } . '/.forecast.yaml' ;
    croak 'no forecast config' unless -f $forecastfile ;
    my $fkeys = LoadFile( $forecastfile ) ;
    $keys->{ forecast } = $fkeys->{ apikey } ;
    croak 'No forecast key' unless $keys->{ forecast } ;
    croak 'No forecast key' unless $keys->{ geolocate } ;
    return $keys ;
    }

# ======================================================================
# Takes the config for the API keys and the location, giving us lat and lng
# returns the forecast object or an empty hash if failing
sub get_forecast {
    my ( $config, $location ) = @_ ;
    my $url =
          'https://api.darksky.net/forecast/'
        . $config->{ forecast } . '/'
        . ( join ',', map { $location->{ $_ } } qw{ lat lng } ) ;
    my $agent = LWP::UserAgent->new( ssl_opts => { verify_hostname => 0 } ) ;
    my $response = $agent->get( $url ) ;

    if ( $response->is_success ) {
        my $content  = $response->content ;
        my $forecast = decode_json $content ;
        return $forecast ;
        }
    return {} ;
    }

sub store ( $time, $temp, $icon, $summary ) {
    say { interactive } qq{Current Time: $time} ;
    say { interactive } qq{Current Temperature: $temp} ;
    say { interactive } qq{Current Icon: $icon} ;
    say { interactive } qq{Current Summary: $summary} ;
    my $data_file = $ENV{ HOME } . '/.temp.yaml' ;
    my $obj       = {
        curr_time => $time,
        curr_temp => $temp,
        curr_icon => $icon,
        curr_summ => $summary,
        } ;
    DumpFile( $data_file, $obj ) ;
    }
```

1. **Google**, where are we?
2. **DarkSky**, what's the weather there?
3. Store that for later.

```perl
package GoogleGeo;

# interfaces with Google Geolcation API

# https://developers.google.com/maps/documentation/geolocation/intro

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental::postderef experimental::signatures };

use Carp;
use Data::Dumper;
use Exporter qw(import);
use Getopt::Long;
use JSON::XS;
use LWP::Protocol::https;
use LWP::UserAgent;

our @EXPORT = qw{
    geocode
    geolocate
    timezone
};

my $json  = JSON::XS->new->pretty;
my $agent = LWP::UserAgent->new;

sub timezone ( $Google_API_key, $obj ) {
    croak unless defined $Google_API_key;

    if ( ! defined $obj->{time}) {
        $obj->{time} = DateTime->now()->epoch;
    }

    my $url = 'https://maps.googleapis.com/maps/api/timezone/json?key='
        . $Google_API_key;
    my $latlng = join ',', $obj->{lat}, $obj->{lng};
    $url .= '&location=' . $latlng;
    $url .= '&timestamp=' . $obj->{time};

    say STDERR $json->encode($obj);
    say STDERR $url;

    my $r = $agent->post($url);
    if ( $r->is_success ) {
        my $j = $r->content;
        my $o = $json->decode($j);
        say STDERR $j;
        return $o;
    }
    return {};
}

sub geocode ( $Google_API_key, $obj ) {
    croak unless defined $Google_API_key;
    my $url = 'https://maps.googleapis.com/maps/api/geocode/json?key='
        . $Google_API_key;
    my $latlng = join ',', $obj->{lat}, $obj->{lng};
    $url .= '&latlng=' . $latlng;
    my $object = { latlng => $latlng };
    my $r = $agent->post($url);
    if ( $r->is_success ) {
        my $j = $r->content;
        my $o = $json->decode($j);
        return $o;
    }
    return {};
}

sub geolocate ($Google_API_key) {
    my $url = 'https://www.googleapis.com/geolocation/v1/geolocate?key='
        . $Google_API_key;
    my $object = {};
    my $r = $agent->post( $url, $object );
    if ( $r->is_success ) {
        my $j = $r->content;
        my $o = $json->decode($j);
        return {
            lat => $o->{location}{lat},
            lng => $o->{location}{lng},
            acc => $o->{accuracy},
        };
    }
    return {};
}

'here';
```

There are three commands: `geocode`, `geolocate`, and `timezone`. Each has their own API and API key. Working with Google APIs is weird.
 * `geolocate` gives you your latitude and longitude (within Δ; at work, using TCP/IP-based guessing without relative strengths of cellular towers, it puts my location as a research farm north of here. But close enough for a cold front, I figure.) 
 * `geocode` takes a latitude and longitude and tells you where you are; country, state, city, township, etc. 
 * And `timezone` takes your latitude and longitude to tell you what time zone you're in. I used it to make a tool that tells me that, right now, where I'm at, solar noon is 1 hour and 47 minutes off noon for my time zone. (Exercise for the reader? Subject of another blog post?)

You'll notice that these are written using `LWP` rather than `Mojo`. I love `Mojo::UserAgent` but GoogleGeo started out well before I learned about it.

And this stores into `.temp.yaml`, and gets pulled out by this.

```perl
#!/usr/bin/env perl

# retrieves the current temperature from YAML to be used in the bash prompt

use feature qw{ say state unicode_eval unicode_strings } ;
use strict ;
use warnings ;
use utf8 ;
binmode STDOUT, ':utf8' ;

use Carp ;
use Data::Dumper ;
use YAML qw{ LoadFile } ;

my $data_file = $ENV{HOME} . '/.temp.yaml' ;
my $output    = {} ;
if ( defined $data_file && -f $data_file ) {
    my $output = LoadFile($data_file) ;
    defined $output->{curr_temp} && print $output->{curr_temp} . '°F' || '' ;
    exit ;
    }
croak('No Temperature File') ;
```

```
76°F
```

I should really write that stuff on [Promptimizations](https://github.com/jacoby/Promptimizations).

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
