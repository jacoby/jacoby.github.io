---
layout: post
title: "Playing with Windows Terminal"
author: "Dave Jacoby"
date: "2019-07-20 19:04:00 -0400"
categories: ""
---

## Pretty

## Configuration

Shortened, the configuration file looks like this.

```json
{
  "globals": {},
  "profiles": [],
  "schemes": []
}
```

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

![Insert Image Here]()

But, of course, you want to see the text _over_ your image, so `backgroundImageOpacity` is a float between 0 and 1 setting how much is there.

Valid `cursorShape` values are  bar, emptyBox, filledBox, underScore, and vintage.  [Thanks, Donovan Brown!](http://donovanbrown.com/post/Cursor-shapes-for-new-Windows-Terminal/).

Evidently, _Acrylic_ is a way to make a terminal translucent; the background is viewable through, but not in focus. This is where `useAcrylic` and `acrylicOpacity` fit in, but I have yet to make them work.

There's a lot of Windows short-hand stuff here. `ms-appdata:///roaming/` means `C:\Users\you\AppData\Local\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\RoamingState`. `%USERPROFILE%` is a long and complex way of writing `~` and the `startingDirectory` field it sets doesn't do much for starting `wsl`, so the hack is to make your `commandLine` ask for `"wsl.exe ~ -d Ubuntu-18.04"`. And then there's the unique identifier, or `guid`. This is used primarily to indicate which choice comes up when you open WT, in ...

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
            }
        ],
        "requestedTheme": "system",
        "showTabsInTitlebar": true,
        "showTerminalTitleInTitlebar": true
    }
```

_Most_ of these seem to not do much, especially everything with `Tab` in the key. `defaultProfile` is what decides which of your choices come up when you open a tab or create a window, and that is set by that profile's `guid`.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
