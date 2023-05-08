import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './routes/App.tsx'
import './global.css'
import { ThemeProvider } from 'styled-components'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import AddGameRoute from './routes/AddGame.tsx'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = {
  green: '#2A9D8F',
  backgroundColor: '#101F3D',
  backgroundCardColor: '#263E6F',
  backgroundFabColor: '#E9C46A',
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/add",
    element: <AddGameRoute />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
)
