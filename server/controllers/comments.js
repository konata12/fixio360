import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

// CREATE COMMENT
export const createComment = async (req, res) => {
    try {
        console.log(req.userId)
        const { comment, postId } = req.body

        console.log(postId)

        console.log(1)
        const newComment = await Comment({
            comment: comment,
            author: req.userId,
        })
        console.log(2)

        await Post.findByIdAndUpdate(postId, {
            $push: { comments: newComment }
        })
        console.log(3)
        console.log(newComment)

        await newComment.save()
        console.log(4)

        res.json(newComment)
    } catch (err) {
        console.log(err)
        res.json({
            message: 'Помилка створення коментаря'
        })
    }

}

// GET ALL COMMENTS
export const getAllComments = async (req, res) => {
    try {
        const id = req.params.id
        const post = await Post.findById(id)
        const comments = await Comment.find({ _id: { $in: post.comments} })

        res.json(comments)
    } catch (err) {
        console.log(err)
        res.json({
            message: 'Помилка отримання всіх коментарів'
        })
    }

}
