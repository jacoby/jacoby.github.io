---
layout: post
title: "The Social Experiment of #FollowFriday"
author: "Dave Jacoby"
date: "2019-07-05 17:25:15 -0400"
categories: ""
---

One of the brighter parts of my week occurs Friday morning, following an automated tweet. It isn't that tweet that's the bright part; it's the response.

When it started, I was starting to play with the Twitter API, mostly for sending tweets, but eventually I wanted to be able to look up what I had tweeted earlier, and I wanted excuses to expand my knowledge of SQL. So, I wrote something that'll collect all my tweets and stick 'em in a database. It's tables that would be offensive to our Codd, sure, but they're there.

Eventually, I started wanting to be able to bookmark tweets, because someone would say something about some topic or other, or link to a blogpost explaining how do do something, and I would want to get back to it later. And, eventually, I realized I had the tools to do exactly that, and I overloaded meaning for the "like" button to add "I want to be able to look this up later" to "I want the user to know I read and appreciated something".

At this moment, I have 89,137 stored favorites, and I've built and abandoned several tools to allow me to look up, for example, all the times I liked [Brendan Eich](https://twitter.com/BrendanEich) talking about Javascript. (Which is 12.)

And I started thinking about [`#FollowFriday`](https://twitter.com/hashtag/followfriday?lang=en), where you pick out accounts that you like and think others should look into. I decided that it'd be hard to do it repeatedly, without favoritism or boredom. But, I thought, I should have the numbers. How about `SELECT COUNT(*) c , username u FROM twitter_favorites WHERE DATEDIFF( NOW() , created ) < 8 GROUP BY u ORDER BY c`, and just cutting it off before 140 characters? That'd be easy.

![My first automated #FF](https://jacoby.github.io/images/first_ff.png)

It didn't take off immediately. But eventually it id.

It became a challenge among friends -- mostly but not exclusively those who I knew personally before Twitter -- to get a top position on my `#ff` email.

And now, starting 8am Eastern, a heavily GIFy stream of tweets gloating about their position or complaining about their demotion occur. It isn't for everyone, but _I_ think it's terribly funny.

It is entirely _my_ likes, stored in _my_ database, so _I_ choose who are my top, but I don't. I don't intentionally think I want my friend Patrick to make the top. This means there are times when someone I don't otherwise know show up high on my list.

- [Vernon Reid of Living Color](https://twitter.com/vurnt22) planning to make _Purple Rain_ a regular go-to-theater event like _Rocky Horror Picture Show_ was

- [Emily Shae](https://twitter.com/yomilly) talking about using voice to program when struck hard with RSI

- [Ali Spittel](https://twitter.com/ASpittel) on her enthusiasm with teaching programming and starting at [Dev.to](https://dev.to/)

- [Sarah Jeong](https://twitter.com/sarahjeong) on many occasions, but probably top for attending and live-tweeting Oracle vs Google

- [VM (Vicky) Brasseur](https://twitter.com/vmbrasseur) for giving a fantastic keynote to The Perl Conference last year and has consistently great things to say about being working with and for Open Source software

My interests are wildly diverse, and therefore there's changes week-to-week, but mostly it's a number of people who I know and like. My friends.

I don't _think_ I have the source code online, but it is, I promise you, about the easiest think you could think of writing to do these tasks. The cool part is that other people participate as well.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
