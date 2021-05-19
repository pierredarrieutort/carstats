const path = require('path')

module.exports = {
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
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: path.resolve('public/images/icon-256x256.png'),
      sizes: '256x256',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: path.resolve('public/images/icon-384x384.png'),
      sizes: '384x384',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: path.resolve('public/images/icon-512x512.png'),
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: path.resolve('public/images/maskable_icon_x512.png'),
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable'
    },
    {
      src: path.resolve('public/images/maskable_icon_x384.png'),
      sizes: '384x384',
      type: 'image/png',
      purpose: 'maskable'
    },
    {
      src: path.resolve('public/images/maskable_icon_x192.png'),
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable'
    },
    {
      src: path.resolve('public/images/maskable_icon_x128.png'),
      sizes: '128x128',
      type: 'image/png',
      purpose: 'maskable'
    },
    {
      src: path.resolve('public/images/maskable_icon_x96.png'),
      sizes: '96x96',
      type: 'image/png',
      purpose: 'maskable'
    },
    {
      src: path.resolve('public/images/maskable_icon_x72.png'),
      sizes: '72x72',
      type: 'image/png',
      purpose: 'maskable'
    },
    {
      src: path.resolve('public/images/maskable_icon_x48.png'),
      sizes: '48x48',
      type: 'image/png',
      purpose: 'maskable'
    }
  ]
}
