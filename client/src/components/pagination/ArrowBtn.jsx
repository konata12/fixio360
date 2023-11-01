import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setPage } from '../../redux/fetures/post/postSlice'

export function ArrowBtn({ children, page, filter, pagesNum, path }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const nextPage = (pageNum) => {
        if (Number.isNaN(pageNum)) return
        if (!page) pageNum++
        if (pageNum >= pagesNum || pageNum < 1) return

        pageNum++

        navigate(`${path}?page=${pageNum}${filter}`)
        dispatch(setPage(pageNum))
    }

    const prevPage = (pageNum) => {
        if (Number.isNaN(pageNum)) return
        if (pageNum <= 1 || pageNum > pagesNum) return

        pageNum--

        navigate(`${path}?page=${pageNum}${filter}`)
        dispatch(setPage(pageNum))
    }

    const clickHandler = () => {
        children === '<' ? prevPage(page) : nextPage(page)
    }
    
    return (
        <button
            className='flex justify-center items-center text-white text-3xl'
            onClick={clickHandler}
        >
            {children}
        </button>
    )
}
