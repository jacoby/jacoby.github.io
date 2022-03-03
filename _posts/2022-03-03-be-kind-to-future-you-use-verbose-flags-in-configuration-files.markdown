---
layout: post
title: "Be Kind To Future You: Use Verbose Flags in Configuration Files"
author: "Dave Jacoby"
date: "2022-03-03 12:00:11 -0500"
categories: ""
---

I am starting in a new position, and am elbow-deep into setting up the work environment, and I found the shop's `perltidyrc`. I decided to compare mine with work's, and then look back to the version in Damian Conway's [_Perl Best Practices_](https://www.oreilly.com/library/view/perl-best-practices/0596001738/).

You get `perltidy` from [Perl::Tidy](https://metacpan.org/pod/Perl::Tidy) and CPAN, and while I use it as an example, it isn't _really_ the core of this.

Here are the first three lines of the `perltidyrc` on Page 35 of PBP.

```bash
-l=78   # Max line width is 78 cols
-i=4    # Indent level is 4 cols
-ci=4   # Continuation indent is 4 cols
```

Now, here's three lines from my `perltidyrc`

```bash
--maximum-line-length=78
--indent-columns=4
--continuation-indentation=4
```

I have the same settings, but you do not have to comment mine, because the verbose flags are essentially a comment. Sometimes the available flags are less understandable, sure, and then, by all means, comment _them_, but if the verbose versions are self-documenting, use it! That way, your "code" will never vary from the documentation.

I'm 100% sure that somewhere out there, there are `perltidyrc`s that look like this ...

```bash
-l=78
-i=4
-ci=4
```

... and the person who wrote and uses it has no memory what `-i=4` means and where it came from, and is afraid to change it without looking it up, and that's more mental overhead than they want to spend right now. And the same goes for `.bashrc`, `.alias`, `.vimrc`, and any number of resource and configuration files out there.

Be kind to Future You. Use verbose flags in your config and rc files.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
