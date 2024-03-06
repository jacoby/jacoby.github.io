---
layout: post
title: "New Host, Who Dis?"
author: "Dave Jacoby"
date: "2024-03-06 11:22:59 -0500"
categories: ""
---

I started this blog by moving from [Blogspot](https://varlogrant.blogspot.com/) in 2017. I decided that trying to be too WYSIWYG was too annoying, and that I wanted to just write a document in something easy like Markdown, never taking my fingers off my keyboard, and using [Jekyll](https://jekyllrb.com/) as a static site generator and using [Github Pages](https://pages.github.com/) was the move.

And I was trying to add [the most recent post](/2024/03/05/what-we-did-on-our-bank-holiday-weekly-challenge-259.html) to the blog and I started getting errors, seemingly forcing me to move to [Github Actions](https://docs.github.com/en/actions).

Ultimately, the problem seems to be that the SCSS munger is looking for a file that isn't there, and the move would've been to wipe the Gems and rebuild, I think, but those things being in my `github.workspace` where I can't go (I don't think), I can't fix it.

But I want to be able to add new things to my blog.

My friend Chris pointed me to [Render](https://render.com/), so I tried it. I first put up a HTML/CSS/JS tool I wrote a while ago that scratched my guitarist itches, [Guitr](https://guitr.netlify.app/). Yes, I came up with this idea when Flickr was fairly new and hip, and I need to rethink the UI and add a few adds on it to start getting gear money.

Anyway, once I was happy with it, I decided to try to create a second home for this blog, and wouldn't you know it, It was easy.

- set **Repository** (which you have to share from your Github Applications tab)
- set **Branch**
- add the **Build Command**, and instead of the more simple suggested `jekyll build`, I made it `bundle exec jekyll build`, which might be belt-and-suspenders and might be me about to make a fragile thing, but eh, I'll learn when I have to.
- tell it **Publish Directory**, which is `_site` by default.

Looks to be that, as with Github Pages, it is write, `add`, `commit`, `push` and forget, which is what I like in a site generator.

I *did* consider forking my own repo, so that I could keep the git history but be able to separate everything, but you can't fork your own repos. I could, I dunno, actually *use* my Bitbucket and GitLab repos, but why work that hard?

The old links to the blog should be fine. Considering going through and changing every `https://jacoby.github.io/path/to/thing` to `/path/to/thing`, I might buy a vanity domain for it, and I think I'll spend _some_ time to get Actions working again, but until then, `https://jacoby-lpwk.onrender.com/` will be my blog's URL.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
