---
layout: post
title: "I Think Through Things"
author: "Dave Jacoby"
date: "2020-06-16 19:55:17 -0400"
categories: ""
---

My life isn't as Linux-on-Windows as this post would seem to imply, but this is stuff I feel I can write about.

### Changing Canonical Git Branch

Previously, I documented changing the name of the core repository with a complex issue to `trunk`, and, of course, i was not the only one.

[This one](https://dev.to/damcosset/replacing-master-in-git-2jim), from [dev.to](https://dev.to/), goes fairly deep on both the details and reasons. And, [Scott Hanselman](https://www.hanselman.com/)
also has [instructions to Easily Rename your Git Default Branch](https://www.hanselman.com/blog/EasilyRenameYourGitDefaultBranchFromMasterToMain.aspx).

Speaking of Scott, [he mentioned a remote presentation he was doing on Twitch](https://twitter.com/shanselman/status/1272969408168685568) with [DotNetNorth](https://twitter.com/DotNetNorth), which he started with a discussion about Windows Terminal, the replacement for older terminal technologies on Windows. I had tried to add `git-bash` from [Git for Windows](https://gitforwindows.org/) as a Windows Terminal choice before, and failed, so I asked, and he went into it. Another viewer entered this into the chat:

```json
{
  "name": "git-bash",
  "commandline": "C:/Program Files/Git/bin/bash.exe --cd-to-home",
  "icon": "C:/Program Files/Git/mingw64/share/git/git-for-windows.ico",
  "startingDirectory": "%USERPROFILE%"
}
```

This (and whatever customization you add, because WT is very customizable) will allow you to run `git bash` with the cool new terminal.

### But Why Use Git Bash?

Once upon a time, I was issued Windows NT and I wanted to have a real shell, because if you're on a computer and can't type `ls -R | grep json | wc -l`, what are you even doing?

This is when I got familiar with [`cygwin`](https://www.cygwin.com/), which came from **Cygnus**, a company with a recursive algorithm for a name (**Cygnus, Your GNU Support**), and this served my needs for a good long time.

I think I switched over to `git-bash` before I was really using Git, and I can't really think of why. It is a little bit of Unix for your Windows, which did what I wanted, but while there's occasional updates to the whole thing, you cannot, for example, add modules to your Perl and such.

Meanwhile, [PowerShell](https://github.com/PowerShell/PowerShell). PowerShell is now a shell that use on _all_ the Linuxes — okay, not _all_, but Ubuntu, Debian, RedHat, CentOS, Fedora and OpenSUSE — and also MacOS, and [as my friend Gizmo says](https://twitter.com/search?q=from%3Agizmomathboy%20powershell&src=typed_query), is close enough to a Unix shell for most people.

We always want more and different things for our systems, and while things are _made_ for Windows, _finding_ and _installing_ all the things you want is always a pain. In Linux-land, we have `apt` and `yum` and a bunch of others I don't use because I swing Debian-style, and there's the BSD Ports and Packages Collection and all, and so, we're _used_ to being able to run `install` and `upgrade` commands from the command line to get and keep our toys up-to-date.

Thus [Chocolatey](http://chocolatey.org/)

Once installed, getting the newest Strawberry Perl is as easy as `choco install StrawberryPerl`.

And then there's WSL, which allows you to also run several competing Linuxes under Windows. I mostly run Ubuntu 18.04, because I have all the things set and installed that I want.

This means, I have git-bash Perl, Strawberry Perl and Linux Perl. And, because I want to have `perltidy` available with both the Win and Lin parts of VS Code. (Side note: I _finally_ set up `perltidy` with Strawberry Perl on Windows!)

This is my toy machine, not a work machine by any means, so getting all these things worked out is not of great urgency.

### Today I Learned

Within my WSL Ubuntu, I can run `Explorer.exe .` and have an Explorer window _within_ my WSL Ubuntu. And now I can drag and drop between them and the tools handle it well. Previously, there were refresh issues between the file systems and you couldn't rely on it, but WSL 2!

### Final Thoughts

* [Craig, a Microsoft PM working on WSL](https://twitter.com/craigaloewen/), is [asking about people's interests in Linux GUI apps in WSL](https://twitter.com/craigaloewen/status/1272946145770082304). Personally, most anything I would want to run as GUI in Linux exists as GUI in Windows, so by and large, I am not interested. It's the terminal stuff in Windows that I found lacking. But if you are, that's cool. Go tell Craig all about it.
* I had been using Fira Code as my coding font of choice, but Scott mentioned [Cascadia Code](https://github.com/microsoft/cascadia-code/) as an attractive monospace coding font with ligatures, and if you don't like ligatures, you can use the also-packaged Cascadia Mono, which, when you're beginning to deal with the actual UTF characters that are displaying as ligatures.
* There's also [Notepads](https://github.com/JasonStein/Notepads), which is prettier than Notepad and Notepad++. I'm sure I'll go directly to VS Code more often than not, but still...


#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
