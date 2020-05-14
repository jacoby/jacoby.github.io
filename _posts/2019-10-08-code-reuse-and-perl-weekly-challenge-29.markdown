---
layout: post
title: 'Code "Reuse" and Perl Weekly Challenge #29'
author: "Dave Jacoby"
date: "2019-10-08 16:08:47 -0400"
categories: ""
---

[This set of challenges](https://perlweeklychallenge.org/blog/perl-weekly-challenge-029/) was interesting, in that it contained things that I had never tried before. And in both, the amount of non-Dave code is so much that I can't claim these as "mine". I plan to extract some clever, but I can't say _"Look on my Works, ye Mighty, and despair!"_

Which, poetically, is probably for the best.

### **Challenge #2**

> Write a script to demonstrate calling a **C function.** It could be any user defined or standard C function.

This is the easest to crib, because the solution is right at the top of the page for [Inline](https://metacpan.org/pod/Inline)

```perl
#!/usr/bin/env perl

# Task #2
# Write a script to demonstrate calling a C function.
# It could be any user defined or standard C function.

# another instance where I'm copying and pasting from other sources
# and cannot really claim that I wrote this.

# https://metacpan.org/pod/Inline

use Inline C;

print "9 + 16 = ", add( 9, 16 ), "\n";
print "9 - 16 = ", subtract( 9, 16 ), "\n";

__END__
__C__
int add(int x, int y) {
  return x + y;
}

int subtract(int x, int y) {
  return x - y;
}
```

The section between `use Inline C` and `__END__` is the Perl 5 part, and the part starting with `__C__` is the C part. Just copy-pasted from the POD, although I'm sure you can do something similar with either [XS](https://perldoc.perl.org/perlxs.html) or [FFI::Platypus](https://metacpan.org/pod/FFI::Platypus). I've halfheartedly thought about diving into those before.

I'll note that the Modern Perl boilerplate you always see in my code caused problems, so this is exactly what's in the POD.

### **Challenge #1**

> Write a script to demonstrate brace expansion. For example, script would take command line argument Perl {Daily,Weekly,Monthly,Yearly} Challenge and should expand it and print like below:

```text
Perl Daily Challenge
Perl Weekly Challenge
Perl Monthly Challenge
Perl Yearly Challenge
```

I thought "Where do I even start?", then did some searching, and found [a complete solution on Rosetta Code](https://rosettacode.org/wiki/Brace_expansion#Perl)

```perl
sub brace_expand {
    my $input = shift;
    my @stack = ([my $current = ['']]);

    while ($input =~ /\G ((?:[^\\{,}]++ | \\(?:.|\z))++ | . )/gx) {
        if ($1 eq '{') {
            push @stack, [$current = ['']];
        }
        elsif ($1 eq ',' && @stack > 1) {
            push @{$stack[-1]}, ($current = ['']);
        }
        elsif ($1 eq '}' && @stack > 1) {
            my $group = pop @stack;
            $current = $stack[-1][-1];

            # handle the case of brace pairs without commas:
            @{$group->[0]} = map { "{$_}" } @{$group->[0]} if @$group == 1;

            @$current = map {
                my $c = $_;
                map { map { $c . $_ } @$_ } @$group;
            } @$current;
        }
        else { $_ .= $1 for @$current; }
    }

    # handle the case of missing closing braces:
    while (@stack > 1) {
        my $right = pop @{$stack[-1]};
        my $sep;
        if (@{$stack[-1]}) { $sep = ',' }
        else               { $sep = '{'; pop @stack }
        $current = $stack[-1][-1];
        @$current = map {
            my $c = $_;
            map { $c . $sep . $_ } @$right;
        } @$current;
    }

    return @$current;
}
```

A complete solution, but one that contains magic. I mean, what all does `my @stack = ([my $current = ['']])` do?

I copied, modernized and unmagick'd some but not all of the code here:

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

# Task #1
#       Write a script to demonstrate brace expansion. For example, script
#       would take command line argument
#         Perl {Daily,Weekly,Monthly,Yearly} Challenge
#       and should expand it and print like below:
#         Perl Daily Challenge
#         Perl Weekly Challenge
#         Perl Monthly Challenge
#         Perl Yearly Challenge

# HT https://rosettacode.org/wiki/Brace_expansion#Perl

use JSON;
my $json = JSON->new->pretty->canonical;

my $argv = join ' ', @ARGV;

# @array holds output from my translation/deconstruction of this work
# @expand holds output from the original
my @array = expand($argv);
my @expand = brace_expand($argv);


say $argv;
say '-' x length $argv;
say join "\n", @array;
say '-' x length $argv;
say join "\n", @expand;
say '-' x length $argv;
exit;

sub expand ($input) {
    my @stack = ( [ my $current = [''] ] );
    my @input = $input =~ /\G ((?:[^\\{,}]++ | \\(?:.|\z))++ | . )/gx;

    # (?:whatever)  -- non-grouping
    # [^\\{,}]++    -- match 1 or more characters that are not curly or comma
    # \z            -- match end of string
    # \\(?:.|\z))   -- escape characters
    # .             --  any character, which would have to be a comma or curly

    # (matching (more than one(one or more non-curly noncommas |
    #       escaping chars and end of line)) ) or one of anything left

    for my $token (@input) {
        if ( $token eq '{' ) { push @stack, ( [ $current = [''] ] ) }
        elsif ( $token eq ',' && @stack > 1 ) {
            push @{ $stack[-1] }, ( $current = [''] );
        }
        elsif ( $token eq '}' && @stack > 1 ) {
            my $group = pop @stack;
            $current = $stack[-1][-1];

            # handle the case of brace pairs without commas:
            @{ $group->[0] } = map { "{$_}" } @{ $group->[0] }
                if @$group == 1;

            # this is the part where the most magic happens
            @$current = map {
                my $c = $_;
                map {
                    map { $c . $_ }
                        @$_
                } @$group;
            } @$current;
        }
        else {
            $_ .= $token for @$current;
        }
        say $json->encode( [ $token, \@stack ] );
    }

    # where I'm seeing it, this just pops out the deepest subarray
    # because it's done by now.
    # Oh, it handles missing close-braces
    while ( @stack > 1 ) {
        my $right = pop @{ $stack[-1] };
        my $sep;
        if   ( @{ $stack[-1] } ) { $sep = ',' }
        else                     { $sep = '{'; pop @stack }
        $current  = $stack[-1][-1];
        @$current = map {
            my $c = $_;
            map { $c . $sep . $_ } @$right;
        } @$current;
    }

    return @$current;
}

# the example code, which I did not modify
sub brace_expand {
    my $input = shift;
    my @stack = ( [ my $current = [''] ] );

    while ( $input =~ /\G ((?:[^\\{,}]++ | \\(?:.|\z))++ | . )/gx ) {

        if ( $1 eq '{' ) {
            push @stack, [ $current = [''] ];
        }
        elsif ( $1 eq ',' && @stack > 1 ) {
            push @{ $stack[-1] }, ( $current = [''] );
        }
        elsif ( $1 eq '}' && @stack > 1 ) {
            my $group = pop @stack;
            $current = $stack[-1][-1];

            # handle the case of brace pairs without commas:
            @{ $group->[0] } = map { "{$_}" } @{ $group->[0] }
                if @$group == 1;

            @$current = map {
                my $c = $_;
                map {
                    map { $c . $_ }
                        @$_
                } @$group;
            } @$current;
        }
        else { $_ .= $1 for @$current; }
    }

    # handle the case of missing closing braces:
    while ( @stack > 1 ) {
        my $right = pop @{ $stack[-1] };
        my $sep;
        if   ( @{ $stack[-1] } ) { $sep = ',' }
        else                     { $sep = '{'; pop @stack }
        $current  = $stack[-1][-1];
        @$current = map {
            my $c = $_;
            map { $c . $sep . $_ } @$right;
        } @$current;
    }

    return @$current;
}
```

I actually love this, even though I don't understand it. The regex is the kind of thing that should be written with comments, and I so rarely go that far, I've forgotten which flags it'd take to make it work.

But here, we have the output, in JSON format, so we can look at each step within that first loop see the state of `$token` and `@stack`:

```text

[
   "Perl ",
   [
      [
         [
            "Perl "
         ]
      ]
   ]
]

[
   "{",
   [
      [
         [
            "Perl "
         ]
      ],
      [
         [
            ""
         ]
      ]
   ]
]

[
   "Daily",
   [
      [
         [
            "Perl "
         ]
      ],
      [
         [
            "Daily"
         ]
      ]
   ]
]

[
   ",",
   [
      [
         [
            "Perl "
         ]
      ],
      [
         [
            "Daily"
         ],
         [
            ""
         ]
      ]
   ]
]

[
   "Weekly",
   [
      [
         [
            "Perl "
         ]
      ],
      [
         [
            "Daily"
         ],
         [
            "Weekly"
         ]
      ]
   ]
]

[
   ",",
   [
      [
         [
            "Perl "
         ]
      ],
      [
         [
            "Daily"
         ],
         [
            "Weekly"
         ],
         [
            ""
         ]
      ]
   ]
]

[
   "Monthly",
   [
      [
         [
            "Perl "
         ]
      ],
      [
         [
            "Daily"
         ],
         [
            "Weekly"
         ],
         [
            "Monthly"
         ]
      ]
   ]
]

[
   ",",
   [
      [
         [
            "Perl "
         ]
      ],
      [
         [
            "Daily"
         ],
         [
            "Weekly"
         ],
         [
            "Monthly"
         ],
         [
            ""
         ]
      ]
   ]
]

[
   "Yearly",
   [
      [
         [
            "Perl "
         ]
      ],
      [
         [
            "Daily"
         ],
         [
            "Weekly"
         ],
         [
            "Monthly"
         ],
         [
            "Yearly"
         ]
      ]
   ]
]

[
   "}",
   [
      [
         [
            "Perl Daily",
            "Perl Weekly",
            "Perl Monthly",
            "Perl Yearly"
         ]
      ]
   ]
]

[
   " Challenge",
   [
      [
         [
            "Perl Daily Challenge",
            "Perl Weekly Challenge",
            "Perl Monthly Challenge",
            "Perl Yearly Challenge"
         ]
      ]
   ]
]

Perl {Daily,Weekly,Monthly,Yearly} Challenge
--------------------------------------------
Perl Daily Challenge
Perl Weekly Challenge
Perl Monthly Challenge
Perl Yearly Challenge
--------------------------------------------
Perl Daily Challenge
Perl Weekly Challenge
Perl Monthly Challenge
Perl Yearly Challenge
--------------------------------------------
```

Again, I love this. This is very clever. And I cannot claim credit.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
