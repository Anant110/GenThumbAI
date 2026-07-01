import "dotenv/config"
import express,{Request,Response} from 'express'
import cors from 'cors'
import connectDB from "./configs/db.js"
import session from "express-session"
import MongoStore from "connect-mongo"
import AuthRouter from "./routes/AuthRoutes.js"
import thumbnailRouter from "./routes/ThumbnailRoutes.js"
import userRouter from "./routes/UserRoutes.js"
import http from 'http'
import {Server} from 'socket.io'
import { upload } from "./configs/upload.js"
import { CompareThumbnail } from "./Controllers/CompareControllers.js"
import { AICoach } from "./Controllers/AICoachControllers.js"
import { CheckoutStripe } from "./Controllers/CheckoutStripeController.js"
import { productStripe } from "./Controllers/ProductStripeControllers.js"


declare module 'express-session'{
    // it means session has two varaibale isLoggedin and userId because typescript not understand what is there inside the sessions
    interface SessionData{
        isLoggedIn:boolean,
        userId:string
    }
}

// app use the express
const app=express()

const server=http.createServer(app)

// mongoDB connection
await connectDB()

// Middleware
// app use cors which helps to connect backend with fronend
// cors is cross origin resource sharing it allows the frontend talk with backend safely

// these cors only for express cors
app.use(cors({
    // It means only these url's are allowed tp make request
    origin:['http://localhost:5173','http://127.0.0.1:5173"','http://localhost:3000','https://gen-thumb-ai-client.vercel.app'],
    // It allows cookies/sessions
    credentials:true
}))

// these cors only for socket.io request
export const io=new Server(server,{
    cors:{
        origin:[
            "http://localhost:5173",
            "http://localhost:3000",
            "https://gen-thumb-ai.vercel.app",
            "https://gen-thumb-ai-client.vercel.app"
        ],
        credentials:true
    }
})

// socket connection
io.on("connection",(socket)=>{
    // console.log(socket)
    // console.log(`Socket connected: ${socket.id}`)

    socket.on("join-thumbnail",(thumbnailId)=>{
        socket.join(thumbnailId)
        // console.log(`Joined room: ${thumbnailId}`)
    })

    socket.on("disconnect",()=>{
        console.log("Socket Disconnected")
    })
})


app.set('trust proxy',1)

// console.log("NODE_ENV =", process.env.NODE_ENV);
// middleware for sessions
// It means enable session and remembers users using cookies
app.use(session({
    secret:process.env.SESSION_SECRET as string,
    // It means don't save session if nothing change
    resave:false,
    // it means don't create session until something is stored
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60*24*7,
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        // secure:false,
        sameSite:process.env.NODE_ENV==='production'?'none':'lax',
        // sameSite:'lax',
        path:'/'
    }, // expire in 7 days
    //store the sessions inside the mongoDB
    store:MongoStore.create({
        // It means which database should i store the sessions data
        mongoUrl:process.env.MONGODB_URI as string,
        // store all sessions data inside the collections
        collectionName:'sessions'
    })
}))

// al the request should be passed using the json method
app.use(express.json())

// fetch port from the env file or default will be 3000
const port=process.env.PORT || 3000

// default url is there
app.get('/',(req:Request,res:Response)=>{
    res.send("Server is Live")
})

// calling the AuthRouter file
app.use('/api/auth',AuthRouter);

// calling the thumbnailRouter file
app.use('/api/thumbnail',thumbnailRouter)

// calling the userRouter
app.use('/api/user',userRouter)

// for compare the two thumbnails
app.post('/compare-thumbnail',upload.array("images",2),CompareThumbnail)

// AI thumbnail coach working controller
app.post('/chat',AICoach)

// stripe payment gateway
app.post('/create-checkout-session',CheckoutStripe)

// retrive the product information
app.post('/order/confirm',productStripe)

// server.listen(port,()=>{
//     console.log(`Server is running at http://localhost:${port}`)
// })

export default server