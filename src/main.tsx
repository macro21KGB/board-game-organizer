import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './global.css'
import { ThemeProvider } from 'styled-components'

const theme = {
  green: '#2A9D8F',
  backgroundColor: '#101F3D',
  backgroundCardColor: '#263E6F',
  backgroundFabColor: '#E9C46A',
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
