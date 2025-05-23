import React from 'react'
import { Routes, Route } from 'react-router-dom'

import ProductList from './ProductList'
import ProductDetails from './ProductDetails'

export default function ProductRoutes() {
  // ❌ ใช้ชื่อ Routes() เป็นฟังก์ชันแบบนี้จะชนกับ Routes ที่ import มาด้านบน

  return (
    <>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path=":id" element={<ProductDetails />} />
      </Routes>
    </>
  )
}
