---
layout: post
title:  "What The Perl Conference 2018 Made Me Do"
author: "Dave Jacoby"
date:   "2018-06-19 19:00:38 -0400"
categories: 
---

[David Golden](https://twitter.com/xdg/) gave a talk on [Higher Order Perl](https://www.youtube.com/watch?v=USF4BHMFKbg&feature=youtu.be). Higher Order programming is writing functions that return functions, which allows things to go mad. (See previous writing for more on that.) This inspired me to put **Higher Order Perl** back on my reading list.

[Pudge](https://twitter.com/pudgenet) was inspired to go back to Perl modules, adding to his module **[D'oh](https://metacpan.org/pod/D::oh)** the ability to decide the name of the value you want, simply by typing `use D'oh wq{why_is_this_sucking} ;` 

Now, as I established previously, I stole the core from [perlbrew](https://perlbrew.pl/) which allows me to take a command, like `perlbrew exec` or `perlbrew help`, then look for `&exec` and `&help`, I do this with `$s = $self->can($command) ; $self->$s if defined $s`. 

for `$self->can()` to work, it has to be in the application's symbol table, and because I wanted this portable, I knew the means I needed Perl's [Exporter](https://metacpan.org/pod/Exporter). My magic *here* somes with `use Exporter qw{import}`, where the program can do `use Module qw{foo bar}`, and only the modules `&foo` and `&bar` will come out to play. 

In the module, you have a variable named `@EXPORT` which allows you to say `@EXPORT = qw{ foo bar }`, which sends `&foo` and `&bar` no matter, so the program only does `use Module`. (There's more, but this is enough.)

My thought here is that maintaining a list of names in two places -- `@EXPORT qw{ foo }` and `sub foo {}` -- is a bit ... heavy. Why do it in two places when it could be one? So, I do two things: ensure up there that `$command_` matches `/^api_/`, and go through the module's symbol table (`%Module::`) and pushing into `@EXPORT` when it matches `/^api_/`. 

That is the state of my mind and code before I arrived at SLC. 

Before `@xdg`. Before `@pudgenet` and `D'oh`.

Golden brought to mind making functions that make functions. When planning my days at TPC, I wrote a tool that took the schedule HTML and parsed it into an array of hashrefs which I saved to JSON, and then I wrote a tool that would allow me to search on date, on time, on location, on speaker, and each one was a copy-and-paste of each other which made that easy to write auto-duplications.

This got me thinking that I could get to `use DatabaseAccess qw{table1}`, which would give me a generated function that gave me, in pseudoperl, 

```perl
    sub table1 {
        my $db = get_database_connection();
        my $query = 'SELECT * FROM table1';
        my $response = $db->arraryref($query, {controls=>{}});
            # controls means I get an array of hashrefs. I use it.
        return wantarray ? $response->@* : $response ;
    }
```

I recall having problems using a placeholder for table name in my early days of playing with DBs, so I don't trust that `SELECT * FROM ?` would work, and with this, if the table exists and I ask for it, I can get it. Let me be clear that I still control what gets let out with `use DatabaseAccess qw{ table1 }`, and that just asking for `table7` elsewhere will not work. (Unless I make it so. Which is wrong.)

```perl
    sub tablemaker ( $table ) {
        return sub {
            my $db = get_database_connection();
            my $query = "SELECT * FROM $table" ;
            my $response = $db->arraryref($query, {controls=>{}});
            return wantarray ? $response->@* : $response ;
        }
    }
```

But I have an anonymous functions, maybe a dispatch table, but I cannot pass these into the main program's symbol table.

Which brings us back to D'oh.

The *new* part of D'oh was that, when you do `use D::oh qw{fmep}`, it creates `&fmep` with AUTOLOAD. In this case, it just does one thing: prints a JSON encoding of whatever data it was sent. 

```perl
sub AUTOLOAD {
    my $data ;
    if ( @_ > 1 ) {
        $data = \@_ ;
        }
    elsif ( ref $_[ 0 ] ) {
        $data = $_[ 0 ] ;
        }
    else {
        $data = [ $_[ 0 ] ] ;
        }
    print STDERR encode_json( $data ), "\n" ;
    }
```

This just ignores all context and does one thing no matter what you ask for. In my case, you want to use `$AUTOLOAD`, naming the function that the caller is calling. 

```perl
# state $t2 makes it so $t2, our table-table, exists between uses
# our $AUTOLOAD gets what the caller called, like Module::function
# we pull the function name and make it the table name, $table
# we create the function if it doesn't exist
# then run it, returning the value

sub AUTOLOAD {
    state $t2;  
    our $AUTOLOAD ;
    my ( $table ) = reverse split m{::}, $AUTOLOAD ;
    $t2->{ $table } = tablemaker( $table ) unless defined $t2->{ table } ;
    return $t2->{ $table }->() ;
    }

# Not REALLY connectint to the database, because I'm writing this
# in a ballroom in another state.

sub tablemaker ($table) {
    return sub {
        my $query = "SELECT * FROM $table" ;
        return $query ;
        }
    }

```

```

jacob@Marvin MINGW64 ~/Dropbox/API
$ ./test.pl
SELECT * FROM foo
SELECT * FROM bar
SELECT * FROM blee
SELECT * FROM quuz
```

I'm not explicitly shoving things into `%Module::`, but I **am** making it behave like I am, which is all that I need. There's MUCH more I would want to do with this, but that would be responsibly adding functionality, not recklessly abusing the dynamic nature of Perl. I certainly will present this as part of a talk at some point.



If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).



