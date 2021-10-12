---
layout: post
title: "Weekly Challenge #134 Addendum: JS and Python"
author: "Dave Jacoby"
date: "2021-10-12 13:36:19 -0400"
categories: ""
---

I do most of my solving for The Weekly Challenge in Perl. It comes from the Perl Community, as do I, and that and Roku (which _also_ comes from the Perl Community, but is not Perl) are the primary languages used for it.

[In my (most correct) challenge code](https://jacoby.github.io/2021/10/11/there-are-wrong-ways-to-skin-a-cat-the-weekly-challenge-134.html), I pull some shinanigans by passing an arrayref which holds the Pandigital numbers. Every new time the `_pandigital_2` function is called, everyone can access it, so that every instance can know that we have our five and we can shut it down.

If I had done that with normal recursion, with each instance holding a list of Pandigital numbers that had been found so far, I'm not exactly sure how many would be done before the `return if scalar @array > 4` gets triggered. I'm figuring six:

```text
    ... 6 -> 7 -> 8 -> 9 (1 - 1023456789 )
               -> 9 -> 8 (2 - 1023456798 )
             8 -> 7 -> 9 (3 - 1023456879 )
               -> 9 -> 7 (4 - 1023456897 )
             9 -> 7 -> 8 (5 - 1023456089 )
               -> 8 -> 7 (6 - 1023456987 )
```

Then it goes back, that function iterates to 7, bringing along the array, then returning because then it would be carrying around a big enough list to trigger the above if statement.

(I admit, my first thought was binary trees, which this is _not_, and being unsure if it was 8 or 16 before the functions knew enough to return.)

It is that mechanism, and not wanting to make a global, that brought out the `pandigital_2` and `_pandigital_2` functions. I don't think that Python and JS supported those shenanigans, so I just went with the globals. I mean, I don't _like_ globals, but I also don't like collecting thousands of answers when I just want five.

### Python

I did Python first, because I've been looking at Python a lot recently. I've always thought it was close enough to my normal languages that I'd be able to work with it if necessary, but there are differences. Because I'm trying to teach myself, it's _much_ more commented than I normally would, and it's probably embarassingly juvenile Python for those who spend time with it.

Some things I'm seeing:

* Despite what I wrote above, I repeat the `pandigital_2` and `_pandigital_2` jazz because I was in tunnelvision about recreating my Perl code. I could easily put the display code into `main` and tightened things up by one function.
* I do create an array and pass it when I could've passed an anonymous array. Or in this context, list? Anyway, `_pandigital(["1"])` strikes me as a better way to do it.
* Or, I should create an empty array with something like `def pandigital(state=[]):`, which I _think_ is valid? I'm relying on a lot of domain knowledge by not starting with `0`, and getting it to start with `0123456789`, then converting to integer and checking for the zero, which disappeared on conversion. But that's a _lot_ of recursion I don't do, so eh? As well as converting my `_is_pandigital` code to Python.
* I use `str(n)` a lot, and I'm thinking that I might do `strn = str(n)` instead. I'm not personally sure if that counts as slop or not.

```python
#!/usr/bin/env python3

# would want to pass an array reference, but 
# haven't found how you can do that in Python.
# It might not be possible.
output=[]

def main():
    pandigital()

def pandigital():
    # because we see 0123 as 123, we cannot start
    # with 0, so we force the issue by starting with 
    # one
    state=["1"]
    _pandigital(state)
    for o in output:
        print( o )

def _pandigital(state):
    # we're dumping to a global array 
    # so we can know when we've hit five
    # and can just bail
    if len(output)>4:
        return
    # if length is 10, we've used all the
    # digits and can convert the array of
    # digits into a number and append that
    # to output
    if len(state)==10:
        pandigital = int("".join(list(state)))
        output.append(pandigital)
        return
    # dicts are like hashes and useful to 
    # keep you from using the same thing twice
    # (asterisk)
    mydict = {}
    numbers = []
    # thing is, join wants a string, so we have
    # to always treat the digits as strings, and
    # so we must cast to string before adding to
    # the dictionary
    for n in state:
        mydict[str(n)] = 1
    # and also here, so we know that once we've
    # used 0, we don't use it again
    for n in range(10):
        if str(n) not in mydict:
            numbers.append(str(n))
    # and here, we copy the current state array,
    # append what numbers we have, and recurse
    for n in numbers:
        newstate = state.copy()
        newstate.append(n)
        _pandigital(newstate)
    return 

if __name__ == '__main__':
    main()
```

### Javascript

This is something I'm much more familiar with, but there were some hitches. For one, I accidently put the `for (let i in numbers) {...}` loop inside the `for (let i in range) { ... }` loop, so there was a lot of duplicates until I figured that out.

In working around that problem, I found out about `array.indexOf(value)` as a way to figure out if that value is in the array already, so **win.** Even if I don't actually need it, now that I've fixed that problem, it's a thing I know and will use later.

Meanwhile, if I want a list of digits from `0` to `9`, I know how to get it in Perl. Simply `0..9`. For Python, it's `range(10)`. 

In Javascript, it's a lot:

```javascript
let range = Array(10)   // an array with ten empty spots
    .fill()             // now filled with nothing, 
                        // so the next thing can see it
    .map( (n,i) => i ); // Arrow functions! here, n is the
                        // value in the bucket, which we 
                        // do not care about. i is the index
                        // of the bucket, which we DO care
                        // about, and then put into the bucket.
```

It's simple and adjustable, but it's odd enough and rarely used enough that I have to look it up every time I want to use it. It would seem to me that the language _should_ have a built-in range operator. And thinking things through, where I use that, it could just as easily use the filled empty array:

```javascript
  for (let i in range) {
    // i is the index here. range[i] would be the value
    // but as discussed, range[i] IS i
    if (digits[i] === undefined) {
      numbers.push(i);
    }
  }
```

I've done enough with filters to start thinking that `let numbers = range.filter( (i) => state.indexOf(i) === undefined )` should do it. Be warned that I've conjectured that but haven't tested it.

Anyway, here's my Pandigital Node code.

```javascript
"use strict;";

let output = [];
pandigital(["1"]);
for (i in output) {
  console.log(["", output[i]].join("\t"));
}

function pandigital(state) {
  let digits = {};
  let numbers = [];
  // we have the first five, we're done
  if (output.length > 4) {
    return;
  }
  // there was some duplicate issues, so we use
  // indexOf to see if that value is in the array
  // already
  if (state.length == 10) {
    let pandigit = state.join("");
    if (output.indexOf(pandigit) === -1) {
      output.push(pandigit);
      return;
    }
  }
  // I think I would normally prefer if
  // for ( i in array ) would give me the value
  // within the array not the index, but there
  // are enough times that I want just that, so
  // I don't need that change
  for (let i in state) {
    let n = state[i];
    digits[n] = 1;
  }
  // the long way around getting a range
  let range = Array(10)
    .fill()
    .map((n, i) => i);
  // yes, I could've probably written a filter,
  // but this is understandable
  for (let i in range) {
    if (digits[i] === undefined) {
      numbers.push(i);
    }
  }
  // the duplicates issue was related to
  // losing track of the parens, so that
  // this loop was inside the range loop
  // above, but it works and I've featured
  // the cool indexOf method, so I'll let
  // the belt-and-suspenders solution stand.
  for (let i in numbers) {
    let n = numbers[i];
    let newstate = [...state];
    newstate.push(n);
    pandigital(newstate);
  }
}
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
