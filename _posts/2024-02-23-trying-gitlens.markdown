---
layout: post
title: "Trying GitLens"
author: "Dave Jacoby"
date: "2024-02-23 10:46:35 -0500"
categories: ""
---

One of the things I noticed when doing my meandering HackLafayette talk about [VS Code](https://jacoby.github.io/2024/02/22/the-best-things-about-vs-code-today.html) was [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens), which is an improvement on the existing Git implementation in VS Code.

Most of the time, for this blog, I write it in VSCode, with a Markdown Preview window opened in the right half of the editor window. If you see green in [my GitHub heatmap](https://github.com/jacoby) these days, there's a good chance that I'm committing and pushing with [VS Code's default Git integration](https://code.visualstudio.com/docs/sourcecontrol/overview). It is good for commit and push, but often you want to understand the greater application, and honestly, this blog is all commits to master and pushes to origin.

I decided to clone down [RLangSyntax](https://github.com/jacoby/RLangSyntax), which provided syntax highlighting for [ActiveState's KomodoEdit](https://www.activestate.com/products/komodo-edit/), my preferred editor after UltraEdit and before SublimeText. At that time, I was starting to do more R development, both for work and for personal projects, and KomodoEdit's lack of R syntax highlighting annoyed me, so I found an existing abandoned project, copied it, put it on GitHub, added the GPL to the repo and explained old maintainer's licensing in the README, and went forward.

Turns out, the core issue was that there's an RDF file that the editor reads, and needed `em:targetApplication->Description->em:maxVersion` to be equal to or higher than the version number of the existing editor. I _suppose_ I can understand not wanting to release it to editor versions that don't exist yet, but if I had put an abstractly-large version number into the `maxVersion` fields, I wouldn't need half the commits I made.

So, as I mentioned, I started developing in other editors, but when I noticed that KomodoEdit has a new version, I would update the application and make a new release.

Until 9.3, at least. That's when I found that KomodoEdit 9 had R syntax highlighting and nobody needed this project anymore. I updated the README to say **So Long And Thanks For The Fish** and forgot about it.

I figured there's just enough of a history that it would be worth looking at in GitLab, and the minimal outsider interaction would mean it's okay to show. It's my tent, it's my clowns, so it's my circus, so to speak.

![GitLens ScreenShot](https://jacoby.github.io/images/vscode_gitlens.png)

You can see several forks that got pulled into master from another user, this one fixing a misspelling that had slipped past me.

But the graph visualization, showing the tags that indicate points when I packaged for releases and the forks where Sergey cleaned up after me, is very interesting. I could definitely see value in this in projects with longer history, more users, and where I would be responsible for integrating pull requests into forks, forks into branches, and branches into production.

(Note to self, start using "production" instead of "master" for default branch, and look up other people's best practices for branches.)

After a while of being unaware that another UI icon showed up in my editor and a little bit of distrust, I'm tentatively "that's cool" about GitLens. Has anyone else tried it?

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
