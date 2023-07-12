import { Router } from "express";

// CONTROLLERS
import { getMe, login, register } from "../controllers/auth.js";

// MIDDLEWARE
import { checkAuth } from "../utils/checkAuth.js";

const router = new Router()

// REGISTRATION
router.post('/register', register)

// LOGIN
router.post('/login', login)

// GET ME
router.get('/me', checkAuth, getMe)

export default router