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
            if (!fs.existsSync('./uploads/post')) {
                fs.mkdirSync('./uploads/post')
            }

            // MOVE IMG INTO UPLOADS AND GIVE IT NEW NAME
            req.files.image.mv(path.join(__dirname, '..', 'uploads', 'post', fileName))

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
                newPostWithImage,
                message: 'Створений пост з картинкою'
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

        res.json({
            newPostWithoutImage,
            message: 'Створений пост з без картинки'
        })

    } catch (err) {
        res.json({
            message: 'Щось пішло не так при створенні поста'
        })
    }
}

// GET ALL POSTS
export const getAll = async (req, res) => {
    try {
        console.log(req.originalUrl)
        const filter = req.query.filter === undefined ?
            '-createdAt' : req.query.filter
        const page = req.query.page === undefined ?
            1 : +req.query.page
        const keyword = req.query.keyword === undefined ?
            '' : req.query.keyword

        console.log(filter, page, keyword)

        let responsePosts = []
        const popularPosts = await Post.find().sort('-views').limit(5)

        // SEARCH FOR POSTS BY KEYWORD IF THERE IS
        const postsNum = keyword.lenght ? await Post.estimatedDocumentCount() :
            await Post.countDocuments({ title: { '$regex': new RegExp(`${keyword}`) } })

        if (page >= 1 && page <= postsNum) {
            // filter
            switch (filter) {
                case '-createdAt':
                case '-author':
                case '-views':
                case '+createdAt':
                case '+author':
                case '+views':
                    break;

                default:
                    return res.json({
                        message: 'There are no such a filter'
                    })
                    break;
            }
            const anus = filter.slice(1)
            const sort = {}
            sort[anus] = filter[0] === '+' ? 1 : -1

            console.log(page)
            console.log(sort)

            // get posts
            const skip = page > 1 ? ((page - 1) * 10) : 0
            const posts = await Post.find({ title: { '$regex': new RegExp(`${keyword}`) } }).sort(sort).skip(skip).limit(10)

            // check if there are posts
            if (!posts.length) {
                return res.json({
                    message: 'There are no posts'
                })
            }

            let postsAuthors = await Post.aggregate().sort(`${filter}`)
                .skip(skip)
                .limit(10)
                .group({
                    _id: { author: "$author" }
                }).then((res) => {
                    return res.map(author => {
                        return author._id.author
                    })
                }).catch((err) => {
                    console.log(err)
                })

            const users = await User.find({ _id: { $in: postsAuthors } })

            responsePosts = posts.map(post => {
                const userUrl = users.map(user => {
                    if (user?._id.toString() === post?.author.toString()) {
                        return user.imgUrl
                    }
                }).filter(user => user)

                return {
                    avatarUrl: userUrl[0],
                    post: post
                }
            })
        }

        res.json({
            responsePosts,
            popularPosts,
            postsNum
        })
    } catch (err) {
        res.json({
            message: err.message
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
            if (!fs.existsSync('./uploads/post')) {
                fs.mkdirSync('./uploads/post')
            }

            // DELETE OLD IMG FROM UPLOADS
            const oldImg = await Post.findById(req.params.id)
            const oldImgUrl = oldImg.imgUrl
            console.log(oldImgUrl)
            if (fs.existsSync('./uploads/post/' + oldImgUrl)) {
                fs.unlinkSync('./uploads/post/' + oldImgUrl)
            }

            // MOVE IMG INTO UPLOADS AND GIVE IT NEW NAME
            req.files.image.mv(path.join(__dirname, '..', 'uploads', 'post', newImgName))

            post.imgUrl = newImgName
        }

        // EDIT STRING VALUES
        post.title = title
        post.text = text

        await post.save()

        res.json({
            post,
            message: 'Пост було оновлено'
        })
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
        fs.unlinkSync('./uploads/post/' + fileName)

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

        const filter = req.query.filter === undefined ?
            '-createdAt' : req.query.filter
        const page = req.query.page === undefined ?
            1 : +req.query.page
        const keyword = req.query.keyword === undefined ?
            '' : req.query.keyword

        console.log(keyword.length, 'slovo')

        // counting this author posts by keywords
        const postsNum = await Post.countDocuments({
            author: req.userId,
            title: { '$regex': new RegExp(`${keyword}`) }
        })

        let responsePosts = []

        if (page >= 1 && page <= postsNum) {
            // filter
            switch (filter) {
                case '-createdAt':
                case '-views':
                case '+createdAt':
                case '+views':
                    break;

                default:
                    return res.json({
                        message: 'There are no such a filter'
                    })
                    break;
            }
            const anus = filter.slice(1)
            const sort = {}
            sort[anus] = filter[0] === '+' ? 1 : -1

            // get posts
            const skip = page > 1 ? ((page - 1) * 10) : 0
            responsePosts = await Post.find({ author: req.userId, title: { '$regex': new RegExp(`${keyword}`) } })
                .sort(sort)
                .skip(skip)
                .limit(10)

            responsePosts = {
                avatarUrl: user.imgUrl,
                posts: responsePosts
            }

            // check if there are posts
            if (!responsePosts.posts.length) {
                return res.json({
                    message: 'There are no posts'
                })
            }
        }

        res.json({
            responsePosts,
            postsNum
        })
    } catch (err) {
        res.json(err.message)
    }
}