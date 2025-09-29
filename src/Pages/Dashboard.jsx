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

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8100'

    const [headerUsername, setHeaderUsername] = useOutletContext()

    async function fetchAuthAndArticles() {
        const token = localStorage.getItem('jwtToken')
        if(token) {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/editor-auth`, {
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
                        const articles = await axios.get(`${API_BASE_URL}/api/get-articles/${response.data.id}`) //get articles for specific account
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

    const handlePublishing =  async (articleId, publishBool) => {
        await axios.put(`${API_BASE_URL}/api/update-publish`, {articleId, publishBool}) //update the published bool
        const articles = await axios.get(`${API_BASE_URL}/api/get-articles/${user.id}`) //get articles for specific account
        setArticles(articles.data)
    }

    const handleDeleteArticle = async (articleId) => {
        await axios.delete(`${API_BASE_URL}api/delete-article`, {data: {articleId}}) //delete the specific article
        const articles = await axios.get(`${API_BASE_URL}/api/get-articles/${user.id}`) //get articles for specific account
        setArticles(articles.data)
    }

    return (
        <>
            {user && (
                <>
                    <PageTitle title={`${user.username}'s Dashboard | Hardine Blog for Writer/Editor`}/>
                    <main className="dashboard-main">
                        <h1>This is all of your articles {user.firstName}!</h1>
                        <div className="article-container">
                            <div><b>Title</b></div>
                            <div><b>Category</b></div>
                            <div><b>Created</b></div>
                            <div><b>Updated</b></div>
                            <div><b>Published</b></div>
                            <div><b>Action</b></div>
                            {articles.map(article => (
                                <Fragment key={article.id}>
                                    <Link to={`/article/${article.id}`}>{article.title}</Link>
                                    <div>{article.categories[0].name}</div>
                                    <div>{formatDate(article.createdAt, 'dd MMM yyyy, HH:mm')}</div>
                                    <div>{formatDate(article.updatedAt, 'dd MMM yyyy, HH:mm')}</div>
                                    <div onClick={() => handlePublishing(article.id, article.published)}>{`${article.published}`}</div>
                                    <button onClick={() => handleDeleteArticle(article.id)}>DELETE</button>
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