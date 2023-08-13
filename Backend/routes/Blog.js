const express = require('express');
const Post = require('../models/Post');
const User = require('../models/BUser');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const fetchUser = require('../Middleware/fetchUser')
const multer = require('multer')
const uploadMiddleWare = multer({ dest: 'uploads/' });
const fs = require('fs')


// post endpoint 

router.post("/post", uploadMiddleWare.single('file'), async (req, res) => {
    try {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        const token = req.body.token;
        const info = jwt.verify(token, JWT_SECRET)
        const { title, summary, content } = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.user.id,
            likes: {},
        });
        res.json({ success: true, postDoc });
    } catch (error) {
        res.json({ success: false, error: "Internal Server Error" })
    }
})

// get blogs

router.get("/getblogs", async (req, res) => {
    try {
        const blogs = await Post.find().populate('author', ['name']).sort({ createdAt: -1 });
        res.json({ success: true, blogs });
    } catch (error) {
        res.json({ success: false, error: "Internal Server Error" })
    }
})

// get blog by id 

router.get('/blog/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const Blog = await Post.findById(id).populate('author', ['name']);
        res.json({ success: true, Blog });
    } catch (error) {
        res.json({ success: false, error: "Internal Server Error" })
    }
})

// updateBlog

router.put('/updateblog', uploadMiddleWare.single('file'), async (req, res) => {
    try {

        let newPath = null;
        if (req.file) {
            const { originalname, path } = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            newPath = path + '.' + ext;
            fs.renameSync(path, newPath);
        }
        const token = req.body.token;
        const info = jwt.verify(token, JWT_SECRET);
        const { id, title, summary, content } = req.body;
        const Blog = await Post.findById(id);
        const isAuthor = JSON.stringify(Blog.author) === JSON.stringify(info.user.id);
        if (!isAuthor) {
            return res.json({ success: false, error: 'You are not the author' });
        }
        await Post.findByIdAndUpdate(id, {
            title,
            summary,
            content,
            cover: newPath ? newPath : Blog.cover,
        });
        res.json({ success: true, Blog });
    } catch (error) {
        return res.json({ success: false, error: "Internal server error" });
    }
});


// get blog by user id

router.get('/blogs', fetchUser, async (req, res) => {
    try {
        const UserId = req.user.id;
        const Blog = await Post.find({ author: UserId });
        res.json({ success: true, Blog });
    } catch (error) {
        res.json({ success: false, error: "Internal Server Error" })
    }
})

// delete blog

router.delete('/blog/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Post.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: "Internal Server Error" })
    }
})


// like endpoint 

router.put('/isliked/:id', fetchUser, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);
        let like
        if (isLiked) {
            post.likes.delete(userId);
            like = false
        } else {
            post.likes.set(userId, true);
            like = true
        }
        const updatedPost = await Post.findByIdAndUpdate(id, {
            likes: post.likes
        });
        return res.json({ success: true, like, likes: post.likes.size });
    } catch (err) {
        res.json({ success: false, error: err });
    }
})

// likes endpoint 

router.get('/likes/:id', fetchUser, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);
        if (isLiked === undefined) {
            isLiked = false;
        }
        return res.json({ success: true, isLiked, likes: post.likes.size });
    } catch (err) {
        res.json({ success: false, error: err });
    }
})



// comment endpoint 


router.put('/comment/:id', fetchUser, async (req, res) => {
    try {
        const id = req.params.id
        const { comment } = req.body;
        const info = await Post.findById(id);
        let comms = info.comments;
        const user = await User.findById(req.user.id);
        comms.push({ comment, name: user.name, avatar: user.Avatar });
        const post = await Post.findByIdAndUpdate(id, { comments: comms });
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: "Internal Server Error" })
    }
})


// get all comments

router.get('/getcomments/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const info = await Post.findById(id);
        let comms = info.comments;
        res.json({ success: true, comms });
    } catch (error) {
        res.json({ success: false, error: "Internal Server Error" })
    }
})

// Delete post 

router.delete('/deleteblog/:id', fetchUser, async (req, res) => {
    try {
        const id = req.params.id;
        const info = await Post.findById(id);
        const userID = JSON.stringify(req.user.id);
        const authId = JSON.stringify(info.author);
        if (authId === userID) {
            const blog = await Post.findByIdAndDelete(id);
            res.json({ success: true });
        }
        else {
            res.json({ success: false });
        }
    } catch (error) {
        res.json({ success: false, error: "Internal Server Error" })
    }
})


module.exports = router