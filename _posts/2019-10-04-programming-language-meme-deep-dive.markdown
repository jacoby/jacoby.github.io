---
layout: post
title: "Programming Language Meme Deep Dive"
author: "Dave Jacoby"
date: "2019-10-04 16:32:24 -0400"
categories: ""
---

[@cotufa82 tweeted:](https://twitter.com/cotufa82/status/1179601883448655874

> 1. First language: Basic / Java
> 2. Had difficulties: Java
> 3. Most used: JavaScript / Python
> 4. Totally hate: Java
> 5. Most loved: Go / Python
> 6. For beginners: Python / Ruby
>
> What about you?

I responded, but I wanted to take some time and write and to explain myself.

Before I go on, let me explain my beliefs. If you can get work done in a language, that is a good language, and my petty gripes should have no influence. If I was in another situation, with other requirements and other collaborators, I would gladly learn to use and enjoy whatever language is critical for that task.

Being said:

### First language: Basic

I was told during high school that, to get into college, I would need two years of a foreign language. As it turned out, for the college I went to, I did not need that, but I needed some computer language time, which was not in the offing for any of the high schools I attended. So, first semester, I took a course on BASIC.

BASIC. Not Visual Basic. BASIC on 8088 microprocessors on a TRS-80.

I don't know that [Dijkstra's considerations](https://en.wikipedia.org/wiki/Considered_harmful) about BASIC come from the same place as mine -- in fact, I really doubt it -- but while I found it largely fun, there were two glaring deficiencies, and yes, one is `GOTO`. I wrote a random number generator that jumped to `1000` or something to handle the random number generation, writing it to a global variable, and jumping back. I made it so I could switch between 1-6 and 1-100, because the role-playing games I was playing had a lot more of those roles, and I quickly learned that what I now understand as functions were what I really wanted.

I also learned that computers are deterministic machines that are absolutely crap at randomization, and so, if you had it print out 100 "random" numbers, then did it again, you would get the same 100 numbers, unless you "salted" the randomization. To paraphrase Schneier, there's random numbers to run your toys and games, and there's random numbers to secure your data from spies and thieves, and this is decidedly the former.

I can't remember the last time explicitly salted a random number generator, so I believe it's been added implicitly to the commands in the higher-level languages I spend my time with, but I know I have.

### Had difficulties: Python, R

There used to be a big [Sun](https://en.wikipedia.org/wiki/Sun_Microsystems) lab on the third floor of a building on campus that also isn't there anymore. I had graduated, but was sent code that would tell me what machines were open. Not because I needed to know, but because this was working Python code. This was more-or-less 2000, so that was many many versions ago.

And there was another thing this code had.

A space.

```text
TabCode
TabCode
SpaceTabCode
TabCode
TabCode
TabCode
TabCode
```

For all I know, _I_ could've been the person who accidently added that space. I have no way of telling. It was also the first time I had seen Python errors, and so I couldn't decipher what it was telling me. But it was not telling me who was in what room.

I have tested this in more modern Python versions (2._,3._), and I am happy to report that they are both immune from this kind of bulldada. But once, I came home to find that my family was watching _Silicon Valley_, heard Richard Hendricks explain he used Python _and_ tabs, and paused the show so I could tell the above story, _in depth_ and _with feeling_, ending that Richard Hendricks was the straight-up _villain_ of the piece.

I cannot watch that show.

With R, there are two main problems. One is more fair than the other. The first is that the R library `bioconductor`, which imported data from an instrument we had in the lab, outright _lied_ about how to open files, and it took me days of trying what the documentation said, over and over again, before I gave up and was shown another way.

The other? Data tables. I'm very used to and very happy with data structures in Perl and Python, but every time I try to get things going with them in R, I get confused. I have a few places where I use R as a plotting library, but I don't do much with R beyond that.

### Totally hate: Python

See above story. Plus, I saw a YouTube video from the Google Developers channel, promising to show me how to use their Python library to change my Gmail signature. Which it did.

But it also killed [gcalcli](https://github.com/insanum/gcalcli), which I use for interacting with my Google Calendar, which I consider _far_ more important.

I have started to chant "virtual_env all the things", and this is the alias for `week`, which shows my week's events:

`alias week='/home/jacoby/local/venv/gcalcli/bin/python /home/jacoby/local/venv/gcalcli/bin/gcalcli --nocolor --calendar "Main" calw'`

On the other hand, we had a task that could only be done with a Windows-based program, and we wanted to do a _lot_ of it, so I found and used [Sikuli](http://www.sikuli.org/) to allow me to script a Windows application, and it used the Java-based version of Python, Jython, as the scripting language. It would work kinda like:

```python
pile_of_poo = 💩 # Yes, images within the code.
piles = findAll(pile_of_poo)
for poo in piles:
    click(poo)
```

Eventually, we stopped doing that, but this was a thing I did in Python that I could not see myself doing in any other language.

### Most used: Perl/Javascript

Perl is my "daily driver". We have lots of legacy code and libraries written in Perl, and I have tools that work for me daily that I originally wrote in Perl back before that Python story.

### Most loved: Perl

My first language was BASIC, as mentioned. Then, as I started Computer Science, they taught me "C as a subset of C++", and while I learned that, I learned Unix and csh and vim. Notice the lack of "they taught me" in that last part. It was kinda like self-discipline in boot camp: it isn't taught directly, but if you don't pick it up during the process, you're gonna have a _really bad time_.

I found a job relating to the web, and [CGI](https://jacoby.github.io/cgi/2018/10/27/perl-and-cgi.html) was just starting to get big. I have, at one point, written the smallest possible `hello world` in C, and the thought of going forward with non-trivial tasks in a very text-forward environment using `strings.c` and/or `stdio.c` just filled me with fear.

Then I found Perl, where strings were part of the primary type, rather than an array of the character class. For me, it was the right tool for the job, and I stuck with it as things moved around.

### For beginners: Javascript

This is a _very_ divisive position.

I was once asked [_"I want to learn to program. What language should I learn first?"_](https://varlogrant.blogspot.com/2015/08/what-language-should-i-learn-three.html) and I responded _"I'm going to Europe. What language should I learn?"_

(I am not usually that quick, but this time I was.)

If I was interested in deep systems programming, or employed at it, I would've gone harder into C instead of Perl. At that time, the language most tied into Artificial Intelligence was Lisp and variants. Any of these would be perfectly good languages to go with, but very reliant on the tasks you intend to do with them.

And the Church-Turing Theory says that any Turing-complete language can do what any other Turing-complete language can do, so, in a way, it kinda doesn't matter what language you start with. But text manipulation will still be easier in Perl and Python, startup time will be faster with compiled C, etc. etc.

And with all that, even though many consider Javascript harmful, it is a compiler that comes with any browser and works of text, so you can use Notebook and Internet Explorer to get started, without having to install anything. I couldn't live with those tools long, to be sure, but you can begin to know what you can do and what you want to do with just Javascript and HTML.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
