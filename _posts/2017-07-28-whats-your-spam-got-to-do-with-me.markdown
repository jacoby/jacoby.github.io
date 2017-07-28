---
layout: post
title:  "What\'s Your Spam Got To Do With Me?"
author: "Dave Jacoby"
date:   "2017-07-28 10:46:41 -0400"
categories: interdepartmental-politics 
---
Everybody hates spam.

OK, there are a small number of people who make their living out of duping people with stories about Nigerian oil princes and such, but beyond that, everybody hates spam. 

And there are a few ways to deal with it. The first I'll talk about is the approach taken by a great number of mail admins, which is to keep track of which hosts are blasting them with great amounts of spam and tell each other, which built up over time to the **Realtime Blacklist (RTBL)**, where, as soon as they start seeing a site spit spam, it gets on the list and everyone subscribing from them block it.

At first, this was thrown together by the admins themselves, but now there are networks and providers in this field. Cisco, for example, has the IronPort mail filter and Talos backend to judge mail servers and shut them down if they don't behave. This way, if a server behaves badly to someone else, it gets told to knock it off and is blocked without you as admin having to do anything about it. However, if a machine falsely gets judged as spammy, you as admin have little ability to do anything about it.

Another way to deal with it is to, well, not deal with it. Block all incoming mail and log your outgoing mail and just stay out of the process. I'll call this the **Turtle** strategy. 

I'll stop here a moment to talk about "what *is* spam?", because it's a bit of a variable thing. The first spam was email from lawyers offering help getting green cards, so a category to watch is *commercial* email, but if you sign up for the weekly mailing from your supermarket, that's okay. 

Another aspect is it being *unwanted*, which is why there law says there must be an "unsubscribe" link in the message. It is often seen as just a sign to the spammer that there's a live user at that email address, so many just dump or ignore that mail, and, let's be honest, that weekly mailing from the supermarket is often ignored, too.

Another aspect that indicates spam is that it's *repeated*, both to you and to others, and by using machine learning techniques, it can see lots of batched mail with many of the same keywords and learn that this makes spam. Which sucks if, for example, your organization does scientific research and sends the results out in batches when done. 

Which can be the start.

I'm told the notification is part of it, so if you're a responsible admin with misunderstood mail, you're sent a 'your reputation is shot; clean up your act' email. If you're a Turtle, your warning shots are blocked along with everything else, and suddenly everything fails.

The first hitch comes, of course, when the Turtle server tries to send to the RTBL server and the the RTBL server decides "hey, this looks like spam". RTBL server sends this message to the Turtle server, which is the opposite of Hotel California in that it is programmed to not receive. Then the morning comes and 




Now, if there was previously bad relations between the factions, this can get 

**RTBL Admin:** "I got spam."

**Turtle Admin:** "What's your spam got to do with me?"

**RTBL Admin:** "I got spam."

**Turtle Admin:** "I'm not tryin' to hear that, see?"

**RTBL Admin:** "I got spam."

**Turtle Admin:** "What's your spam got to do with me?"

**RTBL Admin:** "I got spam."

**Turtle Admin:** "I'm not tryin' to hear that."



[1]: https://open.spotify.com/track/4iAYo83eWlktjw97oebIal

