import React, { useCallback, useEffect, useState } from 'react'
import { AiFillEye, AiOutlineMessage, AiTwotoneEdit, AiFillDelete } from 'react-icons/ai'
import Moment from 'react-moment'
import Axios from '../utils/axios.js'
import { useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
// import { toast } from 'react-toastify'

export const PostPage = () => {
    const [post, setPost] = useState(null)
    const params = useParams()
    const user = useSelector(state => state.auth.user)

    const fetchPost = useCallback(async () => {
        const { data } = await Axios.get(`/posts/${params.id}`)
        setPost(data)
    }, [params.id])

    const deletePost = async () => {
        const { data } = await Axios.delete(`/posts/${params.id}`)
        console.log(data)
    }

    useEffect(() => {
        fetchPost()
    }, [fetchPost])

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
                                    src={`http://localhost:3002/${post?.imgUrl}`}
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
                                        <AiTwotoneEdit />
                                    </button>
                                    <button
                                        className='flex items-center justify-center gap-2 text-xs text-white opacity-50'
                                        onClick={deletePost}
                                    >
                                        <Link
                                            className='flex'
                                            to={'/'}
                                        >
                                            <AiFillDelete />
                                        </Link>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-1/3">COMMENTS</div>
            </div>
        </div>
    )
}
