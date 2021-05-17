import workboxBuild from 'workbox-build'

workboxBuild.generateSW({
  globDirectory: 'dist',
  globPatterns: [
    '**/*.{css, woff2, jpg, png}',
    './scripts/app/**/*.js',
    './manifest.webmanifest'
  ],
  swDest: 'dist/sw.js',
  sourcemap: false,
  skipWaiting: true,
  runtimeCaching: [{
    urlPattern: /\.(?:(jpe?|pn|sv)g|css|woff2)$/,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'carstats-cache'
    }
  }],
  clientsClaim: true
})
