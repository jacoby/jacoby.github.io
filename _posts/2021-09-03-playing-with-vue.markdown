---
layout: post
title: "Playing with Vue"
author: "Dave Jacoby"
date: "2021-09-03 13:04:44 -0400"
categories: ""
---

### TL;DR

Vue.js is a framework that it's easy to get working with out of the box.

### Start Here

I've watched JS framework demonstrations many times, unable to understand what this is doing that makes it better than the helper-libs-and-decreasing-amounts-of-jQuery I usually use. Usually, the infrastructure and requirements would require a roots-up redesign, and the weeks of adjusting to the new environment would hinder the solving of problems already on my list.

But I got up yesterday and decided I'll play with one, getting myself more familiar with one.

I chose [Vue.js](https://vuejs.org/). I clicked on the "Why Vue.JS?" button. At about 2 minutes and 30 seconds in, I became familiar with `fetch( json_url )`, which suddenly changed my mind and made me open an editor.

### Toy Code

Most of the time, when I want to try out a new thing, I do so with toy code, solving my insiginificant side problems rather than trying to work it into something that anyone else would care about. That way, there are few existing things I have to worry about, so I can make things that help me decide if that tech will work for me.

I play a phone game. One that not only has a component of fighting other being and being engaging that way, but mechanisms to customize and improve the hundreds of characters in your roster. I had already created a program that tracks the current status of my roster, compares it with the tier list of a celebrity player, which help me know which character I should perfect next.

I overthink my hobbies. I know this.

So, I have a JSON file with all these details.

I also have a page that parses the JSON and displays a page. And I have never liked it. There's a timing issue where the page won't grab and display the munged output of the JSON.

So that was a perfect place to start.

```javascript
const app = new Vue({
  el: "#app",
  data: {
    data: {},
    characters: ["NONE"],
    mods: ["NONE"],
  },
  created() {
    fetch("https://my/existing/static.json")
      .then((response) => response.json())
      .then((json) => {
        this.data = json.data;
        this.characters = json.characters;
        this.mods = json.mods;
      });
  },
});
```

This isn't exactly what the "Why Vue?" video showed, but it's very close, and it solved my problem.

For the rest of the page, it's akin to [Handlebars](https://handlebarsjs.com/), where, for the most part, you add `{{ variable }}` and it adds it in.

My problem is that I'm _so_ used to template engines not giving a rip about what what's going to be put into them, so constructions like `<div class="{{ character.class }}">{{ character.name }}</div>` would work exactly as I expect, and in Vue, it doesn't. I mean, until I rewrite to re-`fetch` the JSON, then everything is practically static, but Vue doesn't know that.

It turns out that the trick is to use `:class`, as in `<div :class="{{ character.class }}">{{ character.name }}</div>`. In context:

```html
<table>
  <tbody id="tbody">
    <tr
      class="character"
      v-for="character in characters"
      :class="character.class"
    >
      <td class="name">{{ character.name }}</td>
    </tr>
  </tbody>
</table>
```

`v-for` turns the `<tr>` into a for loop. `:class` allows me to style every table row according to the character's class, and ``{{ character.name }}` displays what I want.

### Summation

There's more. There is always more. I'm barely into my second day of playing with Vue. My next step is to make it work with [jQuery TableSorter](https://mottie.github.io/tablesorter/docs/), my existing go-to for changing the order of table rows. I also have quarter-formed plans for [Hammer.js](https://hammerjs.github.io/), but I'm entirely unsure what that'll be.

But in an afternoon, I went from "I should try Vue.js" to something that worked better than the [Vanilla.JS](http://vanilla-js.com/) solution I had sitting around. That's really good!

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
