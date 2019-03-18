---
layout: post
title: "More fun with Javascript Arrays: reimplementing Uniq"
author: "Dave Jacoby"
date: "2019-03-18 10:33:34 -0400"
categories: ""
---

Let us start with the Unix command `uniq`, which, given a sorted list of numbers, gives us the unique values:

```bash
$ perl -e 'for ( 0..20 ) { print int rand 10 ; print "\n" }'| sort | uniq
0
1
2
3
5
6
7
8
9
```

However, if you do not sort initially, `uniq` just removes adjacent replicates:

```bash
$ perl -e 'for ( 0..20 ) { print int rand 10 ; print "\n" }'|uniq
0
9
1
2
0
7
8
1
4
9
0
1
2
6
0
7
0
6
5
6
8
```

This is why all the cool kids know that `sort` has a `-u` flag to allow you to do `sort` and `uniq` in one command, in blatant violation of [the Unix Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy).

```bash
$ perl -e 'for ( 0..20 ) { print int rand 10 ; print "\n" }'| sort -u
0
2
3
5
6
7
8
9
```

Looking at the `bash` examples above (or just knowing me), you can tell I am a Perl user, and there are a few ways of handing unique values in Perl. The simplest is by using a hash to digest things.

```perl
my $hedgehogs->@* = map { int rand 10 } 0..9;
my $hash->%* = map { $_ => 1 } $hedgehogs->@*;
my $shrews->@* = keys $hash->%* ;

say join ',', $hedgehogs->@*;
say join ',', $shrews->@*;

# 5,4,7,4,2,5,2,4,6,2
# 2,7,4,6,5
```

There are two things to notice about hash order, though. Hash order is not sorted. Hash order is not the same as use order, which would be, in this case, `5,4,7,2,6`. You might not care, but it might be significant.

There _is_ an easy way. Notice that "easy" is not necessarily "simple":

```perl
use List::Util qw{ uniqnum };

my $hedgehogs->@* = map { int rand 10 } 0..9;
my $shrews->@* = uniqnum $hedgehogs->@*;

say join ',', $hedgehogs->@*;
say join ',', $shrews->@*;

# 8,4,2,9,5,9,2,3,2,2
# 8,4,2,9,5,3
```

`uniq` and `uniqnum` come with [`List::Util`](https://metacpan.org/pod/List::Util), which is in Core, which, unless your OS has a broken-by-default Perl installation, you have it.

I mentioned a lot of this to contrast Javascript, which does not have `uniq` but does have `filter`, which is _very_ useful and can be made to function this way.

`filter` is a function that passes the value if the function returns `1` and blocks it otherwise.

```javascript
let hedgehogs = Array(10)
  .fill()
  .map(x => Math.floor(10 * Math.random()));
let shrews = hedgehogs.filter(
  (value, index, self) => self.indexOf(value) == index
);

console.log(hedgehogs.join(","));
console.log(shrews.join(","));

// 3,9,4,9,9,8,7,8,9,9
// 3,9,4,8,7
```

Two things to know here:

- `filter`, like `map`, is passed three values; the value of the position in the array, the index of the position of the array, and the array itself.
- Javascript has `indexOf`, which, given an array and value, tells you the first place that value shows up.

In the above example, with the first `9`:

- `filter` is passed `(9, 1, [3,9,4,9,9,8,7,8,9,9])`
- `value` is `9`, `index` = `1`
- `[3,9,4,9,9,8,7,8,9,9].indexOf(9)` is `1`
- `1` equals `1`
- return `true`

But the second `9`:

- `filter` is passed `(9, 3, [3,9,4,9,9,8,7,8,9,9])`
- `value` is `9`, `index` = `3`
- `[3,9,4,9,9,8,7,8,9,9].indexOf(9)` is `1`
- `1` doesn't equal `3`
- return `false`

This, as you can see, preserves order. If 3 came first, it gets handled and passed first.

You might wonder how the `uniq` in Perl's `List::Util` handles it. Honestly, I don't know. I know that `List::Util` uses XS, Perl's way of leveraging C for speed, and [I can link to the XS in the repo](https://github.com/Dual-Life/Scalar-List-Utils/blob/master/ListUtil.xs), but I don't deal with it at all, so I cannot understand XS code yet.

Perl uses `grep` instead of `filter`, but and with a bit of work, like `use feature qw{ say state }`, you can make a filter like this:

```perl
my $hedgehogs->@* = map { int rand 10 } 0..9;
$shrews->@* = grep
    { state $x = {} ; $x->{$_}++ ; $x->{$_} == 1 }
    $hedgehogs->@*;
```

Here we use an internal hash to save the values, and instead of running `keys` on that, we iterate `$x->{value}` and if it equals 1, we let it pass.

Could we use an `indexOf` method to make a more Javascripty `grep` function? Certainly, because [`https://metacpan.org/pod/List::MoreUtils`(https://metacpan.org/pod/List::MoreUtils) has `first_index`, and also `uniq`, and is not in Core, so it's a lot of added complexity for no added ease of use.

Side note on `sort` in JS: `let shrews = hedgehogs.sort()` has an interesting side effect, in that `.sort()` acts on `hedgehogs`, not on the output being passed to `shrews`. So:

```javascript
let hedgehogs = Array(10)
  .fill()
  .map(x => Math.floor(10 * Math.random()));
let shrews = hedgehogs.sort();

console.log(hedgehogs.join(","));
console.log(shrews.join(","));

// 0,0,2,3,3,4,6,7,8,8
// 0,0,2,3,3,4,6,7,8,8
```

Clearly, we didn't want that. How to handle this? Two ways. Either sort `shrews` after the assignment, or use `map` to distance `sort` from `hedgehogs`.

```javascript
let hedgehogs = Array(10)
  .fill()
  .map(x => Math.floor(10 * Math.random()));
let shrews = hedgehogs.map(x => x).sort();

console.log(hedgehogs.join(","));
console.log(shrews.join(","));

// 6,5,7,8,5,1,3,2,6,0
// 0,1,2,3,5,5,6,6,7,8
```

(I kinda wanted to make that `map(a=>a)` as [a deep-cut Steve Ditko reference](https://en.wikipedia.org/wiki/Mr._A), but Perl's `sort` has burned the desire to use `a` and `b` as variable names right out of me.)

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
