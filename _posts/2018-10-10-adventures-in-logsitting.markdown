---
layout: post
title: "Adventures in Log-Sitting"
author: "Dave Jacoby"
date: "2018-10-10 15:55:13 -0400"
? categories
---

![It's LOG!](/images/log.jpg)

I have a large code base I am trying to understand and triage, and in order to prioritize things, I wrote `log_me.pl`.

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

This is what is known in the development community as "The Dumbest Thing That Could Possibly Work", and it does. when I run `log_me.pl foo bar test weasel`, it logs:

```logs
2018/10/10 15:30:14 WARN example.edu: foo bar test weasel
```

So, in a whole bunch of shell scripts, I add:

```bash
me="$(basename "$(test -L "$0" && readlink "$0" || echo "$0")")"
/path/to/my/bin/log_me.pl $me
```

And I'm working on `runs_status.sh`, which has _too_ _many_ _flags_. I _believe_ the only ones that ever get used are `-v`, `-r`, `-p` and `-S`.

But I **DON'T KNOW FOR SURE!**

So I add some things.

```bash
argv=""
for var in "$@"
do
    argv="$argv $var"
done
me="$(basename "$(test -L "$0" && readlink "$0" || echo "$0")")"
/depot/gcore/apps/dev/dave/log_me.pl $me $argv
```

So I would get:

```logs
    2018/10/10 15:30:31 WARN example.edu: runs_status.sh -p -S
```

But instead I get.

```logs
    2018/10/10 15:30:31 WARN example.edu: runs_status.sh -p -S
    2018/10/10 15:30:31 WARN example.edu: runs_status.sh 
```

If I had paid attention to the logs before, I would've noticed the doubling behavior, but here it is again. Without the flags. 

**HINT!**

Because elsewhere in `runs_status`, there's this.

```bash
    source qsub_load.sh 
```

And `qsub_load` also contained

```bash
me="$(basename "$(test -L "$0" && readlink "$0" || echo "$0")")"
/path/to/my/bin/log_me.pl $me
```

But because it was sourced, not ran, it gave me $me as `runs_status` not `qsub_load`.

**Bleh.**

The "Oh, _that's_ the problem?" moment came reasonably early, so I only feel reasably dumb here. I'd guess that "know the behavior of what you're logging" would come into play here, but really, learning the behavior is why I'm logging in the first place.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
