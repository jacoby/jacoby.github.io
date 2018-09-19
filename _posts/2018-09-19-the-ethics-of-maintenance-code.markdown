---
layout: post
title: "The Ethics of Maintenance Code?"
author: "Dave Jacoby"
date: "2018-09-19 10:04:52 -0400"
categories: ethics
---

![Train_wreck_at_Montparnasse_1895.jpg](/images/Train_wreck_at_Montparnasse_1895.jpg)

I am still reading and rereading a tweetstorm from [Ed Barnard](https://twitter.com/ewbarnard/), an old-school dev from the days of Cray, about [Corporate Ethics and (real, actual) Trainwrecks](https://threadreaderapp.com/thread/1033897908238737409.html).

> The railroad handbooks are "written in blood." Every rule exists because someone died.

I have said "Where there's a sign, there's a story", but that *really* takes it up a notch, doesn't it?

He proceeds to telling about a maple tree that fell in his yard, across his power line.

> Our tree was not the only one to topple that night. Electricians and other contractors were frightfully busy that holiday.
> Once our turn came, the electrician took a good look at the 40-year-old panel of circuit breakers.
> He explained, "I can't touch this unless I first bring it up to code."

The whole thing has been pulled to a thread and is really a great read, well worth thinking about.

And I can't help thinking about that circuit breaker panel.

Due to various sources of attrition, my tech team had dropped from 2.5 FTEs to 1: Me. This means that tasks and whole chunks of the code base that I had left to others have been dropped fully onto my lap.

Much of this code was written in 2002, for a Solaris system, by people who do not remotely think like me, without revision control beyond `program_2004.sh`. (Not meant as a joke, and not far from the truth.)

Certainly there are programs written much more recently, by me, that are closer to what I think of as programming standards. But not entirely. And I hate lots of that.

But for much of that code, I open it up in an editor and think "I can't touch this unless I bring it up to code".

But what does that even mean?

Does that mean taming page after page of global variables until you can tell what does what?

Does that mean putting it under version control?

Does that mean porting it from one language to one you are far more familar with, so the meaning is made clearer?

Or does it mean making the smallest change that could possibly work, so that adding the small requested feature does not monopolize a month of developer time?

Right now, because I am a dev team of one, I feel fully empowered to make whatever ethical choice I feel is right, strong in the belief that the team leader will stand behind any decision I make with regard to these issues.

I just need insight as to what that might be.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
