import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { PageBtn } from './PageBtn'
import { setPage } from '../../redux/fetures/post/postSlice'

export function PaginationBottom({ page, postsNum, loading, posts, filter }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const pagesNum = Math.ceil(postsNum / 10)
    page = page === null ? null : +page
    filter = '&filter=-' + filter

    const nextPage = (pageNum) => {
        if (Number.isNaN(pageNum)) return
        if (!page) pageNum++
        if (pageNum >= pagesNum || pageNum < 1) return

        pageNum++

        navigate(`/?page=${pageNum}`)
        dispatch(setPage(pageNum))
    }

    const prevPage = (pageNum) => {
        if (Number.isNaN(pageNum)) return
        if (pageNum <= 1 || pageNum > pagesNum) return

        pageNum--

        navigate(`/?page=${pageNum}`)
        dispatch(setPage(pageNum))
    }

    const firstPage = () => {
        navigate(`/?page=${1}`)
        dispatch(setPage(1))
    }

    const lastPage = () => {
        navigate(`/?page=${pagesNum}`)
        dispatch(setPage(pagesNum))
    }

    const renderPagination = (pageNum) => {
        if (pageNum < 4) {
            const buttons = []
            for (let i = 2; i < pagesNum && i < 6; i++) {
                buttons.push(<PageBtn key={+i} page={i} />)
            }

            return <div className='flex gap-4 items-end'>
                {buttons}
                <span className='inline-block text-3xl'>
                    ...
                </span>
            </div>
        } else if (pageNum > pagesNum - 3) {
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

    // IF LOADING OR THERE AREN'T POSTS THEN DON'T RENDER
    if (
        page &&
        (loading ||
            !posts.length ||
            (page > pagesNum || page < 1))
    ) return

    return (
        <div className='flex w-full justify-center text-white gap-4'>
            {console.log(33333)}
            <button
                className='text-3xl'
                onClick={() => prevPage(page)}
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
                renderPagination(page)
            }

            <button
                className='text-3xl'
                onClick={() => lastPage(pagesNum)}
            >
                {pagesNum}
            </button>
            <button
                className='text-3xl'
                onClick={() => nextPage(page)}
            >
                {'>'}
            </button>
        </div>
    )
}