---
layout: post
title: "Moving Forward with Progressive Web Apps: A Few Technical Challenges"
author: "Dave Jacoby"
date: "2018-12-27 16:25:59 -0500"
categories: ""
---

About a year ago, I bought the name _practimer.me_ and got a Digital Ocean droplet to put up my first toy site. I had the code for over a year before: a timer using standard web tools — HTML, CSS and Javascript, with no frameworks — but this was the first I put a name and a site on it.

And, over the last year, I started hearing a lot of noise about **Progressive Web Applications**, which is [one](https://electronjs.org/) [of](https://docs.microsoft.com/en-us/windows/uwp/get-started/universal-application-platform-guide) [several](https://www.adobe.com/products/air.html) [different](https://phonegap.com/) ways to create desktop/mobile applications using web tools.

## What's a Progressive Web App

![Progressive Web Apps in paper and ePub](/images/prog_web_apps.jpg)

As a birthday present, I bought myself [Jason Grigsby's _Progressive Web Apps_](https://abookapart.com/products/progressive-web-apps) from [A Book Apart](https://abookapart.com/), to start to tease out what that means and what it could do for me. One of the hats I wear is designer, so I'm sure that will be useful to me over time as a continuing resource, but it was worth the cost on page 7 when it started **The Technical Definition**, which is

- **HTTPS**
- **A service worker**
- **A web app manifest**

_Bullet points!_ _A check-list!_ This I can work with!

Thanks to [Certbot](https://certbot.eff.org/), I have the HTTPS jazz working _on the server_. (Let's put a pin right there.) And what's a manifest? Something in JSON that looks a _lot_ like this:

```javascript
{
  "short_name": "Practimer",
  "name": "Practimer - a Practical Web Timer",
  "start_url": "https://practimer.me/#5m0s",
  "display": "browser",
  "scope": "/",
  "background_color": "#000000",
  "theme_color": "#000000",
  "lang": "",
  "orientation": "any",
  "description": "I had need for a timer. I didn't like any of the timers that were available to me, so I wrote one. I wrote it using Vanilla Javascript, location.hash, and a few interesting parts of CSS and HTML5.",
  "icons": [
    {
      "src": "https://practimer.me/images/icon-192.png",
      "sizes": "192x192"
    },
    {
      "src": "https://practimer.me/images/icon-512.png",
      "sizes": "512x512"
    }
  ]
}
```

This _could_ be better; if I want to add this to the App stores, I'm told I need to add a number of image sizes. I'm going to mention `"display": "browser"` so we have it in our heads, then move on to the next bullet point.

Which is **Service Workers**. What are they? I do not love that name, but a service worker is Javascript standing between you and the server. At the very least, it's serving as a cache, so when you have data to send and receive, it holds onto it if the server is unavailable, like when you're between cell towers, and send and receive things later.

For _my_ purpose, of course, I just need a big spinning no-op of a service worker, just enough to put a check in the box and let me go forward.

## The Catch

I don't want to develop in production, where I have HTTPS.

I don't want to run a full web stack on my laptop.

I need to do one or the other so that I can go to `https://localhost:8888/` and test my SW code.

If I was intending some sort of dynamic server-side code, I would run Node or Dancer or Ruby on Rails or something, but I just needed a static server, and I found [a Chrome Extension that gave me a web server](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb/related). This gave me `https://localhost:8888/`, but I need `HTTPS://localhost:8888/`.

This is where [David Jones](https://twitter.com/unixmonkey/) came to the rescue, suggesting [ngrok](https://ngrok.com), which allows you to tunnel with this command: `ngrok http -bind-tls=true 8888`. Go to [the dashboard](https://dashboard.ngrok.com/) and find where the tunnel ends and you'll get your local HTTP server wrapped with HTTPS.

This got me to where I could focus on just working on service workers, and finding the least I could do with them.

Mozilla provides [serviceworke.rs](https://serviceworke.rs/) as a cookbook site, but that's a bit further than I needed. The more basic tool I needed was [PWA Builder](https://www.pwabuilder.com/), which gave the drop-in code for both the web page and service worker, as well as listed the image sizes I needed to add to the manifest for the different target platforms. Way cool, and knowing what the server needs is the first step toward writing to it.

## To-Do

To go back to that pin, there are four possible settings for `display`:

- `browser` - looks like browser
- `minimal-ui` - drop most of the details
- `standalone` - look like a standalone application
- `fullscreen` - all of the screen.

If I set it to `browser`, it can't _really_ be a PWA, but if I set it to anything else (it seems to want `minimal-ui` or `standalone`), I lose the `location.hash` that is the key to my UI.

I've done some playing with both keystroke events and [Hammer.js](https://hammerjs.github.io/) that give me ideas about what to do next, so a next-gen timer will have keyboard or swipe interface and not need `location.hash`. 

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
