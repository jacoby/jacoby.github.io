---
layout: post
title:  "Moving a Git repo to 'trunk' - Techniques and Pitfalls"
author: "Dave Jacoby"
date:   "2020-06-12 18:29:58 -0400"
categories: ""
---

Relating to [yesterday's post about moving repos from `master` to `trunk` or another word as the main branch](https://jacoby.github.io/2020/06/12/a-controversial-idea.html), decided I would start with a project that isn't the easiest, or the hardest.

I chose the repo for website for Purdue Perl Mongers. The repo lives [in GitHub](https://github.com/Purdue-Perl-Mongers/purdue-perl-mongers.github.io) and [is set up with GitHub Pages](https://purdue-perl-mongers.github.io/), but really, it lives in the cloud and responds to [purdue.pl](https://purdue.pl/).

The first step was easy:

```bash
git checkout master   # go to current canonical branch
git checkout -b trunk # create the new branch
git push origin trunk # push that new branch up to GitHub
```

Before that last one, let's get the `.git/config` updated. There's more to it, and here we're basically going `s/master/trunk/g` to this.

```ini
[branch "trunk"]
        remote = origin
        merge = refs/heads/trunk
[remote "origin"]
        url = https://github.com/Purdue-Perl-Mongers/purdue-perl-mongers.github.io.git
        fetch = +refs/heads/*:refs/remotes/origin/*
[remote "deploy"]
    url = ssh://jacoby@purdue.pl:/home/jacoby/dev/purdue.pl
    fetch = +refs/heads/*:refs/remotes/deploy/*
```

Going to **Github > Repo > Settings > Branches**, you can then go to a drop-down to switch from `master` to `trunk`.

So far, so good. We have created the branch, put it up to GitHub. (I can't imagine that it'd be much harder in GitLab, especially since [this idea is in their ticket tracker](https://gitlab.com/gitlab-org/gitlab/-/issues/221164).)

The last step, I know, but I won't execute just yet, will first remove the `master` branch locally, then pushing an empty branch to overwrite `master` in `origin`.

```bash
git branch -D master    # delete the local master branch

git push origin :master # of the form <source>:<destination>
                        # so we could've done master:trunk
                        # to create the remote branch in the
                        # first place, but here, it's empty
                        # source replacing the master
                        # destination
```

So, I _get_ these commands, but I haven't used them.

Why?

We use a [**post-receive hook**](https://www.digitalocean.com/community/tutorials/how-to-use-git-hooks-to-automate-development-and-deployment-tasks) that allows me to push to `deploy`.

```text
$ pwd && cat post-receive
/home/jacoby/dev/purdue.pl/hooks
GIT_WORK_TREE=/var/www/html git checkout -f
jacoby@purduemongers 19:54 ~/dev/purdue.pl/hooks (BARE:master)
$
```

I was sent this, and this has been a Cargo-Cult element of the process ever since. I don't fully understand how this works. I mean, kinda; `GIT_WORK_TREE=` is setting an environment variable, feeding `git checkout -f`, meaning `force`. As you can see from the prompt and the info from `__git_ps1`, it's still looking at `master`, and I don't know how to change it.

But, desperately searching for `GIT_WORK_TREE git post-receive` got me to a fuller solution:

```bash
#!/bin/bash
TARGET="/var/www/html"
BRANCH="trunk"

while read oldrev newrev ref
do
        # only checking out the master (or whatever branch you would like to deploy)
        if [ "$ref" = "refs/heads/$BRANCH" ];
        then
                echo "Ref $ref received. Deploying ${BRANCH} branch to production..."
        GIT_WORK_TREE=$TARGET git checkout -f $BRANCH
        else
                echo "Ref $ref received. Doing nothing: only the ${BRANCH} branch may be deployed on this server."
        fi
done
```

So, right now, when I change the mess to announce the next meeting, It is (again) as easy as

```baseh
git add index.html
git commit -m "New Meeting or Whatever"
git push origin trunk
git push deploy trunk
```

My first project is converted! Woot!

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
