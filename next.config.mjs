/** @type {import('next').NextConfig} */
const nextConfig = {
        reactStrictMode: false,
        experimental: {
          serverComponentsExternalPackages: ['docusign-esign'],
        }
};

export default nextConfig;
