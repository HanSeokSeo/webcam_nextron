module.exports = {
  images: {
    // loader: "akamai",
    // path: ".",
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "electron-renderer"
    }

    return config
  },
}
