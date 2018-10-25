---
layout: post
title: "Javascript and JSON.stringify: It Almost Comes Correct"
author: "Dave Jacoby"
date: "2018-10-25 10:22:33 -0400"
categories: "javascript"
---

JavaScript has [JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON), a built-in that allows you do good and wonderful things with objects.

Assume we create an object:

```javascript
let obj = {};
obj.a = 1;
obj.b = ["foo", "bar"];
console.log(JSON.stringify(obj));
```

And we get

```json
{ "a": 1, "b": ["foo", "bar"] }
```

That's tight, but we _might_ want to expand it out for readability. So, we go to `JSON.stringify(obj,null,2)`.

```json
{
  "a": 1,
  "b": ["foo", "bar"]
}
```

And `JSON.parse` would take that text back into an object form. Win-win! I love it!

But ... why is that `null` up in there?

Because that's the [Replacer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

```javascript
> console.log(JSON.stringify(obj,['b'],2));
{
  "b": [
    "foo",
    "bar"
  ]
}
```

Man, that's simple. Just put in an array basically saying "cut things down to just this.

Gotta say, I kinda love it.

Consider every war movie you've heard. When captured, you give the opponent name, rank and serial number, so with `JSON.stringify(prisoners,["name","rank","serial_number"])`

You get a version of the array that looks like

```json
[{"name":"James Buchanan Barnes","rank":"Sergeant","serial_number":"999-99-9999"},...]
```

With all the mess like birthplace or activation codes messing up your pretty data structure. I could really see my server-side Node code doing this with the data sent to the client.

Except, I don't have any of that. All my back-end stuff is Perl. When I'm creating objects to send back to the server, I control what I stick into it, so I don't need that last catch.

The problem is something I consider a big anti-pattern, **Positional Parameters**. stringify, as written, brings in `(value,replacer,space)`, where **value** is the thing to be stringified, **replacer** limits what will be placed and **space** tells us how it will indented. And, by convention, you _must_ have value (you _don't_, but without it, it's kinda a no-op), but you _can_ add a replacer without a space, but you _cannot_ add a space without a replacer, even if the replacer is `null`.

The other option is **Named Parameters**, where we might start with `stringify(obj)` or `stringify(value:obj)`, to lean more on JS formatting, which might allow us `stringify(value:obj,space:2)` so we need no replacer if we don't want it.

As a 

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
