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
        
        PostModel.findOneAndUpdate(
            {
                _id: postId
            },
            {
                $inc: { viewsCount: 1 }
            },
            {
                returnDocument: 'after'
            },
            // (err, doc) => {
            //     if (err) {
            //         console.log(err)
            //         // LETTING USER KNOW ABOUT GET PROBLEM
            //         return res.status(500).json({
            //         message: 'Не вдалось получити статті'
            //         })
            //     }

            //     if (!doc) {
            //         return res.status(404).json({
            //             message: 'Стаття не знайдена'
            //         })
            //     }

            //     res.json(doc)
            // }
        ).then((err, doc) => {
            if (err) {
                console.log(err)
                // LETTING USER KNOW ABOUT GET PROBLEM
                return res.status(500).json({
                message: 'Не вдалось получити статті'
                })
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'Стаття не знайдена'
                })
            }

            res.json(doc)
        })

        // res.json(doc)
    } catch (err) {
        console.log(err)
        // LETTING USER KNOW ABOUT GET PROBLEM
        res.status(500).json({
            message: 'Не вдалось получити статтю'
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