---
layout: post
title: "Thoughts on Perl Weekly Challenge 17"
author: "Dave Jacoby"
date: "2019-07-16 10:14:30 -0400"
categories: ""
---

## Challenge 1

> Create a script to demonstrate Ackermann function. The Ackermann function is defined as below, m and n are positive number:
>
> A(m, n) = n + 1 if m = 0
> A(m, n) = A(m - 1, 1) if m > 0 and n = 0
> A(m, n) = A(m - 1, A(m, n - 1)) if m > 0 and n > 0

As a challenge, that's very clear. That is _very_ close to the code you'd need.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

say a( 1, 2 );
say a( 2, 2 );
say a( 2, 5 );
exit;

sub a ( $m, $n ) {
    die 'Invalid input' unless $m >= 0 && $n >= 0;
    return $n + 1 if $m == 0;
    return a( $m - 1, 1 ) if $m > 0 && $n == 0;
    return a( $m - 1, a( $m, $n - 1 ) ) if $m > 0 && $n > 0;
}
```

I mean, adding `return` and sigils and replacing `and` with `&&` and you're mostly there.

This is my code as uploaded, but looking back, using [Memoize](https://metacpan.org/pod/Memoize) so repeated lookups are handled would be a quick thing to make this very recursive code faster.

**ADDENDUM:** I used Memoize and [Benchmark](https://metacpan.org/pod/Benchmark) to test, and using a memoized function made it, for `a(2,5)`, 15x faster. I mean, it went from 45 millionths of a second to 3 millionth of a second, but speed is speed, and as we get to higher values and deeper recursion, it adds up.

**ADDENDUM 2:** "It adds up" does not say enough. This is creazy recursive,and all the times you hit `return $n + 1 if $m == 0` means you can get `$n` to `a(0,5440808)`, which is where my code died. I _think_ that's a big recursive stack problem, but I'm not sure. I've seen others mention bigint, and I'm not sure I won't have to go there.

## Challenge 2

> Create a script to parse URL and print the components of URL. According to Wiki page, the URL syntax is as below:
>
> scheme:[//[userinfo@]host[:port]]path[?query][#fragment]
>
> For example: `jdbc:mysql://user:password@localhost:3306/pwc?profile=true#h1`
>
> ```
>    scheme:   jdbc:mysql
>    userinfo: user:password
>    host:     localhost
>    port:     3306
>    path:     /pwc
>    query:    profile=true
>    fragment: h1
> ```

I had problems with this one, which I explain in the comments.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

# Create a script to parse URL and print the components of URL.
# According to Wiki page, the URL syntax is as below:

# scheme:[//[userinfo@]host[:port]]path[?query][#fragment]

my @list;
push @list, 'ftp://ftp.cerias.purdue.edu/pub/dict/README.txt';
push @list, 'http://slashdot.org/';
push @list, 'https://en.wikipedia.org/wiki/URL';
push @list, 'https://github.com/manwar/perlweeklychallenge-club/pulse';
push @list, 'https://mail.google.com/mail/u/0/#inbox/FMfcg';
push @list, 'https://perlweeklychallenge.org/blog/perl-weekly-challenge-017/';
push @list, 'https://practimer.me:443/#5m0s';
push @list, 'https://www.perlmonks.org/?node_id=818843';
push @list, 'jdbc:mysql://user:password@localhost:3306/pwc?profile=true#h1';

@list = @ARGV if scalar @ARGV; # replace test list if anything is entered

# by the URL definition on wikipedia, jdbc:mysql is not a valid scheme
# and the scheme contains a trailing colon.

# Notes on implementation:
# + this is VERY ascii-centric code, and unicode and emoji are allowed
#   in URLs. Take, for example, i❤️tacos.ws
# + schemas and TLDs are constrained, not just to ascii, but to a small
#   (but larger than before) list. Yeah, you can override this with your
#   hosts file, but otherwise, all URLs should end (case-insensitive)
#   with a string in this list:
#       http://data.iana.org/TLD/tlds-alpha-by-domain.txt
# + similarly, the lists for path and query are limited to values
#   fitting my dataset. There have been path separator bugs: IE
#   would count \ as a separator, while Mozilla would not, so
#   you could hide information from Windows browsers /with\this\path

# So, this is a very naive implementation, needing more work before
# it can be trusted with real-world URLs. So, except when it's done
# for fun, like here, use something like Mojo::URL to split it up
# for you https://metacpan.org/pod/Mojo::URL

for my $url ( sort @list ) {
    my ( $scheme, $userinfo, $host, $port, $path, $query, $fragment ) =
        $url =~ m{
        ^
        (\w[A-Za-z0-9\+\.\-\:]+)://   # schema
        (?:([^@]+)@)?                 # userinfo
        ([\w\.]+)                     # host
        (?:\:(\d+))?                  # port
        (/[\w/\+\.\-]*)               # path
        (?:\?([\w/\+\.\-\=]+))?       # query
        (?:\#([^#]+))?                # fragment
        $
        }mxis;
    $scheme   //= '';
    $userinfo //= '';
    $host     //= '';
    $port     //= '';
    $path     //= '';
    $query    //= '';
    $fragment //= '';

    say <<"END";
    URL         $url
    scheme      $scheme
    userinfo    $userinfo
    host        $host
    port        $port
    path        $path
    query       $query
    fragment    $fragment
END
}

__DATA__

    URL         ftp://ftp.cerias.purdue.edu/pub/dict/README.txt
    scheme      ftp
    userinfo
    host        ftp.cerias.purdue.edu
    port
    path        /pub/dict/README.txt
    query
    fragment

    URL         http://slashdot.org/
    scheme      http
    userinfo
    host        slashdot.org
    port
    path        /
    query
    fragment

    URL         https://en.wikipedia.org/wiki/URL
    scheme      https
    userinfo
    host        en.wikipedia.org
    port
    path        /wiki/URL
    query
    fragment

    URL         https://github.com/manwar/perlweeklychallenge-club/pulse
    scheme      https
    userinfo
    host        github.com
    port
    path        /manwar/perlweeklychallenge-club/pulse
    query
    fragment

    URL         https://mail.google.com/mail/u/0/#inbox/FMfcg
    scheme      https
    userinfo
    host        mail.google.com
    port
    path        /mail/u/0/
    query
    fragment    inbox/FMfcg

    URL         https://perlweeklychallenge.org/blog/perl-weekly-challenge-017/
    scheme      https
    userinfo
    host        perlweeklychallenge.org
    port
    path        /blog/perl-weekly-challenge-017/
    query
    fragment

    URL         https://practimer.me:443/#5m0s
    scheme      https
    userinfo
    host        practimer.me
    port        443
    path        /
    query
    fragment    5m0s

    URL         https://www.perlmonks.org/?node_id=818843
    scheme      https
    userinfo
    host        www.perlmonks.org
    port
    path        /
    query       node_id=818843
    fragment

    URL         jdbc:mysql://user:password@localhost:3306/pwc?profile=true#h1
    scheme      jdbc:mysql
    userinfo    user:password
    host        localhost
    port        3306
    path        /pwc
    query       profile=true
    fragment    h1
```

As I said, I do not trust this to be complete. I do trust it to handle all entries in my test suite, but that's not enough.

I do, however, trust [Mojo::URL](https://metacpan.org/pod/Mojo::URL).

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

use Mojo::URL;

# Create a script to parse URL and print the components of URL.
# According to Wiki page, the URL syntax is as below:

# scheme:[//[userinfo@]host[:port]]path[?query][#fragment]

my @list;
push @list, 'ftp://ftp.cerias.purdue.edu/pub/dict/README.txt';
push @list, 'http://slashdot.org/';
push @list, 'https://en.wikipedia.org/wiki/URL';
push @list, 'https://github.com/manwar/perlweeklychallenge-club/pulse';
push @list, 'https://mail.google.com/mail/u/0/#inbox/FMfcg';
push @list, 'https://perlweeklychallenge.org/blog/perl-weekly-challenge-017/';
push @list, 'https://practimer.me:443/#5m0s';
push @list, 'https://www.perlmonks.org/?node_id=818843';
push @list, 'mysql://user:password@localhost:3306/pwc?profile=true#h1';

# Mojo::URL does NOT like the example URL
push @list, 'jdbc:mysql://user:password@localhost:3306/pwc?profile=true#h1';

@list = @ARGV if scalar @ARGV;    # replace test list if anything is entered

for my $url ( sort @list ) {
    my $mojo     = Mojo::URL->new($url);
    my $scheme   = $mojo->scheme || '';
    my $userinfo = $mojo->userinfo || '';
    my $host     = $mojo->host || '';
    my $port     = $mojo->port || '';
    my $path     = $mojo->path || '';
    my $query    = $mojo->query || '';
    my $fragment = $mojo->fragment || '';

    say <<"END";
    URL         $url
    scheme      $scheme
    userinfo    $userinfo
    host        $host
    port        $port
    path        $path
    query       $query
    fragment    $fragment
END
}
```

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
