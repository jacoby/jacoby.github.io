---
layout: post
title: "Turning Over A New Digit: Perl Weekly Challenge #100"
author: "Dave Jacoby"
date: "2021-02-16 17:08:48 -0500"
categories: ""
---

### Pun on Cent Meaning One Hundred, or Something

Within the repo, we've actually jumped from `challenge-099` to `challenge-100`. The requisite zero-padding was already there.

I mean, mentally, I'm opening up the bubbly and shooting off the fireworks! _Whoo-Hooo!!!_

### TASK #1 › Fun Time

> Submitted by: Mohammad S Anwar  
> You are given a time (12 hour / 24 hour).
>
> Write a script to convert the given time from 12 hour format to 24 hour format and vice versa.
>
> Ideally we expect a one-liner.

Um, _no_.

I mean, I _like_ using my bash prompt to combine all sorts of things like `grep` and `sort` and `uniq` and all sorts of other things to make one-off "programs", and I use `sed` and `awk` enough to know their value — but _not_ enough to remember which is which without using a search engine — and I _do_ get how `perl` is a more powerful way to do what `sed` and `awk` do, but I don't like Perl one-liners.

It smells of Golf.

I _get_ that you _can_ measure the "power" of a programming language by what it can do divided by the small number of characters it takes to do it, but I hate Golf.

I hate Golf because it encourages solutions nobody can understand and discourages code reuse.

I hate Golf because it encourages seeing the Wizard mentality: "That _looks_ hard, so it _must_ be the highest form of programming" instead of "That's only there to discourage other developers, maybe for job security and maybe for good old-fashioned gatekeeping",

I hate Golf because the culture behind it keeps my language community small when we all _say_ we want it to grow.

I code this and I blog this in part to touch things in Perl that I hardly touch otherwise, to expand my abilities and keep older skills from getting rusty, and also to allow people who [haven't had several iterations of my few years of experience](https://twitter.com/shanselman/status/1001495109836226560) to see and learn from the things I write. There's certain amounts of clever that is good, but "let's make it a one-liner", to me, is antithetical to my purposes. If that isn't you, that's fine.

So, the problem.

`7:27 am` is a simple conversion. Drop the `am` and zero-pad the hour and you get `07:27`.

`7:27 pm` is a just slightly harder conversion. Drop the `pm`, add 12 to and zero-pad and you get `19:27`.

Now reversing, we have `07:27`. The hour is less than 12, so it's am, which we can easily concatenate to the end and get `07:27am`.

With `1927`, we use test the hour for greater-than 12 and modulus 12, so that becomes `07:27pm`.

`sprintf` and `split` and maybe regular expressions are crucial to break it into pieces.

If I was to become the God Emperor of Time, I would (of course) get rid of Daylight Saving Time, but the other thing would be to align Noon/Midnight to 1, not 12, because Noon-to-1pm is PM and Midnight to 1am is AM, so it's 12am, 1am, 2am ... 11am, 12pm, 1pm, 2pm ... 11pm, 12am. It makes no sense.

And dealing with that idiot decision with understandable code, code that doesn't look like it'll fall apart after one pass with `perltidy`, is the kind of thing that keeps the next developer from wanting to maim you.

#### Show Me The Code

I copied and pasted an older version of the boilerplate. It isn't the version I normally use, but it _is_ the one I put into GitHub. [Sue me if I play too long](https://genius.com/7511903).

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental::postderef experimental::signatures };

# You are given a time (12 hour / 24 hour).
#
# Write a script to convert the given time from 12 hour format to 24 hour format and vice versa.
#
# Ideally we expect a one-liner.

my @times =
    sort { $b =~ /m/ <=> $a =~ /m/ }
    sort

    (
    '5:14',  '05:15 pm', '05:15pm', '05:15 am', '05:15am', '17:15',
    '19:15', '07:15 pm', '07:15pm', '12:00am',  '12:00pm', '00:00',
    '12:00', '24:00',    '7:7am',   '7:7pm'
    );

for my $time (@times) {
    say join "\t", '', $time, ' <=> ', switch_time($time);
    say '';
}

# 12pm is noon
# 12am is midnight
sub switch_time ( $time ) {
    my $out = '';

    # 12-hour time
    if ( $time =~ /m$/mix ) {
        my ( $hr, $min, $ampm ) = $time =~ /(\d+):(\d+)\s*(am|pm|)/mix;
        $out = join ':',
            (
            $ampm eq 'am'
            ? (
                $hr == 0 ? '00': $hr
                )
            : (
                $hr == '12'
                ? sprintf '%02d',
                $min
                : sprintf '%02d',
                $hr + 12
            )
            ),
            ( sprintf '%02d', $min );
    }

    # 24-hour time
    else {
        my ( $hr, $min ) = $time =~ /(\d+):(\d+)/mix;
        $out = join '',
            (
            $hr == 0 || $hr == 24
            ? 12
            : ( $hr > 12 ? $hr % 12 : $hr )
            ),
            (':'),
            ( sprintf '%02d', $min ),
            ( $hr < 12 ? 'am' : 'pm' );
    }
    return $out;
}
```

```text
        05:15 am         <=>    05:15

        05:15 pm         <=>    17:15

        05:15am  <=>    05:15

        05:15pm  <=>    17:15

        07:15 pm         <=>    19:15

        07:15pm  <=>    19:15

        12:00am  <=>    12:00

        12:00pm  <=>    00:00

        7:7am    <=>    7:07

        7:7pm    <=>    19:07

        00:00    <=>    12:00am

        12:00    <=>    12:00pm

        17:15    <=>    5:15pm

        19:15    <=>    7:15pm

        24:00    <=>    12:00pm

        5:14     <=>    5:14am
```

### TASK #2 › Triangle Sum

> Submitted by: Mohammad S Anwar  
> You are given triangle array.
>
> Write a script to find the minimum path sum from top to bottom.
>
> When you are on index `i` on the current row then you may move to either index `i` or index `i + 1` on the next row.

I thought about pulling out my Node code to make a tree out of this, but then I realized that, unlike proper trees, I can do everything I need with a multidimensional array.

```text
[ [1], [2,4], [6,4,9], [5,1,7,2] ]
      1
     / \
    2   4
   / \ / \
  6   4   9
 / \ / \ / \
5   1   7   2
```

Say we're at a value, indexed `x` and `y`. We need to step into the next level, and there are two ways forward. `triangle( index, x+1, y )` and `triangle( index, x+1, y+1 )`.

I mean, a full Moose OOP version _could_ be made. I just feel no need to make it myself.

So, let's take a trip on that not-a-tree, just doing `[ [1], [2,4]]`.

- `x=0, y=0, path=[]`. `index[x][y]` is defined, so we push `1` onto `path`, then ...
  - `x=1, y=0, path=[1]`. `index[x][y]` is defined, so we push `2` onto `path`, then ...
    - `x=2, y=0, path=[1,2]`. `index[x][y]` is not defined, so we return the sum of `path`, which is `3`
    - (and we do the same with `x=2, y=1`, which is an inelegance with my thinking, but is not actually a _problem_)
  - which gets stored here, which would be `[3,3]` at this point, and we handle ...
  - `x=1, y=1, path=[1]`. `index[x][y]` is defined, so we push `4` onto `path`, then ...
    - `x=2, y=0, path=[1,4]`. `index[x][y]` is not defined, so we return the sum of `path`, which is `5`
    - (and we do the same with `x=2, y=1`, which is an inelegance with my thinking, but is not actually a _problem_)
  - which gets stored here, which would be `[3,3,5,5]` at this point, and pass back
- and now have that array with four values, which we can numerically sort (because we don't _know_ that it's already sorted), shift the first value, and the minimum path sum is right there: `3`.

I mean seriously, if I had merch, t-shirts and stickers saying **"This Looks Like A Job For _RECURSION!!_"** would be the first things I'd sell.

In the above explanation, I just return the sum. I don't show the path. In the code below, I instead have `path` holding `y`, because that way `y` = `path[x]`, and `value` = `index[x][path[x]]`, and can easily `map` the values and use [List::Util::sum](https://metacpan.org/pod/List::Util#sum) to do the math.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental::postderef experimental::signatures };

use List::Util qw{sum};

my @input;
push @input, [ [1], [ 2, 4 ], [ 6, 4, 9 ], [ 5, 1, 7, 2 ] ];
push @input, [ [3], [ 3, 1 ], [ 5, 2, 3 ], [ 4, 3, 1, 3 ] ];

for my $input (@input) {
    triangle_sum($input);
}

sub triangle_sum ( $input ) {
    my ($short) =
        sort { $a->{sum} <=> $b->{sum} } triangle($input);
    say qq{ sum:  $short->{sum} };
    say q{ path: } . join ' ', $short->{path}->@*;
    for my $i ( $input->@* ) {
        say join ' ', '  ', $i->@*;
    }
    say '';
}

sub triangle ( $input, $x = 0, $y = 0, @path ) {
    my @output;

    # if not a leaf, go left and right
    if ( defined $input->[$x][$y] ) {
        push @output, triangle( $input, $x + 1, $y,     @path, $y );
        push @output, triangle( $input, $x + 1, $y + 1, @path, $y );
    }

    # if a leaf, find the sum, find the path, and return
    else {
        my @ind = map     { $path[$_] } 0 .. $x - 1;
        my $sum = sum map { $input->[$_][ $path[$_] ] } 0 .. $x - 1;
        push @output, { sum => $sum, path => \@ind, };
    }
    return @output;
}
```

```text
 sum:  8
 path: 0 0 1 1
   1
   2 4
   6 4 9
   5 1 7 2


 sum:  7
 path: 0 1 1 2
   3
   3 1
   5 2 3
   4 3 1 3
```

#### Show Me The Other Code

For reasons, I did that work on my old laptop. The one that still has Node on it. I haven't put it on the new one yet.

While I was there, I took the opportunity to reimplement in Node. I stuck with the simplified version I described, where instead of passing back each path and sum, I just pass back the sum.

Thinking through, returning just the lowest value at each call would simplify the output even more, removing the "need" for both `triangle` and `triangle_sum`. Ah well.

```javascript
"use strict";

var input = [];
input.push([[1], [2, 4], [6, 4, 9], [5, 1, 7, 2]]);
input.push([[3], [3, 1], [5, 2, 3], [4, 3, 1, 3]]);

for (let i = 0; i < input.length; i++) {
  triangle_sum(input[i]);
}

function triangle_sum(input) {
  let results = triangle(input, 0, 0, []).sort(function (a, b) {
    return a - b;
  });
  console.log(input);
  console.log(results[0]);
  console.log("");
}

function triangle(input, x, y, path) {
  if (x > 5) {
    return;
  }
  let output = [];

  if ("undefined" === typeof input[x]) {
    output.push(path.reduce((a, b) => a + b, 0));
  } else {
    let v = input[x][y];
    let next_path = [...path];
    next_path.push(v);

    output.push(...triangle(input, x + 1, y, next_path));
    output.push(...triangle(input, x + 1, y + 1, next_path));
  }
  return output;
}
```

```text
[ [ 1 ], [ 2, 4 ], [ 6, 4, 9 ], [ 5, 1, 7, 2 ] ]
8

[ [ 3 ], [ 3, 1 ], [ 5, 2, 3 ], [ 4, 3, 1, 3 ] ]
7
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
