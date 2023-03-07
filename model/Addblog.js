const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog-editors_Register'
    },
    bname: {
        type: String,
        required: true
    },
    bdescription: {
        type: String,
        required: true
    },
    token: {
        type: Number,
        default: 1
    }
})

const Blogs = mongoose.model('Parent Blogs', userSchema);

module.exports = Blogs;