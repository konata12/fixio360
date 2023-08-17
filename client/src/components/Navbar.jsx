import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import { checkIsAuth, logout } from '../redux/fetures/auth/authSlice'
import { toast } from 'react-toastify'

export const Navbar = () => {
    const isAuth = useSelector(checkIsAuth)
    const id = useSelector(state => state.auth?.user?._id)
    const dispatch = useDispatch()


    const activeStyles = {
        color: 'white'
    }

    const logoutHandler = () => {
        dispatch(logout())
        window.localStorage.removeItem('token')
        toast('You logged out')
    }

    return (
        <div className='flex py-4 justify-between items-center'>
            <span className='flex justify-center items-center w-6 h-6 bg-gray-600 text-xs text-white rounded-sm'>
                E
            </span>

            {
                isAuth && (<ul className="flex gap-8">
                    <li>
                        <NavLink
                            to={'/'}
                            className='text-xs text-gray-400 hover:text-white'
                            style={({ isActive }) =>
                                isActive ? activeStyles : undefined
                            }
                        >
                            Main
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={'/posts'}
                            className='text-xs text-gray-400 hover:text-white'
                            style={({ isActive }) =>
                                isActive ? activeStyles : undefined
                            }
                        >
                            My posts
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={'/new'}
                            className='text-xs text-gray-400 hover:text-white'
                            style={({ isActive }) =>
                                isActive ? activeStyles : undefined
                            }
                        >
                            Create post
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={`/me/${id}`}
                            className='text-xs text-gray-400 hover:text-white'
                            style={({ isActive }) =>
                                isActive ? activeStyles : undefined
                            }
                        >
                            My account
                        </NavLink>
                    </li>
                </ul>)
            }

            <div
                className={"flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm"}
            >
                {isAuth ? (
                    <button 
                        onClick={logoutHandler}
                    >
                        <Link
                            to={'/'}
                            className='flex px-4 py-2'
                        >
                            Exit
                        </Link>
                    </button>
                ) : (
                    <Link
                        to={'/login'}
                        className='px-4 py-2'
                    >
                        Enter
                    </Link>
                )}
            </div>
        </div>
    )
}
