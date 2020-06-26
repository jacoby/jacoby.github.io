---
layout: post
title: "Perl in Powershell: Today I Learned"
author: "Dave Jacoby"
date: "2020-06-26 16:24:25 -0400"
categories: ""
---

So, we're in a PowerShell terminal, and we have written and compiled a Hello World program in .NET, and we want to run it.

```powershell
PS PS C:\Users\jacob> .\hello_world.exe
Hello World!

Press any key to Exit
PS PS C:\Users\jacob>
```

If we then want to start Chrome and pop up a new window (because it's already open, because of course it is), you type this:

```powershell
PS C:\Users\jacob> 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' --new-window
PS C:\Users\jacob>
```

It would be shorter if we had added that to my path, but nevermind. That's another blog post.

So now we have a small Hello World as a Perl program, and we want to run it with Strawberry Perl within our PowerShell tab of our Windows Terminal window.

```powershell

PS C:\Users\jacob> .\helloworld.pl
PS PS C:\Users\jacob>
```

And then another window pops up, which runs the Perl interpreter, sending `Hello World!` to STDOUT in that window, and then exits before we really truly understand that the window is there.

This is probably not what we want. I mean, what I want is about the same as when I run that in a Linux terminal.

Something that behaves like this:

```powershell
C:\Users\jacob> perl .\helloworld.pl
Hello World
PS C:\Users\jacob>
```

If you want to use `perl` in the command-line mode, like `sed` and `awk`, this is _fine_. If you want to have a collection of small programs you build up for your use, this _sucks_.

### There Has To Be A Better Way

Microsoft is all about File Extensions.

[I found a bug in VS Code a while ago](https://jacoby.github.io/2018/09/19/i-find-the-strangest-bugs.html). In short, a Unix tool would create an error file named `2551.e1280822`, and `code 2551.e1280822` would open up the Visual Studio Code, an Electron (HTML, CSS & JS for the Desktop) application, and there was nothing in the code that would say everything not otherwise set in ARGV would be strings.

This makes sense to me, because being a web-centric thing from the Microsoft world, we would expect to see lots of files that end with _.html_ or _.htm_ or _.css_ or _.js_, or _.txt_ or _.json_ or _.py_ or even _.pl_, because I had never had problems with VS Code handling Perl.

But `2551.e1280822`, when looked at by JS, looks a _lot_ like **2551.0 x 10<sup>1280822</sup>**, which is a 2551 followed by over 1.2 million zeroes, which is a larger number than JS can deal with, so it said **Infinity** and called it a day.

The file extension saved the day, forcing the editor to know all these filenames were strings, until it was ambiguous. This has been fixed for almost two years, so no worries, but it shows the mindset.

Which is our solution here.

`$ENV:PATHEXT`

[The default for Windows 10 is `COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC`](https://superuser.com/a/1027081/), and it's as simple as adding `;.PL` to this environment variable.

Or, of course, using WSL.

```powershell
PS C:\Users\jacob> .\helloworld.pl
Hello World
PS C:\Users\jacob>
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
