// LIBRIARIES
import express from 'express'
import mongoose from 'mongoose'

//IMPORTS
import { registerValidation, loginValidation } from './validations/validation.js'

// CONTROLLERS
import * as UserController from './controllers/userController.js'

// MIDDLEWARE
import checkAuth from './utils/checkAuth.js'

// console.log(UserModel)

// MONGODB CONNECTION
mongoose.connect('mongodb+srv://dima:maxloh14@fixio360.bh4v0ft.mongodb.net/blog?retryWrites=true&w=majority')
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

// USER AUTHORISATION
app.post('/auth/login', loginValidation, UserController.login)
// USER REGISTRASTION
app.post('/auth/register', registerValidation, UserController.register)
// GET USER INFORMATION
app.get('/auth/me', checkAuth, UserController.getMe)

//LISTENING FOR REQUESTS FROM PORT 5000
app.listen(5000, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('server ok')
});