import { Request,Response, NextFunction } from "express";

// this is the middleware which runs before the main controller
const protect=async(req:Request,res:Response,next:NextFunction)=>{

    // fetching these two variables from the session data
    const {isLoggedIn,userId}=req.session

    // when anyone of the above two conditions false then user is not logged in
    if(!isLoggedIn || !userId){
        return res.status(401).json({message:'You are not logged in'})
    }

    // It means calling the next function in the chain
    // move to the next step in request flow
    next()
}

export default protect