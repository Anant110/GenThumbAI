import {Request,Response} from 'express'
import User from '../models/user.js';
import bcrypt from 'bcrypt'

// Controller for user Registration
export const registerUser=async(req:Request,res:Response)=>{
    try {
        // usually when the data is sent in the request body usually in JSON
        // destructing variables from the body
        const {name,email,password}=req.body;

        // find user by email inside the User table use await because this query takes some time to search user
        const user=await User.findOne({email})
        // when user is already present
        if(user){
            return res.status(400).json('User is already created')
        }

        // Encrypt the passoword
        // we never store the plain password inside the database because if database leaks then all the user data is getting hacked
        // It creates the salt->random string it means extra randomness added to password before hashing
        const genSalt=await bcrypt.genSalt(10)
        // It combines password with salt to make hashed password
        const hashedPassword=await bcrypt.hash(password,genSalt)

        // create the schema of the new user, not change in name ,email but changed in password
        const newUser=new User({name,email,password:hashedPassword})
        // save this user inside the mongodb
        await newUser.save()

        // setting user data inside session
        req.session.isLoggedIn=true
        req.session.userId=newUser._id

        // return the response in json
        return res.json({
            // return the message
            message:'Account Created Successfully',
            // getting the user data that is created inside the mongoDB
            user:{
                _id:newUser._id,
                name:newUser.name,
                email:newUser.email
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({message:error})

    }
}


// Controller for user login
export const loginUser=async(req:Request,res:Response)=>{
    try {
        console.log("🔥 LOGIN API HIT");
        // destructure email and password from the body
        const {email,password}=req.body

        // check user is present or not
        const user=await User.findOne({email})
        
        // when user is not present
        if(!user){
            return res.status(400).json({message:'Invalid email or password'})
        }

        // check passoword is right or not using becrypt method
        const isPassowordCorrect=await bcrypt.compare(password,user.password)
        
        // when passowod does not matched
        if(!isPassowordCorrect){
            return res.status(400).json({message:'Invalid email or password'})
        }

        // setting user data in session
        req.session.isLoggedIn=true;
        req.session.userId=user._id

        req.session.save((err)=>{
            if(err){
                console.log("Session save error: ",err);
            
            return res.status(500).json({
                message:"Session save failed"
            })
        }

        // console.log("Login Session ID:", req.sessionID);
        // console.log("Session after login:", req.session);

        return res.json({
            message:'User logged in successfully',
            user:{
                _id:user._id,
                name:user.name,
                email:user.email
            }
        })
    })
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error})
        
    }
}


// Controllers for user logout
export const userLogout=async(req:Request,res:Response)=>{
    req.session.destroy((error:any)=>{
        if(error){
            console.log(error)
            res.status(500).json({message:error})
        }

        return res.json({message:'Logout successfully'})
    })
}

// Controller for verify user
// This controller checks if the user is already logged in (session till date)
export const verifyUser=async(req:Request,res:Response)=>{
    try {
        // fetching userId from the session data
        const {userId}=req.session

        // search user in database by userId
        // It means find by user by userId but no need to take password in the result
        const user=await User.findById(userId).select('-passoword')

        // when user is not there
        if(!user){
            return res.json(400).json({message:'Invalid User'})
        }

        // for consistent api structure use {}
        return res.json({user})
                
    } catch (error) {
        console.log(error)
    }
}

