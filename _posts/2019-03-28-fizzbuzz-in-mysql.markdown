---
layout: post
title:  "FizzBuzz in MySQL"
author: "Dave Jacoby"
date:   "2019-03-28 11:48:31 -0400"
categories: ""
---

Since I've been messing with the FizzBuzz problem recently, I started digging. First I looked at Excel, but I run Excel 2015 and Excel started supporting `CONCAT` in 2016. I _could_ (and might later) try this in Google Sheets, but I decided to aim elsewhere.

## **MySQL**

The first problem is `RANGE()`, or specifically, the lack of it. I don't want to create a `numbers` table just to allow me to get the numbers from 1 to 20, so, the solution:

```sql
SELECT * FROM (
        SELECT 1 i
        UNION SELECT 2
        UNION SELECT 3
        UNION SELECT 4
        UNION SELECT 5
        UNION SELECT 6
        UNION SELECT 7
        UNION SELECT 8
        UNION SELECT 9
        UNION SELECT 10
        UNION SELECT 11
        UNION SELECT 12
        UNION SELECT 13
        UNION SELECT 14
        UNION SELECT 15
        UNION SELECT 16
        UNION SELECT 17
        UNION SELECT 18
        UNION SELECT 19
        UNION SELECT 20
    ) A;
```

And from here, we have three "tricks" to get us from here to total FizzBuzz, and you know them, but perhaps not within SQL.

## **`MOD()`**

We're gonna use the same `FROM` from here on out. `MOD()` is modulus, and `SELECT i, MOD(i,3) m` gives us

```
i	m
1	1
2	2
3	0
4	1
5	2
6	0
7	1
8	2
9	0
10	1
11	2
12	0
13	1
14	2
15	0
16	1
17	2
18	0
19	1
20	2
```

From here, we go to ...

## **`IF()`**

Specifically, we go to `SELECT IF(MOD(i, 3) < 1, 'fizz', '')`

```
IF(MOD(i, 3) < 1, 'fizz', '')


fizz


fizz


fizz


fizz


fizz


fizz



```

This is a good start, but here, we're dealing with all those empty rows. Do not want, so we go to the previously mentioned...

## **`CONCAT()`**

Concatentation takes several lines and joins it to one line. Like this:

```sql
CONCAT(
        IF(MOD(i, 3) < 1, 'fizz', ''),
        IF(MOD(i, 5) < 1, 'buzz', ''),
        IF(
            MOD(i, 3) >= 1 AND
            MOD(i, 5) >= 1, i, ''
        )
    )
```

Resulting in:

```
1
2
fizz
4
buzz
fizz
7
8
fizz
buzz
11
fizz
13
14
fizzbuzz
16
17
fizz
19
buzz
```


If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).


