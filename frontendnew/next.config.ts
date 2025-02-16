import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
        {
            // matching all API routes
            //192.168.16.107:3000
            source: "/api/:path*",
            headers: [
                { key: "Access-Control-Allow-Credentials", value: "true" },
                // { key: "Access-Control-Allow-Origin", value: `http://${process.env.NEXT_PUBLIC_HOST_NAME}:${process.env.NEXT_PUBLIC_PORT}/` },
                { key: "Access-Control-Allow-Origin", value: `http://192.168.16.107:3000` },
                { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
            ]
        }
    ]
}
};

export default nextConfig;
