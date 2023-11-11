import React from 'react'
import { Pagination } from '../components/pagination/Pagination.jsx'

export const PostsPage = () => {

    return (
        <div className='w-2/3 mx-auto py-10 flex flex-col gap-10'>
            <Pagination
                request={'getMyPosts'}
            />
        </div>
    )
}
