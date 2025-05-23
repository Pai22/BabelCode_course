import React from 'react'
import { Routes, Route } from 'react-router-dom'

import ProductRoutes from 'modules/products/components/Routes'
import CartRoutes from 'modules/cart/components/Routes'

export default function ContentsRoutes() {
  // ❌ ใช้ชื่อ Routes() เป็นฟังก์ชันแบบนี้จะชนกับ Routes ที่ import มาด้านบน

  return (
    <Routes>
      <Route path="/products/*" element={<ProductRoutes />} />
      <Route path="/cart/*" element={<CartRoutes />} />
      {/* ใช้ * เพราะมี Route ซ้อนกัน */}
    </Routes>
  )
}
