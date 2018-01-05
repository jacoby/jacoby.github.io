---
layout: post
title:  "Seeking an In-Depth Linux-To-Windows Translation"
author: "Dave Jacoby"
date:   "2018-01-05 15:03:40 -0500"
categories: windows-10,toast
---

At work, I have two computers on my desk. In general, the one to the left runs Ubuntu Linux and has many editor and terminal windows open, and the one on the right runs Windows and has browser windows open, because those who use my tools run Windows computers and Firefox.

I've learned the slightest amount of developing for Windows. I have a [C# Project to set a JPG as my background image](https://github.com/jacoby/SetBackgroundImage), and have found and slightly modified code that allows me to lock, shutdown and reboot the computer from PowerShell. Not much, to be sure, but as a 90s-vintage Linux guy, I'm of the demographic to offhandedly use "Micro$oft" and say things like "Andy Giveth and Bill Taketh Away".

But the Microsoft of 2018 is not the Microsoft of 1998, and many people who I trust (including two in-real-life friends) have gone on to work for the new Microsoft. They have Revolution R. They have Visual Studio Code. They have Bash and Ubuntu's userland running on Windows, and Powershell running on Linux. I used to run Windows *just enough* to be helpdesk for my coworkers and to get to the popular toys (music and video streaming services, mostly, and some games). I now want to try to *really* use it.

Which brings us to a pain point. On Linux, I have many tasks that are scheduled via `crontab`, determine if there's a status change I need to be notified about, and uses `notify-osd` to tell me. What sort of things? Often, mail from people I care about, such as bosses, coworkers, and family. I hate little as much as random notifications about mail from automated lists. But also things like coming storm fronts, a change in the status of our web servers or file servers, or even just that we've reached the top of the hour. (I *like* flow state, but when you look up, thinking it *must* be lunchtime by now and find it's 6:23pm, you're too disconnected from your environment.)

It doesn't really matter *what* needs to be alerted, it is just that I decide what it is and I get it going on Windows 10.

Which leads us to Known Unknowns and Unknown Unknowns.
The Known Unknowns are things I have some sense of, but don't necessarily understand how they will work. Things I am sure a little bit of searching on Stack Overflow will get me to where I want to be. This includes XML or JSON parsers, HTTP client actions, and, to some extent, **TOAST**. TOAST, I know, is the mechanism by which things are sent to the Action Center, and I have found PowerShell code that *used to* create the pop-up part, but didn't add it to the Action Center. It no longer works, and I don't know if it's something I did or not.

The Unknown Unknowns, beyond all the things I'll need to understand when moving to the Windows way of configuration, is scheduling. I'm used to adding 

    0 * * * * /path/to/my/program --quiet

as the way to schedule most things. I know there's scheduling involved in this task, but I have no sense whether using the Admin privileges to get to the Scheduler is the Windows way or not.

I am not social with many Windows developers, and those few I do know, I don't think I know well enough to give meaningful answers to this. And it is **far** too free-form to be a Stack Overflow question.

This is very high-level; I don't need code samples. Appropriate keywords and links to MSDN pages should do me well. I *know* how to program; I just don't know how to do things in Windows. Any help is greatly appreciated.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


