---
layout: post
title:  "Want Access to Clipboard"
author: "Dave Jacoby"
date:   "2017-11-02 16:51:37 -0400"
categories: 
---

Here, I'm blogging with markdown and Jekyll, and so I wrote a program that creates markdown file and adds the things that Jekyll wants to see.

So, to create a new blog post, there's a two-step process. First, I type the command:

    $ new_post.pl -t 'Want Access to Clipboard' 
    /home/jacoby/local/dev/jacoby.github.io/_posts/2017-11-02-want-access-to-clipboard.markdown
    title:  "Want Access to Clipboard"
    date:   "2017-11-02 16:51:37 -0400"
    author: "Dave Jacoby"
    categories: 

What I then do is copy the long path to the markdown file and paste it again, opening it in my editor of choice:

    $ code /home/jacoby/local/dev/jacoby.github.io/_posts/2017-11-02-want-access-to-clipboard.markdown

This is fine, if I only blog on occasion, but I am trying to do this more often, so I want to use the awesome power of computing to help me.

I use `xsel` to interact with the clipboard, with these aliases.  

    alias c='xsel -i -b '
    alias p='xsel -p -b '

I would rather be able to do something like the following to get the right file into my editor.

    $ code `p`

I have just installed `xclip`, which is what [the Perl Clipboard module](https://metacpan.org/pod/Clipboard) uses, and it doesn't by default use the `clipboard` buffer. 

I am considering a module that works like Clipboard but gives better configuration so you can be sure you're dealing with the correct buffer. Or, maybe just a personal fork.

