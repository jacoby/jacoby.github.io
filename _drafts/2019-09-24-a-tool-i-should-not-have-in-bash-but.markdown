---
layout: post
title: "A Tool I Should Not Have In Bash, But..."
author: "Dave Jacoby"
date: "2019-09-24 16:21:20 -0400"
categories: ""
---

The name of this tool is `dush`, because it is derived from `du -sh`.

If you run `du -sh` in this directory, it will assume you mean the current directory, but for me, it is best to get information about each of the subdirectories in the local directory.

```bash
#!/bin/bash

find . -maxdepth 1 -type d
```

This gets you an out-of-order list of the current directories, and is a good start. I know `-exec` exists, but I have yet to master it, and I _have_ begun to learn `xargs` so...

```bash
#!/bin/bash

find . -maxdepth 1 -type d |\
xargs -d "\n" -n 1 du -sh
```

The `xargs` magic starts with `-d "\n"`, which means it only splits on newlines, so your `This Is A Directory` directory does not have to be renamed. And `-n 1` means the next command just gets 1 at a time. If you doing `chmod`, you might make it `-n10` or something, so that you don't get more that your shell can handle, but not taking up too many processes.

This is 

```bash
#!/bin/bash

find . -maxdepth 1 -type d |\
xargs -d "\n" -n 1 du -sh |\
awk '{FS="\t";OFS="\t"}  {print $2,$1}' |\
sort |\
awk '{FS="\t";OFS="\t"}  {print $2,$1}'
```

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Twitter](https://twitter.com/jacobydave) or [make an issue on my blog repo](https://github.com/jacoby/jacoby.github.io).
