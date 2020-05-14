---
layout: post
title:  "Travelling Salesman Portrait - A Variation"
author: "Dave Jacoby"
date:   "2018-04-19 11:59:41 -0400"
categories: 
---

This starts when I saw that [Randy Olson](https://twitter.com/randal_olson) found an interesting thing and built upon it.

[Traveling salesman portrait in Python](http://www.randalolson.com/2018/04/11/traveling-salesman-portrait-in-python/) is where I came in. It runs through a series of steps:

* Take an image, in this case of Boris Karloff as Frankenstein's Monster
* Turn it into grayscale
* Dither it to get it to more completely black and white
* Pull a number of randomly-chosen black pixels
* Run a Traveling Salesman Algorithm on it to connect all the pixels 
* Draw the line and write the image

Problem is, Dave Jacoby and Python is like [Charlie Brown and a kite](https://www.google.com/search?q=charlie+brown+kite&oq=charlie+brown+kite); I can never get it to work and I end up defeated and tied to a tree. In this case, believe it's because matplotlib doesn't like how I am handling fonts, which is immaterial because no fonts are involved in this process.

(**#VirtualEnv All The Things**)

But Randy Olson didn't dream this up himself, he adapted it from R to Python, using [Fronkonstin's Work](https://fronkonstin.com/2018/04/04/the-travelling-salesman-portrait/) as a base. And I have few problems with R. My main issue is that I find it hard to think in terms of R's data arrays and such. And my `ggplot2` knowledge is *so* cargo-cult. But I can work with the code.

```R
#!/usr/bin/env Rscript
# https://github.com/aschinchon/travelling-salesman-portrait/blob/master/frankenstein_TSP.R

# to be done:
#   replace the library() calls with something quieter
#   make usage -i file -o file
#   remove the urlfile part (?)
#   use Cairo so I can batch it

# Quietly load modules
suppressPackageStartupMessages(require("methods", quietly=TRUE))
suppressPackageStartupMessages(require("imager", quietly=TRUE))
suppressPackageStartupMessages(require("dplyr", quietly=TRUE))
suppressPackageStartupMessages(require("ggplot2", quietly=TRUE))
suppressPackageStartupMessages(require("scales", quietly=TRUE))
suppressPackageStartupMessages(require("TSP", quietly=TRUE))

# Handle Command Line Arguments
#   cmd             -> error ('need arguments')
#   cmd file        -> error if ! -f file, input = file, output = 'output.jpg'
#   cmd file1 file2 -> error if ! -f file1, input = file1, output = file2
args = commandArgs(trailingOnly=TRUE)
if (length(args)==0) {
  stop("At least one argument must be supplied (input file).", call.=FALSE)
} else if (length(args)==1) {
  # default output file
  args[2] = "./output.jpg"
}
input=args[1]
output=args[2]

file=input
if (!file.exists(file)) { stop ("No valid input file", call.=FALSE) }

# Load, convert to grayscale, filter image (to convert it to bw) and sample
load.image(file) %>% 
  grayscale() %>%
  threshold("45%") %>% 
  as.cimg() %>% 
  as.data.frame()  %>% 
  sample_n(8000, weight=(1-value)) %>% 
  select(x,y) -> data

# Compute distances and solve TSP (it may take a minute)
as.TSP(dist(data)) %>% 
  solve_TSP(method = "arbitrary_insertion") %>% 
  as.integer() -> solution

# Create a dataframe with the output of TSP
data.frame(id=solution) %>% 
  mutate(order=row_number()) -> order

# Rearrange the original points according the TSP output
data %>% 
  mutate(id=row_number()) %>% 
  inner_join(order, by="id") %>% arrange(order) %>% 
  select(x,y) -> data_to_plot

# A little bit of ggplot to plot results
ggplot(data_to_plot, aes(x,y)) +
    geom_path() +
    scale_y_continuous(trans=reverse_trans())+
    coord_fixed()+
    theme_void()

# Do you like the result? Save it! (Change the filename if you want)
ggsave(output, dpi=600, width = 4, height = 4)
```

This allows me to do a thing like:

`./tsp.R Frankenstein.jpg TSP-Frankenstein.png`

and get this output.

![My TSP Frankenstein](/images/TSP-Frankenstein.png).

And do the same with 

`./tsp.R headshot.jpg TSP-headshot.png` 

and get this 

![My TSP Headshot](/images/TSP-headshot.png).

But I don't like this, as you can see in the comics. I think this is because "real R users" use it as a data shell and I like to think of things as programs. I come up with similarly-formatted data (like from a database), run it through my R in batch, and come up with the output while I'm doing other things.

As that kind of user, I **really** want this to be 

`./tsp.R --input headshot.jpg --output TSP-headshot.png` 

with optional flags for threshold and line width. I do not know of an R equivalent of Perl's [Getopt::Long](https://metacpan.org/pod/Getopt::Long). I might have to write one, if only for my own edification.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


