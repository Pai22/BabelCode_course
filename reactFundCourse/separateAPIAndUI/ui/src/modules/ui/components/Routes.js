import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import ProductRoutes from 'modules/products/components/Routes'
import CartRoutes from 'modules/cart/components/Routes'

export default function ContentsRoutes() {
  // ❌ ใช้ชื่อ Routes() เป็นฟังก์ชันแบบนี้จะชนกับ Routes ที่ import มาด้านบน

  return (
    <Routes>
      {/* ใช้ `*` เพราะมี Route ซ้อนกัน */}
      <Route path="/products/*" element={<ProductRoutes />} />
      <Route path="/cart/*" element={<CartRoutes />} />
      {/* Redirect หน้าแรก */}
      <Route exact path="/" element={<Navigate to="/products" />} />
      {/* 404 Page Not Found */}
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  )
}
