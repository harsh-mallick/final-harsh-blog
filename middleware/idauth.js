const Amity = require('../model/Addblog');

const authenticate = async (req, res, next) =>{
    try {
        const useridcookie = req.cookies.userid;
        userid = useridcookie;
        next();
    } catch (error) {
        res.status(401).send("Unauthorized: No token provided")
        console.log(error)
    }
}

module.exports = authenticate;