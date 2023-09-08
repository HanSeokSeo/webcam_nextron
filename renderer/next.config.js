module.exports = {
  images: {
    loader: "akamai",
    path: "",
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "electron-renderer";
    }

    return config;
  },
};
