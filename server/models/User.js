import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        imgUrl: {
            type: String,
            default: 'default.jpg'
        },
        posts: [{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        }]
    },
    {
        timestamps: true
    }
)

export default mongoose.model('User', UserSchema)