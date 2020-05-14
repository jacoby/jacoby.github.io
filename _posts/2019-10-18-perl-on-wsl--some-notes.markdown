---
layout: post
title: "Perl on WSL - Some Notes"
author: "Dave Jacoby"
date: "2019-10-18 09:51:38 -0400"
categories: ""
---

It started on Facebook.

In the new Perl Community group, someone asked if they should be using [local::lib](https://metacpan.org/pod/local::lib) on [the Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/install-win10). An early response is that you shouldn't touch system Perl, and that's where I took the tangent.

With local::lib, you can have cpan install to a local lib directory, so you can add your own libraries while using the main executable. There's certainly a point to this, but my choice is, either by [perlbrew](https://perlbrew.pl/) or by just compiling it, to just compile it myself.

But, fairly early in my time with WSL, I found that Perl wouldn't build, and because it existed as a quasi-virtual-machine on my local machine that you have to use my Windows password to even get to, and that I could `wsl --unregister` and install another one if things got hairy -- and that the only reason I used it was to get a better bash shell on my second computer == I threw caution to the wind and never hesitated to `apt-get install libwhatever-perl` or `cpanm What::Ever` to system Perl.

We aren't often careful with disposable resources.

But I had some free time, so I tried

```bash
\curl -L https://install.perlbrew.pl | bash
~/perl5/perlbrew/bin/perlbrew install perl-5.30.0
```

And there was failure.

```text

Test Summary Report
-------------------
io/sem.t                                                         (Wstat: 5632 Tests: 1 Failed: 0)
  Non-zero exit status: 22
  Parse errors: Bad plan.  You planned 7 tests but ran 1.
io/socket.t                                                      (Wstat: 0 Tests: 32 Failed: 1)
  Failed test:  13
../cpan/IO-Socket-IP/t/11sockopts.t                              (Wstat: 256 Tests: 4 Failed: 1)
  Failed test:  3
  Non-zero exit status: 1
../cpan/IPC-SysV/t/ipcsysv.t                                     (Wstat: 5632 Tests: 7 Failed: 0)
  Non-zero exit status: 22
  Parse errors: Bad plan.  You planned 39 tests but ran 7.
../cpan/IPC-SysV/t/sem.t                                         (Wstat: 5632 Tests: 1 Failed: 0)
  Non-zero exit status: 22
  Parse errors: Bad plan.  You planned 11 tests but ran 1.
../dist/Net-Ping/t/010_pingecho.t                                (Wstat: 256 Tests: 2 Failed: 1)
  Failed test:  2
  Non-zero exit status: 1
../dist/Net-Ping/t/450_service.t                                 (Wstat: 512 Tests: 26 Failed: 2)
  Failed tests:  9, 18
  Non-zero exit status: 2
../dist/Net-Ping/t/510_ping_udp.t                                (Wstat: 256 Tests: 3 Failed: 1)
  Failed test:  3
  Non-zero exit status: 1
Files=2648, Tests=1217515, 1913 wallclock secs (84.06 usr 47.11 sys + 636.43 cusr 350.92 csys = 1118.52 CPU)
Result: FAIL
makefile:837: recipe for target 'test_harness' failed
make: *** [test_harness] Error 6
##### Brew Failed #####
```

Failure that _looked_ like it was failing because of a broken implementation of System V Semaphore Controls. Semaphores are about controlled access to shared resources, if you didn't have an OS course in college.

So I knew what that related to, but I don't dive deep into OS fun nor do I do Perl internals, I was out of my depth. The response was `You'll find joy in WSL2`.

I had thought I was in WSL2.

I was not in WSL2.

WSL2 is available for those in the [Windows Insider Fast Track](https://www.bing.com/search?q=Windows+Insider+Fast+Track), and because I use that machine for other work-related things, I dislike it when it reboots so often for updates. **NOTE:** Under the newer versions in Windows Insider, we have _very fast_ updates. What used to take most of a day (if it worked) now takes less than an hour. I like the Windows experience much more these days. But, the machine in question is in the Slow track, and thus can only have WSL1.

We've hit a point that I want to emphasize.

### **WSL is good, but it's to allow you to use Windows as your "Linux on the Desktop". It's _beta_ code and should be treated as such.**

Ahem.

My laptop is on the Fast Track, so I tried it there.

```text
Test Summary Report
-------------------
../cpan/IO-Socket-IP/t/31nonblocking-connect-internet.t          (Wstat: 29440 Tests: 8 Failed: 0)
  Non-zero exit status: 115
  Parse errors: No plan found in TAP output
Files=2648, Tests=1217571, 1052 wallclock secs (150.26 usr 22.76 sys + 620.36 cusr 80.75 csys = 874.13 CPU)
Result: FAIL
makefile:837: recipe for target 'test_harness' failed
make: *** [test_harness] Error 1
##### Brew Failed #####
```

[The test that fails](https://metacpan.org/source/PEVANS/IO-Socket-IP-0.39/t/31nonblocking-connect-internet.t)

```perl

   while( !$socket->connect and ( $! == EINPROGRESS || $! == EWOULDBLOCK ) ) {
      my $wvec = '';
      vec( $wvec, fileno $socket, 1 ) = 1;
      my $evec = '';
      vec( $evec, fileno $socket, 1 ) = 1;
 
      my $ret = select( undef, $wvec, $evec, 60 );
      defined $ret or die "Cannot select() - $!";
      $ret or die "select() timed out";
   }
 ```

I'm guessing there's some subtle issue with the sockets, but honestly I'm just grasping for straws here.

Of course, _I'm_ the guy who ends up being the first to try perlbrew on WSL, or at least the first with the confidence to submit an issue.

You could easily read `You'll find joy in WSL2` as `Go away, kid, you bother me`, but I don't. I mean, it could easily go that way if I left it at "There's something wrong with my Windows!" but when you can get it to an easy and replicatable issue and chase the bug through logs, so that the problem relates to `this` not `somewhere in this repo`, that helps a lot.  

I reported a bug to [Visual Studio Code](https://code.visualstudio.com/) last year, and while it was obscure, I proved it was repeatable, the patch was four non-whitespace characters (honest!), and it was fixed in the next release (which was only like a week or two away). I expect this would be something similar with this one.

(Since I mentioned VS Code and WSL, I want to mention that you can open files in your WSL file system within your Windows-installed VS Code. It's cool!)

So, my suggestions:

* If you like Unix and use Windows 10, use WSL
* If you can, go to the Fast Track and use WSL2
* Remember this is in the testing tracks, and is not done
* WSL distros are almost like Docker containers or VMs, where you can have several that you can use in parallel and delete when they don't serve you
* Right now, making the most current Perl is going to be hard, so don't be afraid to use it to learn local::lib, or just use system Perl as you need

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
