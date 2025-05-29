import { configureStore } from '@reduxjs/toolkit'

import rootReducer from 'modules/reducers'

export default function Store(initialState) {
  const store = configureStore({ reducer: rootReducer, initialState })

  return store
}
