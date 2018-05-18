---
layout: post
title:  "Something Close To A Framework"
author: "Dave Jacoby"
date:   "2018-05-18 12:07:41 -0400"
categories: perl
---

I'm trying to do as much of a modern front-end for my organization's web tools as I can with a ... _legacy_ back-end, which uses CGI rather than frameworks.

At first, I threw together code that put together an object and encoded it in JSON, preceeded with `content-type: text/plain`, or, eventually `content-type: application/json`, but while I got past **Hello World** with a few frameworks, I was never able to push them into production, so I stuck with the old standby.

Looking into the center of [Perlbrew](https://perlbrew.pl/) a while ago showed me a little about making my Perl programs more expandable, and I used that knowledge to allow me to make a web API framework-ish with Perl and CGI.

Given a URL like `https://example.com/api/0.1/env`, we start with `0.1`, the file of the executable itself.

## The Program

```perl
#!/usr/bin/env perl

# Program to handle API interaction. In this case, for the
# Run creation application

use strict ;
use warnings ;
use utf8 ;
use feature qw{ postderef say signatures state } ;
no warnings qw{ experimental::postderef experimental::signatures } ;

use lib $ENV{ HOME } . '/lib' ;

# The "program", which only calls $api-run

my $api = API->new( @ARGV ) ;
$api->run() ;
exit;

# internal module that uses API_Base as a base class B)

# includes /env, which is included to demonstrate how this works

package API ;
use lib '/depot/gcore/apps/lib' ;
use base 'API_Base' ;

# the only necessary changes are adding more modules
use API_Run ;

# returns server environment variables - included as HELLO WORLD
#       $self is the API_Base object
#       $pathinfo is the path, after the endpoint, as an arrayref.
#           for example, if this was 0.1/env/foo/bar/blee, $pathinfo
#           would be [ 'foo','bar','blee' ]
#       $param is a hashref holding the values sent, either as
#       query_string for GET or as data for POST requests.
#       $method is the HTTP method used. Common ones are
#           GET, POST, PUT and DELETE

sub api_env ( $self, $pathinfo, $param, $method ) {
    my $name = shift @$pathinfo ;
    my @accept = split m{,}, $ENV{HTTP_ACCEPT} ;

    # you cannot modify or delete environment var
    if ( $method ne 'GET'  ) {
        return { status => 400 } ;
        }

    # returns specific desired environment variables, if they're
    # actual environment variables. For example
    # env/request_method would return { request_method => 'GET' }
    # (because no other request method is valid)
    elsif ( $pathinfo->[0] && $ENV{ uc $pathinfo->[0] } ) {
        return {
            status              => 200,
            accept              => \@accept,
            lc $pathinfo->[0]   => $ENV{ uc $pathinfo->[0], }
            } ;
        }
    # returns the whole ENV, plus everything about the query
    my $env->%* = %ENV ; # allows ordered hash in output
    return {
        status   => 200,
        pathinfo => $pathinfo,
        param    => $param,
        method   => $method,
        accept   => \@accept,
        env      => $env,
        } ;
    }
```

I've been going through this, adding some documentation. I add the `env` endpoint as a known-good endpoint, so I can tell if my additions are the problem, or the code, or the system or what. If `0.1/env` works, I know that all is well except for what modules I have just added.

So, right now, all that needs to be there to make this run is:

```perl
use strict ;
use warnings ;
use utf8 ;
use feature qw{ postderef say signatures state } ;
no warnings qw{ experimental::postderef experimental::signatures } ;
use lib $ENV{ HOME } . '/lib' ;

my $api = API->new( @ARGV ) ;
$api->run() ;
exit;

package API ;
use lib '/depot/gcore/apps/lib' ;
use base 'API_Base' ;
```

So, this all enables us to do `$api->run()`. So, what is that?

## The Base Class

```perl
package API_Base ;

# Module to serve as a base class for JSON-exporting APIs

# It is implemented as a base class because otherwise, the
# modules used would not be accessable by this module.

# This is inspired by perlbrew. It uses the symbol table to
# identify by taking any function that begins with 'api_'
# and making it allowable to use.

# (I could probably combine run() and run_command(), but
# this is a carry-over from the initial implementation.)

# wrap() consistently handles the wrapping and return status,
# which allows us to return errors based upon the requirements
# of the code, such as perhaps requesting info on a non-existant
# request returning 400 Bad Request, as suggested by
# _Build APIs You Won't Hate_.

# Uses JSON::XS as Gabor Szabo reports a substantial speed
# increase over JSON::PP

# APIs called via AJAX use the REQUEST_METHOD as a rough
# analog to CRUD.
#       CREATE    --> POST
#       READ      --> GET
#       UPDATE    --> PUT
#       DELETE    --> DELETE

# Using API_Error as an example, it exists to allow Javascript
# libraries to report client-side errors to the HTTPD error_log.
# Create/POST makes sense in this case, and a case could be made
# to allow a web dashboard to show what's going on with the error
# log, but you wouldn't, and can't, make changes to an existing
# error log, so DELETE and PUT would return 400 Bad Request.

# Since you wouldn't use this in a command-line context, I didn't
# document in POD. Usage is in __DATA__ below.

use strict ;
use warnings ;
use utf8 ;
use feature qw{ postderef say signatures state } ;
no warnings qw{ experimental::postderef experimental::signatures } ;

use CGI ;
use JSON::XS ;

our $VERSION = 0.1 ;

sub new ( $class, @argv )  {
    my $self ;
    my $cgi = CGI->new() ;
    $self->{method} = $ENV{REQUEST_METHOD} || 'GET' ;
    %{ $self->{param} } = map { $_ => scalar $cgi->param($_) } $cgi->param() ;
    ( undef, @{ $self->{pathinfo} } ) = split m{/}mxs, $cgi->path_info() ;
    return bless $self, $class ;
    }

# I honestly don't know why I can't combine this with run_command, but
# I tried it and gave up
sub run ($self) {
    my @vars = map{ $self->{$_} } qw{ pathinfo param method } ;
    return $self->run_command( $self->{pathinfo}, $self->{param}, $self->{method} ) ;
    }

# where the work is handled
sub run_command  ( $self, $pathinfo, $param, $method ) {
    my $command = $pathinfo->[0] || 'test' ;
    my $s = $self->can("api_$command") ;

    # can() tells us if an object has a method called METHOD, which is
    # good for telling if it is a usable function
    # http://perldoc.perl.org/UNIVERSAL.html

    # y/-/_/ because function names cannot be foo-bar, only foo_bar
    if (!$s) {
        $command =~ y/-/_/ ;
        $s = $self->can("api_$command") ;
        }

    # after this, we'll fail out if it still isn't in the table
    if (!$s) {
        $self->wrap( $self->fail( $pathinfo, $param, $method ) ) ;
        exit ;
        }

    #if it isn't a code ref, we'll fail out as well
    if ( 'CODE' ne ref $s ) {
        $self->wrap( $self->fail( $pathinfo, $param, $method ) ) ;
        exit ;
        }
    # $self->$s if callable, so we'll call it.
    return $self->wrap( $self->$s( $pathinfo, $param, $method ) ) ;
    }

# wraps all output in JSON, with appropriate HTTP error codes
sub wrap ( $self, $obj ) {

    # 2xx = Success
    # 3xx = Redirection
    # 4xx = Client Error
    # 5xx = Server Error
    my $methods = {
        '200' => 'OK',
        '201' => 'Created',
        '204' => 'No Content',
        '304' => 'Not Modified',
        '400' => 'Bad Request',
        '401' => 'Unauthorized',
        '403' => 'Forbidden',
        '404' => 'Not Found',
        '409' => 'Conflict',
        '500' => 'Internal Server Error',
        } ;

    $obj->{status} = $obj->{status} || '400' ;
    my $json = JSON::XS->new->pretty->canonical->utf8->allow_blessed(1)->convert_blessed(1) ;

    if ( int $obj->{status} >= int '300' ) {
        my $status = join q{ }, $obj->{status}, $methods->{ $obj->{status} } ;
        say qq{Status: $status} ;
        say q{} ;
        # say encode_json { 'Status' => $status } ;
        say $json->encode({ 'Status' => $status } )
        }
    else {
        # this is okay, but we could have 200 OK, or 201 Created,
        # indicating a successful deal that entered a thing into the
        # DB, or 204 No Content, indicating all works, but there's no
        # content.
        # also possible: file name
        my $status = join q{ }, $obj->{status}, $methods->{ $obj->{status} } ;
        say qq{Status: $status} ;
        say 'Content-Type: application/json' ;
        say q{} ;
        say $json->encode({ status => $status, output => $obj  } ) ;
        }
    exit ;
    }

# fail() serves also as a base for the api_*() functions that
# are written for this framework. They take in $self (implicit
# in old-school Perl object orientation), $pathinfo
sub fail ( $self, $pathinfo, $param, $method ) {
    return {
        method   => $method,
        param    => $param,
        pathinfo => $pathinfo,
        status   => 400,
        } ;
    }

1 ;

__DATA__

USAGE:

#!/usr/bin/env perl

use strict ;
use warnings ;
use lib '/depot/gcore/apps/lib' ;

my $api = API->new( @ARGV ) ;
$api->run() ;

package API ;
use lib '/depot/gcore/apps/lib' ;
use base 'API_Base' ;
use API_Error_0_1 ;
```

That IS a lot, but there are only a few functions: **new**, **run**, **run_command**, **wrap**, and **fail**.

I have yet to grapple with **Moose** and variants, so this is old-school object stuff. As I said, I learned from reading **Perlbrew** code, which has to be backward compatable, needing to work with older system Perls to allow users to have their own newer Perl.

**new** creates an `API_Base` object, filling it with `method`, `pathinfo` and `param` data.

**run** calls **run_command**. I have half-heartedly tried to combine the two, but gave up to do something more interesting a while ago.

**fail** returns an object containing `status => 400`, for "Bad Request", which we use if there's a problem elsewhere.

**wrap** wraps the output of the program in JSON, adding appropriate status codes depending on what status is in the output.

All this is administriva for **run_command**, which pulls the first entry from the `$pathinfo` arrayref and uses it as the command. In the above URL, that would be `env`. We first check to see if there's a function in the function table named `api_env`. This is included in the original program, but if it wasn't, we would convert any dashes to underbars, because perl function names cannot have dashes, and look for that again.

if we `can` proceed, we then check to see if `$s`, the output of `can`, is a CODE reference, and fail if not.

And then, if `$s` is a function, we call it, **wrap** the output in JSON and get out.

**But why do all that?**

Simplicity. I could've created a dispatch table by hand, like `$table->{env} = sub ( $pathinfo,$param,$method ) { ... }`, but that doesn't scale out easily. I want the process of adding functions to be as simple as possible. This is why we use a base class, so that I could use it in several places and only modify the derived classes to add functions. `env` is mostly supposed to be demo code for your next step.

## The Plugin

```perl
package API_Run ;

# API for interfacing for run creation

use strict ;
use warnings FATAL => 'all' ;
use utf8 ;
use feature qw{ postderef say signatures state } ;
no warnings qw{ experimental::postderef experimental::signatures } ;

use JSON::XS ;
use Carp ;
use Exporter qw{import} ;

use lib $ENV{ HOME } . '/lib' ;
use WideSeq::Schema ;
use WideSeq::DBstring ;

my $group = 'genomics' ;
my $dbn   = get_string($group) ;
my $log   = get_login($group) ;
my $pas   = get_password($group) ;
my $schema= WideSeq::Schema->connect( $dbn, $log, $pas, { AutoCommit => 1 } ) ;

my $json = JSON::XS->new->pretty ;

our $VERSION = 0.1 ;

our @EXPORT ;
for my $entry ( keys %API_Run:: ) {
	next if $entry !~ /^api_/mxs ;
	push @EXPORT, $entry ;
	}

# GET       - Maybe later, but we're not parsing and exporting errors
# POST      - This is the one
# PUT       - No changes possible to error log by definition
# DELETE    - No changes possible to error log by definition

sub api_operators ( $self, $pathinfo, $param, $method ) {
	my $name = shift @$pathinfo ;
	my @keys = qw{
		id
		operator
		} ;

	if ( $method eq 'GET' ) {
		my $search     = {} ;
		my $attributes = {} ;
		$attributes->{order_by} = { -asc => 'me.operator' } ;
		my @operators = $schema->resultset('CV::Operator')->search( $search, $attributes )->all ;
		my $operators ;

        # sending a DBIC object is problematic, so we pull it into a normal
        # arrayref of hashrefs instead.
		for my $o (@operators) {
			next unless $o->active ;
			my $oper ;
			$oper->%* = map { $_ => $o->$_ } @keys ;
			push $operators->@*, $oper ;
			}

		return {
			operators => $operators,
			fmep     => 'operators',
			method   => $method,
			param    => $param,
			pathinfo => $pathinfo,
			status   => 200,
			} ;
		}

	return {
		fmep     => 'fail',
		method   => $method,
		param    => $param,
		pathinfo => $pathinfo,
		status   => 200,
		} ;

	}

1 ;
```

Again, that's a lot to bring in, so I'll cut it down chunks. 

```perl
use Exporter qw{import} ;
our @EXPORT ;
for my $entry ( keys %API_Run:: ) {
	next if $entry !~ /^api_/mxs ;
	push @EXPORT, $entry ;
	}
```

[Read the Pod about Exporter](https://metacpan.org/pod/Exporter) for the long story, but in short, by filling `@EXPORT` with function names, you're telling the derived class in `0.1` that these are the functions available. There's also `@EXPORT_OK` and `@EXPORT_TAGS`, but I simply want to clutter the function table and leave it for the programmer to avoid collisons. As that's only me, I believe I'm up to it.

Normally, you would give `@EXPORT` a list of function names. If you had two functions, `foo` and `bar`, but only wanted to call `bar` within `foo`, you would write `@EXPORT = qw{foo}`. Again, simplicity, so I am only exporting subs with names starting with `api_`. 

A good chunk of this is more about DBIx::Class than anything else, so I'll hit the high points.

```perl
sub api_operators ( $self, $pathinfo, $param, $method ) {
    # $self is the API object
    # $pathinfo is path in the URL, starting with the function name.
    #   if I was to expand this to get details on just one operator, 
    #   like me, this would be [operator,jacoby]
    # $param is the data included, in a hash array
    # $method is GET, POST, PUT, DELETE, but mostly GET or POST

	if ( $method eq 'GET' ) {
        my $operators = [
            { 
                id => 1 ,
                operator => 'Dave Jacoby'
            } ,
            { 
                id => 2 ,
                operator => 'Ernestine'
            } ,
        ];

        # status gives us the result code, which wrap() uses to send
        #   the correct status code
        # operators returns the operator information 
        # all else is for debugging 
		return {
			operators => $operators,
			method   => $method,
			param    => $param,
			pathinfo => $pathinfo,
			status   => 200, # OK
			} ;
		}

	return {
		fmep     => 'fail',
		method   => $method,
		param    => $param,
		pathinfo => $pathinfo,
		status   => 400, # Bad Request
		} ;

	}

```

So, in essence, if you're doing a GET command, here's the data, else error.

The good thing about this is that I now only have to worry about the desired behavior of specific endpoints. The argument would be that `PUT` would modify an operator, that `POST` would create an operator, and `DELETE` would remove (or mark as unavailable) an operator. There's a great amount of complexity one could add to a function if it was warranted.

I wrote this because I tweeted a portion to [@gizmomathboy](https://twitter.com/gizmomathboy/) recently an decided to write up some context.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
