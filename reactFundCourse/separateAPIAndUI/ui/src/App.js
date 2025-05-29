import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'

import ConfigureStore from 'store/configureStore'
import Layout from './modules/ui/components/Layout'

const store = ConfigureStore()

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout></Layout>
      </Router>
    </Provider>
  )
}
