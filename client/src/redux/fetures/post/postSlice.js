import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "../../../utils/axios.js";

const initialState = {
    posts: [],
    popularPosts: [],
    loading: false,
}

export const createPost = createAsyncThunk('post/createPost', async (params) => {
    try {
        const { data } = await Axios.post('/posts')

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
        [createPost.pending]: (state) => {
            state.loading = true
        },
        [createPost.fulfilled]: (state, action) => {
            state.loading = false
            state.posts.push(action.payload)
        },
        [createPost.rejected]: (state) => {
            state.loading = false
        },
    }
})

export default postSlice.reducer