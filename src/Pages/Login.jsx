import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, useOutletContext } from "react-router"
import PageTitle from "../Components/PageTitle"

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8100'

  const [headerUsername, setHeaderUsername] = useOutletContext()

  const fetchAuth = async () => {
    const token = localStorage.getItem('jwtToken')
    if(token) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if(response.status === 200) {
          setHeaderUsername(response.data.username)
          navigate('/dashboard')
        }
      } catch (error) {
          localStorage.clear()
          navigate('/')
      }
    }
  }

  useEffect(() => {
    fetchAuth()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    const loginAttemptUser = {
      username,
      password,
    }
    const response = await axios.post(`${API_BASE_URL}/api/editor-login`, loginAttemptUser)
    if(response.status === 200) {
      localStorage.setItem("jwtToken", response.data.token)
      setHeaderUsername(response.data.username)
      navigate('/dashboard')
    }
  }

  return (
    <>
      <PageTitle title="Hardine Blog for Writer/Editor"/>
      <main>
        <form action="/signup" method="post" onSubmit={handleLogin} className="login-form">
          <h1>Login your account</h1>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" placeholder="bruce-wayne" type="text" onChange={(e) => setUsername(e.target.value)} required />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required onChange={(e) => setPassword(e.target.value)}/>
          <button type="submit">Login</button>
         </form>
      </main>
    </>
  )
}