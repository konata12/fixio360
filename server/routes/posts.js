import { Router } from "express";

// CONTROLLERS
import { createPost , getAll, getById, updatePost, deleteMyPost, getMyPosts } from "../controllers/posts.js";

// MIDDLEWARE
import { checkAuth } from "../utils/checkAuth.js";

import multer from "multer";
const upload = multer({ dest: 'uploads/' })


const router = new Router()

// CREATE POST
router.post('/', checkAuth, upload.single('image'), createPost)

// GET ALL POSTS
router.get('/', getAll)

// GET POST BY ID
router.get('/:id', getById)

// UPDATE POST
router.put('/:id', checkAuth, upload.single('image'), updatePost)

// DELETE POST BY ID
router.delete('/:id', checkAuth, deleteMyPost)

// GET USER POSTS
router.get('/user/me', checkAuth, getMyPosts)


export default router