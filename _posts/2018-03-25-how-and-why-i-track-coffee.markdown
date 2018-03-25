---
layout: post
title:  "How and Why I Track Coffee"
author: "Dave Jacoby"
date:   "2018-03-25 17:24:05 -0400"
categories: quantified_self
---

You may have seen this on Twitter.

![Dave is tracking his coffee intake](/images/coffee-heatmap.jpg)

It shows my last few years as a coffee drinker. Every cup of coffee (human-counted, so I may be off here and there), tracked and graphed.

## How Am I Tracking Coffee

It started off a database. I was still teaching myself how to create tables and the like, and I created this:

```sql
CREATE TABLE `coffee_intake` (
  `id` varchar(255) NOT NULL,
  `userid` varchar(255) NOT NULL,
  `source` varchar(255) NOT NULL,
  `cups` int(10) NOT NULL,
  `datestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='DB table for storing my coffee intake'
```

This was the first I used UUIDs for DB keys instead of `AUTO_INCREMENT` on an `int`, so there was some work getting that together.

I started tweeting my daily consumption in July of 2013, but it took until September before I started including an image. Here I was mostly asserting control over the Twitter API, showing I could make it tweet my message.

I took the GitHub contribution calendar as my model and went with shades of brown instead of green because that's the color of coffee. I generally use R as a plotting tool more than a data analysis tool, and the consumption data comes out fully-formed and ready to plot.

I found that `ggplot2` put holes in the calendar where there is no data, so I created a table that's just the days since Jan 1, 2000 (chosen because Y2K), so I can do

```sql
SELECT *
FROM day_list d
LEFT JOIN coffee_intake c
ON d.datestamp = DATE(c.datestamp)
GROUP by d.datestamp
```

and get a zero instead of null whenever I didn't drink any coffee.

When systems I relied on were retired, I moved the data to others and rewrote (badly) some key sections in PHP. I have always used coffee tracking as an excuse to learn new technologies, and I am now considering putting it on AWS to force myself to learn Node, Serverless and DynamoDB. Or Node and Heroku. Or something else.

When I do this, I will certainly blog it.

## Why Am I Tracking Coffee

I believe we (humans, "the West", the United States, the developer community) have an ... *interesting* relationship with caffeine. We can argue that the Enlightenment and the Industrial Revolution came because the thinkers of the British Isles switched from the depressants in beer to the stimulants in tea. What is inarguable is that "Geek Culture" put the focus on overstimulating yourself and staying up late into the night, with Jolt Cola's slogan of "All the Sugar, Twice the Caffeine" and Thinkgeek's "Food & Caffeine" section with [caffienated soap](https://www.thinkgeek.com/product/5a65/). (It used to be a thing, I promise.) And while I was critical, saying "after a certain point, you should stop with the caffiene and just become a speed freak", I also participated.

I had decided to try to go "cold turkey" on caffeine for a month. I had read so many things about caffeine and decided to do an `n=1` experiment with it, to determine for myself what I thought about [the Greatest Addiction Ever](https://www.youtube.com/watch?v=OTVE5iPMKLg).

The first day of the month, I forgot and had a cappuccino. There was a social situation where I always had caffeine, and I did it again, remembering halfway that I had planned this month to be different.

The second day, I returned a rental car when our car got out of the shop, and on the way to drop off the vehicle, I got breakfast at McDonalds, including a large Diet Coke, because, at that time, I always ordered a large Diet Coke. This is the effect of habit. 

The third day, I was good. I remembered that I wasn't drinking caffeine, and I didn't. And it was okay.

The fourth day, I my head ached. I was nauseous. I turned off the light in my area and sat there, barely functioning. My co-worker looked over and said "If you have the flu, you should just go home."

This was where the withdrawal started to affect me. This was when I realized I had a problem, that I had to develop new habits. And when I realized that the "cold turkey" plan was a no-go, at least not yet. So, I developed rules. I would try to drink:

* two cups of coffee, max
* before noon
* on days when I'm programming or would otherwise benefit from performance-enhancing drugs

Soft drinks were right out. Tea was not counted. (The gap in 2016 was me going to just green tea for March.) But from the calendar heatmap, you can clearly determine when weekends are, as well as vacations.

I have been known to break those rules on occasion. Today, for example, is a Sunday where I had a cup of coffee and talked with friends about VPNs between 2 and 4pm. Three- and four-cup days are not unknown. But I try to keep them under control.

I don't know that this is the final form of my rules. I still get weekend headaches, but I haven't determined if other factors apply or if it's withdrawal. Perhaps I need to develop other rules to govern other behaviors and create other systems to create feedback and accountability for it.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).