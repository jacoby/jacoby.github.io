---
layout: post
title:  "Downloading Directories with Dropbox via API"
author: "Dave Jacoby"
date:   "2018-07-19 16:54:49 -0400"
categories: 
---

TaskWarrior tells me:

```
💻 ✔ jacoby@oz 16:56 83°F    ~
$ task +dropbox
[task next ( +dropbox )]

ID Age Tag     Description                              Urg
 5 4mo dropbox sync full directory with Dropbox via API 1.61

1 task
```

I do not have a strong memory as to _why_ Past Dave thought that was important, but oh well.

I did get to the point where, using [WebService::Dropbox](https://metacpan.org/pod/WebService::Dropbox), I could upload and download files, but that's where I left it.

I mean, I _get_ it. My tendency is to `ln -s Dropbox/bin bin` and `lib` and a few others, so I keep my collection of tools around where I want them, with only a quick sync away from everything, should I rewrite my sudoku solver or the thing that randomly tweets a picture of Snoopy playing saxophone. Y'know, the _important_ things.

And, there are some places I run that I run headless without permissions and can't really install the [full Dropbox setup](https://www.dropbox.com/install-linux). Maybe my `lib/`?

Anyway, lack of urgent fires lead to me cleaning out my TaskWarrior tasks, and I noticed the above, and decided to finish it. It is not clean, but I haven't posted to the blog recently enough, so here goes.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental::postderef experimental::signatures };

use Carp;
use File::Path qw{make_path};
use Getopt::Long;
use IO::File;
use Pod::Usage;
use WebService::Dropbox;
use YAML qw{LoadFile};

my $json    = JSON->new->canonical->pretty;
my $config  = config();
my $dropbox = WebService::Dropbox->new(
	{
		key    => $config->{key},
		secret => $config->{secret},
	}
);

# Authorization
if ( $config->{token} ) {
	$dropbox->access_token( $config->{token} );
}else {
	my $url = $dropbox->authorize;

	print "Please Access URL and press Enter: $url\n";
	print "Please Input Code: ";
	chomp( my $code = <STDIN> );
	unless ( $dropbox->token($code) ) {
		die $dropbox->error;
	}
	print "Successfully authorized.\nYour AccessToken: ",$dropbox->access_token, "\n";
}

if ( $config->{directory} ) {
	my $remote = '/' . $config->{directory};
	get_dir( $remote, $dropbox );
}

sub get_dir( $remote, $dropbox ) {
	my $local = join '', $ENV{HOME}, '/Dropbox', $remote;
	if ( !-d $local ) { make_path($local) }
	my $result = $dropbox->list_folder($remote);
	for my $e ( $result->{entries}->@* ) {
		if ( $e->{'.tag'} eq 'folder' ) {
			my $next = $e->{path_display};
			get_dir( $next, $dropbox );
		}
		if ( $e->{'.tag'} eq 'file' ) {
			my $file = $e->{path_display};
			get_file( $file, $dropbox );
		}
	}
}

sub get_file( $remote, $dropbox ) {
	my $local = join '', $ENV{HOME}, '/Dropbox', $remote;
	say $remote ;
	say $local ;
	say '';
	my $fh = IO::File->new( $local, '>' );
	my $response = $dropbox->download( $remote, $fh );
	say $json->encode($response);
}

exit;

sub config () {
	my $config_file = $ENV{HOME} . '/.dropbox.yml';
	croak 'No Config' unless -f $config_file;
	my $config = LoadFile($config_file);
	$config->{download} = 0;
	$config->{upload}   = 0;
	GetOptions(
		'help'        => \$config->{help},
		'man'         => \$config->{man},
		'directory=s' => \$config->{directory},
	);

	pod2usage( -verbose => 2, -exitval => 1 ) if $config->{man};
	pod2usage( -verbose => 1, -exitval => 1 ) if $config->{help};
	pod2usage( -verbose => 1, -exitval => 1 )
		unless $config->{directory} =~ /\w/;
	delete $config->{help};
	delete $config->{man};
	return $config;
}

exit;

=head1 NAME

dropbox_copy.pl -- This documentation is for last time and needs updating so clipping


=head1 LICENSE

This is released under the Artistic
License. See L<perlartistic>.

=head1 AUTHOR

Dave Jacoby L<jacobydavid@live.com>

=cut
```

The _hard_ part of using web APIs like this, I find, is token management. Once you get that, it's using `LWP` or `Mojo::UserAgent` or `curl` or whatever, but the task of _getting_ permissions in the first place is always what hinders me. I recall the process under `WebService::Dropbox` being easy.

I feel I should note the modules that make this easy

[Carp](https://metacpan.org/pod/Carp) is a module that supplants `die` and `warn`, due to antisocial behavior from those commands. Those I kinda use because I know it's the Perly way.

[File::Path](https://metacpan.org/pod/File::Path) gives `make_path`, which is essentially `mkdir -p` without shelling out. Similarly, [IO::File](https://metacpan.org/pod/IO::File) is a thing I normally handle with `open my $fh, '>', $file` or whatever, but the module suggested this and I like well enough.

There are many ways to get options, but [Getopt::Long](https://metacpan.org/pod/Getopt::Long) is in Core and is my favorite.

[JSON](https://metacpan.org/pod/JSON) and [YAML](https://metacpan.org/pod/YAML) are kinda pairs, and I use YAML to store config data and JSON to handle the output of APIs. The cool kids are moving to [Cpanel::JSON::XS](https://metacpan.org/pod/Cpanel::JSON::XS), which I often use as well.

Perl uses POD, or Plain Old Documentation as their default user documentation, and [Pod::Usage](https://metacpan.org/pod/Pod::Usage) allows me to tie it to `-h` and `-m`, allowing me to easily create both short-form and long-form user documentation, for when I go back after years and wonder "What is this and why am I running it?"

Observant readers will notice that the task says _sync_ while this simply copies from Dropbox. This might be fixed, but it might not.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
