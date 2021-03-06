---
layout: post
title:  "Fixing that Windows Update Problem"
author: "Dave Jacoby"
date:   "2017-11-02 09:47:47 -0400"
categories: Windows
---

[As mentioned previously](https://jacoby.github.io/2017/10/31/todays-fun-with-windows.html), I have been having problems with my laptop. In short, it had not successfully run Windows Update in months, and as it was on the Windows Update Fast Track, it had every opportunity to do so.

So, after trying `sfc /scannow` and `DCIM` and reading [the Big Book of Windows Update Error codes](https://support.microsoft.com/en-us/help/938205/windows-update-error-code-list), I somehow got to "Let's read the Windows Update logs!"

[This is how you read Windows Update logs](https://support.microsoft.com/en-us/help/902093/how-to-read-the-windowsupdate-log-file), and [this is how you get it from PowerShell](https://blogs.technet.microsoft.com/charlesa_us/2015/08/06/windows-10-windowsupdate-log-and-how-to-view-it-with-powershell-or-tracefmt-exe/) but `Get-WindowsUpdateLog` from an Admin prompt is the **tl;dr**. 

There was *lots* I didn't understand, but a certain string pointing to a Registry entry failing over and over again being the last line of the log certainly was a pointer, and so I searched and saw that it was a Windows Update blocker, and was shown the `regedit` entry to remove.

    2017-11-01 14:28:42.6882292 1428  1776  DownloadManager Dynamic download data fetcher for ServiceId 8B24B027-1DEE-BABB-9A95-3517DFB9C552 does not exist.

So we look for `8B24B027-1DEE-BABB-9A95-3517DFB9C552` and find [a Microsoft blog that says to try deleting a Registry key.](https://blogs.windows.com/windowsexperience/2017/03/17/announcing-windows-10-insider-preview-build-15061-pc/) with [specific instructions of how to get there and delete the Registry key](https://answers.microsoft.com/en-us/insider/forum/insider_wintp-insider_install/pc-build-install-some-update-were-cancelled/22d428c1-7ce8-4d12-b7bf-2e21c08c0549?tm=1489615923416&auth=1).

Opening `regedit` always scares me. It isn't full-on brain surgery, but it can constitute a breaking change on a flawed-but-functioning computer, so it never feels right. But I found it and rebooted and went home.

(More information on this later, after the laptop's updates finish. Maybe.)

So, updates worked, in theory, but the other issue I always have is that downloading and preparing updates in Windows takes *forever*, and while my settings are that the computer should only sleep when I tell it to, it sleeps anyway. Except when playing **XCOM 2**. So, last night, I played a lot and fell asleep while I waited for my away team to return from away, so it had basically all night to get it done.

So, when I woke up, I finished some alien-fighting and closed it, and I saw "Reboot and Update" as an option and took it.

This is not a choice you should make at 8am if you expect to have it done before you have to go to work.

It's 10:20 right now, and my laptop's at 75%, and it wasn't raining when I walked from the parking garage to my lab. So, things are moving forward. Because who knows what set that Registry entry, I can't name the blocker that has frustrated me for several months, but it seems to be gone now.

**Edited To Add** 

The installation is up, I am running the right version on the laptop, and both behave about the same. They share issues, like artifacting weirdly when switching between VMs, but that's a problem for later.