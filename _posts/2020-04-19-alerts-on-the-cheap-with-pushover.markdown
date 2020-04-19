---
layout: post
title: "Alerts on the Cheap with Pushover"
author: "Dave Jacoby"
date: "2020-04-19 13:48:12 -0400"
categories: ""
---

This is an idea I have been reminded of recently.

Nearly a decade ago, I started poking at ways to alert me of things, and I first went with [Twilio](https://www.twilio.com/), even [making it one of my first repos](https://github.com/jacoby/SMS-Me), but decided that the pennies per SMS message would turn into dollars, and I didn't want to limit myself.

Eventually, I found [Pushover](https://pushover.net/), which has a dead-simple API and was [much cheaper](https://pushover.net/pricing). One of the things I did was write a script that combined it with IMAP to tell me when people who I cared about emailed me (as opposed to the general "You've got mail!" announcements you normally get), and, eventually, wrote things to alert me when things got wonky at work.

More on that later.

Pushover has a web API, so you can send a message with `curl`.

```bash
curl -s \
  --form-string "token=abc123" \
  --form-string "user=user123" \
  --form-string "message=hello world" \
  https://api.pushover.net/1/messages.json
```

I know lots of people out there like Python...

```python
#!/usr/bin/env python

'''

Module to send Pushover messages in Python

usage:
    pu = pushover.pushover()
    pu.send_message( message )

'''

import os, httplib , urllib
import yaml

class pushover:
    TOKEN = '' ,
    USER  = '' ,
    def __init__(self, myyaml = os.environ['HOME'] + '/.pushover.yml'):
        c = open( myyaml , 'r' )
        c_yaml = c.read()
        c_obj = yaml.load(c_yaml)
        self.TOKEN = c_obj['token']
        self.USER = c_obj['user']
    def send_message(self,message):
        conn = httplib.HTTPSConnection("api.pushover.net:443")
        conn.request("POST", "/1/messages.json",
                     urllib.urlencode({
                        "token": self.TOKEN ,
                        "user": self.USER,
                        "message": message ,
                        }), { "Content-type": "application/x-www-form-urlencoded" })
        conn.getresponse()
```

I use YAML to keep config information out of the code, and that simply looks something like this:

```yaml
---
user: "My User Key"
token: "My Token"
```

Of course, I get deepest with Perl, because me.

```perl
#!/usr/bin/env perl

use feature qw{ say state } ;
use strict ;
use warnings ;
use utf8 ;

use Carp ;
use Pod::Usage ;
use Getopt::Long ;

use lib '/home/jacoby/lib' ;
use Pushover ;

my $message ;
$message->{ help } = 0 ;
GetOptions(
    'message=s' => \$message->{ message },
    'title=s'   => \$message->{ title },
    'device=s'  => \$message->{ device },
    'help'      => \$message->{ help },
    ) ;

if (   $message->{ help } > 0
    || !$message->{ message }
    || !length $message->{ message } ) {
    pod2usage( 1 ) ;
    }
if ( ! pushover( $message ) ) {
    croak "Unsuccessful" ;
    }


__END__

=head1 NAME

pushover.pl  -- Command-line tool to send messages to devices with Pushover.net

=head1 SYNOPSIS

pushover.pl -m "This is a message" -t 'Title!' -d Phone

=head1 DESCRIPTION
```

That's nice and short and decently documented, and all the details are in the lib. I did it twice for ... reasons. One is the simplest one and one has a few more bells and whistles.

```perl
package Pushover ;

# Package to handle connections to Pushover.

use feature qw{ say } ;
use strict ;
use warnings ;
use Exporter qw(import) ;
use Carp ;
use Data::Dumper ;
use LWP::UserAgent ;
use LWP::Protocol::https ;
use JSON ;
use YAML::XS qw{ LoadFile } ;

our $VERSION = 0.0.2 ;

my %prepared ;

our @EXPORT = qw{
    pushover
    send_pushover_message
    } ;
our %EXPORT_TAGS = ( 'all' => [ @EXPORT ], ) ;
our @EXPORT_OK = ( @{ $EXPORT_TAGS{ 'all' } } ) ;

# ----------------------------------------------------------------------
# Soon to be deprecated interface, which had the client do all the work in
# handling the token access
sub send_pushover_message {
    my ( $object ) = @_ ;
    LWP::UserAgent->new()->post(
        "https://api.pushover.net/1/messages",
        [
            #"title"   => 'News from Black Muffin' ,
            "token"   => $object->{ token },
            "user"    => $object->{ user },
            "message" => $object->{ message },
            #"device"  => 'RoyBatty' ,
            ]
        ) ;
    }

# ----------------------------------------------------------------------
# now the standard way to send a message. Takes an object containing at
# least a message string, with optional title and device strings
# returns 1 if successful, else 0
sub pushover {
    my $object = shift ;
    croak "Need message" unless $object->{ message } ;
    croak "Message too short" unless length $object->{ message } > 0 ;
    my $config = LoadFile( $ENV{ HOME } . '/.pushover.yml' ) ;
    my $message_obj ;
    %$message_obj = map { $_ => $config->{ $_ } } keys %$config ;
    $message_obj->{ message } = $object->{ message } ;
    $message_obj->{ title }   = $object->{ title } if $object->{ title } ;
    $message_obj->{ device }  = $object->{ device } if $object->{ device } ;
    my $r = LWP::UserAgent->new()->post(
        "https://api.pushover.net/1/messages.json",
        $message_obj
        ) ;
    if ( $r->code eq '200' ) {
        return 1 ;
        }
    return 0 ;
    }

1 ;
```

If your org is big enough, by all means, you should have a dedicated devices with dedicated institutional alerts like PagerDuty and such. But if it's your stuff, or your organization is small, this is really a good thing.

My problem was, of course, that I left the organization in October, and I forgot to take out the alerts, and the issues that caused me to write the alerts back in the day popped up again, so these alerts have popped off, four times, right after the top of the hour, all weekend.

Ah. Live and learn.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
