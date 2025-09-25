import axios from "axios"
import { useEffect } from "react"
import { useNavigate } from "react-router"

export default function Dashboard() {
    const navigate = useNavigate()

    async function fetchAuth() {
        const token = localStorage.getItem('jwtToken')
        if(token) {
            try {
                const response = await axios.get('/api/auth', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if(response.status === 200) {
                    if(response.data.role !== 'ADMIN') {
                        localStorage.clear()
                        navigate('/unauthorized')
                    }
                }
            } catch(error) {
                localStorage.clear()
                navigate('/')
            }
        } else {
            navigate('/')
        }
    }

    useEffect(() => {
        fetchAuth()
    }, [])

    return (
        <div>This is protected route</div>
    )
}