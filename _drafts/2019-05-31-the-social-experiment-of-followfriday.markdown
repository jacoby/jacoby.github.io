---
layout: post
title:  "The Social Experiment of #FollowFriday"
author: "Dave Jacoby"
date:   "2019-05-31 13:44:18 -0400"
categories: ""
---

One of the brighter parts of my week occurs Friday morning, following an automated tweet. It isn't that tweet that's the bright part; it's the response.

When it started, I was starting to play with the Twitter API, mostly for sending tweets, but eventually I wanted to be able to look up what I had tweeted earlier, and I wanted excuses to expand my knowledge of SQL. So, I wrote something that'll collect all my tweets and stick 'em in a database. It's tables that would be offensive to our Codd, sure, but they're there.

Eventually, I started wanting to be able to bookmark tweets, because someone would say something about some topic or other, or link to a blogpost explaining how do do something, and I would want to get back to it later. And, eventually, I realized I had the tools to do exactly that, and I overloaded meaning for the "like" button to add "I want to be able to look this up later" to "I want the user to know I read and appreciated something".

At this moment, I have 89,137 stored favorites, and I've built and abandoned several tools to allow me to look up, for example, all the times I liked Brendan Eich talking about Javascript. (12)

And I started thinking about [`#FollowFriday`](https://twitter.com/hashtag/followfriday?lang=en), where you pick out accounts that you like and think others should look into. I decided that it'd be hard to do it repeatedly, without favoritism or boredom. But, I thought, I should have the numbers. How about `SELECT COUNT(*) c , username u FROM twitter_favorites WHERE DATEDIFF( NOW() , created ) < 8 GROUP BY u ORDER BY c`, and just cutting it off before 140 characters? That'd be easy.

![My first automated #FF](https://jacoby.github.io/images/first_ff.png)

It didn't take off immediately.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


