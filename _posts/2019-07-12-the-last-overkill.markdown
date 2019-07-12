---
layout: post
title: "The Last Overkill?"
author: "Dave Jacoby"
date: "2019-07-12 10:00:56 -0400"
categories: ""
---

[I've hit this before](https://jacoby.github.io/2019/04/18/overkill-iv-superset-of-kill.html), so follow that link to understand the problem. More or less, it's my comparative languages test-bed.

Years ago, I tried in Perl 6, and got low numbers. My machine is better, [Rakudo is better](https://github.com/tadzik/rakudobrew), but that code still lags. I was pointed to [permutations](https://docs.perl6.org/routine/permutations).

First, the concept: If you have `1,2,3`, they could be put together in six ways: `123`, `132`, `213`, `231`, `312`, and `321`. Seeing as we're dealing with the numbers 3-11, getting those possible choices without doubling a number was the big part.

> **Infomercial Voice: There _has_ to be a better way!**

Perl 5 is [Algorithm::Permute](https://metacpan.org/pod/Algorithm::Permute) for a solid, full-featured way to do it, but the reason I write this stuff is to learn and be a better programmer, so how do I do permutations?

I found out from [Stack Overflow](https://stackoverflow.com/a/55568922/).

```javascript
function permute(arr) {
  if (arr.length == 1) return arr;

  let res = arr
    .map((d, i) =>
      permute([...arr.slice(0, i), ...arr.slice(i + 1)]).map(v =>
        [d, v].join("")
      )
    )
    .flat();

  return res;
}

console.log(permute([1, 2, 3, 4]));
```

The line starting `let res=` is the part that got me. If I just get one thing, return it? I get that. I had to rewrite it as a `for` loop to get the syntax. `[...arr.slice(0, i),...arr.slice(i + 1)]` is just `arr` without `arr[i]`. Back to `1,2,3`, we're holding on to `1` and running `permute([2,3])`, and then appending `1` to the start of everything it gets in the result.

(`.flat()` is a new one on me. It turns `[1,[2,3]]` into `[1,2,3]`, and while interesting, isn't too germane to the problem at hand.)

So, recursion is certainly a thing we can do in Perl, right:

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

use List::Util qw{sum};

my $numbers = [ 3 .. 11 ];
my $i->@*   = permute_array($numbers);
for my $j ( $i->@* ) {
    display_box($j) if check_mb($j);
}

exit;

sub display_box ( $array ) {
    for my $i ( map { $_ * 3 } 0 .. 2 ) {
        for my $j ( map { $_ + $i } 0 .. 2 ) {
            printf '%4d', $array->[$j];
        }
        say '';
    }
    say '';
}

sub check_mb($arr) {
    return 0 unless 21 == sum map { $arr->[$_] } 0 .. 2;              #row1
    return 0 unless 21 == sum map { $arr->[ $_ + 3 ] } 0 .. 2;        #row2
    return 0 unless 21 == sum map { $arr->[ $_ + 6 ] } 0 .. 2;        #row3
    return 0 unless 21 == sum map { $arr->[ $_ * 3 ] } 0 .. 2;        #col1
    return 0 unless 21 == sum map { $arr->[ $_ * 3 + 1 ] } 0 .. 2;    #col2
    return 0 unless 21 == sum map { $arr->[ $_ * 3 + 2 ] } 0 .. 2;    #col3
    return 0 unless 21 == sum map { $arr->[ $_ * 4 ] } 0 .. 2;        #diag 1
    return 0 unless 21 == sum map { $arr->[ $_ * 2 + 2 ] } 0 .. 2;    #diag 2
    return 1;
}

sub permute_array ( $array ) {
    return $array if scalar $array->@* == 1;
    my @response = map {
        my $i        = $_;
        my $d        = $array->[$i];
        my $copy->@* = $array->@*;
        splice $copy->@*, $i, 1;
        my @out = map { unshift $_->@*, $d; $_ } permute_array($copy);
        @out
    } 0 .. scalar $array->@* - 1;
    return @response;
}

#    4   9   8
#   11   7   3
#    6   5  10

#    4  11   6
#    9   7   5
#    8   3  10

#    6   5  10
#   11   7   3
#    4   9   8

#    6  11   4
#    5   7   9
#   10   3   8

#    8   3  10
#    9   7   5
#    4  11   6

#    8   9   4
#    3   7  11
#   10   5   6

#   10   3   8
#    5   7   9
#    6  11   4

#   10   5   6
#    3   7  11
#    8   9   4
```

You may notice that I rewrote all the tests. Gone is `Are all the numbers there?` because with permutations, we're guaranteed that. I redid all the tests as variations on `return 0 unless 21 == sum map { ARRAY MAGIC } 0 .. 2`. I have dreams of making it tighter, but I don't have a plan yet.

And yes, I could redo `display_box` as a heredoc.

The old code took 1m20s on the old computer and 14s on the new, so I'm much happier with this computer (normally), but this new code runs in 2.4s here. Recursion FTW!

I don't wanna rewrite a recursive `magicbox.cc` tho.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
