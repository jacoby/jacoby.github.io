---
layout: post
title: "On Comparative Languages: `in` in Python"
author: "Dave Jacoby"
date: "2024-02-29 13:34:27 -0500"
categories: ""
---

I was proving myself and writing some code, and I decided to do the same thing in Python.

This, of course, made me have to learn some Python.

One of the things I had to do is check if an element is in a list. As it turns out:

```python
if word in list:
    whatever(word)
```

This is a thing you often have to do, and in Perl, I got it into my head that doing it with `grep` is a heavy process.

This led me to make a hash like `my %list = map { $_ => 1 } @list` so I could just test `$list{$word}` when I need it.

And then I did some looking and found `first` in fan-favorite [List::Util](https://metacpan.org/pod/List::Util). I think I've known this, just never go back to it.

So, I decided that I had to do some testing. [Benchmark](https://metacpan.org/pod/Benchmark) is a great way to put together tests and run them against each other.

The tests I'm doing are, pseudocodishly:

```text
make an array of so many even numbers
make an comparison array of so many numbers
for each value in the comparison array
    check if that value is in the array
    store that result in a hash table
```

There are three ways I have written tests.

### First

```perl
use List::Util qw{ first };
my @array = map { $_ * 2 } 0 .. ( 10 * $count );
my @comp  = 1 .. $count;
my %is_in_list;
for my $i (@comp) {
    no warnings;
    my $first = first { $_ == $i } @array;
    $is_in_list{$i} =
        defined $first ? 'true' : 'false';
}
```

### Grep

```perl
my @array = map { $_ * 2 } 0 .. ( 10 * $count );
my @comp  = 1 .. $count;
my %is_in_list;
for my $i (@comp) {
    $is_in_list{$i} =
        ( grep { $i == $_ } @array )
        ? 'true' : 'false';
}
```

### Hash

```perl
my @array = map { $_ * 2 } 0 .. ( 10 * $count );
my @comp  = 1 .. $count;
my %array = map { $_ => 1 } @array;
my %is_in_list;
for my $i (@comp) {
    $is_in_list{$i} =
        defined $array[$i] ? 'true' : 'false';
}
```

## Results

### Small Iteration Count (400 iterations)

**1000 Elements In the Array**

|                    | First             | Grep              | Hash             |
| ------------------ | ----------------- | ----------------- | ---------------- |
| 5 comp variables   | 13 wallclock secs | 26 wallclock secs | 1 wallclock secs |
| 50 comp variables  | 11 wallclock secs | 27 wallclock secs | 1 wallclock secs |
| 500 comp variables | 11 wallclock secs | 27 wallclock secs | 2 wallclock secs |

**10000 Elements In the Array**

|                    | First             | Grep              | Hash             |
| ------------------ | ----------------- | ----------------- | ---------------- |
| 5 comp variables   | 14 wallclock secs | 29 wallclock secs | 1 wallclock secs |
| 50 comp variables  | 12 wallclock secs | 28 wallclock secs | 1 wallclock secs |
| 500 comp variables | 11 wallclock secs | 26 wallclock secs | 1 wallclock secs |

**100,000 Elements In the Array**

|                    | First             | Grep              | Hash             |
| ------------------ | ----------------- | ----------------- | ---------------- |
| 5 comp variables   | 11 wallclock secs | 27 wallclock secs | 1 wallclock secs |
| 50 comp variables  | 10 wallclock secs | 29 wallclock secs | 1 wallclock secs |
| 500 comp variables | 10 wallclock secs | 31 wallclock secs | 1 wallclock secs |

### Medium Iteration Count (4000 iterations)

**1000 Elements In the Array**

|                    | First          | Grep           | Hash           |
| ------------------ | -------------- | -------------- | -------------- |
| 5 comp variables   | wallclock secs | wallclock secs | wallclock secs |
| 50 comp variables  | wallclock secs | wallclock secs | wallclock secs |
| 500 comp variables | wallclock secs | wallclock secs | wallclock secs |

**10000 Elements In the Array**

|                    | First          | Grep           | Hash           |
| ------------------ | -------------- | -------------- | -------------- |
| 5 comp variables   | wallclock secs | wallclock secs | wallclock secs |
| 50 comp variables  | wallclock secs | wallclock secs | wallclock secs |
| 500 comp variables | wallclock secs | wallclock secs | wallclock secs |

**100,000 Elements In the Array**

|                    | First          | Grep           | Hash           |
| ------------------ | -------------- | -------------- | -------------- |
| 5 comp variables   | wallclock secs | wallclock secs | wallclock secs |
| 50 comp variables  | wallclock secs | wallclock secs | wallclock secs |
| 500 comp variables | wallclock secs | wallclock secs | wallclock secs |


### Large Iteration Count (40000 iterations)

**1000 Elements In the Array**

|                    | First          | Grep           | Hash           |
| ------------------ | -------------- | -------------- | -------------- |
| 5 comp variables   | wallclock secs | wallclock secs | wallclock secs |
| 50 comp variables  | wallclock secs | wallclock secs | wallclock secs |
| 500 comp variables | wallclock secs | wallclock secs | wallclock secs |

**10000 Elements In the Array**

|                    | First          | Grep           | Hash           |
| ------------------ | -------------- | -------------- | -------------- |
| 5 comp variables   | wallclock secs | wallclock secs | wallclock secs |
| 50 comp variables  | wallclock secs | wallclock secs | wallclock secs |
| 500 comp variables | wallclock secs | wallclock secs | wallclock secs |

**100,000 Elements In the Array**

|                    | First          | Grep           | Hash           |
| ------------------ | -------------- | -------------- | -------------- |
| 5 comp variables   | wallclock secs | wallclock secs | wallclock secs |
| 50 comp variables  | wallclock secs | wallclock secs | wallclock secs |
| 500 comp variables | wallclock secs | wallclock secs | wallclock secs |


## Code

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
