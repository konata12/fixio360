// IMPORT DEPENCIES
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// IMPORT ROUTES
import authRoute from "./routes/auth.js";
import postRoute from "./routes/posts.js";


const app = express()
dotenv.config()

// CONSTANTS
const PORT = process.env.PORT || 3001
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

// MIDDLEWARE
app.use(cors())
app.use(express.json())

// ROUTES
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)

const start = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${DB_USER}:${DB_PASSWORD}@fixio360.bh4v0ft.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
        )

        app.listen(PORT, () => console.log(`server started on port: ${PORT}`))
    } catch (err) {
        console.log(err)
    }
}

start()