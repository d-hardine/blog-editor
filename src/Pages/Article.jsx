import { useEffect, useState, useRef } from "react"
import { useOutletContext, useNavigate, useParams } from "react-router"
import axios from "axios"
import { Editor } from '@tinymce/tinymce-react';
import PageTitle from "../Components/PageTitle"
import './Article.css'
import { formatDate } from "date-fns"
import parse from 'html-react-parser'

export default function Article() {
    const [user, setUser] = useState()
    const [article, setArticle] = useState()
    const [isEditMode, setIsEditMode] = useState(false)

    //TinyMCE stuff
    const [editorTitle, setEditorTitle] = useState('')
    const [categoryId, setCategoryId] = useState('4')

    const [headerUsername, setHeaderUsername] = useOutletContext()

    //TinyMCE stuff
    const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
            console.log(editorTitle)
            console.log(editorRef.current.getContent());
        }
    };

    const navigate = useNavigate()
    const pageParams = useParams()

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

    const handleEditMode = () => {
        setIsEditMode(!isEditMode)
    }

    const handleEditArticle = async () => {
        const response = await axios.put(`/api/update-article/${pageParams.articleId}`, {
            editorTitle,
            categoryId,
            editorBody: editorRef.current.getContent()
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
        console.log(response.data)
        if(response.status === 200) {
            const response = await axios.get(`/api/getArticle/${pageParams.articleId}`)
            setArticle(response.data)
            setIsEditMode(false)
        }
    }

    return (
        <>
            <PageTitle title={`Article Page`}/>
            <main>
                {(user && article) && (
                    <>
                        {!isEditMode ?
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
                                <button onClick={handleEditMode}>Edit Article</button>
                                <button>Delete Article</button>
                            </>
                        :
                            <>
                                <div>Title</div>
                                    <input type="text" className='editor-title' defaultValue={article.title} onChange={(e) => setEditorTitle(e.target.value)} />
                                    <br />
                                    <br />
                                    <label htmlFor="select-category">Category</label><br />
                                    <select name="select-category" id="editor-select-category" defaultValue={article.categories[0].id} onChange={(e) => setCategoryId(Number(e.target.value))}>
                                        <option value="4">Smartphone</option>
                                        <option value="5">Computer</option>
                                        <option value="6">Tablet</option>
                                    </select>
                                    <br />
                                    <br />
                                    <div>Body Article</div>
                                    <Editor
                                        apiKey= {import.meta.env.VITE_TINYMCE_API_KEY}
                                        onInit={ (_evt, editor) => editorRef.current = editor }
                                        initialValue={article.body}
                                        init={{
                                            height: 500,
                                            menubar: false,
                                            plugins: [
                                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                            ],
                                            toolbar: 'undo redo | blocks | ' +
                                                'bold italic underline forecolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'removeformat | help',
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                        }}
                                  />
                                    <button onClick={log}>Log editor content</button>
                                    <button onClick={handleEditArticle}>EDIT ARTICLE</button>
                                    <button onClick={handleEditMode}>Cancel Edit</button>
                            </>
                        }
                    </>
                )}
            </main>
        </>
    )
}