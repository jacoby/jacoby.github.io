---
layout: post
title: "Interesting Abuse (?) of Perl Modules"
author: "Dave Jacoby"
date: "2019-05-22 12:08:14 -0400"
categories: ""
---

We start with this minimal Perl program.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;

use lib '/home/jacoby/lib';
use LogMe;

sleep 60;
```

Sleep is built-in, so, what does `LogMe` do?

```perl
package LogMe;

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental::postderef experimental::signatures };

use Log::Log4perl;
use UUID::Tiny ':std';

my $uuid;

BEGIN {
    $uuid = create_uuid_as_string( UUID_TIME, time );
    my $status = qq{LogMe Begin: $uuid };
    Log::Log4perl::init('/home/jacoby/.log4perl.conf');
    my $logger = Log::Log4perl::get_logger('jacoby.logme');
    $logger->info( 'INFO: ' . $status );
}

END {
    my $status = qq{LogMe End: $uuid };
    Log::Log4perl::init('/home/jacoby/.log4perl.conf');
    my $logger = Log::Log4perl::get_logger('jacoby.logme');
    $logger->info( 'INFO: ' . $status );
}

1
__DATA__

The UUIDs here are so I can connect the Begins and Ends in the log.

And the conf

log4perl.logger.jacoby.logme            = INFO, Appender2
log4perl.appender.Appender2             = Log::Log4perl::Appender::File
log4perl.appender.Appender2.filename    = /home/jacoby/.logme.log
log4perl.appender.Appender2.layout      = PatternLayout
log4perl.appender.Appender2.layout.ConversionPattern=%d-%p-%H-%m%n

So the log looks like

2019/05/22 11:55:28-INFO-oz-INFO: LogMe Begin: 04e6fe41-7caa-11e9-b51b-f8899d319d10
2019/05/22 11:56:28-INFO-oz-INFO: LogMe End: 04e6fe41-7caa-11e9-b51b-f8899d319d10
```

The `LogMe` module is less a module than a trojan horse smuggling `BEGIN` and `END` blocks. In this case, those blocks use `Log::Log4perl` to indicate that the program that uses them starts and finishes.

([More on `BEGIN` and `END` blocks](https://perldoc.perl.org/perlmod.html#BEGIN%2c-UNITCHECK%2c-CHECK%2c-INIT-and-END))

I wrote this a while ago, and I vaguely recall the point being to have a quick-and-easy way to tell which programs in my code base are used, how often, so I can judge which programs are worth the time to understand and refactor.

This, as is, does not do that. You'd want to `use Cwd qw{abs_path}` and `$caller = abs_path( $ENV{_} )` for that. If I had figured this out before, I likely would've used it already, instead of leaving it abandoned for months.

I like this idea. I think it's clever. But there is something about a module that just gets `use MyModule` without explicitly being told to do something that gives me willies.

Additionally, this sort of thing can be added to any other module.

This use case — knowing what programs you're actually using — this is acceptable to me, but this is not the reason for `BEGIN` and `END` blocks so this should be counted as *ab*use, not use. But it works.

Is this less creepy than I think it is? Would you use this? Why?

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
