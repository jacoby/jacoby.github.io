---
layout: post
title: "Fighting the Bus Factor with Log4Perl"
author: "Dave Jacoby"
date: "2018-08-17 13:13:13 -0400"
? categories
---

![ A Bus ](/image/bus.jpg)
[By Littletung - Own work, CC BY-SA 3.0, ][https://en.wikipedia.org/wiki/Big_Blue_Bus)
https://commons.wikimedia.org/w/index.php?curid=26397084

Ever heard the phrase ["Bus Factor"?](https://en.wikipedia.org/wiki/Bus_factor) In a nutshell, it relates to what happens if someone in your organization got "hit by a bus". It doesn't have to be literal; changing jobs is sufficient.

A co-worker went to part-time here and part-time elsewhere in the organization. He then became available for occasional consulting. His code is now on my lap. It's mostly bash, organized the way he understood but I certainly do not. I don't understand how it works and how it is called.

I **do** understand Perl, and the wonderful power of Log4perl.

[Log::Log4perl](https://metacpan.org/pod/Log::Log4perl) is Perl's take on Log4J, with a *lot* of options.

I wrote a quick thing that would log anything you put in `@ARGV`.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental::postderef experimental::signatures };

use Log::Log4perl;

my $config = join '/', $ENV{HOME}, '.log.conf';
my $argv = join ' ', @ARGV;

Log::Log4perl::init($config);
my $logger = Log::Log4perl::get_logger('log_me');
$logger->warn($argv);
```

Log::Log4perl isn't in Core, but it is *very* useful.

So, now, if I run `log_me.pl test`, I get

```
2018/08/17 11:06:23 WARN localhost.example.com: test
```

Because most of the magic is in the config.

```
log4perl.logger.log_me                  = TRACE, Appender0
log4perl.appender.Appender0             = Log::Log4perl::Appender::File
log4perl.appender.Appender0.filename    = /home/jacoby/.log_me.log
log4perl.appender.Appender0.layout      = PatternLayout
log4perl.appender.Appender0.layout.ConversionPattern=%d %p %H: %m%n

##  log4perl.logger.log_me                  = TRACE, Appender0
##              TRACE is the minimum level that will be logged
##                  (FATAL,ERROR,WARN,INFO,DEBUG)

##  log4perl.appender.Appender0             = Log::Log4perl::Appender::File
##              Appender0 is the ID of the appender we're using
##                  Screen, File, Socket, DBI, RRDs
##                  We append to file so it can occur without watching

##  log4perl.appender.Appender0.filename    = /depot/gcore/apps/dev/dave/.log_me.log
##              filename is the name of the logfile

##  log4perl.appender.Appender0.layout      = PatternLayout
##  log4perl.appender.Appender0.layout.ConversionPattern=%d %p %H: %m%n
##              Date time LogLevel Host: the log test \n
##              2018/08/17 10:59:39-WARN-localhost.example.com-AGAIN
```

I document the meaning of the five lines above. Presumably, I could add much more complex behavior, but what I need is simple. I need to know what is called, how often, and where.

```bash
# Logging usage for triage in understanding and refactoring - DAJ 201808
me="$(basename "$(test -L "$0" && readlink "$0" || echo "$0")")"
/home/jacoby/log_me.pl $me
```

The `me` line gets to the right file name when symlinked (according to [this answer on Stack Overflow](https://stackoverflow.com/questions/192319/how-do-i-know-the-script-file-name-in-a-bash-script); hey, I am not strong in my bash-fu), and I have pasted that into the top of every shell script in the directory in question.

```
2018/08/17 13:20:13 WARN localhost.example.com: should_blast_be_queued.sh
2018/08/17 13:30:22 WARN localhost.example.com: should_blast_be_queued.sh
2018/08/17 13:30:22 WARN localhost.example.com: runs_status.sh
2018/08/17 13:30:22 WARN localhost.example.com: runs_status.sh
2018/08/17 13:40:12 WARN localhost.example.com: should_blast_be_queued.sh
2018/08/17 13:45:19 WARN localhost.example.com: user_warning.sh
2018/08/17 13:50:15 WARN localhost.example.com: should_blast_be_queued.sh
2018/08/17 14:00:26 WARN localhost.example.com: should_blast_be_queued.sh
2018/08/17 14:10:12 WARN localhost.example.com: should_blast_be_queued.sh
2018/08/17 14:20:13 WARN localhost.example.com: should_blast_be_queued.sh
```

The point of this is triage: The program most often run is the program I should understand the most. Looks like `should_blast_be_queued.sh` is high up in the priority list so far.

As is looking both ways at the intersection. 

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
