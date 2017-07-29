---
layout: post
title:  "What\'s Your Spam Got To Do With Me?"
author: "Dave Jacoby"
date:   "2017-07-28 10:46:41 -0400"
categories: email 
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

The first hitch comes, of course, when the Turtle server tries to send to the RTBL server and the the RTBL server decides "hey, this looks like spam". RTBL server sends this message to the Turtle server, which is the opposite of Hotel California in that it is programmed to not receive. Then the morning comes and those who expect to see "this is what happened last night and what you need to do today" emails do not receive them.

Now, the Turtle admin and the creator of this system go back and forth with the manager and each other, trying and failing over and over to send to the RTBL server, sometimes pointing to commercial mail servers to ensure it wasn't the server or their code that was the problem.

This is the point where someone who might not actually have logged into the Turtle server for months because his or her work has no connection to it anymore goes in, sends a trouble ticket to the RTBL server team saying there's a problem.

Turtles become Turtles for many reasons, and that can be because past connections with other groups may have shown a deficit of professionalism and ability and responsiveness, leading to people saying things about them such as:

+ *Going out into the woods and screaming your frustration to the flora and fauna has a greater chance of receiving a positive outcome than submitting a trouble ticket*
+ *The organization will burn to the ground before I ever submit a ticket again*

So, now communcation channels have been opened between the two camps, and it reminded me a lot of [an old-school hip-hop track I used to like][1]:

**RTBL Admin:** "I got spam."

**Turtle Admin:** "What's your spam got to do with me?"

**RTBL Admin:** "I got spam."

**Turtle Admin:** "I'm not tryin' to hear that, see?"

**RTBL Admin:** "I got spam."

**Turtle Admin:** "What's your spam got to do with me?"

**RTBL Admin:** "I got spam."

**Turtle Admin:** "I'm not tryin' to hear that."

Except, of course, that's a track that I remember fondly, and the email communication is ... not. It has it's points, but a key thing to think of is that there's limits to what the RTBL team *can* do, even if they were inclined to.

As you might guess, I'm not entirely neutral on this, and the inciting incident is still unknown, at least to me. [Cathy O'Neil][2], author of [*Weapons of Math Destruction*][3] lists the key characteristics of a damaging system, the "WMD" of her title, as:

1. **Opacity**
2. **Damage**
3. **Scalable**

The system is built to scale and scale quickly, the reasoning behind the reputation change and subsequent block was opaque in both concept and specific events, and certainly blocking our reports and monopolizing the day of several people counts as damage. I don't see the Turtle technique as good, in theory or in practice, but there are issues with the RTBL system.

Email is broken and has increasingly been so since [Canter and Siegel in 1994][4]. (OK, that was UseNet, but still...) Teams and organizations are also broken. But it's what we have, so we have to find a way to make them work.

[1]: https://open.spotify.com/track/4iAYo83eWlktjw97oebIal
[2]: https://mathbabe.org/
[3]: https://www.amazon.com/Weapons-Math-Destruction-Increases-Inequality/dp/0553418815
[4]: https://en.wikipedia.org/wiki/Laurence_Canter_and_Martha_Siegel
