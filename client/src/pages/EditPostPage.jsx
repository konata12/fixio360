import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { editPost } from '../redux/fetures/post/postSlice'
import Axios from '../utils/axios.js'

export const EditPostPage = () => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [newImage, setNewImage] = useState('')
    const [oldImage, setOldImage] = useState('')
    const params = useParams()
    const id = params.id

    // const { status } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const fetchPost = useCallback(async () => {
        const { data } = await Axios.get(`/posts/${params.id}`)
        setTitle(data.title)
        setText(data.text)
        setOldImage(data.imgUrl)
    }, [params.id])

    const submitHandler = () => {
        try {
            const params = new FormData()
            params.append('title', title)
            params.append('text', text)
            params.append('image', newImage)

            dispatch(editPost({ params, id }))
            navigate('/')
        } catch (err) {
            console.log(err)
        }
    }

    const clearFormHandler = () => {
        setText('')
        setTitle('')
    }

    useEffect(() => {
        fetchPost()
    }, [fetchPost])

    return (
        <form
            className='w-1/3 mx-auto py-10'
            onSubmit={e => e.preventDefault()}
        >
            <label
                className='text-gray-300 py-2 bg-gray-600 text-xs mt-2 flex items-center justify-center border-2 border-dotted cursor-pointer'
            >
                Прикріпити зображення:
                <input
                    type="file"
                    className='hidden'
                    onChange={(e) => {
                        setNewImage(e.target.files[0])
                        setOldImage('')
                    }}
                />
            </label>
            <div className='flex object-cover py-2'>
                {oldImage && (
                    <img src={`http://localhost:3002/${oldImage}`} alt={oldImage.name} />
                )}

                {newImage && (
                    <img src={URL.createObjectURL(newImage)} alt={newImage.name} />
                )}
            </div>

            <label
                className="text-xs text-white opacity-70"
            >
                Назва посту:
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Title'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>

            <label
                className="text-xs text-white opacity-70"
            >
                Текст посту:
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder='Main text'
                    className='mt-1 text-black w-full rounded-lg bg-red-400 border py-1 px-2 text-xs outline-none resize-none h-40 placeholder:text-gray-700'
                ></textarea>
            </label>

            <div className="flex gap-8 items-center justify-center mt-4">
                <button
                    className="flex items-center justify-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4"
                    onClick={submitHandler}
                >
                    Редагувати пост
                </button>

                <button
                    className="flex items-center justify-center bg-red-500 text-xs text-white rounded-sm py-2 px-4"
                    onClick={clearFormHandler}
                >
                    Відмінити
                </button>
            </div>
        </form>
    )
}
