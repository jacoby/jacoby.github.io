---
layout: post
title:  "Twitter's Face Recognition has Issues"
author: "Dave Jacoby"
date:   "2020-09-21 19:26:15 -0400"
categories: ""
---

Sometimes people on Twitter post large images, and when they're displayed, it's hard to see what the point of the image is. Clearly, the user can include a smaller cropped image to get to the point, but the user can do many things, and doesn't because it's a pain.

So Twitter has introduced autocropping. At least, this is what I assume to be their reasoning. Looking at it this way, it makes sense.

And there are libraries out there that pick out faces. I've played a little with OpenCV, which is an older technique, created before the ML boom we're in right now. So that _must_ be a no-brainer, right?

Well, there are issues, like [the cropping _consistently_ choosing white faces over black faces, no matter what else is going on](https://twitter.com/bascule/status/1307440596668182528).

I suspect I know the reason.

It isn't _intended_ to choose Mitch McConnell over Barack Obama, every time like clockwork.

A lack of intention is _part_ of the problem. And we've seen it before.

[ ![Color Film Was Built For White People](https://jacoby.github.io/images/vox_color_film.jpg) <br> Vox: "Color Film Was Built For White People"](https://www.youtube.com/watch?v=gMqZR3pqMjg)

In short, the testing they did was with white faces, so they got good with white faces, which they tested with white faces, and so on. It wasn't seen as an issue until powerful parts of the photography market — furniture and chocolate companies whose products were also brown — encouraged a change, after which they used the better colors as marketing.

[And the same issue goes with sinks and soap dispensers.](https://gizmodo.com/why-cant-this-soap-dispenser-identify-dark-skin-1797931773)

I mean, I don't believe that they start out thinking that it's good to exclude large chunks of the population, but that they didn't think it through, and didn't think it would hurt anything.

But you'd think that, after a while, they'd realize how bad a look this is.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)


