---
layout: post
title: "How I Blog: new_post.pl"
author: "Dave Jacoby"
date: "2022-03-31 16:05:02 -0400"
categories: ""
---

This blog is served by [GitHub Pages](https://pages.github.com/), which uses [Jekyll](https://jekyllrb.com/) to convert [Markdown](https://daringfireball.net/projects/markdown/) to web pages.

I don't really know _much_ Jekyll, I'll admit. I set up a _very_ barebones setup, which suits me, and I've run with it. (I chose the title, "Committed to Memory", because something in the post-receive hook tells GitHub to run all that Jekyll stuff. Most of the time, at least. There is occasional downtime.)

But Jekyll wants a little bit more than markdown. How little?

```markdown
---
layout: post
title: "How I Blog: new_post.pl"
author: "Dave Jacoby"
date: "2022-03-31 16:05:02 -0400"
categories: ""
---
```

I don't know what other `layout` options there are. I know the `author` field is useful when pushing your post to other sites like [DEV](https://dev.to/). I don't use categories, because you can't get a just-this-category page, as far as I can tell, but there it is.

And there's a footer I like. Previous blogging sites I've used had comments built-in, and on occasion, I had people fighting with my comments about issues only tangentally-related to my post. My thought was that there are two basic comments:

- **You got something wrong!**, and that sounds like an issue, right? So we'll do that within issues.
- **Your post makes me want to expand on it**, which is good and wonderful, but I would rather not have your thoughts under my banner, so you can bring it to Twitter or whatever. Mention me and I'll see it, and I might join in.

Therefore, I put this into my every post footer:

```markdown
#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
```

So, what I desired is a tool that creates the file I need, formatted like I need them to be.

So I wrote one.

Looking through it, there's some things I'd do cleaner, and despite me living on Eastern Time and not expecting to move any time soon, I'm thinking I might put that into convig instead of hard-coding `America/New_York`, but by and large, I'm happy with this program.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use feature qw{ say postderef } ;
use strict ;
use warnings ;
use utf8 ;
no warnings qw(experimental::postderef) ;

use Carp ;
use DateTime ;
use Getopt::Long ;
use IO::Interactive qw{interactive} ;
use YAML qw{LoadFile} ;

my $config_file = join '/', $ENV{ HOME }, '.pages.yml' ;
my $config = LoadFile( $config_file ) ;
croak 'No PostDir' unless $config->{ post_dir } ;
my $post_dir = $config->{ post_dir } ;

my $options ;
GetOptions(
    'help'         => \$options->{ help },
    'title=s'      => \$options->{ title },
    'author=s'     => \$options->{ author },
    'categories=s' => \$options->{ categories }->@*,
    ) ;
$options->{ author } //= 'Dave Jacoby' ;

if ( $options->{ help } || !$options->{ title } ) {
    say <<'END';
new_post.pl  -- new posts on GitHub Jekyll Blog
    -t  title       (required)
    -c  categories  (optional)
    -a  author      (set by default, can be overridden)
    -h  help
END
    exit ;
    }
croak 'No Post' unless $options->{ title } ;

#insert help code here

my $fmt = '%F %T %z' ;
my $now = DateTime->now()->set_time_zone( 'America/New_York' ) ;
$options->{ date } = $now->strftime( $fmt ) ;

my $categories = join ' ', sort $options->{ categories }->@* ;
$categories = q{""} if $categories eq '';

my $file = lc( join '-', $now->ymd(), map { s/\W//g ; $_ } split m{\s+}, $options->{ title } )
    . '.markdown' ;

my $path = join '/', $post_dir, $file ;

say { interactive } <<"FOO";
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




#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)

TEST

        }
    }

__DATA__

---
post_dir: /path/to/blog/repo
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
