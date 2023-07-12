import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// REGISTER USER
export const register = async (req,res) => {
    try {
        const { userName, password } = req.body
        const isUsed = await User.findOne({ userName })

        // CHECKING IS USER NAME IS USED
        if(isUsed) {
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

        await newUser.save()

        res.json({
            newUser,
            message: 'Регістрація успішна'
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: 'Помилка створення користувача'
        })
    }
}

// LOGIN USER
export const login = async (req,res) => {
    try {
        const { userName, password } = req.body
        const user = await User.findOne({ userName })

        if  (!user) {
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
export const getMe = async (req,res) => {
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