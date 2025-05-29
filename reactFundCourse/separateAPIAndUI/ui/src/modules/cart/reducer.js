import { ADD_TO_CART, REMOVE_FROM_CART } from './action'
import { LOAD_PRODUCTS_SUCCESS } from 'modules/products/actions'

const initialState = {
  price: 0,
  productIds: []
}

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CART: {
      const { productId } = action.payload

      if (state.productIds.includes(productId)) return state

      return {
        ...state,
        productIds: [...state.productIds, productId]
      }
    }
    case REMOVE_FROM_CART:
      return {
        ...state,
        productIds: state.productIds.filter(
          (id) => id !== action.payload.productId
        )
      }
    case LOAD_PRODUCTS_SUCCESS: {
      let price = 0
      const cartProductIds = state.productIds

      for (let product of action.payload.products) {
        if (cartProductIds.includes(product.id)) {
          price += product.price
        }
      }

      return { ...state, price }
    }

    default:
      return state
  }
}
