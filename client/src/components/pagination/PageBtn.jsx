import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setPage } from '../../redux/fetures/post/postSlice'

export function PageBtn({ page, filter, pagesNum }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const clickHandler = () => {
        navigate(`/?page=${page}${filter}`)
    }
    
    const firstPage = () => {
        dispatch(setPage(1))
    }

    const lastPage = () => {
        dispatch(setPage(pagesNum))
    }
    
    return (<>
            {page === 1 &&
                <button
                className='flex justify-center items-center text-white text-3xl'
                onClick={firstPage}
            >
                {page}
            </button>
            }
            {(page > 1 && page < pagesNum) &&
                <button
                className='flex justify-center items-center text-white text-3xl'
                onClick={clickHandler}
            >
                {page}
            </button>
            }
            {page === pagesNum &&
                <button
                className='flex justify-center items-center text-white text-3xl'
                onClick={lastPage}
            >
                {page}
            </button>
            }
        </>
        // <button
        //     className='flex justify-center items-center text-white text-3xl'
        //     onClick={clickHandler}
        // >
        //     {page}
        // </button>
    )
}
