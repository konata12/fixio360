import User from '../models/User.js'
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as fs from 'fs';
import { deleteImg, getUrlFromAWS, uploadImg } from "../s3.js";


// REGISTER USER
export const register = async (req, res) => {
    try {
        const { userName, password } = req.body
        const isUsed = await User.findOne({ userName })

        console.log(isUsed)

        // CHECKING IS USER NAME IS USED
        if (isUsed) {
            return res.json({
                message: 'Даний логін занятий'
            })
        }

        // HASHING PASSWORD
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const newUser = new User({
            userName,
            password: hash,
        })

        // CREATING TOKEN
        const token = jwt.sign(
            {
                id: newUser._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '30d'
            }
        )

        await newUser.save()

        res.json({
            newUser,
            message: 'Регістрація успішна',
            token
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: 'Помилка створення користувача'
        })
    }
}

// LOGIN USER
export const login = async (req, res) => {
    try {
        const { userName, password } = req.body
        const user = await User.findOne({ userName })

        if (!user) {
            return res.json({
                message: 'Користувача не знайдено'
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.json({
                message: 'Неправильний логін або пароль'
            })
        }

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '30d'
            }
        )

        res.json({
            user,
            token,
            message: 'Ви ввійшли у систему'
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: 'Помилка авторизації'
        })
    }
}

// GET ME
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            return res.json({
                message: 'Користувача не знайдено'
            })
        }

        // get avatar url from aws
        user.imgUrl = await getUrlFromAWS(user.imgUrl, 'avatars/')

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '30d'
            }
        )

        res.json({
            user,
            token
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: 'Нема доступу'
        })
    }
}

// EDIT USER
export const editMe = async (req, res) => {
    try {
        const { name } = req.body
        let user = await User.findById(req.userId)
        const image = req.file
        console.log(image.filename)
        console.log(req.userId)
        console.log(user)

        if (image) {
            // UPLOAD IMAGE TO AWS S3
            await uploadImg(image, 'avatars/')

            // DELETE OLD IMAGE FROM AWS S3
            if (user.imgUrl !== 'default.jpg') {
                await deleteImg(user.imgUrl, 'avatars/')
            }

            // DELETE IMAGE FROM UPLOADS
            fs.unlinkSync('./uploads/' + image.filename)
        }

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '30d'
            }
        )

        console.log(user,1)
        await User.findOneAndUpdate({ _id: user._id }, {
            $set: {
                userName: name,
                imgUrl: image.filename + '.jpg'
            }
        })
        console.log(user,2)

        user.imgUrl = await getUrlFromAWS(user.imgUrl, 'avatars/')
        user.userName = name
        console.log(user,3)

        res.json({
            user,
            token
        })
    } catch (err) {
        console.log(err)
        res.json(err.message)
    }
}

// DELETE USER
export const deleteMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        const posts = await Post.find({ _id: { $in: user.posts } })
        const comments = await Comment.find({ author: { $in: user._id } })

        if (user.imgUrl) {
            fs.unlink(`./uploads/post/${user.imgUrl}`, () => {
                console.log('user img was deleted')
            })
        }

        posts.forEach(post => {
            if (post.imgUrl) {
                fs.unlink(`./uploads/post/${post.imgUrl}`, () => {
                    console.log('posts img was deleted')
                })
            }
        })

        await Comment.deleteMany({ author: { $in: user._id } })
        await Post.deleteMany({ _id: { $in: user.posts } })
        await User.findByIdAndDelete(user._id)

        res.json({
            message: 'User was deleted'
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: 'Не вдалось оновити інформацію'
        })
    }
}