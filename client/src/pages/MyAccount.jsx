import React, { useCallback, useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { AiFillEye, AiOutlineMessage, AiTwotoneEdit, AiFillDelete } from 'react-icons/ai'
import Axios from '../utils/axios.js'
import { useDispatch, useSelector } from 'react-redux'
import { editMe, getMe } from '../redux/fetures/auth/authSlice.js'



export function MyAccount() {
    const [edit, setEdit] = useState(false)
    const [name, setName] = useState('')
    const [oldAvatar, setOldAvatar] = useState('')
    const [newAvatar, setNewAvatar] = useState('')
    const user = useSelector(state => state.auth?.user)
    console.log(user)
    const dispatch = useDispatch()

    const changeEditMode = () => {
        setEdit(!edit)
        console.log(edit)
    }

    const submitHandler = () => {
        const data = new FormData()
        data.append('name', name)
        data.append('image', newAvatar)
        dispatch(editMe(data))
        changeEditMode()
    }

    const daleteHandler = () => {
        console.log('delete')
    }

    // const clearFormHandler = () => {
    //     setName('')
    //     setNewAvatar('')
    //     setOldAvatar(user?.imgUrl)
    // }

    useEffect(() => {
        setName(user?.userName)
        setOldAvatar(user?.imgUrl)
    }, [user?.userName, user?.imgUrl])

    return (
        <div>
            <button className='flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm'>
                <Link
                    className='flex w-full h-full py-2 px-4'
                    to={'/'}
                >
                    Back
                </Link>
            </button>

            <div className="flex gap-10 py-8">
                {edit ? (
                    <form
                        className='basis-1/5 mx-auto py-10'
                        onSubmit={e => e.preventDefault()}
                    >
                        <label
                            className='text-gray-300 py-2 bg-gray-600 text-xs mt-2 flex items-center justify-center border-2 border-dotted cursor-pointer'
                        >
                            Змінити аватар:
                            <input
                                type="file"
                                className='hidden'
                                onChange={(e) => {
                                    setNewAvatar(e.target.files[0])
                                    setOldAvatar('')
                                }}
                            />
                        </label>
                        <div className='flex object-cover py-2'>
                            {oldAvatar && (
                                <img src={`http://localhost:3002/avatar/${oldAvatar}`} alt={oldAvatar.name} />
                            )}
                            {newAvatar && (
                                <img src={URL.createObjectURL(newAvatar)} alt={newAvatar.name} />
                            )}
                        </div>

                        <label
                            className="text-xs text-white opacity-70"
                        >
                            Назва посту:
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder='Title'
                                className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
                            />
                        </label>
                        <div className="flex gap-8 items-center justify-center mt-4">
                            <button
                                className="flex items-center justify-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4"
                                onClick={submitHandler}
                            >
                                Редагувати користувача
                            </button>

                            <button
                                className="flex items-center justify-center bg-red-500 text-xs text-white rounded-sm py-2 px-4"
                                onClick={changeEditMode}
                            >
                                Відмінити
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className='flex flex-col basis-1/5'>
                        {user?.imgUrl && <img
                            className=' rounded-full'
                            src={`http://localhost:3002/avatar/${user?.imgUrl}`}
                            alt="img"
                        />}
                        <div className="text-white text-xl">
                            {user?.userName}
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                className='flex items-center justify-center gap-2 text-xs text-white opacity-50'
                                onClick={changeEditMode}
                            >
                                <AiTwotoneEdit />
                            </button>
                            <button
                                className='flex items-center justify-center gap-2 text-xs text-white opacity-50'
                                onClick={daleteHandler}
                            >
                                <AiFillDelete />
                            </button>
                        </div>
                    </div>
                )}

                <div className='flex flex-col basis-4/5'>
                    My posts
                </div>
            </div>
        </div>
    )
}
