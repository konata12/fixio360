import React from 'react'
import { useNavigate } from 'react-router-dom'

export function PageBtn({ page, filter }) {
    const navigate = useNavigate()

    const numberHandler = () => {
        navigate(`/?page=${page}${filter}`)
    }
    
    return (
        <button
            className='flex justify-center items-center text-white text-3xl'
            onClick={numberHandler}
        >
            {page}
        </button>
    )
}
