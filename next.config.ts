import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1", // ganti sesuai domain gambar
        port: "8000", // ganti sesuai port gambar
      },
      {
        protocol: "https",
        hostname: "pasi.my.id", // ganti sesuai domain gambar
      },
    ],
  },
};

export default nextConfig;
