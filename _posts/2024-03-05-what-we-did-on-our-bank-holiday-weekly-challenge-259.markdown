---
layout: post
title: "What We Did On Our Bank Holiday: Weekly Challenge #259"
author: "Dave Jacoby"
date: "2024-03-05 11:45:45 -0500"
categories: ""
---

This is **[Weekly Challenge #259!](https://theweeklychallenge.org/blog/perl-weekly-challenge-259/)**

I don't have much to say about numbers today, but the title, relating to [_What We Did on Our Holidays_](https://en.wikipedia.org/wiki/What_We_Did_on_Our_Holidays), a [Fairport Convention](https://en.wikipedia.org/wiki/Fairport_Convention) album. They're a favorite band for me, following from Richard Thompson being one of my all-time favorite guitarists.

### Task 1: Banking Day Offset

> Submitted by: Lee Johnson  
> You are given a start date and offset counter. Optionally you also get bank holiday date list.
>
> Given a number (of days) and a start date, return the number (of days) adjusted to take into account non-banking days. In other words: convert a banking day offset to a calendar day offset.
>
> Non-banking days are:
>
> 1. Weekends
> 1. Bank holidays

#### Let's Talk About it

> Do Not Write Your Own Date and Time Manipulation Code! -- [Dave Rolsky](https://presentations.houseabsolute.com/a-date-with-perl/#3)

So, we're working with [DateTime](https://metacpan.org/pod/DateTime). The formatting is [ISO8601](https://en.wikipedia.org/wiki/ISO_8601).

Three days into the future would be easy. `$dt->add( days => 3 )`. But that wouldn't look for weekends (`$dt->day_of_week >= 6`) or a bank holiday (`any { $_ eq $dt->ymd } @bank_holidays `)<sup>See below</sup>, using yet another function from [List::Util](https://metacpan.org/pod/List::Util).

So, `while` loop, `next` if weekend, `next` if bank holiday, and keep count otherwise.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use DateTime;
use List::Util qw{ any };

my @examples = (

    {
        start_date    => '2018-06-28',
        offset        => 3,
        bank_holidays => ['2018-07-03']
    },
    { start_date => '2018-06-28', offset => 3 },
    { start_date => '2019-11-01', offset => 3 },
);

for my $example (@examples) {
    my $output = banking_day_offset($example);
    my $input  = '';
    $input .= qq{\$startdate = $example->{start_date}};
    $input .= qq{, \$offset = $example->{offset}};
    $input .=
        qq{, \$bank_holidays = [}
        . ( join ', ', map { qq{'$_'} } $example->{bank_holidays}->@* ) . ']'
        if defined $example->{bank_holidays};

say <<"END";
Input:  $input
Output: $output
END
}

sub banking_day_offset ($obj) {
    my @bank_holidays ;
     @bank_holidays = $obj->{bank_holidays}->@* if defined $obj->{bank_holidays};

    my ( $y, $m, $d ) = split /-/, $obj->{start_date};
    my $dt = DateTime->new( year => $y, month => $m, day => $d );
    my $c  = 0;
    while ( $c < $obj->{offset} ) {
        $dt->add( days => 1 );
        next if $dt->day_of_week == 6;    # Saturday
        next if $dt->day_of_week == 7;    # Sunday
        next if any { $dt->ymd eq $_ } @bank_holidays;
        $c++;
    }

    return $dt->ymd;
}
```

```txt
$ ./ch-1.pl
Input:  $startdate = 2018-06-28, $offset = 3, $bank_holidays = ['2018-07-03']
Output: 2018-07-04

Input:  $startdate = 2018-06-28, $offset = 3
Output: 2018-07-03

Input:  $startdate = 2019-11-01, $offset = 3
Output: 2019-11-06
```

### Task 2: Line Parser

> Submitted by: Gabor Szabo  
> You are given a line like below:
>
> `{%  id   field1="value1"    field2="value2"  field3=42 %}`
>
> Where
>
> 1. "id" can be \w+.
> 1. There can be 0 or more field-value pairs.
> 1. The name of the fields are \w+.
> 1. The values are either number in which case we don't need double quotes or string in  
>    which case we need double quotes around them.
>
> The line parser should return structure like below:

```json
{
       name => id,
       fields => {
           field1 => value1,
           field2 => value2,
           field3 => value3,
       }
}
```

> It should be able to parse the following edge cases too:
>
> {%`  youtube title="Title \"quoted\" done" %}`
>
> and
>
> `{%  youtube title="Title with escaped backslash \\" %}`

#### Let's Talk About it

I had to expend some clever on this one.

I had thoughts about making this in one big regex, and I hope some master is doing just that, but I couldn't figure out the way, so instead I repeatedly matched a few cases, being a field without value, a field with a numerical value, a field with a one-word value, and a field with spaces and/or escaped characters. I would match with a regex, break it into field and value, where appropriate, and erase that field from the line.

I'm not using much for regular expressions, but I suppose this is very much in the _"this looks like line noise"_ territory.

Consider `my ( $field, $value ) = $line =~ /(\w+)=\"([\s\w\\\"]+)\"\s/`. This is very much a read-from-the-middle thing, because at core, it's a matching regex. `$line =~ /REGEX/`. We match two things (more on that later), and line returns an array of what it caught.

I _could_ do `my @array = $list =~ /REGEX/`, but by using the `list` operator, I'm able to put the values in the variables I want.

Which gets us to the regex, which I perhaps should've commented, which I could've done with `/REGEX/x`. Anyway...

```perl
$line =~
    /(\w+)  # match a block of one or more word characters
    =
    \"
    (       # the matching
        [   # a character class
            \s  # a space character
            \w  # a word character
            \\  # an escaped backslash
            \"  # an escaped quote
                # this list could be expanded
        ]+  # one or more members of this class
    )
    \"\s # closing quote and space character
    /x
```

I should normalize commenting my regular expressions, because honestly, even as an experienced guy, I would probably look at `/(\w+)=\"([\s\w\\\"]+)\"\s/` and break my flow.

Because that's what the examples showed, I formatted the output with [JSON](https://metacpan.org/pod/JSON). I think I understand that the current suggestion is [Cpanel::JSON::XS ](https://metacpan.org/pod/Cpanel::JSON::XS), but that's just so much longer to type! Maybe using [YAML::XS ](https://metacpan.org/pod/YAML::XS) would've been fun...

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use JSON;
use List::Util qw{ sum0 };

my $json = JSON->new->pretty->canonical;

my @examples = (

    '{%  youtube title="Title with escaped backslash \\" %}',
    '{%  id   field1="value1"    field2="value2"  field3=42 %}',
    '{%  jacoby language1="perl" language2="javascript" hobby="guitar" %}',
    '{%  hansolo ship="falcon"    friend="wookie"  love="leia" %}',
    '{%  linkedin jobs="multiple words in one line" %}',
    '{%  youtube answer=42       title="Title \"quoted\" done" %}',
);

for my $example (@examples) {
    my $output = line_parse($example);
    my $jo     = $json->encode($output);

say <<"END";
Input:  \$line = '$example'

Output:
    $jo
END
}

sub line_parse ($line) {
    my $output = {};
    while ( $line !~ /^\{\% \s* \%\}/ ) {

        # value matches word="word"
        if ( $line =~ /^\{\% \s* \w+=\"\w+\"/ ) {
            my ( $field, $value ) = $line =~ /(\w+)=\"(\w+)\"\s/;
            $output->{field}{$field} = $value;
            $line =~ s{(\w+=\"\w+\")\s}{};
            next;
        }

        # value matches word=number
        if ( $line =~ /^\{\% \s* \w+=\d+/ ) {
            my ( $field, $value ) = $line =~ /(\w+)=(\d+)\s/;
            $output->{field}{$field} = $value;
            $line =~ s{(\w+=\d+)\s}{};
            next;
        }

        # value matches word="word word word" and also backslash
        if ( $line =~ /^\{\% \s* \w+=\"[\s\w\\\"]+\"/ ) {
            my ( $field, $value ) = $line =~ /(\w+)=\"([\s\w\\\"]+)\"\s/;
            $output->{field}{$field} = $value;
            $line =~ s{(\w+=\"[\s\w\\\"]+\")\s}{};
            next;
        }

        # value matches only word
        if ( $line =~ /^\{\% \s* \w+/ ) {
            my ($field) = $line =~ m{(\w+)};
            $line =~ s{(\w+)}{}mix;
            if   ( $output->{name} ) { $output->{field}{$field} = ''; }
            else                     { $output->{name}          = $field; }
            next;
        }
        substr( $line, 3, 1 ) = '';
    }
    return $output;
}
```

```txt
$ ./ch-2.pl
Input:  $line = '{%  youtube title="Title with escaped backslash \" %}'

Output:
    {
   "field" : {
      "title" : "Title with escaped backslash \\"
   },
   "name" : "youtube"
}


Input:  $line = '{%  id   field1="value1"    field2="value2"  field3=42 %}'

Output:
    {
   "field" : {
      "field1" : "value1",
      "field2" : "value2",
      "field3" : "42"
   },
   "name" : "id"
}


Input:  $line = '{%  jacoby language1="perl" language2="javascript" hobby="guitar" %}'

Output:
    {
   "field" : {
      "hobby" : "guitar",
      "language1" : "perl",
      "language2" : "javascript"
   },
   "name" : "jacoby"
}


Input:  $line = '{%  hansolo ship="falcon"    friend="wookie"  love="leia" %}'

Output:
    {
   "field" : {
      "friend" : "wookie",
      "love" : "leia",
      "ship" : "falcon"
   },
   "name" : "hansolo"
}


Input:  $line = '{%  linkedin jobs="multiple words in one line" %}'

Output:
    {
   "field" : {
      "jobs" : "multiple words in one line"
   },
   "name" : "linkedin"
}


Input:  $line = '{%  youtube answer=42       title="Title \"quoted\" done" %}'

Output:
    {
   "field" : {
      "answer" : "42",
      "title" : "Title \\\"quoted\\\" done"
   },
   "name" : "youtube"
}
```

### Notes

[I have recently been thinking about the best way to find if an element is in an array.](https://jacoby.github.io/2024/03/01/cans-of-worms-benchmarking-finding-an-element-in-array.html) I do often use `my %list = map { $_ => 1 } @list` on occasion, and that's demonstrably faster, but yeah, now you have an array and a hash, and that's gonna take up memory, so I'm trying to normalize on. I mean, if you have the memory and need the speed, and you're going to do it a _lot_, keep that in your back pocket.

But reader, perler and Weekly Challenge participant [andrezgz](https://github.com/andrezgz) had [some things to say](https://github.com/jacoby/jacoby.github.io/issues/13), with the following results.

```text
========================
count:  400
array:  1000
comp:   100

                Rate prototype sub  grep loop and last  any first firstidx hash arrayidx
prototype sub 9.24/s            --  -57%          -73% -79%  -80%     -80% -95%     -98%
grep          21.3/s          131%    --          -37% -52%  -54%     -54% -87%     -96%
loop and last 33.7/s          265%   58%            -- -24%  -27%     -27% -80%     -93%
any           44.6/s          383%  110%           32%   --   -3%      -4% -73%     -91%
first         46.2/s          400%  117%           37%   3%    --      -0% -73%     -90%
firstidx      46.3/s          401%  117%           37%   4%    0%       -- -72%     -90%
hash           168/s         1719%  689%          398% 276%  264%     263%   --     -65%
arrayidx       476/s         5054% 2136%         1312% 967%  931%     929% 183%       --
```

As I say above, I'm going to try to stick with `any` unless I very much care about speed and very much don't care about memory.

And thank you , andrezgz, for your contribution to this question.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
