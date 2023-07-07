// LIBRIARIES
import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { validationResult } from 'express-validator'

//IMPORTS
import { registerValidation } from './validations/auth.js'

// MODELS
import { UserModel } from './models/User.js'

// MONGODB CONNECTION
mongoose.connect('mongodb+srv://dima:maxloh14@fixio360.bh4v0ft.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        console.log('DB ok')
    })
    .catch((err) => {
        console.log('DB err', err)
    })

// CREATING EXPRESS APP
const app = express();

app.use(express.json())

app.get('/', (req, res) => {
    res.send('hello');
});

// REGISTRASTION
app.post('/auth/register', registerValidation, (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }

    const doc = new UserModel({
        
    })

    res.json({
        success: true
    })
})

//LISTENING FOR REQUESTS FROM PORT 5000
app.listen(5000, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('server ok')
});