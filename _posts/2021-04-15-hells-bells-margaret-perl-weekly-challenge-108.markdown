---
layout: post
title: "Hell's Bells, Margaret: Perl Weekly Challenge #108"
author: "Dave Jacoby"
date: "2021-04-15 18:24:41 -0400"
categories: ""
---

And we're on to [Perl Weekly Challenge #108](https://perlweeklychallenge.org/blog/perl-weekly-challenge-108/).

There are reasons I didn't jump on this earlier, and many of those reasons are my own, but some of them were that I didn't know how to engage.

### TASK #1 › Locate Memory

> Submitted by: Mohammad S Anwar  
> Write a script to declare a variable or constant and print it’s location in the memory.

Let me go through my thoughts here. A program starts, and it declares an array.

```text
    [    ] [    ] [    ] [    ] [    ] [    ] [    ] [    ]
```

_(It is possible that they wouldn't be contiguous. It is possible that, while within the program, it thinks of them as contiguous, the processor **knows** that the memory locations are spread all over the place. To some extent, modern machine language fits the definition of high-level languages you may have heard in CS101. This is abstracted to the CPU and is a **good** thing.)_

When going between these memory locations in C, for example, you would take the memory address of the first element, which we call a _pointer_...

```text
    [    ] [    ] [    ] [    ] [    ] [    ] [    ] [    ]
    ^
    |
```

... and use that as the address for the array. `array[2]` corresponds to `memory address + ( 2 * the size of the memory chunks )` and would point it within the array.

```text
    [    ] [    ] [    ] [    ] [    ] [    ] [    ] [    ]
                  ^
                  |
```

_This_ array is statically set to a limit of eight spots. Let's jump to 9.

```text
    [    ] [    ] [    ] [    ] [    ] [    ] [    ] [    ]
                                                            ^
                                                            |
```

We're out of our lane here. In some cases, like you don't have your C legs yet, you did an off-by-one error or something, and the compiler gives an error, you feel bad, and you go back and try to fix it. When people call C a foot-gun, this is where it comes from.

In other cases, you _are_ an experienced C developer, but you're also malevolent, and you use this to sneak into other programs. This is called **Smashing The Stack** in that case.

In Perl, we use references instead, and while there _is_ a way you can get something like that, it mostly means you did the mistake like the "C Legs" coder above, doing `print $c` instead of `print $c->$*`, for example. It's harder to use these things in a way to abuse the system.

(Of course, there are are many ways to break things in every language.)

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

# I am not 100% sure I understand this task

# in C, you get the memory locations as pointers, and you
# traverse an array by adding the memory size to the
# previous pointer. This contributes to C being a
# notorious foot-gun.

# You CAN print a memory location by using a reference
# and printing the reference instead of dereferencing it
# but because it's a reference, not a pointer, you don't
# do the dangerous, stack-smashing pointer arithmatic.

# So I guess I don't fully understand WHY you would want
# to do something like this, because "JUDGED DANGEROUS"
# trumps "CONSIDERED HARMFUL", but this kinda does it.

# I think.

my $x = 'weasel';
my $y = \$x;

say $x;
say $y;
say $y->$*;
```

```text
./ch-1.pl
weasel
SCALAR(0x7fffde5ab768)
weasel
```

### TASK #2 › Bell Numbers

> Submitted by: Mohammad S Anwar  
> Write a script to display top 10 **Bell Numbers**. Please refer to [wikipedia page](https://en.wikipedia.org/wiki/Bell_number) for more informations.

So, given a set of whatevers, we group the whatevers between `[whatever]` and `[w][h][a][t][e][v][e][r]`, and the number of different ways we can group a thing is the Bell number. Mohammad's example, `bell(3)` is **5** because:

```text
B3: 5
   {a}{b}{c}
   {a,b}{c}
   {a}{b,c}
   {a,c}{b}
   {a,b,c}
```

**This** is the one where I had severe implementation confusion. It always _Looked Like A Job For RECURSION!_ to me, but as I say, it is _very_ common for things to look like that for me.

Instead, I created the maximum number of partitions. This is a thing that I should've but didn't do. (I'm testing while writing, so not gonna change it.)

```perl
    @set = sort @set; # just making sure
    my @partitions = map {[]} @set;
```

I instead did a less clever thing that worked.

Again, this is a well-documented chunk of code, in part because I had to explain to myself I wasn't breaking things.

So, if we start with a set that's `[ A, B, C, D]`, the partitions we start with are:

```text
    [ A ], [   ], [   ], [   ]
    [   ], [ A ], [   ], [   ]
    [   ], [   ], [ A ], [   ]
    [   ], [   ], [   ], [ A ]
```

Of course, all get reduced to `[ A ]`, but because I'm pushing around arrayrefs and not arrays, I can't easily keep from going forward with each of those as the partitions in question. At least, not by any way I have thought of yet.

First pass, I ended up with 

```text
    [ A, B ], [       ], [       ], [       ]
    [ A    ], [ B     ], [       ], [       ]
    [ A    ], [       ], [ B     ], [       ]
    [ A    ], [       ], [       ], [ B     ]
    [ B    ], [ A     ], [       ], [       ]
    [      ], [ A, B  ], [       ], [       ]
    [      ], [ A     ], [ B     ], [       ]
    [      ], [ A     ], [       ], [ B     ]
    [ B    ], [       ], [ A     ], [       ]
    [      ], [ B     ], [ A     ], [       ]
    [      ], [       ], [ A, B  ], [       ]
    [      ], [       ], [ A     ], [ B     ]
    [ B    ], [       ], [       ], [ A     ]
    [      ], [ B     ], [       ], [ A     ]
    [      ], [       ], [ B     ], [ A     ]
    [      ], [       ], [       ], [ A, B  ]
```

which of course simplifies to 

```text
    [ A, B ], [       ]
    [ A    ], [ B     ]
```

And because I'm carrying **much** more than I needed, I was segfaulting.

So, instead of collecting all the partitions into an array, I stringified the simplified with `$JSON->encode($var)` and ran `uniq`.

I'm writing this while I'm testing the 10th number, `bell(9)`, and the expected value is **21147**, over five times the size of `bell(8)`. I'm not worried about getting the _wrong_ answer, but about _crashing_ it before hitting the end. (**ETA:** It ran, and ended normally. Yay!)

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

use List::Util qw{uniq};
use Getopt::Long;
use JSON;
my $json = JSON->new->space_before->space_after;

# since I already use Getopt::Long, I might want to
# modify this so I can independently run higher numbers
# and time them. i => bell(i) grows exponentially.
my $verbose = 0;
GetOptions( 'verbose' => \$verbose );

# Write a script to display top 10 Bell Numbers
my @alphabet = 'a' .. 'z';
unshift @alphabet, '';
my %test = (
    0 => 1,
    1 => 1,
    2 => 2,
    3 => 5,
    4 => 15,
    5 => 52,
    6 => 203,
    7 => 877,
    8 => 4140,
    9 => 21147
);

my %filter;

for my $n ( 0 .. 9 ) {
    %filter = ();
    my @set = grep { length $_ } @alphabet[ 0 .. $n ];
    my $t   = $test{$n};
    my ( $bell, @list ) = bell_number(@set);
    say join ' - ',      $n, $verbose, $t, $bell, join ',', @set;
    say join "\n\t$n\t", '', @list, '' if $verbose;
    say join ' - ',      $n, $verbose, $t, $bell, join ',', @set;
    say '';
}
exit;

# We're MOSTLY expected to get the bell number, which is
# the number of unique partitions -- [[a],[b]] == [[b],[a]] --
# so I do some of the administrivia in bell_number() and
# do the bulk of the work in _bell_number().

# in my first pass, I got myself confused with adding
# second-level arrays as needed, so instead, I start with
# a larger-than-needed set of arrays and fill from there.

# The first ten bell numbers are:
# 1,
# 1,
# 2,
# 5,
# 15,
# 52,
# 203,
# 877,
# 4140

# The key, then, is to grep filled arrays, because
#   [],[],[],[a]
# is equivalent to
#   [a]
# and sort by initial entry, because
#   [a,b],[c]
# is equivalent to
#   [c],[a,b]

# We now stringify the arrayref to JSON with encode, and
# between filtering and uniq, ensure that it doesn't get
# TOO big, otherwise this segfaults at n=8 or so.

# the question ASKS for the Bell number, but the examples
# show all the partitions that go into that, so...

sub bell_number( @set ) {
    return 1, [] unless scalar @set;

    @set = sort @set; # just making sure
    my @partitions;
    for ( 0 .. scalar @set ) { push @partitions, [] }
    my @output = _bell_number( \@set, \@partitions );
    return ( scalar @output, @output );
}

# THIS looks like a JOB for RECURSION!

# I will have to read the other options to see who did this
# iteratively.

# we pass the arrays for set (the letters left) and
# partitions (the partitions created so far), because
# you can't pass arrays otherwise, but one list.

# Because passing by name, not by value, I make a copy
# of the set and work off the copy.

# I could see wanting to Memoize this, but I don't think
# there could be much effect without going into internals.
sub _bell_number ( $set, $partitions ) {
    my @output;
    my $set2->@* = map { $_ } $set->@*;
    my $l = shift $set2->@*;

    # We handle for every bucket
    # The more buckets, the more problems

    # We make a copy of the partitions for each bucket
    # and work off that, rather than trying to clean up
    # manually each time.

    # Given trying to put A in when the starting set is
    # [A,B,C,D], the first partitions would be

    # [ A ],[   ],[   ],[   ]
    # [   ],[ A ],[   ],[   ]
    # [   ],[   ],[ A ],[   ]
    # [   ],[   ],[   ],[ A ]

    # I have questions about whether this is the most
    # efficient code, because of all the built-in replication
    # of results, but a better way isn't immediately
    # obvious to me.

    for my $i ( 0 .. -1 + scalar $partitions->@* ) {
        my $prt->@* = map { [@$_] } $partitions->@*;
        push $prt->[$i]->@*, $l;

        # If there are more letters to use, we we go
        # again
        if ( scalar $set2->@* ) {
            push @output, _bell_number( $set2, $prt );
        }

        # if there are no more letters in the set,
        # that means we're done. $prt2 is a cleaner
        # version of $prt, and $prtj is the stringified
        # version of that partition set. There's a hash
        # meant to keep duplicates from being put into
        # the output, but...
        else {
            my $prt2->@* =
                sort { $a->[0] cmp $b->[0] }
                grep { scalar $_->@* }
                map  { [@$_] } $prt->@*;
            my $prtj = $json->encode($prt2);
            $filter{$prtj}++;
            push @output, $prtj unless $filter{$prtj} < 2;
        }
    }

    # It's also handled by uniq. Becasuse we're sorting
    # by first element and grepping out empty partitions,
    # we will never get two representations of the same set,
    # so uniq will bring it down to the minimum.
    @output = uniq @output;
    return @output;
}
```

```text
0 - 0 - 1 - 1 - 
0 - 0 - 1 - 1 - 

1 - 0 - 1 - 1 - a
1 - 0 - 1 - 1 - a

2 - 0 - 2 - 2 - a,b
2 - 0 - 2 - 2 - a,b

3 - 0 - 5 - 5 - a,b,c
3 - 0 - 5 - 5 - a,b,c

4 - 0 - 15 - 15 - a,b,c,d
4 - 0 - 15 - 15 - a,b,c,d

5 - 0 - 52 - 52 - a,b,c,d,e
5 - 0 - 52 - 52 - a,b,c,d,e

6 - 0 - 203 - 203 - a,b,c,d,e,f
6 - 0 - 203 - 203 - a,b,c,d,e,f

7 - 0 - 877 - 877 - a,b,c,d,e,f,g
7 - 0 - 877 - 877 - a,b,c,d,e,f,g

8 - 0 - 4140 - 4140 - a,b,c,d,e,f,g,h
8 - 0 - 4140 - 4140 - a,b,c,d,e,f,g,h

9 - 0 - 21147 - 21147 - a,b,c,d,e,f,g,h,i
9 - 0 - 21147 - 21147 - a,b,c,d,e,f,g,h,i
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
