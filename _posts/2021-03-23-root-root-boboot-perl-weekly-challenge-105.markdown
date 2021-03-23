---
layout: post
title: "Root, Root, bo-Boot: Perl Weekly Challenge 105"
author: "Dave Jacoby"
date: "2021-03-22 20:32:10 -0400"
categories: ""
---

[Another week, another challenge.](https://perlweeklychallenge.org/blog/perl-weekly-challenge-105/)

### TASK #1 › Nth root

> Submitted by: Mohammad S Anwar  
> You are given positive numbers `$N` and `$k`.
>
> Write a script to find out the `$N`th root of `$k`. For more information, please take a look at the [wiki page](https://en.wikipedia.org/wiki/Nth_root#Computing_principal_roots).
>
> Example  
> Input: $N = 5, $k = 248832  
> Output: 12
>
> Input: $N = 5, $k = 34  
> Output: 2.02

I chose [Logarithmic calculation](https://en.wikipedia.org/wiki/Nth_root#Logarithmic_calculation) because, as a habitual computer clock maker, I feel comfortable with logarithms.

It gives us **n log<sub>b</sub>r = log<sub>b</sub> x**, which reduces to **log<sub>b</sub> r = log<sub>b</sub> x / n**, and because I like myself and don't like working with _e_, I took the advice of [perldoc](https://perldoc.perl.org/functions/log) and set _b_ equal to 10. (_x_ is `$k` and `n` is `$N`). Finally, the _n_th root of \_x_ is _r_, which is **b<sup>(1/n) log<sub>b</sub>x</sup>**

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

use Carp;
use Getopt::Long;

my $k = 16;
my $n = 2;

GetOptions(
    'n=i' => \$n,
    'k=i' => \$k,
);

$n = abs int $n;
$k = abs int $k;

croak 'Zero in input' unless ( $n * $k ) > 0;

my $v = nth_root( $n, $k );
say qq{${n}th root of $k = $v};

# Logarithmic calculation
# r = b ** ( 1/n logb k )
sub nth_root ( $n, $k ) {
    return 10**( ( 1 / $n ) * log10($k) );
}

# https://perldoc.perl.org/functions/log
sub log10 {
    my $n = shift;
    return log($n) / log(10);
}
```

```text
$ ./ch-1.pl
2th root of 16 = 4

$ ./ch-1.pl -n 2 -k 16
2th root of 16 = 4

$ ./ch-1.pl -n 2 -k 34
2th root of 34 = 5.8309518948453

$ ./ch-1.pl -n 5 -k 34
5th root of 34 = 2.02439745849989

$ ./ch-1.pl -n 5 -k 248832
5th root of 248832 = 12
```

### TASK #2 › The Name Game

> Submitted by: Mohammad S Anwar  
> You are given a $name.
>
> Write a script to display the lyrics to the Shirley Ellis song ["The Name Game"](https://open.spotify.com/track/1wQjtqCtUqvaV6CjPKIGdc?si=jma2obeAQaSqF1AFk_27-Q). Please checkout the wiki page for more information.
>
> Example  
> Input: $name = "Katie"  
> Output:
>
>     Katie, Katie, bo-batie,
>     Bonana-fanna fo-fatie
>     Fee fi mo-matie
>     Katie!

I wonder if everyone _still_ knows this song, but I certainly remember it from my youth.

<iframe src="https://open.spotify.com/embed/track/1wQjtqCtUqvaV6CjPKIGdc" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>

[Shirley Ellis covers the rules in the lyrics](https://genius.com/Shirley-ellis-the-name-game-lyrics), but while she sings _"first letter"_, it's really the first consonant sound, which is not the letter. _"Scarlet"_ loses the "Sc", not just the "S", unless there's a way to pronounce "Mcarlet" that doesn't occur to me.

Beyond that, it's fairly simple. "Barry" gets "Bo-Arry". "Mary" gets "Mo-ary". And "Fiona" gets "Fo-Iona".

(Now that I'm done coding and started blogging, "Ph" behaves like "F", so "Phil" should get "Fo-il", but [if I start chasing special cases in names, I could be here until the end of time](https://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/).)

Beyond that, names that start with vowel sounds don't get mangled much, and there is at least one name that's a special case, and unless we're twelve, we want to avoid it.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

use Carp;
use Getopt::Long;

my @letters    = 'A' .. 'Z';
my @vowels     = qw{ A E I O U };
my %vowels     = map  { $_ => 1 } @vowels;
my @consonants = grep { !$vowels{$_} } @letters;
my %consonants = map  { $_ => 1 } @consonants;

my $name = 'Katie';
GetOptions( 'name=s' => \$name );

name_game($name);

sub name_game( $name ) {
    my $Name = ucfirst lc $name;
    croak "Can't do 'Chuck'" if lc $name eq 'chuck';
    my $i      = substr( $Name, 0, 1 );
    my ($init) = $Name =~ m{^([^AEIOU]+)}mix;
    my $y      = $Name;
    $y =~ s{^([^AEIOU]+)}{}mix;

    my $by = 'B' . $y;
    my $fy = 'F' . $y;
    my $my = 'M' . $y;

    if (0) { }
    if ( $vowels{$i} ) {
        $init = '';
        $by   = 'B' . lc($Name);
        $fy   = 'F' . lc($Name);
        $my   = 'M' . lc($Name);
    }
    elsif ( $init eq 'B' ) {
        $by = ucfirst $y;
    }
    elsif ( $init eq 'F' ) {
        $fy = ucfirst $y;
    }
    elsif ( $init eq 'M' ) {
        $my = ucfirst $y;
    }
    say <<"END";
        $Name, $Name, bo-$by
        Bonanna-fanna fo-$fy
        Fee fi mo-$my
        $Name!
END
}
```

```text

$ ./ch-2.pl -n Katie
        Katie, Katie, bo-Batie
        Bonanna-fanna fo-Fatie
        Fee fi mo-Matie
        Katie!

$ ./ch-2.pl -n Dave
        Dave, Dave, bo-Bave
        Bonanna-fanna fo-Fave
        Fee fi mo-Mave
        Dave!

$ ./ch-2.pl -n Scarlet
        Scarlet, Scarlet, bo-Barlet
        Bonanna-fanna fo-Farlet
        Fee fi mo-Marlet
        Scarlet!

 $ ./ch-2.pl -n Allie
        Allie, Allie, bo-Ballie
        Bonanna-fanna fo-Fallie
        Fee fi mo-Mallie
        Allie!

$ ./ch-2.pl -n Chuck
Can't do 'Chuck' at ./ch-2.pl line 31.
        main::name_game("Chuck") called at ./ch-2.pl line 27
```

#### But Wait! There's More!

I decided to pull out the Javascript on this one. The biggest thing I didn't know is how to dip into `process.argv` to get the names in, and the biggest thing I don't think most people know is using a comment block in an anonymous function and casting `.toString` to get a multi-line variable without concatenation

```javascript
"use strict";

let name = get_name(process.argv);
name_game(name);

function name_game(name) {
  name = name.toLowerCase();

  if ( name === 'chuck' ) {
    throw 'Name not allowed'
  }

  let lyrics = function () {
    /*
        NAME, NAME, bo-BY
        Bonanna-fanna fo-FY
        Fee fi mo-MY
        NAME!
    */
  }
    .toString()
    .split(/\/\*/)[1]
    .split(/\*\//)[0];

  let Name = ucfirst(name);
  let i = Name.substr(0, 1);
  let inits = Name.match(/^([^AEIOUaeiou]+)/);
  let y = Name.replace(/^([^AEIOUaeiou]+)/, "");

  let by = "B" + y;
  let fy = "F" + y;
  let my = "M" + y;

  let vowels = {
    A: 1,
    E: 1,
    I: 1,
    O: 1,
    U: 1,
  };

  if (0) {
  } else if (i === "B") {
    by = ucfirst(y);
  } else if (i === "F") {
    by = ucfirst(y);
  } else if (i === "M") {
    by = ucfirst(y);
  } else if (vowels[i]) {
    console.log("VOWEL");
    by = "B" + name;
    fy = "F" + name;
    my = "M" + name;
  }

  lyrics = lyrics.replace(/NAME/g, Name);
  lyrics = lyrics.replace(/BY/, by);
  lyrics = lyrics.replace(/FY/, fy);
  lyrics = lyrics.replace(/MY/, my);

  console.log(lyrics);
}

function get_name(argv) {
  let path = require("path");
  let programName = path.basename(__filename);
  let re = new RegExp(programName, "g");
  let name = argv.pop();

  if (name.match(re) ? 1 : 0) {
    name = "Dave";
  }
  return name;
}

function ucfirst(str) {
  str = str.toLowerCase();
  var firstLetter = str.substr(0, 1);
  return firstLetter.toUpperCase() + str.substr(1);
}
```

```text
PS C:\Users\jacob> node .\name_game.js chuck

C:\Users\jacob\name_game.js:10
    throw 'Name not allowed'
    ^
Name not allowed
(Use `node --trace-uncaught ...` to show where the exception was thrown)
PS C:\Users\jacob> node .\name_game.js dave

        Dave, Dave, bo-Bave
        Bonanna-fanna fo-Fave
        Fee fi mo-Mave
        Dave!

PS C:\Users\jacob> node .\name_game.js scarlet

        Scarlet, Scarlet, bo-Barlet
        Bonanna-fanna fo-Farlet
        Fee fi mo-Marlet
        Scarlet!

PS C:\Users\jacob> node .\name_game.js fiona

        Fiona, Fiona, bo-Iona
        Bonanna-fanna fo-Fiona
        Fee fi mo-Miona
        Fiona!
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
