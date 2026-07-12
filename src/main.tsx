import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './app/globals.css'
import { Toaster } from 'react-hot-toast'

import { Provider } from 'react-redux'
import { store } from './store/store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <App />
        <Toaster position="top-right" />
      </AuthProvider>
    </Provider>
  </React.StrictMode>
)
