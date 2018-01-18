---
layout: post
title:  "Not knowing MacOS, I proceeded carefully"
author: "Dave Jacoby"
date:   "2018-01-18 15:52:52 -0500"
categories: wtf
---

[I don't know why `tar xvf large_tarball.tar` failed to extract on the large machines yesterday.](https://jacoby.github.io/wtf/2018/01/18/so-that-was-a-day.html) It is likely something I will never know.

Today, I went to the user's office, where he had a 300GB tarball on a 450GB hard drive in his 2010 MacBook, and a 1.8TB external hard drive.

I am not anti-Mac. I'm merely cheap, and would gladly run Apple if someone bought it for me. Nobody has, as of yet. Alas. So I run Linux and I run Windows.

The file size is right, so I am reasonably sure the archive is fine, but as it takes 2/3 of available disk space, I am *sure* it will not extract in place. This is why we have the external hard drive.

It took me a while before I figured out how to open Finder and triple-check the file sizes and available space. It took me a while to figure out how to open Terminal. It took me a surprisingly short amount of time to figure out where MacOS put the external drive; I went to `/`, looked around, and found `TOSHIBA` in `/Volumes`.

So, I `cd /Volumes/TOSHIBA/data` and `tar xvf ~/Desktop/large_tarball.tar`, and once I get to the first large file, I get an error. An error which I photographed but didn't check, and my phone autofocused on the lighting and gave me a blur. It's VERY artistic and very useless. 

But it saw all the files. This confirmed my hope: everything was fine, and I just had to fight the computer, not the archve.

I knew this would be problematic. An old Mac laptop connected via USB2 to an external hard drive of unknown formatting. Unknowable? I know how to reformat a drive on Windows, give or take a dirty bit. A microSD card went south on me, and I spent the morning trying to get it to play nice again. Alas, it took my podcasts with it. Bastards.

The question is `FAT32` or `exFAT`. `FAT` == *File Allocation Table*, and that was what Microsoft used from back in the days when floppies were 5 1/4" and were expandable with a hole punch. Clearly not big enough, So they went from 12 to 16 to 32 bits, with a max file size of 4GB. I'm looking at file sizes of up to 14GB in the extracted data, so I hoped and I hope that the HD is formatted `exFAT`.

But, I still had the archive on the clusters, sitting on effectively infinite disk with Xeon cores and gigabytes of RAM and Infiniband. And I have `scp`. 

Once re-extracted (get yourself a machine where you can `tar xzf` and `tar czf` large data sets for fun), I started copying, And after balking at the day-long transfer time of small files, I find the wired network uplink, connect it, get that down to ten minutes. WiFi in buildings built before computers can be ... iffy.

I am trying to find/recover the error that happens when you try to tar into an external drive on Mac. I'm hoping that it will never become practical knowledge for me again, because science just does not *fit* on laptops.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).

