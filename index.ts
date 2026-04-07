import chroma from "chroma-js";
import { build, singleColourEntry as hassSingleColourEntry } from "./src/builders/home-assistant";
import palette from "./src/palettes/gruvbox";
import { mapKeys, mapValues, quote, saveFile, toKebab, toYaml } from "./src/util";
import { ramp } from "./src/util/colour";

const { monochrome, neutral, bright, faded } = palette;

const neutrals = ramp({
  scale: [chroma(monochrome.light2).darken(3), monochrome.light0hard],
})

// Have particular colours darken and brighten within themed extremes
const themedScale = (
  darkest: chroma.ChromaInput,
  brightest: chroma.ChromaInput,
) => (colour: chroma.ChromaInput) => {
  return [
    chroma.mix(colour, darkest, 0.6, 'lch'),
    colour,
    chroma.mix(colour, brightest, 1, 'lch'),
  ]
}

const singleColourEntry = (colour: chroma.ChromaInput, name: string) => {
  const scale = themedScale(monochrome.dark0, monochrome.light0hard);
  return hassSingleColourEntry(colour, name, scale);
}

// Light theme
build({
  red: neutral.red,
  blue: neutral.blue,
  orange: neutral.orange,
  green: neutral.green,

  // Colours
  ...singleColourEntry(neutral.red, "ha-color-red"),
  ...singleColourEntry(neutral.green, "ha-color-green"),
  ...singleColourEntry(neutral.yellow, "ha-color-yellow"),
  ...singleColourEntry(neutral.blue, "ha-color-blue"),
  ...singleColourEntry(neutral.purple, "ha-color-purple"),
  ...singleColourEntry(neutral.aqua, "ha-color-aqua"),
  ...singleColourEntry(neutral.orange, "ha-color-orange"),
  // Primary
  ...singleColourEntry(neutral.purple, "ha-color-primary"),
  // Neutral
  ...mapKeys(neutrals, (k, _v) => `ha-color-neutral-${k}`),

  // Color moes
  light: {
    // Accents
    primaryColor: neutral.purple,
    accentColor: neutral.green,
    // Typography
    primaryTextColor: neutrals["10"]!, // Used for rgb downstream
    secondaryTextColor: "var(--ha-color-neutral-40)",
    disabledTextColor: neutrals["50"]!, // Used for rgb downstream
    sidebarTextColor: "var(--ha-color-neutral-30)",
    haCardHeaderColor: "var(--ha-color-yellow-10)",
    haColorOnPrimaryNormal: "var(--ha-color-primary-20)",
    // Backgrounds
    sidebarBackgroundColor: chroma(monochrome.light0).hex(), // Seems to need to be hex
    primaryBackgroundColor: monochrome.light0hard, // Behind cards
    cardBackgroundColor: monochrome.light0soft, // Cards
    // Sidebar detail
    sidebarIconColor: "var(--ha-color-yellow-10)",
    sidebarSelectedIconColor: "var(--ha-color-orange)",
    // Extra
    appHeaderEditBackgroundColor: "var(--ha-color-neutral-10)",
  },
  dark: {
    // Accents
    primaryColor: neutral.purple,
    accentColor: neutral.green,
    // Typography
    primaryTextColor: neutrals["90"]!, // Used for rgb downstream
    secondaryTextColor: "var(--ha-color-neutral-60)",
    disabledTextColor: neutrals["50"]!, // Used for rgb downstream
    sidebarTextColor: "var(--ha-color-neutral-70)",
    haCardHeaderColor: "var(--ha-color-yellow-95)",
    haColorOnPrimaryNormal: "var(--ha-color-primary-80)",
    // Backgrounds
    sidebarBackgroundColor: chroma(monochrome.dark0soft).hex(), // Seems to need to be hex
    primaryBackgroundColor: monochrome.dark0, // Behind cards
    cardBackgroundColor: monochrome.dark1, // Cards
    // Sidebar detail
    sidebarIconColor: "var(--ha-color-blue-80)",
    sidebarSelectedIconColor: "var(--ha-color-purple-60)",
    // Extra
    appHeaderEditBackgroundColor: "var(--ha-color-blue-10)",
  }
})
  .then(theme => mapKeys(theme, toKebab))
  .then(theme => mapValues(theme, quote))
  .then(result => toYaml(result, 1))
  .then(yaml => `Gruvbox:\n${yaml}`)
  .then(yaml => saveFile("themes/gruvbox.yaml", yaml))
  .then(() => console.log("Built!"))

