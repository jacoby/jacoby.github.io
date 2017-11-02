---
layout: post
title:  "IO::Interactive and debugging"
author: "Dave Jacoby"
date:   "2017-10-23 10:30:05 -0400"
categories: 
---

If I was to write more on *Modules I Love*, one of the first I'd write up is [`IO::Interactive`](https://metacpan.org/pod/IO::Interactive).

```perl
use IO::Interactive qw{ is_interactive interactive } ;

say { interactive } 'This only prints out if run interactively' ;
say 'same with this!' if is_interactive() ;
```

My general case is to have verbose output when running interactively, but silent except on error when run as crontab or something, so for this case, `say {interactive} $output;` works very well for me.

But, if I then want to pipe to a file and think through what the verbose output is telling me, then `program.pl > output.txt` counts as non-interactive. Therefore, I have started using a construction like `say $output if is_interactive() || $config->{ debug } ;` a *lot*.

There are two problems with this. First of all, this leaves the hashref `$config` as a global, and I'm trying to stop using globals. This isn't a big thing, but it is a thing I think I need to change about my code.

Second, if you use a complex construction more than a few times, you should make a function out of it. So, I'm thinking I need to make some sort of `conditional_say()` command. First concept is using `state` to keep a flag whether we're in debug mode, or something, but maybe using a `local $debug = 0` construct.