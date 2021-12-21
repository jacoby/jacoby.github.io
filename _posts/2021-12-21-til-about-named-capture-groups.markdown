---
layout: post
title: "TIL about Named Capture Groups"
author: "Dave Jacoby"
date: "2021-12-21 17:38:46 -0500"
categories: ""
---

OK, a couple of days ago, but today is the first that I made the time to play with them.

We'll start with something to run regular expressions against. I choose [telephone numbers](https://en.wikipedia.org/wiki/North_American_Numbering_Plan). In the US, they're split up into three-digit area codes, three-digit exchange codes, and four-digit subscriber codes. This gives us a quick and easy formulation to make regular expressions.

If we're going to regex phone numbers, we need one to work with, right? I _could_ use the number that Tommy Tutone used, but it doesn't have an area code and I don't want to bother Jenny anymore. To lean hackish, I'll go with _Sneakers_: at the end of the movie, our heroes have the NSA over a barrel, and they social-engineer themselves into a wishlist of high-ticket items, and Carl, played by River Phoenix, says...

> **Martin Bishop:** Carl?  
>  **Carl:** The, young lady with the... Uzi. Is she single?  
>  **Martin Bishop:** Uh, Carl? Excuse us.  
>  **[pulls Carl aside]**  
>  **Martin Bishop:** This is the brass ring. Haven't you got any bigger thoughts?  
>  **Carl:** I just want her telephone number. Please?  
>  **NSA Agent Mary:** Wait a minute... you can have anything you want, and you're asking for my phone number?  
>  **Carl:** Yes.  
>  **NSA Agent Mary:** 273-9164. Area code 415.  
>  **Carl:** I'm Carl.  
>  **NSA Agent Mary:** I'm Mary.  
>  **Bernard Abbott:** I'm going to be sick!
>
> _[IMDB](https://www.imdb.com/title/tt0105435/quotes/qt0448968)_

The lore is that (415) 273-9164 was the main phone number for the NSA offices in San Francisco, but [MovieChat says that it had a recording promoting the movie.](https://moviechat.org/tt0105435/Sneakers/58c759896b51e905f67b51ef/Did-NSA-Agent-Mary-give-a-real-phone-number) It _certainly_ isn't one of the safe 555 numbers that movies generally use to keep people from calling.

Let's not _actually_ call it, then, OK?

```perl
my $number = ' 415 273 9164 ';
$number =~ /(\d{3})\D+(\d{3})\D+(\d{4})/;
say join '.', $1, $2, $3;
```

The bits with the parentheses are called [_Capture Groups_](https://perldoc.perl.org/perlre#Capture-groups), and that the first "There's a name for that?" bit of Perl I've learned in a while.

There are ... _problems_ with this. If I was _really_ matching phone numbers, I would probably use a limited number of non-digit characters to separate the numbers, or maybe use a more specific format, like **(415)273-9164** or **415.273.9164**.

The _other_ problems are that we don't know what things are by reading `$1` and `$2`, and the next time the code hits a regular expression, those variables are overwritten.

```perl
my $number = ' 415 273 9164 ';
my ( $area, $exchange, $subscriber ) = $number =~ m{
    (\d{3})    # area code
    \D*
    (\d{3})    # exchange
    \D*
    (\d{4})    # subscriber
}mx;
say join '-', $area, $exchange, $subscriber;
```

The wonder of `/mx` to allow us to comment our regular expressions, so our code doesn't seem _quite_ as unreadable, and we put the output into real variables. This is how I'd probably write it still. I mean, if it was just for me, I _might_ not comment my regular expressions, because I recognize how I write regular expressions, but still.

And then I learned about naming your capture groups.

```perl
$number =~ m{
    (?<area>\d{3})
    \D*
    (?<exchange>\d{3})
    \D*
    (?<subscriber>\d{4})
}mx;
say qq{ ($+{area}) $+{exchange}-$+{subscriber} };
```

So, Perl creates a hash named `%+` and puts the results into it. We have the same problem as with `$1` and all: next regex wipes your results. But that's certainly a way to keep track of what your variables mean, without (and likely before) you comment your regex and use the regex flags suggested by _Perl Best Practices_.

I feel like I _should_ go deeper, because regular expressions are _deep_, man, but there's a lot to regular expressions, and I might have to write a series. If you're new or inexperienced with regexes, maybe start with [perlre](https://metacpan.org/dist/perl/view/pod/perlre.pod) and go from there, knowing that there are lots of things you _shouldn't_ use.

I'll say that, if you ever see more than 1 `e` flag (especially more than 3), you're within _deep_ magic, and you shouldn't add to or change it unless you're attuned to it.

I'm not sure you should use Named Capture Groups either.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
