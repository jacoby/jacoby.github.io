---
layout: post
title: "A Hitch with WSL and Perl Challenge 81"
author: "Dave Jacoby"
date: "2020-10-06 18:04:16 -0400"
categories: ""
---

### G'UH!!!

By and large, I enjoy using the [Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/install-win10). There are some toys I like using that are Windows-focused (I just found that the only Steam game I actually play, XCOM2, actually works under Ubuntu, but I never gave it a shot), and the part that I find I really want, all that command-line goodness, works well in it. X11 is a very powerful thing, but I can't name a time since 2000 that I _really_ abused that power, because by that time I had local machines powerful enough to do real things. Now, that power's on my lap.

In order to _get_ WSL, I jumped on the bandwagon for [Windows Insider](https://insider.windows.com/en-us/). By and large, it's been a good thing. The "New Hotness" isn't always something I need, want or notice, but there are things that come that I love. I mean, Updates before Insider could take _hours_, but now rarely take one hour. Never as fast as `apt-get update && apt-get upgrade && shutdown -r now`, sure, but I'll accept it.

But [Build 20226](https://blogs.windows.com/windows-insider/2020/09/30/announcing-windows-10-insider-preview-build-20226/) bit me.

It was supposed to have storage system health monitoring, the start of changes to the Windows SDK coming with each build, and some other small things. What it _really did_ was [lock me out of my user profile.](https://answers.microsoft.com/en-us/insider/forum/insider_wintp-insider_security/build-20226-user-profile-logon-issue-workaround/d95da092-85ba-45e3-9acc-16e26d83635a?tm=1601959687915)

That link has the work-around, which is basically —

```powershell
# Open PowerShell as Administrator
cd c:\users\%username%
takeown /F ntuser.dat*
icacls ntuser.dat* /reset
icacls ntuser.dat* /setowner "SYSTEM"
```

— but I didn't know that at the time. I just knew that computer I had thrown years into customizing for my use had suddenly locked me out, and the Ubuntu installations of WSL had filesystems double couldn't access.

So I got a new laptop. The **Core i(Number)** grew more than two with it, and it has a keyboard I dislike and a touchscreen, which because it's not a Laptop-Tablet foldable thing like the Yoga, I don't expect I'll use much, but it also has more storage and more memory, which tend to be the things I want most.

This is being written on the old laptop, because 1) I fixed it with the above code and 2) it has the years of adapting that I need, making this process easier. I might clear it out, add a DAW and start recording on this one. We'll see. I mean, it's an underpowered thing that I picked up when I was desperate for compute, and beyond the _128GB storage_, it always was able to do whatever I wanted of it.

I guess the big takeaway here is that, to borrow a name from Debian and _Toy Story_, this was a ["Sid" build](https://wiki.debian.org/DebianUnstable) which can break your toys. I no longer can wholeheartedly endorse Windows Insider like I had.

### TASK #1 › Common Base String

> Submitted by: Mohammad S Anwar  
> You are given 2 strings, $A and $B.
>
> Write a script to find out common base strings in $A and $B.
>
> A substring of a string \$S is called base string if repeated concatenation of the substring results in the string.

A **base string** is a string that the other strings are built on. Given the example strings of `abcdabcd` and `abcdabcdabcdabcd`, _a_ base string would be `abcd`.

```text
    abcdabcdabcdabcd
    abcd
        abcd
            abcd
                abcd
```

But that isn't the _only_ base string.

```text
    abcdabcdabcdabcd
    abcdabcd
            abcdabcd
```

Because the base will be part of both strings, we work on the shorter of the two, and then find every substring.

```text
    abcdabcd
    a
    ab
    abc
    abcd        <--- first instance of abcd
    abcda
    abcdab
    abcdabc
    abcdabcd    <--- first instance of abcdabcd
     b
     bc
     bcd
     bcda
     bcdab
     bcdabc
     bcdabcd
      cd
      cda
      cdab
      cdabc
      cdabcd
       dab
       dabc
       dabcd
        abcd    <--- second instance of abcd
         bcd
          cd
           d
```

We get this with two for loops.

```perl
    for my $i ( 0 .. length $aa ) {
        for my $j ( 1 .. ( length $aa ) - $i ) {
...
        }
    }
```

`$i` is the starting point for the substring we check as base, and `$j` is the length of the substring, maxing at the length of the string itself.

```perl
    my $aaa = $aa; # copying the variables so we don't
    my $bbb = $bb; # modify the originals
    my $sub = substr( $aa, $i, $j ); # for example, `babcd`
    my $pad = ' ' x $i;              # same example, `   `,
                # so we can compare with `abcdabcd`
    $aaa =~ s/$sub//gmix; # if we remove all the base
    $bbb =~ s/$sub//gmix; # there should be nothing left
    next unless $aaa eq '' && $bbb eq ''; #which we test here
    say qq{    $pad$sub\t$aaa\t$bbb}; # prints so can be pasted into blog
    # and finally, if we've proven it's base, add to the hash
    $output{$sub} = 1 if $aaa eq '' && $bbb eq '';
```

We use a hash and take the keys so we get unique base strings, not the second or third copies of it. Hashes are fun!

#### The Full Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

common_base( "abcdabcd", "abcdabcdabcdabcd" );
common_base( "aaa",      "aa" );

sub common_base ( @words ) {
    my ( $aa, $bb ) = sort { length $a <=> length $b } @words;
    my %output;

    for my $i ( 0 .. length $aa ) {
        for my $j ( 1 .. ( length $aa ) - $i ) {
            my $aaa = $aa;
            my $bbb = $bb;
            my $sub = substr( $aa, $i, $j );
            my $pad = ' ' x $i;
            $aaa =~ s/$sub//gmix;
            $bbb =~ s/$sub//gmix;
            next unless $aaa eq '' && $bbb eq '';
            # say qq{    $pad$sub\t$aaa\t$bbb};
            $output{$sub} = 1 if $aaa eq '' && $bbb eq '';
        }
    }
    say join ', ', keys %output;
}
```

### TASK #2 › Frequency Sort

> Submitted by: Mohammad S Anwar  
> You are given file named input.
>
> Write a script to find the frequency of all the words.
>
> It should print the result as first column of each line should be the frequency of the the word followed by all the words of that frequency arranged in lexicographical order. Also sort the words in the ascending order of frequency.
>
> For the sake of this task, please ignore the following in the input file:
>
> `. " ( ) , 's --`

The small tricks here include using regexes to remove character strings to be ignored, file tests to be sure we're opening a file and the like. You _might_ be tempted to split on word breaks, but doing so, you'd break into `you` and `d`. Or, rather `you'd` would break. Knowing you have `\b` available is good, but here, turning everying you don't want into spaces and splitting on `\s+` is the best thing.

After the regexes and the split, you have an array of words, and through whichever looping mechanism you want, you use `$word` as a key and `$words{$word}++`. The highest number counted is available using List::Compare and `max keys %words`, and so we loop `1 .. $max` and print a lexographically `sort`ed list of words whenever there is one.

#### The Full Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use List::Util qw{max};

my $file = $ARGV[0];
$file = defined $file && -f $file ? $file : 'input';

frequency_sort($file);

sub frequency_sort( $file ) {
    if ( -f $file && open my $fh, '<', $file ) {
        my $corpus = join '', <$fh>;
        $corpus =~ s/[,\.\(\)\"]/ /g;
        $corpus =~ s/\'s/ /g;
        $corpus =~ s/--/ /g;
        my %words;
        for my $word ( split /\s+/, $corpus ) {
            $words{$word}++;
        }
        my $max = max values %words;

        for my $c ( 1 .. $max ) {
            my @words = sort grep { $words{$_} == $c } keys %words;
            say join ' ', $c, @words, "\n" if scalar @words;
        }

        close $fh;
    }
}
```

I'm sure there's a way I haven't considered that'd allow me to more easily remove the ignore strings, but otherwise, I'm very happy with this code.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
