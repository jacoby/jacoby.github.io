---
layout: post
title:  "Asserting Direction on a Directionless Day"
author: "Dave Jacoby"
date:   "2018-03-07 15:23:20 -0500"
categories: 
---

## Globus

Have I talked enough about Globus yet? Is this a thing you have any clue about? 

Globus is a thing I use at work to allow the lab to distribute research data to the users who bring us samples to access the results, and to share those results with collaborators across the world. It really is a pretty fmeppy thing.

But it is a new thing, and with new things there is a learning curve. I have emailed a basic "This is what Globus is and how you use it" text to enough people and have found enough edge cases that it finally became sensible for me to write it up as a general thing.

[Getting Started with Globus](https://github.rcac.purdue.edu/djacoby/GlobusHelp) is on Research Computing's GitHub, and I would love it if you could read it and suggest changes. (As issues to this repo, as you probably don't have permissions to PR the original repo.)

## Our Wonderful Terrible Future

Our VMs were updated. All the horrible things going around require our systems be maintained, and this morning was when they decided to bounce our systems. 

Years ago, for a Startup Weekend event, I dived into messaging, allowing me to [send my phone SMS messages](https://github.com/jacoby/SMS-Me) with [Twilio](https://www.twilio.com/). In the fullness of time, I opted for a less expensive option with [Pushover](https://pushover.net/), and wrote a program that sends me the message `$HOST Rebooted` when run. I then added this line to the crontab files for all the computers I care about.

```
  @reboot          ~/bin/reboot_alert.pl
```

At 7:45am, I heard a number of bell tones, corresponding to the boot notifications for each. I used [JuiceSSH](https://juicessh.com/) to connect to the hosts and make sure they worked, went to a web page to make sure the relational DB was working, and used my Daily Status Report tool to test the Mongo DB. (`dsr` *is* about the only thing I use MongoDB for right now.)

(I don't use a module to interface with Pushover, as it's about the most `curl`-able web service I've ever used. I love it.)

I write this to point out that my level of connection and automation is such that I was aware of the status of my machines, where I could know what's going on and respond to the changes with a device that fits in my hands before I got up and fully engaged with my day.

In many ways, I *so* love the early 21st Century. 

For a contrary view, a good chunk of this day has involved me fighting to get to get under 200 open Chrome tab, because it has been crashing and acting sluggish later. It is a good and wonderful thing that there's so much exciting and new that I put up tab after tab of things I need to get back to, but sad and frustrating that dreams and plans pile up so quickly.

## Note To Self

I am going to give a presentation for [Purdue Perl Mongers](http://purdue.pl/)/[HackLafayette](http://hacklafayette.com/) about "Care and Feeding of your User Group". I would love to hear more about your opinions (because I will give it to at least *a* conference, and this is workshopping it), but this first pass will be a **JIT** talk, with minimal slides done with [cleaver](https://github.com/jdan/cleaver). 

This entry is a reminder that 1) I need to make even the minimal slides and 2) cleaver is what I intend to use. At least for the first pass.



If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
