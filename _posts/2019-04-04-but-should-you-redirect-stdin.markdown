---
layout: post
title:  "But SHOULD you redirect STDIN?"
author: "Dave Jacoby"
date:   "2019-04-04 13:41:54 -0400"
categories: ""
---

For a lot of my code, it does one thing at a time, it does it very well, and then it quits. I don't add a lot of flags or logging or notification, I run it in cron, and the _last_ thing I want is a lot of `this was successful` emails in my inbox.

So, a module I use a lot is [IO::Interactive](https://metacpan.org/pod/IO::Interactive). There are two main things I use it for.

```perl
use strict;
use warnings;
use utf8;
use feature qw{ say };

use Getopt::Long;
use IO::Interactive qw{ interactive is_interactive };

my $verbose;
GetOptions( 'verbose' => \$verbose );

say { interactive } "
        This will only print if running interactive, so you cannot
        redirect this output to a file.
    " ;

say "
        This will print if interactive, or if the -v flag is set,
        which means you can run program -v > logfile or something if
        you really need the output;
    " if $verbose or is_interactive;
```

While having `verbose` mode can be useful, I just use `{interactive}` more often than not, because I just don't care. If I needed logging, `Log::Log4perl` is available.

My friend Gizmo asked about that, and wondered about giving a file name. I started wondering about dumping output to files, which lead me to think about redirecting `STDOUT`.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

# Forgive us, Saint Doubt

use Getopt::Long;
use JSON;
use YAML;
use Scalar::Util qw(looks_like_number);
use List::Util qw{uniq uniqnum reduce};

use lib '/home/jacoby/lib';
use oDB;

my $json = JSON->new->pretty->canonical;

my $filename;
GetOptions( 'file=s' => \$filename );

if ( defined $filename ) {
    open STDOUT, '>', $filename;
}

my $data = [];
for my $i ( 0 .. 9 ) {
    for my $j ( 0 .. 9 ) {
        my $k = $i . $j;
        $data->[$i][$j] = $k;
    }
}

say $json->encode($data);
```

This allows you to go `program -f file.json` and get that output in a file, rather than `program > file.json`.

The better thing would be testing on `$filename` and using YAML's `DumpFile` if it contains `.yml`, or `Text::CSV` if `.csv` or whatever format you might want.

Additionally, you _could_ want to see "I'm writing a file" before and "I wrote the file" after, which means you would want to be able to back off that decision.

```
if ( defined $filename ) {
    my $data = [];
    for my $i ( 0 .. 9 ) {
        for my $j ( 0 .. 9 ) { my $k = $i . $j; $data->[$i][$j] = $k; }
    }
    local (*STDOUT);
    if ( open STDOUT, '>', $filename ) { say $json->encode($data); }
}
```

But there isn't anything in that to make it preferable to opening a separate filehandle. I suppose `select` is doable.

So, **St Doubt**, I have become befuddled and seek the proper way.


If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


