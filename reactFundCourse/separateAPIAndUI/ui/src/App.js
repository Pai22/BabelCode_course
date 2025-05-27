import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'

import configureStore from 'store/configureStore'
import Layout from './modules/ui/components/Layout'

const store = configureStore()

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout></Layout>
      </Router>
    </Provider>
  )
}
