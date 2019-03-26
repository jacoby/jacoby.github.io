---
layout: post
title: "First Things To Learn In A New Language"
author: "Dave Jacoby"
date: "2019-03-26 14:37:47 -0400"
categories: ""
---

This is in response to a question that slid past me on Twitter recently, about getting started with programming. My go-to advice is _You shouldn't be learning a language, but learning how to solve a problem or handle a task **with** a language_, which I do agree with, but the following things are before that. If you don't do these, you can't use the language to solve your problems. 

## **Hello World**

The form will depend on the programming context. With an Arduino or other single-board microcontroller, it will be having a light flashing. With Javascript, it will likely include `alert()` and `prompt()`. You get two things from this:

- **"It works":** You know that the system works, and that you can thrown more effort into the problem and get a satisfactory result.
- **Input/Output:** Output is that blinking lights, `console.log()` or `printf`, but input is the knob that determines the speed of the blinking light, the `prompt()` that allows you to write `Hello, Dave` instead of `Hello, World`. It means that you can interact with the program once it starts.

## **Fibonacci:**

This can be done two ways, and each one teaches you a different thing.

```perl
use feature qw{ say postderef signatures } ;
no warnings qw{ experimental::postderef experimental::signatures } ;

# Iterative Fibonacci
sub ifibonacci ( $n ) {
    my @array = (0,1);
    if ( $array[$n] ) { return $array[$n] }
    for my $i ( 2 .. $n ) {
        $array[$i]= $array[$i-1] + $array[$i-2];
    }
    return $array[$n];
}
say ifibonacci(8); # 21
```

Here, you iterate through the problem, and from this, you learn about `if` statements and `for` loops, which are two fundamental building blocks of programming. You also learn about arrays.

```perl
# Recursive Fibonacci
sub rfibonacci ($n) {
    return 0 if $n == 0 ;
    return 1 if $n == 1 ;
    return rfibonacci($n-1) + rfibonacci($n-2);
}
say rfibonacci(8); # 21
```

I asked Google for a definition of [recursion](https://en.wikipedia.org/wiki/Recursion_(computer_science)), and it gave me _the repeated application of a recursive procedure or definition_, which defines recursion by itself, which should make all the geeks happy.

> The power of recursion evidently lies in the possibility of defining an infinite set of objects by a finite statement. In the same manner, an infinite number of computations can be described by a finite recursive program, even if this program contains no explicit repetitions.
> — Niklaus Wirth, Algorithms + Data Structures = Programs, 1976 

This also gives you more comfort with subroutines or functions, where you separate your code into specific domains.

To my mind, once you know how to get your code to start, you have input and output sorted out, and you have functions and control structures, you _know_ a language. There's _more_ -- standard libraries, frameworks, file I/O, networking, the particularities and syntactic sugars of each language, and so much more, but here, you're getting further into the _problem domain_, not the language itself.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
