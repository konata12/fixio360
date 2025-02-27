import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { checkIsAuth, loginUser } from '../redux/fetures/auth/authSlice'

export const LoginPage = () => {

    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')

    const {status} = useSelector(state => state.auth)
    const isAuth = useSelector(checkIsAuth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (status) toast(status)
        if (isAuth) navigate('/')
    }, [status, isAuth, navigate])

    const handleSubmit = () => {
        try {
            dispatch(loginUser({ userName, password }))
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <form onSubmit={e => e.preventDefault()}
            className='w-1/4 h-60 mx-auto mt-40'
        >
            <h1 className='text-lg text-white text-center'>Authorization</h1>
            <label className="text-xs text-gray-400">
                Username:
                <input 
                    type='text'
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    placeholder='Username'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>

            <label className="text-xs text-gray-400">
                Password:
                <input 
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder='Password'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>

            <div className="flex gap-8 justify-center mt-4">
                <button
                    type='submit'
                    onClick={handleSubmit}
                    className='flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4'
                >
                    Enter
                </button>

                <Link
                    to={'/register'}
                    className='flex justify-center items-center text-xs text-white'
                >
                    No account? 
                </Link>
            </div>
        </form>
    )
}