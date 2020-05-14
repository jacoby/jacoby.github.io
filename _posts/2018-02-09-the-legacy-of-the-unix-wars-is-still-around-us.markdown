---
layout: post
title:  "The Legacy of the Unix Wars is still around us"
author: "Dave Jacoby"
date:   "2018-02-09 16:31:04 -0500"
categories: computer_history
---

I have a commit bit for the module in question, but I have never even looked at the code. It's a building block for a module I have taken over and modified, some. My project management style is "For Stallman's sake, don't break anything".

But, as I have the commit bit, the support ticket came to me. The module in question is a Perl module with XS in it, which means parts of it are written in C. This is often done for speed, or to interface with an existing library.

This module wasn't building. On **Oracle Solaris Beta**.

About 20 years ago, nearly every computer I worked on was Solaris. This was Sun Solaris, using the Common Desktop Environment (CDE) and SPARC processors. In fact, 20 years ago I was probably just starting to get into Linux, enjoying Enlightenment and GNOME over KDE.

Today, the main thing we celebrate from Sun is ZFS, but another thing that came from them is Java, and Java's key distinguishing feature is that it doesn't compile to native bytecode but to the JVM, which gives you "Write Once, Run Everywhere". It's hard to look around at the computing landscape in 2018 and see a strong need for that capability, but there was a real need for it in the 1990s.

Why?

Because you had different UNIX vendors who were trying to get lock-in by making incompatable changes that don't really help anybody. The one that immediately comes to mind is HP-UX (pronounced *"h-pucks"*), the Unix from Hewlett-Packard. In most systems, a process is allocated a block of memory to use, and for local variables and such, it uses the stack, which starts at the beginning of the memory space and goes up, with a variable storing the offset . In HP-UX, it started at the end of memory and goes down. Why? What does it matter?

In all honesty, being this deep into the specifics of compiled applications has never been part of my job or my hobbies, so I might have just totally blown that explanation. 

We call this [**The Unix Wars**](https://en.wikipedia.org/wiki/Unix_wars), where different vendors fought for dominance in "Real Computing". **Java** was created to allow for software to be developed on one system and run on another, when porting to different architectures and systems had been made difficult by the addition of pointless differences.

But Java did not the one Destined to bring Balance to the Source. Instead, there were four forces that ended the Unix Wars:

    * **Microsoft:** At the time, I would not have accepted it either, but because of Microsoft, there was a glut of inexpensive hardware that was getting better and better, to the point where the benefit to getting a high-end workstation from $VENDOR was just not there.
    * **The Web:** The need to deploy specialized software for your business dropped when you could install a web server, put it together there, and make that available to all your users. 
    * **Linux and Open Source:** You still need that web server, right? So, let's build it with **free software** (as in "beer" as well as in "speech", but for many, it was the "free beer" aspect that was most motivational) and avoid the markup for the other systems.

I went from "I rarely touch a system that isn't Solaris" through a sad Windows phase to now, where my phone, all the big systems my work relies on, and half the computers on my desk run Linux. Come to think about it, with WSL, *all* the computer on my desk run Linux, in a way. There are still vendors out there -- I was shocked to find from Wikipedia that "HP-UX is", not "HP-UX was". Sun Microsystems wasn't so lucky, and was bought by Oracle. Oracle briefly open-sourced Solaris as OpenIndiana, then closed it again, but it is already out.

So, when I saw *Oracle* , I saw *Solaris* and I saw *Beta* , I had a mental image of more red flags than a May Day parade. But, once I got to the point where I could get the Beta running (in **VirtualBox**, another Oracle project), I found it was reasonably acceptable. It also has a separate Perl in `/usr/perl5/5.22/bin` (with 5.26 installable) so you can use `pkg` and still keep from using system Perl, which is pretty neat.

And, eventually, once I started trying to build, I saw the problem. (Probably could've seen it earlier, but I was too busy proving to myself that yes, this existed and could run.) 

The error that broke the build was that the C compiler could not handle the `--KPIC` flag. When we're down into the assembly, what we see as `if` and `else` and `for` are actually `GOTO`, and if you're compiling a program, it likely uses specific positions; `40 GOTO 10` or whatever. If you're making a library (or an XS-using Perl module), you want it to say something closer to `40 GOTO POSITION-30` or something. This is called **Position Independent Code**, or `PIC`.

(Please remember my earlier declaration that I've never spent too much time at this level.)

`perl Makefile.pl` made a makefile that was expecting to talk to `cc` as the Sun C Compiler, which made a `makefile` that used `--KPIC`.

`cc` in this case was `gcc` or the GNU C Compiler, which uses `--fPIC` to indicate the same thing.

What can we say about the difference between `--KPIC` and `--fPIC` other than an incompatable change that benefits nobody? You can call it a relic of the Unix Wars. 

What you can't say is that it's an elegant flag for a more civilized age. 

In fact, I would say "clumsy" and "random" are good terms for it.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


