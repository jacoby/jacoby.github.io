---
layout: post
title: "Javascript Array(): WAT?"
author: "Dave Jacoby"
date: "2019-03-14 13:55:49 -0400"
categories: ""
---

This start with me trying to get something like a `range()` function in Javascript. Perl, my language of choice, allows me to create an array with `my @hedgehog = 0..4`, giving me `0,1,2,3,4` as an array.

The _long_ way is with a `for` loop:

```javascript
function range(min, max) {
  let x = [];
  for (let i = min; i <= max; i++) {
    x.push(i);
  }
  return x;
}
```

And if you like recursion, [Jason Yu on Dev.to has you covered](https://dev.to/ycmjason/how-to-create-range-in-javascript-539i):

```javascript
function range(start, end) {
  if(start === end) return [start];
  return [start, ...range(start + 1, end)];
}
```

Knowing this, I started to think that there _must_ be a way to do something like this with [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions).

If we already have an array, we can reset it to a range starting with zero easily:

```javascript
let hedgehog = [12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29];
let shrews = hedgehogs.map((n,i)=>i);
// [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]
```

So, I start thinking that we can create arrays of specific sizes, like `Array(5)`, so what if we make an array of nulls and `map` that into a range?

```javascript
hedgehogs = Array(5);
shrews = hedgehogs.map((n,i)=>i);
console.log(JSON.stringify(shrews));
console.log(JSON.stringify(hedgehogs));
// [null,null,null,null,null]
// [null,null,null,null,null]
```

So, _that's_ a thing.

But what thing _is_ it?

[`map` calls a provided `callback` function **once for each element** in an array, in order, and constructs a new array from the results. `callback` is invoked only for indexes of the array which have assigned values, including _undefined_. It is \*not\*\* called for missing elements of the array (that is, indexes that have never been set, which have been deleted or which have never been assigned a value).](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) (Emphasis Mozilla)

So, `Array(5)` is an array of nulls that are not just nulls, but **never been set** nulls, which `map` will not touch. What to do, what to do...

Fill them.

`fill` them.

```javascript
hedgehogs = Array(5);
shrews = hedgehogs.fill().map((n,i)=>i);
console.log(JSON.stringify(shrews));
console.log(JSON.stringify(hedgehogs));
// [0,1,2,3,4]
// [null,null,null,null,null]
```

I get the default behavior. You can create a big but sparse array and then `map` over the few elements in it. Why go someplace where there's no data?

```javascript
hedgehogs = Array(5);
hedgehogs[2] = 1;
hedgehogs[4] = 2;
hedgehogs.map((n,i)=>{ console.log([i,n].join("|"))})
// 2|1
// 4|2
```

But it isn't the behavior I expected.

And, while I normally use arrow functions within `map` and `filter`, you don't have to.

```javascript
const range3 = (n, i) => i;
hedgehogs = Array(5);
shrews = hedgehogs.fill().map(range3);
console.log(JSON.stringify(shrews));
console.log(JSON.stringify(hedgehogs));
console.log(range3(1,4)) // because they aren't just for arrays
// [0,1,2,3,4]
// [null,null,null,null,null]
// 4
```

The next step is to make a way to set the first value before creating. But not today.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
