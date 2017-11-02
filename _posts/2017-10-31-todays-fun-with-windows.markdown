---
layout: post
title:  "Today's Fun With Windows!"
author: "Dave Jacoby"
date:   "2017-10-31 15:22:21 -0400"
categories: 
---

Right now, I have three computers on my desk; Two Windows computers and my Ubuntu box.

I have customized my prompt so that it looks like this right now:

    🔥 ✔ jacoby@oz 15:22 42°F 2 cups ~/local/dev/jacoby.github.io (master) 

**42°F** means it's cold. 5°C for the Metric fans among you.

**✔** means that I have no urgent or overdue tasks in TaskWarrior. Not surprising as I've only been using it a week.

**🔥** means that I have run `apt-get upgrade` and my computer now needs to be rebooted.

That also means that I have Unicode in my bash prompt. Unicode in my bash prompt means that, when I connect from WSL terminals in Windows to Linux using ssh, the prompt looks awful. The degree symbol works fine, but the check and flame do not display.

This is a [known issue with Windows](https://github.com/Microsoft/WSL/issues/75), and affects Notepad and other places that use text. And text is used everywhere in Windows, because text.

There are four update states: **🔥**, **⚠**, **🚨**, and **💻**. Flame means reboot needed. Warning Sign means security updates, Siren means normal updates, and Computer means all is up to date. I can determine if a reboot is needed by testing `-f '/var/run/reboot-required'`. If `reboot-required` exists, a reboot is required. I wrote something that uses `/usr/lib/update-notifier/apt-check` to see if updates are needed without needing to use `sudo`, and since it works with native Ubuntu, I thought I'd try it on Ubuntu on Windows via WSL.

[It doesn't work.](https://github.com/Microsoft/WSL/issues/2619) I'm a big Linux guy, and I want a terminal and the ability to add software. If you don't need much more than `bash`, `mv` and `ssh`, I suggest you use Cygwin or Git for Windows to get a bash prompt. WSL is part of the Windows Insider program, which means it's somewhere between alpha and beta. It is being worked on by very helpful people, [like Rich Turner](https://twitter.com/richturn_ms/), and I do see improvements, but it isn't something you should bet the farm on yet.

The Git for Windows bash terminal handles Unicode just fine, by the way.

That's my work Windows box. It's my personal laptop that really frustrates me.

I just switched from the Windows Insider Fast Track to the Slow Track, but that kinda doesn't matter, because it doesn't really update itself. Trying to get to 17025.1000 the newest update, failes because `0x80240034`, and the attempts to get to 17017.100 failed due to `0xc1900104`. The [Windows Update Error Code List](https://support.microsoft.com/en-us/help/938205/windows-update-error-code-list) says `0x80240034 WU_E_DOWNLOAD_FAILED Update failed to download`, so right now, I have it connected to the fast internet of work with Windows Defender shut down, so that I can hopefully get updates going, which is scary and wrong, and also unproductive, because it's sitting at 0%.

It's not my work computer, so I'm not working on it, which gets to the next problem. It's just downloading updates, if that, so it thinks it's doing nothing and goes to sleep to save energy. Even though I have the energy settings saying **DON'T GO TO SLEEP!!!** Often, though, it gets to 70-90% but then something happens and it stops. There are sets of troubleshooting suggestions I've tried over and over, and it doesn't go.

It's an HP 15, the most $300 laptop I could get when my other laptop was having overheating and stability problems, so I don't know if I should blame HP, Microsoft, the alpha nature of Windows Insider builds, or my general lack of Windows knowledge. I admit I'm a Linux guy who uses Windows only because he wants the toys. 

I am tempted to reset, clear everything and start again. It's already a thing I want because it has my home as `C:\Users\jacob` instead of `C:\Users\jacoby`, and the thing I want (Git for Windows, Github for Windows, Chrome, Spotify, Steam, XCOM2) all things I can just reinstall without worry. But since there's data on the drive, I've not acted on that that temptation.

If you have questions, comments, suggestions and affirmations, do so as an issue to [my blog repo](https://github.com/jacoby/jacoby.github.io).
