import { configureStore } from '@reduxjs/toolkit'
import authSlice from './fetures/auth/authSlice.js'
import postSlice from './fetures/post/postSlice.js'
import commentSlice from './fetures/comment/commentSlice.js'

export const store = configureStore({
    reducer: {
        auth: authSlice,
        post: postSlice,
        comment: commentSlice,
    },
})