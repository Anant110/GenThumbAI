import {Request, Response} from 'express'
import User from '../models/user.js'
import 'dotenv/config'
import {Stripe} from 'stripe'

if(!process.env.STRIPE_SECRET_KEY){
    throw new Error("Stripe key is missing")
}

const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)

export const productStripe=async(req:Request,res:Response)=>{
        try {
            const {sessionId}=req.body
            const {userId}=req.session
    
            // console.log("*****************",sessionId)
            // retrive the details of the prdouct
            const session=await stripe.checkout.sessions.retrieve(sessionId)
    
            const line_items=await stripe.checkout.sessions.listLineItems(sessionId)
    
            // console.log(session)
            // console.log(line_items)
    
            const item=line_items?.data[0]
    
            // console.log(item)
    
            const user=await User.findByIdAndUpdate(
                userId,
                {
                    isSubscribed:true,
                    product:{
                        name:item?.description,
                        price:(item?.amount_total)/100,
                        purchaseDate:new Date()
                    }
                },
                { returnDocument: "after"}
            )
    
            res.status(200).json({success:true,line_items,user})
    
        } catch (error) {
            console.log(error)
        }
}