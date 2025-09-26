import { useEffect, useState } from "react"
import { useOutletContext, useNavigate, useParams } from "react-router"
import axios from "axios"
import PageTitle from "../Components/PageTitle"
import './Article.css'
import { formatDate } from "date-fns"
import parse from 'html-react-parser'

export default function Article() {
    const [user, setUser] = useState()
    const [article, setArticle] = useState()

    const [headerUsername, setHeaderUsername] = useOutletContext()

    const navigate = useNavigate()
    const pageParams = useParams()
    const parser = new DOMParser()

    async function fetchAuth() {
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

    async function fetchArticle() {
        const response = await axios.get(`/api/getArticle/${pageParams.articleId}`)
        setArticle(response.data)
    }

    useEffect(() => {
        fetchAuth()
        fetchArticle()
    }, [])

    const handleEdit = () => {
        console.log('artikel e diedit coeg')
    }

    return (
        <>
            <PageTitle title={`Article Page`}/>
            <main>
                {(user && article) && (
                    <>
                        <div className="single-article-container">
                            <div className="article-title">{article.title}</div>
                            <div className="article-author-and-date">
                                by {user.firstName} {user.lastName} on {formatDate(article.createdAt, 'dd MMM yyyy, HH:mm')} {article.updatedAt !== article.createdAt && `(updated at ${formatDate(article.updatedAt, 'dd MMM yyyy, HH:mm')})`}
                            </div>
                            <br />
                            <div>{parse(article.body)}</div>
                            <br />
                        </div>
                        <button onClick={handleEdit}>Edit Article</button>
                        <button>Delete Article</button>
                    </>
                )}
            </main>
        </>
    )
}