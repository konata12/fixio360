import React, { useEffect } from 'react'
import { getMyPosts } from '../redux/fetures/post/postSlice.js'
import { useDispatch, useSelector } from 'react-redux'
import { Pagination } from '../components/pagination/Pagination.jsx'
import { useLocation } from 'react-router-dom'

export const PostsPage = () => {

    const { loading } = useSelector(state => state.post)

    // if (loading) {
    //     return <div className="text-xl text-center text-white py-10">
    //         Loading...
    //     </div>
    // }

    return (
        <div className='w-2/3 mx-auto py-10 flex flex-col gap-10'>
            <Pagination
                request={'getMyPosts'}
            />
        </div>
    )
}
