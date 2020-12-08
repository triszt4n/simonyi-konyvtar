module.exports = {
  headers() {
    return [
      {
        source: "/static/:file",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [
      "http.cat",
      "simonyi-library.s3.eu-central-1.amazonaws.com",
      "via.placeholder.com",
    ],
    path: "/_next/image",
    loader: "default",
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    rollbarServerToken: process.env.ROLLBAR_SERVER_TOKEN,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    rollbarClientToken: process.env.ROLLBAR_CLIENT_TOKEN,
  },
}
