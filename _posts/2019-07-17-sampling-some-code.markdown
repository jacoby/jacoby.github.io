---
layout: post
title: "“Sampling” some Code"
author: "Dave Jacoby"
date: "2019-07-17 10:10:18 -0400"
categories: ""
---

You find things in the oddest places.

[This dev.to post is all about taking notes, with code comments as a specific case.](https://dev.to/scrabill/how-i-approach-notetaking-as-a-developer-c7a) I quite liked it, although I had minor quibbles.

```ruby
def createColor
# Lists all possible integers that can be use in a valid hex code
  hexadecimalIntegers = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"]

# Randomly get 6 items from the hexadecimalIntegers array, then join them together at each character
color = hexadecimalIntegers.sample(6).join("")

# Puts hex color
  "Your new hex color is ##{color}"
end
```

I could go into my issues here, but it's a story for another time. I will instead point out this bit: `color = hexadecimalIntegers.sample(6).join("")`

Specifically, `hexadecimalIntegers.sample(6)`

`sample` is a method for Ruby arrays (lists?) that gives you one or more entries from the array. From testing, it seems that it won't give you repeated values; given the hexidecimal examples, it pulls `'A'` from the list when `sample`d, so you can get `['A','B']` from `hexadecimalIntegers.sample(2)`, but not `['A','A']`.

There are times when I'd want that behavior, sure. There are also times when I wouldn't, where `['0','0','0','0','0','0']` would become the blackest of blacks RGB has to offer and I want that possibility.

MetaCPAN tells me it's in [List::MoreUtils](https://metacpan.org/pod/List::MoreUtils), and looking in issues in [List::AllUtils](https://metacpan.org/pod/List::AllUtils) tells me that LAU can't just snag all LMU's functions, because LMU is licensed differently.

But I haven't looked at LMU code and I have written some functions, so I'll see about bringing `sample` to that project.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
