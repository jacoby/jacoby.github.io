---
layout: post
title: "Scaled Vector Graphics on the Web for Fun and ?"
author: "Dave Jacoby"
date: "2019-09-13 09:56:21 -0400"
categories: ""
---

This is an image.

![Clock](https://jacoby.github.io/images/clock.svg)

I enjoy playing with clocks, and [this is from that tool](https://jacoby.github.io/SVGClock/index.html).

This is done with **Scaled Vector Graphics**, or **SVGs**. SVGs are a text-based XML format, and they look like this.

```svg
<svg xmlns="http://www.w3.org/2000/svg" id="neck" viewBox="0 0 900 900">
    <style>
        .loop {
            stroke: #666;
            stroke-width: 20;
            fill-opacity: 0;
            }
        #cen, #day, #hor, #min, #sec {
            stroke: #666;
            stroke-width: 10;
            }
        #cen { fill: lightblue; }
        #day { fill: yellowgreen; }
        #hor { fill: yellow; }
        #min { fill: orange; }
        #sec { fill: red; }
    </style>

    <circle id="d_loop" cx="450" cy="450" r="100" class="loop"/>
    <circle id="h_loop" cx="450" cy="450" r="200" class="loop"/>
    <circle id="m_loop" cx="450" cy="450" r="300" class="loop"/>
    <circle id="s_loop" cx="450" cy="450" r="400" class="loop"/>

    <circle id="sec" cx="450" cy="050" r="30" class="dot"/>
    <circle id="min" cx="450" cy="150" r="30" class="dot"/>
    <circle id="hor" cx="450" cy="250" r="30" class="dot"/>
    <circle id="day" cx="450" cy="350" r="30" class="dot"/>
    <circle id="cen" cx="450" cy="450" r="30" class="dot"/>
</svg>
```

What do we see? We see things with **ID** tags, so they can be uniquely identified and with **CLASS** tags so they can be grouped.

This means, in a web context, you can uniquely address those things and change them.

```javascript
function draw_second(seconds) {
  let deg = seconds * 6;
  let deg2 = (deg - 90) % 360;
  let sec = document.getElementById("sec");
  let xy = circleCoords(400, deg2);
  let x = 450 + xy.x;
  let y = 450 + xy.y;
  sec.setAttribute("cx", x);
  sec.setAttribute("cy", y);
}

function circleCoords(radius, degFromTop) {
  const rads = degToRad(degFromTop);
  return {
    x: radius * Math.cos(rads),
    y: radius * Math.sin(rads)
  };
}

function degToRad(deg) {
  return (deg / 360) * (Math.PI * 2);
}
```

There is more, of course, but each circle has a center, which is defined by the x and y coordinates, and so the `cx` is the x coordinate of that circle and `cy` is the y coordinate. The base image is 900x900, so this is placed in relation to `450,450` and the radius is 400, so we set that with `setAttribute`, just like we're messing with the DOM in other contexts.

There are two other uses I know for SVGs. Logos are _great_ in SVG, because they scale, still looking sharp when blown up to poster and side-of-truck sizes. They are also useful for laser cutters, where different colors are used for different laser intensity, so that a thick black section is made darker, but a thin red line will be cut through.

But remember that, in a web context, the parts of the image are as addressable and modifiable as anything else on a web page.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
