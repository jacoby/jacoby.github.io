---
layout: post
title: "Clean up your Perl boilerplate with 'experimental'"
author: "Dave Jacoby"
date: "2019-10-15 11:08:51 -0400"
categories: ""
---

I have a regular header that I use for new Perl things, carrying things that I might not even need, but will want.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

# real code starts here
```

I think, if you spend time with Perl 5, you'll know most of that.

- `env perl` makes it easy to use your Perl, not system Perl.
- `strict` restricts some of the more widely-abusable aspects of Perl, and
- `warnings` gives you more control over what things Perl will complain about.
- `feature` gives you a bunch of the new _Modern Perl_ things that we love. I like putting them in explicitly rather `use Modern::Perl` or `use 5.30`. (Is that the right syntax?)
- But the experimental features tell you they're experimental, so I use `no warnings` to silence the "Hey, did you know that you're using an experimental feature?" warnings.

But this morning, I was told about a better way.

[experimental](https://metacpan.org/pod/experimental).

Now, my boilerplate would look like:

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ say state };
use experimental qw{ postderef signatures switch } ;

# real code starts here
```

`say` (implicit newlines after `print`) and `state` (lexically-scoped variables) came in 5.10, so they're not remotely experimental. But the others...

- `postderef` allows me to use `$arrayref->@*` instead of `@$arrayref`, and `$arrayref->[0]` instead of `$$arrayref[0]`, which I think are more clear.
- `signatures` mean I can write subroutines like `sub my_code ( $id , $count = 0 ) { ... }` instead of having to pul these things out of `@ARGV` myself.
- `switch` uses `smartmatch` which I haven't liked to use explicitly, but I pull out switch statements _just_ often enough for me to want to have it ready.

And now, instead of `gimme experimental features; shut up about my experimental features;`, there's syntax that in one line.

It's not a _big_ change, granted, but it makes things look just that much nicer. I approve.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
