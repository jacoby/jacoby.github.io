---
layout: post
title: "Windows Terminal is Cool, Actually"
author: "Dave Jacoby"
date: "2022-05-16 18:53:57 -0400"
categories: ""
---

![Windows Terminal Is Cool, Actually](https://jacoby.github.io/images/windows_terminal_is_cool.jpg)

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

(When I tried to demonstrate my issues with Unicode, however, I was demonstrating from my Terminal-having machine, with [Cascadia Code](https://jacoby.github.io/images/windows_terminal_is_cool.jpg), which kinda comes with Windows Terminal, so :shrug:)

I am currently remote working with a Windows Server 2016 Datacenter "Desktop" that I use to connect to my Linux development environment (they want to test the webbiness in Windows, but I've not seen much difference between Chrome on Win an Lin, but eh, they pay me), and I am _always_ fighting the Powershell and Command Prompt to get and keep them in the position and size I want to see all the text.

### In Comes Windows Terminal

Anyway, thanks to Rich, I knew that Windows Terminal was coming, and I was expecting a fairly significant upgrade. Well, a significant upgrade from old Terminal programs, getting to what I might have expected from a Gnome terminal in the late 1990s, especially with images as your backgrounds.

Except...

If you _could_ use an animated GIF as your terminal background (I don't _think_ you could, but I forget), there were few that were big enough and interesting enough that you might want to. Today is _different._

![A busy Windows Terminal](https://jacoby.github.io/images/kill_feelings.gif)

Now, this _specific_ GIF is too busy to really serve as a nice background, because it'd be too hard to distinguish your output from your background, but I feel it demonstrates that it's possible. And the profile that gave it to you is:

```json
{
  "commandline": "%SystemRoot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
  "backgroundImage": "ms-appdata:///roaming/kill_your_feelings.gif",
  "backgroundImageAlignment": "center",
  "backgroundImageOpacity": 0.4,
  "backgroundImageStretchMode": "uniformToFill",
  "font": {
    "face": "Cascadia Code PL",
    "size": 12
  },
  "guid": "{61c54bbd-c2c6-5271-96e7-009a87ff44bf}",
  "hidden": false,
  "opacity": 99,
  "name": "Windows PowerShell"
}
```

Let's discuss a few of the fields here. `commandline` tells it which command you're running (which is powerful; we'll get back to that). The `background` fields tell it which image, how to align it, and how dark to display it. `font` clearly sets the face and size. `name` is the thing you choose from the menus, and `guid` is what it uses to tell them apart if you have several `PowerShell`s. (I currently have five.) `hide` allows you to not display some of the things you don't want to use, and then there's `opacity`.

![A transparent Windows Terminal](https://jacoby.github.io/images/terminal_transparent.png)

This effect allows you make the background transparent (or, minimize the `opacity`; here it's at 29%) and the Asian woman on a very well-lit cyberpunk evening is my current default background. In order to get this, you need to turn on Transparency Effects in Settings. I'm finding it under Accessibility for some reason. I find it very cool, and have tested that you can have a transparent terminal over a YouTube video and watch it through your terminal. Maybe you need to watch your logs?

But there's another word. `useAcrylic`. Making this `true` gives your terminal windows a frosted-shower-glass effect, where you can see the colors and shapes below your terminal window.

Unfortunately, that's one levey beyond what MS' Snipping Tool can handle, so I'm unable to give you a visual demonstration.

Additionally, you can also set your own colors with custom color scheme. I have a scheme, Retro, that emulated 80s-era green-screen monitors, and I have changed the `cursorShape` to `vintage` and added `experimental.retroTerminalEffect` to give more of a blown-out old-school VT100 effect.

```json
{
  "guid": "{1adbee5a-3d2a-4561-91f6-bf0a86281cd2}",
  "experimental.retroTerminalEffect": true,
  "colorScheme": "Retro",
  "cursorShape": "vintage",
  "opacity": 100,
  "name": "SSH to Perl Mongers",
  "commandline": "ssh mongers"
}
```

### Shells and Remote Connections, Oh My!

And I hinted at a thing with `commandline`, underlined it with the several PowerShells I have available, and kinda gave up with the last JSON block. An option I always `hide` is **Azure Cloud Shell**, which gives you a terminal on Microsoft's Cloud. This gave me an idea.

Your Windows 11 install probably comes with OpenSSH, which you can just turn on in Settings. Otherwise, you might have to install it using WinGet or Chocolatey, but however you get it, you can use `ssh` and `scp` directoly from PowerShell and Command Prompt now.

And, by telling it `ssh me@my_host`, you can open another terminal on your machine with one click.

```json
{
  "guid": "{1adbee5a-3d2a-4561-91f6-bf0a86281cd2}",
  "experimental.retroTerminalEffect": true,
  "colorScheme": "Retro",
  "cursorShape": "vintage",
  "opacity": 100,
  "name": "SSH to Perl Mongers",
  "commandline": "ssh mongers"
}
```

And it doesn't have to be remote. [My friend Brian](https://randomgeekery.org/) was [Getting into Nushell](https://randomgeekery.org/tags/nushell/) recently, which is entirely new to me. I've said that PowerShell is an almost-acceptable `bash` for trivial uses, but it has a "piping objects instead of text" thing which _sounds_ hella powerful, but has so far been beyond me. Nushell _seems_ like it's built along the same lines, and, y'know what? [They put a block to add it to your Terminal config in their documentation.](https://www.nushell.sh/book/installation.html#setting-the-default-shell-windows-terminal)

```json
{
  "guid": "{2b372ca1-1ee2-403d-a839-6d63077ad871}",
  "hidden": false,
  "name": "Nu Shell",
  "commandline": "nu.exe"
}
```

It'd be similarly easy to add R or Perl's REPL, [Reply](https://metacpan.org/pod/Reply) as a tool that pops up in it's own terminal. The only limit is your imagination, just like [Zombo.com](https://html5zombo.com/).

### In Conclusion

There's a _lot_ in Windows Terminal that's cool, and I've barely dented it. It contains a lot of display hacks, but it isn't all for that, but also very practical and useful things. Tools like Windows Terminal make Windws 11 to be a powerful and enjoyable development environment, even if most of the actual code is Linux-style code.

### My Current `settings.json`

```json
{
  "$help": "https://aka.ms/terminal-documentation",
  "$schema": "https://aka.ms/terminal-profiles-schema",
  "actions": [
    {
      "command": {
        "action": "copy",
        "singleLine": false
      },
      "keys": "ctrl+c"
    },
    {
      "command": "paste",
      "keys": "ctrl+v"
    },
    {
      "command": "find",
      "keys": "ctrl+shift+f"
    },
    {
      "command": {
        "action": "splitPane",
        "split": "auto",
        "splitMode": "duplicate"
      },
      "keys": "alt+shift+d"
    }
  ],
  "copyFormatting": "none",
  "copyOnSelect": false,
  "defaultProfile": "{07b52e3e-de2c-5db4-bd2d-ba144ed6c273}",
  "focusFollowMouse": true,
  "profiles": {
    "defaults": {
      "bellStyle": "taskbar",
      "opacity": 76,
      "useAcrylic": false
    },
    "list": [
      {
        "background": "#000000",
        "backgroundImage": "ms-appdata:///roaming/cyberpunk.gif",
        "backgroundImageAlignment": "center",
        "backgroundImageOpacity": 0.14999999999999999,
        "backgroundImageStretchMode": "uniformToFill",
        "bellStyle": "window",
        "colorScheme": "Void",
        "cursorColor": "#AAAAAA",
        "cursorHeight": 99,
        "cursorShape": "filledBox",
        "font": {
          "face": "Cascadia Code PL",
          "size": 9
        },
        "guid": "{07b52e3e-de2c-5db4-bd2d-ba144ed6c273}",
        "hidden": false,
        "name": "Ubuntu-20.04",
        "opacity": 80,
        "source": "Windows.Terminal.Wsl",
        "useAcrylic": true
      },
      {
        "antialiasingMode": "cleartype",
        "background": "#000000",
        "backgroundImage": "ms-appdata:///roaming/Spider-man-Into-the-Spider-Verse.jpg",
        "backgroundImageAlignment": "center",
        "backgroundImageOpacity": 0.5,
        "backgroundImageStretchMode": "uniformToFill",
        "bellStyle": "window",
        "colorScheme": "Vintage",
        "cursorShape": "vintage",
        "experimental.retroTerminalEffect": true,
        "font": {
          "face": "Cascadia Code PL",
          "size": 10
        },
        "guid": "{574e775e-4f2a-5b96-ac1e-a2962a402336}",
        "hidden": false,
        "name": "PowerShell",
        "opacity": 60,
        "source": "Windows.Terminal.PowershellCore",
        "useAcrylic": true
      },
      {
        "commandline": "%SystemRoot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
        "backgroundImage": "ms-appdata:///roaming/kill_your_feelings.gif",
        "backgroundImageAlignment": "center",
        "backgroundImageOpacity": 0.4,
        "backgroundImageStretchMode": "uniformToFill",
        "font": {
          "face": "Cascadia Code PL",
          "size": 12
        },
        "guid": "{61c54bbd-c2c6-5271-96e7-009a87ff44bf}",
        "hidden": false,
        "opacity": 29,
        "useAcrylic": false,
        "name": "Windows PowerShell"
      },
      {
        "background": "#123456",
        "backgroundImage": "ms-appdata:///roaming/static2.gif",
        "backgroundImageOpacity": 0.34999999999999998,
        "backgroundImageStretchMode": "fill",
        "commandline": "%SystemRoot%\\System32\\cmd.exe",
        "font": {
          "face": "Comic Mono",
          "size": 11
        },
        "guid": "{0caa0dad-35be-5f56-a8ff-afceeeaa6101}",
        "hidden": false,
        "name": "Command Prompt",
        "opacity": 30,
        "useAcrylic": true
      },
      {
        "guid": "{5fb123f1-af88-5b5c-8953-d14a8def1978}",
        "hidden": false,
        "name": "PowerShell 7",
        "source": "Windows.Terminal.PowershellCore"
      },
      {
        "guid": "{a3a2e83a-884a-5379-baa8-16f193a13b21}",
        "hidden": false,
        "name": "PowerShell 7 Preview",
        "source": "Windows.Terminal.PowershellCore"
      },
      {
        "guid": "{b453ae62-4e3d-5e58-b989-0a998ec441b8}",
        "hidden": true,
        "name": "Azure Cloud Shell",
        "source": "Windows.Terminal.Azure"
      },
      {
        "guid": "{42a28d9c-ebf8-55ba-a5af-23687ae7e4e1}",
        "hidden": false,
        "name": "Developer Command Prompt for VS 2022",
        "source": "Windows.Terminal.VisualStudio"
      },
      {
        "guid": "{7663e180-2974-5b71-b27a-b59b3ef04104}",
        "hidden": false,
        "name": "Developer PowerShell for VS 2022",
        "source": "Windows.Terminal.VisualStudio"
      },
      {
        "colorScheme": "Vintage",
        "cursorShape": "vintage",
        "experimental.retroTerminalEffect": true,
        "font": {
          "face": "Cascadia Code PL",
          "size": 10
        },
        "guid": "{2ece5bfe-50ed-5f3a-ab87-5cd4baafed2b}",
        "hidden": false,
        "name": "Git Bash",
        "source": "Git"
      },
      {
        "guid": "{2b372ca1-1ee2-403d-a839-6d63077ad871}",
        "hidden": false,
        "name": "Nu Shell",
        "commandline": "nu.exe"
      },
      {
        "guid": "{1adbee5a-3d2a-4561-91f6-bf0a86281cd2}",
        "experimental.retroTerminalEffect": true,
        "colorScheme": "Retro",
        "cursorShape": "vintage",
        "opacity": 100,
        "name": "SSH to Perl Mongers",
        "commandline": "ssh mongers"
      },
      {
        "experimental.retroTerminalEffect": true,
        "colorScheme": "Retro",
        "cursorShape": "vintage",
        "opacity": 90,
        "name": "REPLY - Perl REPL",
        "commandline": "C:/Strawberry/perl/site/bin/reply.bat"
      }
    ]
  },
  "schemes": [
    {
      "background": "#212121",
      "black": "#151515",
      "blue": "#6C99BB",
      "brightBlack": "#505050",
      "brightBlue": "#6C99BB",
      "brightCyan": "#7DD6CF",
      "brightGreen": "#7E8E50",
      "brightPurple": "#9F4E85",
      "brightRed": "#AC4142",
      "brightWhite": "#F5F5F5",
      "brightYellow": "#E5B567",
      "cursorColor": "#D0D0D0",
      "cyan": "#7DD6CF",
      "foreground": "#D0D0D0",
      "green": "#7E8E50",
      "name": "Afterglow",
      "purple": "#9F4E85",
      "red": "#AC4142",
      "selectionBackground": "#303030",
      "white": "#D0D0D0",
      "yellow": "#E5B567"
    },
    {
      "background": "#1A1A1A",
      "black": "#000000",
      "blue": "#579BD5",
      "brightBlack": "#797979",
      "brightBlue": "#9CDCFE",
      "brightCyan": "#2BC4E2",
      "brightGreen": "#1AD69C",
      "brightPurple": "#975EAB",
      "brightRed": "#EB2A88",
      "brightWhite": "#EAEAEA",
      "brightYellow": "#E9AD95",
      "cursorColor": "#FFFFFF",
      "cyan": "#00B6D6",
      "foreground": "#EA549F",
      "green": "#4EC9B0",
      "name": "Aurelia",
      "purple": "#714896",
      "red": "#E92888",
      "selectionBackground": "#FFFFFF",
      "white": "#EAEAEA",
      "yellow": "#CE9178"
    },
    {
      "background": "#492D7C",
      "black": "#0C0C0C",
      "blue": "#0037DA",
      "brightBlack": "#B1B1B1",
      "brightBlue": "#3B78FF",
      "brightCyan": "#61D6D6",
      "brightGreen": "#16C60C",
      "brightPurple": "#B4009E",
      "brightRed": "#E74856",
      "brightWhite": "#F2F2F2",
      "brightYellow": "#F9F1A5",
      "cursorColor": "#FFFFFF",
      "cyan": "#3A96DD",
      "foreground": "#F1F1F1",
      "green": "#13A10E",
      "name": "Build",
      "purple": "#881798",
      "red": "#C50F1F",
      "selectionBackground": "#FFFFFF",
      "white": "#812727",
      "yellow": "#C19C00"
    },
    {
      "background": "#0C0C0C",
      "black": "#0C0C0C",
      "blue": "#0037DA",
      "brightBlack": "#767676",
      "brightBlue": "#3B78FF",
      "brightCyan": "#61D6D6",
      "brightGreen": "#16C60C",
      "brightPurple": "#B4009E",
      "brightRed": "#E74856",
      "brightWhite": "#F2F2F2",
      "brightYellow": "#F9F1A5",
      "cursorColor": "#FFFFFF",
      "cyan": "#3A96DD",
      "foreground": "#CCCCCC",
      "green": "#13A10E",
      "name": "Campbell",
      "purple": "#881798",
      "red": "#C50F1F",
      "selectionBackground": "#FFFFFF",
      "white": "#CCCCCC",
      "yellow": "#C19C00"
    },
    {
      "background": "#012456",
      "black": "#0C0C0C",
      "blue": "#0037DA",
      "brightBlack": "#767676",
      "brightBlue": "#3B78FF",
      "brightCyan": "#61D6D6",
      "brightGreen": "#16C60C",
      "brightPurple": "#B4009E",
      "brightRed": "#E74856",
      "brightWhite": "#F2F2F2",
      "brightYellow": "#F9F1A5",
      "cursorColor": "#FFFFFF",
      "cyan": "#3A96DD",
      "foreground": "#CCCCCC",
      "green": "#13A10E",
      "name": "Campbell Powershell",
      "purple": "#881798",
      "red": "#C50F1F",
      "selectionBackground": "#FFFFFF",
      "white": "#CCCCCC",
      "yellow": "#C19C00"
    },
    {
      "background": "#FFFFFF",
      "black": "#3C5712",
      "blue": "#17B2FF",
      "brightBlack": "#749B36",
      "brightBlue": "#27B2F6",
      "brightCyan": "#13A8C0",
      "brightGreen": "#89AF50",
      "brightPurple": "#F2A20A",
      "brightRed": "#F49B36",
      "brightWhite": "#741274",
      "brightYellow": "#991070",
      "cursorColor": "#FFFFFF",
      "cyan": "#3C96A6",
      "foreground": "#000000",
      "green": "#6AAE08",
      "name": "Frost",
      "purple": "#991070",
      "red": "#8D0C0C",
      "selectionBackground": "#FFFFFF",
      "white": "#6E386E",
      "yellow": "#991070"
    },
    {
      "background": "#282C34",
      "black": "#282C34",
      "blue": "#61AFEF",
      "brightBlack": "#5A6374",
      "brightBlue": "#61AFEF",
      "brightCyan": "#56B6C2",
      "brightGreen": "#98C379",
      "brightPurple": "#C678DD",
      "brightRed": "#E06C75",
      "brightWhite": "#DCDFE4",
      "brightYellow": "#E5C07B",
      "cursorColor": "#FFFFFF",
      "cyan": "#56B6C2",
      "foreground": "#DCDFE4",
      "green": "#98C379",
      "name": "One Half Dark",
      "purple": "#C678DD",
      "red": "#E06C75",
      "selectionBackground": "#FFFFFF",
      "white": "#DCDFE4",
      "yellow": "#E5C07B"
    },
    {
      "background": "#FAFAFA",
      "black": "#383A42",
      "blue": "#0184BC",
      "brightBlack": "#4F525D",
      "brightBlue": "#61AFEF",
      "brightCyan": "#56B5C1",
      "brightGreen": "#98C379",
      "brightPurple": "#C577DD",
      "brightRed": "#DF6C75",
      "brightWhite": "#FFFFFF",
      "brightYellow": "#E4C07A",
      "cursorColor": "#4F525D",
      "cyan": "#0997B3",
      "foreground": "#383A42",
      "green": "#50A14F",
      "name": "One Half Light",
      "purple": "#A626A4",
      "red": "#E45649",
      "selectionBackground": "#FFFFFF",
      "white": "#FAFAFA",
      "yellow": "#C18301"
    },
    {
      "background": "#000000",
      "black": "#00FF00",
      "blue": "#00FF00",
      "brightBlack": "#00FF00",
      "brightBlue": "#00FF00",
      "brightCyan": "#00FF00",
      "brightGreen": "#00FF00",
      "brightPurple": "#00FF00",
      "brightRed": "#00FF00",
      "brightWhite": "#00FF00",
      "brightYellow": "#00FF00",
      "cursorColor": "#FFFFFF",
      "cyan": "#00FF00",
      "foreground": "#00FF00",
      "green": "#00FF00",
      "name": "Retro",
      "purple": "#00FF00",
      "red": "#00FF00",
      "selectionBackground": "#FFFFFF",
      "white": "#00FF00",
      "yellow": "#00FF00"
    },
    {
      "background": "#002B36",
      "black": "#002B36",
      "blue": "#268BD2",
      "brightBlack": "#073642",
      "brightBlue": "#839496",
      "brightCyan": "#93A1A1",
      "brightGreen": "#586E75",
      "brightPurple": "#6C71C4",
      "brightRed": "#CB4B16",
      "brightWhite": "#FDF6E3",
      "brightYellow": "#657B83",
      "cursorColor": "#FFFFFF",
      "cyan": "#2AA198",
      "foreground": "#839496",
      "green": "#859900",
      "name": "Solarized Dark",
      "purple": "#D33682",
      "red": "#DC322F",
      "selectionBackground": "#FFFFFF",
      "white": "#EEE8D5",
      "yellow": "#B58900"
    },
    {
      "background": "#FDF6E3",
      "black": "#002B36",
      "blue": "#268BD2",
      "brightBlack": "#073642",
      "brightBlue": "#839496",
      "brightCyan": "#93A1A1",
      "brightGreen": "#586E75",
      "brightPurple": "#6C71C4",
      "brightRed": "#CB4B16",
      "brightWhite": "#FDF6E3",
      "brightYellow": "#657B83",
      "cursorColor": "#002B36",
      "cyan": "#2AA198",
      "foreground": "#657B83",
      "green": "#859900",
      "name": "Solarized Light",
      "purple": "#D33682",
      "red": "#DC322F",
      "selectionBackground": "#FFFFFF",
      "white": "#EEE8D5",
      "yellow": "#B58900"
    },
    {
      "background": "#000000",
      "black": "#000000",
      "blue": "#3465A4",
      "brightBlack": "#555753",
      "brightBlue": "#729FCF",
      "brightCyan": "#34E2E2",
      "brightGreen": "#8AE234",
      "brightPurple": "#AD7FA8",
      "brightRed": "#EF2929",
      "brightWhite": "#EEEEEC",
      "brightYellow": "#FCE94F",
      "cursorColor": "#FFFFFF",
      "cyan": "#06989A",
      "foreground": "#D3D7CF",
      "green": "#4E9A06",
      "name": "Tango Dark",
      "purple": "#75507B",
      "red": "#CC0000",
      "selectionBackground": "#FFFFFF",
      "white": "#D3D7CF",
      "yellow": "#C4A000"
    },
    {
      "background": "#FFFFFF",
      "black": "#000000",
      "blue": "#3465A4",
      "brightBlack": "#555753",
      "brightBlue": "#729FCF",
      "brightCyan": "#34E2E2",
      "brightGreen": "#8AE234",
      "brightPurple": "#AD7FA8",
      "brightRed": "#EF2929",
      "brightWhite": "#EEEEEC",
      "brightYellow": "#FCE94F",
      "cursorColor": "#000000",
      "cyan": "#06989A",
      "foreground": "#555753",
      "green": "#4E9A06",
      "name": "Tango Light",
      "purple": "#75507B",
      "red": "#CC0000",
      "selectionBackground": "#FFFFFF",
      "white": "#D3D7CF",
      "yellow": "#C4A000"
    },
    {
      "background": "#000000",
      "black": "#000000",
      "blue": "#000080",
      "brightBlack": "#808080",
      "brightBlue": "#0000FF",
      "brightCyan": "#00FFFF",
      "brightGreen": "#00FF00",
      "brightPurple": "#FF00FF",
      "brightRed": "#FF0000",
      "brightWhite": "#FFFFFF",
      "brightYellow": "#FFFF00",
      "cursorColor": "#FFFFFF",
      "cyan": "#008080",
      "foreground": "#C0C0C0",
      "green": "#008000",
      "name": "Vintage",
      "purple": "#800080",
      "red": "#800000",
      "selectionBackground": "#FFFFFF",
      "white": "#C0C0C0",
      "yellow": "#808000"
    },
    {
      "background": "#0B0B0F",
      "black": "#50435C",
      "blue": "#7F7AB6",
      "brightBlack": "#505050",
      "brightBlue": "#8D87CC",
      "brightCyan": "#90CAC5",
      "brightGreen": "#A6FA62",
      "brightPurple": "#9F4E85",
      "brightRed": "#BE6482",
      "brightWhite": "#F5F5F5",
      "brightYellow": "#AD8F5D",
      "cursorColor": "#FFFFFF",
      "cyan": "#79ADA9",
      "foreground": "#D0D2DF",
      "green": "#16141B",
      "name": "Void",
      "purple": "#8B4F78",
      "red": "#793E52",
      "selectionBackground": "#FFFFFF",
      "white": "#D0D0FF",
      "yellow": "#AD8F5D"
    }
  ]
}
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
