import React, { useEffect, useState } from 'react'
import PopularPosts from '../components/PopularPosts'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPosts } from '../redux/fetures/post/postSlice'
import { useLocation } from 'react-router-dom'
import { Pagination } from '../components/pagination/Pagination'

export const MainPage = () => {
    const [keyword, setKeyword] = useState('')
    const { posts, popularPosts, page, loading } = useSelector(state => state.post)
    const location = useLocation()
    const dispatch = useDispatch()

    const currentPage = (new URLSearchParams(location.search).get('page')) === page ?
        page :
        (new URLSearchParams(location.search).get('page'))

    const filter = (new URLSearchParams(location.search).get('filter')) === null ?
        '' :
        (new URLSearchParams(location.search).get('filter'))

    useEffect(() => {
        dispatch(getAllPosts({ currentPage, filter }))
    }, [dispatch, currentPage, filter])

    if (loading) {
        return (
            <div className="text-xl text-center text-white py-10">
                Loading...
            </div>
        )
    }

    return (
        <div className='max-w-[900px] mx-auto py-10'>
            <div className="flex justify-between gap-8">
                {
                    (!posts?.length) ? (
                        <div className="flex justify-center items-center basis-4/5 text-xl text-center text-white">
                            There are no posts
                        </div>
                    ) : (
                        <Pagination
                            page={currentPage}
                            filter={filter}
                            posts={posts}
                            path={location.pathname}
                        />
                    )
                }
                <div className="basis-1/5">
                    <div className='text-xs uppercase text-white'>
                        POPULAR:
                    </div>

                    {
                        popularPosts?.map((post, index) => (
                            <PopularPosts key={index} post={post} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}