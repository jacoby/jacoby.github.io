---
layout: post
title: "Pictures of Matchstick Men: Weekly Challenge #296"
author: "Dave Jacoby"
date: "2024-11-18 17:48:02 -0500"
categories: ""
---

Welcome to [**_Weekly Challenge #296_**](https://theweeklychallenge.org/blog/perl-weekly-challenge-296/)

I'm doing this in both Perl and Python this week. How many toy projects must I do before I can put it on my resume?

### Task 1: String Compression

> Submitted by: Mohammad Sajid Anwar  
> You are given a string of alphabetic characters, `$chars`.
>
> Write a script to compress the string with run-length encoding, as shown in the examples.
>
> A compressed unit can be either a single character or a count followed by a character.
>
> BONUS: Write a decompression function.

#### Let's Talk About It

I thought about a solution with regular expressions that would be something like `s/match/code($1)/e`, but I decided against it.

I'm flashing on a meme on Reddit recently, where the bit was that dealing with Regular Expressions is scarier than Nuclear War. A funny thing is that the regex is `(([a-zA-Z\-0-9]+\.)[a-zA-Z]{2,}))$`, and it's a broken regex, and the reader wouldn't know it until they ran or at least read it. Matching braces, that's always the problem. Anyway, I thought about getting deeper into my knowledge to match one or more of a specific character, and kinda thought "I'd rather think about nuclear annihilation right".

I mean, I think I used it recently, and it'd be something like `/[\D]\1+/`, but I'm not sure how to make it work.

So, instead, I used `substr`. Find the first character, find out how many of that character are next to it, and then use a regex to find and count the number of characters in that group. If the count is one, add just the character to the output, otherwise, add the character count and then the character.

I got a comment-every-line thing with the Perl version, which makes it a little less elegant than the Python, but I think the Perl take is more elegant. I grant the possibility that it's my ability with Python that's inelegant.

And as for the bonus, `s{(\D)(\d+)}{ $1 x $2 }gmxe`, but the execute flag is crazy magic.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

my @examples = (qw{ abbc aaabccc abcc });

for my $input (@examples) {
    my $output = string_compression($input);
    say <<"END";
    Input:  \$chars   = "$input"
    Output: "$output"
END
}

sub string_compression ($input) {
    my $output = '';
    while ($input) {
        # get the first character
        my $c = substr( $input, 0, 1 );
        # count of identical characters at the start
        # the regex returns a list of what is matched, which
        # between the lack of the /g flag and the single
        # parens, gives us one expected result
        # map works on every value in the list, and
        # ($l) makes $l the first entry of the list.
        my ($l) = map { length } $input =~ /^([$c]+)/mix;
        # ternary operator: If $l is greater than 1,
        # concatenate the length and the character and
        # append it to the output, otherwise just append
        # the character
        $output .= $l > 1 ? $l . $c : $c;
        # remove that first block of characters
        substr( $input, 0, $l ) = '';
    }
    return $output;
}
```

```python
#!/usr/bin/python3

import re

def main():
    examples = [ "abbc", "aaabccc", "abcc" ]
    for input in examples:
        output = string_compression(input)
        print(f'Input:  input = "{input}"')
        print(f'Output:         "{output}"')
        print("")


def string_compression(string):
    output = ''
    while len(string):
        c = string[0:1]
        cc = re.match(rf"^({c}+)",string)
        l = len(cc.group(0))
        cl = c
        if l > 1:
            cl += str(l)
        string = re.sub(rf"^({c}+)", "", string)
        output = output + cl
    return output

if __name__ == '__main__':
    main()
```

```text
$ ./ch-1.pl && ./ch-1.py
    Input:  $chars   = "abbc"
    Output: "a2bc"

    Input:  $chars   = "aaabccc"
    Output: "3ab3c"

    Input:  $chars   = "abcc"
    Output: "ab2c"

Input:  input = "abbc"
Output:         "ab2c"

Input:  input = "aaabccc"
Output:         "a3bc3"

Input:  input = "abcc"
Output:         "abc2"

```

### Task 2: Matchstick Square

> Submitted by: Mohammad Sajid Anwar
> You are given an array of integers, `@ints`.
>
> Write a script to find if it is possible to make one square using the sticks as in the given array `@ints` where `$ints[ì]` is the length of `i`th stick.

#### Let's Talk About It

And how should I start? Oh, yes, of course.

**This Looks Like A Job For _Recursion!_**

We start with a pile of sticks, a logical square we want to make, and the side we're starting on. If we're past the 4th side, we're only judging if it's working, and here we use `sum0` from [List::Util](https://metacpan.org/pod/List::Util) in Perl, or the built-in `sum` in Python, to tell if all the sides are equal, and if we've used all the sticks. `[ 2, 2, 2, 2, 4 ]` is specifically testing for all the sticks.

From then, we go through each stick and move forward. There is a possibility that you can't make all the sides without joining, so we start by both going to the next side and sticking with the same side. For the other sides, they don't need to be done if the current sum for that side is greater than the sum of the first side.

Also, we're not trying to find all possible correct answers, so we look for any more once we find one. A win is a win, as they say. Here' we use `any` from [List::Util](https://metacpan.org/pod/List::Util), and Python has `any` built in. We also use `any` to reduce the output to either true or false.

#### Show Me The Code

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say state postderef signatures };

use List::Util qw{any sum0};

my @examples = (

    [ 2, 2, 2, 2 ],
    [ 1, 2, 2, 2, 1 ],
    [ 2, 2, 2, 4 ],
    [ 2, 2, 2, 2, 4 ],
    [ 3, 4, 1, 4, 3, 1 ],
    [ 1, 1, 1, 1, 1, 5, 2, 3, 4, 1 ],
    [ 2, 3, 2, 3, 4, 1, 4, 1 ]
);

for my $example (@examples) {
    my $output = matchstick_square($example);
    my $input  = join ', ', $example->@*;
    say <<"END";
    Input:  \$ints = ($input)
    Output: $output
END
}

sub matchstick_square( $sticks, $board = [], $side = 0 ) {
    if ( $side > 3 ) {
        my @summed = map { sum0( $_->@* ) } $board->@*;
        if (   $summed[0] == $summed[1]
            && $summed[0] == $summed[2]
            && $summed[0] == $summed[3]
            && !scalar $sticks->@* )
        {
            return 'true';
        }
        return 'false';
    }
    my @output;
    my @sticks = $sticks->@*;
    for my $i ( 0 .. -1 + scalar @sticks ) {
        next if any { /true/mix } @output;
        my $stick = shift @sticks;
        my @board = map { [@$_] } $board->@*;
        push $board[$side]->@*, $stick;
        if ( $side == 0 ) {
            push @output, matchstick_square( \@sticks, \@board, $side );
            push @output, matchstick_square( \@sticks, \@board, $side + 1 );
        }
        elsif ( sum0( $board[$side] ) >= sum0( $board[0] ) ) {
            push @output, matchstick_square( \@sticks, \@board, $side + 1 );
        }
        else {
            push @output, matchstick_square( \@sticks, \@board, $side );
        }
        push @sticks, $stick;
    }
    if ( any { /true/mix } @output ) {
        return 'true';
    }
    return 'false';
}
```

```python
#!/usr/bin/python3

import copy
import re

def main():
    examples = []
    examples.append( [ 2, 2, 2, 2 ] )
    examples.append( [ 1, 2, 2, 2, 1 ] )
    examples.append( [ 2, 2, 2, 4 ] )
    examples.append( [ 2, 2, 2, 2, 4 ] )
    examples.append( [ 3, 4, 1, 4, 3, 1 ] )
    examples.append( [ 1, 1, 1, 1, 1, 5, 2, 3, 4, 1 ] )
    examples.append( [ 2, 3, 2, 3, 4, 1, 4, 1 ] )
    for e in examples:
        output = matchstick_square(e)
        input = ', '.join(str(i) for i in e)
        print(f'Input:  input = [{input}]')
        print(f'Output:         "{output}"')
        print("")

def matchstick_square( sticks, board=[[],[],[],[]], side=0 ):
    if ( side > 3 ):
        summed = [sum(l) for l in board]
        if summed[0] == summed[1] and summed[0] == summed[2] and summed[0] == summed[3] and 0 == len(sticks):
            return True
        return False


    output = []
    sticks_copy = sticks.copy()
    sticks_len = len(sticks_copy)
    for i in range(0,sticks_len):
        if any(output):
            return True
        board_copy = copy.deepcopy(board)
        stick = sticks_copy.pop(0)
        board_copy[side].append(stick)
        if side == 0:
            output.append( matchstick_square( sticks_copy, board_copy, side ) )
            output.append( matchstick_square( sticks_copy, board_copy, side + 1 ) )
        if sum(board_copy[side]) == sum(board_copy[0]):
            output.append( matchstick_square( sticks_copy, board_copy, side + 1 ) )
        if sum(board_copy[side]) < sum(board_copy[0]):
            output.append( matchstick_square( sticks_copy, board_copy, side ) )
        sticks_copy.append(stick)
    return any(output)

if __name__ == '__main__':
    main()
```

```text
 ./ch-2.pl && ./ch-2.py
    Input:  $ints = (2, 2, 2, 2)
    Output: true

    Input:  $ints = (1, 2, 2, 2, 1)
    Output: true

    Input:  $ints = (2, 2, 2, 4)
    Output: false

    Input:  $ints = (2, 2, 2, 2, 4)
    Output: false

    Input:  $ints = (3, 4, 1, 4, 3, 1)
    Output: true

    Input:  $ints = (1, 1, 1, 1, 1, 5, 2, 3, 4, 1)
    Output: true

    Input:  $ints = (2, 3, 2, 3, 4, 1, 4, 1)
    Output: true

Input:  input = [2, 2, 2, 2]
Output:         "True"

Input:  input = [1, 2, 2, 2, 1]
Output:         "True"

Input:  input = [2, 2, 2, 4]
Output:         "False"

Input:  input = [2, 2, 2, 2, 4]
Output:         "False"

Input:  input = [3, 4, 1, 4, 3, 1]
Output:         "True"

Input:  input = [1, 1, 1, 1, 1, 5, 2, 3, 4, 1]
Output:         "True"

Input:  input = [2, 3, 2, 3, 4, 1, 4, 1]
Output:         "True"
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
