---
layout: post
title: "Playing with Windows Terminal"
author: "Dave Jacoby"
date: "2019-07-20 19:04:00 -0400"
categories: ""
---

I have been a WSL user for some time, and also someone keen on hacking my Bash prompt, which has lead me to find that Windows Terminal has lagged for some time on Gnome Terminal for Unicode support, which means that, for example, if you want icons to tell you that you've had several cups of coffee, your laptop battery is low, or your Git repo's status is that of smiling poo, they just wouldn't show up well on Windows.

There were places that were okay. They worked fine with th e Cygwin terminal and the Git Bash that was derived from it, and I recall that PuTTY handled things well (but now that you can SSH from PowerShell _and_ CMD prompts, I never open it anymore), but the built-in terminals were basically unchanged from NT and maybe before.

Rich Turner would know, because he wrote the ... well, blog series ... on [the history of terminals in Windows](https://devblogs.microsoft.com/commandline/windows-command-line-backgrounder/), which lead to the release of the new [Windows Terminal](https://github.com/microsoft/terminal). You can download it from the [MS Store](https://www.microsoft.com/en-us/p/windows-terminal-preview/9n0dx20hk701) now, and unlike some other favorite toys, you don't have to be Fast Track Windows Insider. So let me show you around!

## Pretty

I'm starting with the WSL prompt, because, as a Linux guy, I've done much mroe work with my Bash prompt customization. So far, that is.

![WSL Terminal Tab](https://jacoby.github.io/images/wt_wsl.png)

I point out a few things here. The coffee cup emoji (☕) indicating the cups I've consumed that day. Also, the computer emoji (💻) indicating that I don't have packages to add, and the battery (🔋), which doesn't mean much because the term is on my desktop, but would indicate battery charge level. Also, I try to use [Taskwarrior]() and the check (✔) signifies that I have no tasks outstanding. And all of it shows up in the new Windows Terminal, which was not always true.

I'll also mention that I'm using [Fira Code](https://github.com/tonsky/FiraCode), a font that supports ligatures, and it shows `<=` as one character, not two.

You can't see it from the screen capture, but the cyberpunk image is an animated GIF, that is animated behind the text.

![Cyberpunk.gif](https://jacoby.github.io/images/cyberpunk.gif)

I consider this a big thing, because I wrote a tool to set your Windows background image, and that only accepts JPEG.

This configuration is specific to the kind of term you're opinging, so if you want a PowerShell terminal, it looks different.

![PowerShell Terminal Tab](https://jacoby.github.io/images/wt_ps.png)

## Configuration

Shortened, the configuration file looks like this.

```json
{
  "globals": {},
  "profiles": [],
  "schemes": []
}
```

### (Color) Schemes

Back to front, _schemes_ are _color schemes_, and look like this:

```json
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
  "cyan": "#3A96DD",
  "foreground": "#CCCCCC",
  "green": "#13A10E",
  "name": "Campbell",
  "purple": "#881798",
  "red": "#C50F1F",
  "white": "#CCCCCC",
  "yellow": "#C19C00"
}
```

As you can see, it's taking the names of default colors, plus foreground, background, etc., and putting a name to them.

_Campbell_ is the out-of-the-box scheme, but you can change that and you can change these, in...

### Profiles

```json
{
  "acrylicOpacity": 0.5,
  "background": "#012456",
  "backgroundImage": "ms-appdata:///roaming/dotty-me.jpg",
  "backgroundImageOpacity": 0.25,
  "closeOnExit": true,
  "colorScheme": "Campbell",
  "commandline": "powershell.exe",
  "cursorColor": "#00FF00",
  "cursorShape": "bar",
  "fontFace": "Consolas",
  "fontSize": 10,
  "guid": "{61c54bbd-c2c6-5271-96e7-009a87ff44bf}",
  "historySize": 9001,
  "icon": "ms-appx:///ProfileIcons/{61c54bbd-c2c6-5271-96e7-009a87ff44bf}.png",
  "name": "Windows PowerShell",
  "padding": "0, 0, 0, 0",
  "snapOnInput": true,
  "startingDirectory": "%USERPROFILE%",
  "useAcrylic": false
}
```

This is the profile for PowerShell, and I have customized it some. `background` is _background color_, and you jump to `backgroundImage` to set an image.

![Dotty Me](https://jacoby.github.io/images/dotty-me.jpg)

But, of course, you want to see the text _over_ your image, so `backgroundImageOpacity` is a float between 0 and 1 setting how much is there.

Valid `cursorShape` values are bar, emptyBox, filledBox, underScore, and vintage. [Thanks, Donovan Brown!](http://donovanbrown.com/post/Cursor-shapes-for-new-Windows-Terminal/).

Evidently, _Acrylic_ is a way to make a terminal translucent; the background is viewable through, but not in focus. This is where `useAcrylic` and `acrylicOpacity` fit in, but I have yet to make them work.

There's a lot of Windows short-hand stuff here. `ms-appdata:///roaming/` means `C:\Users\you\AppData\Local\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\RoamingState`. `%USERPROFILE%` is a long and complex way of writing `~` and the `startingDirectory` field it sets doesn't do much for starting `wsl`, so the hack is to make your `commandLine` ask for `"wsl.exe ~ -d Ubuntu-18.04"`. And then there's the unique identifier, or `guid`. This is used primarily to indicate which choice comes up when you open WT, in ...

### Globals

```json
    "globals": {
      "alwaysShowTabs": true,
      "defaultProfile": "{7c51c86f-d763-44fc-b952-e04d5922f631}",
      "initialCols": 120,
      "initialRows": 30,
      "keybindings": [{
        "command": "closeTab",
        "keys": [
          "ctrl+w"
        ]
      }, {
        "command": "OTHERS",
        "keys": [
          "plenty"
        ]
      }],
      "requestedTheme": "system",
      "showTabsInTitlebar": true,
      "showTerminalTitleInTitlebar": true
    }
```

_Most_ of these seem to not do much, especially everything with `Tab` in the key. `defaultProfile` is what decides which of your choices come up when you open a tab or create a window, and that is set by that profile's `guid`, and these GUIDs seem unique to the project, so your `Ubuntu-18.04` GUID just might be mine.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
````
