const mongoose = require('mongoose');

const email = new mongoose.Schema({
    cname: {
        type: String,
        required: true
    },
    cemail: {
        type: String,
        required: true
    },
    cmessage: {
        type: String,
        required: true
    },
})

const Email = mongoose.model('Email', email);

module.exports = Email;