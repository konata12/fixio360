// LIBRIARIES
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { validationResult } from 'express-validator'

//IMPORTS
import { registerValidation } from './validations/auth.js'

// MODELS
import UserModel from './models/User.js'

// console.log(UserModel)

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
app.post('/auth/register', registerValidation, async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }

    // ENCRYPTING THE PASSWORD RECEIVED BY REQUEST
    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // CREATING USER OBJECT
    const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash,
    })

    //CREATING USER AND SAVING INTO DATABASE
    const user = await doc.save()

    res.json(user)
})

//LISTENING FOR REQUESTS FROM PORT 5000
app.listen(5000, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('server ok')
});