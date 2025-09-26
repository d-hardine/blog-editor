import axios from "axios"
import { useEffect, useState, Fragment } from "react"
import { useNavigate, useOutletContext, Link } from "react-router"
import { formatDate } from "date-fns"
import './Dashboard.css'
import PageTitle from "../Components/PageTitle"

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
        <>
            {user && (
                <>
                    <PageTitle title={`${user.username}'s Dashboard | Hardine Blog for Writer/Editor`}/>
                    <main className="dashboard-main">
                        <h1>Hello {user.firstName}!</h1>
                        <div className="article-container">
                            <div><b>Title</b></div>
                            <div><b>created at</b></div>
                            <div><b>updated at</b></div>
                            <div><b>is published</b></div>
                            {articles.map(article => (
                                <Fragment key={article.id}>
                                    <Link to={`/article/${article.id}`}>{article.title}</Link>
                                    <div>{formatDate(article.createdAt, 'dd MMM yyyy, HH:mm')}</div>
                                    <div>{formatDate(article.updatedAt, 'dd MMM yyyy, HH:mm')}</div>
                                    <div>{`${article.published}`}</div>
                                </Fragment>
                            ))}
                        </div>
                        <br />
                        <Link to="/editor"><button>Create New Article</button></Link>
                    </main>
                </>
            )}
        </>
    )
}