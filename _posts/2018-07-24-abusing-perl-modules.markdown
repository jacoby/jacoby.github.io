---
layout: post
title:  "Abusing Perl Modules"
author: "Dave Jacoby"
date:   "2018-07-24 10:43:36 -0400"
categories: 
---

You can't always trace ideas. This one, I can.

David Farrell of [Perl.com](https://www.perl.com/) wrote about [Patching Perl](https://www.perl.com/article/patching-perl-loading-modules-that-return-false/), handling the detail that Perl modules always return true, so it's convention that the least you need for a Perl module is `package PackageName ; 1`, but you may not _like_ that behavior. (It's cool. Read it. Learn from it.)

The other is ... unspeakable. Let us not speak of it.

But, given the only things you _need_ for a package is `package PackageName ; 1`,but we normally add `sub new ( $class ) { ... }` for old-school OOP or `use Exporter qw(import) ; our @EXPORT = qq{ ... }` for a more standard way. We do this because the _point_ of libraries is code encapsulation, or at least grouping. You want to deal with Foo? `use Foo; my $foo = Foo->new()` or maybe `use Foo qw{foo} ; my $out = foo($in);`.

But, given that we _have_ this way of functions, what could we do with it? How could we abuse Perl functions in ways that _might_ be useful to us, but would clearly disguise functionality from others?

First-pass, my thought was that you could add Logging.

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
```

What's happening here? Perl has five code blocks: `BEGIN`, `UNITCHECK`, `CHECK`, `INIT`, and `END`. `BEGIN` runs as close to the beginning of execution as possible and is commonly used to ensure configuration is set to avoid race conditions. `END` happens once everything is done, assuming there is no abnormal end.

In this case, `[Log::Log4perl](https://metacpan.org/pod/Log::Log4perl)` logs each time the program starts and ends, and we include a UUID to ensure that we can match each start and end, so we have a sense of which times it doesn't end properly.

I don't use the _easy_ settings for `Log4Perl`.

```
log4perl.logger.jacoby.logme            = INFO, Appender2
log4perl.appender.Appender2             = Log::Log4perl::Appender::File
log4perl.appender.Appender2.filename    = /home/jacoby/.logme.log
log4perl.appender.Appender2.layout      = PatternLayout
log4perl.appender.Appender2.layout.ConversionPattern=%d-%p-%H-%m%n
```

This gives us this style of logging.

```
2018/07/24 11:21:05-INFO-oz-INFO: LogMe Begin: 2ec9bc90-8f55-11e8-82c4-bb26c0b07d34
2018/07/24 11:21:05-INFO-oz-INFO: LogMe End: 2ec9bc90-8f55-11e8-82c4-bb26c0b07d34
```

The question from here is **why do this?** Well...

- **Do people use this?** You would have to add fun with `AUTOLOAD`, meaning you might call `use LogMe qw{module_name}` and have that function name become part of `$status`. If, after a while of logging, you realize that this is rarely called, you could refactor or retire the code, or if it's called constantly, you could start looking at *XS* or other ways to improve it.
- **Bolt-On Debugging** Everything involved here is in one library assignment, so you get this without changing anything in the original code.

Otherwise, I can't see it. I *clearly* wrote this as an exercise, to scratch a curious itch, to expand my Perl powers and to add another article to my blog. 

So, I ask my readers: Where would you use this? And what benefit do you see in disguising functionality and hiding it from your users?

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
