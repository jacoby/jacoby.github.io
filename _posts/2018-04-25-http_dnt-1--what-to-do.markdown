---
layout: post
title:  "HTTP_DNT: "1" - What To Do?"
author: "Dave Jacoby"
date:   "2018-04-24 16:11:53 -0400"
categories:
---

**`HTTP_DNT: "1"`**

**`navigator.doNotTrack: true`**

I always say I do "Web but Not Web". I use common technologies that use ports 88 and 443 -- HTML, CSS, Javascript, jQuery, Bootstrap, JSON, curl, etc -- but my work is creating interfaces so science can be done. We're not ad-driven and we're not general access, and our users can spend in the thousands of dollars for one transaction.

And so, while we have `HTTP_DNS: 1`, we also have `REMOTE_USER: "jacoby"`. So, I'm saying "This is who I am; give me access to everything I have done and can do", but I am also saying "Do not track me".

I can say that I have only really looked at the server log files twice. Once because ... well, assume a URL `http://example.com/test/test.html`. You're already on `http://example.com/index.html` and want to a link to test.html. You could make it to `test/test.html` or `/test/test.html`, or use the full. Or, as it turns out, you could make it `http:///test/test.html`. I think. Why would you do such a thing? No clue. But some of our links were exactly that. And, it turns out Chrome and Firefox do (did?) the "right thing" and recognized that you meant `http://example.com/test/test.html`, but (at the time) Safari did not. This seems straightforward in that telling, but it was `$user` couldn't get to `$page`, so what is that user and what browser.

(I reported a "This is **really** stupid" bug to Safari, which crashed the ticket tracker, so I reported that as well.)

The other ... I can't recall if there was a bad outcome related to it, I recall finding that a grad student from Georgia Tech was connecting via a Chinese-language browser built upon the IE (6? 5?) engine.

Otherwise, I see the error log, but I see time, client IP address (which mostly doesn't matter), and a long list of the failings of my code. Well, mostly. And I ignore them anyway.

That's two cases where I tracked, one ending with "So _that's_ how Chinese people browse" and one with a real solved problem.

I know there's lots of things that show up in the server-side environment variables that could be used, beyond `REMOTE_ADDR`, `REMOTE_USER` and the lie that is `HTTP_USER_AGENT`, if I start pulling things out of the DOM like `window.innerHeight`, `window.innerWidth` and `navigator.platform`, etc., I could probably distinguish two machines coming from behind a firewall, but why? If I was trying to determine from your searches if you're the one searching for `running bassett hounds` so I can put more dog pictures in your ads, that would be one thing, but I only care about the one thing: Are you the person who submitted this job to us? 

So, I guess my question is, both in my current position and in the greater context of being a web developer in 2018, what should I be doing to respect the Do-Not-Track flags? Is maintaining server-level logs still a thing? 

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
