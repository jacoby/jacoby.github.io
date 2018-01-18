---
layout: post
title:  "So, THAT was a Day"
author: "Dave Jacoby"
date:   "2018-01-17 23:15:05 -0500"
categories: WTF
---

I work in science. My lab does science for other people, generating large amounts of genomic data from small amounts of material. It sits in our space on the file server until we approach our quota, and when we do, we throw the older results onto the tape robot.


*I* get data off the robot via `hsi`, but our users use [Globus](https://globus.org/). Developed at the University of Chicago, it's like a combination of Dropbox and the Filezilla FTP client. 

So, one of my users downloaded some results, which came in the form of a tarball. `tar` stands for **tape archive**, and by the small letter count in the program name, you can tell it's been around a while. Long enough that archiving to tape is something most people think of as an old-school computing thing, something they've never done.

This user reported that the file wouldn't export. I don't know what problem the user had, but since I didn't create the archive, I don't know it's not corrupted. So my first step is to pull the file from the source, and since 300GB doesn't download quickly I used both hsi and Globus.

And I try to run `tar xvf` on it. `xkcd` might not be able to remember the commands, but I do. `x` is for extract. If we were going the other way, it'd be `c` for create. `v` is for verbose. **"Get that dev a `verbose` flag. Devs love `verbose` flags."** `f` is for file. If you wanted to use gzip for compression, that'd be `z`.

So, that's me showing off.

But jokes on me, because a fifth of the way through extracting, tar tells me "Unexpected EOF. I'm done." I switch to the other, and it extracts perfectly.

`ls -l`? Yeah, same size.

`sha1sum`? Same checksum. That's the same file.

`tar xvf large_tarball.tar` working or not, depending on what? Sunspots? Ghosts? Will 2 + 2 suddenly equal 7 on odd Wednesdays in January? This is shaking my belief in a deterministic universe.

But now, I have trust that the tarball is not corrupted, at least on our end. We don't currently store SHA1 checksums of our tarballs, but I'm thinking we should start. This is fine; Our setup is not the cause of my user's issue.

What *is* that issue? That's something I figure out tomorrow.


If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


