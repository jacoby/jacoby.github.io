---
layout: post
title: "Hanging On The Telephone: Perl Weekly Challenge #110"
author: "Dave Jacoby"
date: "2021-04-27 20:10:04 -0400"
categories: ""
---

Again, I took on the [Perl Weekly Challenge](https://perlweeklychallenge.org/blog/perl-weekly-challenge-110/).

### TASK #1 › Valid Phone Numbers

> Submitted by: Mohammad S Anwar  
> You are given a text file.
>
> Write a script to display all valid phone numbers in the given text file.

I'm kinda unsure about this. The repeated use of `44` at the start implies it's a country code, the one for the United Kingdom, and I have it by authority that the remaining digits for UK numbers are _much more complex_ than that.

[![Tom Scott Rants about Phone Numbers for Roughly 16 Minutes ](https://jacoby.github.io/images/tom_scott_phone.jpg)](https://www.youtube.com/watch?v=LsxRaFNropw)

I know that US numbers are generally

- _Country Code_ is **1**, because **America!**
- _Area Code_ used to have a `0` or `1` infixed between two other digits in America, but with the expansion of cellular phones in the 1990s and later, they started adding area codes that don't comply to that, such as my own `765`, and so a valid-by-form number could have an invalid area code. Also, `\d11` will match various phone-company-specific services, with `411` being *information* and `911` being *emergency*.
- _Region Code_, and the main thing I can think of is that the phone industry took **555** for administrivia, so that the entertainment industry can use those to say phone numbers that are not valid and such won't ring for random homes and businesses. (In the movie *Sneakers*, [a character gives River Phoenix's character her phone number](https://www.imdb.com/title/tt0105435/trivia?item=tr4144874), but used a real, non-555 number, which was, I was told, the San Francisco offices of the National Security Agency. `No More Secrets` for `No Such Agency`, I suppose.) The take-away from Tom Scott's rant is that you cannot be sure that a UK number will be of a specific length.

I think the **Acceptable Formats** bit is specifically about handling the country code, but, as I said, the US has that one-digit number, and other countries have [up to three(?)](https://countrycode.org/), with much of the Caribbean counting as US, I _think(?)_

So, I am hand-wavy that the rules as given are valid, but once we accept the rules, we start to implement them, and the quickest way to handle that is **regular expressions**. ["Now you have two problems", as jwz once said](https://www.jwz.org/blog/2014/05/so-this-happened/), but a way to make it less of a problem is to comment it, and thus we do.

I use `_is_phone_number` in `grep` to filter out non-compliant numbers, where I return `1` if valid and default to `0`.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

use Getopt::Long;

my $file = 'phone_numbers.txt';
GetOptions( 'file=s' => \$file, );

if ( -f $file && open my $fh, '<', $file ) {

    # remove newlines from the numbers 
    my @numbers = map { chomp $_; $_ } <$fh>;
    close $fh;
    say join "\n", ( grep { is_phone_number($_) } @numbers ), '';
}

sub is_phone_number( $string ) {
    return 1 if $string =~ m{
        ^\ *    # starts with maybe space
        \d{4}   # then has four digits 
        \       # then one space
        \d{10}  # then has ten digits 
        \s*$    # with maybe ending spaces
        }mix;
    return 1 if $string =~ m{
        ^\ *    # starts with maybe space
        \+\d{2} # then has a plus sign and two digits 
        \ +     # then one or more space
        \d{10}  # then has ten digits 
        \s*$    # with maybe ending spaces
        }mix;
    return 1 if $string =~ m{
        ^\ *        # starts with maybe space
        \(\d{2}\)   # then has two digits within parens
        \ +         # then one or more space
        \d{10}      # then has eight digits 
        \s*$        # with maybe ending spaces
        }mix;
    return 0;
}
```

```text
PS C:\Users\jacob\Documents\GitHub\perlweeklychallenge-club\challenge-110\dave-jacoby\perl> perl .\ch-1.pl
0044 1148820341
 +44 1148820341
(44) 1148820341

```

### TASK #2 › Transpose File

> Submitted by: Mohammad S Anwar  
> You are given a text file.
>
> Write a script to transpose the contents of the given file.

This is the first one I handled from this task. We are supposed to read and write from the file, and because I want to avoid mistakes that have already been found and dealt with, I went with[Text::CSV](https://metacpan.org/pod/Text::CSV) rather than engaging with CSV directly. In the given example, a naive solution is acceptable, but if a name is something like `"Dave, that guy who codes Perl"`, then your naive solution will hang on that comma.

```perl
sub read_csv($file) {
    croak unless -f $file;
    my $object = csv( in => $file );
    return $object;
}

sub write_csv ( $file, $csv ) {
    csv( in => $csv, out => $file );
}
```

So, let's take a cellified implementation of the CSV, because Markdown tables don't believe like I want.

```text
[ name      ] [ age ][ sex ]
[ Mohammad  ] [ 45  ][ m   ]
[ Joe       ] [ 20  ][ m   ]
[ Julie     ] [ 35  ][ f   ]
[ Cristina  ] [ 10  ][ f   ]
```

`name` is `$csv->[0][0]`. `age` is `$csv->[0][1]`. To transpose the whole table, we simply take whatever is in `$csv->[$i][$j]` and put it in `$csv2->[$j][$i]`.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

use Carp;
use JSON;
use Text::CSV qw( csv );

my $json = JSON->new;
my $file = 'input.csv';

my $obj = read_csv($file);
my $jbo = transpose_csv($obj);
write_csv( $file, $jbo );

sub read_csv($file) {
    croak unless -f $file;
    my $object = csv( in => $file );
    return $object;
}

sub transpose_csv($object) {
    my $output = [];
    for my $i ( 0 .. -1 + scalar $object->@* ) {
        for my $j ( 0 .. -1 + scalar $object->[$i]->@* ) {
            $output->[$j][$i] = $object->[$i][$j];
        }
    }
    return $output;
}

sub write_csv ( $file, $csv ) {
    csv( in => $csv, out => $file );
}
```

And, with lnes added for readability

```text
PS C:\Users\jacob\Documents\GitHub\perlweeklychallenge-club\challenge-110\dave-jacoby\perl> .\ch-2.pl ; cat .\input.csv
name,Mohammad,Joe,Julie,Cristina
age,45,20,35,10
sex,m,m,f,f

PS C:\Users\jacob\Documents\GitHub\perlweeklychallenge-club\challenge-110\dave-jacoby\perl> .\ch-2.pl ; cat .\input.csv
name,age,sex
Mohammad,45,m
Joe,20,m
Julie,35,f
Cristina,10,f
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
