const jwt = require('jsonwebtoken');
const BlogEditors = require('../model/BlogEditors');

const authenticate = async (req, res, next) =>{
    try {
        const token = req.signedCookies['jwtoken'];
        const verifyToken = jwt.verify(token, "HARSHisAsuperCoderboy");
                
        const rootUser = await BlogEditors.findOne({_id: verifyToken._id});

        if(!rootUser){throw new Error('User not found')}

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();
    } catch (error) {
        res.status(401).send("Unauthorized: No token provided")
        console.log(error)
    }
}

module.exports = authenticate;