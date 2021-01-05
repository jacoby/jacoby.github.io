---
layout: post
title: "Flattened Anagrams: Perl Weekly Challenge #94"
author: "Dave Jacoby"
date: "2021-01-04 19:34:29 -0500"
categories: ""
---

My first blog of the year and it's about Perl. That's on-brand if I ever had one.

### TASK #1 › Group Anagrams  
> Submitted by: Mohammad S Anwar  
>   
> You are given an array of strings `@S`.  
>   
> Write a script to group Anagrams together in any random order.  
>   
> An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

First step is determining what anagrams are, in a practical way. The sample set we're given is all lower-case and case-protection isn't mentioned in the Task description, so we'll hand-waive the work I'd normally do to have comparable strings. If I wasn't going to do that, I'd go to [the experimental `fc` or _fold case_ feature](https://metacpan.org/pod/distribution/perl/pod/perlfunc.pod#fc) which is the Unicode-safe way of handling case.

As is, I convert to array, sort the array and join back up. I might add my own memoization or include [Memoize](https://metacpan.org/pod/Memoize) if this was production and needed speed, but again, eh.

```perl
sub sort_letters ( $word ) {

    # read this backwards:
    return join '',         #  rejoin the array
        sort                #  sort the array alphabetically
        split //, $word;    #  break word into letter array
}
```

So, given a string, we get a sorted string. We can use that as a key and create a hash of arrays holding all the anagrams.

And then?

Well, hopefully you know that you can get every key in a hash table with `keys %hash`. This is something I use all the time. What you might not know, and what I use _far_ less, is that you can get all the values with `values %hash`, which in our case, would be a hashref full of anagrams. 

```perl
# folding case might be a good idea,
# but not part of the task

sub group_output ( @input ) {

    # we often do keys %hash to handle a hash table
    # in the general sense, but remember you can
    # do the same with values.

    my %hash;
    for my $w (@input) {

        # here we use sort_letters to get a canonical
        # key to identify anagrams.
        push $hash{ sort_letters($w) }->@*, $w;
    }

    # and the results become an array of arrays.
    my @array = values %hash;
    return wantarray ? @array : \@array;
}
```

#### The Full Code

I had fallen away from commenting my code, rather explaining myself in this blog, but today, I decided to go ahead.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

use JSON;
my $json = JSON->new->space_after;

my @input  = qw{ opt bat saw tab pot top was };
my $output = group_output(@input);
say $json->encode($output);
say '';

$output = group_output('x');
say $json->encode($output);
say '';

# folding case might be a good idea,
# but not part of the task

sub group_output ( @input ) {

    # we often do keys %hash to handle a hash table
    # in the general sense, but remember you can
    # do the same with values.

    my %hash;
    for my $w (@input) {

        # here we use sort_letters to get a canonical
        # key to identify anagrams.
        push $hash{ sort_letters($w) }->@*, $w;
    }

    # and the results become an array of arrays.
    my @array = values %hash;
    return wantarray ? @array : \@array;
}

sub sort_letters ( $word ) {

    # read this backwards:
    return join '',         #  rejoin the array
        sort                #  sort the array alphabetically
        split //, $word;    #  break word into letter array
}
```

```text
[["saw", "was"], ["new"], ["opt", "pot", "top"], ["bat", "tab"]]

[["x"]]
```


### TASK #2 › Binary Tree to Linked List
  
> Submitted by: Mohammad S Anwar
>  
> You are given a binary tree.  
> Write a script to represent the given binary tree as an object and flatten it to a linked list object. Finally print the linked list object.

So, tree flattening means we want to start with

```text
        1
       / \
      2   3
     / \
    4   5
       / \
      6   7
```

and end up with
```text
        1 -> 2 -> 4 -> 5 -> 6 -> 7 -> 3
````

Starting with the root node, `1`, we have two leaves, `2` which comes first and `3` which comes last. So, we have an implicit flattening preference, which is depth-first and left-branch-priority.

I more and more wish that there was a native or core Node implementation, so I could use that rather than grabbing the [_Node_ code I've been grabbing since at least Challenge 57](https://jacoby.github.io/2020/04/20/challenge-57-mostly-binary-trees.html), but oh well. What I have works for me.

I'm hand-waiving the fact that we know where the root node is, but there are a few ways we can determine that if this was in-the-wild code.

Basically, given a root node, we throw the node's value (`1`) onto the array, then look to the left branch, then the right.

So, we have a left branch, and we throw that onto the array, and so on.

With comments removed:

```perl
sub recursive_flatten ( $node ) {
    my @array;
    push @array, $node->value;
    push @array, recursive_flatten( $node->left ) 
        if defined $node->left;
    push @array, recursive_flatten( $node->right ) 
        if defined $node->right;
    return wantarray ? @array : \@array;
}
```

If we started with the `2` of the example tree, we'd:

* add `2` to the local array,giving us `[2]`
* run `flatten()` on the left node, which returns `4`
* add `4` to the local array, giving us `[2, 4]`
  * run `flatten()` on the right node
    * add `[5]` to the local array,giving us `[5]`
    * run `flatten()` on the left node
      * add `6` to the local array,giving us `[6]`
      * return the local array
    * add `[6]` to the local array,giving us `[5, 6]`
    * run `flatten()` on the right node
      * add `7` to the local array,giving us `[7]`
      * return the local array
    * add `[7]` to the local array,giving us `[5, 6, 7]`
    * return the local array
  * add `[5, 6, 7]` to the local array,giving us `[4, 5, 6, 7]`
  * return  `[4, 5, 6, 7]` 

* add `[4, 5, 6, 7]` to the local array,giving us `[2, 4, 5, 6, 7]`
* return  `[2, 4, 5, 6, 7]` 

And if `2` was the root node, `[2, 4, 5, 6, 7]` would the answer, as shown by the inner 5 of the answer.

#### The Full Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

my %nodes = map { $_ => Node->new($_) } 1 .. 7;

$nodes{1}->left( $nodes{2} );
$nodes{1}->right( $nodes{3} );

$nodes{2}->left( $nodes{4} );
$nodes{2}->right( $nodes{5} );

$nodes{5}->left( $nodes{6} );
$nodes{5}->right( $nodes{7} );

say join ' -> ', flatten_tree( $nodes{1} );

# THIS LOOKS LIKE A JOB FOR RECURSION!

# $tree is a node object, presumed to be the root of the
# tree. This code does not determine that, but something
# like while ( ! $node->is_root ) { $node = $node->parent }
# would solve it, as would iterating through the hash keys
# and finding the value(s) that is_root.

sub flatten_tree( $tree ) {
    my @array;

    # every node has value, and that comes first.
    push @array, $tree->value;

    # we prioritize the left branch over the right,
    # recursing on that.
    push @array, flatten_tree( $tree->left )
        if ( defined $tree->left );

    # we go left as our last choice.
    push @array, flatten_tree( $tree->right )
        if ( defined $tree->right );

    # wantarray is good and fun, determining if the
    # caller wants an array or not, and giving the
    # right response. Not usually THE thing that 
    # solves the problem in question, but helpful
    # for bookkeeping issues.
    return wantarray ? @array : \@array;
}

# trees from my challenge 57, with the slightest revision

package Node;

sub new ( $class, $value = 0 ) {
    my $self = {};
    $self->{value}  = $value;
    $self->{left}   = undef;
    $self->{right}  = undef;
    $self->{parent} = undef;
    return bless $self, $class;
}

sub value ( $self ) {
    return $self->{value};
}

sub is_root ( $self ) {
    return defined $self->{parent} ? 0 : 1;
}

sub is_leaf ( $self ) {
    return !defined $self->{left} && !defined $self->{right} ? 1 : 0;
}

sub left ( $self, $node = undef ) {
    if ( defined $node ) {
        $self->{left}   = $node;
        $node->{parent} = $self;
    }
    else {
        return $self->{left};
    }
}

sub right ( $self, $node = undef ) {
    if ( defined $node ) {
        $self->{right}  = $node;
        $node->{parent} = $self;
    }
    else {
        return $self->{right};
    }
}

sub parent ($self ) {
    return $self->{parent};
}
```

```text
./ch-2.pl 
1 -> 2 -> 4 -> 5 -> 6 -> 7 -> 3
```

### Final Thoughts

We have passed to the end of a very hard year for quite a number of us. For the hits I've taken, I'm aware that I've been touched lightly by the events that have made us say each New Years Day "I'm glad _that's_ over!" As sad as it made me to lose Lemmy at the end of 2015 and David Bowie early in 2016, or to see images of the L.A. Hills on fire in 2017, the raw human toll across the world and especially across the country, state and county where I live is significantly worse and particularly heartbreaking.

For those who read this far, I hope that 2021 finds you well, that you and those you care for keep well in every way and that you continue to find joy in reading and understanding code.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
