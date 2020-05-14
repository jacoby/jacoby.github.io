---
layout: post
title: "I am blogging this evening"
author: "Dave Jacoby"
date: "2020-05-13 23:15:31 -0400"
categories: ""
---

I started to write something else, but gave up on it. So I'm going to spit out some stream-of-consciousness.

### "My Brain Hurts!"

For years, I had collected my Twitter favorites. Mostly, the idea was that I could go back and search for keywords, so looking at every post I liked matching `%kayak%` will return the bounty of all the tweets I'm watching about kayaks, which will allow me to find the proper upper-body workouts I need to make me a world-class kayaker. And so on.

This was as much `teach myself MySQL` as it was `record Twitter`, and as such, I need input _and_ output. So I wrote code to count the top favorited tweeters from the last week and make a `#FollowFriday` post.

[It became a thing.](https://jacoby.github.io/2019/07/05/the-social-experiment-of-followfriday.html)

But I changed jobs, and the machine where I ran the code was old-job-related, and the `#FollowFriday/#FakeNerdFight` code sat idle, until about the beginning of this month, where focus and Gizmo and the stars aligned to have a database I can run things on.

And `cron`.

`crontabs` that don't use an `@-time` like `@daily` or `@monthly` have five fields: minute, hour, day of month, month, and day of week. If, for example, you wanted something to run at the top of every hour of every day in February, it would look like:

```text
    0 * * 2 * /home/you/bin/some_program
```

Mostly, I think about scheduling hourly or daily, so, I wrote a crontab timed with `0 8 5 * *`, which is the fifth day of every month, when I meant `0 8 * * 5`, which means the fifth day, and `cron` starts the week with 1 on Monday.

So, it ran on Tuesday, and Tuesday because the Fifth.

And, in explaining the odd early Nerd Fight to the fighters, I typoed, so [now, the fifth day of each month is now the Day of the Monty](https://twitter.com/JacobyDave/status/1257643363161047040). So, watch and listen to comedy genius, and Fetch ... the _Comfy Chair!_

### Writing

I have some things I've written about my answers to the [Perl Weekly Challenge](https://perlweeklychallenge.org/), but I don't know that I have much to say about that code that isn't [the code itself](https://github.com/manwar/perlweeklychallenge-club/tree/master/challenge-060/dave-jacoby/perl). There's clever there.

The Gumpian all-I-have-to-say-about-that bit is that if you go from `A` to `Z`, then `AA-ZZ`, then `AAA-ZZZ`, you're really doing a base-26 system where `A` equals `0`, but the solution given was one off from that, implying the `A` in `A` is `1`, but the `A` in `CA` is `0`, so there's off-by-one in there.

Now I don't have to blog about the Challenge.

I'm also considering a small, cheap computer. I see lots of small, cheap computers in [Woot](hhttps://www.woot.com/category/computers/desktops). Some of the things I would want to do with it are toy things I don't need to leave my home network. Some of the things involve me testing my connection to the world, because I think the congestion of my neighbors is making my network useless some evenings, and unless I have something running [`speedtest-cli`](https://github.com/sivel/speedtest-cli) locally, I can't find that out. So, for some things, I could throw up a DigitalOcean Droplet, but not for all I'd want it to do.

And I could use a one-board-computer thing like a Raspberry Pi for this, but I kinda don't want to have to hang USB drives off a Pi to make a thing that's useful and looks like Medusa's head.

So I think I know what I want, within reason, but I don't know enough to pull the trigger.

### Mongering

I heard a talk from NY Perl Mongers about redoing [FindBin](https://metacpan.org/pod/FindBin) in [Raku](https://www.raku.org/), and I don't use Raku and don't use FindBin much, so there was a lot I didn't digest, but there was one thing I loved.

`note`.

For reasons, I code the form `print STDERR qq{$value \n}` a _lot_ these days. Long ago, others got tired of `print qq{$value \n}` and wrote `say` so I could simply write `say $value` and make it simpler, but that's still `say STDERR $value`, and I have stumbled to misspell that one a few times.

With Raku, it's `note`. I want that in Perl. I want to add it as a [feature](https://metacpan.org/pod/feature). `use feature qw{say note}` looks good, doesn't it? I threw together a quick implementation and created `Dave::Util`, which is so personal and janky, I don't think it's even `ACME`-level.

Beyond sitting in on various Perl Mongers groups now that they're videoconferencing, I'm organizing Purdue Perl Mongers, and while we've tried WebEx and done Zoom, we've pretty much fallen onto [Jitsi](https://jitsi.org/) as our platform of choice. You _can_ throw up a Jitsi server and serve your own meetings, but we've been working off the main.

We rejected WebEx because the other tester couldn't see my slides, and Zoom _did_ work, but I have found it taxed my not-up-to-snuff internet connection. Jitsi is lighter, works in a web browser, and has tools like record-to-Dropbox and stream-to-YouTube baked into the web client. If you're looking at videoconferencing, give it a look.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
