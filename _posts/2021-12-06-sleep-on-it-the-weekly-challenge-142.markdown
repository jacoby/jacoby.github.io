---
layout: post
title: "Sleep On It: The Weekly Challenge #142"
author: "Dave Jacoby"
date: "2021-12-06 18:34:03 -0500"
categories: ""
---

Interesting tasks in [Challenge #143](https://theweeklychallenge.org/blog/perl-weekly-challenge-142/) Let's dive in.

### TASK #1 › Divisor Last Digit

> Submitted by: Mohammad S Anwar
>
> You are given positive integers, $m and $n.
>
> Write a script to find total count of divisors of $m having last digit $n.

The key, of course, is to go back to [#141](https://theweeklychallenge.org/blog/perl-weekly-challenge-141/) and get the divisor code. I used a `for` loop — I find them readable — but you can go functional and get all the divisors in one line: `my @divisors = grep { $i % $_ == 0 } 1..$i`

From there, it's another `grep`, testing if the last character is the same as the one we're looking for (`grep { $i % $_ == 0 } 1..$i`) then cast to `scalar` to get the count, which is what we're looking for.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say state postderef signatures };
no warnings qw{ experimental };

my @examples;
push @examples, [ 24, 2 ];
push @examples, [ 30, 5 ];

for my $e (@examples) {
    my ( $m, $n ) = $e->@*;
    my $o = divisor_last_digit( $m, $n );
    say <<"END";
    Input:  \$m = $m, \$n = $n
    Output: $o
END
}

sub divisor_last_digit ( $m, $n ) {
    my @divisors;
    for my $i ( 1 .. $m ) {
        if ( $m % $i == 0 ) {
            push @divisors, $i;
        }
    }
    return scalar grep { $n == substr $_, -1, 1 } @divisors;
}
```

```text
    Input:  $m = 24, $n = 2
    Output: 2

    Input:  $m = 30, $n = 5
    Output: 2
```

### TASK #2 › Sleep Sort

> Submitted by: Adam Russell
>
> Another joke sort similar to JortSort suggested by champion Adam Russell.
>
> You are given a list of numbers.
>
> Write a script to implement Sleep Sort. For more information, please checkout this post.

[Thanks, Adam!](https://twitter.com/adamcrussell) This is another joke algorithm, after JortSort. I'm now kinda thinking/planning on implmementing [bogosort](https://en.wikipedia.org/wiki/Bogosort).

So, as close to all-at-once as you can, you run a function with all the entries in the array you want to sort, where you `sleep` for the value of the entry, then `say` that value, or, if you can, put it onto the _sorted_ array.

I first did it in Node. There's a fundamental issue with Javascript, one which made it the perfect language to do Promises: It's asynchronous. It's easy to forget, but if you have a command that might take the _slightest_ amount of time to complete, it'll go onto the next command and deal with you when you're done. `let i = long_wait_command(); do_something_with_i(i)` will always be problematic, because it'll do something with the undefined value of `i` while `long_wait_command()` does it's thing. It's the [Back Door Man](https://www.youtube.com/watch?v=aVIA1n5ng4Y) of languages.

So, if you `setTimeout( { ... } , n )`, you'll wait `n` milliseconds before your code block goes.

But with Perl...

I wrote some [Promises](https://metacpan.org/pod/Promises) code years ago, for a [Purdue Perl Mongers](https://purdue.pl/) talk. I changed jobs, don't _think_ I copied over that directory, and I can't find it anymore. I find that a lot of example code I see for things like Async::IO and Promises and the like are all about network code (which yes, is exactly the kind of code that you'd _want_ to use promises with) and here, I'm simply trying to wrap _sleep_ and have things go parallel. If I could only see my old code, I might understand how to move forward.

[So, instead, when I came to the fork, I took it.](https://quoteinvestigator.com/2013/07/25/fork-road/)

[Parallel::ForkManager](https://metacpan.org/pod/Parallel::ForkManager) was quick and easy to handle it. I'm 50-50 on going back and trying to beat a solution using [IO::Async](https://metacpan.org/pod/IO::Async) or [Futures](https://metacpan.org/pod/Futures) or some other solution. I would want to fill `@sorted` rather than just display in order. I would also try to figure out how to make `usleep` [Time::HiRes](https://perldoc.perl.org/Time::HiRes), the function that allows millisecond sleep in Perl, happy with what I'm putting together. In the meantime, I have this solution. Yay!

#### Show Me The Node!

```javascript
#!/usr/bin/env node
"use strict";

// let us make an unsorted array
let array = Array(10)
  .fill()
  .map((n, i) => 1 + i)
  .map((value) => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value);
console.log(array.join(" "));

// here, we're helped by the fact that JS does things at the
// millisecond level, not the second level
for (let i of array) {
  setTimeout(() => {
    process.stdout.write(i + " ");
  }, i);
}
```

```text
8 1 7 6 3 2 10 9 5 4

1 2 3 4 5 6 8 7 9 10
```

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

use Parallel::ForkManager;

my @unsorted = sort { rand 1 <=> rand 1 } 1 .. 10;
my $pm       = Parallel::ForkManager->new(20);

print 'Unsorted: ';
say join ' ', @unsorted;
say '';

print 'Sorted: ';
LOOP: for my $i (@unsorted) {
    my $pid = $pm->start and next LOOP;
    sleep $i;
    print qq{$i };
    $pm->finish;
}
$pm->wait_all_children;
say '';
```

```text
PS C:\Users\jacob\142> .\ch-2.pl
Unsorted: 8 1 9 4 2 10 7 3 6 5

Sorted: 1 2 3 4 5 6 7 8 9 10
PS C:\Users\jacob\142>
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
