import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "../../../utils/axios.js";

const initialState = {
    // POSTS
    posts: [],
    popularPosts: [],
    // PAGINATION
    postsNum: 0,
    page: 1,
    // STATUS
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

export const getAllPosts = createAsyncThunk('post/getAllPosts', async ({ currentPage, pagesNum }) => {
    try {
        let dataRes = []
        // console.log(currentPage)
        // console.log(Number.isNaN(currentPage))
        if (Number.isNaN(currentPage)) return
        if (currentPage < 1 || currentPage > pagesNum) return 
        // console.log('message')

        if (currentPage) {
            const { data } = await Axios.get(`/posts/?page=${currentPage}`)
            dataRes = data
        } else {
            const { data } = await Axios.get(`/posts/`)
            dataRes = data
        }
        console.log('request made')
        return dataRes
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
            action.payload.newPostWithImage ?
                state.posts.push(action.payload.newPostWithImage) :
                state.posts.push(action.payload.newPostWithoutImage)
            state.status = action.payload.message
        },
        [createPost.rejected]: (state, action) => {
            state.loading = false
            state.status = action.payload.message
        },

        // EDIT POST
        [editPost.pending]: (state, action) => {
            state.loading = true
            state.status = null
        },
        [editPost.fulfilled]: (state, action) => {
            state.loading = false
            const index = state.posts.findIndex(post => post._id === action.payload._id)
            state.posts[index] = action.payload
            state.status = action.payload.message
        },
        [editPost.rejected]: (state, action) => {
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
            state.posts = action.payload?.responsePosts
            state.postsNum = action.payload?.postsNum
            state.popularPosts = action.payload?.popularPosts
        },
        [getAllPosts.rejected]: (state, action) => {
            state.loading = false
        },
    }
})

export default postSlice.reducer