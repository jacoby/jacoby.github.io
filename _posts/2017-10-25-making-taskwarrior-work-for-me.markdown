---
layout: post
title:  "Making TaskWarrior Work for Me"
author: "Dave Jacoby"
date:   "2017-10-25 12:29:26 -0400"
categories: 
---

Let us start with one of the pillar of *Getting Things Done*: **Capture**

> *Capture everything. Your to-dos, your ideas, your recurring tasks, everything. Put it in a pen-and-paper notebook, a to-do app, a planner, whatever you prefer to use to get organized. GTD doesn't say to use a specific tool, but whatever you use has to fit into your normal flow. The barrier to using it should be so low that there's never a reason for you to say "I'll add it to my list later." You want to capture everything as soon as it happens so you don't have to think about it again until it's time to do it.* **[Lifehacker](https://lifehacker.com/productivity-101-a-primer-to-the-getting-things-done-1551880955)**

I have floated through many options for capture, and many have been there for when my random ideas come (I have some Trello boards, I almost always carry a small notebook and a pen, and I now have a whiteboard in my workspace), they really aren't under my fingers when I'm getting down to work.

I had read several developers on Twitter who have been using [TaskWarrior](https://taskwarrior.org/), and after the work crunch got to a point where things mostly worked, I installed it on my desktop Linux box. 

I'm liking it so far -- as with most of these things, you have to work with it for a while before you know if it works for you -- but the problem I find is out-of-sight, out-of-mind, so I wanted a continual reminder that tasks were there. 

[Paul Fenwick](https://twitter.com/pjf/status/852467061074796544) wrote and tweeted about adding notifications to his bash prompt. This is something I liked immediately: my desktop bash prompt contains user and hostname, path, time, current temperature in fahrenheit, the update/reboot status of the machine as unicode characters, and the current branch if I'm in a Git directory. 

In the past, I have had my Fitbit steps so far that day and the current latitude and longitude of the International Space Station. On my laptop, it has the best-guess latitude and longitude based on WiFi and Google geolocation. 

I believe Paul uses a Mac, but he's able to use full-on Emoji. If I can do that in `gnome-terminal` on Ubuntu, I am unaware of how. So, I pulled back to tested unicode characters.

```bash
prompt='\033[1;38;5;82m'
revert='\033[00m'

URGENT="2757"
DUETOMORROW="2690"
DUETODAY="2691"
OVERDUE="2639"
OK="2714"
function task_indicator {
    if [ `task +READY +OVERDUE count` -gt "0" ]  ; then
        printf "%b" "\u$OVERDUE"
    elif [ `task +READY +DUETODAY count` -gt "0" ]  ; then
        printf "%b" "\u$DUETODAY"
    elif [ `task +READY +DUETomorrow count` -gt "0" ]  ; then
        printf "%b" "\u$DUETOMORROW"
    elif [ `task +READY urgency \> 10 count` -gt "0" ]  ; then
        printf "%b" "\u$URGENT"
    else
        printf "%b" "\u$OK"
    fi
}

if [[ -z $DESKTOP_SESSION ]]
    then
        prompt='\033[1;38;5;16m\033[1;48;5;2m'
    fi

   export PS1="\n\
\[\033]0;\u@\h: \w\007\]\
${debian_chroot:+($debian_chroot)}\
\[${prompt}\]\$(~/bin/need_reboot.pl)\[${revert}\] \
\[${prompt}\]`task_indicator`\[${revert}\] \
\[${prompt}\]\u@\h\[${revert}\] \
\[${prompt}\]\A\[${revert}\] \
\[${prompt}\]\$(~/bin/get_temp.pl)\[${revert}\] \
\[${prompt}\]\$(~/bin/get_coffee.pl)\[${revert}\] \
\[${prompt}\]\$(~/bin/pull_dbus_address.sh)\w\$(__git_ps1)\[${revert}\] \
\n\$ "
```

This gives me a prompt that looks like this:

> `💻 ✔ jacoby@oz 13:02 45°F 2 cups ~/local/dev/jacoby.github.io (master) `

On other machines, I have different prompts, where I vary the colors based on hostname. I can tell it's `purdue.pl` because it's (close to) Old Gold. And above, it has a different color display based whether I'm there or connected via SSH.

If you have questions, comments, suggestions and affirmations, do so as an issue to [my blog repo](https://github.com/jacoby/jacoby.github.io).