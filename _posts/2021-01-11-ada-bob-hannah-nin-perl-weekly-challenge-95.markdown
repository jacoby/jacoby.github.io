---
layout: post
title: "[Ada, Bob, Hannah, Nin]: Perl Weekly Challenge 95"
author: "Dave Jacoby"
date: "2021-01-11 17:38:57 -0500"
categories: ""
---

### TASK #1 › Palindrome Number

> Submitted by: Mohammad S Anwar  
> You are given a number $N.
>
> Write a script to figure out if the given number is Palindrome. Print 1 if true otherwise 0.

You may notice that we are promised numbers, but there is no particular reason why this can't be a general palindrome tester. We would run into problems because `Bob` isn't a palindrome but `BoB` is, so if we went general, we'd want to `lc` or `fc` to handle caseless testing. If we were to not specify numbers, that is. I do take the step to ensure that what we have at least [_looks_ like a number](https://metacpan.org/pod/Scalar::Util#looks_like_number).

So, if we're talking about numbers, we're (unless specified) going to be talking about stringified base-10 numbers, which, thankfully, is what Perl defaults to. This means that, if the number is in `$num`, we can get the reverse by splitting to characters (`split //, $num`) , reversing the order (`reverse`) and joining the results (`join '',`).

#### The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use Scalar::Util qw{looks_like_number};

my @numbers = ( 1221, -101, 90, 2112, 9, 90.09 );

for my $num (@numbers) {
    my $r = is_palindrome_number($num);
    say qq{Input:   $num};
    say qq{Output:  $r};
    say '';
}

# this is specifically about numbers, so we'll use 
# looks_like_number from Scalar::Util. Otherwise we'll
# assume base-10 and treat it like a decimal, which is
# how Perl likes to stringify numbers. 

# returns 0 if not a number
# returns 0 if not a palindrome
# what remains should only be palindromic numbers,
#   so returns 1

sub is_palindrome_number($num = 0) {
    return 0 unless looks_like_number($num);
    my $mun = join '', reverse split //, $num;
    return 0 unless $mun eq $num;
    return 1;
}
```

```text
Input:   1221
Output:  1

Input:   -101
Output:  0

Input:   90
Output:  0

Input:   2112
Output:  1

Input:   9
Output:  1

Input:   90.09
Output:  1
```

### TASK #2 › Demo Stack

> Submitted by: Mohammad S Anwar  
> Write a script to demonstrate Stack operations like below:
>
> `push($n)` - add $n to the stack  
> `pop()` - remove the top element  
> `top()` - get the top element  
> `min()` - return the minimum element
>
> Example:  
> `my $stack = Stack->new;`  
> `$stack->push(2);`  
> `$stack->push(-1);`  
> `$stack->push(0);`  
> `$stack->pop; # removes 0`  
> `print $stack->top; # prints -1`  
> `$stack->push(0);`  
> `print $stack->min; # prints -1`

Perl's Array type gives us `push` and `pop`, so to make a Stack, we can just use Perl's old-school OOP style to wrap an array.

Because I'm contrarian and _far_ prefer `say` to `print`, I rewrote the example. It's all the same but with more debugging and newlines:

```perl
my $stack = Stack->new;
$stack->push(2);
$stack->push(-1);
$stack->push(0);
$stack->all;    # 2, -1, 0

$stack->pop;    # removes 0
$stack->all;

say $stack->top;    # prints -1
$stack->push(0);

$stack->all;
say $stack->min;    # prints -1
```

Quoting [Perl's documentation on Objects, `perlootut`](https://perldoc.perl.org/perlootut), 

> In Perl most objects are hashes, but the OO systems we recommend keep you from having to worry about this. In practice, it's best to consider an object's internal data structure opaque.

We see this in the constructor: 

```perl
package Stack;

sub new ( $class ) {
    my $self = {};
    $self->{values} = [];
    return bless $self, $class;
}
```

`$self` is a hashref that _is_ the object, and holds the `values` arrayref, which starts out empty because the stack is empty. It would be doable to create a filled stack with different syntax than given:

```perl 
use feature qw{ say signatures state };
no warnings qw{ experimental };
package Stack;

sub new ( $class , @values ) {
    my $self = {};
    $self->{values} = [];
    push $self->{values}->@*, @values;
    return bless $self, $class;
}
```

And it would still work with `my $stack = Stack->new;`, so I think I'm keeping it.

We have `push` and `pop` from Perl's Array, so here, we just use them within our Object-specific code. With `min`, I'm grabbing from [`List::Util`](https://metacpan.org/pod/List::Util#min), but I can't use `qw{min}` because then Perl thinks I'm trying to rewrite it in our module, so instead, 

```perl
use List::Util;
sub min ( $self ) {
    return List::Util::min( $self->{values}->@* );
}
```

A hang-up I hit that'd be obvious is that `push` and `pop` work from the back of the array, so `top` is going to be `[-1]` of the `{values}` hashref we're working with, not `[0]`. That's a _duh_ thing but I got pretty close to done before realizing it. I think that if I used `shift` and `unshift` instead, `Stack` would fit my mental model a _lot_ better, but that means I have to correct my mental model, right?

Another thing I added is an `all` function, which allowed me to look inside the Stack object a bit and be sure I'm happy with the current state. As a convention, I see `sub name` as the kind of subroutine intended for client use and `sub _name` as the kind of subroutine intended for internal and debugging, but your naming convention may vary.

#### The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

# I use `say` instead of `print` because the newlines
# improve readability in the output

my $stack = Stack->new;
$stack->push(2);
$stack->push(-1);
$stack->push(0);
$stack->all;    # 2, -1, 0

$stack->pop;    # removes 0
$stack->all;

say $stack->top;    # prints -1
$stack->push(0);

$stack->all;
say $stack->min;    # prints -1

say 'DONE';
exit;

# I think a Moose-style implementation would be good for me
package Stack;

# see min, below.
use List::Util;

# creates a new Stack object. Except for the "min" function,
# there's nothing to keep this from handling anything that a
# scalar can hold: number, string, hashref, arrayref, closure
sub new ( $class ) {
    my $self = {};
    $self->{values} = [];
    return bless $self, $class;
}

# 'push' and 'pop' are methods used by Perl's Array type
# to handle stack values, so here we just use them
sub push ( $self, $value ) {
    push $self->{values}->@*, $value;
    return 1;
}

sub pop ( $self ) {
    return pop $self->{values}->@*;
}

# it's harder to reuse subroutines from libraries than
# it is to reuse those provided by Perl, so we have to
# use List::Util and use min's long name rather than
# use List::Util qw{min}, because Perl would think we're
# rewriting min.
sub min ( $self ) {
    return List::Util::min( $self->{values}->@* );
}

# the thing I had to remember that push and pop occur from
# the back of the stack, not the front, and thus top is the
# _last_ value, not the _first_. I could use {values}[0]
# if instead I used shift and unshift.
sub top ( $self ) {
    return $self->{values}[-1];
    return 1;
}

# bookkeeping function so I know what's going on inside
sub all ( $self ) {
    say join "\n\t", 'Size: ' . scalar $self->{values}->@*,
        $self->{values}->@*, '';
    return 1;
}
```

```text
Size: 3
        2
        -1
        0

Size: 2
        2
        -1

-1
Size: 3
        2
        -1
        0

-1
DONE
```

If I go ahead and Moose this solution, I'll make another blog post. 

Unless, of course, I find my take irredeemably ugly and amateurish. I reserve the right to hide my faults.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
