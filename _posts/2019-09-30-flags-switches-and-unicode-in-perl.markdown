---
layout: post
title: "Flags, Switches and Unicode in Perl"
author: "Dave Jacoby"
date: "2019-09-30 14:54:51 -0400"
categories: ""
---

It started with an idle question to Twitter.

## [Why are command-line arguments called "flags"?](https://twitter.com/JacobyDave/status/1177642948525211650)

They're also called `arguments` or `switches` and `parameters` and, in my language community, `options`, with [`Getopt::Long`](https://metacpan.org/pod/Getopt::Long) being my tool of choice to get them from ARGV to where they can be of use to the rest of the programs.

An awful lot of people liked and retweeted and replied to that tweet. Common opinions include that they're `flags` or `switches` because of the dash being the switch handle or flagpole, that only the ones that are independent and don't set a variable are `flags` or `switches` ( `-p` is a flag, `-p office_inkjet` is not), and that `flag` comes from communication semaphores and/or registers in the hardware.

This is followed by a friend having an idea I was considering at the same time.

## [Now I need to create a unicode getopt module that accepts actual flags... 🇹🇴🇸🇾🇱🇰🇰🇷🇻🇺🇵🇷](https://twitter.com/hercynium/status/1177646162293202944)

And right now, I'm 40/60 on whether that Unicode will translate to flags when I push it up to GitHub.

I can get ... somewhere with this idea.

```perl
#!/usr/bin/env perl
use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

use Encode qw{decode_utf8};
use Getopt::Long;

@ARGV = map { decode_utf8( $_, 1 ) } @ARGV;

my $help = 0;
my $flag = undef;

my $flags = {
    '🏴'   => 'Anarchy!',
    '🏳️'   => 'Surrender!',
    '🏴‍☠️'  => 'Ahoy!',
    '🇫🇷'   => 'Bonjour!',
    '🇦🇶' => 'SO COLD!',
};

GetOptions(
    'help'   => \$help,
    'flag=s' => \$flag,
);

if ($help) {
    say 'HELP!';
    exit;
}
elsif ( defined $flag && defined $flags->{$flag} ) {
    say $flags->{$flag};
}

else { say 'Hello' }
```

```text

$ ./hello.pl -h && ./hello.pl --flag 🏴 && ./hello.pl -f 🇫🇷 && ./hello.pl -f 🏴‍☠️ && ./hello.pl
HELP!
Anarchy!
Bonjour!
Ahoy!
Hello
```

So, that gets us somewhere, and I know that, for some subset of Unicode, variable names are fine. For example, `$π` works. But...

```perl
#!/usr/bin/env perl
use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

my $🏴 => 'Anarchy!';

say $🏴;
```

```text
$ ./crash.pl
Unrecognized character \x{1f3f4}; marked by <-- HERE after my $<-- HERE near column 5 at ./crash.pl line 9.
```

So, that doesn't work. Let's try it with a more established Unicode character.

```perl
#!/usr/bin/env perl
use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

use Encode qw{decode_utf8};
use Getopt::Long;

@ARGV = map { decode_utf8( $_, 1 ) } @ARGV;

my $help = 0;
my $poo = 0 ;

GetOptions(
    '💩' => \$poo,
    'help'   => \$help,
);
if ($help) { say 'HELP!'; exit; }
elsif ( $poo != 0 ) { say '💩' }
else { say 'No 💩' }
```

```text
$ ./crash.pl -💩
Error in option spec: "SCALAR(0xce2200)"
```

But if we comment out the `💩` option, we get this.

```text
$ ./crash.pl -💩
Unknown option: 💩
No 💩
```

But replace Poo with Pi and we get this

```perl
#!/usr/bin/env perl
use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings
    qw{ experimental::postderef experimental::smartmatch experimental::signatures };

use Encode qw{decode_utf8};
use Getopt::Long;

@ARGV = map { decode_utf8( $_, 1 ) } @ARGV;

my $help = 0;
my $π = 0 ;

GetOptions(
    'π' => \$π,
    'help'   => \$help,
);
if ($help) { say 'HELP!'; exit; }
elsif ( $π != 0 ) { say 'π' }
else { say 'No π' }
```

```text
$ ./crash.pl -π && ./crash.pl
π
No π
```

I believe that, with expanded Unicode support, I can run programs with the Jolly Roger flag on Talk Like A Pirate Day and get my output to give me no quarter, etc., but I don't think I could do that now.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
