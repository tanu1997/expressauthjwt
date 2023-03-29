import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'

var checkUserAuth = async(req,res,next)=>
{
    let token
    const {authorization} = req.headers

    if(authorization && authorization.startsWith('Bearer'))
    {
        //Get Token from header
        try{
            token= authorization.split(' ')[1]
            // console.log("Token",token)
            // console.log("Authorization",authorization)
            //Verify Token

            const {userID} = jwt.verify(token,process.env.JWT_SECRET_KEY)
            console.log(userID)

            //Get User from token
            req.user = await UserModel.findById(userID).select('-password')
            console.log(req.user)
            next()
        }
        catch(error)
        {
            console.log(error)
            res.status(401).send({"status":"Failed","message":"Unauthorized User"})
        }
    }
if(!token)
{
    res.status(401).send({"status":"Failed","message":"Unauthorized User, No Token"})
}

}

export default checkUserAuth

