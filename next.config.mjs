/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Fix for react-pdf and pdfjs issues
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      encoding: false,
    }
    
    // Exclude react-pdf from server-side rendering
    if (isServer) {
      config.externals = [...(config.externals || []), 'canvas', 'encoding']
    }
    
    return config
  },
}

export default nextConfig
