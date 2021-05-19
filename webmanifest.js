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
      src: path.resolve('public/images/icon-192x192.png'),
      size: '192x192',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: path.resolve('public/images/icon-256x256.png'),
      size: '256x256',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: path.resolve('public/images/icon-384x384.png'),
      size: '384x384',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: path.resolve('public/images/icon-512x512.png'),
      size: '512x512',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: path.resolve('public/images/maskable_icon_x512.png'),
      size: '512x512',
      type: 'image/png',
      purpose: 'maskable'
    },
    {
      src: path.resolve('public/images/maskable_icon_x384.png'),
      size: '384x384',
      type: 'image/png',
      purpose: 'maskable'
    },
    {
      src: path.resolve('public/images/maskable_icon_x192.png'),
      size: '192x192',
      type: 'image/png',
      purpose: 'maskable'
    },
    {
      src: path.resolve('public/images/maskable_icon_x128.png'),
      size: '128x128',
      type: 'image/png',
      purpose: 'maskable'
    },
    {
      src: path.resolve('public/images/maskable_icon_x96.png'),
      size: '96x96',
      type: 'image/png',
      purpose: 'maskable'
    },
    {
      src: path.resolve('public/images/maskable_icon_x72.png'),
      size: '72x72',
      type: 'image/png',
      purpose: 'maskable'
    },
    {
      src: path.resolve('public/images/maskable_icon_x48.png'),
      size: '48x48',
      type: 'image/png',
      purpose: 'maskable'
    }
  ]
}
