---
layout: post
title:  "Python, virtualenv and gcalcli"
author: "Dave Jacoby"
date:   "2018-03-08 14:03:52 -0500"
categories:
---

As a user, I should not have to know the languages and frameworks of the tools I use. As an admin and developer, it becomes very important, as the interaction between tools can lead to problems.

I use [`gcalcli`](https://github.com/insanum/gcalcli), a command-line tool that interfaces with Google Calendar to allow you to add and view events.

It is the **first** thing that tends to be wallopped when I start trying to do more with Python. One example is this [blog post on modifying your GMail sig](http://wescpy.blogspot.com/2016/12/modifying-email-signatures-with-gmail.html). I had done that with Perl and Thunderbird, making it say `1689 days using standing desk`. (Or would if I ran it while typing this.)

I would have expected that, in most languages, if the _wrangle-google_ library got updated from `n.0` to `n.1`, or even `n+1`, all projects would still be able to use that library, but no. I found that trying to use this toy "change my personal mail signature" toy broke the "tell me when my next meeting is" tool.

Between then and now, I have upgraded and reinstalled the system, and the apt-provided gcalcli worked again.

Until...

I mention [Globus](https://globus.org/) a lot, because Globus is a big part of my work life. It's something that I don't have to work with, as I have other means of access to all those resources, but on occasion, talking people through creating accounts and transferring research takes up a great part of my day.

The back-end stuff I use right now, uses their [CLI API](https://docs.globus.org/faq/command-line-interface/) and [Net::OpenSSH](https://metacpan.org/pod/Net::OpenSSH), and while I know how the permissions work, it disturbs me. So, I decided to try to get their [REST API](https://docs.globus.org/api/auth/developer-guide/) working. The hardest part of REST, I find, is getting your tokens. Everything else is `GET` and `POST` and `JSON`, things that the tech community has spent the last 25 years trying to make easier.

So, to try to ease the hard part of the process, I installed `[globus-sdk](https://github.com/globus/globus-sdk-python)`, which uses an encryption library, and library conflict killed gcalcli again.

I think I had known the solution.

**virtualenv ALL THE THINGS!**

```
mkdir -p ~/local/venv/gcalcli

cd ~/local/venv/

virtualenv gcalcli

cd gcalcli

source bin/activate

pip install gcalcli

deactivate
```

Then, of course, fix all my aliases like

```
alias agenda='/home/jacoby/local/venv/gcalcli/bin/python /home/jacoby/local/venv/gcalcli/bin/gcalcli --nocolor --calendar "Main" agenda'
```

But it is fixed. I would have to reactivate that environment to install breaking changes like that. It is safe from the system. It is free.

I can and have run `cpan -u` with impunity on my system. Mostly with my `perlbrew` install, but certainly on system perl for systems I rely on. How is it that Python can be this brittle?

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
