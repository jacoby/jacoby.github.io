---
layout: post
title: "The Miserable Metal Ox: Perl Weekly Challenge #013"
author: "Dave Jacoby"
date: "2021-03-09 17:42:14 -0500"
categories: ""
---

### TASK #1 › Chinese Zodiac

> Submitted by: Mohammad S Anwar  
> You are given a year `$year`.
>
> Write a script to determine the Chinese Zodiac for the given year $year. Please check out wikipage for more information about it.
>
> The animal cycle: **Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig.**
> The element cycle: **Wood, Fire, Earth, Metal, Water.**

At this point, I would like to quote [Dave Rolsky](https://presentations.houseabsolute.com/a-date-with-perl/#3):

> **Do Not Write Your Own Date and Time Manipulation Code!**  
> **Do Not Write Your Own Date and Time Manipulation Code!**  
> **Do Not Write Your Own Date and Time Manipulation Code!**  
> **Do Not Write Your Own Date and Time Manipulation Code!**

I bring this up because while I could probably write code that works through the cycle from some "Year 0" and count forward and such, there is bound to be confusion based on when this group or that group changed what time means, so it's safer to go this way.

Also, Chinese New Year was February 12, which means that for almost a month an a half, a naïve implementation will tell you it's **Metal Ox** when it's really still **Metal Rat**.

So I used [DateTime::Calendar::Chinese](https://metacpan.org/pod/DateTime::Calendar::Chinese).

Which requires [DateTime::Astro](https://metacpan.org/pod/DateTime::Astro).

Which requires [Multiple-Precision Floating-point computations, and thus MFPR](https://www.mpfr.org/).

Which means it wasn't the easiest install, and I may never need it again, but it worked here. So, yes, I went for the _Mercenary solution_, but sometimes, if you want the job done right, you call the experts.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

# Do Not Write Your Own Date and Time Manipulation Code!
# Do Not Write Your Own Date and Time Manipulation Code!
# Do Not Write Your Own Date and Time Manipulation Code!
# Do Not Write Your Own Date and Time Manipulation Code!
# Do Not Write Your Own Date and Time Manipulation Code!
# Do Not Write Your Own Date and Time Manipulation Code!
#       -- Dave Rolsky

# Time is broken.

use Carp;
use DateTime;
use DateTime::Calendar::Chinese
    ;    # which requires DateTime::Astro, which requires MPFR or won't build

# we can specify a specific year, or we can get a whole cycle
my ($year) = @ARGV;
if ( defined $year ) {
    croak 'Not A Year' unless $year !~ /\D/;
    my ( $year, $animal, $branch, $stem, $name, $element ) =
        chinese_zodiac($year);
    say join " ", "\t", $year, "\t", $element, $animal;
}

else {
    # Show The Current Cycle
    for my $y ( 1984 .. 2043 ) {
        my ( $year, $animal, $branch, $stem, $name, $element ) =
            chinese_zodiac($y);
        say join " ", "\t", $year, "\t", $element, $animal;
    }
}
exit;

sub chinese_zodiac ( $greg_year ) {

    # there is a problem I'm ignoring here.

    # chinese new year is not bound specifically to a point in the
    # planet's orbit around the local star. it floats, and occurs
    # somewhere between mid-January and mid-February by the Gregorian
    # calendar.

    # this means that, if run on Jan 2 2021, we MIGHT expect to see
    # that it's Metal Ox, but it was still Metal Rat (which is the
    # name of an effects pedal from ProCo, IIRC, and implies a series
    # of SF novels from Harry Harrison).

    # this code *should* respect the truth and not the failed expectations
    # of the user, but any code that goes from first principles would
    # likely blow it for about the first month of the year

    my $dt = DateTime->now();
    $dt->set_year($greg_year);
    my $chdt = DateTime::Calendar::Chinese->from_object( object => $dt );
    $chdt->set_time_zone("Asia/Hong_Kong");

    my $animal  = ucfirst $chdt->zodiac_animal;
    my $branch  = ucfirst $chdt->terrestrial_branch_py;
    my $stem    = ucfirst $chdt->celestial_stem_py;
    my $name    = ucfirst $chdt->year_name_py;
    my $element = translate_element($stem);
    return $greg_year, $animal, $branch, $stem, $name, $element;
}

sub translate_element ( $stem ) {

    # There's also Yin and Yang, which we were not
    # told to identify, but explains the two results
    # in the following hash

    # Wood, Fire, Earth, Metal, Water
    my %elements = (
        Jia3  => 'Wood',
        Yi3   => 'Wood',
        Bing3 => 'Fire',
        Ding1 => 'Fire',
        Ji3   => 'Earth',
        Wu4   => 'Earth',
        Geng1 => 'Metal',
        Xin1  => 'Metal',
        Gui3  => 'Water',
        Ren2  => 'Water',
    );
    return $elements{$stem};
}
```

```text
         1984    Wood Rat
         1985    Wood Ox
         1986    Fire Tiger
         1987    Fire Hare
         1988    Earth Dragon
         1989    Earth Snake
         1990    Metal Horse
         1991    Metal Sheep
         1992    Water Monkey
         1993    Water Fowl
         1994    Wood Dog
         1995    Wood Pig
         1996    Fire Rat
         1997    Fire Ox
         1998    Earth Tiger
         1999    Earth Hare
         2000    Metal Dragon
         2001    Metal Snake
         2002    Water Horse
         2003    Water Sheep
         2004    Wood Monkey
         2005    Wood Fowl
         2006    Fire Dog
         2007    Fire Pig
         2008    Earth Rat
         2009    Earth Ox
         2010    Metal Tiger
         2011    Metal Hare
         2012    Water Dragon
         2013    Water Snake
         2014    Wood Horse
         2015    Wood Sheep
         2016    Fire Monkey
         2017    Fire Fowl
         2018    Earth Dog
         2019    Earth Pig
         2020    Metal Rat
         2021    Metal Ox
         2022    Water Tiger
         2023    Water Hare
         2024    Wood Dragon
         2025    Wood Snake
         2026    Fire Horse
         2027    Fire Sheep
         2028    Earth Monkey
         2029    Earth Fowl
         2030    Metal Dog
         2031    Metal Pig
         2032    Water Rat
         2033    Water Ox
         2034    Wood Tiger
         2035    Wood Hare
         2036    Fire Dragon
         2037    Fire Snake
         2038    Earth Horse
         2039    Earth Sheep
         2040    Metal Monkey
         2041    Metal Fowl
         2042    Water Dog
         2043    Water Pig
```

### TASK #2 › What’s playing?

> Submitted by: Albert Croft  
>  Working from home, you decided that on occasion you wanted some background noise while working. You threw together a network streamer to continuously loop through the files and launched it in a tmux (or screen) session, giving it a directory tree of files to play. During the day, you connected an audio player to the stream, listening through the workday, closing it when done.
>
> For weeks you connect to the stream daily, slowly noticing a gradual drift of the media. After several weeks, you take vacation. When you return, you are pleasantly surprised to find the streamer still running. Before connecting, however, if you consider the puzzle of determining which track is playing.
>
> After looking at a few modules to read info regarding the media, a quick bit of coding gave you a file list. The file list is in a simple CSV format, each line containing two fields: the first the number of milliseconds in length, the latter the media’s title (this example is of several episodes available from [MercuryTheatre.info](MercuryTheatre.info)):

```1709363,"Les Miserables Episode 1: The Bishop (broadcast date: 1937-07-23)"
    1723781,"Les Miserables Episode 2: Javert (broadcast date: 1937-07-30)"
    1723781,"Les Miserables Episode 3: The Trial (broadcast date: 1937-08-06)"
    1678356,"Les Miserables Episode 4: Cosette (broadcast date: 1937-08-13)"
    1646043,"Les Miserables Episode 5: The Grave (broadcast date: 1937-08-20)"
    1714640,"Les Miserables Episode 6: The Barricade (broadcast date: 1937-08-27)"
    1714640,"Les Miserables Episode 7: Conclusion (broadcast date: 1937-09-03)"
```

> For this script, you can assume to be provided the following information:
>
>      * the value of $^T ($BASETIME) of the streamer script,
>      * the value of time(), and
>      * a CSV file containing the media to play consisting of the length in milliseconds and an identifier for the media (title, filename, or other).
>
> Write a program to output which file is currently playing. For purposes of this script, you may assume gapless playback, and format the output as you see fit.
>
> Optional: Also display the current position in the media as a time-like value.

This is of some interest to me, as one of my sons _idolizes_ Orson Welles, founder of the Mercury Theater, and another is _obsessed_ with _Les Miserables_, but honestly, once I started diving into this, those weren't the things my mind went to.

I could play with CSV-parsing, but really, with [Text::CSV(https://metacpan.org/pod/Text::CSV)](https://metacpan.org/pod/Text::CSV) around, why would you?

From there ... I'll just pull from my comments.

**4:50pm - Restate my assumptions**

1.  Mathematics is the language of nature.
2.  Everything around us can be represented
    and understood through numbers.
3.  The streamer adds no time between recordings,
    nor crossfades between trackss, so there is no
    time unaccounted for between tracks
4.  The streamer will get to the end of the list and
    start all over again
5.  [_Pi_](https://www.imdb.com/title/tt0138704/quotes/)
    is a movie that every developer of a certain age will
    recognize immediately
6.  Current time will be higher than start time, meaning
    we're not querying the past
7.  The episodes in the CSV are roughly a half-hour each\*

**Hypothesis:**
_We can subtract the start time from the time in
question to find the total number of seconds that
the streamer has played, then go through the whole
playlist over and over until the current total is
less than the run time, but the current total plus
the next media file would be greater than the run
time. This would indicate that this is the currently
streaming file._

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental };

use Carp;
use Text::CSV qw( csv );
use Getopt::Long;
my $starttime = 1606134123;    # 2020-11-23 12:22:03
my $currtime  = 1614591276;    # 2021-03-01 09:34:36
my $file      = 'input.csv';

my $np = now_playing( $starttime, $currtime, $file );
say join "\n\t", $np->@*;

sub now_playing ( $starttime, $currtime, $file ) {
    croak 'Bad Times'     unless $currtime > $starttime;
    croak 'No Input File' unless -f $file;

    # $starttime is when the streaming started
    # $currtime is the time during the stream we're asking about
    # $endtime is the total time in seconds that the streamer
    #       has been running
    my $endtime = $currtime - $starttime;
    my @data    = get_data($file);

    # 4:50pm - Restate my assumptions
    #   One:    Mathematics is the language of nature.
    #   Two:    Everything around us can be represented
    #           and understood through numbers.
    #   Three:  The streamer adds no time between recordings,
    #           nor crossfades between trackss, so there is no
    #           time unaccounted for between tracks
    #   Four:   The streamer will get to the end of the list and
    #           start all over again
    #   Five:   Pi is a movie that every developer of a certain age
    #           will recognize immediately
    #   Six:    Current time will be higher than start time, meaning
    #           we're not querying the past
    #   Seven:  The episodes in the CSV are roughly a half-hour each

    #   Hypothesis:
    #       We can subtract the start time from the time in
    #       question to find the total number of seconds that
    #       the streamer has played, then go through the whole
    #       playlist over and over until the current total is
    #       less than the run time, but the current total plus
    #       the next media file would be greater than the run
    #       time. This would indicate that this is the currently
    #       streaming file

    my $ctime = 0;
    while (1) {
        for my $c ( 0 .. -1 + scalar @data ) {
            my $row = $data[$c];
            my ( $mill, $name ) = $row->@*;
            my $length = $mill / 1000;
            my $c2     = $ctime;
            $ctime += $length;
            if ( $ctime >= $endtime && $c2 <= $endtime ) {
                my $time      = int $endtime - $c2;
                my $formatted = join ':',
                    ( int $time / 60 ),
                    ( sprintf '%02d', $time % 60 );
                my @output = ( $row->[1], $formatted );
                return \@output;
            }
        }
    }
    croak 'This should never happen';
}

# getting to the CSV is a separate function for ease
sub get_data ($file=undef) {
    $file //= 'input.csv';
    if ( -f $file ) {
        my $data = csv( in => $file );
        return $data->@*;
    }
    else {
        croak 'no data';
    }
}
```

```text
Les Miserables Episode 1: The Bishop (broadcast date: 1937-07-23)
        10:24
```

Because none of the files were much longer than a half-hour, I went with `minute:second` formatting rather than adding hours, but the more I think about it, I think I should've specified hour, minute and second. I mean, [as soon as you discard scientific rigor, you're no longer a mathematician, you're a numerologist.](https://www.imdb.com/title/tt0138704/quotes/qt0188447)

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
