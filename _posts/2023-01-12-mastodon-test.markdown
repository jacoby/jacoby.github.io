---
layout: post
title: "Mastodon Test"
author: "Dave Jacoby"
date: "2023-01-12 10:57:57 -0500"
categories: ""
---

There is a format to the Jekyll headers that I don't want to think about or remember, so I wrote a tool to automate the creation of my blog posts, so I can just type `new_post -t 'Title Here'` and everything I want is filled out, including the footer. There are probably things I should put in my `.pages.yml` configuration, like the footer, but I haven't. I have left that hard-coded in my program, which I have included below.

What you might notice, in the code as well as this post, is that I have changed it to make Mastodon my comments section, as opposed to Twitter.

I did this because I have almost completely stopped using Twitter, except for a few things that can only be done there. I have yet to rewrite my blogpost-spamming tool for Mastodon, but when I do, I don't think there'll be much reason to post to Twitter again.

Self-criticism here: This is very much a case of the cobbler's kids having no shoes. I would normally put all the config and options code in one function, so we start with `my $options = get_options()` or the like, and then another one where the work is done, but alas, I did the laziest solution I could. But it works.

```perl
#!/usr/bin/env perl

use feature qw{ say postderef };
use strict;
use warnings;
use utf8;
no warnings qw(experimental::postderef);

use Carp;
use DateTime;
use Getopt::Long;
use IO::Interactive qw{interactive};
use YAML qw{LoadFile};

my $config_file = join '/', $ENV{HOME}, '.pages.yml';
my $config = LoadFile($config_file);
croak 'No PostDir' unless $config->{post_dir};
my $post_dir = $config->{post_dir};

my $options;
GetOptions(
    'help'         => \$options->{help},
    'title=s'      => \$options->{title},
    'author=s'     => \$options->{author},
    'categories=s' => \$options->{categories}->@*,
);
$options->{author} //= 'Dave Jacoby';

if ( $options->{help} || !$options->{title} ) {
    say <<'END';
new_post.pl  -- new posts on GitHub Jekyll Blog
    -t  title       (required)
    -c  categories  (optional)
    -a  author      (set by default, can be overridden)
    -h  help
END
    exit;
}
croak 'No Post' unless $options->{title};

#insert help code here

my $fmt = '%F %T %z';
my $now = DateTime->now()->set_time_zone('America/New_York');
$options->{date} = $now->strftime($fmt);

my $categories = join ' ', sort $options->{categories}->@*;
$categories = q{""} if $categories eq '';

my $file = lc( join '-', $now->ymd(), map { s/\W//g; $_ } split m{\s+},
    $options->{title} )
    . '.markdown';

my $path = join '/', $post_dir, $file;

say {interactive} <<"FOO";
$path
title:  "$options->{title}"
date:   "$options->{date}"
author: "$options->{author}"
categories: $categories

FOO

unless ( -f $path ) {
    if ( open my $fh, '>', $path ) {
        say $fh <<"TEST";
---
layout: post
title:  "$options->{title}"
author: "$options->{author}"
date:   "$options->{date}"
categories: $categories
---




#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/\@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)

TEST

    }
}

__DATA__

---
post_dir: /path/to/blog/repo
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
