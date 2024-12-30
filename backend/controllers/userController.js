import validator from "validator"
import userModel from '../models/userModel.js'
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
const registerUser = async (req,res) => {
    const {name, email, password} = req.body
    try {  
        //validating all detail info
        if (!name || !email || !password) {
            return res.json({success:false,message:"Detail Missing!"})
        }
        //validating email
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Enter a valid email!"})
        }
        //validating password
        if(password.length < 8) {
            return res.json({success:false,message:"Enter a stronng password!"})
        }
        //hashing password
        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(password,salt)
        const userData = {
            name,
            email,
            password : hashpassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
        res.json({success:true,token})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const loginUser = async (req,res) => {
    try {
        const {email, password} = req.body
        const user = await userModel.findOne({email})
        if(!user) {
            return res.json({success:false,message:'User does not exist'})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(isMatch) {
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            res.json({success:false,message:'Invalid Credentials!'})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export {registerUser,loginUser}