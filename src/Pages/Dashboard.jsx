import axios from "axios"
import { useEffect, useState, Fragment } from "react"
import { useNavigate, useOutletContext } from "react-router"
import { format, formatDate } from "date-fns"
import './Dashboard.css'

export default function Dashboard() {
    const [user, setUser] = useState()
    const [articles, setArticles] = useState([])

    const navigate = useNavigate()

    const [headerUsername, setHeaderUsername] = useOutletContext()

    async function fetchAuthAndArticles() {
        const token = localStorage.getItem('jwtToken')
        if(token) {
            try {
                const response = await axios.get('/api/editor-auth', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if(response.status === 200) {
                    if(response.data.role !== 'ADMIN') {
                        localStorage.clear()
                        navigate('/unauthorized')
                    } else {
                        setUser(response.data)
                        setHeaderUsername(response.data.username)
                        const articles = await axios.get(`/api/get-articles/${response.data.id}`)
                        setArticles(articles.data)
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
        fetchAuthAndArticles()
    }, [])

    return (
        <main>
            {user && (
                <>
                    <h1>Hello {user.firstName}!</h1>
                    <div className="article-container">
                        <div><b>Title</b></div>
                        <div><b>created at</b></div>
                        <div><b>updated at</b></div>
                        <div><b>is published</b></div>
                        {articles.map(article => (
                            <Fragment key={article.id}>
                                <div>{article.title}</div>
                                <div>{formatDate(article.createdAt, 'dd MMM yyyy, HH:mm')}</div>
                                <div>{formatDate(article.updatedAt, 'dd MMM yyyy, HH:mm')}</div>
                                <div>{`${article.published}`}</div>
                            </Fragment>
                        ))}
                    </div>
                </>
            )}
        </main>
    )
}