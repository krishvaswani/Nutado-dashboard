/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  serverExternalPackages: ["@grpc/grpc-js", "google-gax"],
};

module.exports = nextConfig;
