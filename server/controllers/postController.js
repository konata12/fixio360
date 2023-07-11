import PostModel from "../models/Post.js"

export const getAll = async (req, res) => {
    try {
        // GET ALL POSTS WITH USER, POPULATE CONNECTS TO GET USER INFO
        const posts = await PostModel.find().populate('user').exec()

        res.json(posts)
    } catch (err) {
        console.log(err)
        // LETTING USER KNOW ABOUT GET PROBLEM
        res.status(500).json({
            message: 'Не вдалось получити статті'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        // GET POST ID
        const postId = req.params.id
        
        await PostModel.findOneAndUpdate(
            {
                _id: postId
            },
            {
                $inc: { viewsCount: 1 }
            },
            {
                returnDocument: 'after'
            },
        ).then((result) => {
            if (!result) {
                return res.status(404).json({
                    message: 'Стаття не знайдена'
                })
            }
            
            res.json(result)
        })
    } catch (err) {
        console.log(err)
        // LETTING USER KNOW ABOUT GET PROBLEM
        res.status(500).json({
            message: 'Не вдалось получити статтю'
        })
    }
}

export const remove = async (req, res) => {
    try {
        // GET POST ID
        const postId = req.params.id
        
        await PostModel.findByIdAndDelete({
            _id: postId
        }).then((result) => {
            if (!result) {
                return res.status(404).json({
                    message: 'Стаття не знайдена'
                })
            }
            
            res.json({
                success: true
            })
        }).catch((err) => {
            console.log(err)
            return res.status(500).json({
                message: 'Не вдалось видалити статтю'
            })
        })
    } catch (err) {
        console.log(err)
        // LETTING USER KNOW ABOUT GET PROBLEM
        res.status(500).json({
            message: 'Помилка при видаленні статті'
        })
    }
}

export const create = async(req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })

        const post = await doc.save()

        res.json(post)
    } catch (err) {
        // LOGGING ERROR INTO CONSOLE
        console.log(err)
        // LETTING USER KNOW ABOUT POST PROBLEM
        res.status(500).json({
            message: 'Не вдалось створити статтю'
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id

        await PostModel.updateOne(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId
            }
        )

        res.json({
            success: true
        })
    } catch (err) {
        console.log(err)
        // LETTING USER KNOW ABOUT UPDATE PROBLEM
        res.status(500).json({
            message: 'Не вдалось оновити статтю'
        })
    }
}