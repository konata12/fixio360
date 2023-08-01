import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "../../../utils/axios.js";

const initialState = {
    user: null,
    token: null,
    isLoading: false,
    status: null,
}

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async ({ userName, password }) => {
        try {
            // SERVER RESPONSE
            const { data } = await Axios.post('/auth/register', {
                userName,
                password
            })

            if (data.token) {
                window.localStorage.setItem('token', data.token)
            }

            console.log(data.newUser)

            return data
        } catch (err) {
            console.log(err)
        }
    }
)

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ userName, password }) => {
        try {
            // SERVER RESPONSE
            const { data } = await Axios.post('/auth/login', {
                userName,
                password
            })

            if (data.token) {
                window.localStorage.setItem('token', data.token)
            }

            console.log(data)

            return data
        } catch (err) {
            console.log(err)
        }
    }
)

export const getMe = createAsyncThunk('auth/get', async () => {
        try {
            // SERVER RESPONSE
            const { data } = await Axios.get('/auth/me')

            console.log(data)

            return data
        } catch (err) {
            console.log(err)
        }
    }
)


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.token = null
            state.isLoading = false
            state.status = null
        }
    },
    extraReducers: {
        // REGISTER USER
        [registerUser.pending]: (state) => {
            state.isLoading = true
            state.status = null
        },
        [registerUser.fulfilled]: (state, action) => {
            state.isLoading = false
            state.status = action.payload.message
            state.user = action.payload.newUser
            state.token = action.payload.token
        },
        [registerUser.rejected]: (state, action) => {
            state.status = action.payload.message
            state.isLoading = false
        },

        // LOGIN USER
        [loginUser.pending]: (state) => {
            state.isLoading = true
            state.status = null
        },
        [loginUser.fulfilled]: (state, action) => {
            state.isLoading = false
            state.status = action.payload.message
            state.user = action.payload.user
            state.token = action.payload.token
        },
        [loginUser.rejected]: (state, action) => {
            state.status = action.payload.message
            state.isLoading = false
        },

        // GET ME / AUTHORIZATION CHECK
        [getMe.pending]: (state) => {
            state.isLoading = true
            state.status = null
        },
        [getMe.fulfilled]: (state, action) => {
            state.isLoading = false
            state.status = null
            state.user = action.payload?.user
            state.token = action.payload?.token
        },
        [getMe.rejected]: (state, action) => {
            state.status = action.payload.message
            state.isLoading = false
        },
    }
})

export const checkIsAuth = state => Boolean(state.auth.token)

export const  {logout} = authSlice.actions
export default authSlice.reducer