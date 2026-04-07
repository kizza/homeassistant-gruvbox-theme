# 🎨 Home Assistant Gruvbox Theme

A warm, retro-inspired, low-contrast color scheme with earthy tones and balanced saturation.
Inspired by the popular [gruvbox](https://github.com/morhetz/gruvbox) editor themes.

### Screenshots

**Light**

<img width="3728" height="1808" alt="Light" src="https://github.com/user-attachments/assets/a8d8a59b-a83e-4232-a874-7e11f42143a2" />

**Dark**

<img width="3726" height="1808" alt="Dark" src="https://github.com/user-attachments/assets/d8d4f070-249b-4794-8f44-4c3362d681f4" />

## Installation

**Manual (pending HACS)**

Clone this repository, and place `themes/gruvbox.yaml` into your `themes/` folder.

Add the following code to your `configuration.yaml` file (reboot required).

```yaml
frontend:
  ... # your configuration.
  themes: !include_dir_merge_named themes
  ... # your configuration.
```
  
## Features

- Light, dark or auto configuration
- Includes colors for [Mushroom](https://github.com/piitaya/lovelace-mushroom) cards

## Development

This theme is built using a script.  If you wish to build the theme yaml yourself, you can run the following:

```bash
bun install
bun run build
```
