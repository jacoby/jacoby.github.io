---
layout: post
title: "Table it? Yes or No?: The Weekly Challenge #140"
author: "Dave Jacoby"
date: "2021-11-22 16:33:56 -0500"
categories: ""
---

I haven't been feeling the best recently. There's something going on with my ear, and I've spent the morning talking to doctors and nurses about it. I then took a nap, and now I'm on to [The Weekly Challenge #140](https://theweeklychallenge.org/blog/perl-weekly-challenge-140/)

As this is the time of thankfulness, I am thankful for the Perl Community, especially The Weekly Challenge, for allowing me to engage things that are not normally part of my programming life.

### TASK #1 › Add Binary

> Submitted by: Mohammad S Anwar  
> You are given two decimal-coded binary numbers, $a and $b.
>
> Write a script to simulate the addition of the given binary numbers.
>
> The script should simulate something like $a + $b. (operator overloading)

There's an _easy_ way to do this. Append `0b` to the front of the values, run `oct()` on the values, do normal math, then `sprintf '%b'` afterward to get it back to binary.

But that's just doing math, right? Where's the fun in that?

So, instead, going with "everything here is ones and zeroes", we can do normal decimal (or any base over base-4) math and get four values: **0, 1, 2 or 3.** We can get **3** because here, we're doing it with remainders. Consider one plus one:

- **i = 1, j = i.** We've done no math yet, so **remainder = 0**. `i + j + remainder = 2`. 2 is not 1, so we store **0** in this place. 2 is greater than 1, so **the remainder is 1**.
- **i = 0, j = 0, and remainder is 1**. `i + j + remainder = 1`, 1 is less than 2, so no remainder. 1 is 1, so we store **0** in this place.

So, **01 + 01 = 10** in binary.

There are, in fact, _four cases_:

- **total = 0** - store `0`, remainder = 0
- **total = 1** - store `1`, remainder = 0
- **total = 2** - store `0`, remainder = 1
- **total = 3** - store `1`, remainder = 1

I say _cases_, and you _could_ write this as a case statement, or the close analog, if statements.

```perl
    if ( $sum == 0 ) {
        unshift @output, 0;
        $r = 0;
    }
    if ( $sum == 1 ) {
        unshift @output, 1;
        $r = 0;
    }
    if ( $sum == 2 ) {
        unshift @output, 0;
        $r = 1;
    }
    if ( $sum == 3 ) {
        unshift @output, 1;
        $r = 1;
}
```

That's certainly _readable_. But it could be simpler, because `$r` hangs on if the total is greater than 1, and what gets unshifted is determined by total modulo 2, so:

```perl
    $r = $sum > 1 ? 1 : 0 ;
    unshift @output, $sum % 2? 0 : 1;
```

I check my work two ways below: doing "real" binary math and using the expected solutions as given in the examples.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say state postderef signatures };
no warnings qw{ experimental };

my @examples;
push @examples, [ 11,  1,  100 ];
push @examples, [ 101, 1,  110 ];
push @examples, [ 100, 11, 111 ];

for my $example (@examples) {
    my ( $a, $b, $solution ) = $example->@*;
    my $c = add_binary( $a, $b );
    my $d = real_add_binary( $a, $b );
    say <<"END";
    Input: \$a = $a; \$b = $b
    Output: $c
    We know by:  $d
    And also by: $solution
END
}

sub add_binary ( $a, $b ) {
    my @output;
    my $r = 0;
    my @a = split //, $a;
    my @b = split //, $b;

    while ( @a || @b ) {
        my $wa = pop @a;
        my $wb = pop @b;
        $wa //= 0;
        $wb //= 0;
        my $sum = $wa + $wb + $r;
        $r = $sum > 1 ? 1 : 0 ;
        unshift @output, $sum % 2? 0 : 1;
    }
    unshift @output, 1 if $r;
    return join '', @output;
}

sub real_add_binary ( $a, $b ) {

    # convert from binary to decimal
    my $ra = oct( '0b' . $a );
    my $rb = oct( '0b' . $b );

    # decimal addition?
    my $rc = $ra + $rb;

    # reconversion and return
    return sprintf '%b', $rc;
}
```

```text
    Input: $a = 11; $b = 1
    Output: 111
    We know by:  100
    And also by: 100

    Input: $a = 101; $b = 1
    Output: 001
    We know by:  110
    And also by: 110

    Input: $a = 100; $b = 11
    Output: 000
    We know by:  111
    And also by: 111
```

### TASK #2 › Multiplication Table

> Submitted by: Mohammad S Anwar  
> You are given 3 positive integers, $i, $j and $k.
>
> Write a script to print the $kth element in the sorted multiplication table of $i and $j.

We've seen **Make a Multiplication Table** before, and I think the one hangup there is remembering to correctly orient your table. Two immediate ways are to count from 0, adding a whole lot of `0 * $x = 0` into the table, which we have to remove, because there's no `0` in the example data, and putting it into the multidimensional array as `$table->[$x-1][$y-1]`.

Then we _flatten_ the array, then numerically sort it, and find the value that `$k` indexes.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say postderef signatures state };
no warnings qw{ experimental };

my @examples;
push @examples, [ 2, 3, 4 ];
push @examples, [ 3, 3, 6 ];

for my $example (@examples) {
    my $element = solve_task_2( $example->@* );
    say <<"END";
    Input:  \$i = $example->[0]; \$j = $example->[1]; \$k = $example->[2] 
    Output: $element
END
}

sub solve_task_2 ( $i, $j, $k ) {
    my @table;
    for my $x ( 1 .. $i ) {
        for my $y ( 1 .. $j ) {
            $table[ $x - 1 ][ $y - 1 ] = $x * $y;
        }
    }
    my @array = sort { $a <=> $b } flatten(@table);
    return $array[ $k - 1 ] || -1;
}

sub flatten ( @two_d_array ) {
    return map { $_->@* } @two_d_array;
}
```

```text
    Input:  $i = 2; $j = 3; $k = 4
    Output: 3

    Input:  $i = 3; $j = 3; $k = 6
    Output: 4
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
