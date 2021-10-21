---
layout: post
title: "You Gotta Look Sharp: Redoing Weekly Challenge 135 in Microsoft's Preferred Language"
author: "Dave Jacoby"
date: "2021-10-21 17:46:39 -0400"
categories: ""
---

> You gotta look sharp  
> You gotta look sharp  
> And you gotta have no illusions  
> Just keep going your way looking over your shoulder  
>  — [Joe Jackson, "Look Sharp"](https://genius.com/Joe-jackson-look-sharp-lyrics)

I've written in C# before. I have a command-line "Make this my Background" program, which I'm considering a redo so I can try to add "Make this background for _every_ desktop" as an option.

But it's been a while, and I never really learned a lot of C#. Just enough for that task, really.

The interesting part about learning a new language is figuring out what's harder and what's easier. I'm _very_ used to Arrays that have Linked List methods. I would prefer to `integers.push(-123)` or the like, but I'm not seeing that it's the way in C#. There's also a _lot_ of overhead to this that you just don't see in my Perl solutions.

And _types_. Man oh man, types. I've been looking at Corinna a little, and seeing in that context how they work. I'm making a Line object out of Point objects, I better be sure I have Point objects and not just scalars. But there's hiccups when I was playing around (I dont't think any hit the code below) between when I would want an `int` and when I'd want a `double`. I _like_ having a thing that's that thing whether it holds 4 or 444,444,444, and only changes when things get *really* big or *really* small. I know that, between the two, it's details the computer can sweat instead of me, and having to sweat unneccessary details seems counterproductive, y'know?

But I could see working with this.

#### Show Me The Code

```csharp
using System;
using System.Collections.Generic;
using System.Linq;

namespace MyApp // Note: actual namespace depends on the project name.
{
    public class Program
    {
        public static void Main(string[] args)
        {
            int[] integers = new int[4];
            integers[0] = 1234567;
            integers[1] = -123;
            integers[2] = 1;
            integers[3] = 10;

            for (int i = 0; i < integers.Length; i++)
            {
                int j = integers[i];
                MiddleDigits(j);
            }

        }

        static void MiddleDigits(int i)
        {
            Console.WriteLine("");
            Console.WriteLine("Input: $n = {0}", i);
            int absi = Math.Abs(i);
            if (absi % 2 == 0)
            {
                Console.WriteLine("Output: even number of digits");
                return;
            }
            if (absi < 100)
            {
                Console.WriteLine("Output: too short");
                return;
            }
            while (absi > 999)
            {
                string stri = absi.ToString();
                int strl = stri.Length - 1;
                stri = stri.Remove(strl, 1);
                stri = stri.Remove(0, 1);
                absi = Int32.Parse(stri);
            }
            Console.WriteLine("Output: {0}", absi);
            return;
        }
    }
}
```

```text
Input: $n = 1234567
Output: 345

Input: $n = -123
Output: 123

Input: $n = 1
Output: too short

Input: $n = 10
Output: even number of digits
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
