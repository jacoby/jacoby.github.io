---
layout: post
title: "Copious Free Time: A Project Bunny In My Head"
author: "Dave Jacoby"
date: "2020-07-01 17:50:28 -0400"
categories: ""
---

I present a data table, showing the first ten Presidents of the United States.

| Order | Presidency                     | President              | Party                  |
| ----- | ------------------------------ | ---------------------- | ---------------------- |
| 1     | April 30, 1789 – March 4, 1797 | George Washington      | Unaffiliated           |
| 2     | March 4, 1797 – March 4, 1801  | John Adams             | Federalist             |
| 3     | March 4, 1801 – March 4, 1809  | Thomas Jefferson       | Democratic-Republican  |
| 4     | March 4, 1809 – March 4, 1817  | James Madison          | Democratic- Republican |
| 5     | March 4, 1817 – March 4, 1825  | James Monroe           | Democratic-Republican  |
| 6     | March 4, 1825 – March 4, 1829  | John Quincy Adams      | Democratic- Republican |
| 7     | March 4, 1829 – March 4, 1837  | Andrew Jackson         | Democratic             |
| 8     | March 4, 1837 – March 4, 1841  | Martin Van Buren       | Democratic             |
| 9     | March 4, 1841 – April 4, 1841  | William Henry Harrison | Whig                   |
| 10    | April 4, 1841 – March 4, 1845  | John Tyler             | Whig                   |

Every row is related because it's all about the same person. Every column is related because it's all the same kind of data. If we were to add the other 35, and add ages, ages at inauguration and other data we might want to play with, and we have something we can hang statistics off of.

A [**data frame**](https://www.rdocumentation.org/packages/base/versions/3.6.2/topics/data.frame), we might say.

When I play with R, _this_ is one of the things that hangs me up. I want to extract the `terms count` array so I can tell what percentage of presidents had two full terms or something, and I don't know how to address it. That's an issue between me and R, though. But this is _conceptually_ a powerful thing, because we _know_ what the columns are, while with the closest analog in Perl, the multidimensional array, we just know the index. It's just `$presidents[$i][3]` not `$presidents[$i][party]`.

But that's R stuff. I usually blog Perl stuff. What's going on here?

### Point 1: FFI::Platypus

[FFI::Platypus](https://metacpan.org/pod/FFI::Platypus) is a library for creating interfaces to machine code libraries. I have little desire to do these things myself, but on occasion, I see a thing that makes me think about playing with such things. Like [Travis Gibson connecting to `libusb` to write a device driver in Perl](https://www.youtube.com/watch?v=BWjl4p6jIOc). (I actually forget if he said he used FFI::Platypus or [XS](https://metacpan.org/pod/XS::Framework) to interact with the library.)

There's usually a time, mid-summer, when I get the idea of doing something fairly big and special, pulling in FFI or the like. [I wonder why that could be?](https://perlconference.us/tpc-2020-cloud/)

### Point 2: Feather

["Feather is a fast, lightweight, and easy-to-use binary file format for storing data frames."](https://blog.rstudio.com/2016/03/29/feather/) [It works for Python as well](https://pypi.org/project/feather-format/). I figure, just because I'm not _sure_ what we'd handle this sort of data structure in Perl, but it certainly we should be able to _open_ the things. I mean, how are we supposed to be able to _glue_ everything if we can't?

### Aside: Arrow

it's been a while since I looked at this project, and it seems to have been pulled into Apache's [Arrow platform](https://github.com/apache/arrow). That just changes where we might go to get the library, not how we'd use it, I think.

### Thesis: It Should Be Doable To Introduce Feather to Perl

The two parts, an object file and the FFI code to interact with it, could be done. It's a _Small Matter of Programming_, one might say. Or maybe a _Learning Experience_ that could be done in my _Copious Free Time_.

Yes, the previous paragraph drips with sarcasm, but Perl handling data frames seems reasonable, and FFI is the kind of thing that could level up my game.

### Counterpoint: R is not my problem

Nothing I touch these days has R on it. When I touched R, I did it shallowly, anyways. When I wanted to transfer data to R from Perl previously, MySQL was the intervening tool.

So this is not remotely my itch. It _is_ however, an idea that has hopped into my head, and I think _trying it_ is the only way I can get it out.

But maybe, just _maybe_, the people who might actually _use_ this idea would now see this through, so I don't have to.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
