const path = require('path')

module.exports = {
  fingerprints: false,
  publicPath: '/',
  name: 'Carstats',
  short_name: 'Carstats',
  theme_color: '#1b1e22',
  background_color: '#1b1e22',
  display: 'standalone',
  orientation: 'portrait',
  scope: '/',
  start_url: '/',
  description: 'The new driving experience.',
  icons: [
    {
      src: path.resolve('public/images/icon-512x512.png'),
      sizes: [96, 128, 192, 256, 384, 512],
      type: 'image/png',
      purpose: 'any',
      destination: path.join('assets/pwa-icons', 'any')
    },
    {
      src: path.resolve('public/images/maskable_icon_x512.png'),
      sizes: [96, 128, 192, 256, 384, 512],
      type: 'image/png',
      purpose: 'maskable',
      destination: path.join('assets/pwa-icons', 'maskable')
    }
  ]
}
