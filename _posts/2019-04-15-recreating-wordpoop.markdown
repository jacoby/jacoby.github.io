---
layout: post
title: "Recreating Wordpoop"
author: "Dave Jacoby"
date: "2019-04-15 12:47:57 -0400"
categories: ""
---

It started with the season premiere of _Game of Thrones_. Or, more accurately, the parental guidelines beforehand.

![TV-MA - AC AL N SC V](https://jacoby.github.io/images/got_warnings.jpg)

A Twitter friend tweeted **"It's happening!"** and other asked **"What the fuck is acalnscv???"**

What, indeed?

One way to figure that out is to break it down to constituent parts.

![`perl wordpoop.pl acalnscv | column` ](https://jacoby.github.io/images/wordpoop2.png)

What we see here is that tool at work, finding the words that can be built from the characters `acalnscv`, pushed into columns by `column`, a utility that I should've known existed **years** ago but clearly didn't. (And if you didn't know, now you know.)

So, what is this `wordpoop.pl`?

![TV-MA - AC AL N SC V](https://jacoby.github.io/images/wordpoop1.png)

This is good. It uses `strict` and `warnings`. It also uses `/usr/share/dict/words`, and, well...

`words` contains 99171 words on my system. That's a lot of words, but English is a big language. [CERIAS](https://www.cerias.purdue.edu/) shared a number of dictionary lists on their FTP site (maybe still do) to ease InfoSec people blocking real words as passwords (or whatever their purpose was), but I used it for other purposes, such as solving Boggle and deteriming the longest word you can type just using your left hand on standard US keyboard.

(**#sweaterdresses**)

So I was going to use _my_ list of words rather than the system's.

Also, I started working on this before I got a good look at the code in the image.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

use Carp;
use List::Compare;

# I wrap DBI stuff so I can just enter 'SELECT *' and get back what I want
# and the name IS a Wu-Tang reference.
use lib '/home/jacoby/lib';
use oDB;

# the original just used $ARGV[0] == 'acalnscv', but I see no reason
# why the input couldn't be broken up like 'ac','al','n','sc',v
my $letters = lc join "", @ARGV ;
$letters =~ s/\W//g;

# I croak() instead of die(). Not a big difference.
croak 'No letters provided' unless length $letters;

my @letters = sort split //,$letters; # a,c,a,l,n,s,c,v
my %letters;
map { $letters{$_}++} @letters; # a => 2, c=>2, etc

my @blocked = comp( \@letters ) ; # all letters not involved, like b or d
my @all_words = all_words(); # all almost 300,000 words

my @words = grep { length $_ > 1 } # no one-letter words
            grep {!/\W/}           # no words w/ non-word chars
            @all_words; 

# remove, by letter, every word that cannot be included
for my $l ( @blocked ) {
    @words = grep {!/$l/} @words;
}

# filter the words with check_word
@words = grep { check_word($_) } @words;

say join "\n", @words;
exit;

# uses %letters from above, returning false if the number of times 
# a letter is used is greater than the number of times stored, and
# returning true by default
sub check_word($word) {
    my %ll;
    for my $l ( split //, $word ) {
        $ll{$l}++;
    }
    for my $l ( keys %ll ) {
        return 0 if $ll{$l} > $letters{$l};
    }
    return 1;
}

# could've used List::Compare in main, but it's a lot of complexity
# I can just hide.
sub comp ( $some ) {
    my $all->@* = 'a' .. 'z';
    my $lc = List::Compare->new($all,$some);
    my @comp = $lc->get_unique();
    return @comp;
}

# could've used DB queries to limit and maybe do everything. eh.
sub all_words () {
    my $db = oDB->new('genomics');
    my $q = 'SELECT word FROM dictionary';
    my $r = $db->arrayref($q);
    $r->@* = map { $_->[0] } $r->@*;
    return $r->@*;
}
```

_My_ `wordpoop` works like this:

```bash
💻 ✔ jacoby@oz 13:30 50°F      806s  ~ 
$ ./wordpoop ac al n sc v | column
aa	alca	asa	can	cc	lana	nasal	sal	sn	vasal
aal	aln	ascan	cana	cl	lanas	naval	salva	svan	vc
ac	alva	ava	canal	clan	las	nc	san	svc	vs
acca	alvan	aval	canals	clans	lasa	ncaa	sana	va
acs	an	ca	cans	clava	lava	ns	sc	val
al	ana	caca	canvas	cs	lavas	nv	scala	valsa
ala	anal	cacan	casa	la	ls	sa	scan	van
alan	anas	cal	casal	lac	na	saa	sclav	vans
alans	ansa	calas	cava	lacca	naa	saan	sla	vas
alas	as	calc	caval	lan	nasa	sac	slav	vasa
```

Which isn't identical. I don't think I have uppercase in my list, and I know I don't match case in my comparisons. But alas, it works, and gives me a list that contains a number of words applicable to **Game of Thrones**.

Now, what do we get with `winter is coming`?

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
