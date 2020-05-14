---
layout: post
title:  "Levenshtein, Sørensen–Dice, and Practical Information Theory"
author: "Dave Jacoby"
date:   "2019-01-08 12:08:52 -0500"
categories: ""
---

This started with me seeing a [tweet](https://twitter.com/fakebaldur/status/1081959630148898817) announcing [an npm package on GitHub](https://github.com/aceakash/string-similarity). "Finds degree of similarity between two strings, based on Dice's Coefficient, which is mostly better than Levenshtein distance", the repo's description reads, and that got me curious.

What's a Dice Coefficient? Or [Sørensen–Dice Coefficient](https://en.wikipedia.org/wiki/S%C3%B8rensen%E2%80%93Dice_coefficient), to get formal? You can click through to read the formula, but the thumbnail is that it's a float between 0 and 1 indicating how similar two words are.

It says it's better than the [Levenshtein Distance](https://en.wikipedia.org/wiki/Levenshtein_distance). The Levenshtein Distance is the count of edits required to get from one string to another.

I'm happy to know that npm has this library in it, but I'm a Perl guy, and both [Text::Dice](https://metacpan.org/pod/Text::Dice) and [Text::Levenshtein](https://metacpan.org/pod/Text::Levenshtein), so it was faster for me to go forward with those. I wrote `get.pl`, where the words in comparison are the standard set of git commands, and the command I'm testing against is `gerp`.

```text
DICE
----
    gerp    merge   3    0.571428571428571
    gerp    grep    2    0
    gerp    rm      3    0
    gerp    log     4    0
    gerp    push    4    0
    gerp    tag     4    0
    gerp    pull    4    0
    gerp    init    4    0
    gerp    diff    4    0
    gerp    show    4    0
    gerp    mv      4    0
    gerp    fetch   4    0
    gerp    add     4    0
    gerp    bisect  5    0
    gerp    clone   5    0
    gerp    rebase  5    0
    gerp    branch  6    0
    gerp    commit  6    0
    gerp    status  6    0

LEVENSHTEIN
------------
    gerp    grep    2    0
    gerp    merge   3    0.571428571428571
    gerp    rm      3    0
    gerp    tag     4    0
    gerp    pull    4    0
    gerp    push    4    0
    gerp    log     4    0
    gerp    fetch   4    0
    gerp    add     4    0
    gerp    mv      4    0
    gerp    show    4    0
    gerp    diff    4    0
    gerp    init    4    0
    gerp    bisect  5    0
    gerp    rebase  5    0
    gerp    clone   5    0
    gerp    branch  6    0
    gerp    status  6    0
    gerp    commit  6    0
```

The two words of interest here are **grep** and **merge**. 

```text
    gerp    grep    2    0
    gerp    merge   3    0.571428571428571
```

Basically, if you're using Levenshtein, you'd go with `grep` and if you using the coefficient, you'd guess `merge`. If someone typed `git gerp mysql`, I would go with Levenshtein and git and suggest you meant `grep`.

This is not me saying Dice is bad. I just don't know when that would make more sense. Understanding sentences rather than words? Anyway, I'm glad to know about both, but practically, for my tool-making purposes, I'm still reaching for Levenshtein first.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


