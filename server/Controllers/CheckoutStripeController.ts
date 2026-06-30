
import {Request, Response} from 'express'
import 'dotenv/config'
import {Stripe} from 'stripe'

if(!process.env.STRIPE_SECRET_KEY){
    throw new Error("Stripe key is missing")
}

const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)


export const CheckoutStripe=async(req:Request,res:Response)=>{
       try {
        const {product}=req.body

        const session=await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:[
                {
                    price_data:{
                        currency:'usd',
                        product_data:{
                            name:product.name
                        },
                        unit_amount:product.price*100
                    },
                    quantity:1
                }
            ],
            mode:"payment",
            success_url:`${process.env.CLIENT_URL}success?session_id={CHECKOUT_SESSION_ID}&test=abc`,
            cancel_url:`${process.env.CLIENT_URL}cancel`,
            client_reference_id:req?.body?._id
        })
        res.json({url:session.url,id:session.id})

    } catch (error) {
        console.log(error)
    }
}