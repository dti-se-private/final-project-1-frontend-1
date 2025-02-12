/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        reactCompiler: false,
    },
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.builder.io',
            },
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
        ],
    }
};

export default nextConfig;
