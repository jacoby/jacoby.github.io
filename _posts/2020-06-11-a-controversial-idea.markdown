---
layout: post
title: "A Controversial Idea"
author: "Dave Jacoby"
date: "2020-06-11 23:03:13 -0400"
categories: ""
---

This is an idea I've been hearing recently, and I think I'm coming around on.

```bash
git checkout master
git checkout -b production
git branch -D master
```

It doesn't have to be `production`, though. It could be `main` or `prime`, as long as it's clear to you and whoever and whatever interacts with your repository that this branch is the important one.

`git`, when you create a new project, makes the first branch `master`, but otherwise, as far as I can tell, doesn't much care what you call your branches. When you add services like Docker Hub and such to build off of your repos, those may care if you're committing to `master` or not, but GitHub and GitLab themselves, I _think_, don't care what you call your branches.

(I have suspicions about Github Pages, but I haven't checked that out.)

We used to use **master** and **slave** to refer to hard drives. [We stopped around 2003](https://www.cnn.com/2003/TECH/ptech/11/26/master.term.reut/). More recently, we've started moving [from **blacklist** and **whitelist** to **blocklist** and **allowlist**](https://9to5google.com/2020/06/07/google-chrome-blacklist-blocklist-more-inclusive/) and similar terms.

(Meanwhile, I know that using gendered terms to name connectors is going to hit the same issues, and will gladly stop using [this term](https://en.wikipedia.org/wiki/Gender_changer) for useful adapter hardware as soon as I know the next term.)

I have seen two responses to this. The first is, more or less, _**master** doesn't require **servant** or **slave**_. We're not looking to rename **Masters' Degree** at this time. And, it might be compelling to you. In the specific conversation I had, the other person mentioned Tae Kwon Do teachers as **master**; when I took karate several lifetimes ago, we said **sensei**, which connotes **teacher** but is literally **elder**, or **person born before another**. This is not, to my mind, particularly compelling, but it might be for you.

The other response was _Sure, I get the reasons and I agree, but there's gobs of documentation, gobs of projects and gobs of code built to assume the important branch is named **master**, and to change it, for every person and project and service who uses Git, would be a self-inflicted problem of Y2K proportion._

I have to assume that there will be problems.

For a new project, where I know for sure that the CI/CD and other fun won't break, sure.

For a repo that is toy code for my Arduino or my dot files, moving from `master` to `main` would be painless and trivial.

Doing the same for the repo for this blog would mean knowing, for sure, that Jekyll and GitHub Pages are happy using **main** instead of **master**, and breaking that would mean I can't blog anymore, so I would have to test and read docs and be _sure_.

I am maintainer of a fairly well-used Perl modules, and while nothing stops me from changing it to **main**, and nothing in the build and deployment process cares about branch name, but that gets to be a history thing and plays-well-with-others thing, and I would have to think hard before doing so. 

And, of course, there's work, and the repo that holds the money-making code. Making that not work is a lifestyle-affecting decision for everyone in the organization, and making that change is not a thing that I should do alone, even if I had elevated permissions sufficient to do so. But, I can say to my boss and coworkers that this is something we should consider.

I think, in the fullness of time, that this change will become the norm. I don't know when the flag day will be, and what the default branch name will be, and I think it's conversations we have today that will guide those decisions.

And I will be seeing if GitHub Pages and Netlify work if you use another name for your primary branch this weekend.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
