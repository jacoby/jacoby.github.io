---
layout: post
title: "There Has To Be A Better Way!: A Leap Forward in Word Ladder Technology"
author: "Dave Jacoby"
date: "2021-10-13 17:11:18 -0400"
categories: ""
---

As I always put below, the proper ways to respond to this are to make a GitHub issue or to tweet at me. (If you know my email address or bump into me on the street, I _suppose_ that's also okay...) My friend `@tjmcgrew` [picked up the challenge](https://twitter.com/tjmcgrew/status/1448303059050844163) and put together a [solution](https://gist.github.com/mcgrew/d75234a51bb3dbc1fd6f142ce456bacf) that was _much_ faster than the minutes that my solution had previously taken minutes to finish.

A skim of his code didn't make it obvious to me what was going on, so of course I had to reimplement it in a language of my choice (Perl) to understand it.

**His Code:**

```python
#!/usr/bin/env python3

from sys import argv
from collections import deque, defaultdict

DICTFILE = "/usr/share/dict/words"

def get_words(length):
    words = []
    with open(DICTFILE, 'r') as dictfile:
        for i in dictfile:
            i = i.strip()
            if len(i) == length and i.isalpha() and i.islower():
                words.append(i)
    return words

def diffcount(s,t):
    count = 0
    for x,y in zip(s, t):
        if x != y:
            count += 1
    return count

def find_shortest_path(graph, start, end):
        dist = {start: [start]}
        q = deque([start])
        while len(q):
            at = q.popleft()
            for next in graph[at]:
                if next not in dist:
                    dist[next] = [dist[at], next]
                    q.append(next)
        return flatten_result(dist.get(end))

def flatten_result(result):
    while isinstance(result[0], list):
        result = result[0] + result[1:]
    return result

def main():
    start = argv[1]
    end = argv[2]
    graph = defaultdict(lambda: [])
    if len(start) != len(end):
        print(f"{start}({len(start)}) and {end}({len(end)}) are not the same "
            "length!")
        return
    wordlist = get_words(len(start))
    if start not in wordlist:
        print(f"{start} is not a word")
        return
    if end not in wordlist:
        print(f"{end} is not a word")
        return

    graph[start] = [w for w in wordlist if diffcount(w, start) == 1]
    fail = False
    while not fail:
        fail = True
        for k,v in [*graph.items()]:
            for word in v:
                if word not in graph:
                    fail = False
                    graph[word] = [w for w in wordlist if diffcount(w, word) == 1]
                    if end in graph[word]:
                        print()
                        path = find_shortest_path(graph, start, end)
                        if path:
                            print(' -> '.join(path))
                            return
                        else:
                            fail = True
    print("No path found")

if __name__ == '__main__':
    main()
```

The great and wonderful win, I believe, is using `diffcount` instead of Levenshtein to count the differences between words. **"yeah I started out with Levenshtein but I realized that I really only needed to know how many letters were different since we know both words are the same length."** This is true, except it could drop to boolean, returning `1` if the distance is `1` and `0` if not. Oh well, this is fine.

I believe, however, there's a lot in there that isn't necessary, because he's doing something different with `graph`. In standard Shortest Path (by the algorithm I read), the graph has the child point to parent. If we're going from `code` to `mood`, `mood` would point to `mold`, which would point to `mole`, to `mode` then to `code`. McGrew instead points `code` to every word one letter away from it, and so on. Then, when he finds that he has enough in his graph to solve the thing, he then passes the whole thing to `find_shortest_path` and solves it over again.

I mean, that's a pretty cool way to limit the scope of the loop and remove a lot of _"that's never gonna work"_ entries, but it leaves the solution on the table. My "reimplementation" creates the parent graph, representing each individual edge on the graph.

```perl
    $graph->{$w}->@* =
        grep { 1 == diffcount( $w, $_ ) } @wordlist;
    map      { $parent->{$_} = $w }
        grep { $_ ne $start }
        grep { !$parent->{$_} } $graph->{$w}->@*;
```

Of course, if you're not careful to keep out that starting word, you will end up with a loop.

Anyway, here's my code:

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use feature qw{ say signatures state };
no warnings qw{ experimental };

$! = 1;
main();

sub get_words( $length ) {
    my $file = "/usr/share/dict/words";
    if ( -f $file && open my $fh, '<', $file ) {
        my @words =
            sort { rand 1 <=> rand 1 }
            grep { $_ eq lc $_ }
            grep { !/\W/ }
            grep { length $_ == $length }
            map  { chomp $_; $_ } <$fh>;
        close $fh;
        return @words;
    }
    exit;
}

sub diffcount ( $s, $t ) {
    my $count = 0;
    for my $i ( 0 .. -1 + length $s ) {
        $count++ if substr( $s, $i, 1 ) ne substr( $t, $i, 1 );
    }
    return $count;
}

sub main {
    my ( $end, $start ) = @ARGV;
    my $graph  = {};
    my $parent = {};
    if ( length $start != length $end ) {
        say q{Input lengths are not the same};
        exit;
    }
    my @wordlist = get_words( length $start );
    if ( !grep { /$start/ } @wordlist ) {
        say qq{$start not in wordlist};
        exit;
    }
    if ( !grep { /$end/ } @wordlist ) {
        say qq{$end not in wordlist};
        exit;
    }
    $graph->{$start}->@* = grep { 1 == diffcount( $start, $_ ) } @wordlist;
    map { $parent->{$_} = $start } $graph->{$start}->@*;
    my $fail = 0;

    while ( !$fail ) {
        $fail = 1;
        for my $k ( keys $graph->%* ) {
            my @v = $graph->{$k}->@*;
            for my $w (@v) {
                if ( !$graph->{$w} ) {
                    $fail = 0;
                    $graph->{$w}->@* =
                        grep { 1 == diffcount( $w, $_ ) } @wordlist;
                    map      { $parent->{$_} = $w }
                        grep { $_ ne $start }
                        grep { !$parent->{$_} } $graph->{$w}->@*;
                    if ( grep { /$end/ } $graph->{$w}->@* ) {
                        say 'OK';
                        my $x = $end;
                        print qq{  $x };
                        while ( $parent->{$x} ) {
                            $x = $parent->{$x};
                            print qq{-> $x };
                        }
                        say '';
                        exit;
                    }
                }
            }
        }
    }
    say 'No Path Found'
}
```

I think I could almost take out everything related to `$fail` as well, but it's working and not mission critical, so eh?

However:

```text
 time ./mcgrew_solver.pl judge dread ; echo ;time ./mcgrew_l
adder.py judge dread
OK
  judge -> budge -> bulge -> bulgy -> bully -> dully -> dolly -> doily -> drily -> drill -> trill -> trial -> triad -> tread -> dread

real    0m20.991s
user    0m19.734s
sys     0m0.109s


judge -> budge -> bulge -> bulgy -> bully -> dully -> dally -> daily -> drily -> drill -> trill -> trial -> triad -> tread -> dread

real    0m10.210s
user    0m9.203s
sys     0m0.109s
```

I'm _way down_ from minutes, but my Perl runs twice as slow as his Python, so that needs work.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
