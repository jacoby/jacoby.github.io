---
layout: post
title: "Fun with Subroutine Attributes in Perl"
author: "Dave Jacoby"
date: "2018-08-21 10:42:54 -0400"
? categories
---

We can credit time zones for this.

I knew that, thanks to [Shadowcat Systems](https://shadow.cat/), [the Perl Conference in Glasgow `#TPCiG`](http://act.perlconference.org/tpc-2018-glasgow/) was being live-streamed. EDT being GMT-4 and BST being GMT+1 means that there's a five-hour difference, and when I tuned in at about 9:30 AM my time, I caught [Matt S. Trout](https://twitter.com/shadowcat_mst) halfway through his 2pm talk about [Babble](https://metacpan.org/pod/Babble).

What is Babble? What does it do for you? Well, that must've been in the front half of the talk, because it isn't in the POD and isn't in [the repo](https://github.com/shadow-dot-cat/Babble/), as of this writing. It seems to have something to do with handling the order of attributes and signatures. [App::sigfix](https://metacpan.org/pod/App::sigfix) tells me that's about right.

[MST's talk starts here.](https://youtu.be/Y3TH8dJhEwE?t=5h17m44s) From the part I caught, I believe there's a breaking change in terms of order of signatures and attributes with 5.28. I use signatures a lot now, with this being my current default boilerplate for new programs.

```perl
use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental::postderef experimental::signatures };
```

But I was unaware of the magic of attributes, and the documentation I found (granted, mostly the first page of Google) didn't make me think that this was the thing I wanted all my life.

I did see [Dave Farrell](https://twitter.com/perltricks/) and his article on [Untangling subroutine attributes](https://www.perl.com/article/untangling-subroutine-attributes/). It starts with **The lvalue trick**.

What's that, you ask?

In language terms, an lvalue is a value that can be assigned to. It stands for **left value** because it's to the left of the assignment operator. Normally, you'd expect to see:

```perl
my $foo = Foo->new();
$foo->bar("dogma");
print $foo->bar; # dogma
```

But with the `:lvalue` attribute set, you can instead do this:

```perl
my $foo = Foo->new();
$foo->bar = "dogma";
print $foo->bar; # dogma
```

But, because `bar` is a function, it can do more than just accept and return a value.

```perl
#!/usr/bin/env perl

# as said, my boilerplate. You probably don't need more than
# say and signatures
use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental::postderef experimental::signatures };

# the package fun is just here
package Foo;
use Scalar::Util qw(looks_like_number);
sub new { bless {}, shift }

# here we have an iterator, that returns n+1 each time it is called.
sub iterate : lvalue {
    my $self = shift;
    # here we ensure iterate exists
    $self->{iterate} = 0 unless defined $self->{iterate};

    if ( looks_like_number( $self->{iterate} ) ) {
        $self->{iterate}++;
    }
    else {
        $self->{iterate} = 0;
    }
    # must return the variable for lvalue-ness
    $self->{iterate};
}

package main;

my $i = Foo->new();
$i->iterate = 4;
while ( 1 ) {   # can't put the assignment in here
                # if starting w/ negative numbers.
                # I learned the hard way. B)
    my $ii = $i->iterate ;
    say $ii ;
    last if $ii >= 20;
}

# 5
# 6
# 7
# 8
# 9
# 10
# 11
# 12
# 13
# 14
# 15
# 16
# 17
# 18
# 19
# 20
```

I could definitely imagine wanting to write `$twitter->user = 'jacobydave'` rather than `$twitter->user('jacobydave')`. I don't know that I'd ever use this on _real_ code. I don't know if there are other attribute tricks worth knowing in attributes, but I am interested in playing with it more.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
