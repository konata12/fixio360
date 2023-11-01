import React, { useEffect } from 'react'
import { getMyPosts } from '../redux/fetures/post/postSlice.js'
import { useDispatch, useSelector } from 'react-redux'
import { Pagination } from '../components/pagination/Pagination.jsx'
import { useLocation } from 'react-router-dom'

export const PostsPage = () => {
    const location = useLocation()
    const dispatch = useDispatch()

    const { posts, page, loading } = useSelector(state => state.post)

    const currentPage = (new URLSearchParams(location.search).get('page')) === page ?
        page :
        (new URLSearchParams(location.search).get('page'))

    const filter = (new URLSearchParams(location.search).get('filter')) === null ?
        '' :
        (new URLSearchParams(location.search).get('filter'))

    useEffect(() => {
        dispatch(getMyPosts({ currentPage, filter }))
    }, [dispatch, currentPage, filter])

    if (loading) {
        return <div className="text-xl text-center text-white py-10">
            Loading...
        </div>
    }

    return (
        <div className='w-2/3 mx-auto py-10 flex flex-col gap-10'>
            <Pagination
                page={currentPage}
                filter={filter}
                posts={posts}
                path={location.pathname}
            />
        </div>
    )
}
