---
layout: post
title: "Perl and Raku Conference in the Cloud 2020 - Day 1"
author: "Dave Jacoby"
date: "2020-06-24 12:53:12 -0400"
categories: ""
---

### Perl 7

This is the first and foremost thing from today.

[Sawyer, our Pumpking, announced Perl 7.](https://www.youtube.com/watch?v=6wPMh-3qYJM) [brian d foy, Perl blogger of note, wrote an explainer.](https://www.perl.com/article/announcing-perl-7/) Between the two, you should be able to access most of the details.

Because I need an excuse to blog, here's my standard boilerplate for a new Perl program:

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings qw{ experimental };
```

That's a _lot_, and I'm likely missing lines that I should be leaning on, including these from brian's blog:

```perl
#!/usr/bin/env perl

use v5.32;
use utf8;
use warnings;
use open qw(:std :utf8);
no feature qw(indirect);
use feature qw(signatures);
no warnings qw(experimental::signatures);
```

And, with Perl 7, it might just be this:

```perl
#!/usr/bin/env perl7

```

This is because all the good stuff, the stuff that has modernized since 2002, will now be on by default (and some of the bad old things will be off by default) so that you can come in with just the hashbang and be able to write the code you want to write.

That will be the _only_ change. It's Perl, but optimized for people who are learning _now_, solving problems _now_, and not for people who wrote a thing and put it on CPAN years ago. 5.32 will still be supported, but we won't be maintenance-only, holding back progress for the sake of legacy code.

[ I love this plan! I'm excited to be a part of it!](https://www.imdb.com/title/tt0087332/quotes/qt0475965)

### Data Logging

There is a _lot_ to this one. Using small devices like the [Raspberry Pi](https://www.raspberrypi.org/) and [Arduino](https://www.arduino.cc/) to collect scientific data. I've _used_ both Arduino and Raspberry Pi, but never together, and I've never really hung any sensors off one. I've _thought_ about it, and even priced [Power-over-Ethernet Pi Hats](https://www.raspberrypi.org/products/poe-hat/).

There's many versions that the presenter discusses, with many different ways to interact with the GPIO pins and such. I'm no longer at the job where temperature and humidity sensing with a Raspberry Pi makes sense, but I'm trying to remember which box I placed my stuff.

[Slides](https://docs.google.com/presentation/d/e/2PACX-1vTA72TQJfUiKSrUGcDO4JS09weJVOKaqKjzUJZF6kILFTTjoX-8YrHPZY9b1Qu1kkmYb2j0BI5lpN4D/pub?start=false&loop=false&slide=id.g70037afdb1_0_6)

[Video](https://www.youtube.com/watch?v=V0GKykOCPzM)

### Awaiting Mojolicious

[Joel](https://twitter.com/joelaberger/) goes deep into [Mojolicious](https://mojolicious.org/), ending with the addition of the magical `async` and `await`.

It was a warp speed pass-through, but because slides are available, I'm happy for this because I know I can follow in his footsteps and replicate the results.

As well as mocking services!

Thinking that making a simple wiki in Mojo might be a good Hello-World-y project to get this under my fingers.

[Link](https://github.com/jberger/AwaitingMojolicious)
[Slides](https://jberger.github.io/AwaitingMojolicious/#/)
[Video](https://www.youtube.com/watch?v=I5xS2NcMzJU)

### Perl and WebAssembly

So, compiled languages compile to assembly, and you can now have your compiled language compile to [WebAssembly](https://webassembly.org/), where [the executable runs in a browser](https://caniuse.com/#search=WebAssembly).

[This is how we have WebPerl.](https://webperl.zero-g.net/)

The tools I'm seeing are much more about using compiled WASM libraries in Perl (and I _think_ about allowing you to compile it) than about running your Perl logic as WASM. WASM _shines_ for CPU-bound tasks and most easily deals with numeric types, so although they're working on methods to pass C-style strings and such, the things we use Perl for are not really what we'd want WASM for.

[Video](https://www.youtube.com/watch?v=T_o51JnI11U&t=629s)

### Web Dev: Generations

[@preaction](https://twitter.com/preaction) follows Web Development techniques from the origins in 1990, through the various attempts to move us to modern layout and such, through JSON and AJAX and LocalStorage etc, to [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) and [FlexBox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/), two things I've seen mentioned but haven't touched. I'll totally cop to not _deeply_ being a web dev over the last decade.

[Video](https://www.youtube.com/watch?v=AXhosJLAeUs)

### Lightning Talks

The Lightning Talk videos have yet to be separated out, so I won't link them here, but here are a few of the things I was amused by.

**Six Do-Nots For [Duck Debugging](https://en.wikipedia.org/wiki/Rubber_duck_debugging)**

- No singing
- No shunning
- No other animals
- No more than 12 ducks
- No feeding after midnight
- If your ducks talk back, seek help

Your Android phone is a linux computer, so you can run Perl on your Phone, starting with [Termux](https://play.google.com/store/apps/details?id=com.termux). I'm not wanting to run Perl on my pocket supercomputer,  but it is a thing you can do. In fact, I recall a friend blogging about [connecting his HTC Evo to a VT125](http://worldofvax.blogspot.com/2010/08/), so this sort of thing is stuff you've been able to do for a decade.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
