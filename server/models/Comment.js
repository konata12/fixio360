import mongoose from 'mongoose'

const CommentSchems = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: true,
        },
        imgUrl: {
            type: String,
            default: ''
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            res: 'User'
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model('Comment', CommentSchems)