# Vendored anti-slop

Source: [dmmulroy/anti-slop](https://github.com/dmmulroy/anti-slop) at
`c44ef22ca116d0ba62a3ff663a0bd13a3f3fa40b`, installed through the `install-anti-slop` skill in
[Aquitano/.dotfiles](https://github.com/Aquitano/.dotfiles)
(`common/agents/skills/install-anti-slop/assets/anti-slop`) at dotfiles commit
`1d945b65b01d389e5a46d759035a6f326f6826d6`. Update this copy with that skill; it reads this file to
tell upstream changes from local ones.

The generic plugin (`index.ts`, `rules/`, `shared/`, `vendor/`) is byte-identical to the skill at that
commit. The skill's own local changes on top of anti-slop are recorded in dotfiles
`common/agents/upstream-skills.json` and its history, including `1d945b6`, which makes
`no-module-mocking` recognise `vi` from `vite-plus/test` and Bun's `mock.module`.

## Local changes

- The opt-in Effect plugin (`effect/`) is not vendored, because this repository does not depend on
  `effect`.
