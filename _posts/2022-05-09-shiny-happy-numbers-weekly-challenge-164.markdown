---
layout: post
title: "Shiny Happy Numbers: Weekly Challenge #164"
author: "Dave Jacoby"
date: "2022-05-09 10:08:29 -0400"
categories: ""
---

### Task 1: Prime Palindrome

> Submitted by: Mohammad S Anwar  
> Write a script to find all prime numbers less than 1000, which are also palindromes in base 10. Palindromic numbers are numbers whose digits are the same in reverse. For example, **313** is a palindromic prime, but **337** is not, even though **733** (337 reversed) is also prime.

There are things that we've done before in the Weekly Challenge that are very helpful. I already have a function for finding primes, and I know that comparing the reverse of a string to the string is good for finding palindromes.

Because of what I've already learned, I was able to make this almost a one-liner. If I used [Math::Prime::Util](https://metacpan.org/pod/Math::Prime::Util), I could probably make it into a proper command-line one-liner.

Which would look like this: `perl -MMath::Prime::Util=is_prime -e 'print join "\n", grep { $_ eq reverse $_} grep { is_prime($_) } 1..1000'`

I had to do some looking up because I almost never write command-line Perl like that.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

# palindrome primes 2 .. 1000

say join "\n",
    grep { $_ eq reverse $_ }
    grep { is_prime($_) }
    1 .. 1000;

sub is_prime ($n) {
    return 0 if $n == 0;
    return 0 if $n == 1;
    for ( 2 .. sqrt $n ) { return 0 unless $n % $_ }
    return 1;
}
```

```text
$ ./ch-1.pl
2
3
5
7
11
101
131
151
181
191
313
353
373
383
727
757
787
797
919
929
```

### Task 2: Happy Numbers

> Submitted by: Robert DiCicco  
> Write a script to find the **first 8 Happy Numbers** in base 10. For more information, please check out [Wikipedia](https://en.wikipedia.org/wiki/Happy_number).
>
> Starting with any positive integer, replace the number by the sum of the squares of its digits, and repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1.
>
> Those numbers for which this process end in 1 are happy numbers, while those numbers that do not end in 1 are unhappy numbers.

Readers, I tell you I was so tempted to make it recursive, but there's a certain thing that made me decide not to. Consider **4**:

- 4<sup>2</sup> = 16
- 1<sup>2</sup> + 6<sup>2</sup> = 36 + 1 = 37
- 3<sup>2</sup> + 7<sup>2</sup> = 9 + 49 = 58
- 5<sup>2</sup> + 8<sup>2</sup> = 25 + 64 = 89
- 8<sup>2</sup> + 9<sup>2</sup> = 64 + 81 = 145
- 1<sup>2</sup> + 4<sup>2</sup> + 5<sup>2</sup> = 1 + 16 + 25 = 42
- 4<sup>2</sup> + 2<sup>2</sup> = 16 + 4 = 20
- 2<sup>2</sup> + 0<sup>2</sup> = 4 + 0 = **4**

And we're back where we started. Once we're in this loop, we won't leave, so this number will always be sad. I use a hash to handle numbers that have already been done, and keeping track of the things we already know in recursive solutions is harder than in iterative solutions, so I don't recurse this time.

Again, I use `sum0` from [List::Util](https://metacpan.org/pod/List::Util). I _suppose_ `sum` would be safe, but I prefer to use the one.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ sum0 };

my @happy;
while ( scalar @happy < 8 ) {
    state $c = 0;
    $c++;
    push @happy, $c if is_happy($c);
}
say join ", ", @happy;
exit;

sub is_happy( $n ) {
    my $m = $n;
    my %done;
    while ( !$done{$m} ) {
        $done{$m}++;
        $m = sum0 map { $_**2 } split //, $m;
    }
    return $m == 1 ? 1 : 0;
}
```

```text
$ ./ch-2.pl
1, 7, 10, 13, 19, 23, 28, 31
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
