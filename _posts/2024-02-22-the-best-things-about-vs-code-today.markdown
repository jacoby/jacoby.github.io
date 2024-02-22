---
layout: post
title: "The Best Things About VS Code Today"
author: "Dave Jacoby"
date: "2024-02-22 11:33:14 -0500"
categories: ""
---

I recently gave a presentation about VS Code to members of my local developer group, [HackLafayette](https://www.meetup.com/hacklafayette/). I worked through several bullet points in a fairly stream-of-consciousness and showed off a lot of how I use VS Code.

## Remote Development

I am a long-time user of [VS Code](https://code.visualstudio.com/). So long, [I found a bug in VS Code in 2018](https://jacoby.github.io/2018/09/19/i-find-the-strangest-bugs.html). At that time, I was working out of Ubuntu Linux and using [SSHFS](https://www.digitalocean.com/community/tutorials/how-to-use-sshfs-to-mount-remote-file-systems-over-ssh) under [FUSE](https://www.kernel.org/doc/html/latest/filesystems/fuse.html) to have the files and directories for research computing available to me on my local machine.

I did this almost entirely so I could open these files in VS Code, and opening these batch files from the command line was the bug.

If I was working in that position today, I would not need to do that, because today (and I am not sure how long this capability has existed), [VS Code supports Remote Development](https://code.visualstudio.com/docs/remote/remote-overview). I think it started so that people like me could code within their [WSL](https://learn.microsoft.com/en-us/windows/wsl/) environments without having to jump through hoops like I had to in 2018.

Basically, there's a separation between the frontend code and the backend, and they made it so that the communication between the two is abstracted. This means that the backend code can be set up and run invisibly to the user. With WSL, that communication doesn't leave the computer, but [VS Code is an SSH client that uses your .ssh/config](https://code.visualstudio.com/blogs/2019/07/25/remote-ssh), so you can even use [ProxyJump](https://www.redhat.com/sysadmin/ssh-proxy-bastion-proxyjump) to access machines not directly accessable.

This also means that you can [use VS Code with Docker containers](https://code.visualstudio.com/docs/devcontainers/containers) and do Peer Programming remotely with [Live Share](https://code.visualstudio.com/learn/collaboration/live-share).

Additionally, [VS Code has an integrated terminal](https://code.visualstudio.com/docs/terminal/basics), so when you're connected to the remote machine, you have a prompt there. At that time, I was working through [AWS Workspaces](https://aws.amazon.com/workspaces/) on [Window Server Datacenter](https://learn.microsoft.com/en-us/windows-server/get-started/editions-comparison-windows-server-2022?tabs=full-comparison), which didn't allow me to install MSI packages, meaning that I couldn't use [Windows Terminal](https://github.com/microsoft/terminal), so VS Code ended up being the terminal I used almost all the time.

The terminal list is customizable, so if you want the ability to use [Nushell](https://www.nushell.sh/) or Node or Python as a [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop), that's doable. 


## Workspaces and Customization

Early in my time with VS Code that when I opened up the editor, I got windows with a purple bar at the bottom.

![Default VS Code window](https://jacoby.github.io/images/vscode_window.png)

I was never in love with the color, and when, by accident, I opened things differently, I got a blue bar at the bottom.

![Default VS Code window](https://jacoby.github.io/images/vscode_workspace_window.png)

It took a while, and a discussion with [genehack](https://genehack.org/) to understand that the second window is different because it is a [workspace](https://code.visualstudio.com/docs/editor/workspaces).

Workspaces mean that, when you close and open them again, the same files will be open. I believe the terminal history will also be retained.

They are also customizable. VS Code is very customizable, and those customizations are stored and are editable as JSON, but you can also specify customizations for workspaces. As an example, imagine you're working on a group project outside your normal development, and there are differences, such as indent width, that are specific to that project.

In my talk, I created a workspace with the following settings. Several are definitely about display: changing font size and demonstrating ligatures in modern development fonts were part of what I wanted, but I will point out `terminal.integrated.defaultProfile.windows`. When I open a window in my default environment, it defaults to a bash shell in WSL, but here, I change that to [PowerShell](https://learn.microsoft.com/en-us/powershell/), which find bash-like enough for most shell purposes.

```json
{
  "editor.fontSize": 12,
  "editor.fontLigatures": true,
  "editor.renderWhitespace": "boundary",
  "editor.tabSize": 8,
  "editor.wrappingIndent": "deepIndent",
  "editor.defaultFormatter": "bscan.perlnavigator",
  "terminal.integrated.fontSize": 12,
  "terminal.integrated.defaultProfile.windows": "PowerShell"
}
```

The customization also works with Remote Environments, so you can specify most anything for windows running over SSH. I commonly use different themes for different hosts, to help me to know where I am. Additionally, you can create and use different [profiles](https://code.visualstudio.com/docs/editor/profiles). Looking at the "Create New Profile" screen shows templates for Python, Angular, Doc Writer, Data Science, Node, and two Java-specific templates.

Also, within each context setting, you can specify things by language. Below is a subset of my default `settings.json`.

```json
{
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.fontFamily": "'Iosevka Term', 'Fantasque Sans Mono', Consolas, 'Courier New', monospace",
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.fontSize": 18,
    "editor.fontFamily": "'Iosevka Term', 'Fantasque Sans Mono', Consolas, 'Courier New', monospace"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.fontSize": 15,
    "editor.fontFamily": "'Iosevka Term', 'Fantasque Sans Mono', Consolas, 'Courier New', monospace"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[perl]": {
    "editor.defaultFormatter": "bscan.perlnavigator"
  },
  "[python]": {
    "editor.defaultFormatter": "ms-python.python",
    "editor.formatOnType": true
  },
  "[yaml]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

These examples show mostly the font family, font size and default formatting engine for each language, but with Python, there's `editor.formatOnType`, which formats the text while you write it. There are also options for `formatOnSave` and `formatOnPaste`, so that

So, VS Code can behave differently based on workspace, on environment, on profile and on language.

## Extensions

And the custom behavior can involve functionality. So many of the language examples mention [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), a code formatter for Javascript, JSON, CSS, HTML, Markdown, YAML and a number of other languages. I mentioned that VS Code can work with [Docker](https://www.docker.com/), and that is done via [the Docker extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker).

Using VS Code as an SSH client to connect to remote hosts comes from the [Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh) extension, and there's also [Remote Explorer](https://marketplace.visualstudio.com/items?itemName=ms-vscode.remote-explorer), jumping directly to the workspaces on remote hosts.

There's an extension I find powerful called [RainbowCSV](https://marketplace.visualstudio.com/items?itemName=mechatroner.rainbow-csv), which makes each column of a comma-separated file a different color, making them easier to read.

Not related to extensions, but VS Code is a Git client, so you can use it to connect to GitHub or Bitbucket directly, without the use of command-line Git tools or GitHub desktop. Most of the time, when I add to this blog, I write the markdown using the built-in Markdown Preview and commit and push from within VS Code. They've recently added [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens). I've barely touched it, but it seems like a useful tool for working with a large, long-lived repository with multiple contributors.

#### If you have any questions or comments, I would be glad to hear it. Ask me on [Mastodon](https://mastodon.xyz/@jacobydave) or [make an issue on my blog repo.](https://github.com/jacoby/jacoby.github.io)
