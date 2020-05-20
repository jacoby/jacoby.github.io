---
layout: post
title: "Is HTML a Programming Language? and other Thoughts"
author: "Dave Jacoby"
date: "2020-05-19 19:15:07 -0400"
categories: ""
---

### "HTML is a Programming Language"

A shot-across-the-bow from Twitter:

[![The “H” in HTML stands for “Hate to tell ya, but if you think it’s not a programming language, you’re wrong”.](https://jacoby.github.io/images/H_in_HTML.png)](https://twitter.com/hankchizljaw/status/1262765235468791808)

This is something I've considered, back of my mind, for decades, but I don't think I had decided what I think until today.

I mean, it's clearly _not_ [Turing-complete](https://en.wikipedia.org/wiki/Turing_completeness). You don't have the control structures that you get from other languages. You have that, to some extent, with CSS, tho.

![What CSS Fizzbuzz looks like](https://jacoby.github.io/images/fizzbuzz_css.png)

```css
<!DOCTYPE html>
<html>
  <head>
    <title>FizzBuzz in CSS</title>
    <style>
      body {
        counter-reset: fizzbuzz;
      }
      div {
        background-color: azure;
        border: 1px solid gray;
        display: inline-block;
        margin: 2px;
        text-align: center;
        width: 5em;
      }
      div:before {
        counter-increment: fizzbuzz;
        content: counter(fizzbuzz);
      }
      div:nth-child(3n):before {
        content: "Fizz";
      }
      div:nth-child(5n):before {
        content: "Buzz";
      }
      div:nth-child(15n):before {
        content: "FizzBuzz";
      }
    </style>
  </head>
  <body>
    <div>&nbsp;</div> <div>&nbsp;</div> <div>&nbsp;</div>
    <div>&nbsp;</div> <div>&nbsp;</div> <div>&nbsp;</div>
    <div>&nbsp;</div> <div>&nbsp;</div> <div>&nbsp;</div>
    <div>&nbsp;</div> <div>&nbsp;</div> <div>&nbsp;</div>
    <div>&nbsp;</div> <div>&nbsp;</div> <div>&nbsp;</div>
    <div>&nbsp;</div> <div>&nbsp;</div> <div>&nbsp;</div>
    <div>&nbsp;</div> <div>&nbsp;</div> <div>&nbsp;</div>
    <div>&nbsp;</div> <div>&nbsp;</div> <div>&nbsp;</div>
    <div>&nbsp;</div> <div>&nbsp;</div> <div>&nbsp;</div>
    <div>&nbsp;</div> <div>&nbsp;</div> <div>&nbsp;</div>
    <div>&nbsp;</div> ...
  </body>
</html>
```

But what is programming? Programming is assembling code so that computers interpet it into something you want. And trying to get something approaching pixel-perfect across several platforms, with available fonts and stuff? Yeah, I'll call that programming.

### Something More

![Swing-Arm](https://jacoby.github.io/images/swing_arm.jpg)

This is a project made several years back, working off an old swing-arm desk lamp I was given. [Ikea](https://www.ikea.com/) has the [Tertial](https://www.ikea.com/us/en/p/tertial-work-lamp-with-led-bulb-dark-gray-00424985/) lamp for $12 if you don't have one ready to go. (In fact, I have one clamped to the other side of the desk.)

Clearly, there's a channel in the arm to run cable — the arms are made of square metal tubing — and I pulled a USB cable I bought at the dollar store through, soldering together the wires and covering with shrink wrap. This was very much a USB 1 or 2, four-wire cable, with type-A connectors. If you're building this for a webcam, like the [Logitech c920s](https://www.logitech.com/en-us/product/hd-pro-webcam-c920s), they come with the same 1/4-20 thread that is [standard for cameras](https://photo.stackexchange.com/a/17817), then the USB-A connectors will be fine, but if you're going to a smartphone, or coming from a modern MacBook with USB-C, you might want different connectors.

For that 1/4-20 thread, I simply took a pocket tripod, removed the legs, and connected the tripod tip and the swing-arm with an angle bracket. The light housing for Tertial is mounted with three smaller screws, unlike the alignment pin one big bolt for my arm, so you'll have to be creative to do that mount.

The point for the location for laptop cameras is that you're looking, more-or-less, at the screen where the people are, so you're looking at the people you're talking to. In theory, that's where things should go with desktops and external monitors and such, but if what you're doing with them involves other things, or you don't trust webcams to fit on increasingly thinner monitors, then this gives you a solid connection that can be angled any way, like down at your desk when you write on a notepad or wire a circuit or something.

When production of good webcams catch up with the run caused by Work-From-Home/Shelter-In-Place, I might get a spool of the good stuff and nice connectors to bring this further into the 21st Century.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
