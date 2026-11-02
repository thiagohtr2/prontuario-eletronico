/**
 * Reset mínimo dos sites de inspiração. É injetado uma vez na galeria e copiado para o
 * HTML demonstrativo exportado, para que a prévia e o arquivo fiquem idênticos.
 */
export const SITE_BASE_CSS = `
.ia-site{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-align:left;overflow-wrap:break-word}
.ia-site *,.ia-site *::before,.ia-site *::after{box-sizing:border-box}
.ia-site h1,.ia-site h2,.ia-site h3,.ia-site h4,.ia-site p,.ia-site ul,.ia-site ol,.ia-site figure,.ia-site blockquote,.ia-site dl,.ia-site dd{margin:0}
.ia-site h1,.ia-site h2,.ia-site h3,.ia-site h4{font-weight:inherit;letter-spacing:inherit;line-height:1.1}
.ia-site ul,.ia-site ol{padding:0;list-style:none}
.ia-site a{color:inherit;text-decoration:none}
.ia-site svg{max-width:none}
.ia-site table{border-collapse:collapse;width:100%}
.ia-site th,.ia-site td{padding:0;text-align:left;font-weight:inherit}
`.trim()
