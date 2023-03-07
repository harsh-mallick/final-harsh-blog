const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog-editors_Register'
    },
    bcomponame: {
        type: String,
        required: true
    },
    bcompodes: {
        type: String,
        required: true
    },
    bname: {
        type: String,
        required: true
    }
    ,
    token: {
        type: Number,
        default: "1"
    }
})

const Addsingleblog = mongoose.model('Sub Blogs', userSchema);

module.exports = Addsingleblog;