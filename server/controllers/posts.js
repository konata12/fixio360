import Post from "../models/Post.js";
import User from "../models/User.js";
import { deleteImg, getUrlFromAWS, uploadImg } from "../s3.js";
import * as fs from 'fs';


// CREATE POST
export const createPost = async (req, res) => {
    try {
        const { title, text } = req.body
        const user = await User.findById(req.userId)
        console.log(user)
        const image = req.file
        console.log(image)

        // CREATE POST WITH OMG
        if (image) {
            // UPLOAD IMAGE TO AWS S3
            const resp = await uploadImg(image, 'posts/')
            console.log(resp)

            // DELETE IMAGE FROM UPLOADS
            fs.unlinkSync('./uploads/' + image.filename)

            // CREATE POST WITH IMAGE
            const newPostWithImage = new Post({
                userName: user.userName,
                title,
                text,
                imgUrl: image.filename + '.jpg',
                author: req.userId,
            })

            // SAVE POST WITH IMAGE TO MONGO
            await newPostWithImage.save()
            // ADD POST TO USERS` POSTS ARRAY
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

        // SAVE POST WITHOUT IMAGE TO MONGO
        await newPostWithoutImage.save()
        // ADD POST TO USERS` POSTS ARRAY
        await User.findByIdAndUpdate(req.userId, {
            $push: { posts: newPostWithoutImage }
        })

        res.json({
            newPostWithoutImage,
            message: 'Створений пост без картинки'
        })
    } catch (err) {
        res.json({
            message: err.message
        })
    }
}

// GET ALL POSTS
export const getAll = async (req, res) => {
    try {
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
            console.log(10)
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
            }
            const anus = filter.slice(1)
            const sort = {}
            sort[anus] = filter[0] === '+' ? 1 : -1

            // get posts
            const skip = page > 1 ? ((page - 1) * 10) : 0
            const posts = await Post.find({ title: { '$regex': new RegExp(`${keyword}`) } })
                .sort(sort)
                .skip(skip)
                .limit(10)

            // get posts' signed urls for img
            await Promise.all(posts.map(post => {
                return new Promise(async (resolve) => {
                    const awsUrl = await getUrlFromAWS(post.imgUrl, 'posts/')

                    post.imgUrl = awsUrl
                    resolve()
                })
            }))

            // check if there are posts
            if (!posts.length) {
                return res.json({
                    message: 'There are no posts'
                })
            }

            // get array of posts' user ids
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

            // get users
            const users = await User.find({ _id: { $in: postsAuthors } })

            console.log(users)

            // get гіукs' signed urls for фмфефк
            await Promise.all(users.map(user => {
                return new Promise(async (resolve) => {
                    const awsUrl = await getUrlFromAWS(user.imgUrl, 'avatars/')

                    user.imgUrl = awsUrl
                    resolve()
                })
            }))

            console.log(users)

            // combine posts objects with user's avatar
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
        const user = await User.findById(post.author)

        post.imgUrl = await getUrlFromAWS(post.imgUrl, 'posts/')
        const avatar = await getUrlFromAWS(user.imgUrl, 'avatars/')

        res.json({ post, avatar })
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
        const image = req.file
        const post = await Post.findById(req.params.id)

        // CHANGE IMG IF THERE IS ONE
        if (image) {
            // UPLOAD IMAGE TO AWS S3
            await uploadImg(image, 'posts/')

            // DELETE OLD IMAGE FROM AWS S3
            await deleteImg(post.imgUrl, 'posts/')

            // DELETE IMAGE FROM UPLOADS
            fs.unlinkSync('./uploads/' + image.filename)

            // CHANGE IMG URL IN MONGO
            post.imgUrl = image.filename + '.jpg'
        }
        console.log(image)

        // EDIT STRING VALUES
        post.title = title
        post.text = text
        console.log(post, 1000)

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
        // DELETE POST FROM MONGO
        const post = await Post.findByIdAndRemove(req.params.id)
        if (!post) return res.join({
            message: 'There are no such a post'
        })

        // DELETE POST FROM MONGO USER'S POSTS
        await User.findByIdAndUpdate(req.userId, {
            $pull: { posts: req.params.id }
        })

        // DELETE IMG FROM s3
        await deleteImg(post.imgUrl, 'posts/')

        res.json({
            message: 'Post was deleted'
        })
    } catch (err) {
        console.log(err.message)
        res.json(err.message)
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

            // check if there are posts
            if (!responsePosts.length) {
                return res.json({
                    message: 'There are no posts'
                })
            }

            // get posts' url for image from s3
            await Promise.all(responsePosts.map(post => {
                return new Promise(async (resolve) => {
                    const awsUrl = await getUrlFromAWS(post.imgUrl, 'posts/')

                    post.imgUrl = awsUrl
                    resolve()
                })
            }))

            // build response
            responsePosts = {
                avatarUrl: await getUrlFromAWS(user.imgUrl, 'avatars/'),
                posts: responsePosts
            }
        }

        res.json({
            responsePosts,
            postsNum
        })
    } catch (err) {
        console.log(err.message)
        res.json(err.message)
    }
}