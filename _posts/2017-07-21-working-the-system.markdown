---
layout: post
title:  "Working the system"
date:   "2017-07-21 13:47:47 -0400"
categories: blogging code perl
---

First thing I need to do is make sure that the required elements of a post are available when I need to make a blog post. This is a first-pass that's sitting in `~/local/bin`, not the `bin` directory shared everywhere, so, in a more 'real' program, I'd have a `.pages.cnf` or the like where the default directory could be machine-specific, as well as the time zone.

But, as a first pass, I'm happy with this.

I am especially happy that, with newer perls, postderef is available, which allows me to both create and use arrayrefs like `$arrayref->@*` instead of `@{$arrayref}`. A character longer, but uglier, I think.

{% highlight perl %}
#!/usr/bin/env perl

use feature qw{ say postderef } ;
use strict ;
use warnings ;
use utf8 ;

use IO::Interactive qw{interactive} ;
use DateTime ;
use JSON ;
use Getopt::Long ;

my $json     = JSON->new->canonical->pretty ;
my $post_dir = '/home/jacoby/localdev/jacoby.github.io/_posts' ;
my $options ;
my $fmt = '%F %T %z' ;
GetOptions(
    'title=s'      => \$options->{ title },
    'categories=s' => \$options->{ categories }->@*,
    ) ;
my $now = DateTime->now()->set_time_zone( 'America/New_York' ) ;
$options->{ date } = $now->strftime( $fmt ) ;

my $categories = join ' ', sort $options->{ categories }->@* ;

my $file = lc( join '-', $now->ymd(), split m{\s+}, $options->{ title } ) . '.markdown' ;

my $path = join '/', $post_dir, $file ;

unless ( -f $path ) {
    if ( open my $fh, '>', $path ) {
        say $fh <<"TEST";
---
layout: post
title:  "$options->{title}""
date:   "$options->{date}"
categories: $categories
---

TEST

        }
    }

__DATA__

{% endhighlight %}

