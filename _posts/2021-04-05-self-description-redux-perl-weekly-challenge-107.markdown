---
layout: post
title: "Self Description Redux: Perl Weekly Challenge 107"
author: "Dave Jacoby"
date: "2021-04-05 19:18:29 -0400"
categories: ""
---

I'm not as hung up on this one as I was last week, so today I'm blogging my response to [Challenge #107](https://perlweeklychallenge.org/blog/perl-weekly-challenge-107/) promptly.

### TASK #1 › Self-descriptive Numbers

> Submitted by: Mohammad S Anwar  
> Write a script to display the first three self-descriptive numbers. [As per wikipedia, the definition of **Self-Descriptive Number** is](https://en.wikipedia.org/wiki/Self-descriptive_number)
>
> > In mathematics, a self-descriptive number is an integer m that in a given base b is b digits long in which each digit d at position n (the most significant digit being at position 0 and the least significant at position b−1) counts how many instances of digit n are in m.
>
> **WARNING:  
> I realised just before the launch this task was also part of the week 43 and contributed by Laurent Rosenfeld. It is too late to change now. Feel free to share your previous solutions if you took part in the week 43 already. I should have been more carefull, sorry.**

So, I _could_ simply copy and paste my [answer from Challenge #43](https://jacoby.github.io/2020/01/17/perl-weekly-challenge-43-rings-and-selfdescription.html), but I'm not gonna. I do like this one more anyway.

We know the first three (in base-10) are `[1210, 2020, 21200]`, and we know that soon after, we're jumping into huge numbers like `6210001000`. Perhaps not _soon_ after, if we're working iteratively. So, this time, I created a function `is_self_descriptive()` and ran every number through it, stopping when we had the requisite three numbers.

(I did auto-quit at one billion, which, when it comes to number theory, is quite small, but I knew the answers I wanted were well within.)

There's one optimization I added to reduce the rabbit holes I had to chase into: I found the length of the number and the highest digit in the number, and if that high digit is greater than the size, it'll never be self-descriptive, so I exit there.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

use List::Util qw{ max };

my $n = 1;
my @self_desc;

while ( scalar @self_desc < 3 ) {
    if ( is_self_descriptive($n) ) {
        push @self_desc, $n;
    }
    $n++;
    exit if $n > 1_000_000_000;
}

sub is_self_descriptive ( $n ) {
    my $max = max split m{}, $n;
    my $l   = -1 + length $n;
    return 0 if $max > $l;

    my @arr;
    for my $i ( 0 .. -1 + length $n ) { $arr[$i] = 0 }
    for my $i ( split m{|}, $n ) {
        $arr[$i]++;
    }
    my $r = 0 + ( join '', map { $_ || 0 } @arr );
    return 0 if $r != $n;
    return 1;
}

say join "\n\t", scalar @self_desc, @self_desc;
```

```text
3
        1210
        2020
        21200
```

### TASK #2 › List Methods

> Submitted by: Mohammad S Anwar  
> Write a script to list methods of a package/class.

I'm not the happiest with this one. The package is not independent, because if I did `use lib '.';use Calc;`, the output would include `input`.

This _was_ the easiest solution: Look within `Calc`'s symbol table. If I was to be bold, I could've looked through the program's full symbol table. This is a method I took from [APP::perlbrew](https://metacpan.org/source/GUGOD/App-perlbrew-0.91/lib%2FApp%2Fperlbrew.pm), and borrowed to allow me to create my own expandable commands. It's also where I learned about [LevenshteinDistance](https://en.wikipedia.org/wiki/Levenshtein_distance). 


```perlbrew
sub commands {
    my ($self) = @_;
 
    my $package =  ref $self ? ref $self : $self;
 
    my @commands;
    my $symtable = do {
        no strict 'refs';
        \%{$package . '::'};
    };
 
    foreach my $sym (keys %$symtable) {
        if ($sym =~ /^run_command_/) {
            my $glob = $symtable->{$sym};
            if (ref($glob) eq 'CODE' || defined *$glob{CODE}) {
                # with perl >= 5.27 stash entry can points to a CV directly
                $sym =~ s/^run_command_//;
                $sym =~ s/_/-/g;
                push @commands, $sym;
            }
        }
    }
 
    return @commands;
}
 ```

In that code, it specifically searches for entries in the symbol table that start with `run_command_`, so you're not just going to touch any available function, but you could just as easily search for `Calc` (which should be a hashref_(?)_) and find the coderefs within.

When I abuse this code, I use [Exporter](https://metacpan.org/pod/Exporter) to put the functions/methods/coderefs I want into the main symbol table and go from there, which is what I _think_ is going on within App::perlbrew.

Again, I _didn't_ do that here. I simply addressed the known, hard-coded package requested. I rarely dive in that far, but using the symbol table as a dispatch table is _fun!_

I may have to amend this response.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

for my $k ( sort keys %Calc:: ) {
    say $k;
}

package Calc;

use strict;
use warnings;

sub new { bless {}, shift; }
sub add { }
sub mul { }
sub div { }

1;
```

```text
BEGIN
add
div
mul
new
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
