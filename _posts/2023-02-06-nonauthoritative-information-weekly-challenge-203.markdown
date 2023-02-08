---
layout: post
title: "Non-Authoritative Information: Weekly Challenge #203"
author: "Dave Jacoby"
date: "2023-02-06 17:02:59 -0500"
categories: ""
---

This is [Weekly Challenge #203](https://theweeklychallenge.org/blog/perl-weekly-challenge-203/)

![[203 - Non-Authoritative Information](https://http.cat/203)](https://http.cat/203)

### Task 1: Special Quadruplets

> Submitted by: Mohammad S Anwar  
> You are given an array of integers.
>
> Write a script to find out the total special quadruplets for the given array.
>
> Special Quadruplets are such that satisfies the following 2 rules.
>
> - `nums[a] + nums[b] + nums[c] == nums[d]`
> - `a < b < c < d`

#### Discussion

I tripped up on first pass, thinking that it was `nums[a] < nums[b] < nums[c] < nums[d]`, which makes several of the examples wrong. Silly me.

I _believe_ I could've made an iterative version of this, but the simpler take, to me was to think...

**_This_ looks like a _job_ for _Recursion!_**

_Ahem._

There are two end cases:

- we have four results _and_ the sum of the first three equals the fourth
- we have run off the end of the array and can't throw on more numbers

We have to test them in that order, rather than do the tests before we call the next. I mean, we _could_, but ...

So, with the calling, we pass the array we're testing as a reference (so it could be of any size), we add one to the index, and we either add the number in the current position or not.

I also used [https://metacpan.org/pod/Getopt::Long](Getopt::Long) to allow a _verbose_ flag.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use List::Util qw{ sum0 };
use Getopt::Long;

my $verbose = 0;

GetOptions(
    'verbose'  => \$verbose,
);


my @examples = (

    [ 1, 2, 3, 6 ],
    [ 1, 1, 1, 3, 5 ],
    [ 3, 3, 6, 4, 5 ]
);

for my $e (@examples) {
    my $list = join ',', $e->@*;
    my $out  = special_quadruplets($e);
    say <<"END";
    Input:  \@array = ($list)
    Output: $out
END
}

sub special_quadruplets ( $arrayref, $pos = 0, $resultref = [] ) {
    my $output;

    # case: resultref is the right size
    if ( scalar $resultref->@* == 4 ) {
        my @results = $resultref->@*;
        my $sum     = sum0 @results[ 0, 1, 2 ];
        if ( $sum == $results[3] ) {
            say join ' ', @results if $verbose;
            return 1;
        }
        return 0;
    }

    # case: we've run out of data
    return 0 if !defined $arrayref->[$pos];

    my $newref = [];
    $newref->@* = $resultref->@*;
    $output +=
        special_quadruplets( $arrayref, $pos + 1, $newref ); # don't include this
    push $newref->@*, $arrayref->[$pos];
    $output +=
        special_quadruplets( $arrayref, $pos + 1, $newref );    # include this
    return $output;
}
```

```text
$ ./ch-1.pl -v
1 2 3 6
    Input:  @array = (1,2,3,6)
    Output: 1

1 1 3 5
1 1 3 5
1 1 3 5
1 1 1 3
    Input:  @array = (1,1,1,3,5)
    Output: 4

    Input:  @array = (3,3,6,4,5)
    Output: 0
```

### Task 2: Copy Directory

> Submitted by: Julien Fiegehenn  
> You are given path to two folders, $source and $target.
>
> Write a script that recursively copy the directory from $source to $target except > any files.

#### Discussion

So, there are two parts: making the directories and traversing the directories. Given a directory you desire, `mkdir $path_of_directory` will do. So, the trick is to traverse `$source`, and, in each directory, find every new directory, create every directory within that directory, then go into that directory and do it again. This involves fun with `opendir` and directory handles and keeping track of your paths.

(I keep thinking that it would be fun and/or useful to make directory spider that takes a dispatch table, so if it finds files like this or directories like that, it would run this or that funcion on that node. The idea is still in my head, but I don't have a strong idea for a thing I would want to do that I can't do by abusing `ls -R` or `find . | grep <whatever>`, which yeah, is a beginner's use of `find`. I never remember `xargs` or `-exec`.)

(Besides, the core of a directory spider is so quick and easy to implement that it's easier to rewrite from scratch than make the one using subroutine refs.)

Anyway, I don't move forward on three tests.

- it starts with a `.`, which marks it as the meta "this directory", the meta "parent directory", or a hidden file or directory. I suppose we could _want_ to create hidden directories, but whatever.
- the source directory exists and is a directory (we're not copying files or creating zero-length files of the same name, only directories)
- the target directory exists. As I write this, I'm second-guessing myself, but if we're making the `x/y` directory new, then it shouldn't matter.

I _could've_ used `chdir`, but I usually find it's easier to deal with paths than try to keep track of the current directory.

Again, I used [https://metacpan.org/pod/Getopt::Long](Getopt::Long) to allow arbitrary source and target paths, plus use the _verbose_ flag. I believe it was _Perl Best Practices_ that said you should use one standard `Getopt` library, and that it probably should be `Getopt::Long`. The book's _this far_ out of arm's reach and I don't want to stand up to look it up. You understand.

Also, **_This_ looks like a _job_ for _Recursion!_**

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

use Getopt::Long;

my $source  = './a/b/c';
my $target  = './x/y';
my $verbose = 0;

GetOptions(
    'source=s' => \$source,
    'target=s' => \$target,
    'verbose'  => \$verbose,
);

copy_directory( $source, $target );

sub copy_directory ( $source, $target ) {
    return unless -d $source;
    return unless -d $target;
    my @dirs;
    if ( opendir my $dh, $source ) {
        for my $f ( sort readdir $dh ) {
            my $s = join '/', $source, $f;
            my $t = join '/', $target, $f;
            next if $f =~ /^\./;
            next unless -d $s;
            next if -d $t;
            mkdir $t;
            copy_directory( $s, $t );
            say join ' => ', $s, $t if $verbose;
        }
    }
}
```

```text
$ ./ch-2.pl -s ~/bin -v
/home/jacoby/bin/Backup => ./x/y/Backup
/home/jacoby/bin/Capital => ./x/y/Capital
/home/jacoby/bin/Fitbit => ./x/y/Fitbit
/home/jacoby/bin/LastFM => ./x/y/LastFM
/home/jacoby/bin/Old/Test/Data => ./x/y/Old/Test/Data
/home/jacoby/bin/Old/Test => ./x/y/Old/Test
/home/jacoby/bin/Old => ./x/y/Old
/home/jacoby/bin/Out_Of_Rotation/Old/Test/Data/Other => ./x/y/Out_Of_Rotation/Old/Test/Data/Other
/home/jacoby/bin/Out_Of_Rotation/Old/Test/Data => ./x/y/Out_Of_Rotation/Old/Test/Data
/home/jacoby/bin/Out_Of_Rotation/Old/Test => ./x/y/Out_Of_Rotation/Old/Test
/home/jacoby/bin/Out_Of_Rotation/Old => ./x/y/Out_Of_Rotation/Old
/home/jacoby/bin/Out_Of_Rotation/TESTING => ./x/y/Out_Of_Rotation/TESTING
/home/jacoby/bin/Out_Of_Rotation/moo-test => ./x/y/Out_Of_Rotation/moo-test
/home/jacoby/bin/Out_Of_Rotation/test => ./x/y/Out_Of_Rotation/test
/home/jacoby/bin/Out_Of_Rotation => ./x/y/Out_Of_Rotation
/home/jacoby/bin/SGT => ./x/y/SGT
/home/jacoby/bin/Toys/Dict => ./x/y/Toys/Dict
/home/jacoby/bin/Toys/Dict_old => ./x/y/Toys/Dict_old
/home/jacoby/bin/Toys => ./x/y/Toys
/home/jacoby/bin/imap => ./x/y/imap
/home/jacoby/bin/lib => ./x/y/lib
/home/jacoby/bin/shell_scripts => ./x/y/shell_scripts
/home/jacoby/bin/wordgames => ./x/y/wordgames
```

Maybe I should clean out a lot of that stuff.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
