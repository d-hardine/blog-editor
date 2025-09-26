import { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate, useOutletContext } from 'react-router';
import axios from 'axios';

export default function App() {
  const [user, setUser] = useState()
  const [editorTitle, setEditorTitle] = useState('')
  const [categoryId, setCategoryId] = useState(4)

  const [headerUsername, setHeaderUsername] = useOutletContext()

  const navigate = useNavigate()

  //TinyMCE stuff
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorTitle)
      console.log(editorRef.current.getContent());
    }
  };

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
        console.error(error)
        localStorage.clear()
        navigate('/')
      }
    } else {
        navigate('/')
    }
  }

  useEffect(() => {
    fetchAuth()
  },[])

  const handleCreateArticle = async () => {
    const response = await axios.post('/api/create-article', {
      editorTitle,
      categoryId,
      editorBody: editorRef.current.getContent()
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
      }
    })
    console.log(response)
    if(response.status === 200)
      navigate('/')
  }

  return (
    <main>
      <div>Title</div>
      <input type="text" className='editor-title' onChange={(e) => setEditorTitle(e.target.value)} />
      <br />
      <br />
      <label htmlFor="select-category">Category</label><br />
      <select name="select-category" id="editor-select-category" onChange={(e) => setCategoryId(e.target.value)}>
        <option value={4}>Smartphone</option>
        <option value={5}>Computer</option>
        <option value={6}>Tablet</option>
      </select>
      <br />
      <br />
      <div>Body Article</div>
      <Editor
        apiKey= {import.meta.env.VITE_TINYMCE_API_KEY}
        onInit={ (_evt, editor) => editorRef.current = editor }
        initialValue="test"
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
      <button onClick={handleCreateArticle}>CREATE ARTICLE</button>
    </main>
  );
}