---
layout: post
title: "Knowledge Backfill and the Fat Comma"
author: "Dave Jacoby"
date: "2020-04-11 15:59:30 -0400"
categories: ""
---

I remember reading something back in college where someone interviewed a lot of Unix folk to try to find the core set of knowledge to become a _Unix Master_, and found that there is none. Each person knows the things needed to do the things necessary for that person. The Novice can blow the mind of the Master.

I _always_ try to look back, find the thing I should've learned but missed. There's loads, and I always find more, especially when I jump into a new context. This time, I was reading a test.

The test created an object and used `after` from [Class::Method::Modifiers](https://metacpan.org/pod/Class::Method::Modifiers) to backfill an object.

It looked like `after setup => sub { ... }` and while I got the anonymous subroutine and what it did, I didn't get `after`. (I anaologize it to the Neuralizer from Men In Black: Every time I look into it, I forget everything.) I asked a friend, and he mentioned a thing that I had been using forever and not thought about.

One thing I like about Perl is that it avoids **operator overloading**, like how `+` is addition or concatenation in Javascript, or many other things when used in array or object contexts, preferring **variable overloading**. `+` is and always will be addition, but with `'foo' + 2`, it finds the best guess as to what `'foo'` means mathematically, and brings it down to `0`, so that becomes `2`. If instead of `'foo'` I used `'29 Palms'`, it'll return `31`.

This goes onto arrays and hashes. Hashes are kinda arrays with an even number of entries, and you can swap `keys` and `values` by `%hash = reverse %hash`.

So that means ...

```perl
    my %x = ( 'a', 1, 'b', 2. );
    %x = reverse %x;
    say $json->encode( \%x );

# {
#    "1" : "a",
#    "2" : "b"
# }
```

The `=>` or [_Fat Comma_](https://en.wikipedia.org/wiki/Fat_comma) converts the thing before it as a string. I've used Perl forever, I've used hashes in Perl forever, so I've used this without thinking about it forever.

`after setup => sub { ... }` is just as easily `after 'setup' , sub { ... }`. I'm torn, personally, as to whether it makes the association any more clear. I mean, it feels like using a dispatch table, so it's kinda cool.

I had been fairly Cargo Cult about this: I use the symbols (`=>`) and get the cargo ( hashes with bareword keys ) without thinking about how it happens. It just worked, and I went on. But know how it works and how I can use it in non-hash contexts, which I guess makes me...

```perl
say join ' ', Just => Another => Perl => Hacker => ;
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io)
