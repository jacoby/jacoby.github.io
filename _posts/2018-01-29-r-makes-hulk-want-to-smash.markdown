---
layout: post
title:  "R MAKES HULK WANT TO SMASH!"
author: "Dave Jacoby"
date:   "2018-01-29 14:05:53 -0500"
categories: R
---

Let us start with (annotated) R code that works
```r
#!/usr/bin/Rscript

suppressPackageStartupMessages( require( "Cairo"   , quietly=TRUE ) )
suppressPackageStartupMessages( require( "RMySQL"  , quietly=TRUE ) )
suppressPackageStartupMessages( require( "ggplot2" , quietly=TRUE ) )
suppressPackageStartupMessages( require( "tibble"  , quietly=TRUE ) )
suppressPackageStartupMessages( require( "yaml"    , quietly=TRUE ) )

# Cairo     so I can generate images without X11
# RMySQL    so I can collect data from the database
# ggplot2   so I can make pretty pictures
# tibble    is me cargo-culting from my friend dsk
# yaml      so I can read YAML files

# I put my DB configuratio into YAML so I don't have to worry about
# pasting my code into a blog 
my.cnf = yaml.load_file( '~/.my.yaml' )
database = my.cnf$clients$itap

# I pulled my decade-long Last.FM scrobbling history into a database
# and made some derived tables to make the queries come in faster
# If you don't read MySQL ...
music_sql <- '
#### DESIRED OUTPUT:
####    year , play , artist

    SELECT  YEAR( d.datestamp ) year
        ,   at.artist
        ,   IFNULL(lfm.play_count,0)  plays

    FROM        day_list d
    JOIN        last_fm_alltime at 

    LEFT JOIN   last_fm_years lfm
    ON          lfm.artist      = at.artist
    AND         lfm.play_year   = YEAR( d.datestamp )

    WHERE   YEAR(d.datestamp)   >= 2008
    AND     YEAR(d.datestamp)   <= 2017
    AND     at.play_count       > 550

    GROUP BY year , artist
    ORDER BY artist , year

'
# ... it gets pretty convoluted.
# I start with a table with every day, and by grouping, I 
# pull that to every year.

# I JOIN the all_time table and limit to artists I've played over 
# 550 times, to make the list managable

# I JOIN the years list by artist name, to get the plays per year.

# and I end up with this

# year      artist      plays
# 2008      Bob Marley & The Wailers    2
# 2009      Bob Marley & The Wailers    4
# 2010      Bob Marley & The Wailers    4
# 2011      Bob Marley & The Wailers    106
# 2012      Bob Marley & The Wailers    59
# 2013      Bob Marley & The Wailers    60
# 2014      Bob Marley & The Wailers    19
# 2015      Bob Marley & The Wailers    187
# 2016      Bob Marley & The Wailers    135
# 2017      Bob Marley & The Wailers    52
# 2008      Daft Punk   2
# 2009      Daft Punk   38
# 2010      Daft Punk   39
# 2011      Daft Punk   204
# 2012      Daft Punk   137
# 2013      Daft Punk   294
# 2014      Daft Punk   73
# 2015      Daft Punk   65
# 2016      Daft Punk   30
# 2017      Daft Punk   0
# ...

# Not a single Daft Punk track in 2017? I let them down, y'all.

con <- dbConnect(
    MySQL(),
    user=database$user ,
    password=database$password,
    dbname=database$database,
    host=database$host
    )
data  <- dbGetQuery( con , music_sql )
# data2 <- as_tibble(data)
head(data) 

# I use Cairo to write the PNG
CairoPNG(
    filename    = "/home/jacoby/local/www/top_artists_2.png" ,
    height      = 600  ,
    width       = 800  ,
    pointsize   = 12
    )

# I use ggplot2 to make the plot
ggplot(data=data, aes(x=year, y=plays, colour=artist, group=artist )) +
geom_line() +
ggtitle( "Top Artists, Plotted by Plays / Year" ) +
theme( plot.title = element_text( size=24) ) 

```

And presto!

![My top artist are all over the place](/images/top_artists.png)

Now, let's start again, but trying to get a look at 2017.

```r
#!/usr/bin/Rscript

suppressPackageStartupMessages( require( "Cairo"   , quietly=TRUE ) )
suppressPackageStartupMessages( require( "RMySQL"  , quietly=TRUE ) )
suppressPackageStartupMessages( require( "ggplot2" , quietly=TRUE ) )
suppressPackageStartupMessages( require( "readr"   , quietly=TRUE ) )
suppressPackageStartupMessages( require( "yaml"    , quietly=TRUE ) )

# administrivia 
my.cnf = yaml.load_file( '~/.my.yaml' )
database = my.cnf$clients$itap

# the query
music_sql <- '
#### DESIRED OUTPUT:
####    month       plays   artist

        SELECT  MONTH( d.datestamp )  month
            ,   IFNULL(lfm.play_count,0)  plays
            ,   at.artist

        FROM        day_list d
        JOIN        last_fm_years at 
        ON          at.play_year = 2017

        LEFT JOIN   last_fm_months  lfm
        ON          lfm.artist      = at.artist
        AND         lfm.play_year   = YEAR( d.datestamp )
        AND         lfm.play_month  = MONTH( d.datestamp )

        WHERE   YEAR(d.datestamp)   = 2017
        AND     at.play_count       > 90

        GROUP BY month , artist
        ORDER BY artist , month
'
# It's all the same until here, where I'm doing the same thing,
# except the by-month changes for the top for the year.

# month     plays   artist
# 1     105         Dinosaur Jr.
# 2     0           Dinosaur Jr.
# 3     16          Dinosaur Jr.
# 4     0           Dinosaur Jr.
# 5     0           Dinosaur Jr.
# 6     20          Dinosaur Jr.
# 7     81          Dinosaur Jr.
# 8     43          Dinosaur Jr.
# 9     1           Dinosaur Jr.
# 10    5           Dinosaur Jr.
# 11    4           Dinosaur Jr.
# 12    10          Dinosaur Jr.
# 1     3           Geographer
# 2     43          Geographer
# 3     8           Geographer
# 4     6           Geographer
# 5     10          Geographer
# 6     4           Geographer
# 7     5           Geographer
# 8     5           Geographer
# 9     5           Geographer
# 10    8           Geographer
# 11    5           Geographer
# 12    5           Geographer
# 1     0           Hüsker Dü
# 2     1           Hüsker Dü
# 3     0           Hüsker Dü
# 4     0           Hüsker Dü
# 5     0           Hüsker Dü
# 6     0           Hüsker Dü
# 7     1           Hüsker Dü
# 8     2           Hüsker Dü
# 9     124         Hüsker Dü

#       Will break in here to mention that Grant Hart, drummer and 
#       songwriter for Hüsker Dü, died this year, so a band I have
#       loved for some time but don't listen to much pulled my ear.
#       His album Intolerance also got more listens, but that's one 
#       album, so not enough to make this list

# 10    9           Hüsker Dü
# 11    2           Hüsker Dü
# 12    3           Hüsker Dü
# 1     2           Kehlani
# 2     45          Kehlani
# 3     8           Kehlani
# 4     3           Kehlani
# 5     15          Kehlani
# 6     18          Kehlani
# 7     3           Kehlani
# 8     1           Kehlani
# 9     1           Kehlani
# 10    44          Kehlani
# 11    0           Kehlani
# 12    2           Kehlani
# 1     0           Little Dragon
# 2     0           Little Dragon
# 3     0           Little Dragon
# 4     0           Little Dragon
# 5     0           Little Dragon
# 6     0           Little Dragon
# 7     1           Little Dragon
# 8     0           Little Dragon
# 9     91          Little Dragon
# 10    1           Little Dragon
# 11    0           Little Dragon
# 12    4           Little Dragon
# 1     2           Moby
# 2     0           Moby
# 3     0           Moby
# 4     74          Moby
# 5     5           Moby
# 6     1           Moby
# 7     4           Moby
# 8     4           Moby
# 9     1           Moby
# 10    2           Moby
# 11    4           Moby
# 12    0           Moby
# 1     0           Pretty Lights
# 2     10          Pretty Lights
# 3     0           Pretty Lights
# 4     4           Pretty Lights
# 5     1           Pretty Lights
# 6     0           Pretty Lights
# 7     9           Pretty Lights
# 8     12          Pretty Lights
# 9     0           Pretty Lights
# 10    1           Pretty Lights
# 11    107         Pretty Lights
# 12    3           Pretty Lights
# 1     1           R.E.M.
# 2     0           R.E.M.
# 3     1           R.E.M.
# 4     1           R.E.M.
# 5     29          R.E.M.
# 6     0           R.E.M.
# 7     5           R.E.M.
# 8     1           R.E.M.
# 9     6           R.E.M.
# 10    147         R.E.M.
# 11    4           R.E.M.
# 12    3           R.E.M.
# 1     0           Tom Petty and The Heartbreakers
# 2     0           Tom Petty and The Heartbreakers
# 3     1           Tom Petty and The Heartbreakers
# 4     0           Tom Petty and The Heartbreakers
# 5     23          Tom Petty and The Heartbreakers
# 6     0           Tom Petty and The Heartbreakers
# 7     0           Tom Petty and The Heartbreakers
# 8     0           Tom Petty and The Heartbreakers
# 9     1           Tom Petty and The Heartbreakers
# 10    76          Tom Petty and The Heartbreakers

#       And also Tom Petty. You can say my idea of what Rock & Roll
#       should sound like is formed by Tom Petty, Benmont Tench, 
#       Mike Campbell and Stan Lynch.

# 11    0           Tom Petty and The Heartbreakers
# 12    0           Tom Petty and The Heartbreakers
# 1     0           Wilco
# 2     2           Wilco
# 3     3           Wilco
# 4     5           Wilco
# 5     8           Wilco
# 6     161         Wilco
# 7     0           Wilco
# 8     1           Wilco
# 9     0           Wilco
# 10    2           Wilco
# 11    4           Wilco
# 12    7           Wilco

# and from here down, it's about the same

con <- dbConnect(
    MySQL(),
    user=database$user ,
    password=database$password,
    dbname=database$database,
    host=database$host
    )

data  <- dbGetQuery( con , music_sql )
head(data) 

CairoPNG(
    filename    = "2017.png" ,
    height      = 600  ,
    width       = 800  ,
    pointsize   = 12
    )

ggplot(data=data2, aes(x=month, y=plays, colour=artist, group=artist )) +
geom_line() +
ggtitle( "Top Artists of 2017, Plotted by Plays / Month" ) +
theme( plot.title = element_text( size=24) ) 

```

And so we SHOULD have about the same for a plot, right?

![Nope](/images/2017.png)

Instead, we get this fine tribute to the White Album.

It *was* also telling me `geom_path: Each group consist of only one observation. Do you need to adjust the group aesthetic?`, but it stopped and I don't know why.

(And yes, I'm the weird guy who uses R as a data programming language instead of a data shell. Guilty.)

I might try to make a CSV and go from there, but that I get no solid error and start from a data frame formatted so similarly to a working one, it makes me angry. 

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


