import React from 'react'
import { PostItem } from '../PostItem'
import { PaginationFilter } from './PaginationFilter'
import { PaginationBottom } from './PaginationBottom'

import { useSelector } from 'react-redux'

export function Pagination({ page, posts, filter, path }) {
    const { postsNum, loading } = useSelector(state => state.post)
    filter = filter === '' ? '-createdAt' : filter

    return (
        <div className="flex flex-col gap-10 basis-4/5">
            <PaginationFilter
                page={page}
                filter={filter}
                path={path}
            />

            {
                (typeof posts.length === 'number') ? (
                    posts?.map((userPost, i) => {
                        return <PostItem
                            key={i}
                            post={userPost.post}
                            avatar={userPost.avatarUrl}
                        />
                    })
                ) : (
                    posts?.posts?.map((userPost, i) => {
                        return <PostItem
                            key={i}
                            post={userPost}
                            avatar={posts.avatarUrl}
                        />
                    })
                )
            }

            <PaginationBottom
                page={page}
                postsNum={postsNum}
                loading={loading}
                filter={filter}
                path={path}
            />
        </div>
    )
}
