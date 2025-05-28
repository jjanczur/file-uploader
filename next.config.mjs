/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/file-uploader' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/file-uploader/' : '',
}

export default nextConfig
