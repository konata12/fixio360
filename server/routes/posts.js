import { Router } from "express";

// CONTROLLERS

// MIDDLEWARE
import { checkAuth } from "../utils/checkAuth.js";
import { createPost } from "../controllers/posts.js";

const router = new Router()

// CREATE POST
router.post('/', checkAuth, createPost)


export default router