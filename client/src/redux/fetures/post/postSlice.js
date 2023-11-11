import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "../../../utils/axios.js";

const initialState = {
    // POSTS
    posts: [],
    popularPosts: [],
    // PAGINATION
    postsNum: 0,
    page: null,
    keyWord: '',
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

export const getAllPosts = createAsyncThunk('post/getAllPosts', async ({ currentPage, filter }) => {
    try {
        let dataRes = []
        console.log(1)

        filter = filter[0] ? filter.replace(/\+/g, '%2B') : filter
        filter = filter ? '&filter=' + filter :
            ''

        console.log(currentPage, filter)

        if (currentPage && currentPage !== 'null') {
            const { data } = await Axios.get(`/posts/?page=${currentPage}${filter}`)
            dataRes = data
            console.log(3)
        } else {
            const { data } = await Axios.get(`/posts/?${filter.slice(1)}`)
            dataRes = data
            console.log(4)
        }
        console.log(dataRes)

        return dataRes
    } catch (err) {
        console.log(err)
    }
})

export const getMyPosts = createAsyncThunk('post/getMyPosts', async ({ currentPage, filter, keyword }) => {
    try {
        let dataRes = []

        filter = filter[0] ? filter.replace(/\+/g, '%2B') : filter
        filter = filter ? '&filter=' + filter :
            ''
        keyword = keyword ? '&keyword=' + keyword :
        ''

        if (currentPage && currentPage !== 'null') {
            console.log(3)
            const { data } = await Axios.get(`/posts/user/me/?page=${currentPage}${filter}${keyword}`)
            dataRes = data
        } else {
            console.log(4)
            const { data } = await Axios.get(`/posts/user/me/?${filter.slice(1)}${keyword}`)
            dataRes = data
        }
        console.log(dataRes)

        return dataRes
    } catch (err) {
        console.log(err)
    }
})

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload
            console.log(state.page)
        },
        setKeyWord: (state, action) => {
            console.log(state.keyWord)
            state.keyWord = action.payload
            console.log(state.keyWord)
        },
    },
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

        // GET MY POSTS
        [getMyPosts.pending]: (state) => {
            state.loading = true
            state.status = null
        },
        [getMyPosts.fulfilled]: (state, action) => {
            state.loading = false
            state.posts = action.payload?.responsePosts
            state.postsNum = action.payload?.postsNum
        },
        [getMyPosts.rejected]: (state, action) => {
            state.loading = false
        },
    }
})

export const { setPage } = postSlice.actions
export const { setFilter } = postSlice.actions
export const { setFilterType } = postSlice.actions

export default postSlice.reducer