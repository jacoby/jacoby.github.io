---
layout: post
title:  "Your Toys Can Become Useful"
author: "Dave Jacoby"
date:   "2017-11-29 10:15:37 -0500"
categories: 
---

*tldr:* Toy code I wrote to solve word puzzles is coming back for production purposes.

I like word puzzles and logic puzzles, except sometimes I don't.

I look at things like Sudoku and Boggle and like to use my mental pattern matching wetware to see what I can find, but I know that, as a programmer, I can write tools that dig out all the possible, or the best possible solutions.

One example of this is the [*Word Ladder*](https://en.wikipedia.org/wiki/Word_ladder), a puzzle type invented by Lewis Carroll, where you try to find the way between words, by changing one letter at a time. For example, if you want to move from *COLD* to *WARM*, you could go:

```
    cold
    coRd
    cArd
    Ward
    warM
```

I came across this in an old Mental Floss column, where the puzzle was *SIXTH* to *TENTH*.

```
    sixth
    -----
    -----
    -----
    -----
    -----
    tenth
```

This is left as an exercise for the reader.

This is not a straightforward problen for a computer to solve. First, you need all the five-letter words. Then you need to know which words are one letter distant from each other. Then you need to find the best way to get from the first word to the last.

Word lists are easy. In my case, I knew dictionary words are bad passwords, so I found dictionaries on the [FTP site](ftp://ftp.cerias.purdue.edu/pub/dict/) for [Purdue's Center for Education and Research in Information Assurance and Security (CERIAS)](http://www.cerias.purdue.edu/). 

Going from one word to the other is ... a solved problem. It's Edsger Dijkstra's algorithm for finding the shortest path between two nodes, or "Shortest Path" or "Dijkstra's Algorithm". [I covered this in more detail two years ago.](https://varlogrant.blogspot.com/2016/11/graphs-are-not-that-scary.html)

So, the open question is "How do you tell if two words are one letter different?"

I learned the solution looking into [perlbrew](https://perlbrew.pl/). It uses it to suggest alternatives if you misspell commands.

```
$ perlbrew hlep
Unknown command: `hlep`. Did you mean `help`?
```

It uses the [Levenshtein Distance](https://en.wikipedia.org/wiki/Levenshtein_distance) to determine which command you meant, chosing which available command has the shortest distance to your misspelled entry.

And I use it to figure out that `ward` is one letter off from `warm`. 

Put it all together and find the shortest path from *HEAPS* to *STACK* is [`HEAPS > HEARS > SEARS > STARS > STARK > STACK`](https://twitter.com/jacobydave/status/891356401158770688)

As I said, this is all word puzzles. I took the Levenshtein Distance code into a CLI tool or two and forgot about it for a while.

But it's coming back. 

I work in a gene sequencing lab, and we use *barcodes*. Think of a class trip to the zoo. You might've been given a yellow shirt saying the name of your school before you got off the bus, so that, when looking the the giraffes and snakes and all, the adult supervision can tell by color that you're their responsibility, while the kid wearing the red shirt goes to another school. 

In genomics, it's a short sequence placed at the beginning and/or end of a piece of DNA. It's DNA, so it's all `ACGT`. And if they're one letter off, like `TTTTTTTG` and `TTTTTTTT`, it can mess up the barcoding, like two schools with yellow shirts showing up at the zoo. You don't want to take a child back to the wrong school.

So, I'm going to add barcode tests that determine by Levenshtein Distance which barcodes are safe to use. An algorithm I'm most familiar with for allowing me to make jokes with words will be used to keep runs from being ruined. 

Not all of my toys have been used to solve serious problems. Lots of things have just been fun. But when programmers start working with another service, another language, another algorithm they say "I'm playing with this". The familiarity you gain by using a tool for fun is helpful when you want to use it in anger. 
