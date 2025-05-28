import * as uiActions from 'modules/ui/actions'
import * as productActions from 'modules/products/actions'

import axios from 'axios'

const ADD_TO_CART = 'app/cart/ADD_TO_CART'
const REMOVE_FROM_CART = 'app/cart/REMOVE_FROM_CART'
const CHECKOUT_SUCCESS = 'app/cart/CHECKOUT_SUCCESS'

function addToCart(productId) {
  return (dispatch) => {
    dispatch(
      uiActions.setFlashMessage('The product has been added to your cart')
    )
    dispatch({
      type: ADD_TO_CART,
      payload: {
        productId
      }
    })
  }
}

function loadCart() {
  return (dispatch, getState) => {
    const {
      cart: { productIds }
    } = getState()

    if (productIds.length === 0) {
      return dispatch(productActions.clearProducts())
    }

    const query = productIds.map((id) => `id=${id}`).join('&')

    dispatch(productActions.loadProducts(`?${query}`))
  }
}

function removeFromCart(productId) {
  return (dispatch) => {
    dispatch({
      type: REMOVE_FROM_CART,
      payload: {
        productId
      }
    })
    dispatch(loadCart())
  }
}

function checkout(deliveryInfo, navigate) {
  return async (dispatch, getState) => {
    const {
      cart: { productIds, price }
    } = getState()

    const { data } = await axios.post('/order', {
      deliveryInfo,
      productIds,
      price
    })

    dispatch({
      type: CHECKOUT_SUCCESS,
      payload: {
        order: data
      }
    })
    dispatch(
      uiActions.setFlashMessage('Your order has been placed successfully')
    )

    navigate('/')
  }
}

export {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CHECKOUT_SUCCESS,
  addToCart,
  loadCart,
  removeFromCart,
  checkout
}
