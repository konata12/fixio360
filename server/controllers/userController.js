// MODELS
import UserModel from '../models/User.js'

// LIBRIARIES
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'

export const register = async (req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        // ENCRYPTING THE PASSWORD RECEIVED BY REQUEST
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        // CREATING USER OBJECT
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })

        //CREATING USER AND SAVING INTO DATABASE
        const user = await doc.save()

        // CREATING USER JWT TOKEN
        const token = jwt.sign(
        // HASHING ONLY ID
        {
            _id: user._id
        },
        // HASHING TOKEN KEY
        'secret123',
        // TIME FOR TOKEN TO LIVE
        {
            expiresIn: '30d'
        })

        // PULLING OUT ALL INFO FROM USER WITHOUT PASSWORDHASH FOR RESPONSE OBJECT
        const { passwordHash, ...userData } = user._doc

        // RETURNING USER INFO AND TOKEN
        res.json({
            ...userData,
            token
        })
    } catch (err) {
        // LOGGING ERROR INTO CONSOLE
        console.log(err)
        // LETTING USER KNOW ABOUT REGISTRATION PROBLEM
        res.status(500).json({
            message: 'Не вдалось зареєструватись'
        })
    }
}

export const login = async (req, res) => {
    try {
        // LOOKING FOR USER IN DATABASE
        const user = await UserModel.findOne({ email: req.body.email })

        // CHECKING IF USER NOT FOUND RETURN ERROR
        if (!user) {
            return res.status(404).json({
                message: 'Користувач не знайдений'
            })
        }

        // CHECKING IF THE REQUEST USER PASSWORD = DATABASE USER PASSWORD
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if(!isValidPass) {
            return res.status(400).json({
                message: 'Хибний логін або пароль'
            })
        }

        // AFTER USER WAS FOUND CREATE NEW JWT TOKEN
        const token = jwt.sign(
        // HASHING ONLY ID
        {
            _id: user._id
        },
        // HASHING TOKEN KEY
        'secret123',
        // TIME FOR TOKEN TO LIVE
        {
            expiresIn: '30d'
        })

        // PULLING OUT ALL INFO FROM USER WITHOUT PASSWORDHASH FOR RESPONSE OBJECT
        const { passwordHash, ...userData } = user._doc

        // RETURNING USER INFO AND TOKEN
        res.json({
            ...userData,
            token
        })
    } catch (err) {
        console.log(err)
        // LETTING USER KNOW ABOUT AUTHORISATION PROBLEM
        res.status(500).json({
            message: 'Не вдалось авторизуватись'
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'Користувач не знайдений'
            })
        }

        // PULLING OUT ALL INFO FROM USER WITHOUT PASSWORDHASH FOR RESPONSE OBJECT
        const { passwordHash, ...userData } = user._doc

        // RETURNING USER INFO AND TOKEN
        res.json({
            ...userData
        })
    } catch (err) {
        console.log(err)
        // LETTING USER KNOW ABOUT AUTHORISATION PROBLEM
        res.status(500).json({
            message: 'Нема доступу'
        })
    }
}