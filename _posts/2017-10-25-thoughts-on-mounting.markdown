---
layout: post
title:  "Thoughts on Mounting"
author: "Dave Jacoby"
date:   "2017-10-25 13:28:36 -0400"
categories: 
---

It started with `fuse` and `sshfs`. 

I was developing on three remote systems and was beginning to like Komodo Edit, so I wanted to be able to mount all the places from my desktop and read/write with a local editor. I wrote a Perl program that would let me mount and unmount the directories as needed, and that became very important, because some of the file systems proved unreliable, so that I had to become good at force unmounting where nothing could read or write.

After a few years of this, I was convinced by my admins to look into Samba mounting instead, so, for most of my mount points, I have mounts that look more like this:

```bash
#!/bin/bash

# mounts my Windows machine

sudo mount -t cifs \
    //1.2.3.4/users/jacoby \
    -o uid=1000,gid=1000,user=jacoby,vers=2.0 \
    /mount/desktop
```

with a `mountall.sh` program that looks like this:

```bash
#!/bin/sh

# ----------------------------------------------------------------------
# for every mount script in the bin directory, run it.
# ----------------------------------------------------------------------

for i in /home/jacoby/bin/*mount.sh 
    do
        echo $i 
        $i 
    done 

```

Because of the recurring problems of these machines going up and down, I didn't want to have these be entries in my `/etc/fstab`.

This is well and good, and I am looking to add/change this setup, but the spectre of needing to `umount` and perhaps `umount -f` some of these means I need to add the ability to say unmount as well as mount this file system.

Additionally, I've seen online questions about authentication, and I'm thinking that removing the need to type passwords on `desktop_mount.sh` and `mountall.sh` would be a good thing. I'm also beginning to climb back aboard the 'mount only as needed' bandwagon.

I'm writing this as the first step toward a design document, but if there's already a project for mounting and unmounting directories, I'd sure like to know.

If you have questions, comments, suggestions and affirmations, do so as an issue to [my blog repo](https://github.com/jacoby/jacoby.github.io).
