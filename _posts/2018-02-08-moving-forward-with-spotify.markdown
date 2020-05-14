---
layout: post
title:  "Moving Forward With Spotify"
author: "Dave Jacoby"
date:   "2018-02-08 17:45:41 -0500"
categories: perl,spotify,music
---

[I have blogged about trying to combine my love of music and programming before.](https://jacoby.github.io/r/2018/01/29/r-makes-hulk-want-to-smash.html)

Today, I have better results.

Not perfect, but *better*.

I have a query that gives me exactly what I want.

```sql
SELECT  t.artist    artist 
    ,   t.song      song 
    ,   t.album     album 
    ,   COUNT(p.play) plays

FROM last_fm_plays p 

LEFT JOIN last_fm_tracks t 
ON p.id = t.id

GROUP BY p.id
ORDER BY COUNT(p.play)
DESC 
LIMIT 10
```

You will have to trust that my tables are sound and this works, because it gives me this:

```
artist	song	album	plays
Happy Mondays	Wrote For Luck	Double Double Good: The Best of The Happy Mondays	200
Happy Mondays	Step On	Double Double Good: The Best of The Happy Mondays	200
Pharrell Williams	Happy	Despicable Me 2 (Original Motion Picture Soundtrack)	126
Pantera	Walk	Vulgar Display of Power	101
Radiohead	Optimistic	Kid A	94
Mark Ronson	Uptown Funk	Uptown Special	91
Kings Of Groove feat. Michelle Weeks	You Have a Purpose - Original Mix	Auténtico Baleárica (Blank & Jones present)	89
Daft Punk	Harder Better Faster Stronger	Harder Better Faster Stronger	89
Neu!	Hallogallo	Neu!	89
Jonathan Coulton	I Feel Fantastic	JoCo Looks Back	85
```
(I could go longer, but why?)

So, I can assert that I listen to Groove Metal, Acid House and Krautrock a lot. I listen to a lot of Happy Mondays because I want to assert that I'm not Garfield, hating Mondays and being a grump. The top tracks on this list were part of my Monday Morning Motivation Mix. 

(Except "Hallogallo". For that, there was just a day where it got me into Flow State. It works.)

What I can't do is put it all into a playlist and let y'all know what kind of rocker I am.

Big problem I see is that many Perl modules are written with an OAuth 1.0 state of mind, while the cool kids are all on OAuth 2.0. I tried to get it going with [`WebService::Spotify`](https://metacpan.org/pod/WebService::Spotify), but I saw no mechanism to handle tokens.

So, I went back to other OAuth-related code I wrote and modified it. I can do that.

```perl
package Spotify ;
use strict ;
use warnings ;
use feature qw{ postderef say signatures state } ;
no warnings qw{ experimental::postderef experimental::signatures } ;

use Carp ;
use JSON::XS ;
use LWP::UserAgent ;
use LWP::Protocol::https ;
use Mojo::UserAgent ;

our $VERSION = '0.0.1' ;

sub new ( $class, $token ) {
    croak 'No Token' unless defined $token ;
    my $self = {} ;
    bless $self, $class ;
    $self->{ token } = $token ;
    $self->{ json }  = JSON::XS->new->pretty->canonical ;
    $self->{ ua }    = Mojo::UserAgent->new ;
    $self->{ host }  = 'https://api.spotify.com' ;
    return $self ;
    }

sub add_to_playlist ( $self, $user_id, $playlist, $uris, $position = 0 ) {
    my $url = join '/', $self->{ host }, 'v1', 'users', $user_id, 'playlists', $playlist, 'tracks' ;
    my @querystring ;
    push @querystring, qq{uris=$uris} ;
    push @querystring, qq{position=$position} if $position > 0 ;
    $url = $url . '?' . ( join '&', @querystring ) ;
    my $res = $self->{ ua }->post(
        $url,
        {
            'Authorization' => "Bearer $self->{token}",
            'Accept-Type'   => 'application/json',
            'Content-Type'  => 'application/json',
            }
        )->result ;
    say $res->{ code } ; # You will notice this in the output
    if ( $res->is_success ) {
        my $obj = $self->{ json }->decode( $res->body ) ;
        return $obj ;
        }
    elsif ( $res->is_error ) { croak $res->message }
    else                     { croak $res->message }
    return 1 ;
    }

sub search_track ( $self, $q, $limit = 0, $offset = 0, $market = 'US' ) {
    my @response ;
    $q =~ s/\W/%20/g ;
    my $type = "track" ;
    my $url = join '/', $self->{ host }, 'v1', 'search' ;
    my @querystring ;
    push @querystring, qq{q=$q} ;
    push @querystring, qq{type=$type} ;
    push @querystring, qq{market=$market} ;
    push @querystring, qq{limit=$limit} if $limit > 0 ;
    push @querystring, qq{offset=$offset} if $offset > 0 ;
    $url = $url . '?' . ( join '&', @querystring ) ;
    my $res = $self->{ ua }->get(
        $url => {
            'Authorization' => "Bearer $self->{token}",
            'Accept-Type'   => 'application/json',
            'Content-Type'  => 'application/json',
            }
            )->result ;

    if ( $res->is_success ) {
        my $obj = $self->{ json }->decode( $res->body ) ;
        @response = $obj->{ tracks }{ items }->@* ;
        return wantarray ? @response : \@response ;
        }
    elsif ( $res->is_error ) { croak $res->message }
    else                     { croak $res->message }
    return wantarray ? @response : \@response ;
    }

1 ;

```

This is minimal. There is a fair amount here that I want to rethink and clarify and write tests for and all that. I'll hat-tip [Mojolicious](https://mojolicious.io/), because with `Mojo::UserAgent`, I didn't have to make `GET` and `POST` functions separately, I can just include a `Mojo` object in my Spotify object. And no, I am not 100% sure I'm doing this right.

On to the program code:

```perl
#!/usr/bin/env perl

use strict ;
use warnings ;
use utf8 ;
use feature qw{ postderef say signatures state } ;
no warnings qw{ experimental::postderef experimental::signatures } ;

use JSON ;
use Mojo ;

use lib '/home/jacoby/lib' ;
use oDB ;
use Spotify ;

my $json    = JSON->new->pretty->canonical ;
my $user    = 'jacobydave' ;
my $token   = 'YOU DO NOT GET MY TOKENS, BUT THE ONES I HAVE TIME OUT TOO QUICKLY' ;
my $spotify = Spotify->new( $token ) ;

my $db       = oDB->new( 'oz' ) ;
my $q        = <<'SQL' ;
        SELECT  t.artist    artist 
            ,   t.song      song 
            ,   t.album     album 
            ,   COUNT(p.play) plays

        FROM last_fm_plays p 

        LEFT JOIN last_fm_tracks t 
        ON p.id = t.id

        GROUP BY p.id
        ORDER BY COUNT(p.play)
        DESC 
        LIMIT 100
SQL
my $r = $db->arrayref( $q, { controls => {} } ) ;

# Normally, I'd avoid hard-coding this, but it's part of the playlist
# link below
my $playlist = '68jq4AvcZg2Rrkwbm5mvNF' ;
for my $s ( $r->@* ) {

    # this formatting mess is to try to get things like 
    # "You Have A Purpose - Original Mix" by Kings of Groove featuring Michelle Weeks 
    # found by my code. Fails so far - track is
    #   https://open.spotify.com/track/7aLFq7oGcPZCnVziW22vRn 

    my $song = $s->{ song } ;
    ( $song ) = split m{-}, $song ;
    my $artist = $s->{ artist } ;
    ( $artist ) = split m{feat}, $artist ;
    my $q = join ' ', $song, $artist ;

    my @tracks = $spotify->search_track( $q, 50 ) ;
    my $c      = 1 ; # counter; how many search resuld did we go through?
    my $f      = 1 ; # flag; if flag is down, that's the one we play
    my $d      = 0 ; # done; if not done, I will have to add it by hand
    for my $t ( @tracks ) {
        next unless $f == 1 ;
        # lower-case because "Vulgar Display Of Power" is not "Vulgar Display of Power"
        $f = 0 if lc $t->{ album }{ name } eq lc $s->{ album } ;
        next unless $f == 0 ;
        my $track_uri = $t->{ uri } ;
        say join "\t", '+', $c, $f, $user, $playlist, $track_uri ;
        my $r = $spotify->add_to_playlist( $user, $playlist, $track_uri ) ;
        $d = 1 ;
        }
    say qq{ BY HAND: $q } if $d == 0 ;
    sleep 3 ;
    }
```

I may have to explain the `oz` thing eventually.

So we get this:

```
...
	artist	Kings Of Groove feat. Michelle Weeks
	song	You Have a Purpose - Original Mix
	album	Auténtico Baleárica (Blank & Jones present)
 BY HAND: You Have a Purpose  Kings Of Groove  
	artist	Daft Punk
	song	Harder Better Faster Stronger
	album	Harder Better Faster Stronger
+	1	0	jacobydave	68jq4AvcZg2Rrkwbm5mvNF	spotify:track:2cJz1loJp5EZM6shmQpLZN
201
	artist	Neu!
	song	Hallogallo
	album	Neu!
+	1	0	jacobydave	68jq4AvcZg2Rrkwbm5mvNF	spotify:track:1GkZZHT9uJjdzrrksrpczR
201
	artist	Jonathan Coulton
	song	I Feel Fantastic
	album	JoCo Looks Back
+	1	0	jacobydave	68jq4AvcZg2Rrkwbm5mvNF	spotify:track:0iq3MFEbuKTWJgdhwdOwXI
201
...
	artist	Steel Pulse
	song	Chant A Psalm
	album	True Democracy (US Release)
 BY HAND: Chant A Psalm Steel Pulse 
	artist	Arctic Monkeys
	song	I Bet You Look Good on the Dancefloor
	album	Whatever People Say I Am That's What I'm Not
 BY HAND: I Bet You Look Good on the Dancefloor Arctic Monkeys 
	artist	U2
	song	Beautiful Day
	album	All That You Can't Leave Behind
+	1	0	jacobydave	68jq4AvcZg2Rrkwbm5mvNF	spotify:track:1VuBmEauSZywQVtqbxNqka
201
	artist	The Shamen
	song	Move Any Mountain (Beat Edit)
	album	Collection
+	1	0	jacobydave	68jq4AvcZg2Rrkwbm5mvNF	spotify:track:6l26mQLF7A4lu9djfIez7O
201
	artist	Ned's Atomic Dustbin
	song	Grey Cell Green
	album	God Fodder
 BY HAND: Grey Cell Green Ned's Atomic Dustbin 
	artist	Dinosaur Jr.
	song	Thumb
	album	Green Mind [Digital Version] [with Bonus Tracks]
 BY HAND: Thumb Dinosaur Jr. 
	artist	Pegboy
	song	Strong Reaction
	album	Strong Reaction
+	1	0	jacobydave	68jq4AvcZg2Rrkwbm5mvNF	spotify:track:1HZXGK0yyl1ygZn0wsdVoL
201
	artist	Happy Mondays
	song	24 Hour Party People
	album	Double Double Good: The Best of The Happy Mondays
+	1	0	jacobydave	68jq4AvcZg2Rrkwbm5mvNF	spotify:track:6g4MtYaLFIyTQmOIiMY2oV
201
	artist	U2
	song	Beautiful Day
	album	All That You Can't Leave Behind (Non EU Version)
 BY HAND: Beautiful Day U2 
	artist	The Beach Boys
	song	Good Vibrations
	album	Smiley Smile (2001 - Remaster)
+	1	0	jacobydave	68jq4AvcZg2Rrkwbm5mvNF	spotify:track:5t9KYe0Fhd5cW6UYT4qP8f
201
	artist	Rubblebucket
	song	If U C My Enemies
	album	If U C My Enemies
+	1	0	jacobydave	68jq4AvcZg2Rrkwbm5mvNF	spotify:track:0NyzJxVxHhu2mDgdNv1ZP2
201
...
	artist	Arctic Monkeys
	song	Perhaps Vampires Is a Bit Strong But…
	album	Whatever People Say I Am That's What I'm Not
 BY HAND: Perhaps Vampires Is a Bit Strong But… Arctic Monkeys 
	artist	Orbital
	song	Halcyon [Tom Middleton Re-Model]
	album	Orbital 20
+	1	0	jacobydave	68jq4AvcZg2Rrkwbm5mvNF	spotify:track:64GYkWWxjK38M2l0pSdfx1
201
	artist	Dinosaur Jr.
	song	The Wagon
	album	Green Mind [Digital Version] [with Bonus Tracks]
 BY HAND: The Wagon Dinosaur Jr. 
	artist	Dinosaur Jr.
	song	Green Mind
	album	Green Mind [Digital Version] [with Bonus Tracks]
 BY HAND: Green Mind Dinosaur Jr. 
	artist	Rob Base & DJ EZ Rock
	song	It Takes Two
	album	Profilin': The Hits
+	1	0	jacobydave	68jq4AvcZg2Rrkwbm5mvNF	spotify:track:3Yxmpx64AdWAzG3qAD4Dty
201
	artist	Dinosaur Jr.
	song	Flying Cloud
	album	Green Mind [Digital Version] [with Bonus Tracks]
 BY HAND: Flying Cloud Dinosaur Jr. 
	artist	Dinosaur Jr.
	song	I Live For That Look
	album	Green Mind [Digital Version] [with Bonus Tracks]
 BY HAND: I Live For That Look Dinosaur Jr. 
	artist	Dinosaur Jr.
	song	How'd You Pin That One On Me
	album	Green Mind [Digital Version] [with Bonus Tracks]
 BY HAND: How'd You Pin That One On Me Dinosaur Jr. 
...
```

Clearly, what I have doesn't like Dinosaur Jr., probably because of
`[Digital Version] [with Bonus Tracks]`. I treat *Green Mind* as just one very long song, and always have. Similar problem with U2's "Beautiful Day" and Santa Esmeralda's "Don't Let Me Be Misunderstood". I cannot explain the Ned's Atomic Dustbin tracks, or the Atomic Monkeys. I think that I'm doing the wrong thing with HTML character escaping.

And I am grabbing the token from the Spotify beta developer's console, and they time out. I need to figure out how to get long-term tokens.

Anyway, I have a 3/4 success rate, a little bit of closure, and a groovy playlist for your listening pleasure. If you are also a Spotify user, make your *Discover Weekly* playlist public and send me a link: I'm always wanting do diversify my listening.

[Top 100 For 2017](https://open.spotify.com/user/jacobydave/playlist/68jq4AvcZg2Rrkwbm5mvNF)

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).

