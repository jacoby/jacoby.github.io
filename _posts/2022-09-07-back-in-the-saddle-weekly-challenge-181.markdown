---
layout: post
title: "Back In The Saddle: Weekly Challenge #181"
author: "Dave Jacoby"
date: "2022-09-07 11:27:13 -0400"
categories: ""
---

It's [Challenge #181](https://theweeklychallenge.org/blog/perl-weekly-challenge-181/)! I took a few off, and when I got back into meeting the challenge, I didn't write about it. I'll tell you straight out that my head was elsewhere, but beyond fighting off a cough that just would not go away (I'm fine now, and it wasn't any of the bugs going around)

### Task 1: Sentence Order

> Submitted by: Mohammad S Anwar
> You are given a paragraph.
>
> Write a script to order each sentence alphanumerically and print the whole paragraph.

Oh, if I just knew how to make certain parts of Markdown work together.

So, we're given a paragraph that looks a lot like this:

```text
    All he could think about was how it would all end. There was
    still a bit of uncertainty in the equation, but the basics
    were there for anyone to see. No matter how much he tried to
    see the positive, it wasn't anywhere to be seen. The end was
    coming and it wasn't going to be pretty.
```

And we're to make it look like this.

```text
    about All all could end he how it think was would. a anyone
    basics bit but equation, for in of see still the the There
    there to uncertainty was were. anywhere be he how it matter
    much No positive, see seen the to to tried wasn't. and be
    coming end going it pretty The to was wasn't.
```

Now, it's fairly simple, conceptually, but it breaks implementation because we as programmers like to split on line breaks, and as Internet People, well...

"Internet People" is a term from Gretchen McCulloch's book, [_Because Internet: Understanding the New Rules of Language_](https://gretchenmcculloch.com/book/), and it covers a lot of great topics, like how we actually use emoji, and, important to this discussion, why punctuation is considered rude in texts.

This is a bit more of a conversation, and you can tell when a sentence in a conversation ends by the gap

Yes, you don't need a period to say we're on a new sentence, because a space has been added between the two

As you can see

And when you're used to that, the adding of punctuation is performative to get a certain effect

For example, I used to have a LiveJournal am WILDLY EXCITED AT THIS IDEA!!!!!1111!!!!!ELEVENTYONE!!!!!!!

And. If. I. Am. Speaking. Very. Clearly. I. Am. Clearly. Angry. But. Letting. It. Boil.

So, get that book. Read about the fun ways language is changing because Internet. But, in this task's case, the separator _is_ the period. Because the sample set doesn't care that healthy body temperature is 98.6°F and doesn't let it's thoughts go incomplete ... let's just say that the period is wildly overloaded in written English, but we're going to handwave over that.

So, first thing we do is reduce the newlines to spaces. We're not doing tabs here, which is another complication. My my my, dealing with human communication is fun! Then we split on `. ` (period space, to be clear) to get the actual sentences.

Next is splitting the sentence on spaces (`split /\ +/`) and sorting the words. Here, I'm living the Modern Perl life and using `fc` or **fold case** instead of `uc` or `lc` in my sort. `fc` is what you use when you want to handle Unicode (which, because it's first and foremost to allow for the character sets for languages other than English, not just 💩 and 🤣), and because I want my go-to actions to work when dealing with future problems I don't know yet, we do `sort { fc $a cmp fc $b }`. We then join the words into sentences with spaces (`join ' ', @sentence`), append period space to each sentence and join them into a paragraph.

Which does not wrap. Often, it doesn't matter. Browsers wrap automatically. Most code editors allow you to turn word-wrap on and off, depending on what you're doing. (I normally let it wrap, but when I have to do something like make every line in a blockquote, like I do with the Task description, I turn that off.) So, we decide the desired length, split the paragraph we have back into words, add them to a line, and when that line is long enough, append it and a newline to the output and start a new empty line. We have to remember to add the last line when it comes to an end while still being shorter than the line length.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ fc say postderef signatures state };

my $input = <<"END";
All he could think about was how it would all end. There was
still a bit of uncertainty in the equation, but the basics
were there for anyone to see. No matter how much he tried to
see the positive, it wasn't anywhere to be seen. The end was
coming and it wasn't going to be pretty.
END

my $output = sentence_order($input);
say $input;
say ' ';
say $output;

sub sentence_order( $input ) {
    my $output = '';
    $input =~ s/\n/ /gmx;
    my @sentences = split /\./, $input;
    for my $sentence (@sentences) {
        my $new = join ' ', sort { fc $a cmp fc $b } split /\ /, $sentence;
        $output .= $new . '. ';
    }
    $output = paragraphize($output);
    return $output;
}

sub paragraphize ( $input, $line_length = 55 ) {
    my @input  = split /\ +/, $input;
    my $output = '';
    my $line   = '';
    for my $word (@input) {
        next if $word !~ /\w/;
        $line .= ' ' if length $line;
        $line .= $word;
        if ( length $line > $line_length ) {
            $output .= $line;
            $output .= "\n";
            $line = '';
        }
    }
    $output .= $line;
    return $output;
}
```

### Task 2: Hot Day

> Submitted by: Mohammad S Anwar  
> You are given file with daily temperature record in random order.
>
> Write a script to find out days hotter than previous day.
>
> Example  
> Input File: (temperature.txt)
>
> `2022-08-01, 20`  
> `2022-08-09, 10`  
> `2022-08-03, 19`  
> `2022-08-06, 24`  
> `2022-08-05, 22`  
> `2022-08-10, 28`  
> `2022-08-07, 20`  
> `2022-08-04, 18`  
> `2022-08-08, 21`  
> `2022-08-02, 25`
>
> Output:  
> `2022-08-02`  
> `2022-08-05`  
> `2022-08-06`  
> `2022-08-08`  
> `2022-08-10`

This is conceptually easy. I use a DATA block rather than actually making a file, which means I don't `if ( -f $file && open my $fh, '<', $file ) { ... ; close $fh }` but that's fairly known and I've talked about that before.

Instead, I go through every line of `__DATA__` with `while (<DATA>) {}` , use `chomp` to remove newlines, and put them into an array. I then sort the array, because we want to compare yesterday with today.

I set a variable to be out-of-band with the rest of the data (1000° would mean the oceans boil in either Celcius or Fahrenheit), and after we decide if this day meets the requirements, we make that variable today's temp.

#### Show Me The Code!

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use experimental qw{ say postderef signatures state };

# reading a file isn't the interesting part.

my @data;
while (<DATA>) {
    chomp;
    next unless /\d/;
    push @data, $_;
}

my $prev = 1000;
for my $day ( sort @data ) {
    my ( $date, $temp ) = split /\,\ /, $day;
    if ( $temp > $prev ) {
        say $date;
    }
    $prev = $temp;
}

__DATA__
2022-08-01, 20
2022-08-09, 10
2022-08-03, 19
2022-08-06, 24
2022-08-05, 22
2022-08-10, 28
2022-08-07, 20
2022-08-04, 18
2022-08-08, 21
2022-08-02, 25
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
