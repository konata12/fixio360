import { Router } from "express";

// CONTROLLERS
import { createPost } from "../controllers/posts.js";

// MIDDLEWARE
import { checkAuth } from "../utils/checkAuth.js";

// ROUTES
const router = new Router()

// CREATE POST
router.post('/', checkAuth, createPost)



export default router