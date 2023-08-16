import React, { useCallback, useEffect, useState } from 'react'
import { AiFillEye, AiOutlineMessage, AiTwotoneEdit, AiFillDelete } from 'react-icons/ai'
import Moment from 'react-moment'
import Axios from '../utils/axios.js'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { createComment, getAllComments } from '../redux/fetures/comment/commentSlice'
import { CommentItem } from '../components/CommentItem.jsx'

export const PostPage = () => {
    const [post, setPost] = useState(null)
    const [comment, setComment] = useState('')

    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth.user)
    const comments = useSelector(state => state.comment.comments)

    const fetchPost = useCallback(async () => {
        try {
            const { data } = await Axios.get(`/posts/${params.id}`)
        setPost(data)
        } catch (err) {
            console.log(err)
        }
        
    }, [params.id])

    const fetchComments = useCallback(async () => {
        try {
            dispatch(getAllComments(params.id))
        } catch (err) {
            console.log(err)
        }
    }, [dispatch, params.id])

    const deletePost = async () => {
        await Axios.delete(`/posts/${params.id}`)
        navigate('/')
    }

    const handleSubmit = async () => {
        dispatch(createComment({
            comment,
            postId: params.id
        }))
    }

    useEffect(() => {
        fetchPost()
    }, [fetchPost])

    useEffect(() => {
        fetchComments()
    }, [fetchComments])

    if (!post) {
        return (
            <div className="text-xl text-center text-white py-10">
                Loading...
            </div>
        )
    }

    return (
        <div>
            <button className='flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4'>
                <Link
                    className='flex'
                    to={'/'}
                >
                    Back
                </Link>
            </button>

            <div className="flex gap-10 py-8">
                <div className="w-2/3">
                    <div className="flex flex-col basis-1/4 flex-grow">
                        {/* IMAGE */}
                        <div
                            className={
                                post?.imgUrl ? 'flex rounded-sm h-80' : 'flex rounded-sm'
                            }
                        >
                            {post?.imgUrl && (
                                <img
                                    src={`http://localhost:3002/post/${post?.imgUrl}`}
                                    alt="img"
                                    className='object-cover w-full'
                                />
                            )}
                        </div>
                        {/* INFO */}
                        <div className='flex justify-between items-center pt-2'>
                            <div className='text-xs text-white opacity-50'>
                                {post?.userName}
                            </div>
                            <div className='text-xs text-white opacity-50'>
                                <Moment date={post?.createdAt} format='D MMM YYYY' />
                            </div>
                        </div>

                        <div className="text-white text-xl">
                            {post?.title}
                        </div>

                        <p className='text-white opacity-60 text-xs pt-4'>
                            {post?.text}
                        </p>

                        <div className="flex gap-3 items-center mt-2 justify-between">
                            <div className="flex gap-3 mt-4">
                                <button className='flex items-center justify-center gap-2 text-xs text-white opacity-50'>
                                    <AiFillEye /> <span>{post?.views}</span>
                                </button>
                                <button className='flex items-center justify-center gap-2 text-xs text-white opacity-50'>
                                    <AiOutlineMessage /> <span>{post?.comments?.lenght || 0}</span>
                                </button>
                            </div>

                            {user?._id === post.author && (
                                <div className="flex gap-3 mt-4">
                                    <button className='flex items-center justify-center gap-2 text-xs text-white opacity-50'>
                                        <Link
                                            className='flex'
                                            to={`/${params.id}/edit`}
                                        >
                                            <AiTwotoneEdit />
                                        </Link>
                                    </button>
                                    <button
                                        className='flex items-center justify-center gap-2 text-xs text-white opacity-50'
                                        onClick={deletePost}
                                    >
                                        <AiFillDelete />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='w-1/3 p-8 bg-gray-700 flex flex-col gap-2 rounded-sm'>
                    <form
                        className='flex gap-2'
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            type='text'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder='Comment'
                            className='text-black w-full rounded-sm bg-gray-400 border p-2 text-xs outline-none placeholder:text-gray-700'
                        />
                        <button
                            type='submit'
                            onClick={handleSubmit}
                            className='flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4'
                        >
                            Отправить
                        </button>
                    </form>

                    {comments?.map((cmt) => (
                        <CommentItem key={cmt._id} cmt={cmt} />
                    ))}
                </div>
            </div>
        </div>
    )
}
