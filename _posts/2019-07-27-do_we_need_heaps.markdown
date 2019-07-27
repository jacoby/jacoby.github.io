---
layout: post
title: "Do We Need Heaps In Modern Languages?"
author: "Dave Jacoby"
date: "2019-07-27 17:54:06 -0400"
categories: ""
---

This is side-blogging this week's [Perl Weekly Challenge](https://perlweeklychallenge.org/blog/perl-weekly-challenge-018/), or perhaps more accurately, last week's.

> Write a script to implement Priority Queue. It is like regular queue except each element has a priority associated with it. In a priority queue, an element with high priority is served before an element with low priority. Please check this wiki page for more informations. It should serve the following operations:
>
> 1. is_empty: check whether the queue has no elements.
>
> 2. insert_with_priority: add an element to the queue with an associated priority.
>
> 3. pull_highest_priority_element: remove the element from the queue that has the highest priority, and return it. If two elements have the same priority, then return element added first.

I come from a Computer Science background, which means that when I hear "priority queue" I know to think ["heap"](<https://en.wikipedia.org/wiki/Heap_(data_structure)>), and I have been a practical developer in the trenches of user-facing computing for a long time, which means that I have forgotten almost everything about it.

It's understandable. Another thing we learned when we were struggling with "C as a subset of C++" were arrays vs linked lists. In C, arrays are indexed, but are internally contiguous memory locations, and so the array `arr` is a memory address, and the index is multiplied by the byte size and used as an offset. Because you're asking for this chunk of memory, you cannot grow or shrink your array.

The [linked list](https://en.wikipedia.org/wiki/Linked_list), on the other hand, allows you to traverse it with `next` and `prev` and a great number of other things. They can be coerced into all sorts of other forms, giving you `push` and `pop` and `shift` and `unshift` (which _really_ needs a new name that isn't just negation, don't you think) but classically don't give you indexes.

But in higher level languages, you _do_ have all those cool things, as well as classical array formations, so as a person who has primarily lived with Perl, Python and Javascript in his professional career, I have my cake and eat it too, all for the expense of memory. We as a community have looked at this trade-off and said that it is good.

So, looking at this, there are three things I did not want to do:

* **Implement My Own Heap**
* **Steal Any Other Participant's Code**
* **Sort An Array Repeatedly And Call It Done**

So I'm not gonna actually do this challenge. What I *am* going to do look into heaps and try to figure if this is a thing should have.

So I looked on [MetaCPAN](https://metacpan.org/search?size=20&q=Heap) and found some modules to try. The one I could make work is [Array::Heap](https://metacpan.org/pod/Array::Heap).

```perl
use Array::Heap;
use JSON;

my $json = JSON->new->space_after->canonical;
my @elements = (10,3,4,8,2,9,1);
my @heap ;

push_heap(@heap, @elements);

say $json->encode(\@elements);
say $json->encode(\@heap);

my @output;
while ( @heap ) {
    push @output, pop_heap(@heap);
}
say $json->encode(\@output);

__DATA__

[10, 3, 4, 8, 2, 9, 1]
[1, 2, 9, 8, 3, 10, 4]
[1, 2, 3, 4, 8, 9, 10]
```

I expect that, if I hooked in [Benchmark](https://metacpan.org/pod/Benchmark) and ran it a few million times, the Heap implementation would be faster. But with Perl's arrays (and Javascript's, and so on), I can create the arrays full of things like this --

```json
{
    "task" : "testing Heap modules on CPAN",
    "priority": 7
},
{
    "task" : "Blogging about Heaps",
    "priority": 6
}
```

-- and `@priorities = sort{ $a->{priority} <=> $b->{priority} } @priorities` to get the higher priorities closer to the top.

So, as an intellectual exercise, I could imagine creating a library that implements heaps and puts them in my favored languages, but for real code, I cannot imagine them being more useful than modern built-in arrays.

Thanks to [Eloquent Javascript](http://eloquentjavascript.net/1st_edition/appendix2.html) for a nice refresher in JS before I jumped into the Perl.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
