---
layout: post
title: "Use Perl Features: switch"
author: "Dave Jacoby"
date: "2018-08-29 12:19:47 -0400"
? categories
---

I will first mention the standard way to report bugs in Perl, `perlbug`.

I hadn't used it before yesterday. I used it twice yesterday.

Because [`perldoc feature`](https://metacpan.org/pod/feature#The-'switch'-feature) says this:

> ## The 'switch' feature
>
> **WARNING:** because the [smartmatch operator](https://metacpan.org/pod/distribution/perl/pod/perlop.pod#Smartmatch-Operator) is experimental, Perl will warn when you use this feature, unless you have explicitly disabled the warning:
>
> `no warnings "experimental::smartmatch";`
>
> `use feature 'switch'` tells the compiler to enable the Perl 6 given/when construct.

I thought that was bad documentation. Smart match is an interesting idea: `42 != 42.0 != "42"`, but shouldn't they? That's the idea.

The implementation is ...

- ["Perl: smartmatch ~~ - Don't use it!](https://code-maven.com/slides/perl-programming/smart-match)
- ["I’ve come to the opinion that if you use the smartmatch operator only on literals, that you will not go insane."](https://softwareengineering.stackexchange.com/questions/122151/why-is-perl-5s-smart-match-operator-considered-broken)
- ["Ricardo wants to fix smart matching, which is horribly broken and always has been, although we're just starting to realize how bad it really is."](http://blogs.perl.org/users/brian_d_foy/2011/07/rethinking-smart-matching.html)

(Just about everything I currently know about smartmatch, I learned in the last 24 hours, trying to understand `switch`.)

So, thinking "That _must_ be faulty documentation", I used `perlbug` and then wrote

```perl
use strict;
use warnings;
use feature qw{ say switch };

for my $foo ( 1, 2, 'abc', '', undef ) {
    say qq{+\tFOO = $foo };
    given ($foo) {
        when (1) { say qq{foo == 1 } }
        when ( [ 2, 3 ] ) { say qq{foo3==2||foo==3} }
        when (/^a/) { say 'Foo starts with "a"' }
        default     { say 'NOTA' }
    }
}
```

And got:

```text
given is experimental at /home/jacoby/switch.pl line 10.
when is experimental at /home/jacoby/switch.pl line 11.
when is experimental at /home/jacoby/switch.pl line 12.
when is experimental at /home/jacoby/switch.pl line 13.
+	FOO = 1
foo == 1
+	FOO = 2
foo3==2||foo==3
+	FOO = abc
Argument "abc" isn't numeric in smart match at /home/jacoby/switch.pl line 11.
Foo starts with "a"
+	FOO =
Argument "" isn't numeric in smart match at /home/jacoby/switch.pl line 11.
NOTA
Use of uninitialized value $foo in concatenation (.) or string at /home/jacoby/switch.pl line 9.
+	FOO =
Use of uninitialized value $_ in pattern match (m//) at /home/jacoby/switch.pl line 13.
NOTA
```

`no warnings qw{ experimental::switch }` doesn't exist, so the operators in `switch` are in `experimental::smartmatch`.

🤷

Once I realized that, while not well-written, the warning in the POD is correct, I made another `perlbug` ticket, saying that moving `given` and `when` to `experimental::switch` is perhaps the better choice.

You can do this pretty much with `if`:

```perl
for my $foo ( 1, 2, 'abc', '', undef ) {
    say qq{+\tFOO = $foo };
    if ( $foo == 1 ) { say qq{foo == 1 } }
    elsif ( $foo == 2 || $foo == 3 ) { say qq{foo3==2||foo==3} }
    elsif ( $foo =~ /^a/ ) { say 'Foo starts with "a"' }
    else                   { say 'NOTA' }
}
```

```text
+	FOO = 1
foo == 1
+	FOO = 2
foo3==2||foo==3
+	FOO = abc
Argument "abc" isn't numeric in numeric eq (==) at /home/jacoby/switch.pl line 21.
Foo starts with "a"
+	FOO =
Argument "" isn't numeric in numeric eq (==) at /home/jacoby/switch.pl line 21.
NOTA
Use of uninitialized value $foo in concatenation (.) or string at /home/jacoby/switch.pl line 20.
+	FOO =
Use of uninitialized value $foo in numeric eq (==) at /home/jacoby/switch.pl line 21.
Use of uninitialized value $foo in numeric eq (==) at /home/jacoby/switch.pl line 22.
Use of uninitialized value $foo in numeric eq (==) at /home/jacoby/switch.pl line 22.
Use of uninitialized value $foo in pattern match (m//) at /home/jacoby/switch.pl line 23.
NOTA
```

(Clearly, it's best to always put the same kind of values through, rather than random types.)

I don't know if you can _really_ call this a switch without _fallthrough_.

```c
//https://en.wikipedia.org/wiki/Switch_statement

switch (age) {
    case 1:     printf("You're one.") ; break;
    case 2:     printf("You're two.") ; break;
    case 3:     printf("You're three.") ;
    case 4:     printf("You're three or four.") ; break;
    default:    printf("You're not 1,2,3 or 4.") ;
}
```

Notice `case 3:` has no `break`, which means that three also executes, so, running `3` through it would get you:

```text
You're three.
You're three or four.
```

(Maybe on the same line? I don't use C often.)

There is at least one algorithm that did a thing with fallthrough, but I cannot find it, and when my 20-years-younger mind read that code, it just boggled. Much harder than the Schwarzian Transform, which I eventually understood.

Perl can do that. **Of course** Perl can do that.

```perl
for my $age ( 1 .. 5 ) {
    say qq{+ Jeffty is $age };
    given ($age) {
        when (1) { say "You're one."; }
        when (2) { say "You're two."; }
        when (3) { say "You're three."; continue; }
        when (4) { say "You're three or four."; }
        default  { say "You're not 1,2,3 or 4."; }
    }
    say '';
}

# + Jeffty is 1
# You're one.
#
# + Jeffty is 2
# You're two.
#
# + Jeffty is 3
# You're three.
# You're not 1,2,3 or 4.
#
# + Jeffty is 4
# You're three or four.
#
# + Jeffty is 5
# You're not 1,2,3 or 4.
```

So, I _could_ use that.

This is not what I do these days, though.

What I normally do is use a dispatch table:

```perl
my $table;
$table->{1}       = sub { say "You're one." };
$table->{2}       = sub { say "You're two." };
$table->{3}       = sub { say "You're three." };
$table->{4}       = sub { say "You're three or four." };
$table->{default} = sub { say "You're not 1,2,3 or 4." };

# I don't need fallthrough
for my $age ( 1 .. 5 ) {
    say qq{+ Jeffty is $age };
    if ( defined $table->{$age} ) {
        $table->{$age}->()
    }
    else { $table->{default}->() }
}
```

I could imagine a `case` `when` I reach for a `switch`, but I'm satisfied with either the table or stacked `if/elsif/else` statements, depending. I'm willing to start, if there's an argument for it, but right now, I just don't see it.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
