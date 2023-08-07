import React, { useEffect } from 'react'
import { PostItem } from '../components/PostItem'
import PopularPosts from '../components/PopularPosts'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPosts } from '../redux/fetures/post/postSlice'

export const MainPage = () => {

    const dispatch = useDispatch()
    const { posts, popularPosts } = useSelector(state => state.post)

    useEffect(() => {
        dispatch(getAllPosts)
    }, [dispatch])

    if (!posts.lenght) {
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
                        posts?.map((post, i) => (
                            <PostItem key={i} post={post} />
                        ))
                    }
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
