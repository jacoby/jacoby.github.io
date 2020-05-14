---
layout: post
title:  "FizzBuzz One-Liner In Node.js"
author: "Dave Jacoby"
date:   "2019-03-25 15:43:06 -0400"
categories: ""
---

I ended my [Perl-based FizzBuzz answer](https://jacoby.github.io/2019/03/25/fizzbuzz-oneliner-in-perl.html) wondering about `node -e`, and that got me curious.

I had first tried `node -p`, which is a different thing, basically `console.log([YOUR CODE HERE])`, so if your code prints for itself, it returns undef and you get an unexplained `undefined`, so remember `-e`.

We don't have a range operator in JS, but we do have standard `for` loops, so 

```bash
$ node -e 'for ( i = 1 ;  i < 21 ; i++ ) { console.log( i ) }'
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
```

That's a good first step. But every `console.log()` includes a newline, so if we do the most literal copy of the Perl take, we get:

```bash
💻 ✔ jacoby@oz 15:54 52°F       0s  ~/local/dev/jacoby.github.io  (master)
$ node -e 'for ( i = 1 ;  i < 21 ; i++ ) { console.log( i % 3 ? "" : "fizz" ) ; console.log( i % 5 ? "" : "buzz" ); console.log( i % 3 && i % 5 ? i : "" ) }'


1


2
fizz




4

buzz

fizz




7


8
fizz



buzz



11
fizz




13


14
fizz
buzz



16


17
fizz




19

buzz


```

Which is the right answer, but **too much whitespace**.

```bash
$ node -e 'for ( i = 1 ; i < 21 ; i++ ){ let y = "" ; y += i % 3 ? "" : "fizz" ; y += i % 5 ? "" : "buzz" ; y += i % 3 && i % 5 ? i : "";console.log(y) }'
1
2
fizz
4
buzz
fizz
7
8
fizz
buzz
11
fizz
13
14
fizzbuzz
16
17
fizz
19
buzz
```

This is a fun experiment, but by understand is that Node devs are much more likely to use `node` as a REPL than write one-liners.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


