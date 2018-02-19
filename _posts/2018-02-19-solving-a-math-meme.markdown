---
layout: post
title:  "Solving A Math Meme!"
author: "Dave Jacoby"
date:   "2018-02-19 10:46:11 -0500"
categories: math
---

I found this in my Twitter feed, which I found interesting, because I normally see things of this form on Facebook.

![FOR REAL MATH NERDS ONLY! 
SOLVE CAREFULLY! 
230-220 x 1/2 =
MOST PEOPLE WON'T BELIEVE IT, BUT THE ANSWER IS 5!](/images/five.jpg)

## The problem

    230 - 220 * 1/2 =
    ( 230 - 220 ) * 1/2 =
    10 * 1/2 =
    5

**The answer is 5!**

No.

Remember **PEMDAS** - Parens, Exponents, Multiplication, Division, Addition, Subtraction. 

The order of operations is wrong.

    230 - 220 * 1/2 =
    230 - 110  =
    120 =

**The answer is 120?**

Yes, but...

    1 * 2 * 3 * 4 * 5 =
    2 * 3 * 4 * 5 =
    24 * 5 =
    120 =
    5 factorial =
    5!

So, yes, the answer is **5!**.

But notice the punctuation.

This is a mathematical pun, relying on common mistakes, unfamiliar notation and Facebook meme convention disguise a correct answer as wrong.

And because this makes the user feel like Clumsy Pan Guy, I feel I must don an obnoxious sweater and say...

## There has to be another way!

There is. 

There was a logician from Poland named Jan Łukasiewicz, who came up with this notation `+ 1 2` instead of `1 + 2`. Because of his nationality, it is called **Polish Notation**. (Not because, as I thought as a CS underground, of an obscure Polish joke I had never heard the setup to.)

Friedrich L. Bauer and Edsger W. Dijkstra re-invented this in the early days of computing, writing `1 2 +` and calling it **Reverse Polish Notation**, and it became popular among people who liked it in HP scientific calculators. It is cool because it maps to a tree, and because it works well with a stack. 

``` 
  +
 / \
1   2
```

This becomes more useful in later examples. 

    # rewriting the infix example as postfix/reverse polish 
    230 - 220 * 1/2    
    230 220 2 / - # equivalent to times 0.5 but easier to type

We need to find `*number* *number* *operator*`, so `230` gets pushed onto the stack, as does `220` and `2`. When we get `/`, it pops the two, divides, and pushes then answer, `110`, back onto the stack.

Then, the `-` operator comes, we pop `230` and `110`. Subtract them and we get `120`.  

If we lived in the world of Reverse Polish Notation, we would never have to worry about PEMDAS again. The need for parens would go away, because left-to-right `*number* *number* *operator*` would be the only way to math.

But, true or nay, there would be great uproar over introducing such a thing. I'm here advocating for it, and I don't know that I have used it in anger even once.

You can go deeper. With anything math-related, there's always deeper. [Mark-Jason Dominus gives a very good deep-dive on Precedence](https://perl.plover.com/FAQs/Precedence.html). As a good shorthand, if you're writing and you aren't sure what it should be, add parens until there can only be one choice.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


