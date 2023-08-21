import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { PageBtn } from './PageBtn'
import { setPage } from '../../redux/fetures/post/postSlice'

export default function Pagination({ page, pagesNum, loading }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    console.log(page)
    console.log(pagesNum)
    console.log(loading)

    const nextPage = (pageNum) => {
        pageNum++
        navigate(`/?page=${pageNum}`)
        dispatch(setPage(pageNum))
    }

    const prevPage = (pageNum) => {
        pageNum--
        navigate(`/?page=${pageNum}`)
        dispatch(setPage(pageNum))
    }

    // IF LOADING OR THERE AREN'T POSTS THEN DON'T RENDER
    console.log(22222)
    if (loading || !pagesNum) return

    return (
        <div className='flex w-full justify-center text-white gap-4'>
            {console.log(33333)}
            <button
                className='text-3xl'
                onClick={() => prevPage(page)}
            >
                {'<'}
            </button>
            {/* <button
                className='text-3xl'
                onClick={firstPage}
            >
                {1}
            </button>

            {
                renderPagination(currentPage)
            }

            <button
                className='text-3xl'
                onClick={() => lastPage(pagesNum)}
            >
                {pagesNum}
            </button> */}
            <button
                className='text-3xl'
                onClick={() => nextPage(page)}
            >
                {'>'}
            </button>
        </div>
    )
}