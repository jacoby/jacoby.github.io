---
layout: post
title: "Recursion. See also: Recursion"
author: "Dave Jacoby"
date: "2020-01-24 00:19:46 -0500"
categories: ""
---

> You are given a string “123456789”. Write a script that would insert ”+” or ”-” in between digits so that when you evaluate, the result should be 100.

I had a first pass on this, which involved a _lot_ of nested loops, which was not good, but it solve the thing, right?

```perl
# for a more general solution, I might make it recursive
# passing string, values, total, index and current state,
# and only evaluating when index is highter than the length
# of string. but I have a list of solutions, so not tonight.
```

_But_ someone looking through the results and noticed that it was kicking out duplicate results, which is enough for me to pull out the recursion.

> [**Recursion** (adjective: _recursive_) occurs when a thing is defined in terms of itself or of its type. Recursion is used in a variety of disciplines ranging from linguistics to logic. The most common application of recursion is in mathematics and computer science, where a function being defined is applied within its own definition. While this apparently defines an infinite number of instances (function values), it is often done in such a way that no infinite loop or infinite chain of references can occur.](https://en.wikipedia.org/wiki/Recursion)

If you don't know, now you know.

The canonical example for recursion for computer science is solving the _Fibonacci Sequence_, which, for any position **i**, is defined as **fibonacci( i - 1 ) + fibonacci( i - 2 )**.

```javascript
function fibonacci(n) {
  if (n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

For example, with `fibonacci(4)`, it call `fibonacci(3)` and `fibonacci(2)`, and `fibonacci(3)` calls `fibonacci(2)` and `fibonacci(1)`, and `fibonacci(2)` calls `fibonacci(1)` and `fibonacci(0)`. For `1` and `0`, they return 1, and it builds up from there. Because with recursion, you must include a place to cut it off.

For the **123456789** problem, we'll handle the space between **1** and **2**, then **2** and **3**, and so forth. So, we're adding an index. And, since I'm not going to get out of this without sins, I'm going to use `eval` to do the math.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures };
no warnings
  qw{ experimental::postderef experimental::signatures };

# we can go 1+2, 1-2 or 12, and I add the spaces for
# greater readability
my $vals->@* = ( ' + ', ' - ', '' );

# we're adding the empty strings so there's spaces for us
# to add plus or minus signs
my $source->@* = ( 1, '', 2, '', 3, '', 4, '', 5, '', 6, '', 7, '', 8, '', 9 );

challenge( $source, $vals, 1 );
exit;

sub challenge ( $source, $vals, $index ) {

    # check to see if this is correct
    if ( $index >= scalar $source->@* ) {
        my $string = join '', $source->@*;
        my $result = eval $string;
        say qq{  $result = $string } if $result == 100;
        return;
    }

    # recursively add to the array
    my $next->@* = map { $_ } $source->@*;
    for my $v ( $vals->@* ) {
        $next->[$index] = $v;
        challenge( $next, $vals, $index + 2 );
    }
    return;
}
```

Se start with an index of **1**, the space between **1** and **2**, and we jump forward with **1 + 2**, **1 - 2**, or **12**, and for each, we do the same.

`if ( $index >= scalar $source->@* )` tests to see if we're off the end of the array, and if we are, we then convert `['1',' + ','2'...]` to `1 + 2...`. We then `eval` that string and see if it equals 100. We get.

```text
  100 = 1 + 2 + 3 - 4 + 5 + 6 + 78 + 9
  100 = 1 + 2 + 34 - 5 + 67 - 8 + 9
  100 = 1 + 23 - 4 + 5 + 6 + 78 - 9
  100 = 1 + 23 - 4 + 56 + 7 + 8 + 9
  100 = 12 + 3 + 4 + 5 - 6 - 7 + 89
  100 = 12 + 3 - 4 + 5 + 67 + 8 + 9
  100 = 12 - 3 - 4 + 5 - 6 + 7 + 89
  100 = 123 + 4 - 5 + 67 - 89
  100 = 123 + 45 - 67 + 8 - 9
  100 = 123 - 4 - 5 - 6 - 7 + 8 - 9
  100 = 123 - 45 - 67 + 89
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
