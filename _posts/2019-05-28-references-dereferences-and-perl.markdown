---
layout: post
title: "References, Dereferences and Perl"
author: "Dave Jacoby"
date: "2019-05-28 09:52:09 -0400"
categories: ""
---

I include the following in my blog post template:

> If you have any questions or comments, I would be glad to hear it.

I ask for GitHub issues or Twitter responses, because I've had long-form off-topic arguments in the comments of my posts before, and I wanted to push those things away from my core points while still having interaction with readers.

But that seemed to be a barrier, because few people used these methods to contact me, until last night, when I was asked to go deeper on `postderef`.

## References

Consider `$n[0][0]`. By syntax, we know that there's an array `@n`, but what is in `$n[0]`?

```perl
0> my @n;
1> $n[0][0] = 3;
$res[0] = 3

2> ref $n[0][0]
$res[1] = ''

3> ref $n[0]
$res[2] = 'ARRAY'
```

The "Big Book of Perl References" is [`perlref`](https://perldoc.perl.org/perlref.html) and should be available via `perldoc perlref`. The base syntax,from this documentation, is thus:

```perl
    $scalarref = \$foo;
    $arrayref  = \@ARGV;
    $hashref   = \%ENV;
    $coderef   = \&handler;
    $globref   = \*foo;
```

But you can also work more directly.

```perl
    $arrayref = [1,2,3];
    $hashref  = { foo => 'bar' };
    $coderef  = sub { print 'FMEP' };
```

So, yes, you can create an array of functions just like you can create an array of arrays. This is called a [dispatch table](https://en.wikipedia.org/wiki/Dispatch_table) and is key to Data-Driven Development, and a whole lot of fun.

## Standard Dereferencing

Going from the previously-set references, we'd get

```perl
    $$scalarref ;
    @$arrayref ;
    $$arrayref[0];
    %$hashref;
    $$hashref{foo};
    &$coderef;
    &$coderef(8);
```

This is fine. This _works._ But it does double-up on the sigils in front, and can make reading a bear.

## Aside: Why I doubled-down on references

[`JSON`](https://metacpan.org/pod/JSON) and related modules.

In a way, I had come to default to passing values as hashrefs because remembering if it the function took `($filehandle, $value)` or `($value, $filehandle)` was frustrating when you could pass `({ filehandle => $filehandle, value=>$value })` and know there's no ambiguity. This is cool, wonderful and very kind to the maintenence developer who will look at your code in a few years.

But no, it was `JSON` that pushed me over the edge, because ...

```perl
17> my $json = JSON->new->pretty->canonical;
$res[12] = bless( do{\(my $o = '')}, 'JSON' )

18> my @x = 1..5
...

19> $json->encode(@x)
Usage: JSON::XS::encode(self, scalar) at reply input line 1.

20> $json->encode(\@x)
$res[14] = '[
   1,
   2,
   3,
   4,
   5
]
'
```

`JSON` wants references to data structures, so instead of `@n` and `$n[0][0]`, it's easier to have `@$n` and `$$n[0][0]`, except sometimes it gets a bit hard to read. You _can_ do `@{$n}`, but I wonder if that's an improvement.

## Postderef

And the Secret Masters of Perl must've thought the same thing, because we have `postderef`, which has been [stable since 5.24](https://www.effectiveperlprogramming.com/2016/04/postfix-dereferencing-is-stable-is-v5-24/). So, let's round up the usual suspects.

```perl
    $arrayref->@* ;
    $arrayref->[0];
    $hashref->%*;
    $hashref->{foo};
    $coderef->&*;
    $coderef->(8);
```

Here we're dereferencing as above, but `post` or after the reference. And, of course, these can stack.

```perl
    my $value = $data->{functions}[0](20);
    # $data is a hashref
    # $data->{functions} is an arrayref
    # $data->{functions}[0] is a coderef
```

(I'm reasonably sure it was [brian d. foy](https://www.effectiveperlprogramming.com/2014/09/use-postfix-dereferencing/) who taught me this, but it could've been [David Farrell](https://www.perl.com/article/68/2014/2/13/Cool-new-Perl-feature--postfix-dereferencing/). Props to both on this.)

## Aside: The mind-boggling part

A line from my post on [Javascript Arrays, actually](https://jacoby.github.io/2019/03/18/more-fun-with-javascript-arrays-reimplementing-uniq.html).

```perl
my $hedgehogs->@* = map { int rand 10 } 0..9;
```

This does not need to be an arrayref, but for the above reasons, I am more likely to make references than hashes and arrays. If I want to dump as JSON to see what I'm dealing with at a random point, it's just easier for me.

So, this could have been written this way, without any references at all.

```perl
my @hedgehogs = map { int rand 10 } 0..9;
```

I guess I was using the `map`-`grep` style of Perl to show off that style of Javascript, assuming that Perl developers had gone through the [Schwartzian Transform](https://en.wikipedia.org/wiki/Schwartzian_transform) and understood it.

Basically, we're talking about functions that take an array and return an array. `..` is a range operator, and `0..9` gives you the array `[0,1,2,3,4,5,6,7,8,9]`.

`map` transforms the array, as in "maps a value onto". (The ex-English major wonders about the etymology of "map".) This is in contrast with `sort`, which changes the order of the array, and `filter` or `grep`, which make shorter arrays. In Perl, `rand` gives you a "random" floating-point number between 0 and 1. `rand 10` multiplies that by 10, so, it's between 0.0... and 9.9..., and `int rand 10` coerces it into an integer, so now we get 10 random integers instead of 0 thru 9.

But, as `map` takes a function as well as an array, the changes could be anything. `map { sub ( $x ) { return $_ * $x } } 0..9` would make an array of functions that, basically, multiply the value by the index number.

I go into [the pieces of the Transform in JS in a previous blog post](https://jacoby.github.io/javascript/2018/11/07/schwartzian-transforms-in-javascript.html).

## Back at the ranch

I can think of one frustration and one trick relating to using references and the `postderef` feature. The frustration might be obvious when you read this: the syntax highlighters for Perl tend to lag behind Perl, so the cool new features that I love are usually not added yet, which means that they don't know what to do with my code. The one in Markdown/Jekyll/Github Pages is certainly not there yet.

And here's the trick: Perl knows the difference between `my $x = response()` and `my @x = response()`, and you can have your function switch between by using `wantarray`.

```perl
sub response {
    my @array = 0..9;
    return wantarray ? @array : \@array;
}

sub alt_response {
    my $array->@* = 0..9;
    return wantarray ? $array->@* : $array;
}
```

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
