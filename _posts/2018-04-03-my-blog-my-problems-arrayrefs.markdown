---
layout: post
title:  "My Blog, My Problems: arrayrefs"
author: "Dave Jacoby"
date:   "2018-04-03 11:14:42 -0400"
categories: 
---
I'm minding my own business, looking elsewhere in my codebase, when I notice that the error log is filling up.

And referencing `SecGenTools/Run_Errors`, which is my baby.

Quick Terminology Lesson: We have **Requests**, which correspond to collections of **Samples** we receive from our customers to do sequencing. When we get enough requests, we group them into **Runs**. To distinguish between samples and requests, we use **Barcodes**, which are short sequences attached to the ends of the **Reads(?)** *(Because I deal with the metadata and processes, this is about where my terminology starts to fail.)* These barcodes are usually eight characters of A,C,G or T. There are 65536 variations, but our list of 2253 has **Conflicts**, which cause **Problems** and **Delays** and **Headaches**.

`Run_Errors` is meant to find these conflicts before they get put on the sequencer.

At first, I found some help by 

```perl
for my $sample_id (
    sort { $ptr->{ $a }{ accession_id } <=> $ptr->{ $b }{ accession_id } }
    grep { $ptr->{ $_ }{ hide } == 0 }
    grep { $ptr->{ $_ }{ is_ws } == 1 }
    grep { $ptr->{ $_ }{ region } == $region }
    grep { $ptr->{ $_ }{ run_id } == $run_id }
    grep { $ptr->{ $_ }{ accession_id } } # <-- adding this thest
    keys %$ptr
    ) { ... }
```
Because the first error was `Use of uninitialized value in join or string` in that sort. It is worth finding out why there are samples with accession_ids, the serial numbers for samples, but not now.

The next problem comes from 

```perl
    my $barcodes->@* = $wsbarcodes->{ $acc }->@* ;
    next unless defined $barcodes ;
    next unless scalar $barcodes->@* > 0 ;
```

Here, the `Use of uninitialized value` comes from the test. I can't even check if it's defined. And this doesn't help.

```perl
    my $barcodes->@* = grep {/\w/} $wsbarcodes->{ $acc }->@* ;
```

It took some thinking, and a pass through [PerlMonks](http://www.perlmonks.org/?node_id=923743) before I found the correct solution.

```perl
    my $barcodes->@* = grep { defined } $wsbarcodes->{ $acc }->@* ;
```

which is another way of saying

```perl
    my $barcodes->@* = grep { defined $_ } $wsbarcodes->{ $acc }->@* ;
```

A Perl scalar can be of many types, including `undef`. A Perl array can be zero or more scalars, including those `undef` values. The arrayref `$wsbarcodes->{ $acc }` somehow will always have at least one `undef`, and trying to talk to the `undef` is the problem. At this part.

And once the error log is no longer being filled with `SecGenTools::Run_Error` problems, I can preceed with creating errors elsewhere.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


