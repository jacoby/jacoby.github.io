---
layout: post
title: "Solving Another Math Meme! Or Not!"
author: "Dave Jacoby"
date: "2019-07-31 13:33:26 -0400"
categories: ""
---

It came from Twitter.

[![ 8 ÷ 2(2 + 2) ](https://jacoby.github.io/images/math_meme_2.jpg)
](https://twitter.com/pjmdolI/status/1155598050959745026)

This is very much the math equivalent of the dress meme. It isn't like [the last math meme I took on](https://jacoby.github.io/math/2018/02/19/solving-a-math-meme.html), where the form [leads you down the garden path](https://en.wiktionary.org/wiki/lead_someone_down_the_garden_path), making you think it means "Five (with excitement)" instead of "Five factorial".

And I admit that I made unwarranted assumptions and was a bit more of a jerk in the thread than I wanted to be.

I mean, I still think I'm _right_, but I'm much more open to the idea that I'm wrong. But let's start at the beginning.

> `8 ÷ 2(2 + 2)`

What do we do next? The [Order of Operations](https://en.wikipedia.org/wiki/Order_of_operations) would argue that we start with taking care of the parens first.

> `2 + 2 = 4`
>
> `8 ÷ 2(4)`
>
> `8 ÷ 8`
>
> **`1`**

At least, this looks good to me, but there are folks saying "Wrong! Distributive property!", which I _think_ they mean to say it should be this way.

> `8 ÷ 2(2 + 2)`
>
> `8 ÷ (2 * 2 + 2 * 2)`
>
> `8 ÷ (4 + 4)`
>
> `8 ÷ 8`
>
> **`1`**

Um ... Could be? It certainly handles the ambiguity.

> `8 ÷ 2(2 + 2)`
>
> `8 ÷ 2(4)`
>
> `8 ÷ 2 * 4`
>
> `4 * 4`
>
> **`16`**

Here, we get that multiplication and division are at the same level with PEMDAS, and so we read it left to right, and so `8 ÷ 2` gets handled before `2 * 4`.

And people are as convinced of their correct math as they were about the color of [the Dress](https://en.wikipedia.org/wiki/The_dress).

An aggravating aspect is that Twitter optimizes for brevity and intensity, so there's less "This is correct because this principle" and a lot more "You don't know this, so you would've failed elementary math".

(Or, as appropriate, "maths".)

I recall people plugging the equation into their fancy calculator of choice, and I recall seeing contradictory answers: some saying **1** and some saying **16**. If the question has ambiguity to you, it has ambiguity to developers, and this means that different developers trying to make deadline will implement it different ways.

My _personal_ take would be that `2(2+2)` is effectively `(2 * (2 + 2))`, and so decoupling the `2` to make `8 ÷ 2` is wrong. I hold this as a largely uninformed and instinctual opinion.

I recall hearing (maybe in Data Structures?) that the solution is to add parentheses until all ambiguity is gone. Alternately, Reverse Polish Notation. Rather than `A symbol B`, it always takes `A B symbol`, searching through long equations until found. Going for the "equals 16" answer, we would rewrite this as follows.

> `8 ÷ 2(2 + 2)`
>
> **8 2 ÷** 2 2 + \* -> **4** 2 2 + \*
>
> 4 **2 2 +** \* -> 4 **4** \*
>
> **4 4 \*** -> **16** 

And going the other way.

> `8 ÷ 2(2 + 2)`
>
> 8 2 2 2 + \* ÷
>
> 8 2 **2 2 +** \* ÷ -> 8 2 **4** \* ÷
>
> 8 **2 4 \*** ÷ -> 8 **8** ÷
>
> **8 8 ÷** -> **1**

Of course, for larger numbers, the it becomes harder to read.

As written, I believe the answer is **1**, but with my skills, I cannot discount the other option, and believe that math equations, like programs, should be formatted until they are unambiguous.

I mean, parentheses are cheap.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
