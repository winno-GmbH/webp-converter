// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     domains: ['avatars.githubusercontent.com'],
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "avatars.githubusercontent.com",
//         port: "",
//         pathname: "",
//       },
//     ],
//   },
//   env: {
//     mongodb_username: "admin",
//     mongodb_password: "b9wb6ROIp6GduVYy",
//     mongodb_clustername: "cluster0",
//     mongodb_database: "dev-database",
//   },
// };

// module.exports = nextConfig;

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  env: {
    mongodb_username: "admin",
    mongodb_password: "b9wb6ROIp6GduVYy",
    mongodb_clustername: "cluster0",
    mongodb_database: "dev-database",
  },
};

module.exports = nextConfig;
