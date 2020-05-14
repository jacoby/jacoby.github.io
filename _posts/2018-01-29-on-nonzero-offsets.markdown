---
layout: post
title:  "On Non-Zero Offsets"
author: "Dave Jacoby"
date:   "2018-01-29 16:44:41 -0500"
categories: 
---

This is a topic I feel compelled to write but know this is not a thing I expect anyone to read. `Blog` derives from `weblog` and comes from people logging their actions on the web.

Here it comes from Globus, which is a service by which I say *"I want to share this huge amount of data with Joe"*, and Globus lets my server know that this is Joe and Joe is who he says he is, and, should there be a problem between Joe's computer and mine, it will try to pick up where we left off.

We get this from a protocol called GridFTP. I've only used it through Globus, so I can't say much about it outside of that context. But one of the features it has is an offset. If I start a transfer with `get(big_file.tar)`, that starts from the beginning, but with `get(big_file.tar, 12345678)`, it starts about a gigabyte in. 

The Joe I know works on the other side of campus from me, and he may want to move the file across the fast campus backbone to the gigabit network drop at his desk. But the Joe might be somewhere else, across several network jumps and political borders. Joe's a very popular name.

And, for another example, it might not be a directory of small files of less than 16GB (we now live in a world where 16GB is *small*), but a large tarball of 300 or more GB. If I am trying to transfer that over a not-so-good connection, one that might show signs of brittleness, this would be a very good thing.

But, the long-term storage computer where you are storing the tarballs holds the archives of a lot of people. It could actually have the tape that `tar` -- `*t*ape *ar*chive` -- is named for. And because it's supposed to be stable, it could not be running the newest software, the code that allows you to restart the download at bit 12345678 might not there.

But that would be *the* place you want it. It's far more important to be able to restart halfway through a 300GB download than a 30GB download.

Theoretically.

No identification with actual systems (living or deceased) is intended or should be inferred. No Joes were harmed in the making of this blog post.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


