---
layout: post
title: "Dipping Toes into Object Orientation"
author: "Dave Jacoby"
date: "2020-01-07 14:02:14 -0500"
categories: "moose"
---

### My God, IT's Full Of Stars!

So far in my programming career, I have done most of my work with procedural code with occasional jumps to functional. I _use_ other people's object-oriented code. ("Sure, we _all_ do!") but I haven't done much in writing my own.

I've written a lot about `$self->jobs->prev` and how maintaining legacy took priority over developing and learning, and so, understanding the 1000+ line inner loop (not an exaggeration) took priority over getting [Moose](https://metacpan.org/pod/Moose) under my fingers.

The code base for `$self->jobs->curr` is different, and looking through a very new, very useful piece of code make me think of Bowman entering the Obelisk in _2001_.

![Bowman entering the Obelisk](https://jacoby.github.io/images/full_of_stars.gif)

So that's enough to make me want to learn, and I had a start.

### ...Starts With A Single Step

[Dealing with latitude and longitude is a thing I've done before](https://jacoby.github.io/2018/07/30/about-time-finding-solar-noon.html), so this is a good place to start. Here is some code that gives us information about (Google's Best Guess about) where we are.

```perl
#!/usr/bin/env perl

use strict ;
use warnings ;
use feature qw{ say } ;

use lib '/home/jacoby/lib';
use Location;

my $here = Location->new->here;
say $here->latitude;
say $here->longitude;
say $here->timezone;
say $here->temperature;

__DATA__
40.4201887
-86.8881889
America/Indiana/Indianapolis
43.68
```

That looks like a good start, right?

### \*slaps roof of module\*

The start of this thing looked like this:

```perl
package Location;

use utf8;
use feature qw{ postderef say state switch };
no warnings qw{ experimental::postderef experimental::smartmatch };

use Carp;
use Moose;

has 'latitude' => (
    isa      => 'Num',
    is       => 'ro',
    default  => 0,
    required => 1
);

has 'longitude' => (
    isa      => 'Num',
    is       => 'ro',
    default  => 0,
    required => 1
);

...
```

There are some problems here. You could create a new Location object -- `my $statue_of_liberty = Location->new( latitude=>40.6892, longitude=> 74.0445)` -- but using Google's API magic to figure it when you don't know or can't be bothered? Not so much.

Also, there's range issues. Latitude goes from 90° to -90°, and longitude from 180° to -180°. As exists, you can throw in trash values and the module won't complain.

So, I moved it from read-only (`ro`) to read-write (`rw`), and created two functions, `_check_latitude` and `_check_longitude` that croak if out-of-bounds values get inserted.

We do `my $here = Location->new->here` instead of `Location->here`, which I'm not fond of and will change. Just takes some learning.

### Stand In The Place That You Are

So, how does `here` work, anyway?

[Google Does It!](https://developers.google.com/maps/documentation/geolocation/intro) I have a library called `GoogleGeo` that does this geolocation fun for me, and I don't have to worry about it.

It's simple API call, once you have a key, and while you _can_ get better accuracy if you give it the cell towers you see, I have no way to determine that on my laptop, so the straight TCP/IP lookup has done me fine with the resolution I need, which is a circular area probable of less than a few miles: close enough that storm fronts and ambient temperatures will be good enough to plan your day, but not close enough to reliably aim cruise missiles.

So, after this, the question is "but where _is_ that?"

[Google Does It!](https://developers.google.com/maps/documentation/geocoding/start) I have a library called `GoogleGeo` that does this geolocation fun for me, and I don't have to worry about it.

So, (with handwaving, because _that_ code isn't OOP), I `use lib $lib; use GoogleGeo;` and know latitude, longitude, and a good guess as to street address. This tells me a lot. It doesn't tell me everything. I could use time zones, for example. If I'm _not_ at 40.4201887, -86.8881889 or close to it, but the people I share my life with _are_, then knowing the difference in time zone is good, so I know when to call them without waking them up.

So, how do I figure out the time zone?

[Google Does It!][(https://developers.google.com/maps/documentation/geocoding/start](https://developers.google.com/maps/documentation/timezone/start)) I have a library called `GoogleGeo` that does this timezone fun for me, but the problem is that the previous two finish off my free slots in Google Cloud and I'd have to give them my credit card number to make this work.

### I Don't Care 'Cause I'm Not There

It _is_, however, available through [the API for DarkSky.net](https://darksky.net/dev), which I got into when it was still Forecast.io, a name I like better.

It gives us a generous number of requests per day, and the output looks like this:

```json
{
  "alerts": [
    {
      "description": "If there's a weather alert, it goes here",
      "expires": 1578998700,
      "regions": ["List", "of", "affected", "counties"],
      "severity": "advisory",
      "time": 1578441600,
      "title": "Hydrologic Outlook",
      "uri": "https://alerts.weather.gov/cap/wwacapget.php?..."
    }
  ],
  "currently": {
    "apparentTemperature": 35.4,
    "cloudCover": 0.1,
    "dewPoint": 29.25,
    "humidity": 0.58,
    "icon": "clear-day",
    "nearestStormBearing": 28,
    "nearestStormDistance": 54,
    "ozone": 379.1,
    "precipIntensity": 0,
    "precipProbability": 0,
    "pressure": 1017.9,
    "summary": "Clear",
    "temperature": 43.02,
    "time": 1578430536,
    "uvIndex": 0,
    "visibility": 10,
    "windBearing": 277,
    "windGust": 24.77,
    "windSpeed": 16.09
  },
  "daily": {
    "data": [
      {
        "description": "several days of forecasts"
      }
    ],
    "icon": "rain",
    "summary": "Rain on Thursday through Saturday."
  },
  "flags": {
    "nearest-station": 2.636,
    "sources": [
      "nwspa",
      "cmc",
      "gfs",
      "hrrr",
      "icon",
      "isd",
      "madis",
      "nam",
      "sref",
      "darksky",
      "nearest-precip"
    ],
    "units": "us"
  },
  "hourly": {
    "data": [
      {
        "description": "several hours of higher-detail forecasts"
      }
    ],
    "icon": "clear-day",
    "summary": "Clear throughout the day."
  },
  "latitude": 40.4201887,
  "longitude": -86.8881889,
  "minutely": {
    "description": "you can guess",
    "icon": "clear-day",
    "summary": "Clear for the hour."
  },
  "offset": -5,
  "timezone": "America/Indiana/Indianapolis"
}
```

And the last two are what we want. `timezone` is just what we need to set to find the current time from [DateTime](https://metacpan.org/pod/DateTime), which is crucial to know if it's after bedtime somewhere else.

But that's another API call, which takes time, and there are many cases, like distance between two points, where I don't need this information.

So we use **Lazy Loading!**

```perl
has 'timezone' => (
    is      => 'ro',
    lazy    => 1,
    builder => '_get_timezone',
);

sub _get_timezone {
    my ($self) = @_;
    if ( $self->{timezone} ) { return $self->{timezone} }
    $self->_get_forecast();
    return $self->{timezone};
}

sub _get_offset {
    my ($self) = @_;
    if ( $self->{offset} ) { return $self->{offset} }
    $self->_get_forecast();
    return $self->{offset};
}

sub _get_forecast {
    my $self     = shift;
    my $forecast = forecast( $self->latitude, $self->longitude, );
    $self->{timezone}    = $forecast->{timezone};
    $self->{offset}      = $forecast->{offset};
    $self->{temperature} = $forecast->{currently}{temperature};
    $self->{conditions}  = $forecast->{currently}{summary};
    $self->{currently}   = $forecast->{currently};
}
```

Lazy loading just means that the call to DarkSky to get the data will only occur if we ask for `timezone` or `offset`, or as the `_get_forecast` function hints, `temperature` and `conditions`.

### With A Shiver In My Bones Just Thinking About The Weather

Here's where we get to the problem.

`timezone` is unlikely to change in my location in the next hour, but `temperature` is just about guaranteed to change. This code does not store when last called and doesn't reset things every _n_ minutes. This is a good and wonderful thing to do, though.

Except...

This is only the right use if the object remains for several minutes, and that is not how I forsee this object remaining in memory for hours on end.

I don't know if the extension of functionality makes up for the rise in complexity.

### Can't Get There From Here

So, we have several points, defined by latitude and longitude. We might want to know how much distance between two locations, and here is my old implementation of the [Haversine formula](https://en.wikipedia.org/wiki/Haversine_formula), with some necessary math functions.

```perl
sub haversine {
    my ( $lat1, $lon1, $lat2, $lon2 ) = @_ ;

    my $theta = $lon1 - $lon2 ;
    my $dist =
        sin( deg2rad( $lat1 ) ) *
        sin( deg2rad( $lat2 ) ) +
        cos( deg2rad( $lat1 ) ) *
        cos( deg2rad( $lat2 ) ) *
        cos( deg2rad( $theta ) ) ;

    $dist = acos( $dist ) ;
    $dist = rad2deg( $dist ) ;
    $dist = $dist * 60 * 1.1515 ;
    return sprintf '%5.2f' , $dist ;
    }

sub acos {
    my ( $rad ) = @_ ;
    my $ret = atan2( sqrt( 1 - $rad**2 ), $rad ) ;
    return $ret ;
    }

sub deg2rad {
    my ( $deg ) = @_ ;
    return ( $deg * $pi / 180 ) ;
    }

sub rad2deg {
    my ( $rad ) = @_ ;
    return ( $rad * 180 / $pi ) ;
    }
```

But, among everything else, this code has the problem that we avoided by creating the `Location` objects in the first place. We _could_ call it like `haversine( $here->latitude, $here->longitude, $there->latitude, $there->longitude )`, but wouldn't we rather do `haversine( $here, $there )`? I know I would.

This gets us into **Roles**, a subject I understand intellectually but don't know how to make my code handle. In this case, we want objects that aren't necessarily `Location` objects but have `latitutde` and `longitude`, with corresponding error checking, and if your existing library has that, it should work with that.

### The Next Section Needs No Introduction

```perl
package Location;

use utf8;
use feature qw{ postderef say state switch };
no warnings qw{ experimental::postderef experimental::smartmatch };

use Carp;
use Moose;
use YAML qw{ LoadFile };

use GoogleGeo qw{ geocode geolocate };
use DarkSky qw{ forecast };

has 'latitude' => (
    isa      => 'Num',
    is       => 'rw',
    required => 1,
    default  => 0,
    trigger  => \&_check_latitude
);

has 'longitude' => (
    isa      => 'Num',
    is       => 'rw',
    required => 1,
    default  => 0,
    trigger  => \&_check_longitude
);

has 'altitude' => (
    is      => 'ro',
    lazy    => 1,
    builder => '_find_altitude',
);

has 'timezone' => (
    is      => 'ro',
    lazy    => 1,
    builder => '_get_timezone',
);
has 'offset' => (
    is      => 'ro',
    lazy    => 1,
    builder => '_get_offset',
);
has 'temperature' => (
    is      => 'ro',
    lazy    => 1,
    builder => '_get_temperature',
);
has 'conditions' => (
    is      => 'ro',
    lazy    => 1,
    builder => '_get_conditions',
);

sub _check_latitude {
    my ($self) = @_;
    croak 'Latitude Too Big' if abs $self->latitude > 90;
}

sub _check_longitude {
    my ($self) = @_;
    croak 'Longitude Too Big' if abs $self->longitude > 180;
}

sub _find_altitude {
    my ($self) = @_;
    if ( $self->{altitude} ) { return $self->{altitude} }
    $self->{altitude} = ( int rand 30_000 ) - 500;
    return $self->{altitude};
}

sub _get_timezone {
    my ($self) = @_;
    if ( $self->{timezone} ) { return $self->{timezone} }
    $self->_get_forecast();
    return $self->{timezone};
}

sub _get_offset {
    my ($self) = @_;
    if ( $self->{offset} ) { return $self->{offset} }
    $self->_get_forecast();
    return $self->{offset};
}

sub _get_temperature {
    my ($self) = @_;
    if ( $self->{temperature} ) { return $self->{temperature} }
    $self->_get_forecast();
    return $self->{temperature};
}

sub _get_conditions {
    my ($self) = @_;
    if ( $self->{conditions} ) { return $self->{conditions} }
    $self->_get_forecast();
    return $self->{conditions};
}

sub _get_currently {
    my ($self) = @_;
    if ( $self->{currently} ) { return $self->{currently} }
    $self->_get_forecast();
    return $self->{currently};
}

sub _get_forecast {
    my $self     = shift;
    my $forecast = forecast( $self->latitude,     say STDERR $json->encode($forecast);
    $self->{timezone}    = $forecast->{timezone};
    $self->{offset}      = $forecast->{offset};
    $self->{temperature} = $forecast->{currently}{temperature};
    $self->{conditions}  = $forecast->{currently}{summary};
    $self->{currently}   = $forecast->{currently};
}

# sets location to Null Island, the point near Africa where lat = 0 and lng = 0
sub clear {
    my $self = shift;
    $self->latitude(0);
    $self->longitude(0);
}

# uses Google Geolocation API to determine (rough) latitude and longitude
sub here {
    my $self = shift;
    state $geofile = $ENV{HOME} . '/.googlegeo.yaml';
    croak 'no Geolocation config' unless -f $geofile;
    state $keys = LoadFile($geofile);
    my $location = geolocate( $keys->{geolocate} );
    $self->latitude( $location->{lat} );
    $self->longitude( $location->{lng} );
    return $self;
}

sub latlong {
    my $self = shift;
    return wantarray ? ( $self->latitude, $self->longitude ) : join ',',
      $self->latitude, $self->longitude;
}

# uses Google Geocode API to determine where a given
# location is, based on latitude and longitude
# (nation, state, city, address, etc.)
sub code {
    my $self = shift;
    state $geofile = $ENV{HOME} . '/.googlegeo.yaml';
    croak 'no Geolocation config' unless -f $geofile;
    state $keys = LoadFile($geofile);
    croak 'no Geolocation config' unless -f $geofile;
    my $location = geocode(
        $keys->{geocode},
        {
            lat => $self->latitude,
            lng => $self->longitude
        }
    );
    return $location->{results};
}

1
```

I can provide my code for `GoogleGeo` and `DarkSky` on request -- they're very simple, and getting the API keys is the most difficult part -- but the interaction I'm hoping for is getting this code to the next level. How to _use_ the `Location` objects in other functions -- although, as I write this, `$here->distance($there)` also seems like reasonable syntax -- and how to more easily specify that some values time out, those are the things I hope to understand next.

And, come to think of it, my code is far more _verbose_ than the code I see when skimming through other OOP code, so if I'm also being unnecessarily wordy, that'd also be a good thing to work on.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
