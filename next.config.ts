import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Modo estricto para identificar problemas
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"], // Opcional: Manejo de archivos SVG
    });

    return config;
  },
};

export default nextConfig;