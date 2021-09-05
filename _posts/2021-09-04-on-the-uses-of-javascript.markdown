---
layout: post
title: "On the Uses of Javascript"
author: "Dave Jacoby"
date: "2021-09-04 19:50:05 -0400"
categories: ""
---

I have been playing with Vue.js the last few days, and since I have been using Vue to munge my toy JSON into something usable, so the next thing, of course, is to use it for something more useful.

I am an organizer for [HackLafayette/Purdue Perl Mongers](https://purdue.pl/). One of the things I do, as I've slipped on both having interesting talks to give _and_ recruiting others to give interesting talks, is to keep the website up-to-date. Usually, that's:

- open `index.html`
- use a Perl program to generate the only changing parts in the center that are the calendar
- paste that generated HTML into `index.html`
- `git add`
- `git commit`
- `git push` to both GitHub and to the web host, where there's a git hook to put it into Document Root

I _have_ written code that regenerates the whole page, not just the calendar stuff, so instead of copying and pasting, it's just `program.pl > index.html`, but that still require me to move.

As an experiment, I made a version that generated the crucial calendar part in Vue, and found Cross-Origin Resource Sharing (CORS) issues. I only occasionally think about it, because I'm usually starting out with _my_ data being generated, dynamically or statically, by _my_ code. It's normally when I'm going through tutorials that I even think about it. I _get_ how CORS protection is good and important, but here, it got in the way, because it meant I couldn't put Meetup URL into the Vue code like I did with the Perl code.

I _could_ `curl http://example.com/the/meetup/calendar/json > hacklafayette.json` and work from there.

I _could_ try again to talk the admin of the server to add the magic line that says "api.meetup.com is okay by us!".

The admin points out that, should Meetup's servers go down, then our site's calendar would be empty. Of course, there would be several people trying to do all the things to get it back up, and their site, not a Digital Ocean droplet, is the part more likely to keep up.

The _other_ thing is that the site, as-is, is almost entirely static. It brings in jQuery and Bootstrap, with a small amount of JS included. Nothing that would break things too badly if the viewer turned off Javascript. If the Bootstrap-heavy calendar is Vue-generated, then when a user turns off Javascript (and the type of people who would go to a computer user group are more likely than then general population to turn off Javascript), the _only_ point of the website goes away.

So, here I am, asking for a response. Should I stress? Should I keep going as I have? Should I set it up with JS? Is it worth it to engineer the copying of the calendar JSON? Questions? Comments? Suggestions?

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
