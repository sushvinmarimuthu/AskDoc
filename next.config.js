/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ask-doc-blob.public.blob.vercel-storage.com',
                port: '',
            },
        ],
    },
}

module.exports = nextConfig
