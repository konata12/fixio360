// LIBRIARIES
import express from 'express'
import multer from 'multer'

import mongoose from 'mongoose'

//IMPORTS
import { registerValidation, loginValidation, postCreateValidation } from './validations/validation.js'

// CONTROLLERS
import { UserController, PostController } from './controllers/index.js'

// MIDDLEWARE
import { checkAuth, handleValidationErrors } from './utils/index.js'

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

// STORAGE FOR IMAGES IN SERVER
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        // RETURN NO ERRORS AND SAVE IMAGES INTO UPLOADS FOLDER
        cb(null, 'uploads')
    },
    // NAMING OUR FILE
    filename: (_, file, cb) => {
        // RETURN NO ERRORS AND GET ORIGINAL NAME
        cb(null, file.originalname)
    },
})

const upload = multer({ storage })

app.use(express.json())
// MAKE EXPRESS UNDERSTAND THAT FROM UPLOADS URL I NEED IMAGE, NOT ROUTE
app.use('/uploads', express.static('uploads'))

// USER AUTHORISATION
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
// USER REGISTRASTION
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
// GET USER INFORMATION
app.get('/auth/me', checkAuth, UserController.getMe)

// POST IMAGE
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

// BLOG
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)



//LISTENING FOR REQUESTS FROM PORT 5000
app.listen(5000, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('server ok')
});