---
layout: post
title: "Overkill VI: The Rust and the Overkill"
author: "Dave Jacoby"
date: "2020-03-09 22:08:34 -0400"
categories: ""
---

[OK, let's do this one last time.](https://jacoby.github.io/2019/07/12/the-last-overkill.html) This is a logic problem from my son's math homework from middle school, which of course, I felt the need to write a brute force solver. I've done it in Perl, Raku, Python, Ruby, Javascript, C, and Go.

My first-pass code used loops and recursion to fill the nine spots in the Magic Box, but I was shown the magic of permutation in a suggestion to speed up my Raku code.

Last year, I played some with [Rust](https://www.rust-lang.org/), but got confused with how to pass arrays I wanted to modify. A part of my new organization is involved in an ongoing discussion for the next language to build our stuff on, and this is largely a Rust-vs-Go thing, and I hadn't gotten past "Hello World" for Rust, so I decided to move forward.

One of the first things that I did was find a `permute` library. Permuting `A,B,C` would get you `A,B,C`, `A,C,B`, `B,A,C`, `B,C,A`, `C,A,B` and `C,B,A`. Giving it `3..11` gives us every variation we would want. Except, of course, that `permute` gives us an `iterator`, not `array`, so we have to pull from the `iterator` and place them into a mutable array, and then test from there.

It's not _great_ Rust, but it does the thing. I've done a Rust!

```rust
use permute::permutations_of;

fn main() {
    // the basics of this: the numbers between 3 and 11
    let   numbers: [i32;9]  = [3,4,5,6,7,8,9,10,11];

    // permutations_of gives all the variations of 
    // that array, in an iterator form
    for p in permutations_of( &numbers ) {
        // a blank second array to shove this in
        let mut arr2: [i32;9] = [0,0,0, 0,0,0, 0,0,0] ;

        // for each entry in the permutations iterator,
        // dereference and put into the array.
        let mut i = 0;
        for e in p {
            arr2[i] = *e ;
            i = i + 1;
        }
        // and we test
        check_magic_box(arr2);
    }
}

fn check_magic_box( array: [i32;9] ) -> bool {
    let sum = 21;

    // the rows
    if sum != array[0] + array[1] + array[2] { return false }
    if sum != array[3] + array[4] + array[5] { return false }
    if sum != array[6] + array[7] + array[8] { return false }

    // the columns
    if sum != array[0] + array[3] + array[6] { return false }
    if sum != array[1] + array[4] + array[7] { return false }
    if sum != array[2] + array[5] + array[8] { return false }

    // the diagonals
    if sum != array[0] + array[4] + array[8] { return false }
    if sum != array[2] + array[4] + array[6] { return false }

    // display correct magic box
    for x in 0..3 {
        for y in 0..3 {
            let i = ( x * 3 ) + y;
            let j = array[i];
            print!("\t{}",j)
        }
        println!("");
    }
    println!("");
    true
}
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io)
