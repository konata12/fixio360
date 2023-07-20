import { configureStore } from '@reduxjs/toolkit'
import authSlice from './fetures/auth/authSlice'

export const store = configureStore({
    reducer: {
        auth: authSlice
    },
})