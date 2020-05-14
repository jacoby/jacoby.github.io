---
layout: post
title:  '"Do I Want To Use Windows Subsystem For Linux?"'
author: "Dave Jacoby"
date:   "2017-12-12 11:23:03 -0500"
categories: WSL
---

## "Do I Want To Use Windows Subsystem For Linux?"

I dunno. Maybe.

...

Yeah, that might not be helpful.

## "What is Windows Subsystem For Linux?"

Consider, for example [Debian](https://www.debian.org/). 

> The Debian Project is an association of individuals who have made common cause to create a [free](https://www.debian.org/intro/free) operating system. This operating system that we have created is called **Debian**.

> An operating system is the set of basic programs and utilities that make your computer run. At the core of an operating system is the kernel. The kernel is the most fundamental program on the computer and does all the basic housekeeping and lets you start other programs.

The reason I chose Debian is not that it's available with WSL, but that the Debian system uses GNU tools on top of the [Linux kernel](https://www.kernel.org/). **Or** the [FreeBSD](https://www.freebsd.org/) kernel. 

Similarly, if things are done right, you can have that userland stuff talking to the Windows kernel. 

This isn't like [VirtualBox](https://www.virtualbox.org/), where you have a fully virtualized computer running an operating system within your computer, taking up a lot of your resources. 

It isn't like [Docker](https://www.docker.com/what-docker), which combines containers (I don't understand enough to explain, but see as packages but more so) with chroot. [Bryan Cantrill gave a talk on Jails and Solaris Zones as precursers to Docker to Papers We Love in 2016](http://paperswelove.org/2016/video/bryan-cantrill-jails-and-solaris-zones/), so I'll link and handwave.

It's a parallel way to the Windows kernel, one which allows you to install Linux `ELF` binaries via `apt` or `yum` in addition to installing Windows `PE` binaries via `msi` and `chocolatey` or `nuget`.

Which is very weird. But kinda cool.

## "So, what do I need to do to get that going?"

First, install the [Fall Creators Update](https://support.microsoft.com/en-us/help/4028685/windows-10-get-the-fall-creators-update). I started by going on the Windows Insider "Fast Track", which at times felt very abusive in it's rate of change. 

[Then you need to enable WSL within PowerShell, reboot, then choose Ubuntu or a variety of SUSE from the Windows Store.](https://docs.microsoft.com/en-us/windows/wsl/install-win10) 

I am told that Fedora or CentOS is coming, but they are not here.

If the machine is not yours to control (Admin access), you likely cannot do this.

I would point out that you don't have a windowing system yet. It's generally `Kernel -> userland -> pretty pictures`, and Windows is already monopolizing the `pretty pictures` part. You can use an X server like [VcXserv](https://sourceforge.net/projects/vcxsrv/) or [Xming](https://sourceforge.net/projects/xming/). 

I don't have those installed. It has been years since I've felt the need to redirect X. (Last time I did was to help debug an issue that could've been `sshfs` and `fuse`, `samba`, `sublime text`, OR `gpfs`. And it turned out to be `gpfs` on a large system I don't control.) If you can get to your files as either `C:\Users\jacoby\Development` or `/mnt/c/Users/jacoby/Development`, and the makers of your WIMP tools (Chrome, Firefox, VS Code, etc.) pretty much develop for Windows and macOS first and Linux later, why do X forwarding to use the secondary versions.

I have an aside here, but I don't want to go into it right now. Remind me about Unicode later.

So, I'll say WSL is the way to go if you have that level of control over your system, and desire the ability to use all the cool stuff you use on Linux systems. I'm a Ubuntu guy, so I'd start with the following commands.

    sudo apt-get install build-essential
    sudo apt-get update
    sudo apt-get dist-upgrade

From there, it really depends what you need. It isn't all there yet, but [Microsoft is using GitHub for bug tracking](https://github.com/Microsoft/WSL), so definitely start there.

Also, blogs and social media will help you keep track of coming changes and fixes. WSL came from Windows Insider, which is Microsoft's beta track, so it is good to know what's going on. Here's [Windows Insider on Twitter](https://twitter.com/windowsinsider), and [Rich Turner is a Senior PM on the Console and WSL](https://twitter.com/richturn_ms). 

## "That might be more than I need."

I often think so, too. If you mostly just need to be able to `ssh` or `scp` or `rm 2016-10-*.log` or the like, there are two choices that are one. 

[**Git for Windows**](https://git-scm.com/download/win) or [**Cygwin**](https://www.cygwin.com/).

History Lesson: The **GNU Project** started, code was released, and it was as-is. Lots of people wanted to use the capabilities but didn't know how, and **CYGNUS**, meaning `CYGNUS, Your GNU Support`, was formed. Eventually, people wanted those tools on Windows, so they created Cygwin. This gives you GNU tools that are compiled in `PE` and set to run in Windows environment. 

The Git project wanted users to be able to use `git` on Windows machines, so they built Git for Windows on top of Cygwin. I think. It feels that way.

In my experience, the way to update Cygwin and Git for Windows is to reinstall, and they don't play well with [ActivePerl](https://www.activestate.com/activeperl/downloads) and [Strawberry Perl](http://strawberryperl.com/). (I identify as a Perl guy, so this is a crucial thing for me.) But, if the paths are right, you can call Windows executables from a bash prompt, and seeing that I like to do things like `sublime ~/web/lib/*/*-0*.js`, this is crucial to me.

## "I don't do much development *on* my Windows computer."

If your Windows machine is a "window" to your greater computing world (Yes, pun intended), then you don't really need the awesome power of WSL, or even Cygwin. 

I would point out that PowerShell is much more powerful shell (Yes, pun intended) than CMD and behaves in a very bash-y fashion. The piping, I am told, works more on the object level than the string level, which makes for a learning curve. [Which they want to help you climb.](https://github.com/PowerShell/PowerShell/tree/master/docs/learning-powershell)

If you've ever wanted to work with Linux computers from Windows, I am sure you're familiar with [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html), which gives you `putty`, `pscp`, `psftp` and `puttygen`. This is good and wonderful, but you probably want to use `ssh` and `scp` like you do elsewhere.

**Good news!** They needed a way to get packages into Visual Studio for .NET development, and they created [Nuget](https://www.nuget.org/). But that's not the only place you want packages, so for general packages, there's [Chocolatey](https://chocolatey.org/). 

`choco install openssh` gives you an SSH suite that behaves like one anywhere else. Well, because PowerShell, I can't get `scp *.png linuxbox:.` to work, but I just started, so I'm sure there's a way.

And there are a lot of other things you can install via `choco`. Well worth looking into.

## "You mentioned Unicode?"

Yes. Yes I did.

I like to tweak my prompt, giving me information about my environment. Here's one.

    🔥 ✔ jacoby@oz 12:46 25°F ☕ ☕ ~/Downloads 

You'll notice that there's the degree symbol telling me it's cold outside, a check mark saying I have no near-due or overdue tasks in TaskWarrior, a flame indicating that I need to reboot, and two coffee cups. I track my coffee and that tells me I've had two cups today. 

Using Linux and `gnome-terminal`, this displays fine.

Using the terminal used by Git bash, I can get the degree, the flame and checkmark, but the coffee cup doesn't display.

Using the terminal for WSL Ubuntu and PowerShell, you can't get the flame and checkmark.

[From the WSL issue tracker](https://github.com/Microsoft/WSL/issues/75), I see this quote from [Rich Turner](https://twitter.com/richturn_ms).

> Alas, because the Console's text renderer is GDI-based, we're unable to support features like font-fallback which would allow us to support fonts that contain a specific set of symbols (e.g. Emoji, Klingon), but gradually fall-back on a more expansive font sets for other chars.

> We have a goal to replace our renderer with a more modern DirectWrite renderer at some point in the (increasingly near) future.

> When we do, we'll be able to do A LOT of very cool, modern, fancy things with text that we're simply unable to do right now.

Like I said, follow Rich Turner and search the issues if you're looking into these issues.

*But,* I do want to have a pretty terminal that does what I put in the `$PS1`, so I am thinking that Xming and gnome-terminal might be the way to get that. Or there may be simpler choices.  

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


