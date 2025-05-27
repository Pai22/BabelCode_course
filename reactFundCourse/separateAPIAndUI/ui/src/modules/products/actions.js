import axios from 'axios'

const LOAD_PRODUCES_REQUEST = 'app/products/LOAD_PRODUCES_REQUEST' // เป็นตัวบอกว่าตอนนี้เรากำลังโหลดข้อมูลจาก server
const LOAD_PRODUCES_SUCCESS = 'app/products/LOAD_PRODUCES_SUCCESS' // เป็นตัวบอกว่าข้อมูลจาก server มาแล้วและทำการโหลดสำเร็จ
const LOAD_PRODUCES_FAILURE = 'app/products/LOAD_PRODUCES_FAILURE' // เป็นตัวบอกว่าข้อมูลจาก server ไม่สำเร็จ

function loadProducts() {
  return async (dispatch) => {
    dispatch({ type: LOAD_PRODUCES_REQUEST })

    try {
      const { data } = await axios.get('/products')

      dispatch({
        type: LOAD_PRODUCES_SUCCESS,
        payload: {
          products: data
        }
      })
    } catch (err) {
      dispatch({ type: LOAD_PRODUCES_FAILURE })
    }
  }
}
export {
  LOAD_PRODUCES_REQUEST,
  LOAD_PRODUCES_SUCCESS,
  LOAD_PRODUCES_FAILURE,
  loadProducts
}
