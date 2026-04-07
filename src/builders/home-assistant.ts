import chroma from "chroma-js"
import { ramp } from "../util/colour"

interface Switch {
  switchUncheckedButtonColor: string,
  switchUncheckedTrackColor: string,
  switchCheckedButtonColor: string,
  switchCheckedTrackColor: string,
}

interface Mushroom {
  mushRgbRed: string,
  mushRgbGreen: string,
  mushRgbBlue: string,
  mushRgbIndigo: string,
  mushRgbDisabled: string,
}

interface Styles extends Mushroom, Switch {
  accentColor?: string,
  primaryColor?: string,

  primaryTextColor?: string,
  secondaryTextColor?: string,
  haCardHeaderColor?: string, // Overrides primary text colour
  haColorOnPrimaryNormal?: string, // Button labels

  sidebarBackgroundColor? :string, // Default to appHeaderBackgroundColor if not provided
  primaryBackgroundColor?: string, // Behind cards
  cardBackgroundColor?: string, // Cards

  sidebarIconColor?: string,
  sidebarSelectedIconColor? :string,

  haColorFormBackground?: string,
  haTabIndicatorColor?: string,
  appHeaderEditBackgroundColor? :string,
}

interface Mode extends Partial<Styles> {
  primaryColor: string,
  primaryTextColor: string,
  secondaryTextColor: string,
  disabledTextColor: string,
  sidebarTextColor: string,
  // haColorFillPrimaryQuietResting: string
}

interface Inputs extends Partial<Styles> {
  red: string,
  blue: string,
  orange: string,
  green: string,

  light: Mode,
  dark: Mode,
}

export const lightScale = (colour: chroma.ChromaInput) => {
  return [chroma(colour).darken(3), colour, chroma(colour).brighten(3.5)]
}

export const singleColourEntry = (
  colour: chroma.ChromaInput,
  name: string,
  scaleFn: (c: chroma.ChromaInput) => chroma.ChromaInput[] = lightScale,
) => {
  return {
    [name]: chroma(colour).hex(), // Uncontextualised
    [`${name}-rgb`]: chroma(colour).rgb(), // For mushroom colors
    ...ramp({scale: scaleFn(colour), prefix: `${name}-`}), // At scale
  }
}

// Some derived variants require the mode color (like primary and disabled text)
const hydrateMode = (mode: Mode): Record<string, string> => {
  return {
    ...mode,
    rgbPrimaryTextColor: chroma(mode.primaryTextColor).rgb().join(", "), // Required for radio button unchecked state
    haColorDisabledRgb: chroma(mode.disabledTextColor).rgb().join(", "), // For mushroom
  }
}

export const build = (palette: Inputs): Promise<Record<string, any>> => {
  const { light, dark, primaryColor, ...rest} = palette;
  return Promise.resolve({
    modes: {light: hydrateMode(light), dark: hydrateMode(dark)},

    // Rgb modes
    rgbRed: chroma(palette.red).rgb().join(", "),
    rgbBlue: chroma(palette.blue).rgb().join(", "),
    rgbOrange: chroma(palette.orange).rgb().join(", "),
    rgbGreen: chroma(palette.green).rgb().join(", "),

    // Switch
    switchUncheckedButtonColor: "var(--disabled-text-color)",
    switchUncheckedTrackColor: "var(--disabled-text-color)",
    switchCheckedButtonColor: "var(--ha-color-primary)",
    switchCheckedTrackColor: "var(--ha-color-primary)",

    // navbarPrimaryColor: "var(--ha-color-yellow)",

    // Colours
    errorColor: "var(--ha-color-red)",
    warningColor: "var(--ha-color-yellow)",
    successColor: "var(--ha-color-aqua)",
    infoColor: "var(--ha-color-blue)",

    // Button labels
    haColorOnPrimaryQuiet: "var(--ha-color-primary-50)",
    haColorOnPrimaryLoud: "var(--white-color)",

    // Map mushroom colours to ha-colors
    mushRgbRed: "var(--ha-color-red-rgb)",
    mushRgbGreen: "var(--ha-color-green-rgb)",
    mushRgbBlue: "var(--ha-color-blue-rgb)",
    mushRgbIndigo: "var(--ha-color-blue-rgb)",
    mushRgbDisabled: "var(--ha-color-disabled-rgb)", // Color generated from modes

    // Forms
    inputLabelInkColor: "var(--secondary-text-color)", // Small text above inputs
    haColorFormBackground: "var(--sidebar-background-color)", // Input background
    haColorFormBackgroundHover: "var(--ha-color-form-background)", // Disable hover

    // State icons
    stateIconColor: "var(--ha-color-neutral-60)",
    stateIconActiveColor: "var(--yellow-color)",
    stateIconUnavailableColor: "var(--disabled-text-color)",
    stateInactiveColor: "var(--disabled-text-color)",
    paperItemIconActiveColor: "var(--state-icon-active-color)", // see https://github.com/basnijholt/lovelace-ios-dark-mode-theme/issues/30

    ...rest,
  })
}
