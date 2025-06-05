/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['.'],
  },
  redirects() {
    return [
      {
        source: '/',
        destination: '/leaves',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

// ถ้าเป็น true permanent เป็น path ถาวร แปลว่าวิ่งมาที่ ("/") เมื่อไหร่ปุปมันจะวิ่งไปที่ ("/leaves") ทันทีแบบถาวร
// ถ้าเป็น false แปลว่า temporary แปลว่าเปลี่ยน path แค่ชั่วคราว
