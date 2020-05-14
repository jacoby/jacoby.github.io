---
layout: post
title:  "On a:visited"
author: "Dave Jacoby"
date:   "2018-08-02 09:46:50 -0400"
categories: 
---

Yesterday, I had a piece of computer administrivia which I could abstract to a large list of links for me to check. This led me to think "If only the visited links could just _go away_, that'd only leave live links."

That **should** be easy.

```css
a:visited {
  display: none;
}
```

I love a one-line fix. So I put it in and no joy.

I then moved to other attempts.

```css
a:visited {
  font-size: 0;
}

a:visited {
  color: white;
}
```

That last one worked, but that just meant I only _saw_ unvisited links, not that I only had unvisited links.

On to Javascript.

(Note: I am happy to use Javascript. I am happy to write Javascript. I am unwilling to camel-case "Javascript".)

```javascript
# avec jquery
$( 'a:visited' ).each(function (){ console.log('link') })
```

This gave me nothing either. This is quickly getting annoying. I want to hide links I've visited, and the browser won't let me! **WHY?**

[Because the browsers are looking out for me.](https://developer.mozilla.org/en-US/docs/Web/CSS/Privacy_and_the_:visited_selector) If *I*, writing code for myself, can tell if I have followed this link, *Eve*, writing code for Cambridge Analytica or Facebook or whoever we want to call evil today, can use this to determine what links I've followed, whatever nefarious purpose that might lead to.

So, short-term, I'm still kinda miffed. Task is done and all, so I don't need it anymore, but it's a thing I could've seen being useful for occasional tasks.

But, long-term and big-picture? This is the right decision, and both Chrome and Firefox behave like this.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
