---
layout: post
title:  "Have Jekyll and Atom going"
date:   "2017-07-24 12:52:43 -0400"
categories: 
---
Subject says it all; I have, with help from the GitHub support team, worked out my issues and developed a minimal Jekyll setup with working Atom syndication.

Or, should I say *minima*?

The first pass issue his is that using the "set your theme" option in the repo settings page killed it, giving me just white pages. If you want to change away from `theme: minima` (should that be your theme of choice), do it intentionally and know what killed it should you need to revert.

The theme problem problem came from a simple configuration error, so what about the lack of Atom/RSS?

Be aware that the Jekyll you get from [`gem install jekyll`][1] is 3.5.0, while the Jekyll running GitHub Pages is 3.4.5, and there's a syntax change. Specifically, instead of `gems:` it uses `plugins:`, so running `jekyll new my-blog` to create your base setup will give you a setup that won't do the job with Atom.

Thankfully, it's an easy fix.

The next step, of course, is to automate the announcements that I blogged again.

[1]: https://jekyllrb.com/