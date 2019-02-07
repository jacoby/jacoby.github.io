---
layout: post
title:  "Namespaces and Javascript: I Don't Know What I'm Doing"
author: "Dave Jacoby"
date:   "2019-02-07 13:33:58 -0500"
categories: js
---

Here's a simple JS library I wrote today:

```javascript
let rr = {};
rr.data = {};
rr.code = {};

rr.code.listen = function (event){
  console.log(this.responseText);
  location.reload();
}

rr.code.remove_request = function () {
  let id_span = document.getElementById("run_id");
  let run_id = id_span.getAttribute("data-run-id");
  console.log([run_id, Date.now()].join("-"))
  let request_id = prompt("Enter the request in Run #" + run_id + " that you want removed");
  if (!(request_id == null || request_id == "")) {
    let url = ["/cgi-bin/dev/dave/env.cgi", run_id, request_id].join("/");
    console.log(url);
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load",rr.code.listen);
    xhr.open("POST",url);
    xhr.send();
  }
}

// This is part of the *LIMIT TO TEST* aspect of this task.
// I will likely just make this set the onclick
rr.code.start = function () {
  let junk_drawer = document.getElementById("junk_drawer");
  let button = document.createElement('span');
  button.innerText = "Remove Request";
  button.id = "remove_request";
  button.onclick = rr.code.remove_request;
  button.classList.add("button");
  junk_drawer.appendChild(button);
}

window.onload = rr.code.start;
```

There are a few "conventional" choices -- choices made for convention. I put `window.onload` at the bottom, for example, because in some languages, you get problems if you use a function before you define it. In my language of choice, that matters not, but I am not 100% sure if it matters in JS.

In other places, I have used Bootstrap to make popups that only give the users actual, actionable choices, rather than having them fill a prompt and parsing it, but I figure I will have to parse it on the client end anyway, and this is the quick-and-easy UI choice.

I use `let` instead of `var` everywhere and all the time. I think that first `let rr` puts rr in the global scope, which doesn't particularly limit anything, but using it everywhere removes the doubt of "should I use it here?"

And then there's `let rr = {}`. Could as easily have been `let rr = new Object`, but that 's not the real point. I could have made all the functions `function sub () {...}` instead of `rr.code.sub = function () {...}`, but then we may hit issues.

We hit those issues because your libraries are not all that can be running on your page. I just created a web page that was just this --

```html
<!DOCTYPE html>
<html>
</html>
```

-- and Chrome Dev Tools show that `content.js` and `antiphishing.js` are running. This and whatever libraries you or your coworkers write or include, and you think you're the only one who would ever want to write `start()`?

However, I'm seeing things like `document.getElementsByTagNameNS()` and suspect there's a new, cool, somehow more appropriate but unfathomable to me. I cover all sorts of things, and I can have an all-tech staff meeting on my commute in the morning, so if any toes get stepped on with regard to namespaces, it'll be my shoes doing the stepping.

So, I'm curious: What is the best way to handle JS namespaces? How do you ensure that you don't break your users toys when throwing more code into a page?

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


