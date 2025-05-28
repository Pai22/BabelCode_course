import { createStore, applyMiddleware } from 'redux'

import rootReducer from 'modules/reducers'

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState)

  return store
}
