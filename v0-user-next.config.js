/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  // Adjust this to your GitHub repository name if deploying to GitHub Pages
  // e.g., if your repo is at github.com/username/gladstart, use '/gladstart'
  basePath: process.env.NODE_ENV === "production" ? "/gladstart" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/gladstart/" : "",
  trailingSlash: true,
}

module.exports = nextConfig

