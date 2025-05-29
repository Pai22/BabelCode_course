import { applyMiddleware } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { thunk as reduxThunk } from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import rootReducer from 'modules/reducers'

export default function Store(initialState) {
  const middleware = [reduxThunk]
  const store = configureStore({
    reducer: rootReducer,
    middleware: composeWithDevTools(applyMiddleware(...middleware)),
    initialState
  })

  return store
}
