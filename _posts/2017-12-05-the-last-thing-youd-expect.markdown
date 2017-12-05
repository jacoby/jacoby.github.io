---
layout: post
title:  "The Last Thing You'd Expect"
author: "Dave Jacoby"
date:   "2017-12-05 11:47:10 -0500"
categories: 
---

I wrote recently about [Practimer](http://practimer.me/), my web-based timer tool. I put it up, started saying "Look at my cool thing!", and got reports back that it didn't work on iOS. Then later, on Safari. 

None of which I have access to.

This was a data point.

The thing that distinguishes this for me is that it uses `location.hash`. so I search StackOverflow for `MacOS location.hash` and get some "I have a problem" entries with some solutions that didn't look *too much* like pure "maybe **this** will work" cargo-cultism, and I tried that.

The problem is, of course, that a debugging loop that includes texting "Hey, try it again" and waiting for "Nope, still nothing" is not going to iterate quickly.

Especially since no phone or tablet browser allows you to open up console.

But, eventually, I got to the point where I knew for sure "Hey, it's a WebKit thing", so I asked `#LazyWeb` for a browser on Ubuntu or Windows that uses Webkit.

My friend `@gizmomathboy` suggested `epiphany`.

I was not sure if that was a browser or he was just encouraging me to have a flash of insight.

But yes, it is a browser, and it is a browser that has a developers' console, which told me the issue.

It was HTML5 Audio.

[This was surprising for me.](https://caniuse.com/#feat=audio)

So, as much as I loved **Bip-Bip-Bip-Beeeep!** at the end of the timer, I didn't need it, so I pulled it out.

I now know how to test WebKit when I move to add audio back in, and for other features and other projects.

So, that's a win.
