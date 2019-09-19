---
layout: post
title: "Scripting the Dropbox API"
author: "Dave Jacoby"
date: "2019-09-19 12:17:51 -0400"
categories: ""
---

I am a big fan of [Dropbox](https://www.dropbox.com/) and have been for some time. One of my things is to have `bin` and `lib` directories so a lot of the tools I write for myself are available on all my hosts.

The issue is that Dropbox's client for Linux wants to exist in context of a desktop, and there are places, such as a research cluster or a hosted machine, where there's no desktop running and the Dropbox client won't work.

But don't worry. [Dropbox has an API](https://www.dropbox.com/developers/documentation). And Perl has a library. Well, _libraries_, but I like and use [WebService::Dropbox](https://metacpan.org/pod/WebService::Dropbox). Your first step is to use the [App Console](https://www.dropbox.com/developers/apps) and get all the keys and you need.

I put all that into YAML so that I can share the code at will, without worrying about sharing keys, but maybe you like JSON or INI files or something. Whatever you do, make sure that you `chmod` your stuff so that only you can access it, especially if you're running this on a shared resource.

```yaml
---
key: gec7xnarw6yy3w8
secret: ioq7dyn412v833m
token: u1viTaKGoFNtAi6aekV4JMMd81HTSeFOn3LN-6m6pUvI1Vd867utfHmfzMVwrO2I
note: "Not my keys, but random numbers I generated. Don't share yours either."
```

And here is my program, `dropbox_copy.pl`. If you wanted to download a `bin` directory from Dropbox, you'd run `dropbox_copy.pl -d bin`.

```perl
#!/home/djacoby/webserver/perl/bin/perl

# This program is used to download a Dropbox directory onto a machine
# without Dropbox tools installed

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state };
no warnings qw{ experimental::postderef experimental::signatures };

use Carp;
use IO::File;
use JSON;
use Getopt::Long;
use Pod::Usage;
use WebService::Dropbox;
use YAML qw{LoadFile};
use File::Path qw{make_path};

my $json    = JSON->new->canonical->pretty;
my $config  = config();
my $dropbox = WebService::Dropbox->new( { key => $config->{key}, } );

# Authorization
if ( $config->{token} ) {
    $dropbox->access_token( $config->{token} );
}
else {
    my $url = $dropbox->authorize;

    print "Please Access URL and press Enter: $url\n";
    print "Please Input Code: ";
    chomp( my $code = <STDIN> );
    unless ( $dropbox->token($code) ) {
        die $dropbox->error;
    }
    print "Successfully authorized.\nYour AccessToken: ",
        $dropbox->access_token, "\n";
}

if ( $config->{directory} ) {
    my $remote = '/' . $config->{directory};
    get_dir( $remote, $dropbox );
}

exit;

# get_dir() takes $remote, the directory to be copied,
# and a WebService::Dropbox object. I am on an anti-globals
# kick but otherwise would've kept that and just passed $remote

sub get_dir ( $remote, $dropbox ) {
    my $local = join '', $ENV{HOME}, '/Dropbox', $remote;
    if ( !-d $local ) { make_path($local) }
    my $result = $dropbox->list_folder($remote);
    for my $e ( $result->{entries}->@* ) {

        # if it's a folder/directory, recurse
        if ( $e->{'.tag'} eq 'folder' ) {
            my $next = $e->{path_display};
            get_dir( $next, $dropbox );
        }

        # if it's a file, we download it
        if ( $e->{'.tag'} eq 'file' ) {
            my $file = $e->{path_display};
            get_file( $file, $dropbox );
        }
    }
}

# get_file() takes $remote, the file to be copied, and a
# WebService::Dropbox object

sub get_file ( $remote, $dropbox ) {
    my $local    = join '', $ENV{HOME}, '/Dropbox', $remote;
    my $fh       = IO::File->new( $local, '>' );
    my $response = $dropbox->download( $remote, $fh );

    # say $json->encode($response);
}

# one-stop shop to get the Dropbox configuration and the flags.

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

dropbox_copy.pl - Download a directory from Dropbox

=head1 SYNOPSIS

	dropbox_copy.pl -d 'Images'

=head1 DESCRIPTION

This program copies whole directories from Dropbox

=head1 OPTIONS

=over 4

=item B<-d>, B<--directory>

The name of the directory to be copied.

=item B<-h>, B<--help>

Short-form user documentation

=item B<-m>, B<--manual>

Long-form user documentation

=back

=head1 LICENSE

This is released under the Artistic
License. See L<perlartistic>.

=head1 AUTHOR

Dave Jacoby L<jacoby.david@gmail.com>

=cut
```

[As a GitHub Gist](https://gist.github.com/jacoby/952fe31d334fcdc236bac96f78df2223)

I should make better tools like this, with listing directories and downloading files and uploading. I should make a repo with all this stuff. This would allow others to help make it better. And because Dropbox owns the name "Dropbox", I should come up with another name.

But, in the meantime, please enjoy.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
