---
layout: post
title: "Dispatch Tables and doing a LOT of work to stay DRY"
author: "Dave Jacoby"
date: "2019-05-30 11:45:51 -0400"
categories: ""
---

A friend on our user group mailing list recently opined that he thought that [dispatch tables](https://en.wikipedia.org/wiki/Dispatch_table) violated [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

I didn't see it at first. It wasn't clear in the example code what was his ideosyncratic code style and what was the point being made. But then I thought about it and remembered a rabbit hole I chased down, and I get it.

## Dispatch Tables? Huh?

The link _is_ above, but let us give an example. Say you have a tool that handled your interaction with Twitter from the command line. Twitter does a lot of stuff, so we'll cut it down to four tasks: `authorize` to get you set up, `update` to send a tweet, `whoami` to tell you which of your accounts you're working out of, and `help` to tell you how to use things.

(All examples are commands borrowed from the [`t` client](https://github.com/sferik/t), but not code from that project.)

It _could_ work like this.

```perl
if    ( $ARGV[0] eq 'authorize' ) { twitter_authorize(@ARGV) }
elsif ( $ARGV[0] eq 'update' )    { twitter_update(@ARGV) }
elsif ( $ARGV[0] eq 'whoami' )    { twitter_whoami(@ARGV) }
elsif ( $ARGV[0] eq 'help' )      { twitter_help(@ARGV) }
else { help(@ARGV) }
```

And, over time, we get a _huge_ number if `if/else` choices and you begin to fear working with it. Perl _does_ have case statements now.

```perl
use Switch;
switch( $ARGV[0] ){
    case 'authorize'    { twitter_authorize(@ARGV) }
    case 'update'       { twitter_update(@ARGV) }
    case 'whoami'       { twitter_whoami(@ARGV) }
    case 'help'         { twitter_help(@ARGV) }
    else { twitter_help(@ARGV) }
}
```

So, what if I told you that it could be as simple as this?

```perl

if ( $dispatch_table{$ARGV[0]} ) {
    $dispatch_table{$ARGV[0]}(@ARGV)
}
else { twitter_help(@ARGV) }
```

It can. This is (part of) the wonder of dispatch tables.

## Try Not DRY

What is DRY? It means _"Don't Repeat Yourself"_ and the DRY Principle is:

> ["EVERY PIECE OF KNOWLEDGE MUST HAVE A SINGLE, UNAMBIGUOUS, AUTHORITATIVE REPRESENTATION WITHIN A SYSTEM" -- Andrew Hunt and David Thomas, _The Pragmatic Programmer_ (p. 27)](https://en.wikipedia.org/wiki/The_Pragmatic_Programmer)

Consider this implementation.

```perl
my %dispatch_table = {
    foo => \&foo,
    bar => \&bar,
};

sub foo { return "FOO" }

sub bar { return "BAR" }
```

I'm not 100% sure this is exactly a DRY violation, but you have to handle the mapping between `$dispatch_table{foo}` and `foo()` yourself, and there is nothing stopping you from accidentally having it be the other way.

```perl
my %dispatch_table = {
    foo => \&bar,
    bar => \&foo,
};
```

## We Are Anonymous, We Are Legion

There _is_ an obvious solution.

```perl
my %dispatch_table = {
    foo => sub { return "FOO" },
    bar => sub { return "BAR" },
};
```

This is ... _fine_, if we're defining _A SYSTEM_ as a program, but not a code base. If you want to `foo()` for another reason than user input, you'll need another function (clear DRY violation) or use the dispatch table in a weird way.

I work like this in Javascript, but not because of dispatch tables. More because of limiting my namespace footprint. You can have a page that's **just** `<html></html>` and there will be a _lot_ of Javascript running, based on your browser and plugins. With all that, plus the code you eventually use from others and write yourself, do you think you'll be the only one who wants `foo()`?

```javascript
var davecode = {};
davecode.code = {};
davecode.code.foo = function () { console.log("FOO") };
davecode.code.bar = function () { alert("BAR") };

// using it as an object-ish
davecode.code.foo();

// using it more like a dispatch table
davecode.code["foo"]();
```

## I Get Deep, I Get Deep, I Get Deep

The core here is populating the dispatch table without populating the dispatch table by hand. The best dispatch table is no symbol table. So, what do we use?

The [Symbol Table](https://en.wikipedia.org/wiki/Symbol_table).

This is the where the language goes to know what `print` and `say` and `foo()` mean. It's akin to saying `if ( is_a_function($x) ) { $x() }`.

And, well...

```perl
#!/usr/bin/env perl
# cli.pl

use strict;
use warnings;

my $cli = CLI->new(@ARGV) ;
$cli->run() ;

package CLI ;
use strict;
use warnings;
use lib '/path/to/lib'; # rather than adding that to PERL5LIB
use base 'CLI_Base' ;
sub cli_hello { print "Hello World!\n" }
1
```

```perl
package CLI_Base;

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

our $VERSION = 0.1;

sub new ( $class, @argv ) {
    my $self;
    $self->{argv} = \@argv;
    return bless $self, $class;
}

sub run ($self) {
    my @vars = map { $self->{$_} } qw{ pathinfo param method };
    return $self->run_command( $self->{argv} );
}

sub run_command ( $self, $argv ) {

    # can() tells us if an object has a method called METHOD, which is
    # good for telling if it is a usable function
    # http://perldoc.perl.org/UNIVERSAL.html
    my $command = $argv->[0] || 'test';
    my $s = $self->can("cli_$command");

    # y/-/_/ because function names cannot be foo-bar, only foo_bar
    if ( !$s ) {
        $command =~ y/-/_/;
        $s = $self->can("cli_$command");
    }

    if (!$s || 'CODE' ne ref $s ) {
        # !$s means we still have nothing by the name of $command.
        # 'CODE' ne ref $s means there is something but it isn't code

        # here is where we might run cli_help or something, depending
        # on desired behavior. But it certainly means we exit.
        exit ;
        }

    $self->$s($argv);
    exit;
}

1;
```

I've never taken the time to learn the more modern Perl OOP methods, but learned this from the center of [`perlbrew`](https://perlbrew.pl/), which has to work with old system perls to allow users to install newer versions. This might not be the version you want to go with, but it is what I understand.

Once more, with annotation:

```perl
#!/usr/bin/env perl

use strict;
use warnings;

# we make a CLI object and exec a function within it.

my $cli = CLI->new(@ARGV) ;
$cli->run() ;

package CLI ;
use strict;
use warnings;

# run() and new() are in the base class, CLI_Base. We add to the symbol
# table with cli_hello here.
use base 'CLI_Base' ;
sub cli_hello { print "Hello World!\n" }
1
```

```
$ ./cli.pl
$ ./cli.pl hello
Hello World!
```

The main part of this is `run_command`. We're going with a command-line interface, and `$argv` is an arrayref of `@ARGV`.

At this level, what we're wanting to do is `$argv->[0]`, and the working example is `hello` but the function in the `CLI` class is `cli_hello`. So, we test, using `can()` ( as in, _can I run this?_), by prepending `cli_`. I mean, we don't want to grant the user unrestricted access to the symbol table, we just want to make it behave like a dispatch table.

```perl
sub run_command ( $self, $argv ) {

    # can() tells us if an object has a method called METHOD, which is
    # good for telling if it is a usable function
    # http://perldoc.perl.org/UNIVERSAL.html
    my $command = $argv->[0] || 'test';
    my $s = $self->can("cli_$command");

    # y/-/_/ because function names cannot be foo-bar, only foo_bar
    if ( !$s ) {
        $command =~ y/-/_/;
        $s = $self->can("cli_$command");
    }

    if (!$s || 'CODE' ne ref $s ) {
        # !$s means we still have nothing by the name of $command.
        # 'CODE' ne ref $s means there is something but it isn't code

        # here is where we might run cli_help or something, depending
        # on desired behavior. But it certainly means we exit.
        exit ;
        }

    $self->$s($argv);
    exit;
}
```

`$self->can('cli_hello')` returns a reference to the `cli_hello` subroutine, or `null` if it does not exist. Subroutines cannot have `-` in them, so we change it and try again if `$s` doesn't exist, and exit out (with the possibility of another blog post) if it still doesn't exist (like with a misspelling) or isn't a code reference.

Then, knowing we have what we want, we run it (`$self->$s($argv)`).

## The Deeper I Go, The More Knowledge I Know

Let's take stock. We have the effect of a dispatch table without having to populate it by hand. We have the ability to use this as a base for other command-line programs.

But everything is in the `CLI` package in `cli.pl`. We make modules for a reason. So, first, one addition to the `CLI` package.

```perl
package CLI ;
use strict;
use warnings;
use base 'CLI_Base' ;
use CLI_Subs;
sub cli_hello { print "Hello World!\n" }
1
```

And that `CLI_Subs` module.

```perl
package CLI_Subs;

use Exporter qw{import};
our @EXPORT;
for my $entry ( keys %CLI_Subs:: ) {
    next if $entry !~ /^cli_/mxs;
    push @EXPORT, $entry;
}

sub cli_join {
    my ( $self, $argv ) = @_;
    print join '-', @$argv;
    print "\n";
}
1
```

Here we're using [`Exporter`](https://metacpan.org/pod/Exporter). Rather than the OOP-y arrow-y usage in `CLI_Base`, `Exporter` just allows us to dump subroutines into the programs's symbol table.

Here we avoid DRY again. More standard use of `Exporter` would have us populate by hand `@EXPORT`, the list of functions to be exported ( `our @EXPORT = qw{cli_join}`), but if `$dispatch->{foo} = &foo; sub foo {}` is repeating yourself, then `our @EXPORT = qw{foo}; sub foo {}` must also be repeating yourself.

So, we look at the module's internals (`keys %CLI_Subs::`), grab the subs starting with `cli_` (because again, we don't want to send just anything), and add them to `@EXPORT`.

```
$ ./cli.pl join foo bar blee
join-foo-bar-blee
```

The problem here is when you `use` multiple modules that export the same name. I mean, that's not unique to this setup, but I haven't played around enough to detect this, much less disambiguate.

## Speak to me, Speak to me, Speak to me

There's more to this. Compare the output of these two existing commands, wrangling with a misspelled cry for `hlep`.

```
$ t hlep
Could not find command "hlep".

$ perlbrew hlep
Unknown command: `hlep`. Did you mean `help`?
```

`perlbrew` _knows_ that `help` is a possible command, probably the one you meant. How do we do that with `cli.pl`?

This has a terribly clever solution. I _believe_ it can only happen within the `CLI` package within `cli.pl`, not in any of the module code. At least without some work. I think I will blog that as a follow-up.

(_Attn:_ Thanks to [Joel Berger](https://twitter.com/joelaberger/) for noting points for correction, and for a [Moo](https://metacpan.org/pod/Moo)-based take that I'll look further into.)

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
