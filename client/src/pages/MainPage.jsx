import React, { useEffect } from 'react'
import { PostItem } from '../components/PostItem'
import PopularPosts from '../components/PopularPosts'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPosts } from '../redux/fetures/post/postSlice'
import { useLocation } from 'react-router-dom'
import Pagination from '../components/pagination/Pagination'

export const MainPage = () => {
    const location = useLocation()
    const dispatch = useDispatch()

    const { posts, popularPosts, page, postsNum, loading } = useSelector(state => state.post)
    const pagesNum = Math.ceil(postsNum / 10)

    console.log(page)

    const currentPage = (new URLSearchParams(location.search).get('page')) === page ?
        page :
        (new URLSearchParams(location.search).get('page'))

    console.log(currentPage)

    useEffect(() => {
        dispatch(getAllPosts({ currentPage }))
    }, [dispatch, currentPage])

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
                        <div className="text-xl text-center text-white py-10">
                            There are no posts
                        </div>
                    ) : (
                        <div className="flex flex-col gap-10 basis-4/5">
                            {
                                posts?.map((userPosts, i) => {
                                    return userPosts.posts?.map(post => {
                                        i++
                                        return <PostItem key={i} post={post} avatar={userPosts.avatarUrl} />
                                    })
                                })
                            }

                            <Pagination page={currentPage} pagesNum={pagesNum} loading={loading} posts={posts} />
                        </div>
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
