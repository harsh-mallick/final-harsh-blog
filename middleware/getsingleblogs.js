const SingleBlog = require('../model/AddSingleblog');

const getblogs = async (req, res, next) =>{
    try {
                
        const rootBlog = await SingleBlog.find({bname: req.cookies.blogname});
        const rootblog = await SingleBlog.find({token: 1});

        if(!rootBlog){throw new Error('No Component found')}
        req.rootBlog = rootBlog
        req.rootblog = rootblog

        next();
    } catch (error) {
        res.status(401).send("Unauthorized: No token provided")
        console.log(error)
    }
}

module.exports = getblogs;