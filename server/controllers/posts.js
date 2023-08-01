import Post from "../models/Post.js";
import User from "../models/User.js";
import path, { dirname } from 'path';
import { fileURLToPath } from "url";

// CREATE POST
export const createPost = async (req, res) => {
    try {
        console.log(req.files.image.name)
        console.log(req.body)
        const { title, text } = req.body
        const user = await User.findById(req.userId)

        // CREATE POST WITH OMG
        if (req.files) {
            let fileName = Date.now().toString() + req.files.image.name
            // GET CURRENT FOLDER PATH (CONTROLLERS FOLDER)
            const __dirname = dirname(fileURLToPath(import.meta.url))
            // MOVE IMG INTO UPLOADS AND GIVE IT NEW NAME
            req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName))

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

            return res.json(newPostWithImage)
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

        res.json(newPostWithoutImage)

    } catch (err) {
        res.json({
            message: 'Щось пішло не так при створенні поста'
        })
    }
}