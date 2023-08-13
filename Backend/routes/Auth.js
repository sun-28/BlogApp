const express = require('express');
const User = require('../models/BUser');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const fetchUser = require('../Middleware/fetchUser')

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


  

module.exports = router