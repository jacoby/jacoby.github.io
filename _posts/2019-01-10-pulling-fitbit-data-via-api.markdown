---
layout: post
title: "Pulling FitBit Data via API"
author: "Dave Jacoby"
date: "2019-01-10 15:57:18 -0500"
categories: fitbit
---

I'm in my seventh year as a FitBit wearer. Years ago, I [wrote some tools that pulled my data via their API](https://github.com/jacoby/fitbit_tools), but then FitBit switched to OAuth 2.0, and my tools broke. I tried to wrap my head around the new system, but I just wasn't able to.

## Tokens

We start with [registering an app on dev.fitbit.com](https://dev.fitbit.com/apps/new). I use the "Personal" connection type, and have the callback set to `https://google.com/`. We use the [API Debug Tool](https://dev.fitbit.com/apps/oauthinteractivetutorial) and the _Authorization Code Flow_. Click the authorization link and you go to your Callback with `?code=[long hexidecimal number]#_=_`, and take the `long hexidecimal number` part. Paste that into the **Code** field of section 1A, and they give you a big `curl` command to run. Run it, and you get a JSON response with four parts:

- **UserId**
- **Scope**, or a list of the sets of FitBit data you may access
- **Access Token**, which you use to access data
- **Refresh Token**, which is used to get a new Access Token after it times out

Save the access token and refresh token. The access token is used like this.

```bash
# pretend this is all on one line
curl    -i
        -H "Authorization: Bearer [Access Token]"
        https://api.fitbit.com/1/user/-/profile.json
```

Which will give you a dump of your profile, including the buttons you have earned.

## Devices

If you send this command --

```bash
# pretend this is all on one line
curl    -i
        -H "Authorization: Bearer [Access Token]"
        https://api.fitbit.com/1/user/-/devices.json
```

-- and you're me, you get --

```json
[
  {
    "battery": "Medium",
    "batteryLevel": 65,
    "deviceVersion": "Charge HR",
    "features": [],
    "id": "NOT_SHARING_THIS_DATA",
    "lastSyncTime": "2019-01-10T16:51:38.099",
    "mac": "NOT_SHARING_THIS_DATA",
    "type": "TRACKER"
  }
]
```

I have one device, so it's an array of one. I don't believe you can have two active fitness trackers at once, but if I added a scale, it would be here as well.

This gets to a _very_ practical point for me: I wear the watch and want the data, but I don't often open up the apps and check, so I am often blindsided by the current battery drain and failure (on occasion) to sync.

So I coded

```perl
#!/usr/bin/env perl

# Checks the FitBit API to see what the battery level and
# last sync were, and if too low or too long, sends message
# via Pushover

# to be run daily at 7 am

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental::postderef experimental::signatures };

use DateTime;
use DateTime::Format::ISO8601;
use IO::Interactive qw{interactive};
use JSON;
use Mojo::UserAgent;
use YAML qw{LoadFile};

use lib '/home/jacoby/lib';
use Pushover;

my $json = JSON->new->pretty->canonical;
my $mojo = Mojo::UserAgent->new;

my ( $id, $token ) = get_token();
my $response = check_fitbit($token);

exit;

sub check_fitbit( $id, $token ) {
    my $server = 'https://api.fitbit.com';
    my $url    = join '/', $server, 1, 'user', '-', 'devices.json';
    my $res =
        $mojo->get( $url, { 'Authorization' => "Bearer $token", } )->result;
    if ( $res->is_success ) {
        my $obj                  = $json->decode( $res->body );
        my $batteryLevel         = $obj->[0]{batteryLevel};
        my $days_since_last_sync = check_sync( $obj->[0]{lastSyncTime} );
        if ( $batteryLevel < 20 || $days_since_last_sync > 2 ) {
            send_message( $batteryLevel, $days_since_last_sync );
        }
        say {interactive} $json->encode($obj);
        say {interactive} $batteryLevel;
        say {interactive} $days_since_last_sync;
    }
    else {
        fix_fitbit();
        exit;
    }
}

sub check_sync ( $lastSyncTime ) {
    my $f    = 'floating';
    my $iso  = DateTime::Format::ISO8601->new;
    my $last = $iso->parse_datetime($lastSyncTime)->set_time_zone($f);
    my $now  = DateTime->now()->set_time_zone($f);
    my $diff = $now->subtract_datetime($last)->in_units('days');
    return $diff;
}

sub send_message ( $batteryLevel, $days_since_last_sync ) {
    my $message;
    $message->{title}   = 'FitBit: Maintenance Required';
    $message->{message} = <<"END";
Battery Level: ${batteryLevel}%
${days_since_last_sync} days since last sync
END
    say $json->encode($message);
    pushover($message);
}

sub fix_fitbit () {
    my $message;
    $message->{title}   = 'Fix FitBit';
    $message->{message} = 'Token did not work';
    pushover($message);
}

sub get_token () {
    my $file = '/home/jacoby/.fitbit.yml';
    if ( -f $file ) {
        my $yaml = LoadFile($file);
        return $yaml->{id}, $yaml->{token};
    }
    exit;
}
```

I use [Pushover](https://pushover.net/) as a quick-and-easy way to send myself messages without incurring SMS charges. I can share more on that, but the key here is that we extract the last sync and battery level, and if they're too low or too long ago (depending), and send the message to my phone (something that I'm going to have around and working).

I have other things written, and realize I need to build the reset tool, but this is enough for now. 

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
