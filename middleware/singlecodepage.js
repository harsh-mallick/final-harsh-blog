const SingleCodePage = require('../model/singlecodepage');

const singlecodemiddleware = async (req, res, next) =>{
    try {
                
        const rootBlog = await SingleCodePage.find({bname: req.cookies.blogname, bcomponame: req.cookies.bcomponame});

        if(!rootBlog){throw new Error('No Component found')}
        req.rootBlog = rootBlog

        next();
    } catch (error) {
        res.status(401).send("Unauthorized: No token provided")
        console.log(error)
    }
}

module.exports = singlecodemiddleware;