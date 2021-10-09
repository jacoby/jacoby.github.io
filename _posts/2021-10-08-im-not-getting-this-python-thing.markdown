---
layout: post
title: "I'm Not Getting This Python Thing"
author: "Dave Jacoby"
date: "2021-10-08 22:11:31 -0400"
categories: ""
---

Because reasons, I decided to write a thing based on my [Word Ladder](https://jacoby.github.io/2019/05/06/rethinking-my-ladder-puzzle-code.html), and this time, in Python.

For those who don't want to follow links, it uses Dijkstra's Algorithm to find the Shortest Path between words that are one difference apart, like

> ** COLD > CORD > CARD > WARD > WARM**

That's something that we learn from the Levenshtein Distance. So, we start with all the words that are one letter away from **COLD**, such as **COLT** or **COED** or **BOLD**. Then, we do that same process for each of these words, but we don't duplicate. **BOLT** is one off from both **BOLD** and **COLT**, but whichever word we process first gets the link.

This process goes on until we get to **WARM**, in which case, we trace it back and get the above list. We _could_ end up unable to jump from the first word to the last, and then we'd exit out and give no ladder. Oh well.

Graphs aren't that scary.

There are parts of this. There's the part where we get the words. Thank you, Linux, for having a dictionary for `passwd` to keep users from using real words as passwords that we can use here.

```python
def get_words():
    newfile = open("/usr/share/dict/words")
    wordfile = newfile.read()
    wordlist = wordfile.split("\n")
    wordlist = filter(lambda i: len(i)==6, wordlist)
    wordlist = filter(lambda i: all(ord(c) < 128 for c in i), wordlist)
    wordlist = filter(lambda i: i.islower() , wordlist)
    wordlist = filter(lambda i: not re.match("\w+\W\w+", i) , wordlist)
    return wordlist
```

I want to see if I can link the `filter`s at some point, but I think this works for now. First filter gives us six-letter words, second one removes words with non-ASCII characters, third one removes words with upper-case characters, which would be proper nouns and thus not really allowed. Last one removes infix non-word characters, removing apostrophes. I tried to use my regular expression knowledge to specify apostrophes, but eh, I gave up.

So, now we need to have the Levenshtein Distance. I admit, I looked it up and copied and pasted it. To be honest, when I started using it in Perl, I copied it from perlbrew, and the comments said that perlbrew copied it verbatim too, so eh?

```python
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
```

So, now there has to be the graph, where we know all the words that are one change away from any other word. How do you do that? Nested loops. Test every word in the list against every other word, and if the distance equals one, put it on the list. In Perl, I would make a hash and make each value be an arrayref. I'm not 100% sure how to do that in Python right now, but this is me moving toward.

Here's the rest of the code, reassembled.

```python
#!/usr/bin/env python3

import re
import time

def main():
    word1 = "solver"
    word2 = "ladder"
    wordlist = get_words()
    list1 = []
    graph = {}
    for w in wordlist:
        for x in wordlist:
            d = editdist(w,x)
            if d < 3:
                print( " ", d, w, x )
        print("-")
    print("END")


if __name__ == '__main__':
    main()
```

To me, that _should_ give us every word, the words that are close, and exactly how close. The words will be separated by a dash and the whole thing will end in `END`, as great things should.

However, I am seeing this:

```text
$ ./ladder.py
  1 abacas abacus
  2 abacas abamps
  2 abacas abases
  2 abacas abates
  2 abacas abatis
  2 abacas agamas
  2 abacas anabas
  2 abacas arecas
  2 abacas fracas
-
END
```

That's _one_ _word_. Not nearly good enough. I _think_ there's something in my code that makes it think it should drop the outer loop when it does the inner one. I _know_ I'm doing something wrong, and I _know_ it all looks like it _should_ be right to me.

I know that, because my code isn't doing what I want, that I must therefore vary from the One True Way. Not my religion, not my creed, but I still want to move forward with this. If you have thoughts about why and how I'm doing stupid stuff with the arrays, beyond using an index, I would sure be glad to hear it.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
