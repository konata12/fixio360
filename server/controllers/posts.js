import Post from "../models/Post.js";
import User from "../models/User.js";
import path, { dirname } from 'path';
import { fileURLToPath } from "url";
import * as fs from 'fs';

// CREATE POST
export const createPost = async (req, res) => {
    try {
        const { title, text } = req.body
        const user = await User.findById(req.userId)

        // CREATE POST WITH OMG
        if (req.files) {
            let fileName = Date.now().toString() + req.files.image.name
            // GET CURRENT FOLDER PATH (CONTROLLERS FOLDER)
            const __dirname = dirname(fileURLToPath(import.meta.url))
            // CHECKING IF THERE AREN'T SUCH A DIRECTORY, THEN CREATE
            if (!fs.existsSync('./uploads')) {
                fs.mkdirSync('./uploads')
            }

            // MOVE IMG INTO UPLOADS AND GIVE IT NEW NAME
            req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName))

            const newPostWithImage = new Post({
                userName: user.userName,
                title,
                text,
                imgUrl: fileName,
                author: req.userId,
            })

            await newPostWithImage.save()
            await User.findByIdAndUpdate(req.userId, {
                $push: { posts: newPostWithImage }
            })

            return res.json({
                newPostWithImage
            })
        }

        // CREATE POST WITHOUT IMG
        const newPostWithoutImage = new Post({
            userName: user.userName,
            title,
            text,
            imgUrl: '',
            author: req.userId,
        })

        await newPostWithoutImage.save()
        await User.findByIdAndUpdate(req.userId, {
            $push: { posts: newPostWithoutImage }
        })

        res.json(newPostWithoutImage)

    } catch (err) {
        res.json({
            message: 'Щось пішло не так при створенні поста'
        })
    }
}

// GET ALL POSTS
export const getAll = async (req, res) => {
    try {
        const posts = await Post.find().sort('-createdAt')
        const popularPosts = await Post.find().limit(5).sort('-views')

        if (!posts) {
            return res.json({
                message: 'There are no posts'
            })
        }

        res.json({
            posts,
            popularPosts
        })
    } catch (err) {
        res.json({
            message: 'Something gone wrong'
        })
    }
}

// GET POST BY ID
export const getById = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 }
        })

        res.json(post)
    } catch (err) {
        res.json({
            message: 'Something gone wrong'
        })
    }
}

// UPDATE POST
export const updatePost = async (req, res) => {
    try {
        const { title, text } = req.body
        const post = await Post.findById(req.params.id)

        // CHANGE IMG IF THERE IS ONE
        if (req.files) {
            let newImgName = Date.now().toString() + req.files.image.name

            // GET CURRENT FOLDER PATH (CONTROLLERS FOLDER)
            const __dirname = dirname(fileURLToPath(import.meta.url))

            // CHECKING IF THERE AREN'T SUCH A DIRECTORY, THEN CREATE
            if (!fs.existsSync('./uploads')) {
                fs.mkdirSync('./uploads')
            }

            // DELETE OLD IMG FROM UPLOADS
            const oldImg = await Post.findById(req.params.id)
            const oldImgUrl = oldImg.imgUrl
            console.log(oldImgUrl)
            if (fs.existsSync('./uploads/' + oldImgUrl)) {
                fs.unlinkSync('./uploads/' + oldImgUrl)
            }

            // MOVE IMG INTO UPLOADS AND GIVE IT NEW NAME
            req.files.image.mv(path.join(__dirname, '..', 'uploads', newImgName))

            post.imgUrl = newImgName
        }

        // EDIT STRING VALUES
        post.title = title
        post.text = text

        await post.save()

        res.json(post)
    } catch (err) {
        res.json({
            message: 'Щось пішло не так при оновлені поста'
        })
    }
}

// DELETE POST BY ID
export const deleteMyPost = async (req, res) => {
    try {
        // DELETE POSTS FROM MONGO
        const post = await Post.findByIdAndRemove(req.params.id)
        if (!post) return res.join({
            message: 'There are no such a post'
        })

        // DELETE POST FROM MONGO USER'S POSTS
        await User.findByIdAndUpdate(req.userId, {
            $pull: { posts: req.params.id }
        })

        // DELETE IMG FROM UPLOADS
        let fileName = post.imgUrl
        fs.unlinkSync('./uploads/' + fileName)

        res.json({
            message: 'Post was deleted'
        })
    } catch (err) {
        res.json({
            message: 'Something gone wrong'
        })
    }
}

// GET USER POSTS
export const getMyPosts = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        const userPosts = await Post.find({ _id: { $in: user.posts } })

        res.json(userPosts)
    } catch (err) {
        res.json({
            message: 'Something gone wrong'
        })
    }
}