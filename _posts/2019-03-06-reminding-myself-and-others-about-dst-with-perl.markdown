---
layout: post
title:  "Reminding Myself and Others about DST with Perl"
author: "Dave Jacoby"
date:   "2019-03-06 11:08:48 -0500"
categories: ""
---

Daylight Saving Time.

The reaction to DST in my Twitter feed ranges from ["meh"](https://twitter.com/jcharles00/status/1103310240328679424) to ["Damn it!"](https://twitter.com/coreyseliger/status/1103325816883236866), but it is important to know it's coming up, because otherwise, you're an hour off your scheduled appointments. And it's always odd to have it sneak up on you.

A lot of people don't understand DST, just knowing it throws a monkey-wrench into their routine when they don't expect it. The thing to remember is that it is meant to allow you another hour in the summer to golf or swim or enjoy ice cream, so on Monday, you'll go to work in the dark but go home with more sunlight. It's for the leisure industry, not the farmers, because the cows and the corn don't care about what your clock says.

And if you live in Hawaii and Arizona, you don't have to deal with this mess. Good for you.

So, when are the dates of DST in the US? I looked it a few years ago, and I enshrined it in a function that is _so_ not how I'd write it today:

```perl
sub get_next_dst {
    my ($now) = shift ;

    my @dates ;
    push @dates, [ 2015, 3,  8 ] ;
    push @dates, [ 2015, 11, 1 ] ;
    push @dates, [ 2016, 3,  13 ] ;
    push @dates, [ 2016, 11, 6 ] ;
    push @dates, [ 2017, 3,  12 ] ;
    push @dates, [ 2017, 11, 5 ] ;
    push @dates, [ 2018, 3,  11 ] ;
    push @dates, [ 2018, 11, 4 ] ;
    push @dates, [ 2019, 3,  10 ] ;
    push @dates, [ 2019, 11, 3 ] ;
    push @dates, [ 2020, 3,  8 ] ;
    push @dates, [ 2020, 11, 1 ] ;
    push @dates, [ 2021, 3,  14 ] ;
    push @dates, [ 2021, 11, 7 ] ;
    push @dates, [ 2022, 3,  13 ] ;
    push @dates, [ 2022, 11, 6 ] ;
    push @dates, [ 2023, 3,  12 ] ;
    push @dates, [ 2023, 11, 5 ] ;
    push @dates, [ 2024, 3,  10 ] ;
    push @dates, [ 2024, 11, 3 ] ;
    push @dates, [ 2025, 3,  9 ] ;
    push @dates, [ 2025, 11, 2 ] ;
    push @dates, [ 2026, 3,  8 ] ;
    push @dates, [ 2026, 11, 1 ] ;
    push @dates, [ 2027, 3,  14 ] ;
    push @dates, [ 2027, 11, 7 ] ;
    push @dates, [ 2028, 3,  12 ] ;
    push @dates, [ 2028, 11, 5 ] ;
    push @dates, [ 2029, 3,  11 ] ;
    push @dates, [ 2029, 11, 4 ] ;

    for my $d (@dates) {
        my $dst = DateTime->new(
            year      => $d->[0],
            month     => $d->[1],
            day       => $d->[2],
            hour      => 1,
            minute    => 59,
            second    => 59,
            time_zone => 'America/Indiana/Indianapolis',
            ) ;

        my $duration   = $now->delta_days($dst) ;
        my $delta      = $duration->in_units('days') ;
        my $years_diff = $now->subtract_datetime($dst)->in_units('years') ;
        my $days_diff  = $now->subtract_datetime($dst)->in_units('days') ;

        next if $years_diff != 0 ;
        next if $days_diff > 0 ;

        return $dst ;
        }
    croak 'Too Far' ;
    }
```

This takes a [`DateTime`](https://metacpan.org/pod/DateTime) object and compares it with a list of `DateTime`s, corresponding to the time DST comes and goes. I did this in 2015, and it's very on-brand for Congress to have voted to change the dates, but it has been accurate so far.

(I use subroutine signatures, I could make the array of arrays in one go rather than pushing every one, and I could use map to make it into an array of DT objects earlier. And, suddenly, I'm considering something like `DateTime::Events::DST::US` to handle this for me and logging back into PAUSE. I'm sure I can crib lots of stuff from [`DateTime::Event::Easter`](https://metacpan.org/pod/DateTime::Event::Easter), too. But I won't change it now, because it works.)

So how do we use it?

```perl
# this code WILL be changed to make it better
my $now = DateTime->now()
    ->set_time_zone('America/Indiana/Indianapolis') ; # should be 'floating'

# MJD suggested using Fibonacci as the correct way to time notices
# but I went with this to give notification every day the day of
my %count = map { $_ => 1 } qw{ 1 2 3 4 5 6 10 25 50 100 150 200 } ;

my $dst        = get_next_dst($now) ;
my $delta      = $now->delta_days($dst)->in_units('days') ;
if ( $count{$delta} ) {
    alert_dst($delta) ;
    }
```

And what does `alert_dst()` do? For me, it sends a tweet with a module that wraps and handles login for `Net::Twitter`, which, not being [`Twitter::API`](https://metacpan.org/pod/Twitter::API), is not how you should do it these days, so I won't share that code.

I _will_ share, however, that if you [follow me on Twitter](https://twitter.com/jacobydave), you will not only know when you're 100 days from the next DST change, you will also see when I write new blog posts, like this one.

If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


