import React from 'react'
import { useNavigate } from 'react-router-dom'

export function PageBtn({ page }) {
    const navigate = useNavigate()

    const clickHandler = () => {
        navigate(`/?page=${page}`)
    }
    return (
        <button
            className='flex justify-center items-center text-white text-3xl'
            onClick={clickHandler}
        >
            {page}
        </button>
    )
}
