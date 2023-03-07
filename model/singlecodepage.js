const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog-editors_Register'
    },
    bposttitle: {
        type: String,
        required: true
    },
    bpostbody: {
        type: String,
        required: true
    },
    bcomponame:{
        type: String,
        required: true
    },
    bname: {
        type: String,
        required: true
    }
})

const SingleCodePage = mongoose.model('SingleCodePage', userSchema);

module.exports = SingleCodePage;