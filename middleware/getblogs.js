const Blogs = require('../model/Addblog');

const getblogs = async (req, res, next) =>{
    try {
                
        const rootBlog = await Blogs.find({token: 1});

        if(!rootBlog){throw new Error('User not found')}
        req.rootBlog = rootBlog

        next();
    } catch (error) {
        res.status(401).send("Unauthorized: No token provided")
        console.log(error)
    }
}

module.exports = getblogs;