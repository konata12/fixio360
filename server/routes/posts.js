import { Router } from "express";

// CONTROLLERS

// MIDDLEWARE
import { checkAuth } from "../utils/checkAuth.js";
import { createPost , getAll, getById, deleteMyPost, getMyPosts } from "../controllers/posts.js";

const router = new Router()

// CREATE POST
router.post('/', checkAuth, createPost)

// GET ALL POSTS
router.get('/', getAll)

// GET POST BY ID
router.get('/:id', getById)

// DELETE POST BY ID
router.delete('/:id', checkAuth, deleteMyPost)

// GET USER POSTS
router.get('/user/me', checkAuth, getMyPosts)


export default router