import { Router } from "express";

// CONTROLLERS
import { getMe, login, register, editMe, deleteMe } from "../controllers/auth.js";

// MIDDLEWARE
import { checkAuth } from "../utils/checkAuth.js";

import multer from "multer";
const upload = multer({ dest: 'uploads/' })


const router = new Router()

// REGISTRATION
router.post('/register', register)

// LOGIN
router.post('/login', login)

// GET ME
router.get('/me', checkAuth, getMe)

// EDIT USER
router.put('/me', checkAuth, upload.single('image'), editMe)

// DELETE USER
router.delete('/me', checkAuth, deleteMe)

export default router