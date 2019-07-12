---
layout: post
title: "Moving my Resume to Markdown"
author: "Dave Jacoby"
date: "2019-07-08 19:19:26 -0400"
categories: ""
---

The start of my old resume was the early 2000s and Word. I came up with some formatting that I like. Basically, it was a Word variation of table formatting that was the scourge of web development. I loaded it into Google Docs a while ago, but didn't make any substantial change for a good long time. I didn't need to; I've been at the same place over a decade.

I have finally decided to rethink and redo the thing in Markdown. Markdown is what I blog in and what my user group's newsletter is done in, so I'd rather work with that.

But I don't want to _send_ a Markdown file. That'd be wrong.

[I had heard friends talk](https://twitter.com/FunnelFiasco/status/394943422881996800) about [pandoc](https://pandoc.org/) for a while, and I decided to use that. I was happy.

Except the margins were too big.

And the font looked very LaTeX, which is the look of dry and unreadable research papers. So I had to find a way to get the output without getting _that look._

I had two problems.

- **It Will Not Overwrite**  
  Sounds like a duh thing, but it just won't. And the program won't pop a nice warning, telling you "you're trying to overwrite an existing file. Instead:

  `pandoc: resume.pdf: openBinaryFile: invalid argument (Invalid argument)`

  Another friend suggested that I try `-o -`, which is a common Unix idiom for _"write to STDOUT"_, but pandoc doesn't write PDFs directly. Unlike the other formats, they have to go through LaTeX (as mentioned), and LaTeX only knows we're ending up with PDF if the file name given it ends with `.pdf`. so `pandoc -o - resume.md > resume.pdf` is not going to route your way around this issue.

- **Formatting is not Foo**  
  As I said, it looks like old research papers by default. LaTeX was created so that Knuth could put math into _The Art of Computer Programming_, so that makes sense, but I don't want to look like that.

  There are `-V` flags you can add to the process. The control you have is minimal, but you _can_ change the font and the margins.

So, here's the wrapper script I wrote:

```bash
#!/bin/sh

# automates the process of using pandoc
# to create new resume

if [ -f resume.pdf ]; then
    echo "DELETING OLD PDF"
    rm resume.pdf
fi

echo "MAKING NEW PDF"
pandoc resume.md\
    --latex-engine=xelatex\
    -t latex\
    -o resume.pdf\
    -V mainfont="Open Sans"\
    -V geometry=margin=2cm
echo "DONE"
```

Getting `xelatex` and `pandoc` going on your system is an exercise for the readers and their administrators.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
