---
layout: post
title: "Rotate Your Matrix and String Your Vowels"
author: "Dave Jacoby"
date: "2020-03-23 19:44:54 -0400"
categories: ""
---

### Task 1 - Rotate Matrix

> Write a script to rotate the followin matrix by given 90/180/270 degrees clockwise.
>
> `[ 1, 2, 3 ]`<br>
> `[ 4, 5, 6 ]`<br>
> `[ 7, 8, 9 ]`
>
> For example, if you rotate by 90 degrees then expected result should be like below
>
> `[ 7, 4, 1 ]`<br>
> `[ 8, 5, 2 ]`<br>
> `[ 9, 6, 3 ]`

So, you need functions for `rotate_90`, `rotate_180` and `rotate_270`, and the thing that you might not think of is that `rotate_180` can simply call `rotate_90` twice, but I felt bound to code the other functions, but using that to check my work.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental::postderef experimental::signatures };

use JSON;
my $json = JSON->new;

my $array = [ [ 1 .. 3 ], [ 4 .. 6 ], [ 7 .. 9 ] ];

my $a90   = rotate_90($array);
my $a180a = rotate_90($a90);
my $a270a = rotate_90($a180a);
my $a360a = rotate_90($a270a);

my $a180b = rotate_180($array);
my $a270b = rotate_270($array);

say $json->encode($array);
say '';
say $json->encode($a90);
say '';
say $json->encode($a180a);
say $json->encode($a180b);
say '';
say $json->encode($a270a);
say $json->encode($a270b);
say '';
say $json->encode($a360a);

sub rotate_90( $array ) {
    my $x      = -1 + scalar $array->@*;
    my $y      = -1 + scalar $array->[0]->@*;
    my $output = [];
    for my $i ( 0 .. $x ) {
        my $jj = $i;
        for my $j ( 0 .. $y ) {
            my $ii = $y - $j;
            $output->[$i][$j] = int $array->[$ii][$jj];
        }
    }
    return $output;
}

sub rotate_180( $array ) {
    my $x      = -1 + scalar $array->@*;
    my $y      = -1 + scalar $array->[0]->@*;
    my $output = [];
    for my $i ( 0 .. $x ) {
        my $jj = $x - $i;
        for my $j ( 0 .. $y ) {
            my $ii = $y - $j;
            $output->[$i][$j] = int $array->[$ii][$jj];
        }
    }
    return $output;
}

sub rotate_270($array) {
    my $x      = -1 + scalar $array->@*;
    my $y      = -1 + scalar $array->[0]->@*;
    my $output = [];
    for my $i ( 0 .. $x ) {
        my $jj = $x - $i;
        for my $j ( 0 .. $y ) {
            my $ii = $j;
            $output->[$i][$j] = int $array->[$ii][$jj];
        }
    }
    return $output;
}
```

### TASK #2 - Vowel Strings

> Write a script to accept an integer 1 <= N <= 5 that would print all possible strings of size N formed by using only vowels (a, e, i, o, u).
>
> The string should follow the following rules:
>
> ‘a’ can only be followed by ‘e’ and ‘i’.
>
> ‘e’ can only be followed by ‘i’.
>
> ‘i’ can only be followed by ‘a’, ‘e’, ‘o’, and ‘u’.
>
> ‘o’ can only be followed by ‘a’ and ‘u’.
>
> ‘u’ can only be followed by ‘o’ and ‘e’.
>
> For example, if the given integer N = 2 then script should print the following strings:
>
> **ae**<br>
> **ai**<br>
> **ei**<br>
> **ia**<br>
> **io**<br>
> **iu**<br>
> **ie**<br>
> **oa**<br>
> **ou**<br>
> **uo**<br>
> **ue**

To me, this struck me as an obviously-recursive problem.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental::postderef experimental::signatures };

my $l = 2;
if ( scalar @ARGV && int $ARGV[0] > 0 ) { $l = int $ARGV[0] }

my @strings = vowel_strings($l);
say join "\n", @strings;

sub vowel_strings ( $l, $string = '' ) {
    if ( length $string == $l ) {
        return $string;
    }
    my @next;
    my $m = length $string == 0 ? '' : substr $string, -1;
    if ( $string eq '' ) {
        @next = qw{ a e i o u};
    }
    elsif ( $m eq 'a' ) {
        @next = qw{ e i };
    }
    elsif ( $m eq 'e' ) {
        @next = qw{ i };
    }
    elsif ( $m eq 'i' ) {
        @next = qw{ a o u e };
    }
    elsif ( $m eq 'o' ) {
        @next = qw{ a u };
    }
    elsif ( $m eq 'u' ) {
        @next = qw{ o e };
    }

    my @output;
    for my $n (@next) {
        push @output, vowel_strings( $l, $string . $n );
    }
    return @output;

}
```

Here we pass back the values, in case we might want to do anything else with them. In the other versions I tried, I just printed and returned.

By others, I mean Node ...

```javascript
#!/usr/bin/env node

vowel_strings(2);

function vowel_strings(max_len, str = "") {
  if (str.length === max_len) {
    console.log(str);
    return;
  }
  var next = [];
  var last = "";

  if (str.length > 0) {
    last = str.substring(-1, 1);
  }

  if (str === "") {
    next = ["a", "e", "i", "o", "u"];
  } else if (last === "a") {
    next = ["e", "i"];
  } else if (last === "e") {
    next = ["i"];
  } else if (last === "i") {
    next = ["a", "e", "o", "u"];
  } else if (last === "o") {
    next = ["a", "u"];
  } else if (last === "u") {
    next = ["e", "o"];
  }

  const iter = next.values();
  for (const i of iter) {
    vowel_strings(max_len, str + i);
  }
}
```

... and Rust ...

```rust
fn main() {
    let my_str = "".to_string();
    vowel_strings(2,my_str);
}

fn vowel_strings ( max_len:i32 , my_str:String) -> bool {
    let rts_ym : String = my_str.chars().rev().collect();
    let my_len = my_str.len();
    let mut last = "";
    let mut vnext : Vec<String> = Vec::new();

    if  max_len as usize == my_len {
        println!("{}",my_str);
        return true
    }

    if my_len > 0 {
        last = &rts_ym[0..1];
    }

    if  last == "a" {
        vnext.push("e".to_string());
        vnext.push("i".to_string());
    } else if last == "e" {
        vnext.push("i".to_string());
    } else if last == "i" {
        vnext.push("a".to_string());
        vnext.push("e".to_string());
        vnext.push("o".to_string());
        vnext.push("u".to_string());
    } else if last == "o" {
        vnext.push("a".to_string());
        vnext.push("o".to_string());
    } else if last == "u" {
        vnext.push("e".to_string());
        vnext.push("o".to_string());
    } else {
        vnext.push("a".to_string());
        vnext.push("e".to_string());
        vnext.push("i".to_string());
        vnext.push("o".to_string());
        vnext.push("u".to_string());
    }

    for next in &vnext {
        let next_str = format!("{}{}",my_str,next);
        vowel_strings(max_len,next_str);
    }
    true
}
```

The novel thing for this version is that Perl and other dynamic languages have arrays that give you all the features of any collection of values that Computer Science has thought of, but Rust separates these things, and the one that gives us `push` and `pop` is the `Vector`. More importantly, `Array`s are of static size, but you can dynamically resize `Vector`s, so you can use `["e","i"]` when the letter is `"a"` and all the vowels -- `["a","e","i","o","u"]` -- when the string is empty.

_(Granted, there's nothing here that disallows starting with several consonants, but I believe my code would take `"CVD"` and treat it like `""` for purposes of this challenge.)_

There's also the difference between `str` and `String` types, which I'm not 100% on why you'd use one or the other. I _think_ that I used `String` because it allowed me to use `my_str.chars().rev().collect()` to reverse the string so I could do `&rts_ym[0..1]` to get the last character, rather than try to make something like `my_str[my_str.len()-1..my_str.len()]` work.

I suppose that I will have to remember that, roughly, `printf : println :: sprintf : format` for those who remember SAT questions.

I can't say it's _good_ Rust, but it does the work.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
