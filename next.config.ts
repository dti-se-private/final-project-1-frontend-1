/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        reactCompiler: true,
        turbo: {
            rules: {
                "*.scss": {
                    loaders: ["sass-loader"],
                    as: "*.css",
                },
            }
        },
    },
    sassOptions: {
        silenceDeprecations: ['legacy-js-api'],
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
