---
layout: post
title: "Stable Sort and Ways Around It"
author: "Dave Jacoby"
date: "2019-04-15 14:20:11 -0400"
categories: ""
---

There's a service called [Last.fm](https://www.last.fm/) which allows you to store what tracks you listen to. I have started to export that data from Last.fm into a local database, where I have all the songs I have _scrobbled_ (listened to and reported to their system) since Jan 1, 2008. Here we have the first four, sorted on `id`.

```json
[
  {
    "artist": "Planes Mistaken For Stars",
    "id": "++2oW+aGn4m9JoPRd5tgXMRuZY4",
    "plays": 1,
    "song": "Police Story / Wasted"
  },
  {
    "artist": "Chairlift",
    "id": "++9JAle7S9huuAw0bUPH2Nx15ds",
    "plays": 1,
    "song": "Crying in Public - Alternate Version"
  },
  {
    "artist": "Ali Farka Touré",
    "id": "++D58rizJf3r8hBYEsI9iChDM0k",
    "plays": 3,
    "song": "Erdi"
  },
  {
    "artist": "fIREHOSE",
    "id": "++ehP6ysoH1N0JHUJB0GhNAx7I4",
    "plays": 1,
    "song": "From One Cums One"
  }
]
```

But this isn't such a helpful sort, is it? I can imagine two preferable sorts: by number of plays and by artist/song. Perhaps artist/release year/song, but I don't currently have all that information.

Because rigged demo, I _know_ that I have listened to [Chris Thile](https://www.christhile.com/) songs 86 times. (Does not count Punch Brothers or Nickel Creek or duet projects.) And because of albums, I know I've heard seveal songs the same number of times.

```json
[
  {
    "artist": "Chris Thile",
    "id": "XgLBRBSQ4jKrrDn2GZ0C7W+rFbY",
    "plays": 1,
    "song": "Trail's End"
  },
  {
    "artist": "Chris Thile",
    "id": "xsoV1/NPsRcbiL47F6JNFLbpBPw",
    "plays": 1,
    "song": "Shadow Ridge"
  },
  {
    "artist": "Chris Thile",
    "id": "z8f9Kr1ZDO+NwweoYp474ebzBwU",
    "plays": 6,
    "song": "Wayside (Back in Time)"
  },
  {
    "artist": "Chris Thile",
    "id": "zvDn5OFuvO99CyfCeBizrlxeHuE",
    "plays": 6,
    "song": "I'm Yours If You Want Me"
  },
  {
    "artist": "Chris Thile",
    "id": "ZWvpfxcBiOKDaLCMCQ+2PyvICeU",
    "plays": 1,
    "song": "Ready for Anything"
  }
]
```

So, what we want is a list of his songs sorted first by number of plays and then alphabetically by song name.

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use feature qw{ postderef say signatures state switch };
no warnings qw{ experimental::postderef
    experimental::smartmatch
    experimental::signatures };

use JSON;
use List::Util qw{uniq};

my $json = JSON->new->pretty->canonical;
my $file = 'lastfm.json';
if ( -f $file && open my $fh, '<', $file ) {
    my $text = join '', <$fh>;
    close $fh;

    my $obj = $json->decode($text);
    my $bigger->@* =
        grep { $_->{plays} > 19 } $obj->@*;    # at least 10 plays per song

    my $thile->@* =
        grep { defined $_->{artist} && $_->{artist} eq 'Chris Thile' }
        $obj->@*;

    # reminder that you read this line back to front, so we are
    # sorting on song name first, than play count
    say join "\n", map { join "\t", $_->{plays}, $_->{song} }
        sort { $b->{plays} <=> $a->{plays} }
        sort { $a->{song} cmp $b->{song} }
        $thile->@*;
}

# 30	Heart in a Cage
# 6	Brakeman's Blues
# 6	How to Grow a Woman From the Ground
# 6	I'm Yours If You Want Me
# 6	Stay Away
# 6	Wayside (Back in Time)
# 5	Cazadero
# 5	If The Sea Was Whiskey
# 5	O Santo De Polvora
# 5	The Beekeeper
# 5	The Eleventh Reel
# 5	You're An Angel and I'm Gonna Cry
# 4	Dead Leaves and the Dirty Ground
# 3	Alderaanian Melody
# ...
# There are 86 songs in total, so we're cutting this down
```

Perl offers `stable sort`, where we can stack sorts like this, knowing that order gets preserved if not otherwise sorted.

So, what about JavaScript?

```javascript
#!/usr/bin/env node

const fs = require("fs");
var text = fs.readFileSync("lastfm.json", "utf8");
var obj = JSON.parse(text);

var thile = obj
  .filter(t => t.artist === "Chris Thile")
  .sort((a, b) => {
    if (a.song > b.song) {
      return 1;
    }
    if (a.song < b.song) {
      return -1;
    }
    return 0;
  })
  .sort((a, b) => b.plays - a.plays);

console.log(thile.map(t => [t.plays, t.song].join("\t")).join("\n"));

// 30	Heart in a Cage
// 6	Brakeman's Blues
// 6	I'm Yours If You Want Me
// 6	Wayside (Back in Time)
// 6	Stay Away
// 6	How to Grow a Woman From the Ground
// 5	You're An Angel and I'm Gonna Cry
// 5	O Santo De Polvora
// 5	If The Sea Was Whiskey
// 5	Cazadero
// 5	The Eleventh Reel
// 5	The Beekeeper
// 4	Dead Leaves and the Dirty Ground
// 3	Watch 'at Breakdown
// 3	Alderaanian Melody

// W before A? S before H?
```

We _did_ sort by song title before we sorted by plays. We can _see_ that. So, what happened?

> ["I wish JS offered stable sort but committee could not agree on it even in 1996, and you can stabilize at some cost above the API."](https://twitter.com/BrendanEich/status/1117853579971158026)
>
> -- [Brendan Eich (@BrendanEich)](https://twitter.com/BrendanEich/)

(I was discussing this with Gizmo and threw in an aside to Brendan, and he answered. We live in a world where we can ask "Hey, language creator? How come your language is like this?" and get an answer. How cool is that?)

So, the goal here here is to stabilize it myself, and I know how.

```javascript
#!/usr/bin/env node

const fs = require("fs");
var text = fs.readFileSync("lastfm.json", "utf8");
var obj = JSON.parse(text);

var thile = obj
  .filter(t => t.artist === "Chris Thile")
  .sort((a, b) => {
    /*
      the sort for plays comes first, but instead the short form
      we just handle the greater or less then cases, letting the 
      equals case drop through...  
     */
    if (a.plays < b.plays) { return 1; }
    if (a.plays > b.plays) { return -1; }
    /*
      ... to here, where we can do greater than and less than on
      strings. I don't GET or APPROVE of that, but I am given no
      other choice, and so we sort on song title.
     */
    if (a.song > b.song) { return 1; }
    if (a.song < b.song) { return -1; }
    /*
      And we return 0 if everything else is even.
     */
    return 0;
  });
console.log(thile.map(t => [t.plays, t.song].join("\t")).join("\n"));

// 30	Heart in a Cage
// 6	Brakeman's Blues
// 6	How to Grow a Woman From the Ground
// 6	I'm Yours If You Want Me
// 6	Stay Away
// 6	Wayside (Back in Time)
// 5	Cazadero
// 5	If The Sea Was Whiskey
// 5	O Santo De Polvora
// 5	The Beekeeper
// 5	The Eleventh Reel
// 5	You're An Angel and I'm Gonna Cry
// 4	Dead Leaves and the Dirty Ground
// 3	Alderaanian Melody
```

And there you go. Have I given the subtle clue that I'm a frustrated mandolin player?

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
