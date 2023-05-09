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
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

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

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
