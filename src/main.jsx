import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Login from './Pages/Login.jsx'
import App from './App.jsx'
import Dashboard from './Pages/Dashboard.jsx'
import Unauthorized from './Pages/Unauthorized.jsx'
import Article from './Pages/Article.jsx'
import BlogEditor from './Pages/BlogEditor.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {index: true, element: <Login />},
      {path: 'dashboard', element: <Dashboard />},
      {path: 'unauthorized', element: <Unauthorized />},
      {path: 'article/:articleId', element: <Article />},
      {path: 'editor', element: <BlogEditor />},
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
