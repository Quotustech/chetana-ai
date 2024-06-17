/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath:'/admin',
  async redirects() {
    return [
      {
        source: "/",
        destination: "/app",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
