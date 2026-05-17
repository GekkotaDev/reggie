# `TODO`

- Okay the [PDA animation](src/lib/utils/automata/pda.ts) needs fixing but the [DFA animation](src/lib/utils/automata/dfa.ts) can be referenced
  - If we don't need it then just hide the UI for it 👼
- Documentation: either as a website (just use something like [Zensical](https://zensical.org) to get it over with) or as a PDF (use whatever you'd like such as Google Docs, MS Word, or something like that)
- It's **optional** but figuring out a way to deploy it either on something like GitHub Pages/Cloudflare Pages (web app), or package it as a Tauri app (native desktop and mobile app)

## set up development environment

- Make sure you got something like `npm` or its much faster and disk efficient alternative [`pnpm`](https://pnpm.io) set up.
- Make sure Node.js in on your system.
  - If using `pnpm` do [`pnpm runtime set node lts -g`](https://pnpm.io/cli/runtime)
  - If you've installed Node.js through the website you might've gotten `npm` out of the box already
- `npm i` / `pnpm i`
- `npm dev` / `pnpm dev`

## by the way

- yeah you don't really need to zip up `node_modules` when sharing files so we can avoid bloating up the Zip file (unless we're using Git)
- okay bye
