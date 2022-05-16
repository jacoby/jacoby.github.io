---
layout: post
title: "Windows Terminal is Cool, Actually"
author: "Dave Jacoby"
date: "2022-05-12 09:42:41 -0400"
categories: ""
---

[I presented on the subject of Windows Terminals](https://www.meetup.com/hacklafayette/events/284841221/) to [HackLafayette/Purdue Perl Mongers](https://www.meetup.com/hacklafayette/) on May 11. Here is a rough retelling of what I presented.

(I might release the video, but I _so_ don't want to watch myself present.)

### History of Terminals, Handwaved

There's a long history of terminals, going back to the days of punch cards. Much of the state of terminals is based on the history of the technology that existed before.

Thankfully, [Rich Turner of Microsoft](https://www.bitcrazed.com/blog/2021/01/the-story-so-far/) wrote a [series of blog posts on the History of the Command Line](https://devblogs.microsoft.com/commandline/windows-command-line-backgrounder/) which covers a _lot_ of the greater issues with the old Terminal technology that I touched on. Go read him.

### Me and Windows, Terminals, etc

So, I'm a Unix/Linux type. My intro to C/C++ programming on Unix systems had a lot of _"there's an ocean of things you need to understand beyond the language, and we're going to show you very little, so learn to swim"_, so I learned. My first job out of college, however, was with a Windows shop, with some light VMS on the side, and so there was _some_ of that wonderful command-line goodness to my job, it was mostly not. I did not enjoy it.

Soon after, I started working at a research lab, and while I had a Windows box because I had to support Windows applications and Windows users, I spent _most_ of my time in Linux. But I began to do things like using Synergy and a KVM switch so I only needed one keyboard, then using [Chocolatey](https://chocolatey.org//) to get a native OpenSSH going instead of PuTTY (because, I mean, for _real_...), and eventually learned that Powershell is an acceptable bash for most non-hardcore uses. There's much more to it than I've ever needed to teach myself, but it's OK.

And then came [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/), which allows you to have a _real_ Unix in your Windows (and not the fake Unix-y goodness of [Git Bash][https://git-scm.com/]) (fake Unix-y, not fake goodness, because my goodness, it'll do in a pinch). I mean, seriously, I've kept my last few laptops as Windows because I could do most of what I wanted with Linux in a terminal.

It was just that the terminal sucked. I was _okay_, I guess, but I definitely had Unicode issues, beyond the usual _"Your language predated Unicode and isn't optimized for expanded character sets"_ issues.

### In Comes Windows Terminal

### Shells and Remote Connections, Oh My!

### In Conclusion

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
