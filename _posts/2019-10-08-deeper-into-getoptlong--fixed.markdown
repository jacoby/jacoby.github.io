---
layout: post
title: "Deeper into Getopt::Long - Fixed"
author: "Dave Jacoby"
date: "2019-10-08 10:11:59 -0400"
categories: ""
---

> [`Getopt::Long`](https://metacpan.org/pod/Getopt::Long), on the other hand, is a much cleaner and more powerful tool. &mdash; Damian Conway, [_Perl Best Practices_](http://shop.oreilly.com/product/9780596001735.do)

The use of Getopt::Long and the suggested `.vimrc` are the most enduring practices I took from Conway. It is clean and powerful. [There are many choices in CPAN](https://metacpan.org/search?size=20&q=Getopt) for a `Getopt` &mdash; I've seen it said that it's the `hello world` for CPAN modules &mdash; but once I started to _get_ Getopt::Long, I stayed with it.

```perl
# a copied-from-production-code Getopt::Long example

# program -h
# program -m
# program -d 2012-12-12 -s 'add this string'
# program -d 2012-12-12 -r 'remove this string'

sub config () {
    my $config;
    GetOptions(
        'date=s'   => \$config->{date},
        'help'     => \$config->{help},
        'man'      => \$config->{man},
        'remove=s' => \$config->{remove},
        'status=s' => \$config->{status},
    );
    pod2usage( -verbose => 2, -exitval => 1 ) if $config->{man};
    pod2usage( -verbose => 1, -exitval => 1 ) if $config->{help};
    pod2usage( -verbose => 1, -exitval => 1 )
        if defined $config->{date}
        and $config->{date} !~ m{^\d{4}-\d{2}-\d{2}$}mx;
    $config->{date} //= DateTime->now()->set_time_zone('floating')->ymd();
    return $config;
}
```

Here, we accept `date`, `remove` and `status` as string values, and then use [Pod::Usage](https://metacpan.org/pod/Pod::Usage) to show help if the user asks for it, or mangles the date format. You can also specify integers with `=i` and floating point values with `=f`. This is beyond the _flag_ case given with `help` and `man`, which are `1` if set and `null` if not.

### **Default Values and Negatable Flags**

But we might want to have default values. For example, today's date in `date`.

```perl
# A better way to specify date than above, but I didn't think of it
# at the time.

sub config () {
    my $config = {};
    $config->{date} = DateTime->now()->set_time_zone('floating')->ymd();
    GetOptions(
        'date=s'   => \$config->{date},
        'help'     => \$config->{help},
        'man'      => \$config->{man},
    );
    pod2usage( -verbose => 2, -exitval => 1 ) if $config->{man};
    pod2usage( -verbose => 1, -exitval => 1 ) if $config->{help};
    pod2usage( -verbose => 1, -exitval => 1 )
        if defined $config->{date}
        and $config->{date} !~ m{^\d{4}-\d{2}-\d{2}$}mx;
    return $config;
}
```

This is functionally the same, but we pre-set the date and reset it within `GetOptions`.

We also have the negation operator, `!`, which allows us to negate a flag. It goes at the end: `help!`=> \$config->{help}`. Do be careful with this, because just because you can do it doesn't mean it makes sense.

```text
$ ~/program
{
   "help" : null
}

$ ~/program   --help
{
   "help" : 1
}

$ ~/program   -nohelp
{
   "help" : 0
}
```

What, may I ask, would `--nohelp` mean? I could see a case for a certain level of default verbosity, `--verbose` increasing the amount of verbosity and `--noverbose` overriding it and making it absolutely quiet. Just make sure you have a base case that is neither `--flag` nor `--noflag`.

### **Multiple Entries**

Consider a program you want to run:

- Totally silently
- Showing the Start and End
- Showing each record ID, the base case
- Showing sub-processes within each record
- Showing a record of each line of the program

You can add multiple `--verbose` flags to allow you set your verbosity level:

```perl
# sum0 comes from List::Util, which is out of what we're doing here
my $config = {};
$config->{verbosity} = 2;
GetOptions(
    'verbose!' => \$config->{verbose}->@*,
);

$config->{verbosity} =
    scalar $config->{verbose}->@*
    ? $config->{verbosity} + sum0 map { $_ == 1 ? 1 : -1 } $config->{verbose}->@*
    : $config->{verbosity};

say $json->encode($config);
```

```text
$ ~/verbose.pl
{
   "verbose" : [],
   "verbosity" : 2
}

$ ~/verbose.pl   -v
{
   "verbose" : [
      1
   ],
   "verbosity" : 3
}

$ ~/verbose.pl   -nov
{
   "verbose" : [
      0
   ],
   "verbosity" : 1
}

$ ~/verbose.pl   -nov -nov
{
   "verbose" : [
      0,
      0
   ],
   "verbosity" : 0
}

$ ~/verbose.pl   -nov -nov -v -v -v
{
   "verbose" : [
      0,
      0,
      1,
      1,
      1
   ],
   "verbosity" : 3
}
```

Or, and hear me out, you could limit yourself to fewer verbosity states, or, even better, use [IO::Interactive](https://metacpan.org/pod/IO::Interactive) to only give you output when you're running the program interactively.

### **More Multiple Entries and Special Setttings**

I am writing this because I learned about `:` today.

I mean, sure, I knew about it in other contexts: separating return values in ternary operators, separating keys from values in JSON, and introducing a list of items in English grammar (like this). But within `GetOptions`, it means you can have something do double duty as an option and a flag.

```perl
# this time without pretty-print on the JSON
GetOptions(
    'print:i'     => \$config->{print},
);
```

```text
$ ~/wea.pl  -p 1
{"print":1}

$ ~/wea.pl  -p
{"print":0}

$ ~/wea.pl  -p seven
{"print":0}

# because this is looking for integers

$ ~/wea.pl
{"print":null}
```

And, again, if you put an arrayref into `GetOptions` instead of a scalar ref, you can get an array of several values, and `-p` then gets you `[ "" ]`, so you're watching for an empty string if you want to catch the flag.

And, as I've learned, you can also fill a hashref, but more on that later.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
