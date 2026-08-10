/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: [
        "jsonwebtoken",
        "bcryptjs",
        "@prisma/client",
        "@prisma/adapter-pg",
        "pg",
        "cloudinary", // ← أضفنا cloudinary هنا
    ],

    images: {
        remotePatterns: [
            { protocol: "https", hostname: "picsum.photos" },
            { protocol: "https", hostname: "images.unsplash.com" },
            // ✅ بيسمح لـ Next.js Image بتحميل صور Cloudinary
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
        ],
    },
};

export default nextConfig;
