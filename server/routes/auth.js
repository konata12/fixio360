import { Router } from "express";

// CONTROLLERS
import { getMe, login, register, editMe, deleteMe } from "../controllers/auth.js";

// MIDDLEWARE
import { checkAuth } from "../utils/checkAuth.js";

const router = new Router()

// REGISTRATION
router.post('/register', register)

// LOGIN
router.post('/login', login)

// GET ME
router.get('/me', checkAuth, getMe)

// EDIT USER
router.put('/me', checkAuth, editMe)

// DELETE USER
router.delete('/me', checkAuth, deleteMe)

export default router