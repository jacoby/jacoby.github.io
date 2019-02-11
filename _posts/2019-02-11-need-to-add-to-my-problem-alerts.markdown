---
layout: post
title:  "Need to Add to my Problem Alerts"
author: "Dave Jacoby"
date:   "2019-02-11 13:23:11 -0500"
categories: ""
---

I will start with the fact that everyone is alright. At least, as far as I have heard. I think this is important context.

The school where I work is powered, at least in part, by a power plant just south of campus. This weekend, I am told, there was some maintenance, which resulted in an unexpected arc of electricity, which made parts of campus dark.

The dark parts of campus include a VM which holds a mission-critical VM, some switches in a core machine room, a few servers for general student-staff-and-faculty use, the research computing tape backup system, and something between our campus' restaurants and coffee shops and credit card companies, which means the Union's Starbucks is cash-and-carry today.

The "Dave, you are _not_ going to have a good day" part is that VM. By volume, it is our core service. Right now, the VSphere server is up, but the place where the hard drives live isn't, so nothing is going.

Again, nobody (I am told) is hurt, but everybody on campus (I am sure) is inconvenienced at least in some way. I _think_ half the lab uses a DHCP server that is out as well. But the _main_ problem for me was that servers were unavailable and I didn't know until I walked in the door and started getting "What's going on?" questions.

I don't know for sure how to overcome this problem. The main machine I would use to continually hit port 80 and send alerts is powered by the same generator that went down, and I didn't see when it came up. My first indication that something happened was finding that all my virtual desktops were empty when I came in and logged on. 

I **hate** being blindsided like that.

If I could trust 1) my Linux desktop would have consistent power and 2) that it would also have a pipe out, I could write a thing that every _time period_ would check a page to see if the web servers are up and use [Pushover](https://pushover.net/) (my to-mobile alert tool of choice), but the problem with this is the exact one I just had: how can you monitor a service if the monitor is down?

I suppose put that on a Raspberry Pi at home or something. We'll see.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


