/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    dirs: ['.'],
    ignoreDuringBuilds: true,
  },
  redirects() {
    return [
      // {
      //   source: '/',
      //   destination: '/leaves',
      //   permanent: true,
      // },
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
      },
    ],
  },
};

export default nextConfig;

// ถ้าเป็น true permanent เป็น path ถาวร แปลว่าวิ่งมาที่ ("/") เมื่อไหร่ปุปมันจะวิ่งไปที่ ("/leaves") ทันทีแบบถาวร
// ถ้าเป็น false แปลว่า temporary แปลว่าเปลี่ยน path แค่ชั่วคราว
