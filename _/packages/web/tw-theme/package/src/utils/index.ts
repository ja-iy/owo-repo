import type { HslValueResolver, RgbValueResolver, HexValueResolver } from "../config/create/utils"

export const hsl: HslValueResolver = (h, s, l) => `${ h }deg ${ s }% ${ l }%`
export const rgb: RgbValueResolver = (r, g, b) => `${ r } ${ g } ${ b }`
export const hex: HexValueResolver = (hex) => hex.startsWith('#') ? (hex as `#${ string }`) : `#${ hex }`
