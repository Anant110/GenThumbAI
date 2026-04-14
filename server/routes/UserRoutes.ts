import express from 'express'
import { getSingleThumbnail, getUserThumnails } from '../Controllers/UserController.js'
import protect from '../middlewares/auth.js'

const userRouter=express.Router()

// use the middleware
userRouter.get('/thumbnails', protect,getUserThumnails)
userRouter.get('/thumbnail/:id',protect,getSingleThumbnail)

export default userRouter