---
layout: post
title:  "A Really Clever Thing I Wrote"
author: "Dave Jacoby"
date:   "2017-12-08 16:03:13 -0500"
categories: 
---

I always use `cron`, but I rarely use `at`. I can never remember the syntax.

I wanted to be able to have my computer tell me to do a thing in 10 minutes or so, but before I got my Google Home Mini, and at the office.

This uses AWS Polly, a text-to-speech tool that I love. I am not going to go too much into this. It also uses `notify-osd`, which is why I went back to Ubuntu from Linux Mint. I also won't go into it much here. Just be aware that gentle notifications are Calm Computing and Mark Weiser had the right idea.

`at` is set by `echo rm -rf / | at now + 20 minutes`, if your desired command is total annihilation after you get to minimum safe distance, and your user account has elevated permissions. So, I could make the command to tell me to go get water or whatever and ` | at now + 10 minutes`, but that would mean I need to remember the `at` syntax.

So, I wrote one command that would allow me `command1 --notify -message "WEASELS!"` and another command that would handle piping that command into `at now + 23 minutes`, but it struck me that I shouldn't have two commands when I could have one. 

So I wrote `timer`.

`timer -n -m "WEASELS!"` will immediately send a message. What that means depends on where I am and where my prompt is. My `Locked` module uses many methods to tell if I'm at my computer in my lab or not. `Notify` is my wrapper around `notify-osd`. `Polly` sends a text-to-speech command to AWS and plays it. If that string already exists as audio, it does not regenerate, which is nice. And `Pushover` is a wrapper for [http://pushover.net](Pushover), allowing me to receive messages when I am not at my desk, or even in my lab, as long as I have my phone. There are libraries in CPAN that do this, but I wrote mine before I found that. Handwaving on those issues for now.

    timer --add --time 5 --message 'Say something five minutes from now' 

    timer --notify       --message 'Say something right now' 

Two commands. `timer -a -t 5 -m 'Message'` queues the message, and `timer -n -m 'Message'` is the command it runs. So, yeah, you could run the command `long_task.R && timer -n -m "DONE"` so that, one way or another, you're told when you're done.

``` perl
#!/usr/bin/env perl

use strict ;
use warnings ;
use utf8 ;
use feature qw{ postderef say signatures state } ;
no warnings qw{ experimental::postderef experimental::signatures } ;

use Data::Dumper ;
use DateTime ;
use Getopt::Long ;
use JSON ;
use Log::Log4perl ;
use Pod::Usage ;
use Cwd 'abs_path' ;

use lib '/home/jacoby/lib' ;
use Locked ;
use Notify qw{ notify } ;
use Polly qw{ say_message } ;
use Pushover ;

my $json   = JSON->new->canonical->pretty ;
my $config = config() ;

my $sounds = join '/', $ENV{ HOME }, 'sounds' ;
my $ding = join '/', $sounds, 'kim_possible_beeper_tone.mp3' ;
my $mpg123 = '/usr/bin/mpg123 --stereo --aggressive --quiet ' ;

my $icons = join '/', $ENV{ HOME }, 'icons' ;
my $icon = join '/', $icons, 'icon_black_muffin.alpha.png' ;

my $ymd = DateTime->now()->set_time_zone( 'America/New_York' )->ymd() ;

log_config( $json->encode( { config => $config, ymd => $ymd, } ) ) ;

# notify -- handles the NotifyOSD or Pushover touches
if ( $config->{ notify } ) {
    my $message ;
    $message->{ title }   = 'Timer Message' ;
    $message->{ message } = $config->{ message } ;
    $message->{ icon }    = $icon ;
    log_config( $json->encode( $message ) ) ;

    if ( is_locked() == 0 && !$config->{ pushover } ) {
        notify( $message ) ;
        qx{$mpg123 $ding} ;
        delete $message->{ title } ;
        say_message( $message ) ;
        }
    else {
        pushover( $message ) ;
        }
    }

elsif ( $config->{ add } ) {
    my $time     = qq{now + $config->{time} minutes } ;
    my $program  = abs_path( $0 ) ;
    my $message  = $config->{ message } ;
    my $pushover = $config->{ pushover } ? '-p' : '' ;
    my $command  = join ' ', grep { /./ } "'", $program, $pushover, '-n -m', qq{"$message"}, "'" ;
    qx{echo $command | /usr/bin/at $time &> /dev/null } ;
    }

exit ;

sub log_config ( $message ) {
    Log::Log4perl::init( '/home/jacoby/.log4perl.conf' ) ;
    my $logger = Log::Log4perl::get_logger( 'jacoby.timer' ) ;
    $logger->trace( $message ) ;
    }

sub config () {
    my $config ;
    $config->{ time }    = 5 ;
    $config->{ message } = q{Time's Up} ;
    GetOptions(
        'help'     => \$config->{ help },
        'add'      => \$config->{ add },
        'notify'   => \$config->{ notify },
        'pushover' => \$config->{ pushover },

        'message=s' => \$config->{ message },
        'time=i'    => \$config->{ time },
        ) ;

    pod2usage( { -verbose => 1, -exitval => 1 } ) if $config->{ help } ;

    pod2usage( { -verbose => 1, -exitval => 1 } )
        unless $config->{ add }
        || $config->{ notify } ;
    map { delete $config->{ $_ } unless defined $config->{ $_ } } keys $config->%* ;
    return $config ;
    }

=head1 NAME

timer - send yourself messages

=head1 SYNOPSIS

    timer --add --time 5 --message 'Say something five minutes from now' 

    timer --notify       --message 'Say something right now' 

=head1 DESCRIPTION

This program has two behaviors: send you a message via test-to-speech and notify-osd
if you are currently at your computer and the web service Pushover if you are away,
or creating a message that will be sent via the other behavior after a set number of
minutes

=head1 OPTIONS

=over 4

=item B<-n>, B<--notify>

Flag indicating this will notify

=item B<-a>, B<--add>

Flag indicating this will add a notification. If both -a and -n are set, only -n
will be respected

=item B<-p>, B<--pushover>

Flag to force the use of Pushover, which send the message to mobile devices instead
of the desktop

=item B<-t>, B<--time>

The number of minutes to wait until sending the message

=item B<-m>, B<--message>

The message to be sent. 

=item B<-h>, B<--help>

Display this text

=back

=head1 LICENSE

This is released under the Artistic
License. See L<perlartistic>.

=head1 AUTHOR

Dave Jacoby L<jacoby.david@gmail.com>

=cut

```  

I think this might need it's own repo, but I would need to have some sort of plugin system before it could be `App::timer` or the like.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
