import {Request, Response}from 'express';
import Thumbnail from '../models/thumbnail.js';


// controller to get all thumbnails of user
export const getUserThumnails=async(req:Request,res:Response)=>{
    try {
        // getting the userId by the sessions
        const {userId}=req.session
        // getting all the thumbnail of the user be search the usedId and sort means last comes to first
        // find used when many results are there inside the json
        const thumbnails=await Thumbnail.find({userId}).sort({createdAt:-1})

        // return the thumbnail in response
        res.json({thumbnails})

    } catch (error:any) {
        console.log(error)
        res.status(500).json({message:error})
    }
}

// controller to get single thumbnail of the user
export const getSingleThumbnail=async(req:Request,res:Response)=>{
    try {
        // getting userid from the sessions
       const {userId}=req.session;
    //    getting the id from the search url
       const {id}=req.params
    // when you expected only one data then use findOne method
       const thumbnail=await Thumbnail.findOne({userId,_id:id})
       res.json({thumbnail})
    } catch (error:any) {
        console.log(error)
        res.status(500).json({message:error})
        
    }
}