---
layout: post
title: "Is using vim an antipattern?"
author: "Dave Jacoby"
date: "2018-09-07 10:14:32 -0400"
? categories
---

!["OH, NED!", she exclaims. "YOU **ARE** A **VI MAN** AFTER ALL!"](/images/vi_man.png)

This line of thinking started with a [https://dev.to/](Dev.To) post entitled ["Vim won't make you a more productive developer"](https://dev.to/maestromac/vim-wont-make-you-a-more-productive-developer-h9f. Read the article for a full argument on this position, but in a nutshell, if you don't already know it, there are already powerful editors that work with how you already know how to work, like VS Code and that it is likely a better use of your time to learn to learn other things.

I started being a vi man back in 1995, taking early CS courses. There was a lot to get in your head — New to Unix? New to C? New to Programming? Welcome to the Deep End! — and I spent nany a long night on Sparc 5s, exhausting myself as I put things like `ESC` and `:wq` and `:q!` and `se nu` into my hands and head.

In the fullness of time, I found `colorscheme` and `nowrap` and `expandtab`. Right now, my .vimrc has 196 lines and has a last-modified comment of 2011. I don't believe that, but I do believe that I could spend some time and get it under 100, maybe less, but removing the settings and functions I do not use. I won't, for the same reason the article says new users probably don't want to learn vim; it's a time sink and I have better things to do.

There are a few things I go back to vim for.

- **Sorting** is not built into VS Code, and while I have found the magic incantation to add `sort block` functionality into it, I have it set for one of my computers, but not all of them, and so I can't rely on it. I mostly do it for blocks of CSS, because visual-grep works better if you know `display: block` will be above `margin: 0 auto`.
- **PerlTidy** is written in Perl, and is used to set consistent formatting for your code. "is written in Perl" means "doesn't work if you're on Windows and you don't have Strawberry or Activestate Perl installed (and sometimes not even then)" and "if system Perl lags, might not understand the new features you love to add", which has never been a problem with `map ,pt <Esc>:%! perltidy -q <CR>` in my .vimrc.
- **Remote** work means getting into a machine via SSH and making the changes locally. And that _can_ mean having to get in as a different user as well. You don't know if you can mount it with SMB or NFS or anything else like that, but you *do* know you can ssh in and that vi of some sort is going to be there.

This was much of this week — the parts that weren't sidestepping the vengeful wrath of Murphy — and it struck me that, instead, I should be able to modify the code locally, test it locally, commit changes, push to our work Github instance, and pull or push or CI/CD into place. Developing in place, developing in production, is a thing I don't do for my side projects, and it isn't a thing I should do for my day job.

The other two are the kind of things that, if I spent *real* time getting the other computers into development environments, rather than doing small things on them while doing most of the work on my main Linux box, that kind of thing would be worked out bny now. 

vim, in and of itself, is not the problem. It *is* a thing that enables workflows that I need to change. An antipattern.

I feel attacked. By myself.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
