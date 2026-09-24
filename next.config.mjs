/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_GCP_PROJECT_ID: 'gen-lang-client-0862587160',
    NEXT_PUBLIC_GCP_PROJECT_NUMBER: '349577440002',
    NEXT_PUBLIC_GCP_REGION: 'us-west1',
    NEXT_PUBLIC_APP_NAME: 'CORDANO PMS V1',
  },
};

export default nextConfig;
