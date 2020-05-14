---
layout: post
title:  "Since that last one was severely without Higher Order code..."
author: "Dave Jacoby"
date:   "2018-06-08 16:11:58 -0400"
categories: 
---

I pulled my copy of *[Higher Order Perl](https://hop.perl.plover.com/)* by Mark-Jason Dominus off the shelf and looked around in it. ([It is available online for free](https://hop.perl.plover.com/#free).)

> [Higher-order programming is a style of computer programming that uses software components, like functions, modules or objects, as values. It is usually instantiated with, or borrowed from, models of computation such as lambda calculus which make heavy use of higher-order functions.](https://en.wikipedia.org/wiki/Higher-order_programming)

The first thing I threw together is only slightly adapted from *HOP*, taking a 'name' and initial value, and printing the name and the current value.
```perl
#!/usr/bin/env perl

use strict ;
use warnings ;
use utf8 ;
use feature qw{ postderef say signatures state } ;
no warnings qw{ experimental::postderef experimental::signatures } ;

my $dis ;

# fill the dispatch table
for my $i ( 0 .. 9 ) { $dis->{ $i } = maker( $i, 0 ) ; }

# for 100 random numbers between 0-9
for my $i ( map { int rand 10 } 1 .. 100 ) {
	$dis->{ $i }->() ;
	}
exit ;

# $m is the name
# $n is the count of times the program was called
# $o is zero-padded so we can sort 

sub maker ( $m, $n ) {
	return sub {
		$n++ ;
		my $o = sprintf '%04d', $n ;
		say join ' - ', $m, $o ;
		}
	}
```

This gives us an output like this:

```
5 - 0001
5 - 0002
8 - 0001
3 - 0001
6 - 0001
6 - 0002
2 - 0001
4 - 0001
3 - 0002
9 - 0001
...
9 - 0013
0 - 0010
9 - 0014
0 - 0011
6 - 0010
3 - 0008
6 - 0011
2 - 0006
8 - 0013
8 - 0014

```

But not exactly, because random. 

We see that `8` and `9` were run 14 times, while `2` only came through 6.

That's fine and dandy, but not what we need. Something more like...

```perl
sub maker ( $key,$value ) {
	if ( defined $key && defined $value ) {
		return sub ( $obj ) {
			return 1 if defined $obj->{$key} && $obj->{$key} =~ m{$value}mix;
			return 0 ;
			}
		}
	return sub { return 1 } ;
	}
```

We give a key and a value, like for example `"track"` and `"community"` and get back a subroutine that returns 1 if a) that `"track"` is in the object it receives, and `"community"` is that part of that track name.

```perl
my $dispatch ;
for my $k ( keys $config->%* ) {
	my $v = $config->{ $k } ;
	$dispatch->{ $k } = maker( $k, $v ) ;
	}
delete $dispatch->{json} if defined $dispatch->{json} ;

for my $k ( keys $dispatch->%* ) {
	$main->@* = grep { $dispatch->{ $k }->($_) } $main->@* ;
	}
```

We have a table of functions called `$dispatch`, filled with subroutines. The one for `"track"` knows inside itself it is looking for `"community"`,so we only have to `grep { $dispatch->{ track }->($_)}` to test for it.

I like this a LOT better than the copy-paste, find-replace code it replaces. Now, to use it again before I forget it.



If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


