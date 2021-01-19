---
layout: post
title: "Going The Distance: Perl Weekly Challenge #96"
author: "Dave Jacoby"
date: "2021-01-18 23:42:08 -0500"
categories: ""
---

Again I'm blogging [the Perl Weekly Challenge](). This one is just _filled_ with clever. I love it!

### TASK #1 › Reverse Words

> Submitted by: Mohammad S Anwar  
> You are given a string `$S`.
>
> Write a script to reverse the order of words in the given string. The string may contain leading/trailing spaces. The string may have more than one space between words in the string. Print the result without leading/trailing spaces and there should be only one space between words.

This one _seems_ straightforward, at first.

```perl
join ' ', reverse split /\s+/, $string;
```

And I _could have_ just coded that and said that is that. It can go _very_ far, but y'know, more things break words than spaces and tabs.

What we kinda want are _word breaks_, and as of 5.22, [Perl has some fancy ones](https://www.effectiveperlprogramming.com/2016/06/perl-v5-22-adds-fancy-unicode-word-boundaries/).

> Perl’s “word” boundaries, `\b`, is a bit of a misnomer that we have to explain carefully in [Learning Perl](http://www.learning-perl.com/) classes. Perl v5.22 adds a somewhat better word boundary, \b{wb}, based on the heuristicis in [Unicode Technical Note 29](https://unicode.org/reports/tr29/).
>
> Perl’s idea of a “word” is something that contains only “word” characters. Those are letters, digits, and the underscore. That’s the character class shortcut `\w`. It’s also locale dependent. And, it’s different for ASCII and the Universal Character Set ([`perlrecharclass`](https://perldoc.perl.org/perlrecharclass.html) explains it). It’s not what we think of as natural words. For instance, consider the [perlfaq4](https://perldoc.perl.org/perlfaq4.html) answer to [How do I capitalize all the words on one line?](https://perldoc.perl.org/perlfaq4.html#How-do-I-capitalize-all-the-words-on-one-line%3f) It’s in the FAQ because it’s a common mistake based on people’s mis-using `\w`:

And so on. What I decided to look for is `/b{wb}/`,

#### The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

# I suppose I'm commenting instead of blogging, or pre-blogging,
# but the key questions with this challenge are:
#   * "What is a word?"
#   * "What is a word boundary?"

# Mohammad gives us an easy one with "The Weekly Challenge",
# where we can easily split on spaces and reverse, but padding
# spaces at the front and end of the next example make things harder.
# I mean, we COULD just use a regular expression to pull out the
# begining and ending spaces, but splitting on /\s/ (space characters)
# and grepping for /\S/ (non-space characters would be OK)

# but a space character isn't a word boundary. I asked and brian d foy
# gave me good advice about word boundaries. I mean, I asked the Internet
# and found his blog post:
#   https://www.effectiveperlprogramming.com/2016/06/perl-v5-22-adds-fancy-unicode-word-boundaries/

# I threw in the line from Buffalo Springfield's "For What It's Worth"
# because it adds an apostrophe, which confounds the pre-5.22 default
# word border separation.

my @inputs;
push @inputs, 'The Weekly Challenge';
push @inputs, '    Perl and   Raku are  part of the same family  ';
push @inputs, q{Nobody's right if everybody's wrong};

for my $s (@inputs) {
    my $r = reverse_words($s);
    say <<"END";
    Input:  "$s"
    Output: "$r"
END
}

# This is a very pipe-y, very Dave way of doing this. Beyond the
# sub signature, I split on word boundaries as the blog suggests,
# grep to make sure that there's something non-space, revers and
# join with a space. I am sure a confounding string can be created
# but I'll engage that when the challenge is presented.
sub reverse_words ( $string ) {
    return join ' ', reverse grep /\S/, split /\b{wb}/, $string;
}
```

```text
    Input:  "The Weekly Challenge"
    Output: "Challenge Weekly The"

    Input:  "    Perl and   Raku are  part of the same family  "
    Output: "family same the of part are Raku and Perl"

    Input:  "Nobody's right if everybody's wrong"
    Output: "wrong everybody's if right Nobody's"
```

### TASK #2 › Edit Distance

> Submitted by: Mohammad S Anwar  
> You are given two strings $S1 and $S2.
>
> Write a script to find out the minimum operations required to convert $S1 into $S2. The operations can be insert, remove or replace a character. Please check out [Wikipedia page](https://en.wikipedia.org/wiki/Edit_distance) for more information.

This is an _easy_ challenge to go halfway on. If we simply want the number of changes it would take, that's [Levenshtein Distance](https://en.wikipedia.org/wiki/Levenshtein_distance). We even have [Text::Levenshtein](https://metacpan.org/pod/Text::Levenshtein) in CPAN if you don't want to go to the trouble of copying it from Wikipedia or the like.

But **no**, we can't just leave it at that, because the examples show **which** changes are made! This forced me to _read_ and _understand(!)_ what's going on with Levenshtein Distance. I mean, _really!?!?_

So, let's take a much simpler example than those given in the challenge. `test` to `text`. We first create an empty 2-dimensional array, with the size of each axis equalling the length of each of the words, plus 1. We start here:

```text
     t e s t
  [0,1,2,3,4]
t [1, , , , ]
e [2, , , , ]
x [3, , , , ]
t [4, , , , ]
```

We start at `[1,1]`, where we check if the first letter of `test` is the same as the first letter of `text`, which it is, and so, the value in `[1,1]` is the same as in `[0,0]`, which is zero.

```text
     t e s t
  [0,1,2,3,4]
t [1,0, , , ]
e [2, , , , ]
x [3, , , , ]
t [4, , , , ]
```

So we step on to `[1,2]`, where we see if `e` in `test` is the same as `t` in `text`. Clearly, no. So we get the values of `[0,1]`,`[0,2]` and `[1,1]`, which are `0, 1, 2`. We take the lowest, `0`, add `1` and set `[1,2]` to `1`.

We go again and again and we end up with.

```text
     t e s t
  [0,1,2,3,4]
t [1,0,1,2,3]
e [2,1,0,1,2]
x [3,2,1,1,2]
t [4,3,2,2,1]
```

And the last one we do, the last column of the last row, is exactly how many changes are necessary.

So, to find out what moves are the right ones, we move backwards, from the last to the first `0` we find.

#### The Code

It's a bit messy, and _very_ first draft. I was just spitting out the operations as I see them, until I realized that they were coming out backwards. And again, `min` from [List::Util](https://metacpan.org/pod/List::Util) because it's _so_ useful.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use List::Util qw{min};

my @input;
push @input, [qw{ kitten sitting }];
push @input, [qw{ sunday monday }];
push @input, [qw{ slight lights }];
push @input, [qw{ fed feed }];
push @input, [qw{ test test }];
push @input, [qw{ test text }];

for my $x (@input) {
    edit_distance( $x->@* );
}

# I first found the Levenshtein distance when poking in the center of
# perlbrew. This is how it knows, when you type `perlbrew xeec` to
# suggest you try `perlbrew exec` instead. This gives us the first
# part, the number of changes you'd need to get from S1 to S2. I thought
# about but never implemented it as a kind-of 404 page for endpoints:
# you look like you're looking for "index" but typed "idnex", for example.

# What we don't get from editdist is WHICH changes those would be.
# therefore, it's a half-solution for this problem.

sub edit_distance ( $s1, $s2 ) {
    editdist( $s1, $s2 );
}

# let's try to make this a whole solution
sub editdist ( $s1, $s2 ) {
    my @s1 = split //, $s1;
    my @s2 = split //, $s2;
    my @d;
    $d[$_][0] = $_ for ( 0 .. @s1 );
    $d[0][$_] = $_ for ( 0 .. @s2 );

    # this creates a two-dimensional array that starts like this:
    #   [0,1,2,3,4,5,6]
    #   [1, , , , , , ]
    #   [2, , , , , , ]
    #   [3, , , , , , ]
    #   [4, , , , , , ]
    #   [5, , , , , , ]
    # which gets filled in iteratively in the nested loops below

    for my $i ( 1 .. @s1 ) {
        for my $j ( 1 .. @s2 ) {

            # Let's understand this. For a particular i and j position
            # if the two agree, D[i][j] equals D[-i][-j]

            # if they don't however, we find the value above
            # the value before and the one above and before, find
            # the lowest, and add one.

            # this means that $d[-1][-1] would have the total

            $d[$i][$j] = (
                  $s1[ $i - 1 ] eq $s2[ $j - 1 ]
                ? $d[ $i - 1 ][ $j - 1 ]
                : 1 + min(
                    $d[ $i - 1 ][$j],
                    $d[$i][ $j - 1 ],
                    $d[ $i - 1 ][ $j - 1 ]
                )

            );
        }
    }

    print <<"END";

    Input: S1: $s1
           S2: $s2
    Change Count:  $d[-1][-1]
END

    my @operations = find_changes( \@d, \@s1, \@s2 );

    my $c = 1;
    for my $operation ( reverse @operations ) {
        say qq{        Operation $c: $operation};
        $c++;
    }

    # returns the last column of the last row, which SHOULD
    # be the min changes.
    return $d[-1][-1];
}

# d  = 2-dimensional array, result of LD
# s1 = array of first input
# s2 = array of second input
# i  = current row
# j  = current column

sub find_changes ( $d, $s1, $s2, $i = -1, $j = -1 ) {

    # -1 means implicit end of array, which gets turned
    # into explicit end of array
    $i = $i == -1 ? -1 + scalar $d->@*       : $i;
    $j = $j == -1 ? -1 + scalar $d->[-1]->@* : $j;

    # zero means that there are no more changes
    return if $d->[$i][$j] == 0;

    my $v  = $d->[$i][$j];
    my $v1 = $d->[ $i - 1 ][ $j - 1 ];
    my $v2 = $d->[$i][ $j - 1 ];
    my $v3 = $d->[ $i - 1 ][$j];

    my @output;
    if (0) {

        # The impossible situation we never planned for.
        # I LIKE to put an if ( false ) statement first,
        # so it's easy to just move the elsifs around
        # should I decide or discern that I have the order
        # wrong.
    }
    elsif ( $v1 == $v - 1 ) {
        my $c1 = $s1->[ $i - 1 ];
        my $c2 = $s2->[ $j - 1 ];
        push @output, qq{replace '$c1' with '$c2'};
        push @output, find_changes( $d, $s1, $s2, $i - 1, $j - 1 );
    }
    elsif ( $v2 == $v - 1 ) {
        my $c1 = $s1->[ $i - 1 ];
        my $c2 = $s2->[ $j - 1 ];
        if ( $j == scalar $s2->@* ) {
            push @output, qq{insert '$c2' at the end};
        }
        else { push @output, qq{insert '$c2'}; }
        push @output, find_changes( $d, $s1, $s2, $i, $j - 1 );
    }
    elsif ( $v3 == $v - 1 ) {
        my $c1 = $s1->[ $i - 1 ];
        my $c2 = $s2->[ $j - 1 ];
        push @output, qq{remove '$c1' from beginning} if $i == 1;
        push @output, qq{remove '$c1'}                if $i != 1;
        push @output, find_changes( $d, $s1, $s2, $i - 1, $j );
    }
    elsif ( $v1 == $v ) {
        push @output, find_changes( $d, $s1, $s2, $i - 1, $j - 1 );
    }
    elsif ( $v2 == $v ) {
        push @output, find_changes( $d, $s1, $s2, $i, $j - 1 );
    }
    elsif ( $v3 == $v ) {
        push @output, find_changes( $d, $s1, $s2, $i - 1, $j );
    }
    return @output;
}

# -------------------------------------------------------------------
# straight copy of Wikipedia's "Levenshtein Distance"
sub levenshtein_distance {
    my ( $f, $g ) = @_;
    my @a = split //, $f;
    my @b = split //, $g;

    # There is an extra row and column in the matrix. This is the
    # distance from the empty string to a substring of the target.
    my @d;
    $d[$_][0] = $_ for ( 0 .. @a );
    $d[0][$_] = $_ for ( 0 .. @b );

    for my $i ( 1 .. @a ) {
        for my $j ( 1 .. @b ) {
            $d[$i][$j] = (
                  $a[ $i - 1 ] eq $b[ $j - 1 ]
                ? $d[ $i - 1 ][ $j - 1 ]
                : 1 + min(
                    $d[ $i - 1 ][$j],
                    $d[$i][ $j - 1 ],
                    $d[ $i - 1 ][ $j - 1 ]
                )
            );
        }
    }
    return $d[@a][@b];
}
```

```text
    Input: S1: kitten
           S2: sitting
    Change Count:  3
        Operation 1: replace 'k' with 's'
        Operation 2: replace 'e' with 'i'
        Operation 3: insert 'g' at the end

    Input: S1: sunday
           S2: monday
    Change Count:  2
        Operation 1: replace 's' with 'm'
        Operation 2: replace 'u' with 'o'

    Input: S1: slight
           S2: lights
    Change Count:  2
        Operation 1: remove 's' from beginning
        Operation 2: insert 's' at the end

    Input: S1: fed
           S2: feed
    Change Count:  1
        Operation 1: insert 'e'

    Input: S1: test
           S2: test
    Change Count:  0

    Input: S1: test
           S2: text
    Change Count:  1
        Operation 1: replace 's' with 'x'
```

I think I'm least happy with the inconsistent hackiness with how I specify beginning and end, but _eh_. Getting to the solution, backtracking from the end of the array, required me to write an in-depth explanation of the problem to my user-group mailing list.

But I'm happy now, and I really loved this one.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
