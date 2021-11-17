---
layout: post
title: '"I Will Replace You With A Small Shell Script"'
author: "Dave Jacoby"
date: "2021-11-16 18:20:41 -0500"
categories: ""
---

So, there used to be a shirt in Thinkgeek's catalog, saying

> [**Go Away Or I Will Replace You With A Small Shell Script**](https://duckduckgo.com/?q=%22replace+you+with+a+small+shell+script%22&va=b&t=hc&iax=images&ia=images)

At least, I _recall_ it being on Thinkgeek, but my initial poking in the [Internet Archive](https://web.archive.org/web/20040217121605/http://www.thinkgeek.com/) hasn't found it, and my desire to blog is greater than my patience to search.

That line has frustrated me for a while, because I recalled it, but I couldn't remember where from. I recalled it, or something close, being said by Zaphod to Arthur. And last night, I found it. (It's been decades since I've read it, so eh?)

It's toward the end of _Hitchhiker's Guide to the Galaxy_, where the Mice are explaining to Arthur that he's part of the great computer tasked with finding the Question to Life, The Universe and Everything, so the Question should be within him:

> "No, no", said Frankie, "it's the brain we want to buy."  
> "What!"  
> "Well, who would miss it?" inquired Benjy.  
> "I thought you said you could just read his brain electronically," protested Ford.  
> "Oh yes," said Frankie, "but we'd have to get it out first. It's got to be prepared."  
> "Treated," said Benjy.  
> "Diced."  
> "Thank you", shouted Arthur, tipping up his chair and backing away from the table in horror.  
> "It could always be replaced," said Benjy reasonably, "if you think it's important."  
> "Yes, an electronic brain," said Frankie, "a simple one would suffice."  
> "A simple one!" wailed Arthur.
> "Yeah," said Zaphod with a sudden evil grin, "you'd just have to program it to say **What?** and **I don't understand** and **Where's the tea?** Who'd know the difference?"

I mean, there's engaging or replacing balance and motor functions, but sure.

### Isn't this a CODING Blog?

Yes it is, and while I'm thinking about `small shell script`, it made me think about bash:

```bash
#!/usr/bin/env bash
r=$(( RANDOM % 3 ))
case $r in
    0) utterance="What?";;
    1) utterance="I don't understand";;
    2) utterance="Where's the tea?";;
esac
echo $utterance
```

Small? It fits in a [_tweet!_](https://twitter.com/JacobyDave/status/1460733662496964611)

Here, because (as far as I can recall), there's not a strong concept of _arrays_ and _lists_ in bash, so it's easier to make a _case_ statement. This is something you generally don't see in more modern languages.

I went immediately to Perl, my go-to language, and there, since I can make an array, find the size of an array, and make a random number based on that size, I can do it fairly compactly.

```perl
#!/usr/bin/env perl
use strict;
use warnings;
use experimental qw{ say signatures state };
my @lines = ( "What?", "I don't understand.", "Where's the tea?", );
say pick_one(@lines);
sub pick_one ( @array ) { return $array[ int rand scalar @array ] }
```

And with a few searches, I figured out how to replicate it in Python:

```python
#!/usr/bin/env python
import random
lines = [ "What?","I don't understand.","Where's the tea?" ]
line = random.choice(lines)
print (line)
```

And with Ruby:

```ruby
#!/usr/bin/env ruby

lines = Array[];
lines.push("What?");
lines.push("I don't understand.");
lines.push("Where's the tea?");
puts lines[rand(lines.count)];
```

And with Node:

```javascript
#!/usr/bin/env node
"use strict";
let lines = [];
lines.push("What?");
lines.push("I don't understand.");
lines.push("Where's the tea?");
let line = lines[Math.floor(Math.random() * lines.length)];
console.log(line);
```

And, for reasons, C#:

```csharp
var random = new Random();
string[] lines = new string[3];
lines[0] = "What?";
lines[1] = "I don't understand.";
lines[2] = "Where's the tea?";
var r = random.Next(lines.Length);
Console.WriteLine(lines[r]);
```

I think the biggest difference is how you call for a random number. This contributes to my feeling that most programming languages are just domain-specific dialects of English. And _that_ is why I think _must know **$language**_ in job requirements is problematic.

Anyway, here's Arthur Dent's health extending to the fifth book of a trilogy, and to not knowing the Question.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
