---
layout: post
title:  "No Stupid Questions: Just One Programming Language?"
author: "Dave Jacoby"
date:   "2017-11-06 16:32:27 -0500"
categories: nostupidquestioms
---

My wife and I were sitting in the living room, talking about something or other, and she asks me if there could just be one programming language.

It sounds like a simple question, at least, but it proves to be a complex one, because the answers are "yes, no, yes, no, yes".

##YES

On any given machine, there is only one language, which is the binary representation, or **machine language**. In computers, *everything* is ultimately a series of on-off switches, and the code says whether that switch is meant to be on or off. 

##NO

Thing is, it is very hard for people to think in terms of ones and zeroes, so there's a representation called **assembly** which takes every task the language is capable of and turns it into a (more) human-readable form. 

[Here's `Hello, World` in x86 assembly, from Overv on Github.](https://gist.github.com/Overv/5714335)

        extern exit, printf
    
        section .data
        msg db "Hello World!", 10, 0
    
        section .text
        global main
    main:
        push msg
        call printf
    
        mov dword [esp], 0
        call exit

*(A note: when first learning a new language in computing, a programmer tends to write a few standard programs. The first is `hello world`, which teaches the programmer how to deal with strings and input/output. The second is usually one of two implementations of `fibonacci`, with show how either looping or recursion.)*

As you can see, we're still very much in the machine domain instead of the problem domain, so it is hard to look at this and know that it is doing the right thing.

So, at this point, we have two languages to program computers: one that's impossible for humans to work with and one that's almost impossible for humans to work with.

##YES

The above example is written for the assembly language of Intel's x86 chipset. Between MacOS and Windows and Linux, most desktop and server computers use this, but not all of them. There's also ARM, which is what your phone probably uses, and back when a lot of these decisions were made, each computer manufacturer had it's own architecture and assembly. This is good (for the manufacturer) because it allows them to say "Our computers have feature X which is worth all the money!" but it is bad (for the programmer) because that means that your program can only run on the computer it was written for.

This is where Alan Turing comes in. Also, Alonzo Church.

You probably recognize Alan Turing, who developed the Bombe to brute-force decrypting the Enigma and created the Turing Test, by which we can determine if a computer has achieved sentience. To paraphrase Jimmy Diresta, "If it seems smart, it is smart." But the most important thing that Turing contributed to computing, I would argue, is 

> "It was stated ... that 'a function is effectively calculable if its values can be found by some purely mechanical process.' We may take this literally, understanding that by a purely mechanical process one which could be carried out by a machine. The development ... leads to ... an identification of computability† with effective calculability."

[The start of a long Wikipedia trip into Computability](https://en.wikipedia.org/wiki/Church–Turing_thesis)

So, reductively, if I can do a mathematic thing myself, I can do it 1) mechanically via the Lambda Calculus (Church - more later) or 2) a Turing machine (Turing). So, whe can create a language that is portable between all these architectures and assembly languages -- somewhat ahistorically, we'll say it's `C` -- and have a language that can work in people's heads and still (can be can be compiled to) work on your computer. 

So, we can all just write in C and be fine.

##NO

I could make this `(NO,NO,NO,NO,NO)`, but I think I'll pull it down to one. And be warned, there's LOTS of handwaving here.

The Church-Turing Thesis is not the only incredibly smart thing we get from Church. We also get the lambda calculus.

When we think in terms of C, it ends up taking the very mechanical form, like the assembly language it compiles to. 

Church instead argued in terms of thinking with mathematical and logical systems, and his [Lambda Calculus](https://en.wikipedia.org/wiki/Lambda_calculus), as implemented in [John McCarthy's LISP language](https://en.wikipedia.org/wiki/Lisp_(programming_language)), shows brings in **Functional Programming**, where *functional* doesn't mean "it works" but rather mathematical functions. In C/assembly thinking, you jump to different parts of the routine, or subroutines, but in functional thinking, you have a function `add()`, which takes two or more values and returns the sum of all the values.

There's much more to LISP, which I am not qualified to explain.

Each formulation has power, and languages that come after take concepts from the other and adapt them for their own purposes. (I think the C school steals from the LISP school more often than the LISP school steals from the C school, but I could be wrong.)

Also, you have to have an interface where you call all these programs you wrote, and if you have a program that prints a lot of numbers to the terminal you now want to send it to the printer, so you can think about the numbers away from the screen, you can either rewrite the program so it prints to the printer or write a way to connect your output to the printer input. You need an interface for that, so the shell, the way you interact with the computer, becomes a language in and of itself. This is called **Shell Scripting**. On Unix systems, this is often Bourne Shell, or `sh`, Bourne Again Shell, or `bash`, or `zsh`. (There's also `csh` and `tcsh`, but they are not recommended for shell scripting.)

Remember when I mentioned how there used to be many computer manufacturers with different architectures and machine languages? We can use the Church-Turing Thesis to come up with a virtual architecture and create a new language that compiles to that. This is how we got **Java** and the **Java Virtual Machine(JVM)**, and the purpose was to allow one application language work across all the different architectures and operating systems. ("Write Once, Run Anywhere" was the slogan.) Java is mostly a C-style language (or a C++-style language; let's put a pin in that), but you can make it so other language compile to work on the JVM. Clojure is a LISP dialect that works on the JVM, for example. 

As an undercurrent for all this, there's [**Moore's Law**](https://en.wikipedia.org/wiki/Moore%27s_law), stating roughly that processing power doubles every 12-18 months. Gordon Moore was the co-founder of Intel, whose x86 architecture I mentioned above. It isn't a scientific rule like Ohm's Law, but an observation which was taken as marching orders by that man's employees and the industry at large. Compiled C programs run faster than shell programs, so you write and compile in order to get things to get done faster. But eventually, computers become fast enough that you are able to write things in shell languages that are increasingly complex, that don't have that compilation step. Eventually, you get to the point where you want more complex programs than shell can easily handle, so we get **Dynamic Programming Languages** such as **Perl**, **Python**, **Ruby**, and **PHP**.

There are many reasons why you would want to use dynamic languages over compiled languages, but one of the key ones is that *"All problems in computer science can be solved by another level of indirection"*, and the dynamic languages have enough indirection that you get to think more in terms of the problem and less in terms of the machine. For example, if you want to write a program about you going to the grocery store, you'd rather be able to start with `walk_to_entryway();` rather than `lean(left); lift_leg(right); move_leg(right,forward);lean(forward);` in a loop. Both happen, but if you can keep the focus on the level of finding milk, eggs and flour, then going to checkout, rather than what your muscles are doing, it's easier to write out the process.

##YES

Jeff Atwood proposed **Atwood's Law**, which sits somewhere between Moore's Law and Murphy's Law:

> *Any application that can be written in JavaScript, will eventually be written in JavaScript*

At first, this was because "Put it on a web server" became the alternate version Java's "Write Once, Run Anywhere", and **JavaScript** is the language that runs on every web browser, but since the invention of **Node.js**, you can write JavaScript that runs on the server. 

With [Johnny-Five](http://johnny-five.io/), you can write JavaScript that runs on embedded systems.

There's no real reason why you couldn't compile JavaScript to JVM or machine code, and with a little searching, I could probably find projects on GitHub that do just that.

Additionally, JavaScript was developed with a lot of LISP in it, so you can write both C-style and LISP-style programs with it, or mix-and-match as you desire. 

##In Conclusion

Ultimately, as long as there are different architectures involved in computing, there will be multiple languages, and sometimes those different architectures are there for a good reason. Those architectures and machine languages might only be handled by people trying to make higher-level languages compile to different architectures, but they will still be there.

There will be a variety of higher-level languages based on the needs and desires of the programmers. For every given A in a developer's workspace, there exists a developer who strongly believes not-A, and for every language or framework or architecture, there exists an organization or industry who is strongly invested in it, such that it may never completely go away. (I am sure there's a company whose main product is built in `brainf***`, and I pity their maintenance developers.) 

The forces running counter to the Tower-of-Babel nature of expanding computer languages include the power of already-solved-problems. If your task involves a certain issue, and that issue is done in this language, it may be easier to use that language than try to re-solve it in the language you're using so far.

So, ultimately, for many reasons, **no**, there will never be one programming language. 

