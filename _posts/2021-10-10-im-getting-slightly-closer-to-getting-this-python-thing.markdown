---
layout: post
title: "I'm Getting Slightly Closer To Getting This Python Thing"
author: "Dave Jacoby"
date: "2021-10-10 20:19:15 -0400"
categories: ""
---

I've poked some more, and I've worked some things out.

First thing I was thinking was that there's an internal indicator as to where in the list we are, and when we're done with the first inner loop, we're done with the outer loop.

I thought it would be as easy as using the list method `copy`, but you know what? We've working with filter objects, not lists. I need to cast as a list — `fmep = wordcopy.copy()` — and then I have a whole new list I can work with.

Then, of course, we filter again, just that we have an edit distance of 1. For a while, somehow, it was giving the results for the first word, but not anything after. I think the solution was to copy the wordlist at the head of each loop rather than before the loop.

That's annoying and frustrating, but I can work around it. Using `filter(lambda x: editdist(w,x)==1, fmep )`, I'm able to get just the next words.

I'm able to get this together, but it's slow. I'm pre-computing a bit more than I need to for the solution I'm moving toward. I need to move to learning how Python's dictionaries and while loops work.

I mean, I _still_ like the tools I like more than this, but I'm getting closer to having this be functional. I'll blog more when I can make the ladder from **CODE** to **TEXT**.

```python
#!/usr/bin/env python3

import re
import time
from numpy import *

def main():
    word1 = "solver"
    word2 = "ladder"
    wordlist = get_words()
    wordcopy = wordlist.copy()
    for w in wordlist:
        fmep = wordcopy.copy()
        fmep = filter(lambda x: editdist(w,x)==1  , fmep )
        fmep = list(fmep)
        if len(fmep) > 0:
            print("+",w)
            print( " ", len(fmep) )
            for x in fmep:
                print( "\t", len(fmep), x )
            print("-",w)
    print("END")

def get_words():
    newfile = open("/usr/share/dict/words")
    wordfile = newfile.read()
    wordlist = wordfile.split("\n")
    wordlist = filter(lambda i: len(i)==6, wordlist)
    wordlist = filter(lambda i: all(ord(c) < 128 for c in i), wordlist)
    wordlist = filter(lambda i: i.islower() , wordlist)
    wordlist = filter(lambda i: not re.match("\w+\W\w+", i) , wordlist)
    return list(wordlist)

def editdist(s,t):
    if s == "":
        return len(t)
    if t == "":
        return len(s)
    if s[-1] == t[-1]:
        cost = 0
    else:
        cost = 1
    res = min([editdist(s[:-1], t)+1,
               editdist(s, t[:-1])+1,
               editdist(s[:-1], t[:-1]) + cost])
    return res

if __name__ == '__main__':
    main()
```

```text
./ladder.py
+ abacas
  1
         1 abacus
- abacas
+ abacus
  1
         1 abacas
- abacus
+ abased
  3
         3 abases
         3 abated
         3 abused
- abased
+ abases
  3
         3 abased
         3 abates
         3 abuses
- abases
+ abated
  2
         2 abased
         2 abates
- abated
+ abates
  4
         4 abases
         4 abated
         4 abatis
         4 agates
- abates
+ abatis
  1
         1 abates
- abatis
+ abbess
  1
         1 abbeys
- abbess
+ abbeys
  1
         1 abbess
- abbeys
+ abduce
  3
         3 abduct
         3 adduce
         3 obduce
- abduce
+ abduct
  2
         2 abduce
         2 adduct
- abduct
+ abeles
  1
         1 aneles
- abeles
+ abided
  2
         2 abider
         2 abides
- abided
+ abider
  2
         2 abided
         2 abides
- abider
+ abides
  6
         6 abided
         6 abider
         6 abodes
         6 amides
         6 asides
         6 azides
- abides
+ abject
  1
         1 object
- abject
+ abjure
  1
         1 adjure
- abjure
+ ablate
  2
         2 ablaze
         2 oblate
- ablate
+ ablaze
  1
         1 ablate
- ablaze
+ abodes
  2
         2 abides
         2 anodes
- abodes
...
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
