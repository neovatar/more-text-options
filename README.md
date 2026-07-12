![Latest Release](https://img.shields.io/github/v/release/neovatar/more-text-options?style=for-the-badge&label=Latest%20release&color=%23ff6400)
![Downloads (release-13.1.0)](https://img.shields.io/github/downloads/neovatar/more-text-options/release-13.1.0/more-text-options.zip?style=for-the-badge&label=Downloads%20%28release-13.1.0%29)
![Downloads (all releases)](https://img.shields.io/github/downloads/neovatar/more-text-options/more-text-options.zip?style=for-the-badge&label=Downloads%20%28all%20releases%29)

# More Text Options (Foundry VTT Module)

This module adds some configuration options for text drawings, like configuring the stroke color. It uses options supported by [pixi.js TextStyle class](https://pixijs.download/dev/docs/text.TextStyle.html).

This module is based on the [Advanced Drawing Tools](https://github.com/DawidIzydor/advanced-drawing-tools) module which does not support Foundry v14 yet. "More Text Options" is basically a code snippet taken from this this module with a few additional fixes. Since the text formatting is the only part I really needed, I decided to fork that part of the code.

All the code credits really belong to the original authors of the "Advanced Drawing Tools" module:

- [dev7355608](https://github.com/dev7355608)
- [Dawid Izydor](https://github.com/DawidIzydor)

## Installation

https://github.com/neovatar/more-text-options/releases/latest/download/module.json

See [Foundry Wiki - How to install a module](https://foundryvtt.wiki/en/basics/Modules) on help on how to use the manifest URL to install a module.

## Example

This text drawing from one of my campaigns was the main motivation for this module.

Basic Foundry text drawing rendering:
![Basic Foundry text drawing rendering](docs/basic-foundry.png)

Rendering with configurable text stroke via "More Text Options":
![Rendering with configurable text stroke](docs/configurable-stroke-color.png)

