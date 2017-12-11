---
layout: post
title:  "YouTube URL to Markdown Link"
author: "Dave Jacoby"
date:   "2017-12-11 12:41:23 -0500"
categories: 
---

We start out with a link to a video on YouTube. For example, `https://www.youtube.com/watch?v=5pV9RE7Obj8`

We could make that a link, but that would be a bit lame for our blog

    [https://www.youtube.com/watch?v=5pV9RE7Obj8](https://www.youtube.com/watch?v=5pV9RE7Obj8)

I think we'd like to have a video player within the page, but Markdown doesn't support that. (Yet?) 

So we'd want a thumbnail. The id of this video is `5pV9RE7Obj8`, so the URL of the thumbnail is `https://img.youtube.com/vi/5pV9RE7Obj8/0.jpg`, so we can get the image into the blog with 

    ![ALT TEXT](https://img.youtube.com/vi/5pV9RE7Obj8/0.jpg)

And because an image can be the text of a link, we can combine them.

    [![ALT TEXT](https://img.youtube.com/vi/5pV9RE7Obj8/0.jpg)](https://www.youtube.com/watch?v=5pV9RE7Obj8)

So far, you can do all of this by hand, but we still have the `ALT TEXT` problem.

I solve that with [Perl](http://perl.org/) and [Mojolicious](http://mojolicious.org/).

```perl
#!/usr/bin/env perl

use strict ;
use warnings ;
use utf8 ;
use feature qw{ say signatures } ;
no warnings qw{ experimental::signatures } ;

use Mojo ;

map { make_md( $_ ) } @ARGV ;

sub make_md ( $string ) {
    return unless $string =~ m{^https?://www.youtube.com}mix ;
    my ( $id ) = $string =~ m{v=([^\?]+)} ;
    my $link   = qq{https://www.youtube.com/watch?v=$id} ;
    my $thumb  = qq{https://img.youtube.com/vi/$id/0.jpg} ;
    my $title  = 'ALT TEXT' ;

    my $dom = Mojo::UserAgent->new->get( $link )->res->dom ;
    $dom->find( 'title' )->each(
        sub {
            my $e = $_ ;
            $title = $e->text ;
            }
            ) ;

    say qq{[ ![$title]($thumb)]( $link ) } ;
    }
```

The usage of this looks like: 

    ytmarkdown.pl https://www.youtube.com/watch?v=5pV9RE7Obj8 foo bar blee

and it drops anything that doesn't look like a YouTube link. When it has a link, it handles all the formatting stuff mentioned, plus uses `Mojo::UserAgent` to get the HTML and `Mojo::DOM` to extract the title to be used as hover text.

    [ ![GLOSSY ThunderTalks 2015 10 10 - What I Learned From perlbrew - YouTube](https://img.youtube.com/vi/5pV9RE7Obj8/0.jpg)]( https://www.youtube.com/watch?v=5pV9RE7Obj8 ) 

Which gives us a nice thumbnail for the link with ALT text.

[![GLOSSY ThunderTalks 2015 10 10 - What I Learned From perlbrew - YouTube](https://img.youtube.com/vi/5pV9RE7Obj8/0.jpg)]( https://www.youtube.com/watch?v=5pV9RE7Obj8 ) 

(And a subtle push for a talk I gave on how contributing to Open Source can benefit you.)

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
