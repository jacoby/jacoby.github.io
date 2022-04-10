---
layout: post
title: "Benchmarking while() vs for()"
author: "Dave Jacoby"
date: "2022-04-10 00:23:10 -0400"
categories: ""
---

It starts with a tweet.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Just curious, which loop performs better &#39;while&#39; or &#39;for&#39; as far as <a href="https://twitter.com/hashtag/Perl?src=hash&amp;ref_src=twsrc%5Etfw">#Perl</a> is concerned? <br>I have gut feeling, &#39;for&#39; would win the race, right?</p>&mdash; Mohammad S Anwar (@cpan_author) <a href="https://twitter.com/cpan_author/status/1512485708707299328?ref_src=twsrc%5Etfw">April 8, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I thought about it for a while.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I haven&#39;t put them head-to-head.<br><br>To me, it&#39;s purpose, not performance. If I know exactly how many things I&#39;m looping, that&#39;s for. If it&#39;s &quot;until done&quot;, that&#39;s while.</p>&mdash; Dave (IND ✈️ LAS) (@JacobyDave) <a href="https://twitter.com/JacobyDave/status/1512486187541356544?ref_src=twsrc%5Etfw">April 8, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I think that bears further explanation. Classic `for` loops look like:

```perl
for ( my $i = 0 ; $i < 20 ; $i++ ) { ... }
```

and that's all fine, but to be honest, I hardly use that form. Most of my Perl uses of `for` are much like

```perl
for my $i ( @array ) { ... }
```

and Perl handles iterating through the entries in the array. So, to me, it is purpose-built for static data sets. You don't _have_ to, though.

```perl
# this is a perfectly valid memory-sucking infinite loop
for my $i ( @array ) {
    push @array, $i * 2;
}
```

`while`, however, is built for when the size of the problem set is dynamic and unset. If you want to start now and keep going until it's over, that's when you pull out `while`.

```perl
while ( #array ) {
    shift @array;
}
```

But clearly, you can do my `while` stuff in a `for` loop, and mechanic ways to do `for` stuff in a while loop. So let's get back to Mohammad's question. How do we determine what's mroe performant?

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Make a list of a billion, loop through it a billion times, compare times.</p>&mdash; Dave (IND ✈️ LAS) (@JacobyDave) <a href="https://twitter.com/JacobyDave/status/1512489185873211392?ref_src=twsrc%5Etfw">April 8, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Friends, this is where we go to [Benchmark](https://metacpan.org/pod/Benchmark). In my case, I didn't want to either wait forever or set fire to my laptop, so I went smaller numbers. Make a list of 1000, loop through it a million times. If you want to find the best (meaning most performant) way to do a thing, this is how we go.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use Benchmark qw(:all);

my $count = 1_000_000;
timethese(
    $count,
    {
        'ForLoop' => sub {
            my @array = 1 .. 1000;
            for (@array) {
                shift @array;
            }
        },
        'WhileLoop' => sub {
            my @array = 1 .. 1000;
            for (@array) {
                shift @array;
            }
        },
    }
);
```

The only difference is that one, we have an iterator going through an array, and one is getting a conditional. I ran this, made conclusions, but didn't realize I wasn't running `for` vs `while` but instead `for` vs `for`. I put it in a Gist and everything. SIlly Dave.

So, right now, I'm running it again, with slightly bigger numbers.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use Benchmark qw(:all);

my $count = 10_000;
timethese(
    $count,
    {
        'ForLoop' => sub {
            my @array = 1 .. 10_000;
            for (@array) {
                shift @array;
            }
        },
        'WhileLoop' => sub {
            my @array = 1 .. 10_000;
            while (@array) {
                shift @array;
            }
        },
    }
);
```

```bash
./forwhile.pl 
Benchmark: timing 10000 iterations of ForLoop, WhileLoop...
   ForLoop:  4 wallclock secs ( 2.69 usr +  0.02 sys =  2.71 CPU) @ 3690.04/s (n=10000)
 WhileLoop:  5 wallclock secs ( 3.55 usr +  0.00 sys =  3.55 CPU) @ 2816.90/s (n=10000)
```

That's a difference toward preferencing `for` over `while`, but again, I'm strongly for purposeful use. The numbers say WhileLoop is slightly slower, but the purpose I use them for makes it more understandable to me. 

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
