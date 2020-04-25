---
layout: post
title:  "Tic-Tac-Toe in Perl: A Review"
author: "Dave Jacoby"
date:   "2020-04-24 19:05:05 -0400"
categories: ""
---

I know some people that are really involved in the Fedora Project, so occasionally on the Socials Media, I see bits and pieces from that part of the technosphere.

[A man named Gregory Bartholomew wrote a demo of "PERL" with Tic-Tac-Toe](https://fedoramagazine.org/demonstrating-perl-with-tic-tac-toe-part-1/),and ... I'm torn. 

I'm glad when people write about my language of choice in positive terms, but within the Perl community, _`perl`_ is the executable, the actual binary used to run, and _Perl_ is the language, the community, the mindset, the philosophy, and the infrastructure such as CPAN, MetaCPAN, CPAN-Testers, the Perl Foundation, Perl.com, various Perl Mongers groups, etc. Nobody within _Perl_ calls _Perl_ _PERL_.

But we have the concept of [DarkPAN](http://modernperlbooks.com/mt/2009/02/the-darkpan-dependency-management-and-support-problem.html), of the community of people and the collections of code that rely on `perl` without connection to _Perl_. We test `perl` and the modules in CPAN so, when they change, they don't break Perl, and hopefully also don't break DarkPAN.

Some are less happy with this, sure, but as Larry Wall says, **"There's more than one way to do it"**, and so while I'll use `perl` and _Perl_, if Gregory doubles-down on _PERL_, I'll accept it.

### Onto the Code

```perl
00 #!/usr/bin/perl
01
02 use feature 'state';
```

It's not _too_ disconnected; [`state`](https://metacpan.org/pod/feature#The-'state'-feature) is a newish thing, coming in with 5.10. (We're on 5.30 now, but I enjoy it.)

```perl
04 use constant MARKS=>[ 'X', 'O' ];
05 use constant BOARD=>'
06 ┌───┬───┬───┐
07 │ 1 │ 2 │ 3 │
08 ├───┼───┼───┤
09 │ 4 │ 5 │ 6 │
10 ├───┼───┼───┤
11 │ 7 │ 8 │ 9 │
12 └───┴───┴───┘
13 ';
```

[`constant`](https://perldoc.perl.org/constant.html) is another thing I don't use often, and I'm just not seeing the call to do much with it. I trust myself to not change variables, and while I can't change `MARKS`, I _can_ change `MARKS->[0]`.

```perl
use constant MARKS => [ 'X', 'O' ];
MARKS->[0] = 'ZED';
say join ' ', MARKS->@*;

# ZED O
```

This is the same with `state`: the pointer ID can't change but the data it points to can, and `MARKS` is a pointer to an anonymous array containing `[ 'X', 'O' ]`.

I can't modify `BOARD`, however, and that's potentially cool. I would _like_ to do a heredoc with it, but I don't think I can do a `const` heredoc:

```perl
my $BOARD =<<'END';
 ┌───┬───┬───┐
 │ 1 │ 2 │ 3 │
 ├───┼───┼───┤
 │ 4 │ 5 │ 6 │
 ├───┼───┼───┤
 │ 7 │ 8 │ 9 │
 └───┴───┴───┘
END
```

This is kinda six of one, half-dozen of the other. I love that it's so easy to make a multi-line variable in Perl, in different ways, while it can be _such_ a **PITA** in other languages, so I guess I'm happy with `my $BOARD` and not `const BOARD` this way.

Additionally, I guess I didn't know about [the `BOX DRAWING` chunks of UTF-8](https://www.fileformat.info/info/unicode/block/box_drawing/images.htm), because I so rarely have need for it. Next time I need it, I'll look back into my blog for more info.

The main loop of his Tic-Tac-Toe program is interesting:

```perl
37 PROMPT: {
38    state $game = BOARD;
39
40    my $mark;
41    my $move;
42
43    print $game;
44
45    last PROMPT if ($game !~ /[1-9]/);
46
47    $mark = get_mark $game;
48    print "$mark\'s move?: ";
49
50    $move = get_move;
51    $game = put_mark $game, $mark, $move;
52
53    redo PROMPT;
54 }
```

For such a thing, I would do `while` or `for`, and I don't think I've seen `redo` before.

```perl
    {
        state $c = 1;
        sleep 1;
        say $c++;
        exit if $c > 100;
        redo;
    }
```

If `exit` or `break` is being handled elsewhere, `redo` seems a perfectly cromulent way to loop.

Beyond that, though, I _might_ go to `say` instead of `print` but eh. A reminder of named blocks with `PROMPT: {}` and `redo PROMPT`. With the paucity of blocks, I would suspect that `{ whatever ; redo }` would work, so you don't _need_ to name the block, but sure, help the next developer.

I'm noticing that there's no win detection in this code.

```text
 ┌───┬───┬───┐
 │ O │ 2 │ X │
 ├───┼───┼───┤
 │ O │ X │ 6 │
 ├───┼───┼───┤
 │ 7 │ 8 │ 9 │
 └───┴───┴───┘
 X's move?: 7

 ┌───┬───┬───┐
 │ O │ 2 │ X │
 ├───┼───┼───┤
 │ O │ X │ 6 │
 ├───┼───┼───┤
 │ X │ 8 │ 9 │
 └───┴───┴───┘
 O's move?: 9

 ┌───┬───┬───┐
 │ O │ 2 │ X │
 ├───┼───┼───┤
 │ O │ X │ 6 │
 ├───┼───┼───┤
 │ X │ 8 │ O │
 └───┴───┴───┘
 X's move?:
```

If **you** know and **I** know X won, then it doesn't need the code to know, too, does it?

### Onto The Code, Pt 2

[Well, there's a part 2, and more after that.](https://fedoramagazine.org/demonstrating-perl-with-tic-tac-toe-part-2/), and both scoring and player two are handled.

They're handled in a module, and how they are handled are worth noting. First, there's where his modules are:

```perl
19 use lib 'hal';
20 use if -e 'hal/chip1.pm', 'chip1';
21 use if -e 'hal/chip2.pm', 'chip2';
22 use if -e 'hal/chip3.pm', 'chip3';
```

Assuming you made a directory in `.` named `hal`. I have never used `use if -e $filename, $package` and I think for optional libraries, I would've seen `require` and not `use`. This is not _bad_ -- I thought "hmm, that's clever", but changing behavior depending on what work I've gotten around to seems undesirable.

Also undesirable, to me, is having my libraries in a subdirectory of the dir where my code is. I likely would've hardcoded a full path, or `use lib $ENV{HOME}.'/lib'`. It's not _wrong_, it's just now how I would've done it.

The thing I'm much more likely to have to do, trying to use the same personal libraries on several machines with different directory structures and such, is `use` several `lib`s.

```perl
# for example:
use lib '/home/jacoby/lib';
use lib '/Users/jacoby/lib';
use lib 'C:/Users/jacob/lib';
use Dave::Util;
```

The scoring function uses [Algorithm::Combinatorics](https://metacpan.org/pod/Algorithm::Combinatorics), which I'll comment on later, but for me, I'm far more likely to use `cpanm Algorithm::Combinatorics` than `dnf install perl-Algorithm-Combinatorics` or even `apt install libalgorithm-combinatorics-perl`. I mean, I've _done it_, and sometimes it is the only way, but the author is writing to a Fedora audience, and as a guess, if they were working with production and test and using without root access to their computer, they'd be running Red Hat and not Fedora. I have had my feet in both puddles, and because system Perl is not always as current as I would want, and the admins not always as responsive as I'd want, I'm very used to `cpan` and `cpanm` to install modules, `perlbrew` to ensure that **I** get 5.30 even when system perl is 5.16 or less, and `#!/usr/bin/env perl` (a hashbang style I first started seeing in Python code) instead of `#!/usr/bin/perl`.

Again, not _wrong_, just a difference between a Fedora mindset and a Perl mindset who has had to beg for upgrades and run it in Solaris, RedHat, Debian, Ubuntu, CentOS, FreeBSD, MacOS, Windows...

(When I ran BeOS, did I ever really run Perl on it? I could never get the NIC going, and I find a computer that can't network fairly useless, so ... maybe?)

The author of the piece includes the line numbers, as well as a one-liner to pull the line numbers (`cat game.txt | perl -npe 's/...//' > game`), but isn't using them to explain the code. I don't read enough Fedora Magazine to know if that's their style or the author's preference, but I'm keeping it

```perl
32 sub get_victor {
33    my $game = shift;
34    my $marks = shift;
35    my $victor;
36
37    TEST: for (@$marks) {
38       my $mark = $_;
39       my @nums = get_moves $game, $mark;
40
41       next unless @nums >= 3;
42       for (combinations(\@nums, 3)) {
43          my @comb = @$_;
44          if (sum(@comb) == 15) {
45             $victor = $mark;
46             last TEST;
47          }
48       }
49    }
50
51    return $victor;
52 }
```

There are small things, like I like sub signatures, so I'd prefer `sub get_victor( $game,$marks) {...}`, but that's preference. I think `TEST: for my $mark ( @$marks ) {...}` would be preferable, and the postderef syntax `TEST: for my $mark ( $marks->@* ) {...}` even more so, but again, the code works.

But how? Without a successful `TEST`, `$victor` remains undefined. `$game` is the game board, `$marks` is the array `['X','O']`, the board is checked each time, and so, when it isn't your turn, it is checking your moves a second time, so we don't need to care if it is X's turn or O's. And `@nums` contains ...

```text
┌───┬───┬───┐
│ X │ O │ O │
├───┼───┼───┤
│ O │ X │ 6 │
├───┼───┼───┤
│ X │ 8 │ X │
└───┴───┴───┘
X:NUMS:2:5:6:8
X wins!
Daisy, Daisy, give me your answer do.
```

My moves on the board are `1, 5, 7, 9`, not `2, 5, 6, 8`, so, what's the magic here?

```perl
07 use constant MAGIC=>'
08 ┌───┬───┬───┐
09 │ 2 │ 9 │ 4 │
10 ├───┼───┼───┤
11 │ 7 │ 5 │ 3 │
12 ├───┼───┼───┤
13 │ 6 │ 1 │ 8 │
14 └───┴───┴───┘
15 ';
```

This replaces the `1, 2, 3...` square in ways that I recognize from [my Overkill posts](https://jacoby.github.io/2020/03/10/overkill-vi-the-rust-and-the-overkill.html), but instead of centering on 7, we do it on 5, so that every winning 3-play combination will add up to 15, which is exactly what is being computed in line 44: `if (sum(@comb) == 15) {...}`.

Which brings us back to **Algorithm::Combinatorics** and `combinations()`.

```perl
41       next unless @nums >= 3;
42       for (combinations(\@nums, 3)) {
43          my @comb = @$_;
44          if (sum(@comb) == 15) {
45             $victor = $mark;
46             last TEST;
47          }
48       }
```

`@nums` is an array, in this case `[ 2, 5, 6, 8 ]`, and `combinations(\@nums,3)`, gives us every 3-digit subgroup: `[ [ 2, 5, 6 ], [ 2, 5, 8 ], [ 2, 6, 8 ], [ 5, 6, 8 ] ]`, as an array reference. I would prefer `for my $comb (combinations(\@nums, 3)) { if ( sum($comb->@*) == 15 ) { ... } }` and would be tempted to announce winner and `exit` instead of setting `$victor` and `last`, but again, matter of taste.

There is a _whole lot_ of clever in here, and not clever in the "magic" sense, where it will break in new versions or if someone breathes on it funny, and nobody will be able to understand it in six months when you get back to it. The _good_ clever, I mean.

But this looks and feels like Perl from a person who doesn't read Perl, doesn't use CPAN often (although some, and well), and doesn't understand how some of the things work. I really like `{ ... ; redo }` as an alternative to `do { ... } while ...`.

And, if I was passing this around and expecting the person didn't have permissions to add a module to their Perl installation, I might've rolled my own versions of `combinations`, like so.

```perl
sub combos ( $arrayref, $size ) {
    my @output;
    if ( $size == 1 ) {
        return map { [$_] } $arrayref->@*;
    }
    elsif ( $size > 1 ) {
        for ( 1 .. scalar $arrayref->@* ) {
            my $n = shift $arrayref->@*;
            for my $ref ( combos( $arrayref, $size - 1 ) ) {
                unshift $ref->@*, $n;
                push @output, $ref;
            }
            push $arrayref->@*, $n;
        }
    }
    my %test;
    @output = grep { !$test{ join ',',sort $_->@* }++ } @output;
    return wantarray ? @output : \@output;
}
```

All things told, I'm very happy to see that Perl is getting respect from Fedora Magazine and from this author. Lots of ideas to borrow. Thank you.


#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)


