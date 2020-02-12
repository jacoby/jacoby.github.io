---
layout: post
title:  "Hey! I wrote PracTimer.me!"
author: "Dave Jacoby"
date:   "2017-12-04 09:27:25 -0500"
categories: web
---

**tl;dr:** It's an easy to use web-based timer! [Check it out!](http://practimer.me/#5m0s)

## Origins

It started a little over a year ago, when I learned about the HTML5 Audio API at a local tech event. The presenter went into using the keys of a laptop as a musical keyboard, but my take was to make the tones associated with old-school telephony, the dialtone and DTMF tones, including the `A`, `B`, `C`, and `D` tones that came with the lineman's handset. 

The next thing that came to mind was the `dit dit dit deeeet` you'd hear at the end of a timer.

Which made me think about timers.

The way Javascript handles time goes to the millisecond, and is one of the things I really like about the language.

``` javascript
var looper = setInterval( function () {
    if ( condition ) { window.clearInterval(looper) ; }
    }, 1000 ) ;
```

This will run every second until condition is true. Everything else is a display hack.

## Display Hacks Are Tough

[Lea Verou](https://twitter.com/leaverou) gives talks at JS and CSS conferences using only web tools for her presentation software, and man, the things you simply with cascading style sheets is mind-boggling. The amount of CSS I've learned after 2001 is dwarfed by the old standbys I learned before, so I look with amazement at the new things, and then promptly forget that was possible, much less how.

One of the things I remembered and used was `vw`. Even before the rise of Apple's Retina displays, we weren't *really* working at the pixel level, but Retina definitely proved the fiction. What `vw` gives you is constant size related to window size. If `00:00` fills the width of the screen on your full-screen desktop browser window, it will do so with your phone in landscape mode, your phone on portrait mode, etc. 

## Requirements and Constraints

I'm an organizer for [Purdue Perl Mongers](http://purdue.pl/), and we decided that, in order to keep the stress levels down for the December meeeting, we'd go for a Lightning-Talk format which I call **Starship Mongers** -- "Everybody talks. No one quits." For this, I needed a five-minute timer. I had also been involved in startup-related events where you have five minutes for your pitch. "Tell me when five minutes is up" is a very common thing in my life.

But not everyone need that all the time. I didn't want to add too much complexity.

(In fact went forward attempting to write Vanilla JS. I use jQuery for most of my work projects, but for this project, I realized that `getElementById()` was sufficient for my needs, so, as of this writing, it exists in two files. `tone.js` exists because I have the DTMF code also making sounds, so pulling out the tone generation into a separate class was practical and another good learning experience.)

So the final question was "How do I set the time?" I didn't want to complicate the high-contrast, high-readability, high-portability interface I had created to make a slow time-setting setup, and sat and wondered for a while.

Then I remembered [LifeHacker](https://lifehacker.com/).

Time was, LifeHacker and other Gizmodo-owned blogs had a clever setup. The URL of the post would be something like `https://lifehacker.com/#/year-month-day-title-of-the-post`. Additionally, you scrolled down and another, related post appeared, and the URL became `https://lifehacker.com/#/year-month-day-title-of-the-second-post`. 

This uses the `fragment` part of the URI. 

    scheme://host:port/path/to/desired/point?query=variable#fragment

This is normally used with `anchor` tags. For example, within the page for Tim Berners-Lee in Wikipedia, there appears a tag that says '<span id="Career">Career</span>', and following the link `https://en.wikipedia.org/wiki/Tim_Berners-Lee#Career` takes you directly to when the inventor of the World Wide Web started working.

The good thing with using this, which the DOM refers to as `location.hash` is that changing it does not require a page reload, which means you can control behavior within your code by hooking a function to `window.onhashchange`.

The bad thing, of course, is that not every browser supports Javascript, and one of the browsers that doesn't is the spider that works for Google, so `https://lifehacker.com/#/year-month-day-title-of-the-post` will **never** show up in the search results. Which is why you don't see it anymore.

But just because a thing isn't useful for a blog, that doesn't mean it isn't a useful tool, and so I decided that would be how I would set time. `#5m0s` is my default, but if you bookmark with `#25m`, you have yourself a Pomodoro timer. 

So, please, [use my timer](http://practimer.me). [Fork the repo](https://github.com/jacoby/Practimer). Make suggestions and improvements. There are animation things I want to do, like not redrawing but still moving forward and beeping and all when the window is not in focus. If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
