---
layout: post
title:  "I've got Red on my Ledger"
author: "Dave Jacoby"
date:   "2018-01-07 19:06:21 -0500"
categories: perl, expect
---

More notes on my quest to understand and fix the CPAN module I maintain, [Expect](https://metacpan.org/pod/Expect). The "ledger" in question is [the CPANTesters smoke-test ledger](http://matrix.cpantesters.org/?dist=Expect+1.35), and the red I'm hunting down is specifically the FreeBSD column. 

The AIX errors are more fully red, but as it's closed source, it would be **far** more difficult to set up an AIX server than a FreeBSD server, so I'm hitting the lower-hanging fruit.

Not that it was particularly low. First, I tried to set up FreeBSD as a VM on my work computer, but I couldn't get it to stay running for more than, say, five minutes at a time, which is less than it takes to run the tests. So, clearly, that won't work.

So, I set up a VM on Linode. This took some work, because you can use the LISH shell to create an install partition, put an installer on it, and boot the installer to install the OS. All very straightforward and very 1990s installer tech, except modifications to `/boot/loader.conf` that I missed the first time through. 

(I'm told that Digital Ocean has FreeBSD VMs on demand, obviating the need for this. Alas. Next time, should I need to go that way.)

Once I got that going, along with setting up keys to ssh into the box, I had to use the package manager to install git. The cool thing is that, out of the box, it came with a reasonably recent Perl (5.22?), which is refreshing, coming from a computing environment that generally has a system Perl of 5.10 or so.

Anyway, I then used `perlbrew` to install testing Perls from 5.26, which is release, back to 5.18. I couldn't build 5.16, so that's where I gave up. Which is fine.

I then run the command `perlbrew exec prove -l ./t`, which runs the tests against all the installed Perls. This is wonderful. It also shows that, whatever the problems in the Ledger were, they were not demonstrated on the Linode FreeBSD computers.

So, now the task is to compare CPANtesters logs and the logs from my Linode tests, to see what the differences are.

This all means I have a clear next step.  Clear next steps are nice.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).







