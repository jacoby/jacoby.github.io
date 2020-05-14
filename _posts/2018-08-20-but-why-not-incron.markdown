---
layout: post
title: "But Why Not INCRON?"
author: "Dave Jacoby"
date: "2018-08-20 10:25:35 -0400"
? categories
---

[ ![ABE Construct](/images/abe_construction.jpg) ](https://www.instagram.com/p/BmefwvOhIg4/)

My friend [Gizmo](https://github.com/gizmomathboy) used Twitter to make a comment on [my previous post on Log4perl](/2018/08/17/fighting-the-bus-factor-with-log4perl.html).

> [I'm also wondering if incron would be easier. Not as fun as learning a dev skill though.](https://twitter.com/gizmomathboy/status/1030824786098827264)

You might be asking ["What is incron?"](http://inotify.aiken.cz/?section=incron&page=about&lang=en). I have asked that as well. It is, as I understand it, a way to start actions based on what's happening on the filesystem, rather than time.

This does sound kinda cool, doesn't it? Gizmo, a system administrator, wanted to use this to determine which software packages to update and upgrade. Why spend time trying to install the new version of `fmeppotron` if nobody uses it anyway?

_Trying to install_ becomes a very important issue.

```
$ which incron
/usr/bin/which: no incron in (/apps/rhel6/gcc/5.2.0/bin:\
/group/bioinfo/apps/apps/R-2.15.1/bin:\
/group/bioinfo/apps/apps/expat-2.1.0/bin:\
/group/bioinfo/apps/apps/ImageMagick-6.8.9-8/bin:\
/group/bioinfo/apps/apps/gsl-2.3/bin:\
/group/bioinfo/apps/apps/tidyp-1.04/bin:\
/group/bioinfo/apps/apps/perl-5.20.1/bin:\
/group/bioinfo/apps/apps/gnuplot-4.6.6/bin:\
/home/djacoby/opt/bin:\
/home/djacoby/local/bin:\
/home/djacoby/webserver/node/bin:\
/home/djacoby/webserver/perl/bin:\
/home/djacoby/bin:\
/usr/lib64/qt-3.3/bin:\
/opt/moab/bin:\
/usr/local/bin:\
/bin:\
/usr/bin:\
/usr/local/sbin:\
/usr/sbin:\
/sbin:\
/opt/hpss/bin:\
/opt/hsi/bin:\
/opt/ibutils/bin:\
/usr/pbs/bin:\
/opt/moab/bin)
```

This means I would have to try to build it, and hope it's happy on both RHEL 6 and CentOS 7. Or, I can ask for it from my admins, who have just denied me access to my database from my desktop. 🤷

The image above is a building on the campus where I work. It is strategically located between where I park and where I work. The back end of the building used to be a shop space where things could be built and stored, but that has been knocked down, and now they're building new classroom and lab space, and keeping the historic old section as office space.

(Beyond being a picture I took and can therefore use,) this is a metaphor for what I'm meaning with the Bus issue discussed earlier. There's a code base that exists, that was built up a long time ago. I find it insufficient for my needs, but I don't want to rebuild everything. I want new functionality based on contemporary requirements — for example, to limit walltime for queued event to time until scheduled downtime — and I need to know the parts I should keep and the ones I can remove, and how they work together.

And if I can get this done with the least amount of learning, then I can get it done much faster.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
