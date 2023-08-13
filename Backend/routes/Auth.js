const express = require('express');
const User = require('../models/BUser');
const Post = require('../models/Post');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const fetchUser = require('../Middleware/fetchUser')
const multer = require('multer')
const uploadMiddleWare = multer({ dest: 'uploads/' });
const fs = require('fs')

// SignUp Endpoint 
try {
    router.post('/signup', [
        body('name', 'Enter a valid name').isLength({ min: 3 }),
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Enter a valid password').isLength({ min: 6 })
    ], async (req, res) => {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({ success, error: errors.array()[0].msg });
        }
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.json({ success, error: "please enter valid credentials" })
        }
        const salt = await bcrypt.genSalt(10);
        secpass = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secpass,
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken })
    })
} catch (error) {
    console.log(error);
    return res.send({ success, error: "Error occured" })
}


// Login Endpoint
try {
    router.post('/login', [
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password cannot can be blank').isLength({ min: 1 }),
    ], async (req, res) => {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({ success, error: errors.array()[0].msg });
        }
        const { email, password } = req.body
        let user = await User.findOne({ email });
        if (!user) {
            return res.json({ success, error: "Invalid Credentials" })
        }

        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return res.json({ success, error: "Invalid Credentials" })
        }

        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken })

    })
} catch (error) {
    console.log(error);
    return res.send({ success, error: "Error occured" })
}


//set avatar endpoint

router.post('/setavatar',fetchUser,async (req,res) =>{
    try {
        const userId = req.user.id;
        const avatarIMG = req.body.image;
        const user = await User.findByIdAndUpdate(userId,{
            isAvatarSet: true,
            Avatar: avatarIMG
        })
        return res.json({isSet:true,image:avatarIMG})
    } catch (error) {
        res.json({isSet:false})
    }
})



// get user data Endpoint
try {
    router.post('/getuser', fetchUser, async (req, res) => {
        const userId = req.user.id
        const user = await User.findById(userId).select('-password');
        return res.json(user);
    })
} catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error occured" })
}







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
        console.log(Blog)
        res.json({ success: true, Blog });
    } catch (error) {
        return res.json({ success: false, error: "Internal server error" });
    }
});


// get blog by user id

router.get('/blogs', fetchUser , async (req, res) => {
    try {
        const UserId  = req.user.id;
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

// change / reset password

router.put('/changePass', fetchUser, async (req, res) => {
    try {
        const { oldPass, NewPass } = req.body;
        const id = req.user.id;
        const user = await User.findById(id);
        const flag = await bcrypt.compare(oldPass, user.password);
        if (!flag) {
            return res.json({ success: false, error: "Old Password Doesn't Match" })
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const secure = await bcrypt.hash(NewPass, salt)
            const fuser = await User.findByIdAndUpdate(id, {
                password: secure
            })
            return res.json({ success: true });
        }


    } catch (error) {
        return res.json({ success: false, error: "Internal server Error" });
    }
})


// change username

router.put('/changeName', fetchUser, async (req, res) => {
    try {
        const { newName ,pass} = req.body;
        const id = req.user.id;
        const user = await User.findById(id);
        if(await bcrypt.compare(pass,user.password)){
            const fuser = await User.findByIdAndUpdate(id, {
                name: newName
            })
            return res.json({success: true});
        }
        else{
            return res.json({success: false,error:"Wrong Password"})
        }
    }
    catch (error) {
        return res.json({ success: false, error: "Internal server Error" });
    }
})


// like endpoint 

router.put('/isliked/:id', fetchUser, async (req, res) => {
    try {
        const { id } = req.params;
        const  userId  = req.user.id;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);
        let like
        if (isLiked){
            post.likes.delete(userId);
            like =false
        } else {
            post.likes.set(userId, true);
            like = true
        }
        const updatedPost = await Post.findByIdAndUpdate(id,{ 
            likes: post.likes
        });
        return res.json({success:true,like,likes:post.likes.size});
    } catch (err) {
        res.json({success:false,error:err});
    }
})

// likes

router.get('/likes/:id', fetchUser, async (req, res) => {
    try {
        const { id } = req.params;
        const  userId  = req.user.id;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);
        if(isLiked===undefined){
            isLiked = false;
        }
        console.log(isLiked)
        return res.json({success:true,isLiked,likes:post.likes.size});
    } catch (err) {
        res.json({success:false,error:err});
    }
})



// comment endpoint 


router.put('/comment/:id',fetchUser,async(req,res)=>{
    try{
      const id = req.params.id
      const {comment}=req.body;
      const info = await Post.findById(id);
      let comms=info.comments;
      const user = await User.findById(req.user.id);
      comms.push({comment,name:user.name,avatar:user.Avatar});
      const post= await Post.findByIdAndUpdate(id,{comments:comms});
      res.json({success:true});
    } catch (error) {
      res.json({success:false,error:"Internal Server Error"})
    }
  })


  // get all comments

router.get('/getcomments/:id',async(req,res)=>{
    try{
      const id = req.params.id;
      const info = await Post.findById(id);
      let comms=info.comments;
      res.json({success:true,comms});
    } catch (error) {
      res.json({success:false,error:"Internal Server Error"})
    }
  })

  // Delete post 

  router.delete('/deleteblog/:id',fetchUser,async (req,res)=>{
    try {
        const id=req.params.id;
        const info = await Post.findById(id);
        const userID = JSON.stringify(req.user.id);
        const authId = JSON.stringify(info.author);
      if(authId===userID){
        const blog = await Post.findByIdAndDelete(id);
        res.json({success:true});
      }
      else{
        res.json({success:false});
      }
    } catch (error) {
      res.json({success:false,error:"Internal Server Error"})
    }
  })

  

module.exports = router