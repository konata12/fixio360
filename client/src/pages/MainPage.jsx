import React, { useEffect, useState } from 'react'
import { PostItem } from '../components/PostItem'
import { PageBtn } from '../components/pagination/PageBtn'
import PopularPosts from '../components/PopularPosts'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPosts } from '../redux/fetures/post/postSlice'
import { useLocation, useNavigate } from 'react-router-dom'

export const MainPage = () => {
    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // RETURNS: NULL, NaN, NUMBER
    const [currentPage, setCurrentPage] = useState(
        (new URLSearchParams(location.search).get('page')) === null ?
            null :
            +(new URLSearchParams(location.search).get('page'))
    )
    const { posts, popularPosts, postsNum } = useSelector(state => state.post)
    const fetching = useSelector(state => state.post?.loading)
    const pagesNum = Math.ceil(postsNum / 10)
    console.log(posts)

    const prevPage = (pageNum) => {
        if (Number.isNaN(pageNum)) return
        if (pageNum === null) pageNum = 1

        if (pageNum > 1) {
            navigate(`/?page=${pageNum - 1}`)
            setCurrentPage(pageNum - 1)
        }
    }

    const nextPage = (pageNum) => {
        if (Number.isNaN(pageNum)) return
        if (pageNum === null) pageNum = 1

        if (pageNum < pagesNum) {
            navigate(`/?page=${pageNum + 1}`)
            setCurrentPage(pageNum + 1)
        }
    }

    const firstPage = (pageNum) => {
        navigate(`/?page=1`)
        setCurrentPage(1)
    }

    const renderPagination = (pageNum) => {
        if (Number.isNaN(pageNum)) return (
            <div className="text-xl text-center text-white py-10">
                There are no posts
            </div>
        )
        if (pageNum === null) pageNum = 1

        if (pageNum < 4) {
            const buttons = []
            for (let i = pageNum + 1; i < pagesNum && i < (pageNum + 5); i++) {
                buttons.push(<PageBtn key={+i} page={i} />)
            }

            return <div className='flex gap-4 items-end'>
                {buttons}
                <span className='inline-block text-3xl'>
                    ...
                </span>
            </div>
        } else if (pageNum > pagesNum - 4) {
            const buttons = []
            for (let i = pagesNum - 4; i < pagesNum && i > (pagesNum - 5); i++) {
                buttons.push(<PageBtn key={+i} page={i} />)
            }

            return <div className='flex gap-4 items-end'>
                <span className='inline-block text-3xl'>
                    ...
                </span>
                {buttons}
            </div>
        } else if (pageNum >= 4 || pageNum <= pagesNum - 4) {
            const buttons = []
            for (let i = pageNum - 2; i < pageNum + 3; i++) {
                buttons.push(<PageBtn key={+i} page={i} />)
            }

            return <div className='flex gap-4 items-end'>
                <span className='inline-block text-3xl'>
                    ...
                </span>
                {buttons}
                <span className='inline-block text-3xl'>
                    ...
                </span>
            </div>
        }
    }

    useEffect(() => {
        dispatch(getAllPosts({ currentPage, pagesNum }))
    }, [dispatch, currentPage, pagesNum])

    if (fetching) {
        return (
            <div className="text-xl text-center text-white py-10">
                Loading...
            </div>
        )
    }

    if (!postsNum) {
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

                    <div className='flex w-full justify-center text-white gap-4'>
                        <button
                            className='text-3xl'
                            onClick={() => prevPage(currentPage)}
                        >
                            {'<'}
                        </button>
                        <button
                            className='text-3xl'
                            onClick={firstPage}
                        >
                            {1}
                        </button>

                        {
                            renderPagination(currentPage)
                        }

                        <button className='text-3xl'>
                            {pagesNum}
                        </button>
                        <button
                            className='text-3xl'
                            onClick={() => nextPage(currentPage)}
                        >
                            {'>'}
                        </button>
                    </div>
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
