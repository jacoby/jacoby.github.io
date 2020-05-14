---
layout: post
title:  "Quick Hacks and Higher Order Programming"
author: "Dave Jacoby"
date:   "2018-06-08 09:41:16 -0400"
categories: 
---

I am speaking on User Groups at The Perl Conference in Salt Lake City.

Or, leading a panel and somewhat speaking.

Anyway, my question got to be **"Who am I up against?"** and the website did not make it easy.

So, as a programmer, I wrote two programs. The first turned the schedule into a JSON document, and the other parses that JSON to give you what you're asking form. JSON, Perl, and Getopt::Long gives me a quick and dirty hack that allows me to limit on  audience, date, time, location, speaker, and track: "Show me the Intermediate talks on the Regex track".

But ...

```perl
$main->@* = grep { defined $_->{ audience } && $_->{ audience } =~ m{$config->{audience}}mix } $main->@* if defined $config->{ audience } ;
$main->@* = grep { defined $_->{ date } && $_->{ date } =~ m{$config->{date}}mix } $main->@* if defined $config->{ date } ;
$main->@* = grep { defined $_->{ time } && $_->{ time } =~ m{$config->{time}}mix } $main->@* if defined $config->{ time } ;
$main->@* = grep { defined $_->{ location } && $_->{ location } =~ m{$config->{location}}mix } $main->@* if defined $config->{ location } ;
$main->@* = grep { defined $_->{ speaker } && $_->{ speaker } =~ m{$config->{speaker}}mix } $main->@* if defined $config->{ speaker } ;
$main->@* = grep { defined $_->{ track } && $_->{ track } =~ m{$config->{track}}mix } $main->@* if defined $config->{ track } ;
```

Because it is easier to deal with arrayrefs than arrays when doing JSON stuff, it is an arrayref. The base case, for simplicity, is like this:

```perl
@mail = grep { defined $_->{ $keyword } && $_->{ $keyword } =~ m{$config->{$keyword}}mix } @main
    if defined $config->{$keyword}
```

We have a big array of hashrefs, and we want to pass through only the entries that have this field and whose value in that field is what we want.

So far, so good. Except, that is big and ugly and copy-and-paste programming. **THERE HAS TO BE A BETTER WAY!!!**, he says, donning the colorful infomercial sweater.

And there is. I am not sure 1) if I can successfully put it in and 2) if a toy project such as this ("I want to check the event schedule, but I don't want to use the event website or phone app! I want to use the command line, like a *REAL GEEK*") deserves the work. I mean, it is ugly but it is done and it works.

(While writing this, I have added a `--json` flag so I can pipe it into `jq`, because I need the practice with it.)

I don't know if I should put this as Higher Order or Data-Driven, but in this case, they might be different descriptions for the same event. I could see something like:

```perl
for my $keyword ( keys $config->%* ) {
    next if $keyworkd eq 'json' ; # because it isn't a filter
    @mail = grep { 
        defined $_->{ $keyword } && 
        $_->{ $keyword } =~ m{$config->{$keyword}}mix 
        } @main
    }
```

Which would allow me to add the description just by adding it to `GetOptions`. Actually, *that* would get me Data-Driven, but for Higher Order, it might be more like this:

```perl

my $dispatch;
for my $keyword ( keys $config->%* ) {
    $dispatch->{$keyword} = sub ( $foo ) {
        return 1 if defined $foo->{$keyword} ;
        # and other such stuff -- I never go here so I really don't know
        # how to generate functions like this
        return 0 ;
    } ;
    }
# I am much more about hardcoding this mess

$dispatch->{json} = sub { return 1 }; 
```

And, in the week before TPC, I don't have time to figure this step out, and after, I won't have the urgency. If I finish up up, I'll be a better programmer, but the problem at hand is solved. I have moved Higher Order Perl off the bookshelf, but probably won't get to it.

Oh well.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


