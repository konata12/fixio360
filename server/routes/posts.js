import { Router } from "express";

// CONTROLLERS

// MIDDLEWARE
import { checkAuth } from "../utils/checkAuth.js";
import { createPost , getAll, getById } from "../controllers/posts.js";

const router = new Router()

// CREATE POST
router.post('/', checkAuth, createPost)

// GET ALL POSTS
router.get('/', getAll)

// GET POST BY ID
router.get('/:id', getById)


export default router