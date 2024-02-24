---
layout: post
title:  "Note To Self on PAUSE Workflow"
author: "Dave Jacoby"
date:   "2024-02-24 16:25:41 -0500"
categories: ""
---

gizmomathboy told me to write a note, because I hadn't touched this process for years. This is me writing that note.

For a lot of modules, they have a Makefile. Even if they don't have anything to compile.

The trick there is with `make dist`, which creates a distribution. And, in terms of PAUSE, the way that modules enter CPAN, a dist is a distribution, which is a file taking the form `$MODULE_NAME-$VERSION_NUMBER.tar.gz`, which of course you could make yourself, but by using a makefile, you consistently do the right thing.

Then, you log into PAUSE and upload it. There are means to add this to your GitHub Actions, which I *might* do for some projects. The thing that hits me is that unless `$VERSION_NUMBER` changes, and changes up, PAUSE doesn't do anything with it. Does it make it "safe" and "okay" to make a bunch of builds when you're just adding testing?

Anyway, note to self.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)


