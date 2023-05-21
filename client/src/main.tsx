import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './routes/Dashboard.tsx'
import './global.css'
import { ThemeProvider } from 'styled-components'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import AddGameRoute from './routes/ManageGame.tsx'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DetailRoute from './routes/DetailsRoute.tsx'
import Controller from './controller.ts'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const theme = {
  green: '#2A9D8F',
  backgroundColor: '#101F3D',
  lighterBackgroundColor: '#394668',
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
    loader: (props) => {
      console.log(props)

      return null;
    }
  },
  {
    path: "/details/:key",
    element: <DetailRoute />,
    loader: ({ params }) => {
      const controller = Controller.getInstance();

      if (!params.key) throw new Error("Key not found")
      try {
        return controller.getGame(params.key)
      } catch (error) {
        return null;
      }
    }
  }
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
