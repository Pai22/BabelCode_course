import { combineReducers } from 'redux'

import ui from './ui/reducer'
import products from './products/reducer'
import cart from './cart/reducer'

export default combineReducers({
  ui,
  products,
  cart
})
