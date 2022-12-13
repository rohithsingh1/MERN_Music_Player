const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require('../models/userModel');
const jwt = require("jsonwebtoken");
const authMiddleWare = require('../middlewares/authMiddleware');


router.post('/register',async (req,res) => {
    try {
        const existingUser=await User.findOne({email: req.body.email})
        if(existingUser) {
            return res.send({
                message: 'User already exists',
                success: false,
                data: existingUser,
                token : null
            })
        } else {
            const hashedPassword=await bcrypt.hash(req.body.password,10)
            req.body.password=hashedPassword
            const newUser=new User(req.body)
            if(req.body.adminAccessCode==='rohithsingh') {
                newUser.isAdmin='true'
                await newUser.save()
                return res.status(200).send({
                    message: 'Admin created successfully',
                    success: true,
                    data: newUser,
                    token : null
                })
            } else {
                await newUser.save()
                res.send({
                    message: 'User created successfully',
                    success: true,
                    data: newUser,
                    token : null
            })   
            }
        }
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null,
            token : null
        })
    }
})

router.post('/login',async (req,res) => {
    try {
        const userExists=await User.findOne({email: req.body.email})
        if(!userExists) {
            return res.send({
                message: 'User does not exist',
                success: false,
                data: null,
                token : null
            })
        }

        if(userExists.isBlocked) {
            return res.status(200).send({
                message: 'Your account is blocked,please contact admin -- rohithsingh@gmail.com',
                success: false,
                data: null,
                token : null,
            })
        }

        const passwordMatch=await bcrypt.compare(req.body.password,userExists.password)
        if(!passwordMatch) {
            return res.send({
                message: "Incorrect email or password",
                success: false,
                data: null,
                token : null
            })
        }
        const jwtToken=jwt.sign({
            name: userExists.name,
            email: userExists.email,
            userId: userExists._id,
            isAdmin: userExists.isAdmin,
            isBlocked: userExists.isBlocked
        },process.env.JWT_KEY,{
            expiresIn : '1d'
        })
        const {_id,email,isAdmin,isBlocked} = userExists
        if(userExists.isAdmin) {
            return res.status(200).send({
                message: "Admin logged in Successfully",
                success: true,
                data: {_id,email,isAdmin,isBlocked},
                token : jwtToken
            })
        } else {
            return res.status(200).send({
                message: 'User logged in Successfully',
                success: true,
                data: {_id, email, isAdmin, isBlocked},
                token : jwtToken
            })
        }
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null,
            token : null
        })
    }
})

router.post('/forgot-password', async (req, res) => {
     try {
        const userExists=await User.findOne({email: req.body.email})
        if(!userExists) {
            return res.send({
                message: 'User does not exist',
                success: false,
                data: null,
                token : null
            })
        }

        if(userExists.isBlocked) {
            return res.status(200).send({
                message: 'Your account is blocked,please contact admin -- rohithsingh.t40@gmail.com',
                success: false,
                data: null,
                token : null,
            })
         }
         
        const hashedPassword=await bcrypt.hash(req.body.password,10)
         req.body.password=hashedPassword
         const updatedUser=await User.findByIdAndUpdate(userExists._id, {
             password : req.body.password
         }, {
             new: true
         })
         const jwtToken=jwt.sign({
            name: updatedUser.name,
            email: updatedUser.email,
            userId: updatedUser._id,
            isAdmin: updatedUser.isAdmin,
            isBlocked: updatedUser.isBlocked
        },process.env.JWT_KEY,{
            expiresIn : '1d'
        })
         const {_id, email, isAdmin, isBlocked}=updatedUser
         return res.status(200).send({
                message: "Password Successfully",
                success: true,
                data: {_id,email,isAdmin,isBlocked},
                token : jwtToken
            })
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null,
            token : null
        })
    }
})


router.post('/get-user-data', authMiddleWare, async (req, res) =>{
    try {
        const user= await User.findById(req.body.userId)
        if(!user){
            return res.send({
                message: 'user not found',
                success: false,
                data: null,
                token : null,
            })
        }
        const {_id,email,name,isAdmin,isBlocked,playlists} = user
            return res.send({
                message: 'user data fetched successfully',
                success: true,
                data: {_id,email,name,isAdmin,isBlocked,playlists},
                token : null
            })
    } catch (error) {
        return res.status(500).send({
            message: error.message,
            success: false,
            data: null,
            token: null
        })
    }
})


module.exports=router

























