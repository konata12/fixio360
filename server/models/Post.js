import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    text: {
        type: String,
        require: true,
        unique: true,
    },
    tags: {
        type: Array,
        default: [],
    },
    viewsCount: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.ObjectId,
        require: true,
        unique: true,
    },
    imageUrl: String,
}, {
    timestamps: true,
})

export default mongoose.model('User', PostSchema)