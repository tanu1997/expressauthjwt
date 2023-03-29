import UserModel from '../models/User.js'
import bcrypt, { compare } from  'bcrypt'
import jwt from 'jsonwebtoken'

class UserController
{
    static userRegistration =async(req,res)=>
    {
        const {name,email,password,password_confirmation,tc}= req.body
        const user = await UserModel.findOne({email:email})

        if(user)
        {
            res.send({"status":"failed","message":"Email already exists"})
        }

        else{
            if(name && email && password && password_confirmation && tc)
            {
                if(password === password_confirmation)
                {
                    try{
                        const salt = await bcrypt.genSalt(10)
                        const hashPassword =await bcrypt.hash(password,salt)
                            const doc = new UserModel({
                                name:name,
                                email:email,
                                password:hashPassword,
                                tc:tc
                            })
                            await doc.save()
                            const saved_user =await UserModel.findOne({email:email})
                            //Generate JWT Token

                            const token = jwt.sign({userID:saved_user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'})

                            res.status(201).send({"status":"success","message":"Registered Successfully","token":token})
                    }
                    catch(error)
                    {
                        console.log(error)
                        res.send({"status":"failed","message":"Unable to Register"})
                    }
                }
               
                else
                {
                    res.send({"status":"failed","message":"Password dosen't match"})
                }
            }
            else{
                res.send({"status":"failed","message":"All field are required"})
            }
        }
    }


    static userLogin = async(req,res)=>
    {
        try{
            const {email,password} =req.body
            if(email && password)
            {
                const user = await UserModel.findOne({email:email})
                if(user != null)
                {
                    const isMatch = await bcrypt.compare(password,user.password)

                    if((user.email === email) && isMatch)
                    {
                        //Generate JWT Token
                        const token = jwt.sign({userID: user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'})
                        res.send({"status":"success","message":"Login Successfully","token":token})

                    }
                    else{
                        res.send({"status":"Failed","message":"Email or password is not valid "})
                    }
                }
                else
                {
                    res.send({"status":"Failed","message":"You are not registered user"})
                }
            }
            else
            {
                res.send({"status":"Failed","message":"All Fields are required"})
            }
        }catch(error)
        {
            console.log(error)
            res.send({"status":"Failed","message":"Unable to Login"})
        }
    }

    static changeUserPassword = async(req,res)=>
    {
        const {password,password_confirmation} =req.body
        if(password && password_confirmation)
        {
            if(password !== password_confirmation)
            {
                res.send({"status":"Failed","message":"New Password and Confirm new password doesn't match"})
            }
            else
            {
                const salt = await bcrypt.genSalt(10)
                const newHashPassword = await bcrypt.hash(password,salt)
                // console.log(req.user)
                res.send({"status":"success","message":"Password Changed Successfully"})
            }
        }
        else{
            res.send({"status":"Failed","message":"All Fields are Required"})
        }
        }

}

export default UserController
