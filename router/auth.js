// Dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs')
const cors = require("cors");
require("../db/conn");
const app = express()
const router = express.Router();
app.use(cors());
app.use(cookieParser())

// All mongoose Models
const Blogeditors = require('../model/BlogEditors');
const Blog = require('../model/Addblog');
const SingleBlog = require('../model/AddSingleblog');
const Singlecode = require('../model/singlecodepage');
const Email = require('../model/email');

// All middlewares
const authenticate = require('../middleware/authenticate');
const getblogs = require('../middleware/getblogs');
const getsngleblog = require('../middleware/getsingleblogs');
const singlecodemiddleware = require('../middleware/singlecodepage');





// Get Request: Retrieve Editors Profile Info
router.get('/profile', authenticate, (req, res) => {
    res.send(req.rootUser);
})

// Get Request: Retrieve all blogs
router.get('/getblogs', getblogs, async (req, res) => {
    res.send(req.rootBlog)
})

// Get Request: Retrieve perticular sub blogs
router.get('/getsingleblogs', getsngleblog, async (req, res) => {
    res.send(req.rootBlog)
})

// Get Request: Retrieve all sub blogs
router.get('/getsingleblogss', getsngleblog, async (req, res) => {
    res.send(req.rootblog)
})

// Get Request: Retrieve codes for perticular Blog
router.get('/getsinglecode', singlecodemiddleware, async (req, res) => {
    res.send(req.rootBlog)
})

// Logging out a user
router.get('/logout', (req, res) => {
    console.log("Logout Page");
    res.clearCookie('jwtoken', { path: "/" })
    res.clearCookie('itemid', { path: "/" })
    res.status(200).send("User Logged out")
})





// All Post Requests: 

// Post Request: Registering a Blog Editors
router.post('/signup-editor', async (req, res) => {
    const { name_editor, phonenumber, email, password } = req.body;
    console.log(req.body)
    // Checking if any field is blank
    if (!name_editor || !phonenumber || !email || !password) {
        console.log("Cannot register as field is/ are blank")
        return res.status(422).json({ error: "None of the fields can be blank" });
    }

    try {
        // Checking if a user with an email already exists
        const userExist = await Blogeditors.findOne({ email: email });
        console.log(userExist)
        if (userExist) {
            return res.status(422).json({ error: "The email Id already exists" });
        }

        // Registering a new editor 
        const user = new Blogeditors(req.body);

        // Checking that registration successful or failed
        try {
            await user.save();

            res.status(201).json({ message: "User registered successfully" });

        } catch (error) {
            res.status(500).json({ error: "Failed to register" });
            console.log(error)
        }
    } catch (error) {
        console.log(error);
    }
});

// Post Request: Making a Blog Editors Login
router.post('/editorsignin', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Checking if any field is blank
        if (!email || !password) {
            console.log("Cannot cannot retrieve data as a field is blank")
            return res.status(422).json({ error: "None of the fields can be blank" });
        }

        // Checking if a user with an email exists
        const editorLogin = await Blogeditors.findOne({ email: email });


        if (editorLogin) {
            const isMatch = await bcrypt.compare(password + "23945", editorLogin.password)

            // Saving a JWT in cookie
            const token = await editorLogin.generateAuthToken();

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                signed: true,
            })
            if (!isMatch) {
                res.status(400).json({ error: "Incorrect credential" })     
            } else {
                res.json({ message: "Login successful              Your JWT: " + token })
            }

        } else {
            res.status(400).json({ error: "Incorrect credential" })
        }

    } catch (error) {
        console.log(error);
    }
});

// Post Request: Add a parent blog
router.post('/addblog', authenticate, async (req, res) => {

    const {bname, bdescription} = req.body;
    // Checking if any field is blank

    if (!bname || !bdescription) {
        console.log("Cannot add data as a field is/are blank")
        return res.status(422).json({ error: "None of the fields can be blank" });
    }
    try {

        // Adding a new admission form
        const Blogs = new Blog({
            bname, bdescription
        });
        // Checking that adding successful or failed
        try {
            await Blogs.save();

            res.status(201).json({ message: "Blog added successfully" });

        } catch (error) {
            res.status(500).json({ error: "Failed to add" });
            console.log(error)
        }
    } catch (error) {
        console.log(error);
    }
})

// Post Request: Add a sub blog
router.post('/addsingleblog', authenticate, async (req, res) => {

    const {bcomponame, bcompodes} = req.body;
    // Checking if any field is blank

    if (!bcomponame || !bcompodes) {
        console.log("Cannot add data as a field is/are blank")
        return res.status(422).json({ error: "None of the fields can be blank" });
    }
    try {

        // Adding a new admission form
        const sBlogs = new SingleBlog({
            bcomponame, bcompodes, bname: req.cookies.blogname
        });
        // Checking that adding successful or failed
        try {
            await sBlogs.save();

            res.status(201).json({ message: "Blog Compoent added successfully" });

        } catch (error) {
            res.status(500).json({ error: "Failed to add Blog Compoent" });
            console.log(error)
        }
    } catch (error) {
        console.log(error);
    }
})

// Post Request: Add codes to a blog
router.post('/addsinglecode', authenticate, async (req, res) => {

    const {bposttitle, bpostbody} = req.body;
    // Checking if any field is blank

    if (!bposttitle || !bpostbody) {
        console.log("Cannot add data as a field is/are blank")
        return res.status(422).json({ error: "None of the fields can be blank" });
    }
    try {

        // Adding a new admission form
        const sBlogs = new Singlecode({
            bposttitle, bpostbody, bname: req.cookies.blogname, bcomponame: req.cookies.bcomponame
        });
        // Checking that adding successful or failed
        try {
            await sBlogs.save();

            res.status(201).json({ message: "Blog Compoent added successfully" });

        } catch (error) {
            res.status(500).json({ error: "Failed to add Blog Compoent" });
            console.log(error)
        }
    } catch (error) {
        console.log(error);
    }
})

// Post Request: Delete a blog
router.post('/delete', authenticate, async (req, res) => {
    // Getting school name
    const blogid = req.cookies.blogid
    const editorid = req.rootUser._id
    const ownerid = JSON.stringify("63f76d9ad74cf32ccdf60d5c")
    const finaleditorid = JSON.stringify(editorid)
    console.log(typeof(finaleditorid))
    console.log(typeof(ownerid))
    console.log(ownerid)
    console.log(finaleditorid)
    console.log(blogid)
    // console.log(shopname._id)

    // Using School name to find admission request in database
    try {
        SingleBlog.countDocuments({_id: blogid}, async function (err, count){ 
            if(count>0){
                const singleblog = await SingleBlog.deleteOne({ _id: blogid })
                res.status(200).json(singleblog, "Sub Blog deleted successfully")
            }else{
                Blog.countDocuments({_id: blogid}, async function (err, count){
                     if(finaleditorid === ownerid){
                        const singleblog = await Blog.deleteOne({ _id: blogid })
                        res.status(200).json(singleblog, "Blog deleted successfully")
                     }else{
                        res.status(400).json("Cannot Delete a parent blog. You need permission for the site owner")
                        console.log("Cannot Delete a parent blog. You need permission for the site owner")
                     }
                    
                })
            }
        }); 
    } catch (error) {
        res.status(417).json({ error: "Failed to retrieve data" });
        console.log(error)
    }
})

// Post Request: Send email to owner
router.post('/sendEmail', async (req, res) => {
    const { cname, cemail, cmessage } = req.body;
    // Checking if any field is blank
    if (!cname || !cemail || !cmessage) {
        console.log("Cannot retrieve data as a field is blank")
        return res.status(422).json({ error: "None of the fields can be blank" });
    }
    try {

        // Adding a new admission form
        const email = new Email({
            cname, cemail, cmessage
        });
        // Checking that adding successful or failed
        try {
            await email.save();

            res.status(201).json({ message: "Message sent successfully" });

        } catch (error) {
            res.status(500).json({ error: "Failed to send message" });
            // console.log(error)
        }
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;