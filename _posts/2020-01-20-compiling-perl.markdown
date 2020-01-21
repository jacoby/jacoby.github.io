---
layout: post
title: "Compiling Perl?"
author: "Dave Jacoby"
date: "2020-01-20 19:32:08 -0500"
categories: ""
---

This question came to me because I mentioned "Perl" in a tweet.

> [I have a ~225 line Perl script that I'll need to run a bunch of times. Back in the day we had perlcc, then Persistent Perl, but these seem to be gone. Is there a current replacement?](https://twitter.com/mwlauthor/status/1219359844626464768)

I'm pretty sure I tried [perlcc](https://metacpan.org/pod/perlcc) once, but probably not twice.

OP goes on.

> (Yes, yes, I know, C or python or Rust, whatever, fine: this is a serious question.) #sysadmin

A while ago, on lamer hardware, [I solved my son's math homework with Perl, then Python, Go, C, etc.](https://varlogrant.blogspot.com/search?q=overkill) An end result was that the solution, using the same algorithm on old hardware and not optimized, took about a second and a half in C, a minute and a half in Perl and ... I forget, but either a little under a minute or a little over two for Python. If the 225 lines of code are handling nested loops or other complex system, there _might_ be a significant speed gain from rewriting in C or Rust or Go, or an insignificant change if rewritten in Python.

There's a half-step called **RPerl**, which is a fast subset of Perl under development. It's like "this is for mathematicians who want to figure things out without the hazards of C" rather than a go-to for faster Perl, but it's worth a look.

A chunk of this is that the system opens the executable, opens the file, compiles the code and runs it, while with pre-compiled languages, you just start with an executable thing.

_But_, if the program in question involves file I/O, database hits, other networking overhead, etc., then you have to wait for the network, the other servers, the file system, etc. If the SQL query is too complex and bad, then the fasted code in the fastest language on the fastest processor will just sit and spin while it waits for the query to return.

It gets to be a choice between optimizing for the compiler or optimizing for the developer. With the dynamic languages, the code _is_ the executable, and you never lose the source. I'm happy with this, but not everyone is.

My questions are:

- For those who feel you need to do this, **why??** What do you think you can get by compiling your Perl?
- For those who have done so, **how??** What means, compatable with Perl 5.30, can you use to make Perl programs executable? I mentioned perlcc above, and the OP mentioned PersistentPerl which I haven't toyed with, but it sounds like this isn't compatable with the more modern Perl versions.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
