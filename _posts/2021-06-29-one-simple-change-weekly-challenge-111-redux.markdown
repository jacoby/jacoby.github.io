---
layout: post
title: "One Simple Change: Weekly Challenge #111 Redux"
author: "Dave Jacoby"
date: "2021-06-29 17:36:27 -0400"
categories: ""
---

[Think back to my 118.2 answer](https://jacoby.github.io/2021/06/21/knight-thgink-perl-weekly-challenge-118.html), where I had crazy recursion problems that made it go two days without appreciable progress.

My first move against the **Cornucopia of Infinite Loops** (and I should make a shirt of _that_ as well) was to avoid reusing squares. The second, obvious but forgotten thing is that, if your path is length _n_, every other path thats _n_ or longer is definitionally a no-go, so adding one line — `return if length $trail >= length $shortest` — is enough to keep the code from going off on unproductive tangents. For any path, there _may_ be paths that are of the same length that won't show, but we're looking for the _shortest_ path, not _all paths of the same length_. 

I ran it 

```text
... 

00 21 02 23 04 25 06 27 46 65 44 63 42 61 40 32 24 43 51 72 60 52 71
  a b c d e f g h
8 . * . * . * . * 8
7 * * * * * * * * 7
6 * . * . X . * . 6
5 * * . * * * * * 5
4 . * X . . * . * 4
3 * X . * * * * * 3
2 X X * . * . * * 2
1 * X . * * * * * 1
  a b c d e f g h

68
        00 21 02 23 04 25 06 27 46 65 44 63 42 61 40 32 24 43 51 72 60 52 71

00 21 02 23 04 25 06 27 46 65 44 32 24 43 51 72 60 52 71 50 42 61
  a b c d e f g h
8 . * . * . * . * 8
7 * * * * * * * * 7
6 * . * . X . * . 6
5 * * . * * * * * 5
4 * * X . . * . * 4
3 . X . * * * * * 3
2 X X * * * . * * 2
1 * X . * * * * * 1
  a b c d e f g h

65
        00 21 02 23 04 25 06 27 46 65 44 32 24 43 51 72 60 52 71 50 42 61

00 21 02 23 04 25 06 27 46 65 53 61 42 63 71 52 60 72 51 32 24
  a b c d e f g h
8 . * . * . * . * 8
7 * * * * * * * * 7
6 * . * . X . * . 6
5 * * . * * * * * 5
4 * * X * * * . * 4
3 * X . . * * * * 3
2 X X * . * . * * 2
1 * X . * * * * * 1
  a b c d e f g h

62
        00 21 02 23 04 25 06 27 46 65 53 61 42 63 71 52 60 72 51 32 24

00 21 02 23 04 25 06 27 15 36 24 43 51 72 60 52 71 50 42 61
  a b c d e f g h
8 . * . * . * . * 8
7 * * * * * . * * 7
6 * . * . X . * . 6
5 * * * * * * . * 5
4 * * X . * * * * 4
3 . X . * * * * * 3
2 X X * * * * * * 2
1 * X . * * * * * 1
  a b c d e f g h

59
        00 21 02 23 04 25 06 27 15 36 24 43 51 72 60 52 71 50 42 61

00 21 02 23 04 25 44 63 42 61 40 32 24 43 51 72 60 52 71
  a b c d e f g h
8 . * . * . * * * 8
7 * * * * * * * * 7
6 * . * . X . * * 6
5 * * . * * * * * 5
4 . * X . . * * * 4
3 * X . * * * * * 3
2 X X * . * * * * 2
1 * X . * * * * * 1
  a b c d e f g h

56
        00 21 02 23 04 25 44 63 42 61 40 32 24 43 51 72 60 52 71

00 21 02 23 04 25 44 32 24 43 51 72 60 52 71 50 42 61
  a b c d e f g h
8 . * . * . * * * 8
7 * * * * * * * * 7
6 * . * . X . * * 6
5 * * . * * * * * 5
4 * * X . . * * * 4
3 . X . * * * * * 3
2 X X * * * * * * 2
1 * X . * * * * * 1
  a b c d e f g h

53
        00 21 02 23 04 25 44 32 24 43 51 72 60 52 71 50 42 61

00 21 02 23 04 12 24 43 51 30 42 61 53 72 60 52 71
  a b c d e f g h
8 . * . * . * * * 8
7 * * . * * * * * 7
6 * . * . X * * * 6
5 . * * * * * * * 5
4 * * X . * * * * 4
3 * X . . * * * * 3
2 X X * * * * * * 2
1 * X . * * * * * 1
  a b c d e f g h

50
        00 21 02 23 04 12 24 43 51 30 42 61 53 72 60 52 71

00 21 02 23 04 12 24 43 51 72 60 52 71 50 42 61
  a b c d e f g h
8 . * . * . * * * 8
7 * * . * * * * * 7
6 * . * . X * * * 6
5 * * * * * * * * 5
4 * * X . * * * * 4
3 . X . * * * * * 3
2 X X * * * * * * 2
1 * X . * * * * * 1
  a b c d e f g h

47
        00 21 02 23 04 12 24 43 51 72 60 52 71 50 42 61

00 21 02 23 42 61 40 32 24 43 51 72 60 52 71
  a b c d e f g h
8 . * . * * * * * 8
7 * * * * * * * * 7
6 * . * . X * * * 6
5 * * . * * * * * 5
4 . * X . * * * * 4
3 * X . * * * * * 3
2 X X * * * * * * 2
1 * X . * * * * * 1
  a b c d e f g h

44
        00 21 02 23 42 61 40 32 24 43 51 72 60 52 71

00 21 40 61 42 63 71 52 60 72 51 32 24
  a b c d e f g h
8 . * * * * * * * 8
7 * * * * * * * * 7
6 * . * * X * * * 6
5 * * . * * * * * 5
4 . * X * * * * * 4
3 * X . * * * * * 3
2 X X * . * * * * 2
1 * X . * * * * * 1
  a b c d e f g h

38
        00 21 40 61 42 63 71 52 60 72 51 32 24

00 12 24 43 51 72 60 52 71 50 42 61
  a b c d e f g h
8 . * * * * * * * 8
7 * * . * * * * * 7
6 * * * * X * * * 6
5 * * * * * * * * 5
4 * * X . * * * * 4
3 . X . * * * * * 3
2 X X * * * * * * 2
1 * X . * * * * * 1
  a b c d e f g h

35
        00 12 24 43 51 72 60 52 71 50 42 61

00 12 24 43 51 72 60 52 71 50 42 61
  a b c d e f g h
8 . * * * * * * * 8
7 * * . * * * * * 7
6 * * * * X * * * 6
5 * * * * * * * * 5
4 * * X . * * * * 4
3 . X . * * * * * 3
2 X X * * * * * * 2
1 * X . * * * * * 1
  a b c d e f g h


real    63m23.304s
user    63m0.984s
sys     0m1.641s
```

So, instead of incomlete in 48 hours, we get a 12-jump answer in one. That's winnish to me.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
