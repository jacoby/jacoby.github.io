---
layout: post
title: "Networking, Netmask and Why My Phone Could Not Connect"
author: "Dave Jacoby"
date: "2018-08-31 10:09:58 -0400"
? categories
---

This was long ago, but not that long ago. I had an early Android phone and would use it to connect to the campus Wi-Fi. Suddenly, it stopped working.

I mean, it _worked_ — it told me I was connected to the named network — but once on, I couldn't _do_ anything.

This was all I knew, and this was new behavior, and I _wanted_ the Wi-Fi access. This was in a corner of campus with poor-to-no data coverage, so without Wi-Fi, it was a brick.

So I reported this issue.

Weeks pass.

Paraphrase: "Go away kid, you bother me."

In discussion with coworkers, I get the idea to install general networking tools (which didn't come and aren't generally default on Android devices) and figure out what exactly this issue is.

# Not The Problem

Let me list the things that I knew were not the problem:

- Password
- Network configuration
- My phone in general

It connected to other Wi-Fi networks and to the data networks. The phone was alright. It's the Wi-Fi that's wrong.

# IP and Netmasks

IPv4 addresses are always four octets. They are this way because human brains like them better that way. Given an IP address of **10.10.10.100**, the binary representation would be **00001010 00001010 00001010 01100100**, and that, as expressed as an integer, would be **168430180**. Octets are better because that gives us four smaller numbers, which, because of [Chunking](<https://en.wikipedia.org/wiki/Chunking_(psychology)>), we can remember better than nine digits. It becomes four things not nine.

But computers don't think of them as octets. It thinks of them as binary numbers. Remember that.

and the octets for the netmask are always the following: **255, 254, 252, 248, 240, 224, 192, 128, and 0**. That may seem oddly specific, but they all have a property. They're all, in binary, a series of ones follow by a series of zeroes.

```text
    255     11111111
    254     11111110
    252     11111100
    248     11111000
    240     11110000
    224     11100000
    192     11000000
    128     10000000
    0       00000000
```

A common netmask would be **255.255.255.000**

This corresponds to the binary number **11111111 11111111 11111111 00000000**. A netmask that intersperses zeroes and ones wouldn't make sense, because the point is to differentiate the machines that are within the same network and the ones outside.

**DHCP**, the **Dynamic Host Configuration Protocol**, is used for networks, wired and wireless alike, to provide devices what they need to participate on the network. Among these are the netmask, an IP address for the host itself, and a **default gateway**, which is where the rest of the Internet is.

There are ranges that are private, that may be used by anybody but are not unique. One of those ranges is **10.0.0.0 – 10.255.255.255**. It is unlikely that someone is going to try to connect to a phone or laptop that's connected over Wi-Fi, or rather, _legitimately_ try to connect, it makes sense to use a private address range for that purpose, so, we'll use **10.10.10.0** as our network.

A new host, let us say an Android phone, connects to the network. DHCP sends that host an address — **10.10.10.100** — a netmask — **255.255.255.0** — and a default gateway — **10.10.10.1**.

We have 256 addresses from 0 to 255, and we take away three for the network, gateway and broadcast, leaving 253. Meanwhile, we get more people and more devices per person. Laptops, phones, tablets, and more come on, taking up all of those 253 addresses. So, we say we have room to grow, and add **10.10.11.0-255** to the **10.10.10.0-255** we already had, and the DHCP lease, the time where the DHCP server gives this IP address to this MAC address (the actual unique address of a network device), is up, so this Android phone gets a new address. **10.10.11.100**.

> 00001010 00001010 0000101**0** 00000001 - 10.10.10.1 - **Gateway** 
> 
> 00001010 00001010 0000101**1** 01100100 - 10.10.11.100 - **Host** 
> 
> 11111111 11111111 1111111**1** 00000000 - 255.255.255.0 - **Netmask**

When the netmask digit is one, the digits between two addresses should be the same, else they're not in the same network.

And, if your gateway is not in the same network, how are you supposed to get out to the rest of the Internet?

So I reported this issue.

Weeks pass.

Paraphrase: "Go away kid, you bother me."

And, a month later, the phone could connect. Maybe someone whose positon in the org chart was higher than mine complained. Maybe one of their devices lost a lease and was issued a new, out-of-network IP address. Maybe — **gasp!** — they read my email and fixed the issue. I will never know.

But that is a little on how IP works and what the netmask is for.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
