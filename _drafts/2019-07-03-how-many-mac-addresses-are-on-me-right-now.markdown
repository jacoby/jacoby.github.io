---
layout: post
title:  "How Many MAC Addresses Are On Me Right Now?"
author: "Dave Jacoby"
date:   "2019-07-03 11:14:53 -0400"
categories: ""
---

## What's A MAC Address?

**Metaphor Time!**

You go to your favorite coffee shop and order a latte. They ask for your name, write it on the cup, and start to prepare your caffeinated drink.

Eventually, after the brewing and the pouring and all, they call out the name you gave, and you come to collect the beverage.

MAC addresses serve as your device's name in the networking context. It cannot receive the packets (the "coffee" in the metaphor) unless it answers to the name it gave.

_"...the name it gave."_

I emphasize this because it doesn't _have_ to be your name, or any name you have ever had. At a conference last year, I organized a "Dave BOF" after realizing that there were at least five other Daves in the conference, my name is so common. So I often give the name ["Clem"](https://buffy.fandom.com/wiki/Clement) at coffee shops, because that name's _rare_.

And let's dive down on _it_ a bit. These things are unique to the networking device, which means if you switch your cards to another computer (which, in the days of desktop computers, I used to do), that MAC address went with it. In our coffee shop metaphor, I might generally say "Clem", but go by "Larry" to the barista who is a bit _too much_ of a _Buffy the Vampire Slayer_ fanboy.

In a less metaphorical sense, I've heard stories of high-availability servers have their fail-over machines replicate their MAC addresses, so that the traffic never stops. It strikes me that, with Kubernetes and load-balancing and everything we've developed in the last 20 years, this is not something we do with new systems, but I could be wrong.

## The Count

Headphones: Bluetooth. 1 MAC.

FitBit: Bluetooth. 1 MAC.

Android Tablet: Bluetooth and WiFi. 2 MACs.

Bluetooth keyboard: Bluetooth. Duh. 1 MAC.

Laptop: Bluetooth and WiFi. 2 MACs.

Logitech Unifyng dongle: Unifying is like Bluetooth but different. We'll say 1 MAC.

Logitech presentation remote: I _know_ that these things have unique dongles, use non-IR protocols so line-of-sight isn't required, and for this to be true, it must use some sort of pre-Unifying networking protocol, so I have to assume 2 MACs, for the dongle and device, although I cannot prove it.

Raspberry Pi Zero: I put it together as a conference nametag. It's a full computer, more powerful than many I used professionally in my life, and I used it to run an e-ink display. Anyway, it is in my backpack, and has onboard WiFi and Bluetooth. 2 MACs.

Android Phone: Here we get a new one. It has Bluetooth (I'm listening to _Purple Rain_ on the above-mentioned headphones over Bluetooth), and WiFi, but it can also talk to my cellular provider's data network. I have to say 3, but there's a digression from what I've seen.

Should I count [MEID/IMEI](https://en.wikipedia.org/wiki/Mobile_equipment_identifier)? 

So, 15 uniquely-identifying numbers that my devices throw around.

## Digression

> 1X/3G/4G interfaces on cellular devices do have a MAC address, but those MACs are dynamically assigned and change on every reboot of the device... this is because MAC addresses only apply to IEEE 802 technologies, of which cellular networks are not.
> 
> So yes, cellular networks are dynamically assigned a MAC address on a smartphone when that device is powered on or rebooted, however, these dynamically assigned MACs cannot be used in a firewall (it would literally be pointless to do so).
>
> -- [ServerFault](https://serverfault.com/a/680203/19323)

This is answering a question that isn't ours, but it seems that, for some of our cellular networking protocols, your device is not permanently unique.

This can be good: Your phone checks for cells, and those are logged and can be used to track you. iOS creates a random MAC for this. (I deleted the link to the source on that one; sorry!)

So, I might get to dock one.

## What's The Point?



If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


