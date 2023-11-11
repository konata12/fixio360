import React, { useEffect } from 'react'
import { PostItem } from '../PostItem'
import { PaginationFilter } from './PaginationFilter'
import { PaginationBottom } from './PaginationBottom'

import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

export function Pagination({ request }) {
    const location = useLocation()
    const dispatch = useDispatch()
    const path = location.pathname
    const { postsNum, loading, posts, page } = useSelector(state => state.post)

    const currentPage = (new URLSearchParams(location.search).get('page')) === page ?
        page :
        (new URLSearchParams(location.search).get('page'))
    let filter = (new URLSearchParams(location.search).get('filter')) === null ?
        '' :
        (new URLSearchParams(location.search).get('filter'))
    const keyword = (new URLSearchParams(location.search).get('keyword')) === null ?
        '' :
        (new URLSearchParams(location.search).get('keyword'))

    console.log(currentPage, filter, keyword)

    useEffect(() => {
        import('../../redux/fetures/post/postSlice').then((res) => {
            dispatch(res[request]({ currentPage, filter, keyword }))
        }).catch((err) => {
            console.log(err)
        })
    }, [dispatch, request, currentPage, filter, keyword])

    filter = filter === '' ? '-createdAt' : filter
    console.log(loading)

    if (loading) {
        return (
            <div className="w-auto text-xl text-center text-white py-10 mx-auto">
                Loading...
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-10 basis-4/5">
            <PaginationFilter
                page={page}
                filter={filter}
                path={path}
                keyword={keyword}
            />

            {
                (typeof posts?.length === 'number') ? (
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

            {!loading && <PaginationBottom
                page={page}
                postsNum={postsNum}
                loading={loading}
                filter={filter}
                path={path}
            />}
        </div>
    )
}
