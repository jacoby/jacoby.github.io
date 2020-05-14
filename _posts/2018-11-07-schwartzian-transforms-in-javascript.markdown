---
layout: post
title: "Schwartzian Transforms in Javascript"
author: "Dave Jacoby"
date: "2018-11-07 16:09:05 -0500"
categories: "Javascript"
---
There's a style of programming that I have come to love that allows you to think like pipes in a prompt. I figured it out after trying to understand the [Schwartzian Transform](https://en.wikipedia.org/wiki/Schwartzian_transform), which came about from Randal Schwartz answering questions on UseNet in the 1990s. The problem was that someone wanted to sort this data by last name.

```data
adjn:Joshua Ng
adktk:KaLap Timothy Kwong
admg:Mahalingam Gobieramanan
admln:Martha L. Nangalama
```

And Schwartz suggested this.

```perl
#!/usr/bin/perl

require 5; # new features, new bugs!
print
    map { $_->[0] }
    sort { $a->[1] cmp $b->[1] }
    map { [$_, /(\S+)$/] }
    <>;
```

[I have explained this style before](https://varlogrant.blogspot.com/2015/05/explaining-schwartzian-transform.html), and the key is to read it from the bottom up.

* `<>` means we're getting one entry at a time from `STDIN`
* `map { [$_, /(\S+)$/] }` means we're turning the string `adjn:Joshua Ng` into an anonymous array `["adjn:Joshua Ng","Ng"]`
* `sort { $a->[1] cmp $b->[1] }` sorts the whole thing on the 2nd value in each array
* `map { $_->[0] }` undoes the split into anonymous arrays, making an array of strings again
* `print` prints them

You could have made this into a series of painstaking steps `my @array = <>; my @array2 ; for my $e ( @array ) {...}`, to introduce more modern Perlishness into this, but this is clean, by which I mean there are not a series of named variables sitting around. 

So, I've been writing a lot of JavaScript these days, and have been learning some about arrow functions and other JS hackishness.

```javascript
"use strict";
console.log(
  function() {
    /*
adjn:Joshua Ng
adktk:KaLap Timothy Kwong
admg:Mahalingam Gobieramanan
admln:Martha L. Nangalama
  */
  }
    .toString()
    .split(/\/\*/)[1]
    .split(/\*\//)[0]
    .split(/\n/)
    .filter(x => String(x).match(/\w/))
    .map(x => [x.split(/\s/).pop(), x])
    .sort((a, b) => (a[0] > b[0] ? 1 : 0 - 1))
    .map(x => x[1])
    .join("\n")
);
```

Which outputs:

```text
admg:Mahalingam Gobieramanan
adktk:KaLap Timothy Kwong
admln:Martha L. Nangalama
adjn:Joshua Ng
```

This isn't bottom-to-top, so
* we make an anonymous function that is entirely a comment block holding our data
* which we cast as a String with `.toString()`
* use `.split()` to get the _data_ part of the data by splitting on the open and close comment 
* make into an array by `.split()` on the newline character
* `.filter()` to ensure each entry has a word character
* use `.map()` to make an anonymous array, this time with the key coming first, by splitting on string characters and `.pop()`-ing off the last element as the last name
* doing the sort, using a ternary operator within `.sort()` to save space
* using `.map()` to get back to the original string we want sorted
* and finally, making it into a string join `.join()` with newlines.

Funny that there was no mention of JavaScript in that Wikipedia article.

There are other things we can use to add to this style. I found out earlier today that you can kinda get to Perl's range operator, like `0 .. 9 `, by doing creating an anonymous array, declaring the size and getting a list of the indexes by abusing the object nature, like:

```javascript
let ranged = [...Array(10).keys()]
# [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
```

And, of course, you can map and filter these things into exactly the shape you want.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
