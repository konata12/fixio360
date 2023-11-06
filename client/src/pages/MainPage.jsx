import React from 'react'
import PopularPosts from '../components/PopularPosts'
import { useSelector } from 'react-redux'
import { Pagination } from '../components/pagination/Pagination'

export const MainPage = () => {
    const { loading, popularPosts } = useSelector(state => state.post)

    // if (loading) {
    //     return (
    //         <div className="text-xl text-center text-white py-10">
    //             Loading...
    //         </div>
    //     )
    // }

    return (
        <div className='max-w-[900px] mx-auto py-10'>
            <div className="flex justify-between gap-8">
                <Pagination
                    request={'getAllPosts'}
                />
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