---
layout: post
title:  "Considering Perl on Windows; an Addendum"
author: "Dave Jacoby"
date:   "2020-07-28 17:42:22 -0400"
categories: ""
---

[I have previously written about using Perl on Windows](https://jacoby.github.io/2020/07/23/considering-perl-on-windows.html), showing how to install it and one module that is Windows-specific that did a fun but not-necessarily useful thing. I'll dive back into this as I discover the really useful and MS-specific things you can do with Perl.

**But**, there are two things that we need to do in order to use Perl the way you would want to use Perl:

```powershell
PS C:\Users\jacob> .\test32.pl
```

There are _two_ things we need to handle. First, Windows has to know that this is a thing that can be executed, and what might be executed by it.

I mean, we _can_ go like this ...

```powershell
PS C:\Users\jacob> perl .\test32.pl
```

... but that's now how I want to roll.

So, to tell CMD and PowerShell to run test32.pl, it needs the right suffix. If you gave experience with Windows, this will not surprise you. This is how to get the Windows equivalent to `env | grep PATHEXT`, and what I currently have set.

```powershell
PS C:\Users\jacob> Get-ChildItem -Path Env:\PATHEXT

Name                           Value
----                           -----
PATHEXT                        .COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC;.PL;.PY
```

I added both `.PL` and `.PY` because I fully expect to do some stuff with Python before long, because I can read the tea leaves.

There is a mechanism by which you can set environment variables within PowerShell, but I don't know if it keeps it set between sessions, so I set in Advanced System Settings.

At this point, yes you can type this and get a result...

```powershell
PS C:\Users\jacob> .\test32.pl
```

... but that result is probably going to open it in your text editor of choice, this is because we have the equivalent of setting executable, but we are not setting the hashbang.

To do this, we need 1) Windows Explorer and 2) a file with the correct suffix, like `test32.pl`. Open the directory with that file, right-click it, and shoose **Open With**. You may need to **Choose Another App** and navigate your way to where your Perl executable lives.

And now, when I run `test32.pl` from the command line, I get:

![The output of test32.pl, including a MsgBox saying "Did you see this large popup in the middle of your screen?"](https://jacoby.github.io/images/test32.png)

And here we hit the limits of my wisdom of how you run your Perl on Windows like you might on Linux and Unix. Next stop: finding something Windows-specific and fun!

And, maybe writing something about Windows Terminal.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)


