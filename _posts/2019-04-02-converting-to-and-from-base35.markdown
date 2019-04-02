---
layout: post
title:  "Converting to and from Base35"
author: "Dave Jacoby"
date:   "2019-04-02 09:46:04 -0400"
categories: ""
---

This is the 2nd challenge for this week's [Perl Weekly Challenge](https://perlweeklychallenge.org/blog/perl-weekly-challenge-002/):

> **Challenge #2**
> Write a script that can convert integers to and from a base35 representation, using the characters 0-9 and A-Y. **Dave Jacoby** came up with nice description about [base35](https://gist.github.com/jacoby/764bb4e8a5d3a819b5fbfa497fcb3454), in case you needed some background.

Which, since I wrote it, I can quote here:

>Let's start with octal. That's base8.
>
>You'd count it 0,1,2,3,4,5,6,7,10,11,12...
>
>There's only the digits 0 thru 7 , and when you get to 8, that's 10.
>
>So, if you have 12 in octal, that's (1*8) + 2, which is 10 in decimal.
>
>And, 100 in octal would be 1*(8 squared), or 64 decimal.
>
>Let's double base8 to base16, which we call hexidecimal.
>
>Starting from 8, we go 9,A,B,C,D,E,F,10,11, etc. We use alphabetical characters because we've maxed out on numerical.
>
>And 12 in hexidecimal would be (1 * 16 ) + ( 2 * 1 ).
>
>[Implementation hint: x^0 == 1]
>
>So, going to base35 gets you almost to the end of the alphabet before flipping over to 10.

So, Let's start with some housekeeping. If I wanted all the digits, I'd go 

```perl
my @hedgehogs = 0..9;
```

but that's insufficient for us, because we don't want base10, we want base35.

```perl
my @base35 = 0..9;
push @base35 , 'A'..'Y';
say join ',' @base35;
# 0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y
```

Hashes are fast to work with, so to allow us to reverse things, 

```perl
my $c = 0 ;
my %base35 = map {  $_ => $c++ } @base35;
say $json->encode(\%base35); # we're using features and JSON here

# truncated for your attention span!
# {
#    "0" : 0,
#    "1" : 1,
#    "2" : 2,
#    "3" : 3,
#    "4" : 4,
#    "5" : 5,
#     ...
#    "V" : 31,
#    "W" : 32,
#    "X" : 33,
#    "Y" : 34,
#    "Z" : 35
# }
```

(Quick usage note: Iteration is cool. There are some who say it is better to be explicit, to type `$c+=1` or the like, but I fail to see the benefit. In this case, `$c` iterates after -- `$_ => 0 ; 1` -- but reversing the order to `++$c` makes the iteration occur first. Which can be what you want.)

So, let's start with a number, like `93`, that we want to convert to base35.

```perl
use feature qw{ say signatures }; #I suppose I should make this explicit

base35(93);

sub base35 ( $n ) {
    # tests to ensure that base35 is a number should occur here.
    # I'm also not 100% sure this is fine with negative numbers
    # and the idea of floating point in base35 gives me the willies.
    my @base;
    do {
        my $d = $n % 35;
        unshift @base, $base35[$d];
        $n = int $n / 35;
    } while ( $n / 35 > 0 );
    return join '', @base;
}

# 2N
```

Here we use a `do while` loop, which differs from a `while` loop in that you get the first one free, which handles the case of when we try to convert a number less than 35. Within the loop, we:

* get the remainder of divide by 35, or `modulus`
* use the array `@base35` to get the correct character
* use `unshift` to add to the front of the array (opposed to `pop`, which adds it to the end)
* divide the original number by 35 and strip the remainder/floating point by casting as an integer
* and test to see if we go again.

Here, because this is the ASCII representation of the base35, we have an array of characters, which we combine to string with join. I could see this being done with concatenation -- `my $base =''; $base .= $base35[$d]; return $base`, but eh, it is written.

`93 = 2 * 35 + 23`, and our hash table tells me that `"N" : 23`, so that checks out, but we want to reverse it.

```perl
sub back35 ( $base ) {
    # tests and adjustments should happen here
    # like making uppercase and ensuring Z and
    # non-ASCII and non-alphabet characters don't
    # get through.
    # Pay no attention to the man behind the curtain!
    my @base = split //, $base; # I find 'pop' easier than 'substr'  
    my $c    = 0;
    my $h    = 0;
    do {
        my $d = pop @base;
        my $e = $base35{$d};
        my $f = 35**$c;
        my $g = $e * $f;
        $h += $g;
        $c++;
    } while scalar @base;
    return $h;
}
say back35('2N');
# 93
```

`$c`? `$d`? **`$f`?** Nice descriptive variable names, _Dave_. Good job.

`$c` indicates how deep we are. Given the base35 number `PERL`, we would start with `L`, which is the zeroth number. Here we get to the implementation detail which is that 35 to the 0th power is `1`, and so `L == 1 * 21 == 21`. Go on to `R`, and there we go `R0 == 27 * 35 ** 2 == 27 * 35 == 945`, to which we add `21` to get `RL == 966`.

So, within the loop:

* pull the lowest digit/character
* use the hash to find the numeric value
* use `$c` to find out the multiplier
* multiply the digit with the multiplier
* add the result to the return value

(With the mention of iterators, I should mention I could've iterated `$c` when I assigned the multiplier to `$f`, but I didn't. This isn't golf; this is okay.)

And here we find that `PERL` in Base35 is **1089991**.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


