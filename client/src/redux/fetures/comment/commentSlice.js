import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "../../../utils/axios.js";

const initialState = {
    comments: [],
    loading: false,
    status: null,
}

export const createComment = createAsyncThunk('comment/createComment', async (params) => {
    try {
        const { data } = await Axios.post('/comments/create', params)

        return data
    } catch (err) {
        console.log(err)
    }
})

export const getAllComments = createAsyncThunk('comment/getAllComments', async (params) => {
    try {
        const { data } = await Axios.get(`/comments/getAll/${params}`)

        return data
    } catch (err) {
        console.log(err)
    }
})

export const commentSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {},
    extraReducers: {
        // CREATE POST
        [createComment.pending]: (state, action) => {
            state.loading = true
            state.status = null
        },
        [createComment.fulfilled]: (state, action) => {
            state.loading = false
            state.comments.push(action.payload)
            state.status = action.payload?.message
        },
        [createComment.rejected]: (state, action) => {
            state.loading = false
            state.status = action.payload.message
        },

        // CREATE POST
        [getAllComments.pending]: (state, action) => {
            state.loading = true
            state.status = null
        },
        [getAllComments.fulfilled]: (state, action) => {
            state.loading = false
            state.comments = action.payload
            state.status = action.payload?.message
        },
        [getAllComments.rejected]: (state, action) => {
            state.loading = false
            state.status = action.payload?.message
        },
    }
})

export default commentSlice.reducer
