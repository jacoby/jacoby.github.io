---
layout: post
title: "Another View: Binding Myself to Vue.js"
author: "Dave Jacoby"
date: "2021-11-02 17:00:14 -0400"
categories: ""
---

I've been slowly been learning [Vue.js](https://vuejs.org/), relating to toy projects. Nothing earthshattering, but helpful in my other hobbies.

In this case, the hobby is **[Cyberpunk 2020](https://rtalsoriangames.com/cyberpunk/)**, an RPG and source for the video game **Cyberpunk 2077**. In those rules, there are skills, and you have 40 points for _Career_ skills and between 2 and 20 points for _Pickup_ skills. The thing is, not all skills are the same: there's a difficulty modifier, saying that, for example, learning Tae Kwon Do is exactly four times as hard as learning Danish. : `¯_ (ツ)_/¯`

I created a JSON file with all the by-the-book skills and values (handwaving **Expert**, which would allow your character to know everything about, for example, Baseball stats. Works as a roll-playing hook, I suppose.) I got to where I could display the whole list in formatted HTML with Vue, with a SELECT box with a blank and numbers between 1 and 7. At 8 and above, you're getting into world-class at what you do. If a pilot, you're _Maverick_. IF a fighter, you're _Bruce Lee_. If a fixer, you're _Tony Montana_, halfway through the movie. If you're media, you're _Edison Carter_, or maybe _Max Headroom_. It is suggested to GMs that you don't let your players start out as _the best at what they do_ when as new characters, they have zero rep.

The problem is that counting those would be the straight skill value, while `skill points used = skill value * difficulty modifier`, and doing that in my head with a large number of skills, and I don't want to use the scratch paper. _This_ is why I wanted to make the skill tool.

The examples I'm seeing set it up so that you can change a form value and see it show up on the page.

```html
<!-- Handling User Input- https://vuejs.org/v2/guide/ -->

<div id="app-6">
  <p>{{ message }}</p>
  <input v-model="message" />
</div>
```

What I wanted was to take all those anonymous, generated selects, sum the values, and put that value somewhere convenient, so I can always tell that I've used so many skill points without having to do that multiplication in my head. The problem with the above code is that it's anonymous, making it hard to interact with directly.

In this case, I eventually learned that you can make an element and give it an `@click` attribute, where you name a `method` for it to do. Eventually, I learned you can also add `@change`, which makes it _very_ useful with my SELECTs.

`@click` can be placed on a button — and in HTML, what _can't_ be a button? — to make it run that method. `@change` sets it to the element's `onchange` event handler. If we're talking most elements, they don't change often, but for SELECTs? _Exactly_ what I need.

I admit, for this next step, I went with my fairly old and vanilla JS, rather than learn the hot new Vue way of thinking through this. I'm learning things one at a time, not all at once, OK?

Here's an abbreviated skill list in JSON. I feel I should explain that, with Cyberpunk, there's style as well as substance. You shouldn't just _be_ good, but you should _look_ good doing it. Thus there is an Attractiveness 

```json
{
  "skills": {
    "attr": [
      {
        "name": "Personal Grooming",
        "value": 1
      },
      {
        "name": "Wardrobe & Style",
        "value": 1
      }
    ]
  }
}
```

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Cyberpunk 2020 Skills</title>
  </head>

  <body>
    <div id="app">
      <div id="skills">
        <div>
          <h3>TOTAL</h3>
          <dl>
            <dt><b>Count of all Career and Pickup points:</b></dt>
            <dd id="totalCount">0</dd>
          </dl>
        </div>
        <div v-for="(value1,name1) in all">
          <h3>{{ name1.toUpperCase() }}</h3>
          <dl v-for="(value2,name2) in value1">
            <dt>
              <b>{{ value2.name }} ({{ value2.value }})</b>
            </dt>
            <dd>
              <select v-bind:mult="value2.value" @change="total_up">
                <!-- This could be generated as well -->
                <option></option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
              </select>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </body>
  <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14"></script>
  <script>
    const app = new Vue({
      el: "#app",
      data: {
        all: {},
        data: {},
      },
      methods: {
        total_up() {
          let tc = document.getElementById("totalCount");
          let selects = document.getElementsByTagName("select");
          let sum = 0;
          for (let s of selects) {
            let mult = s.getAttribute("mult");
            let m = parseInt(mult);
            let i = s.selectedIndex;
            let o = s[i].innerHTML;
            if (o !== "") {
              let n = parseInt(o, 10);
              let mn = n * m;
              sum += mn;
            }
          }
          tc.innerHTML = sum;
        },
      },
      created() {
        fetch("https://path/to/cp_skills.json")
          .then((response) => response.json())
          .then((data) => {
            this.all = data.skills;
          });
      },
    });
  </script>
</html>
```

![The Skills List](https://jacoby.github.io/images/cyberskills.png)

Right off, the `total_up` method code is not as I would want to be. I tried to do some arrow function fun, basically getting `s.value`, but I could not force it to work, instead getting `s.selectedIndex` and pulling that from the OPTION list. I'm not _happy_ with this solution, but I _am_ satisfied.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
