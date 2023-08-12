import Axios from '../utils/axios.js'
import React, { useEffect, useState } from 'react'
import { PostItem } from '../components/PostItem'

export const PostsPage = () => {
    const [myPosts, setMyPosts] = useState([])

    const fetchMyPosts = async () => {
        try {
            const { data } = await Axios.get('/posts/user/me')
            setMyPosts(data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchMyPosts()
        console.log('use effect')
    }, [])

    return (
        <div className='w-1/2 mx-auto py-10 flex flex-col gap-10'>
            {myPosts?.map((post, idx) => (
                <PostItem post={post} key={idx} />
            ))}
        </div>
    )
}
