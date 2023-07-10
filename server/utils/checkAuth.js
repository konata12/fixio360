import jwt from "jsonwebtoken";

export default (req, res, next) => {
    // GETTING TOKEN
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

    if (token) {
        try {
            // DECODING TOKEN
            const decoded = jwt.verify(token, 'secret123')

            req.userId = decoded._id
            next()
        } catch (err) {
            return res.status(403).json({
                message: 'Нема доступу'
            })
        }
    } else {
        return res.status(403).json({
            message: 'Нема доступу'
        })
    }
}