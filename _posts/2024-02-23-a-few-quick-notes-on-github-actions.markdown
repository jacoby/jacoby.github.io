---
layout: post
title: "A few quick notes on GitHub Actions"
author: "Dave Jacoby"
date: "2024-02-23 15:20:17 -0500"
categories: ""
---

I avoided looking at GitHub Actions for a long time. I had set some automation on a few things with [Appveyor](https://www.appveyor.com/) and [TravisCI](https://www.travis-ci.com/), but the things I was coding were for work and not using GitHub, and the things I had added automation to were stable. I doubt I've done anything with some of the repos but test the testing. 🤓

But I'm told it's good for me, and here I am, adding to something I've successfully run tests on before, on both services.

```yaml
name: run perl ubuntu

on:
  push:
    branches:
      - "*"
  pull_request:
    branches:
      - "*"
jobs:
  perl-job:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        perl-version:
          [
            "5.38",
            "5.36",
            "5.34",
            "5.32",
            "5.30",
            "5.28",
            "5.26",
            "5.24",
            "5.22",
            "5.20",
            "5.18",
            "5.16",
            "5.14",
            "5.12",
            "5.10",
            "5.8",
          ]
    container:
      image: perldocker/perl-tester:${{ matrix.perl-version }}
    steps:
      - uses: actions/checkout@v2
      - name: Regular tests
        run: |
          cpanm --notest Test::Builder Test::More IO::Pty IO::Tty
          cpanm --installdeps --notest . 
          perl Makefile.PL
          make 
          make test
```

I'm hardcoding the dependencies and test modules in the first line of my `run` above. In the fullness of time, I might pull those and see what's going on. I think I know the problem that I was having that made me want to pull them, and that wasn't about dependencies.

I am jazzed that I can test this module as far back as 5.8. I had tested to 5.10 on Travis before, so when I was getting the `perl-version` thing going, I decided to go as far back as I deemed even vaguely reasonable. Thanks to [perldocker on DockerHub](https://hub.docker.com/u/perldocker), create by [the Perl and Raku Foundation](https://www.perlfoundation.org/).

Also thanks to [Gabor Szabo's PerlMaven](https://perlmaven.com/) and [the five-year-old GitHub Action examples I'm heavily cribbing from](https://perlmaven.com/setup-github-actions).

I think I'll only be able to test on MacOS against `macos-latest` and the Perl it provides, but that's fine.

But, while I had this going, I jumped to the Appveyor Windows-specific script, and found that it was trying to do `MSBuild` on it, like through Visual Studio, and that's not necessary.

(It makes no sense to get a tool or service working again when I'm planning to replace them, but it makes me feel like I'm accomplishing a thing.)

But once that was fixed, I found another error. cpanm couldn't build a dependency, but the build log was on the far side of the service, so I tried locally, and saw this in the build log.

> `OS unsupported at Makefile.PL line 6.`

IO::Tty doesn't even try to build on Windows. So whatever positive tests I got years ago were false positives, and my choices are to live with it or make IO::Tty work with [Strawberry Perl](https://strawberryperl.com/).

So I have *that* going forme.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
