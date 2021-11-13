---
layout: post
title: "I Met A Var That Wasn't There: Return of the Spectre of Unicode in Perl"
author: "Dave Jacoby"
date: "2021-11-11 17:10:20 -0500"
categories: ""
---

[I can't let it go.](https://jacoby.github.io/2021/11/10/wont-somebody-think-of-the-children-the-spectre-of-unicode-in-perl.html)

So, let's make an exploit!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say signatures state };

use utf8;

if (1) {
    my $timeout;
    ( $timeout, ㅤ() ) = poorly_trusted_code_from_elsewhere();
    my @array = ( 'curl -s http://perl.com/', 'ping -c 1 purdue.pl', ㅤ() );

    for my $cmd (@array) {
        say $cmd;
        sleep $timeout;
    }
    say join "\n", @array;
    exit;
}

sub ㅤ : lvalue {
    state @array;
    @array = 1 .. 10 unless scalar @array;
    if ( scalar @_ ) {
        @array = @_;

        # say instead of a try {exec()} catch {};
        # because I'm just trying to make a point
        say join ' - ', @array;
    }
    else { return @array }
}

sub poorly_trusted_code_from_elsewhere () {
    return ( 4, 'cat /etc/passwd' );
}
```

(`if (1){ ,,, ; exit}` is a convention I use in my `test` files, where I work to see if I can do the code thing I'm thinking about, not actually solving the problem, and because there can be dozens of things I'm poking at, I put them in this simple if statement and exit out, occasionally turning it to `if (0)` and certainly stopping things at the end of the block.)

So, rather than actually stand up an untrustworthy server, I'm mocking it with `poorly_trusted_code_from_elsewhere`, and having it return a command that ... well, we use shadow passwords, so passing `/etc/passwd` isn't the horror it was in the 1990s, but still, don't.

Then we have a for loop that handles all the commands, in this case `say`ing them rather than running them, because I don't _really_ want to get the source code to [Perl.com](https://www.perl.com/).

If I run this with `use utf8`:

```text
$ ./exploit.pl
HOLY SIGNIFICANT WHITESPACE, BATMAN!
HOLY SIGNIFICANT WHITESPACE, BATMAN!
curl -s http://perl.com/
ping -c 1 purdue.pl
cat /etc/passwd
curl -s http://perl.com/
ping -c 1 purdue.pl
cat /etc/passwd
```

If I comment it out:

```text
$ ./exploit.pl
Unrecognized character \xE3; marked by <-- HERE after $timeout, <-- HERE near column 17 at ./exploit.pl line 11.
```

And, if I run `perlcritic`:

```text
Problem while critiquing "exploit.pl": Can't parse code: Encountered unexpected character '227'
```

But then, you have `sub ㅤ : lvalue { ... }` right in your program. **"Hey Joe"**, you ask. **"What's the deal with this nameless subroutine you put in my code?"**

So, instead, Joe writes `BadMod`, a bad module that does bad things.

```perl
package BadMod;

use strict;
use warnings;
use experimental qw{ say signatures state };
use utf8;

use Exporter qw{import};
our @EXPORT = qw{
    poorly_trusted_code_from_elsewhere
    ㅤ
};

sub ㅤ : lvalue {
    say 'HOLY SIGNIFICANT WHITESPACE, BATMAN!';
    state @array;
    @array = 1 .. 10 unless scalar @array;
    if ( scalar @_ ) {
        @array = @_;

        # say instead of a try {exec()} catch {};
        # because I'm just trying to make a point
        say join ' - ', @array;
    }
    else { return @array }
}

sub poorly_trusted_code_from_elsewhere () {
    return ( 4, 'cat /etc/passwd' );
}

1
```

And there's nothing _too_ noticable in the main code, beyond `()` in places that kinda smell, and a warning on `perlcritic`.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say signatures state };
use utf8;

use lib '.';
use BadMod;

if (1) {
    my $timeout;
    ( $timeout, ㅤ() ) = poorly_trusted_code_from_elsewhere();
    my @array = ( 'curl -s https://perl.com/', 'ping -c 1 purdue.pl', ㅤ() );

    for my $cmd (@array) {
        say $cmd;
        sleep $timeout;
    }
    say join "\n", @array;
    exit;
}
```

```text
$ ./exploit.pl
HOLY SIGNIFICANT WHITESPACE, BATMAN!
HOLY SIGNIFICANT WHITESPACE, BATMAN!
curl -s https://perl.com/
ping -c 1 purdue.pl
cat /etc/passwd
curl -s https://perl.com/
ping -c 1 purdue.pl
cat /etc/passwd
```

And `exploit.pl` still fails `perlcritic` has weird code-smelly braces in there.

So, if you write BadMod a bit like this:

```perl
package BadMod;

# pseudocode, this won't actually run
my @bad_commands;

sub poorly_trusted_code_from_elsewhere () {
    push @bad_commands,  'cat /etc/passwd' ;
    return  4;
}

sub execute_commands ( @good_commands ) {
    push @good_commands, @bad_commands;
    for my $cmd (@good_commands) {
        say $cmd;
        sleep $timeout;
    }
}

1
```

Just rename `@bad_commands` to something more innouous and fill the module with dead code, obfuscated code and a thousand globals and you could never tell there's a problem, and it will pass `perlcritic`.

So, could I get `exploit.pl` to 'execute' things that it shouldn't? Definitely. 

Are there better ways to get exploit code into a code base that _don't_ use a character set that can be easily turned off on a whim and don't trigger any of the default Perl::Critic policies? Absolutely.

Is this something you should be aware of? Sure.

Should anyone be afraid of using a character set that allows the use of letters foreigners use (like لؤلؤة) or images the kids use while texting (like 🍆)? So afraid they categorize it over real threats or problems? No. That doesn't make a lick of sense.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
