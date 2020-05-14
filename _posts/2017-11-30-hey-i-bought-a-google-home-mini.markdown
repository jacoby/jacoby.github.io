---
layout: post
title:  "Hey! I bought a Google Home Mini!"
author: "Dave Jacoby"
date:   "2017-11-30 17:06:15 -0500"
categories: talking donkeys
---


I bought a [Google Home Mini](https://store.google.com/us/product/google_home_mini) over Thanksgiving break. It was down to $30 for Black Friday and so I thought I would dive in. This is not an unboxing or teardown of the device; if you want that, [Justin Alvey posted a teardown on Medium](https://medium.com/@justlv/google-home-mini-teardown-comparison-to-echo-dot-and-giving-technology-a-voice-c59a23724a26).

## Why? Home Automation

To really understand my take, you have to start with my use case, the core of my home automation journey, which starts with my pain point. Which is living without an alarm clock.

I used to sleep with my alarm in the bathroom so I would be forced to get up and move when it went off, but I decided after seeing a sunrise clock online to try waiting up with light not sound, and I am very pleased with how it works for me. Nick Rowe gave a talk at Reject.JS 2014 about ["Hacking Sleep with JavaScript"](https://www.youtube.com/watch?v=MexHaE0_uVs) that talks a lot about why someone would want to do this, and his method of how.

[![Hacking Sleep with JavaScript]( https://img.youtube.com/vi/MexHaE0_uVs/0.jpg ) ](https://www.youtube.com/watch?v=MexHaE0_uVs)

My first rig was based on X10/SmartHome gear, which worked but relied on my big old desktop having a serial port, and that isn't true right now. So right now, I have two lights on [Wemo switches](http://www.belkin.com/us/Products/home-automation/c/wemo-home-automation/), which is barely a home automation setup. I use iFTTT to schedule the on and off, and I have curl aliases that allow me to turn on and off from a bag prompt, but since that's rarely me at home, it doesn't matter.

So, if I want to switch lights, I must 1) reach for the awkward places the Wemos are plugged into, or 2) open the app on my phone, involving unlocking it and finding the app. Not the most convenient.

So, voice control over the switches is my pain point and was the reason I bought the device in the first place. As a way to control my lights, I am entirely happy. Setup was simple, Wemo was way to integrate and group, and I can now say **"Wake Up"** and **"Shut It Down"** to control my lights. I look forward to adding more devices and feel that the process will be easy.

I know people -- programmers, even -- who say that more than the light switch is overthinking it, but you can't turn in a switch when you're asleep. 

## Media

I'm also a Chromecast and YouTube fan, this is where I start to have a more ambivalent opinion. When I consume media, I try to be very specific. Miles Davis' *Kind of Blue*. Wilco's first album, *AM*. Guru's *Jazzmatazz*.  I asked for some De La Soul and heard KRS-ONE, which isn't the same thing. If I was a bigger **Google Play** user with more playlists and a more optimized personal catalog, or a paid user, my requests would not drop to **"random tracks similar to the Jayhawks"** nearly as much. I am finding **"Play the *TRON* soundtrack"** really means **"Play the first track on the *TRON* soundtrack"**. 

YouTube is ... well. I haven't dived in to hard, because I'm more likely to choose these videos out of my subscription list than give it the benefit of the doubt, but I can report that **"Play Crash Course American History"** works (and is long enough to play my entire sleep cycle) but **"Play my *Watch Later* Playlist"** is to much for Google Home to understand.

Additionally, questions about what is possible, what artists and playlists are available end with a response of **"I don't know how to do that yet."**

The thing to remember is that Google Home is essentially the input/output device for a cloud-based software system, so its capabilities should grow drastically over time, as it isn't bound by near the local hardware. 

After media and home automation, the next thing you see is querying. Sometimes your calendar, sometimes just general questions, but as it is a Google project, you would expect it to have that handled.

## Ask It Questions

[![Google Home Demo - Google I/O 2016]( https://img.youtube.com/vi/2KpLHdAURGo/0.jpg ) ](https://www.youtube.com/watch?v=2KpLHdAURGo)

The main thing I *have* searched for has been today's weather and the forecast for the rest of the week. I haven't asked it to tell me the news of the day are the events in May on today's schedule. I did ask it to add an event and it can't do that yet either. Thankfully, my work is solitary enough that these sort of things are not a great aspect of my requirements, so this is not a deal-breaker for me. 

I haven't asked it to contact anyone yet. That just doesn't sound like me. Nor have I authorized it to make any purchases for me.

## Their Live Mic In My House

I know many people who dismiss the sort of technology, more about "a live mic in the bedroom connected to the internet and maybe your bank account" than anything else, and ... yeah. I world feel happier if the tokenization and interpretation took place locally and it knew "Turn in the lights" meant and it sent the lights-off command to IFTTT. [Mozilla is working on that](https://blog.mozilla.org/blog/2017/11/29/announcing-the-initial-release-of-mozillas-open-source-speech-recognition-model-and-voice-dataset/), and [Microsoft also has an interest in **ML on the Edge**](https://www.microsoft.com/en-us/research/project/resource-efficient-ml-for-the-edge-and-endpoint-iot-devices/), so this sort of intelligent interaction with low-power devices (a friend says they're like a Tyranosaurus Rex -- "Tiny ARMs") should be coming, albeit not with the Google Home Mini. 

In the meantime, and I don't think Amazon and Google see reasons to change ([I could be wrong](https://www.blog.google/topics/machine-learning/introducing-aiy-vision-kit-make-devices-see/)) , we'll see the networked form. ["The Rich have got their channels in the bedrooms of the Poor"](https://genius.com/2693886), as Leonard Cohen sang. I am not the most happy with a networked live mic in my home, and I would like it better if I had control of it.

## Development

The thing that always gets me about *gadgets* is that they seem to be one-use devices, and as a trained computer programmer, I should be able to get them to do things that I need them, and while I haven't yet (I haven't had one very long!), I am seeing how.

[![Build an App for the Google Assistant with Templates and No Code]( https://img.youtube.com/vi/sjpbu4y6F_M/0.jpg ) ](https://www.youtube.com/watch?v=sjpbu4y6F_M)

Ultimately, it seems from this video from Google, you take the speech recognition and synthesis as read and move forward with the idea. Testing is done with the Google Assistant app, which is basically Allo. I've not done much with building bots, but it soulds like a lot of it is handled by Google already. [You can also run Google Assistant on your computer, with the help of Python3.](https://www.xda-developers.com/how-to-get-google-assistant-on-your-windows-mac-or-linux-machine/) 

## Suggestions and Additions

* Home Automation devices are grouped by location, and you can get confusion and unsatisfactory results if you have the location be **Bedroom** and one switch be **Bedroom Lights**, for example. 
* It will not always remember to play media on your Chromecast instead of it's internal speaker.
* The Home Mini has touch controls for volume and a mute switch. I haven't used them.
* Configuration comes through the Google Home app, which for me replaced the Chromecast control app. You might not have it already.
* If you don't have at least a few devices, you will not find as much value in the Google Home ecosystem.
* I am curious if you need to train each new one to recognize your voice, or if that's something stored by the mothership and you just need to mark it as yours. I also haven't set up any other users on mine yet.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
 