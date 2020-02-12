---
layout: post
title: "Counting from 100 is the Fun Part"
author: "Dave Jacoby"
date: "2020-02-12 00:25:10 -0500"
categories: ""
---

### TASK #1 - Roman Calculator

> Write a script that accepts two roman numbers and operation. It should then perform the operation on the give roman numbers and print the result.
>
> For example,
>
> `perl ch-1.pl V + VI`
>
> It should print
>
> `XI`

The hard part of this is handling Roman numerals. Unless, of course, you use the pre-existing library to hande this, such as [Roman](https://metacpan.org/pod/Roman).

Roman provides three important functions:

- `isroman`, which tells us if the string given is a valid Roman numeral
- `roman`, which converts a number from Arabic numerals to Roman
- `arabic`, which converts a Roman numeral to Arabic from Roman

So, the process is:

- convert the numbers to Arabic
- do the math
- convert the result to Roman

I could've used `eval`, but I always worry using it, even when I have full control over what gets added. So, I use a hash to test if the mathematical operators are ones I want to support.

I'm half-considering making a dispatch table, whcih would allow me to turn those four if statements into `$a3 = $dispatch->{$op}($a1,$a2)`, but not tonight.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
  qw{ experimental::postderef experimental::smartmatch experimental::signatures };

use Roman;

my %operators = map { $_ => 1 } qw{ + - / * };

if ( scalar @ARGV > 2 ) {
    my ( $r1, $op, $r2 ) = @ARGV;
    if ( !$operators{$op} ) {
        say 'not an operator';
        exit;
    }
    if ( !isroman($r1) ) { say qq{"$r1" is not a roman numeral}; exit; }
    if ( !isroman($r2) ) { say qq{"$r2" is not a roman numeral}; exit; }
    my $a1 = arabic($r1);
    my $a2 = arabic($r2);
    my $a3 = 0;
    if ( $op eq '+' ) { $a3 =  $a1 + $a2 }
    if ( $op eq '-' ) { $a3 =  $a1 - $a2 }
    if ( $op eq '*' ) { $a3 =  $a1 * $a2 }
    if ( $op eq '/' ) { $a3 =  $a1 / $a2 }
    my $r3 = uc roman($a3);
    say qq{ $r1 $op $r2 = $r3 };
}
else { say 'We need an operator and two roman numbers' }
```

### TASK #2 - Gapful Number

> Write a script to print first 20 Gapful Numbers greater than or equal to 100.

A **Gapful Number** is one such that, if you make a two-digit number from the first and last digit of the number, that number divides evenly into the number in question.

So, we can either turn `100` into `[1,0,0]` and grab the first and last entry in the array, or we can do the same with `substr($var,0,1)` and `substr($var,-1)`. We can then do `$v1 *10 + $v2`, or just `join '', $v1, $v2`, which is what I did.

The _fun_ part, to me, is coming up with the numbers in range. Looking at the suggested page explaining Gapful Numbers, we know that the first 20 meaningful Gapful Numbers (numbers <100 are trivially gapful, because, for example, `99%99=0` ) and know that they exist beneath 200, but I don't really know that until the code proves it. Some alteratives include:

- `for ( my $i = 100; $i< 1000 ; $i++) { ... }`
- `for my $i ( 100 .. 1000) { ... }`
- `while ( @matches < 20 ) { $i++; ... }`
- `map { ... } 100 .. 1000`
- An Iterator, or Lazy List

I don't really _do_ anything with that first style of `for` loop, because that's one of the first things you learn in programming. C-style for loops are useful and good, but I used the ranged version in languages where that's possible.

That last one may be a new one for you. We want a function that starts where we want it to start and goes up by one each time called.

```perl
sub make_iterator ( $n ) {
    return sub {
        state $i = $n ;
        return $i++
    }
}
```

This gives us a function that returns a function. This function, like `$iter = make_iter(100)`, gives us the `$iter` variable, which is a function to be called like `$iter->()`, which each time returns the next biggest number.

I used the term **Lazy Loading**, and it comes in here because, when we use `100..1000`, we create a 900-bucket anonymous array, while using an iterator will keep it from using that memory. In this smaller case, this will not be a great issue, but if your data grows larger, it may become a problem.

My variations on the theme:

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings qw{ experimental::postderef experimental::smartmatch experimental::signatures };

# Write a script to print first 20 Gapful Numbers
# greater than or equal to 100.

# a Gapful Number is a number where
#   a second number is formed by the first and last digit of the number
#   which is a factor in that number.
# for example, 100 forms 10 and 100/10 = 10
# while 101 forms 11 and 101/11 = 9.181818...

# When I'm trying to be readable,
#   I declare an array to push things into
#   I use a while loop based on the size of that array
#   I iterate through numbers with ++
#   I split the number into an array with the easiest regex
#     and I join with an empty string
#   I push to the array if $n % $i == 0

my @x;
my $n = 100;
while ( scalar @x < 20 ) {
    my @n = split //, $n;
    my $i = join '', $n[0], $n[-1];
    push @x, $n if $n % $i == 0;
    $n++;
}
say join "\n", @x;

say '-' x 30;

# When I'm trying to show off a little more
#   I use a for loop ending at an abstractly large point
#   I name the for loop
#   I use state so the count variable only exists within the loop
#   I use the named last to break the loop

LOOP: for my $n ( 100 .. 1000 ) {
    state $c = 0;
    my @n = split //, $n;
    my $i = join '', $n[0], $n[-1];
    if ( 0 == $n % $i ) {
        $c++;
        say $n;
    }
    last LOOP if $c >= 20;
}

say '-' x 30;

# When I'm trying to be way-cool functional dev
#   I start with a range of 100..1000
#   I use join to stringify the output
#   I use a grep and a state variable to limit to 20
#   I use substr to pull the first and last digit from the number
#     and only create one variable in the second grep

say join "\n", grep { state $c = 0; $c++ < 20 }
    grep { my $i = join '', substr( $_, 0, 1 ), substr( $_, -1 ); $_ % $i == 0 }100 .. 1000;

say '-' x 30;

my $next = make_iterator(100);

while ( my $n = $next->() ) {
    state $c = 0;
    my $i =  my $i = join '', substr( $n, 0, 1 ), substr( $n, -1 );
    if ( 0==$n%$i){
        say $n;
        $c++;
    }
    last if $c >19;
}

sub make_iterator ( $start ) {
    return sub {
        state $i = $start;
        return $i++;
        }
}
```

This problem doesn't naturally lend itself to recursion, but I might have to make a recursive version, just for giggles.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
