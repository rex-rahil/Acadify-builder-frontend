const path = require("path");

module.exports = {
  devServer: {
    client: {
      logging: "info",
      overlay: {
        errors: true,
        warnings: false,
      },
      progress: true,
    },
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 4200,
    host: "0.0.0.0",
    allowedHosts: "all",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
    proxy: {
      "/api/*": {
        target: "http://localhost:3000",
        secure: false,
        changeOrigin: true,
        logLevel: "debug",
      },
    },
  },
};
