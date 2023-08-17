import User from '../models/User.js'
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import path, { dirname } from 'path';
import { fileURLToPath } from "url";
import * as fs from 'fs';

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
        const user = await User.findById(req.userId)

        if (req.files) {
            let fileName = Date.now().toString() + req.files.image.name

            // GET CURRENT FOLDER PATH (CONTROLLERS FOLDER)
            const __dirname = dirname(fileURLToPath(import.meta.url))

            // DELETING OLD IMG FROM UPLOADS
            if (user.imgUrl) {
                fs.unlinkSync('./uploads/avatar/' + user.imgUrl)
            }

            // CHECKING IF THERE AREN'T SUCH A DIRECTORY, THEN CREATE
            if (!fs.existsSync('./uploads/avatar')) {
                fs.mkdirSync('./uploads/avatar')
            }

            // MOVE IMG INTO UPLOADS AND GIVE IT NEW NAME
            req.files.image.mv(path.join(__dirname, '..', 'uploads', 'avatar', fileName))

            user.imgUrl = fileName
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

        user.userName = name

        user.save()

        res.json({
            user,
            token
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: 'Не вдалось оновити інформацію'
        })
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