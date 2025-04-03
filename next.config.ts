import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/logs',
                destination: 'https://challenges.betterstudio.io/logs',
            },
        ];
    },
};

export default nextConfig;
