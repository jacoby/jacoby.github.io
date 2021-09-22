---
layout: post
title: "A First Pass at Object::Pad Some More"
author: "Dave Jacoby"
date: "2021-09-22 14:21:18 -0400"
categories: "perl"
---

[I wrote about my first pass earlier.](https://jacoby.github.io/perl,oop,corinne/2021/09/08/a-first-pass-at-objectpad.html) This is not \_substantially different, just [some changes](https://gist.github.com/perigrin/58c688577b8cba24181094c1c8d132c4) from [perigrin](https://twitter.com/perigrin), who is deeper into this rabbit hole than I have been.

First is `:mutator`.

> Generates an lvalue mutator method to return or set the value of the slot. These are only permitted for scalar slots. If no name is given, the name of the slot is used

This means that this is valid:

> `$x = $obj->foo;`

And so is this:

> `$obj->foo = $x`

I'm sure I've tried that with my current understanding of Perl using out-of-the-box OOP, and gave up in frustration. I believe that `:reader` and `:writer` give some of that behavior, but I've not seen enough to really know for sure. I think that `:reader` means you can get this data from the object but can't change it (directly, at least), while `:writer` means you can change it directly but can't access it. I'll have to code and play to find out.

While I'm **:here** ;) , I think I'll mention that `:param` is there to indicate that this is fillable via `new()`. In my case, I'm automating the creation of nodes in a for loop, but it strikes me I could create it like:

```perl
$nodes{9} = CorNode->new( value => 9 );
$nodes{6} = CorNode->new( value => 6, right => $nodes{9} );
```

and so on.

Except, we get the problem that you need to assign the child's parent and the parent's child at the same time, and adding `parent` or `left` or `right` to the default constructor for the object would mean that either the parent or child doesn't exist yet.

The administrivia is crossing my eyes. Again, I'll have to get into this a lot more to really understand.

There was some expanding ternary into `if () {} else {}` that, because it was late and I was all out of **INSERT CURSE HERE**, perigrin suggested the following:

> `method is_leaf () { return !defined($left // $right) }`

I have a _slight_ problem with it, because these methods return `1` or `undef`, and I prefer `1` or `0`, so my change is simply:

> `method is_leaf () { return !defined($left // $right) || 0 }`

Yes, it's pedantry, but it's _my_ pedantry.

If there's more to do with this CorNode class, then I'll keep with the 80s Zappa naming and write **The Return of the Son of a First pass at Object::Pad**, but I expect I'll have to make something more clever, like Points coming together to become Shapes and being required to have an `area()` method, and so forth, and that'll need a new name, as would subclassing Node to create Tree or Heap or something.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
