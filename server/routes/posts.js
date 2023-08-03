import { Router } from "express";

// CONTROLLERS

// MIDDLEWARE
import { checkAuth } from "../utils/checkAuth.js";
import { createPost , getAll} from "../controllers/posts.js";

const router = new Router()

// CREATE POST
router.post('/', checkAuth, createPost)

// GET ALL POSTS
router.get('/', getAll)


export default router