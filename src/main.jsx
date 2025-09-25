import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Login from './Pages/Login.jsx'
import App from './App.jsx'
import Dashboard from './Pages/Dashboard.jsx'
import Unauthorized from './Pages/Unauthorized.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {index: true, element: <Login />},
      {path: 'dashboard', element: <Dashboard />},
      {path: 'unauthorized', element: <Unauthorized />},
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
