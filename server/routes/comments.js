import { Router } from "express";

// CONTROLLERS
import { createComment, getAllComments } from "../controllers/comments.js";

// MIDDLEWARE
import { checkAuth } from "../utils/checkAuth.js";

const router = new Router()

// CREATE COMMENT
router.post('/create', checkAuth, createComment)

// GET ALL COMMENTS
router.get('/getAll/:id', getAllComments)


export default router