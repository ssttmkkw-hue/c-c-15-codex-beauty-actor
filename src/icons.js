const paths = {
  aperture: '<circle cx="12" cy="12" r="9"/><path d="m10 3.2 4.3 7.5m6.3-4.1H12m8.8 7.6-4.3-7.4m-2.5 14 4.4-7.6M3.4 17.3h8.8M3 9.7l4.5 7.6"/>',
  play: '<path d="M8 5.8v12.4l10-6.2z" fill="currentColor" stroke-linejoin="round"/>',
  pause: '<path d="M9 6v12m6-12v12" stroke-width="3"/>',
  restart: '<path d="M4 11a8 8 0 1 1 1.8 6M4 5v6h6"/>',
  sound: '<path d="M4 9h4l5-4v14l-5-4H4zM16 9a4 4 0 0 1 0 6m2-9a8 8 0 0 1 0 12"/>',
  mute: '<path d="M4 9h4l5-4v14l-5-4H4zM17 10l4 4m0-4-4 4"/>',
  captions: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 10H7v4h3m7-4h-3v4h3"/>',
  expand: '<path d="M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5"/>',
  collapse: '<path d="M4 9h5V4m11 5h-5V4M9 20v-5H4m11 5v-5h5"/>',
  sliders: '<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2" fill="#241828"/><circle cx="15" cy="12" r="2" fill="#241828"/><circle cx="10" cy="18" r="2" fill="#241828"/>',
  script: '<path d="M6 3h9l4 4v14H6zM15 3v5h4M9 12h7m-7 4h7"/>',
}
export function icon(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`
}
