import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.userId = decoded.id

            next()
        } catch (err) {
            return res.json({
                message: 'Нема доступу'
            })
        }
    } else {
        return res.json({
            message: 'Нема доступу'
        })
    }
}