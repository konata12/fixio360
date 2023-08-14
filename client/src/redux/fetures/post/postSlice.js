import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "../../../utils/axios.js";

const initialState = {
    posts: [],
    popularPosts: [],
    loading: false,
    status: null,
}

export const createPost = createAsyncThunk('post/createPost', async (params) => {
    try {
        const { data } = await Axios.post('/posts', params)

        return data
    } catch (err) {
        console.log(err)
    }
})

export const editPost = createAsyncThunk('post/editPost', async ({ params, id }) => {
    try {
        const { data } = await Axios.put(`/posts/${id}`, params)

        return data
    } catch (err) {
        console.log(err)
    }
})

export const getAllPosts = createAsyncThunk('post/getAllPosts', async () => {
    try {
        const { data } = await Axios.get('/posts')
        return data
    } catch (err) {
        console.log(err)
    }
})

export const getMyPosts = createAsyncThunk('post/getMyPosts', async () => {
    try {
        const { data } = await Axios.get('/posts/user/me')
        return data
    } catch (err) {
        console.log(err)
    }
})

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {},
    extraReducers: {
        // CREATE POST
        [createPost.pending]: (state, action) => {
            state.loading = true
            state.status = null
        },
        [createPost.fulfilled]: (state, action) => {
            state.loading = false
            state.posts.push(action.payload)
            state.status = action.payload.message
        },
        [createPost.rejected]: (state, action) => {
            state.loading = false
            state.status = action.payload.message
        },

        // EDIT POST
        [createPost.pending]: (state, action) => {
            state.loading = true
            state.status = null
        },
        [createPost.fulfilled]: (state, action) => {
            state.loading = false
            state.posts.push(action.payload)
            state.status = action.payload.message
        },
        [createPost.rejected]: (state, action) => {
            state.loading = false
            state.status = action.payload.message
        },

        // GET ALL POSTS
        [getAllPosts.pending]: (state, action) => {
            state.loading = true
            state.status = null
        },
        [getAllPosts.fulfilled]: (state, action) => {
            state.loading = false
            state.posts = action.payload.posts
            state.popularPosts = action.payload.popularPosts
        },
        [getAllPosts.rejected]: (state, action) => {
            state.loading = false
        },
    }
})

export default postSlice.reducer