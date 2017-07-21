---
layout: post
title:  "Jekyll; Trying"
date:   2017-07-21 12:59:13 -04:00
categories: jekyll blogging
---
I've been using GitHub Pages with a site of my own design, showing a list of my
repos as an early try at Bootstrap, for a while. I've blogged on other systems, like [Blogger][1], but decided to try Jekyll.

My first pass was to try to get this working specifically as jacoby.github.io/blog, keeping that first page as mine, and MAN it would not go.

This seems to work well. My preferences for programming are Perl and Javascript (I hate writing it in camel-case), and if I can just put in code blocks, it will satisfy my needs.

{% highlight javascript %}
// Javascript example
  for ( i = 0 ; i < 10 ; i ++ ) {
    var r = ( -1 + ( 2 * Math.random() ) ).toFixed(2) ;
    console.log(r);
}
{% endhighlight %}

{% highlight perl %}
# Perl example
    for my $module ( @modules ) {
        no strict 'refs' ;
        my $ver = ${ $module . '::VERSION' } ;
        diag( "Using $module $ver" ) ;
        }
{% endhighlight %}

Looks good so far. I think I'll have to make some things to automate the page creation and memorize some markdown, but I like.


[1]: http://varlogrant.blogspot.com/

