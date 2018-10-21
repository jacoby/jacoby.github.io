---
layout: post
title: "Semiconductors - the Bottom-most Turtle"
author: "Dave Jacoby"
date: "2018-10-21 14:06:32 -0400"
categories: ""
---

I **should** be thinking and writing about databases right now, but my brain will not go there. So, I'm going somewhere else technical.

I write code. Or, [as Brian Wisti put it](https://twitter.com/brianwisti/status/1054069848467107840):

> **"I am a member of a cult that gives life to rock with lightning and arcane instructions, making every day faster and more terrifying."**

The arcane instructions are made easier by the [Church-Turing Thesis](https://en.wikipedia.org/wiki/Church%E2%80%93Turing_thesis), which is "Every effectively calcuable function is a computable function". This can and has been taken to the point where computation and philosophy meet, but in a practical sense, if you can make a circuit for it, you can make a function for it, and vice versa. And, if you can make a function for it, you can make an equivalent function for it in a language that you can more easily understand, so Python transforms to or wraps C which converts to machine language, which is the set of arcane instructions the machine accepts.

But how do we convince rock to turn lighting into cat pictures? By transforming rock. And by choosing which rock.

There are things that conduct electricity; they are called conductors, and we make wires out of them.

There are things that do not conduct electricity; they are called insulators, and we use them to allow us to handle things using electricity without zapping ourselves.

But there's also [_semiconductors_](https://en.wikipedia.org/wiki/Semiconductor), and what are they? They're [metalloids](https://en.wikipedia.org/wiki/Metalloid), with properties of both metals and nonmetals, and are not great at conducting electricity. But by adding other elements, they can be made into really bad conductors, or insulators, at a very small level, which is why we make chips out of Silicon rather than Copper or Gold.

Guitarists might have heard of other materials being used, specifically Germanium, in early (and thus superior) fuzz pedals. Their tone can be highly dependent on environmental factors, to the point where people are told to put their pedals in the freezer to get it to a better sound out of it. And, because computational gearheads are not the subjective "tone freaks" in the same way, Silicon is by far the more common choice these days. ([Which is not to say that we're not still trying to make a go with Germanium](https://www.purdue.edu/newsroom/releases/2014/Q4/germanium-comes-home-to-purdue-for-semiconductor-milestone.html).)

On top of this are gates, forming circuits, and a series of logical ["turtles"](https://en.wikipedia.org/wiki/Turtles_all_the_way_down), stacking up to the web browser where you're reading this, but clearly, the bottom-most turtle is the one where we're dealing with the atoms that actually form the chip.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
