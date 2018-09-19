---
layout: post
title: "I Find The Strangest Bugs"
author: "Dave Jacoby"
date: "2018-09-19 12:20:45 -0400"
? categories
---

This may be perfect storm of Dave-centric oddness.

- I use Ubuntu 16.04 LTS (which I have to update one day this fall) and run [Visual Studio Code](https://code.visualstudio.com/) as my main editor within
- I use Samba to mount several remote file systems, including one on a research cluster which olds my directory there
- I am doing work with [TORQUE](https://en.wikipedia.org/wiki/TORQUE) to queue tasks that do something that isn't really the topic of this post. Maybe later?

If you give the queue submission script a string with the -N flag, it puts your output from STDOUT -n into `string.oUNIQUENUMBER` and STDERR into `string.eUNIQUENUMBER`.

In a very specific case, I am running `qsub -N 2551 ./p2f.sh` (with all sorts of other flags that do not help the story), generating `2551.e1280822` and `2551.o1280822`. And since I ran it in my development directory, `/home/jacoby/mnt/djacoby/dev/project2fortress` from my desktop, that's where the files ended up.

When I run `code -n 2551*`, the editor opens up 2551.o1280822 just perfectly, but instead of 2551.e1280822, it opens Infinity.

![Infinity](/images/Infinity.png)

This **does not** happen in `/home/jacoby/` or `/home/jacoby/mnt/djacoby`, just the `dev/project2fortress` directory.

(`/home/jacoby/mnt/djacoby/` is a symlink to `/mount/djacoby`, because `find` doesn't jump symlinks but it _does_ follow mount points.)

My suspicion is based on knowing that Code is an [Electron](https://electronjs.org/) app, build with HTML and JavaScript and running in Chrome. I think it is reading `2551.e1280822` as **2551 to the power of 1280822**, which is so big that JS gives up and says "Infinity", and I have no idea if it's because it's so deep into that path or what.

My next questions: What triggers Code to treat filenames as huge numbers? Is this such an obscure and specific problem that nobody else will find it? Should I report this as a bug?

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
