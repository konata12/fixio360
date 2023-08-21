import React, { useEffect, useState } from 'react'
import { PostItem } from '../components/PostItem'
import PopularPosts from '../components/PopularPosts'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPosts, setPage } from '../redux/fetures/post/postSlice'
import { useLocation, useNavigate } from 'react-router-dom'
import Pagination from '../components/pagination/Pagination'

export const MainPage = () => {
    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { posts, popularPosts, page, postsNum, loading } = useSelector(state => state.post)
    const pagesNum = Math.ceil(postsNum / 10)

    useEffect(() => {
        dispatch(getAllPosts({ page }))
    }, [dispatch, page])

    if (loading) {
        return (
            <div className="text-xl text-center text-white py-10">
                Loading...
            </div>
        )
    }

    if (!posts) {
        return (
            <div className="text-xl text-center text-white py-10">
                There are no posts
            </div>
        )
    }

    return (
        <div className='max-w-[900px] mx-auto py-10'>
            <div className="flex justify-between gap-8">
                <div className="flex flex-col gap-10 basis-4/5">
                    {
                        posts?.map((userPosts, i) => {
                            return userPosts.posts?.map(post => {
                                i++
                                return <PostItem key={i} post={post} avatar={userPosts.avatarUrl} />
                            })
                        })
                    }
                    {console.log(11111)}
                    <Pagination page={page} pagesNum={pagesNum} loading={loading} />

                </div>
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
