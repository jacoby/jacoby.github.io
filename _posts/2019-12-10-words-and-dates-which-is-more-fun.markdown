---
layout: post
title:  "Words and Dates: Which is more fun?"
author: "Dave Jacoby"
date:   "2019-12-10 17:58:38 -0500"
categories: ""
---

Here's me writing about [Perl Weekly Challenge 38](https://perlweeklychallenge.org/blog/perl-weekly-challenge-038/). 

The first challenge is working with a seven-digit date format, such that `2230120` becomes `1923-01-20`. I won't go too far into it, because the basic steps are:

* Determine what date the string represents by breaking it into pieces
* Putting those pieces into DateTime in order to ensure the date specified is an actual date
* Using DateTime's `ymd()` to output the formatted date

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
  qw{ experimental::postderef experimental::smartmatch experimental::signatures };

use Carp;
use DateTime;
use Try::Tiny;

# handle command-line input
if (@ARGV) { say date_finder( $ARGV[0] ) }
# testing data 
else {
    for my $string (qw{2230120 1230120 1230231}) {
        say date_finder($string)
    }
}
exit;

# break the date string into constituent parts, which will cause errors
# if ill-formatted, and then feed that into DateTime, for formatting, but
# also for catching non-existent dates, like 2220931, for example.
sub date_finder ( $string ) {
    my ( $century, $year, $month, $day ) = $string =~ m{
      ^         # start of string
      (\d)      # century value 1-2
      (\d{2})   # year value 00-99
      (\d{2})   # month value 01-12
      (\d{2})   # day value 01-31, plus
      $         # end of string
      }mx;

    croak qq{Bad value: Century $century} if $century != 2 && $century != 1;
    croak qq{Bad value: Month   $month} if $month < 1 || $month > 12;
    croak qq{Bad value: Day     $day}   if $day < 1   || $day > 31;

    try {
        # here we make a DateTime object with the values give us
        # and if those values are invalid, DateTime croaks, which
        # we catch
        my $y    = ( $century == 2 ? '19' : '20' ) . $year;
        my $date = DateTime->new(
            year      => $y,
            month     => $month,
            day       => $day,
            time_zone => 'floating'
        );
        return $date->ymd;
    }
    catch {
        # catching the death of DateTime just to die our own way 
        # MIGHT be antisocial, but I accept it for now.
        croak "Bad value: Input is not a day ($string)";
    };
}
```

And here's it running, and failing to create a February 31st.

```text
$ ./dates.pl
1923-01-20
2023-01-20
Bad value: Input is not a day (1230231) at ./dates.pl line 58.
```

The next task is much more interesting.

> Lets assume we have tiles as listed below, with an alphabet (_A..Z_) printed on them. Each tile has a value, e.g. **A (1 point)**, **B (4 points)** etc. You are allowed to draw **7 tiles** from the lot randomly. Then try to form a word using the **7 tiles** with maximum points altogether. You don’t have to use all the **7 tiles** to make a word. You should try to use as many tiles as possible to get the maximum points.

So, we're dealing with an alternative Scrabble, but which aspects of scrabble are we emulating? Scoring words? Determining what constructs _are_ words? Pulling tiles?

I think all three.  

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
  qw{ experimental::postderef experimental::smartmatch experimental::signatures };

use List::Util qw{ sum0 uniq };
use Getopt::Long;

my $verbose = 0;
GetOptions(
    'verbose' => \$verbose,
);

my @tiles = get_tiles();
@tiles = sort @tiles;
say join ' ', @tiles;
say '-------------';

my @list = permute_array(\@tiles);
my @list2;

for my $array ( @list ) {
    for my $l ( 0 .. 6 ) {
        state $dict;
        my @array2 = map { $array->[$_] } 0 .. $l;
        my $word2 = join '', @array2;
        next if $dict->{$word2}++;
        push @list2, \@array2;
    }
}

my $best = '';
my $top = 0;
for my $r ( @list2 ) {
    my $word = join  '', $r->@*;
    my $score = score_word($word);
    next if $score <1;
    say join "\t", '', $score,$word if $verbose;
    if ( $score > $top ) {
        $best = $word;
        $top = $score;
    }
}

say qq{    $best ($top)};

sub permute_array ( $array ) {
    return $array if scalar $array->@* == 1;
    my @response = map {
        my $i        = $_;
        my $d        = $array->[$i];
        my $copy->@* = $array->@*;
        splice $copy->@*, $i, 1;
        my @out = map { unshift $_->@*, $d; $_ } permute_array($copy);
        @out
    } 0 .. scalar $array->@* - 1;
    return @response;
}

sub get_tiles {
    state $counts = counts();
    my @letters = split //, join '', map { $_ x $counts->{$_} } 'a' .. 'z';
    my @output;
    for ( 1 .. 7 ) {
        my $n = int rand scalar @letters;
        my $l = $letters[$n];
        splice @letters, $n, 1;
        push @output, $l;
    }
    return wantarray ? @output : \@output;
}

sub score_word( $word ) {
    state $words  = words();
    state $counts = counts();
    state $scores = scores();
    return 0 unless length $word <= 7;
    return 0 unless $words->{$word};
    for my $letter ( 'a' .. 'z' ) {
        if ( $word =~ /$letter/ ) {
            my $count = () = $word =~ /$letter/gi;
            return 0 if $count > $counts->{$letter};
        }
    }
    return sum0 map { $scores->{$_} } split //, $word;
}

sub words {
    my $file = '/usr/share/dict/words';
    my $words;
    if ( -f $file && open my $fh, '<', $file ) {
        for my $word ( map { chomp; lc $_ } <$fh> ) {
            $words->{$word} = 1;
        }
    }
    return $words;
}

sub counts {
    my $counts;
    map { $counts->{$_} = 2 } qw{ k q x };
    map { $counts->{$_} = 3 } qw{ d f g h j l o r v };
    map { $counts->{$_} = 4 } qw{ c m n };
    map { $counts->{$_} = 5 } qw{ b i p t u w y z };
    map { $counts->{$_} = 7 } qw{ s };
    map { $counts->{$_} = 8 } qw{ a };
    map { $counts->{$_} = 9 } qw{ e };
    return $counts;
}

sub scores {
    my $scores;
    map { $scores->{$_} = 1 } qw{ a g i s u x z };
    map { $scores->{$_} = 2 } qw{ e j l r v y };
    map { $scores->{$_} = 3 } qw{ f d p w };
    map { $scores->{$_} = 4 } qw{ b n };
    map { $scores->{$_} = 5 } qw{ t o h m c };
    map { $scores->{$_} = 10 } qw{ k q };
    return $scores;
}
```

Discussion points:

* Rather than using my old list of words culled from CERIAS dictionary lists, I am simply using `/usr/share/dict/words`, which does not come in by default with Ubuntu, or at least Ubuntu WSL. `::shrug::`
* It doesn't come with `git bash`, and so I should **really** have forced a quit if `words` isn't available.
* I have fun with `map` to make the two key hashes, containing the number of tiles per letter and the score per letter, rather than having `a => 1, b => 4` and such.
* Many of my old standbys, like `wantarray` and `state` are used. I perhaps should write a _this is how **I** write Perl_ post explaining some of them later.
* I use a dose of clever to get an array of all the tiles. `'A' x 7` becomes `AAAAAAA`, and I `join` and `split` them. I suppose there's a way to just pass the values in a way where I don't get `[ ['a','a','a','a','a','a','a','a'] , ['b','b','b','b','b'] ]`, and I should find it someday...
* The next key is to pull elements from that array each time you pull a tile, and we use `splice @array, $index, $count` to do so, or in this case, `splice @letters, $n, 1`. I fully forgot about it until ...
* We have to take the tiles and show all the options, and given `a`, `b` and `c`, you have the options of `abc`, `acb`, `bac`, `bca`, `cab`, and `cba`, but clearly, this forgets `ab`, `ac`, `ba`, `bc`, `ca`, `bc`, plus `a`, `b` and `c`. It would be pretty dire to have a single letter as the most valuable word, but a tile list of `e e e e e e q` _is_ possible. I used a standard `permute_array` function I had used in my **Magic Box/Overkill** solutions, and then used sub-arrays to ensure we had 1-6 letter choices as well.
* Scoring was about the easiest part, using `map` to change key for value and `sum0` from `List::Util` to count 'em up. `sum` returns `undef` instead of `0` for empty array, which should not be an issue, but if you can guarantee a numeric output, do so.

I suppose I should have some sample output...

```text
💻 jacoby@Marvin 18:50 41°F    _  /mnt/c/Users/jacob/Downloads
$ ./words.pl
f h i l m n w
-------------
    whim (14)

💻 jacoby@Marvin 18:50 41°F    _  /mnt/c/Users/jacob/Downloads
$ ./words.pl
b d o p p t v
-------------
    dot (13)

💻 jacoby@Marvin 18:50 41°F    _  /mnt/c/Users/jacob/Downloads
$ ./words.pl
a b b e l l s
-------------
    babels (14)

💻 jacoby@Marvin 18:51 41°F    _  /mnt/c/Users/jacob/Downloads
$ ./words.pl
a b p s t v x
-------------
    pabst (14)
    
💻 jacoby@Marvin 18:51 41°F    _  /mnt/c/Users/jacob/Downloads
$ ./words.pl -v
b c c e n q w
-------------
        4       b
        6       be
        10      ben
        5       c
        2       e
        6       en
        4       n
        6       ne
        10      neb
        9       new
        10      q
        3       w
        7       wb
        5       we
        9       web
        9       wen
    ben (10)

```

Come to think of it, listing all the most-valuable found words, not just one, might've been a thing. 

Anyway, this one is has been quite enjoyable. I think it's clear, from lines of blog text alone, I found the word challenge more fun than the date challenge, but both were great.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


